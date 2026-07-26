// Detailed accessibility audit: list failing a11y audits with the offending nodes.
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";

const url = process.argv[2] || "https://180dc-variants.pages.dev/v11-lumen/";
const chromePath = chromium.executablePath();
const chrome = await launch({ chromePath, chromeFlags: ["--headless=new", "--no-sandbox"] });
const r = await lighthouse(url, { port: chrome.port, output: "json", onlyCategories: ["accessibility"] });
const audits = r.lhr.categories.accessibility.auditRefs
  .map((a) => r.lhr.audits[a.id])
  .filter((a) => a && a.score !== null && a.score < 1);

console.log("A11y score:", Math.round(r.lhr.categories.accessibility.score * 100));
console.log("Failing audits:", audits.length);
for (const a of audits) {
  console.log("\n• " + a.id + " — " + a.title);
  const items = a.details?.items || [];
  for (const it of items.slice(0, 6)) {
    const sel = it.node?.selector || it.node?.snippet || JSON.stringify(it).slice(0, 120);
    console.log("   → " + String(sel).replace(/\s+/g, " ").slice(0, 140));
  }
}
try { await chrome.kill(); } catch {}
