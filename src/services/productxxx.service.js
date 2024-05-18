import {
    clothing,
    electronic,
    furniture,
    product,
} from "../model/product.model.js";

import { ErrorReponse } from "../core/error.reponse.js";
import {
    findAllDraftsForShop,
    findAllProduct,
    // findAllProduct,
    findAllPublishForShop,
    publishedProductByShop,
    searchProductForShop,
    unPublishedProductByShop,
} from "../model/repositories/product.repo.js";

class ProductFactory {
    static productRegistry = {};
    /*
        {
            "Electronics":
        }
    */
    static registerProduct(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = this.productRegistry[type];

        return await new productClass(payload).createProduct();
    }

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishedProductByShop({ product_shop, product_id });
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishedProductByShop({ product_shop, product_id });
    }
    // END PUT

    // query
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftsForShop({ query, limit, skip });
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        console.log(
            "🚀 ~ ProductFactory ~ findAllPublishForShop ~ product_shop:",
            product_shop
        );
        return await findAllPublishForShop({ query, limit, skip });
    }

    static async searchProduct({ keySearch }) {
        return await searchProductForShop({ keySearch });
    }

    //TODO: findAllProduct
    static async findAllProduct({
        limit = 50,
        sort = "ctime",
        page = 1,
        filter = { isPublished: true },
    }) {
        return await findAllProduct({
            limit,
            sort,
            page,
            filter,
            select: ["product_name", "product_thumb", "product_price"],
        });
    }

    // TODO: findProduct
    static async findProduct() {}
}

//  > Define base product (Sản Phẩm) class
class Product {
    constructor({
        product_thumb,
        product_description,
        product_price,
        product_quanlity,
        product_type,
        product_shop,
        product_attributes,
        product_name,
    }) {
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quanlity = product_quanlity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_name = product_name;
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id,
        });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });
        if (!newClothing) throw new ErrorReponse("create new clothing err !!!");

        // Product
        const newProduct = await super.createProduct();
        if (!newProduct) throw new ErrorReponse("create new Product err !!!!");

        return newProduct;
    }
}
// > Define sub class for different product types electronic (điện tử)

class Electronic extends Product {
    async createProduct() {
        console.log(`THIS ${this}`);
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic)
            throw new ErrorReponse("create new clothing err !!!");

        const newProduct = await super.createProduct(newElectronic._id);
        //* Product.createProduct();

        if (!newProduct) throw new ErrorReponse("create new Product err !!!!");

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        //* input :{product_attributes:"Ok"}
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture)
            throw new ErrorReponse("create new clothing err !!!");

        const newProduct = await super.createProduct(newFurniture._id);
        //* Product.createProduct();

        if (!newProduct) throw new ErrorReponse("create new Product err !!!!");

        return newProduct;
    }
}

ProductFactory.registerProduct("Electronics", Electronic);
ProductFactory.registerProduct("Clothing", Clothing);
ProductFactory.registerProduct("Furniture", Furniture);

export default ProductFactory;
