// One-off: real screenshot thumbnail for V12 → gallery/thumbs/v12-atlas.webp
import { chromium } from "playwright";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { pathToFileURL } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "gallery", "thumbs", "v12-atlas.webp");
const url = process.argv[2] || pathToFileURL(join(here, "..", "v12-atlas", "index.html")).href;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1600); // let entrance motion / reveals finish
const png = await page.screenshot();
await sharp(png).resize(720).webp({ quality: 72 }).toFile(out);
await browser.close();
console.log("v12 thumb written:", out);
