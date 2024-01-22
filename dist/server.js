"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const scrapper_1 = require("./scrapper");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/wiki", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filename = new Date().getTime().toString();
    let url = req.query.q;
    let status = yield (0, scrapper_1.scrapper)(url, filename);
    if (status === "Success") {
        let filePath = path_1.default.join(__dirname, `../files/${filename}.json`);
        res.setHeader("content-type", "application/json");
        const stream = fs_1.default.createReadStream(filePath);
        stream.pipe(res);
        stream.on("error", (err) => {
            res.status(500).end("Internal server error");
        });
        stream.on("end", () => {
            fs_1.default.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting file:", unlinkErr);
                }
            });
        });
    }
    else {
        res.status(404).json({ error: "invalid url", status: false });
    }
}));
app.listen(process.env.PORT || 5000);
