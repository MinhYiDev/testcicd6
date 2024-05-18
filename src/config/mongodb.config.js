import mongoose from "mongoose";
import os from "os";
import process from "process";

const _SECONDS = 5000;

function numConnect() {
    const nConenct = mongoose.connections.length;
    return nConenct;
}

function overLoad() {
    setInterval(() => {
        const numConnect = mongoose.connections.length;
        const numCore = os.cpus().length;

        // example a core is 5 connect
        const maxCore = numCore * 5;

        console.log(`Num Core: ${numCore}`);

        const memoryUsage = process.memoryUsage().rss;

        console.log(
            `Memory Usage : ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`
        );

        if (numConnect > maxCore) {
            console.log("Server overLoad !!!");
        }
    }, _SECONDS);
}

export { numConnect, overLoad };
