import express from "express";
import ProductController from "../../controllers/product.controller.js";
import asyncHandller from "../../utils/asyncHandller.js";
import CheckAuth from "../../auth/checkAuth.js";
import AuthUtils from "../../auth/authUtils.js";
const router = express.Router();


// search
router.get("/search/:keySearch",asyncHandller(ProductController.getListSearchProduct))

// middleware
router.use(asyncHandller(CheckAuth.checkApiKey));
router.use(CheckAuth.checkPremission("0000"));

// tokens
router.use(asyncHandller(AuthUtils.handlleRefreshToken));

router.post("/", asyncHandller(ProductController.createProduct));
// update published
router.post(
    "/publish/:id",
    asyncHandller(ProductController.publishProductByShop)
);
router.post(
    "/unpublish/:id",
    asyncHandller(ProductController.unPublishProductByShop)
);

// query
router.get("/drafts/all", asyncHandller(ProductController.getAllDraftsForShop));
router.get(
    "/published/all",
    asyncHandller(ProductController.getAllPublishForShop)
);

export default router;
