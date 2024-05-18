import { SuccessReponse } from "../core/success.reponse.js";
import ProductService from "../services/productxxx.service.js";

class ProductController {
    static async createProduct(req, res) {
        return new SuccessReponse({
            message: "Create Product SuccessFully ",
            metaData: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    }

    static async publishProductByShop(req, res) {
        return new SuccessReponse({
            message: "Publish Product SuccessFully",
            metaData: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    static async unPublishProductByShop(req, res) {
        return new SuccessReponse({
            message: "UnPublish Product SuccessFully",
            metaData: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    //QUERY
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} skip
     * @returns {JSON}
     */
    static async getAllDraftsForShop(req, res) {
        return new SuccessReponse({
            message: "Get list Draft SuccessFully",
            metaData: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    static async getAllPublishForShop(req, res) {
        return new SuccessReponse({
            message: "Get list Publish Shop SuccessFully",
            metaData: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            }),
        }).send(res);
    }

    static async getListSearchProduct(req, res) {
        return new SuccessReponse({
            message: "Get list search product SuccessFully",
            metaData: await ProductService.searchProduct({
                keySearch: req.params.keySearch,
            }),
        }).send(res);
    }

    static async findAllProduct(req, res) {
        return new SuccessReponse({
            message: "Find All Product SuccessFully",
            metaData: await ProductService.findAllProduct(req.query),
        }).send(res);
    }

    // End Query
}

export default ProductController;
