// Detect horizontal overflow at mobile width (390px) — the highest-signal,
// zero-guesswork mobile bug check: if scrollWidth > clientWidth, something
// is breaking out of the viewport.
import { chromium } from "playwright";
const urls = process.argv.slice(2);
const browser = await chromium.launch();
let anyFail = false;
for (const url of urls) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  const result = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    // find the widest offending element for diagnosis
    let worst = null, worstW = winW;
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > worstW + 2) { worstW = r.right; worst = el; }
    });
    return {
      docW, winW,
      overflow: docW > winW,
      worstTag: worst ? worst.tagName + (worst.className ? "." + String(worst.className).replace(/\s+/g, ".") : "") : null,
      worstRight: worst ? Math.round(worst.getBoundingClientRect().right) : null,
    };
  });
  await page.close();
  const status = result.overflow ? "OVERFLOW" : "ok";
  if (result.overflow) anyFail = true;
  console.log(`${status.padEnd(9)} ${url}  docW=${result.docW} winW=${result.winW}${result.overflow ? `  worst=${result.worstTag} right=${result.worstRight}` : ""}`);
}
await browser.close();
process.exit(anyFail ? 1 : 0);
