import keyTokenModel from "../model/keyToken.model.js";

class KeyTokenService {
    static async createKeyToken({
        userId,
        privateKey,
        publicKey,
        refreshToken = null,
        refreshTokenUsed,
    }) {
        // level XXX
        const filter = {
                user: userId,
            },
            update = {
                privateKey,
                publicKey,
                refreshToken,
                refreshTokenUsed,
            },
            options = {
                new: true,
                upsert: true,
            };

        return await keyTokenModel.findOneAndUpdate(filter, update, options);
    }

    static async findByUserIdPrivateKeyPublicKey({ userId }) {
        return await keyTokenModel.findOne({ user: userId });
    }

    static async removeKey({ user }) {
        return await keyTokenModel.deleteOne({ user }).lean();
    }

    static async deleteKeyById({ userId }) {
        return await keyTokenModel.deleteOne({ user: userId }).lean();
    }
}

export default KeyTokenService;
