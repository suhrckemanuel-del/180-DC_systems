// Full-page screenshots of URLs at desktop + mobile widths, for the Critic.
// Usage: node shoot.mjs <outdir> <url1> [url2] ...
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const [outdir, ...urls] = process.argv.slice(2);
if (!outdir || urls.length === 0) { console.error("usage: node shoot.mjs <outdir> <url...>"); process.exit(1); }
mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();
const shots = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
];
for (const url of urls) {
  const slug = url.replace(/https?:\/\//, "").replace(/[^a-z0-9.-]+/gi, "_").replace(/_+$/, "");
  for (const s of shots) {
    const page = await browser.newPage({ viewport: s.viewport });
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    // scroll through the page so IntersectionObserver reveals fire, then return to top
    await page.evaluate(async () => {
      const step = window.innerHeight / 2;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900); // let entrance motion settle
    await page.screenshot({ path: join(outdir, `${slug}--${s.name}.png`), fullPage: true });
    await page.close();
    console.log(`${slug} ${s.name} done`);
  }
}
await browser.close();
