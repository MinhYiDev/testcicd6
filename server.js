import process from "process";
import app from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Listen at POPT: http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => {
        console.log(`Shutdown Express !!!`);
    });
});
