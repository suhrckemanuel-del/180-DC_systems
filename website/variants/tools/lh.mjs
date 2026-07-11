// Local Lighthouse run against Playwright's Chromium. No API quota.
// Usage: node lh.mjs <url> [url2] ...
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const urls = process.argv.slice(2);
if (urls.length === 0) { console.error("usage: node lh.mjs <url...>"); process.exit(1); }

const chromePath = chromium.executablePath();
const chrome = await launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox"] });
for (const url of urls) {
  const r = await lighthouse(url, {
    port: chrome.port,
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });
  const c = r.lhr.categories;
  const kb = Math.round((r.lhr.audits["total-byte-weight"]?.numericValue ?? 0) / 1024);
  console.log(
    `${url} perf=${Math.round(c.performance.score * 100)} a11y=${Math.round(c.accessibility.score * 100)} bp=${Math.round(c["best-practices"].score * 100)} seo=${Math.round(c.seo.score * 100)} weight=${kb}KB`
  );
}
try { await chrome.kill(); } catch { /* Windows tmp cleanup EPERM — scores already printed */ }
