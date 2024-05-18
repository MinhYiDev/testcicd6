import accessRouter from "./access/access.routes.js";
import productRouter from "./product/product.routes.js";

function routes(app) {
    app.use("/v1/api/shop", accessRouter);
    app.use("/v1/api/product", productRouter);
    app.use("/", accessRouter);
}

export default routes;
