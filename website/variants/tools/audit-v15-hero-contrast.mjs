// V15 Vantage — hero legibility across the whole image pool.
// For each frame in the pool: hide the hero copy, screenshot the photo, then
// sample the real pixels behind each text element and compute contrast
// against that element's rendered colour. This is the check that catches a
// frame whose luminance breaks white type.
import { chromium } from "playwright";
import sharp from "sharp";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { readFile } from "fs/promises";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");

const lum = (r, g, b) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (l1, l2) => { const [a, b] = [l1, l2].sort((x, y) => y - x); return (a + 0.05) / (b + 0.05); };
const parseRGB = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

const TARGETS = [
  { sel: ".hero__meta span:not(.dot):not(.tag)", name: "meta text", large: false },
  { sel: ".hero h1", name: "headline", large: true },
  { sel: ".hero__lede", name: "lede", large: false },
  { sel: ".btn--solid", name: "primary CTA", large: false, ownBg: true },
  { sel: ".btn--glass", name: "secondary CTA", large: false, ownBg: true },
  { sel: "[data-city-next]", name: "next-city button", large: false, ownBg: true },
  { sel: ".city-switch__now strong", name: "city label", large: false },
  { sel: "[data-city-count]", name: "city counter", large: false },
];

const fail = [];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();

// Read the pool size from the controller rather than hardcoding it, so a frame
// added to the pool is automatically covered by this check instead of silently
// shipping unmeasured.
const POOL_SIZE = (await readFile(join(dir, "hero-controller.js"), "utf8"))
  .match(/file:\s*"/g).length;

console.log(`\n=== hero contrast across all ${POOL_SIZE} pool frames ===`);

for (let frame = 0; frame < POOL_SIZE; frame++) {
  await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  for (let k = 0; k < frame; k++) {
    await page.click("[data-city-next]");
    await page.waitForTimeout(820);
  }
  await page.mouse.move(20, 20); // clear hover state
  await page.waitForTimeout(250);

  const label = await page.textContent("[data-city-label]");

  // measure boxes + colours with copy visible
  const items = await page.evaluate((targets) => {
    const out = [];
    for (const t of targets) {
      const el = document.querySelector(t.sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(el);
      out.push({
        name: t.name, large: t.large, ownBg: !!t.ownBg,
        color: cs.color,
        bg: cs.backgroundColor,
        x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return out;
  }, TARGETS);

  // hide the copy and shoot the bare photo
  await page.evaluate(() => { document.querySelector(".hero__inner").style.visibility = "hidden"; });
  await page.waitForTimeout(150);
  const shot = await page.screenshot();
  await page.evaluate(() => { document.querySelector(".hero__inner").style.visibility = ""; });

  const img = sharp(shot);
  const meta = await img.metadata();

  const rows = [];
  for (const it of items) {
    const w = Math.min(it.w, meta.width - it.x);
    const h = Math.min(it.h, meta.height - it.y);
    if (w < 2 || h < 2) continue;

    const stats = await sharp(shot).extract({ left: it.x, top: it.y, width: w, height: h }).stats();
    const [r, g, b] = stats.channels.slice(0, 3).map((c) => c.mean);

    let bgLum;
    const comps = (it.bg.match(/[\d.]+/g) || []).map(Number);
    // rgb(...) has 3 components and is opaque; only rgba(...) carries alpha
    const alpha = comps.length >= 4 ? comps[3] : 1;
    if (it.ownBg && comps.length >= 3 && alpha > 0) {
      // control paints its own surface over the photo — composite it
      const [br, bg_, bb] = comps;
      bgLum = lum(
        br * alpha + r * (1 - alpha),
        bg_ * alpha + g * (1 - alpha),
        bb * alpha + b * (1 - alpha)
      );
    } else {
      bgLum = lum(r, g, b);
    }

    const [tr, tg, tb] = parseRGB(it.color);
    const ratio = contrast(lum(tr, tg, tb), bgLum);
    const need = it.large ? 3 : 4.5;
    rows.push({ name: it.name, ratio, need, pass: ratio >= need });
  }

  const bad = rows.filter((r) => !r.pass);
  const worst = rows.reduce((a, b) => (a && a.ratio < b.ratio ? a : b), null);
  const flag = bad.length ? "✗" : "✓";
  console.log(`  ${flag} ${String(frame + 1).padStart(2)}/${POOL_SIZE}  ${label.padEnd(30)} worst ${worst.ratio.toFixed(2)}:1 (${worst.name})`);
  for (const r of bad) {
    const m = `frame ${frame + 1} "${label}": ${r.name} ${r.ratio.toFixed(2)}:1 needs ${r.need}`;
    fail.push(m);
    console.log(`        ${r.name}: ${r.ratio.toFixed(2)}:1 (needs ${r.need})`);
  }
}

await browser.close();

console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("Hero copy meets AA on every frame in the pool.");
else { console.log(`${fail.length} failure(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
