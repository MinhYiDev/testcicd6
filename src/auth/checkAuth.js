"use strict";
import { FORBIDDEN } from "../core/error.reponse.js";
import ApiKeyService from "../services/apiKey.service.js";
const HEADER = {
    API_KEY: "x-api-key",
};

class CheckAuth {
    static async checkApiKey(req, res, next) {
        const key = req.headers[HEADER.API_KEY];
        if (!key)
            return res.status(403).json({
                code: 403,
                msg: `params ${[HEADER.API_KEY]}`,
            });

        // check apiKey
        const keyStore = await ApiKeyService.findApiKey({ key });
        if (!keyStore) {
            return res.status(403).json({
                code: 403,
                msg: `${HEADER.API_KEY} correct`,
            });
        }

        req.keyStore = keyStore

        return next();
    }

    static checkPremission(pre) {
        if (!pre) throw new FORBIDDEN(403, "Params Pre");
        return (req, res, next) => {
            const checkPre = req.keyStore.premissions;
            if (checkPre != pre)
                return res.status(403).json({
                    code: 403,
                    msg: "Pre correct",
                });

            return next();
        };
    }
}

export default CheckAuth;
