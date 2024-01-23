import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from 'dotenv';
import { scrapper } from "./scrapper";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());


app.get("/wiki", async (req: Request, res: Response, next: NextFunction) => {
  let filename: string = new Date().getTime().toString();
  let url = req.query.q as string;
  let status = await scrapper(url, filename);
  console.log(status);
  if (status === "Success") {
    let filePath = path.join(__dirname, `../files/${filename}.json`);
    res.setHeader("content-type", "application/json");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("error", (err) => {
      res.status(500).end("Internal server error");
    });

    stream.on("end", () => {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file:", unlinkErr);
        }
      });
    });
  } else {
    res.status(404).json({ error: "invalid url", status: false });
  }
});

app.listen(process.env.PORT || 5000);
