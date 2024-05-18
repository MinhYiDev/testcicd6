import mongoose from "mongoose";
import { numConnect } from "../config/mongodb.config.js";
import process from "process";
import "dotenv/config";

const strConnect =
    process.env.STRING_CONNECT ||
    "mongodb+srv://phamhongsang12x10:PhamSang1210@cluster0.loq8seh.mongodb.net/ShopDev";

// const DEV = true;

class Database {
    constructor() {
        this.connect();
    }

    async connect() {
        // if (DEV) {
        //     mongoose.set("debug", true);
        //     mongoose.set("debug", { color: true });
        // }
        try {
            await mongoose.connect(strConnect);
            console.log("SUCCESS <3", numConnect());
        } catch (error) {
            console.log("ERROR !!!!");
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }
}

const configDatabase = Database.getInstance();

export default configDatabase;
