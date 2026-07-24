// Element screenshots at mobile viewport (390px) for targeted spot-checks.
// Usage: node clip-mobile.mjs <url> <outdir> <sel1> [sel2] ...
import { chromium } from "playwright";
const [url, outdir, ...sels] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
for (const sel of sels) {
  const el = await page.$(sel);
  if (!el) { console.log("MISS", sel); continue; }
  const name = sel.replace(/[^a-z0-9]+/gi, "_");
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await el.screenshot({ path: `${outdir}/${name}.png` });
  console.log("ok", sel);
}
await browser.close();
