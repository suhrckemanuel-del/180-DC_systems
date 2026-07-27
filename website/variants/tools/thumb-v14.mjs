// One-off: real screenshot thumbnail for V14 → gallery/thumbs/v14-confluence.webp
import { chromium } from "playwright";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pathToFileURL } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "gallery", "thumbs", "v14-confluence.webp");
const url =
  process.argv[2] ||
  pathToFileURL(join(here, "..", "v14-confluence", "index.html")).href;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
const png = await page.screenshot();
await sharp(png).resize(720).webp({ quality: 72 }).toFile(out);
await browser.close();
console.log("v14 thumb written:", out);
