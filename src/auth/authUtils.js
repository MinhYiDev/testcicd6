import jwt from "jsonwebtoken";
import { FORBIDDEN } from "../core/error.reponse.js";
import KeyTokenService from "../services/keyToken.service.js";

const HEADER = {
    CLIENT_ID: "x-client-id",
    REFRESH_TOKEN: "x-rtoken-id",
    AUTHORIZATION: "authorization",
};

class AuthUtils {
    static async createTokenPair({ payload, privateKey, publicKey }) {
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: "2d",
        });

        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: "7d",
        });

        jwt.verify(accessToken, publicKey, (err, decode) => {
            if (err) console.log(err);
            console.log(`Decode :${decode}`);
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    static async handlleRefreshToken(req, res, next) {
        // check userId

        const userId = req.headers[HEADER.CLIENT_ID];

        if (!userId) throw new FORBIDDEN(403, `ERROR ${HEADER.CLIENT_ID}`);

        // verify refreshToken
        const keyStore = await KeyTokenService.findByUserIdPrivateKeyPublicKey({
            userId,
        });
        if (!keyStore) throw new FORBIDDEN(403, `ERROR keyStore`);

        // Handle RefreshToken
        if (req?.headers[HEADER?.REFRESH_TOKEN]) {
            const refreshToken =
                req.headers[HEADER.REFRESH_TOKEN].split(" ")[1];
            const decodeUserId = jwt.verify(refreshToken, keyStore.privateKey);

            if (decodeUserId.userId !== userId) {
                return {
                    code: 304,
                    msg: `err decodeUserId`,
                };
            }

            // cast to headers
            req.keyStore = keyStore;
            req.refreshToken = refreshToken;
            req.user = decodeUserId;

            return next();
        }

        // handle authentication
        if (req?.headers[HEADER?.AUTHORIZATION]) {
            const accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1];

            const decodeUserId = jwt.verify(accessToken, keyStore.publicKey);

            if (decodeUserId.userId != userId)
                throw new FORBIDDEN(403, "DECODE USerId correct");

            req.keyStore = keyStore;
            req.user = decodeUserId;

            return next();
        }

        return {
            code: 403,
            msg: `Params ${HEADER.CLIENT_ID} or ${HEADER.REFRESH_TOKEN} or ${HEADER.AUTHENTICATION}`,
        };
    }
}

export default AuthUtils;
