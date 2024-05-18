import bcrypt, { genSalt } from "bcrypt";
import { ErrorReponse, FORBIDDEN } from "../core/error.reponse.js";
import shopModel from "../model/shop.model.js";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service.js";
import AuthUtils from "../auth/authUtils.js";
import ShopService from "./shop.service.js";

class AccessService {
    // handleRefreshToken
    static async handleRefreshToken({ user, refreshToken, keyStore }) {
        const { userId, email } = user;
        // check
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            //delete token
            await KeyTokenService.deleteKeyById({ userId });

            throw new FORBIDDEN(403, "Pls ReLogin ...");
        }

        // check RT correct
        if (keyStore.refreshToken !== refreshToken) {
            throw new FORBIDDEN(403, "Shop not register 1 !");
        }

        // create tokens new

        const tokens = await AuthUtils.createTokenPair({
            payload: { userId, email },
            privateKey: keyStore.privateKey,
            publicKey: keyStore.publicKey,
        });

        // update tokens new
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },

            $addToSet: {
                refreshTokenUsed: refreshToken,
            },
        });

        return {
            user: { userId, email },
            tokens,
        };
    }
    // logout
    static async logout(user) {
        return await KeyTokenService.removeKey({ user });
    }
    //login
    static async login({ email, password }) {
        // findShop
        const foundShop = await ShopService.findByShopEmail({ email });

        if (!foundShop) throw new ErrorReponse(408, "Please register ... ");

        const matchPassword = await bcrypt.compare(
            password,
            foundShop.password
        );

        if (!matchPassword) throw new ErrorReponse(200, "Password correct");

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const tokens = await AuthUtils.createTokenPair({
            payload: {
                userId: foundShop._id,
                email: foundShop.email,
            },
            privateKey,
            publicKey,
        });

        // save RT
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            privateKey,
            publicKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            data: foundShop,
            tokens,
        };
    }
    // register
    static async register({ name, email, password }) {
        // check nameExist
        const nameExist = await shopModel.exists({ name }).lean();
        // check EmailExist
        const emailExist = await shopModel.exists({ email });

        if (nameExist) throw new ErrorReponse(408, "Name exists");
        if (emailExist) throw new ErrorReponse(408, "EmailExist");

        const salt = await genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newShop = await shopModel.create({
            name,
            email,
            password: hashPassword,
        });

        if (newShop) {
            const publicKey = crypto.randomBytes(64).toString("hex");
            const privateKey = crypto.randomBytes(64).toString("hex");

            // save prK,pbK
            await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey,
            });

            const tokens = await AuthUtils.createTokenPair({
                payload: {
                    userId: newShop._id,
                    email: newShop.email,
                },
                privateKey,
                publicKey,
            });

            return {
                data: newShop,
                tokens,
            };
        }

        return {
            code: 402,
            msg: "Can't Register Shop",
        };
    }
}

export default AccessService;
