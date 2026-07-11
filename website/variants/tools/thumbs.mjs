// Viewport (above-the-fold) screenshots of each variant home → webp thumbs for the gallery.
// Usage: node thumbs.mjs
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "gallery", "thumbs");
mkdirSync(out, { recursive: true });

const variants = [
  "v1-blueprint", "v2-port", "v3-destijl", "v4-terminal", "v5-soft",
  "v6-deck", "v7-polder", "v8-courant", "v9-pamflet", "v10-ledger",
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
for (const v of variants) {
  await page.goto(`http://127.0.0.1:8123/${v}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1600); // let entrance motion finish
  const png = await page.screenshot();
  await sharp(png).resize(720).webp({ quality: 72 }).toFile(join(out, `${v}.webp`));
  console.log(v, "thumb done");
}
await browser.close();
