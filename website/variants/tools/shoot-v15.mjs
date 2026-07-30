// V15 screenshots for visual review
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { mkdirSync } from "fs";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");
const out = process.argv[2] || join(here, "shots-v15");
mkdirSync(out, { recursive: true });
const url = (p) => pathToFileURL(join(dir, `${p}.html`)).href;

const browser = await chromium.launch();

const shots = [
  { page: "index", w: 1440, h: 900, name: "index-desktop" },
  { page: "index", w: 1100, h: 800, name: "index-1100" },
  { page: "index", w: 390, h: 780, name: "index-mobile" },
  { page: "for-clients", w: 1440, h: 900, name: "clients-desktop" },
  { page: "mission", w: 1440, h: 900, name: "mission-desktop" },
  { page: "for-students", w: 1440, h: 900, name: "students-desktop" },
  { page: "guide", w: 1440, h: 900, name: "guide-desktop" },
];

for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url(s.page), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(out, `${s.name}.png`) });
  await ctx.close();
}

// mobile menu open
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.click("[data-nav-toggle]");
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(out, "index-menu-open.png") });
  await ctx.close();
}

// search panel open
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.click('[data-panel-open="site-search"]');
  await page.waitForTimeout(500);
  await page.screenshot({ path: join(out, "index-search-open.png") });
  await ctx.close();
}

// scrolled state — blur behaviour past the hero
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, "index-scrolled-500.png") });
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(out, "index-scrolled-1200.png") });
  await ctx.close();
}

await browser.close();
console.log("shots written to", out);
