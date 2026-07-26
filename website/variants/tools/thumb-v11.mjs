// One-off: real screenshot thumbnail for V11 → gallery/thumbs/v11-lumen.webp
import { chromium } from "playwright";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "gallery", "thumbs", "v11-lumen.webp");
const url = process.argv[2] || "https://180dc-variants.pages.dev/v11-lumen/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1600); // let entrance motion finish
const png = await page.screenshot();
await sharp(png).resize(720).webp({ quality: 72 }).toFile(out);
await browser.close();
console.log("v11 thumb written:", out);
