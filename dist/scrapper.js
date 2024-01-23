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
exports.scrapper = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const organizeData_1 = require("./organizeData");
const scrapper = (url, name) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: "new",
        args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer_1.default.executablePath(),
    });
    const page = yield browser.newPage();
    try {
        yield page.goto(url);
        const data = yield page.evaluate(() => {
            var _a;
            const iterableObject = document.querySelectorAll("#mw-content-text > div.mw-content-ltr.mw-parser-output > *");
            let data = [{}];
            let currHeading = (_a = document.querySelector("#firstHeading")) === null || _a === void 0 ? void 0 : _a.textContent;
            iterableObject.forEach((element) => {
                var _a;
                if (element.tagName === "H2" ||
                    element.tagName === "H3" ||
                    element.tagName === "H1") {
                    currHeading = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.trim();
                }
                else if ((element.tagName === "P" || element.tagName === "LI") &&
                    currHeading) {
                    data.push({
                        heading: currHeading,
                        text: element.textContent ? element.textContent.trim() : "",
                    });
                }
            });
            return data;
        });
        let result = (0, organizeData_1.fixData)(data);
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "../files"))) {
            fs_1.default.mkdirSync(path_1.default.join(__dirname, "../files"), { recursive: true });
        }
        fs_1.default.writeFile(path_1.default.join(__dirname, `../files/${name}.json`), JSON.stringify(result), (err) => {
            if (err)
                console.log(err);
        });
    }
    catch (error) {
        return "Error";
    }
    finally {
        yield browser.close();
    }
    return "Success";
});
exports.scrapper = scrapper;
