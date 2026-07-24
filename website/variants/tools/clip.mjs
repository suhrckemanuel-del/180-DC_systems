import { chromium } from "playwright";
const [url, outdir, ...sels] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
for (const sel of sels) {
  const el = await page.$(sel);
  if (!el) { console.log("MISS", sel); continue; }
  const name = sel.replace(/[^a-z0-9]+/gi, "_");
  await el.screenshot({ path: `${outdir}/${name}.png` });
  console.log("ok", sel);
}
await browser.close();
