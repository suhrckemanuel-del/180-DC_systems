// Viewport screenshots at a series of scroll offsets — needed for V13, whose
// hero is a sticky scroll-driven stage that a fullPage shot cannot show.
// Usage: node shoot-scroll.mjs <outdir> <url> [offsetsInVh...]   (default 0 35 70 105 150 200)
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const [outdir, url, ...rest] = process.argv.slice(2);
if (!outdir || !url) { console.error("usage: node shoot-scroll.mjs <outdir> <url> [vh...]"); process.exit(1); }
const offsets = (rest.length ? rest.map(Number) : [0, 35, 70, 105, 150, 200]);
mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();
for (const s of [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", viewport: { width: 390, height: 844 } },
]) {
  const page = await browser.newPage({ viewport: s.viewport });
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  // the site sets scroll-behavior: smooth, which would leave every capture
  // mid-flight and misreport the scroll offset
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.waitForTimeout(700);
  for (const vh of offsets) {
    await page.evaluate((v) => window.scrollTo(0, (window.innerHeight * v) / 100), vh);
    await page.waitForTimeout(450);
    // read from body: driver 1 animates the property on body, driver 2 sets it
    // on :root, and body inherits — so body is the one element that sees both
    const p = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue("--ap-p").trim()
    );
    await page.screenshot({ path: join(outdir, `${s.name}-${String(vh).padStart(3, "0")}vh.png`) });
    console.log(`${s.name} ${vh}vh  --ap-p=${p}`);
  }
  await page.close();
}
await browser.close();
