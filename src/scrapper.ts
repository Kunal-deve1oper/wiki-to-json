import puppeteer, { Browser, Page } from "puppeteer";
import fs from "fs";
import path from "path";
import { fixData } from "./organizeData";

export const scrapper = async (url: string, name: string): Promise<string> => {
  const browser: Browser = await puppeteer.launch({
    headless: "new",
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page: Page = await browser.newPage();

  try {
    await page.goto(url);

    const data = await page.evaluate(() => {
      const iterableObject = document.querySelectorAll(
        "#mw-content-text > div.mw-content-ltr.mw-parser-output > *"
      );

      let data = [{}] as [{ text: string; heading: string }];
      let currHeading: string | null | undefined =
        document.querySelector("#firstHeading")?.textContent;

      iterableObject.forEach((element) => {
        if (
          element.tagName === "H2" ||
          element.tagName === "H3" ||
          element.tagName === "H1"
        ) {
          currHeading = element.textContent?.trim();
        } else if (
          (element.tagName === "P" || element.tagName === "LI") &&
          currHeading
        ) {
          data.push({
            heading: currHeading,
            text: element.textContent ? element.textContent.trim() : "",
          });
        }
      });

      return data;
    });

    let result = fixData(data);

    if (!fs.existsSync(path.join(__dirname, "../files"))) {
      fs.mkdirSync(path.join(__dirname, "../files"), { recursive: true });
    }

    fs.writeFile(
      path.join(__dirname, `../files/${name}.json`),
      JSON.stringify(result),
      (err) => {
        if (err) console.log(err);
      }
    );
  } catch (error) {
    return "Error";
  } finally {
    await browser.close();
  }

  return "Success";
};
