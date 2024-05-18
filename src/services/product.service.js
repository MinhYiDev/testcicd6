import { ErrorReponse } from "../core/error.reponse.js";
import { clothing, electronic, product } from "../model/product.model.js";

class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Electronics":
                return await new Electronics(payload).createProduct();
            case "Clothing":
                return await Clothing.createProduct(payload);
        }
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quanlity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quanlity = product_quanlity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }

    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id,
        });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new ErrorReponse(401, "ERROR create clothing");

        const newProduct = await super.createProduct();

        return newProduct;
    }
}

class Electronics extends Product {
    async createProduct() {
        console.log("Day la this ELECTRONIC: ", this);

        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronic)
            throw new ErrorReponse(401, "ERROR create electronic");

        const newProduct = await super.createProduct(newElectronic._id);

        console.log(
            "🚀 ~ Electronics ~ createProduct ~ newProduct:",
            newProduct
        );

        return newProduct;
    }
}

export default ProductFactory;
