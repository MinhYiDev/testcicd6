import { OK, Register } from "../core/success.reponse.js";
import AccessService from "../services/access.service.js";

class AccessController {
    // TODO : handlleRefreshToken
    static async handleRefreshToken(req, res) {
        return new OK({
            message: "Get Tokens Successfully",
            metaData: await AccessService.handleRefreshToken({
                user: req.user,
                refreshToken: req.refreshToken,
                keyStore: req.keyStore,
            }),
        }).send(res);
    }
    // TODO : LOGOUT
    static async logout(req, res) {
        return new OK({
            message: "Logout Successfully",
            metaData: await AccessService.logout(req.keyStore.user),
        }).send(res);
    }
    // TODO : LOGIN
    static async login(req, res) {
        return new OK({
            message: "Login Successfully",
            metaData: await AccessService.login(req.body),
        }).send(res);
    }
    // TODO : Register
    static async register(req, res) {
        return new Register({
            message: "Register Successfully ",
            metaData: await AccessService.register(req.body),
        }).send(res);
    }
}

export default AccessController;
