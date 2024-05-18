import shopModel from "../model/shop.model.js";

class ShopService {
    static async findByShopEmail({
        email,
        select = {
            email: 1,
            name: 1,
            _id: 1,
            password: 1,
        },
    }) {
        return await shopModel.findOne({ email }).select(select).lean();
    }
}

export default ShopService;
