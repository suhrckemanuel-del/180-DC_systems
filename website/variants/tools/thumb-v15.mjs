// One-off: real screenshot thumbnail for V15 → gallery/thumbs/v15-vantage.webp
import { chromium } from "playwright";
import sharp from "sharp";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "gallery", "thumbs", "v15-vantage.webp");
const url =
  process.argv[2] ||
  pathToFileURL(join(here, "..", "v15-vantage", "index.html")).href;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  reducedMotion: "reduce", // freezes the Ken Burns so the frame is repeatable
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const png = await page.screenshot();
await sharp(png).resize(720).webp({ quality: 74 }).toFile(out);
await browser.close();
console.log("v15 thumb written:", out);
