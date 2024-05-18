import { Schema, model } from "mongoose";
import slugify from "slugify";
import { createDate, updateDate } from "../utils/getTime.util.js";

const DOCCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productShema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: String,
        product_slug: { type: String },
        product_price: { type: Number, required: true },
        product_quanlity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        // MORE
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be above 5.0"],
            set: (val) => Math.round(val),
        },
        product_variations: { type: Array, default: [] },
        // select là mặc định không lấy giá trị này như findOne
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
        dateCreated: createDate,
        dateUpdated: updateDate,
    },
    {
        collection: COLLECTION_NAME,
    }
);

// create index for search
productShema.index({
    product_name: "text",
    product_description: "text",
});

//Doccument middleware
productShema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    return next();
});

//! define the "product_type = closthing"

const clothingSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, require: true },
        size: String,
        meterial: String,
        dateCreated: createDate,
        dateUpdated: updateDate,
    },
    {
        collection: "clothes",
    }
);

const electronicSchema = new Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        brand: { type: String, require: true },
        size: String,
        meterial: String,
        dateCreated: createDate,
        dateUpdated: updateDate,
    },
    {
        collection: "electronics",
    }
);

const furnitureSchema = new Schema({
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    brand: { type: String, require: true },
    size: String,
    meterial: String,
    dateCreated: createDate,
    dateUpdated: updateDate,
});

const product = model(DOCCUMENT_NAME, productShema);
const electronic = model("Electronics", electronicSchema);
const clothing = model("Closthing", clothingSchema);
const furniture = model("Furniture", furnitureSchema);

export { product, electronic, clothing, furniture };
