"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const destinationPath = path_1.default.join(__dirname, "../test/japanese69.json");
let count = 0;
axios_1.default
    .get("http://localhost:5000/wiki?q=hi", { responseType: "stream" })
    .then((response) => {
    const writeFile = fs_1.default.createWriteStream(destinationPath);
    response.data.pipe(writeFile);
    response.data.on("data", (chunk) => {
        count++;
        console.log(count, " ", chunk.length);
    });
    writeFile.on("finish", () => {
        console.log("Successful :)");
    });
    writeFile.on("error", () => {
        console.log("error occured");
    });
})
    .catch((err) => {
    console.log("error occures now", err);
});
