import express from "express";
const app = express();
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import routes from "./routes/index.routes.js";
import configDatabase from "./database/init.mongodb.js";
// import { overLoad } from "./config/mongodb.config.js";
// middleware

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// database
configDatabase;
// overLoad();

// routes
routes(app);

// handller error
app.use((req, res, next) => {
    const err = new Error("Not Found !");
    err.status = 404;
    next(err);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        code: err.status || 500,
        msg: err.message || "Internal Server",
        // bug: err.stack,
    });
});

export default app;
