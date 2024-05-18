import express from "express";
import AccessController from "../../controllers/access.controller.js";
import asyncHandller from "../../utils/asyncHandller.js";
import CheckAuth from "../../auth/checkAuth.js";
import AuthUtils from "../../auth/authUtils.js";
const router = express.Router();

router.get("", (req, res) => {
    return res.status(403).send("Hello Word ❤️");
});
router.use(CheckAuth.checkApiKey);
router.use(CheckAuth.checkPremission("0000"));
router.post("/register", asyncHandller(AccessController.register));
router.post("/login", asyncHandller(AccessController.login));

router.use(asyncHandller(AuthUtils.handlleRefreshToken));
router.post("/logout", asyncHandller(AccessController.logout));

router.use(
    "/handleRefreshToken",
    asyncHandller(AccessController.handleRefreshToken)
);

export default router;
