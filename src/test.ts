import axios, { AxiosResponse } from "axios";
import path from "path";
import fs from "fs";

const destinationPath = path.join(__dirname, "../test/japanese69.json");

let count = 0;

axios
  .get<fs.ReadStream>("http://localhost:5000/wiki?q=hi", { responseType: "stream" })
  .then((response: AxiosResponse<fs.ReadStream>) => {
    const writeFile = fs.createWriteStream(destinationPath);

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
  .catch((err: Error) => {
    console.log("error occures now", err);
  });
