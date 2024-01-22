"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixData = void 0;
const fixData = (parsedData) => {
    const updatedData = [];
    parsedData.map((e) => {
        if (Object.keys(e).length > 0) {
            let ind = updatedData.findIndex((element) => element.heading === e.heading.replace(/\[[^\]]*\]/g, ""));
            if (ind == -1) {
                updatedData.push({
                    heading: e.heading.replace(/\[[^\]]*\]/g, ""),
                    text: e.text.replace(/\n\s*/g, " ").replace(/\[[^\]]*\]/g, ""),
                });
            }
            else {
                updatedData[ind].text =
                    updatedData[ind].text +
                        e.text.replace(/\n\s*/g, " ").replace(/\[[^\]]*\]/g, "");
            }
        }
    });
    return updatedData;
};
exports.fixData = fixData;
