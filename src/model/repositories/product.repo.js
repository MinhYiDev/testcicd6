"use strict";
import arrToObject from "../../utils/arrayToObject.js";
import { product } from "../product.model.js";

async function searchProductForShop({ keySearch }) {
    const regMatch = new RegExp(keySearch);
    console.log(regMatch);
    const results = await product
        .find(
            {
                isPublished: true,
                $text: {
                    $search: regMatch,
                },
            },
            {
                score: { $meta: "textScore" },
            }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean();

    return results;
}

async function findAllDraftsForShop({ query, limit, skip }) {
    return await queryProduct({ query, limit, skip });
}
async function findAllPublishForShop({ query, limit, skip }) {
    return await queryProduct({ query, limit, skip });
}

async function publishedProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({ product_shop, _id: product_id });

    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

async function unPublishedProductByShop({ product_shop, product_id }) {
    const foundShop = await product.findOne({ product_shop, _id: product_id });

    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;

    const { modifiedCount } = await foundShop.updateOne(foundShop);

    return modifiedCount;
}

async function findAllProduct({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort == "ctime " ? { _id: -1 } : { id: 1 };
    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(arrToObject(select))
        .lean();

    return products;
}

// Common
async function queryProduct({ query, limit, skip }) {
    return await product
        .find(query)
        .populate("product_shop", "name email -_id")
        .skip(skip)
        .limit(limit)
        .sort({ dateUpdated: -1 })
        .lean()
        .exec();
}

export {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishedProductByShop,
    unPublishedProductByShop,
    // search
    searchProductForShop,
    // find
    findAllProduct,
};
