// V15 Vantage — hero legibility across the whole image pool.
// For each frame in the pool: hide the hero copy, screenshot the photo, then
// sample the real pixels behind each text element and compute contrast
// against that element's rendered colour. This is the check that catches a
// frame whose luminance breaks white type.
//
// Two things this script learned the hard way, both recorded in the handoff:
//
// 1. A MEAN IS NOT A LEGIBILITY MEASURE. A night skyline of lit windows
//    averages out against the dark gaps between them and scored 8.49:1 while
//    reading badly. Nobody reads the mean of a paragraph's background; they
//    read one word at a time, and a word sitting on a lit window is gone. So
//    every target is now also tiled at roughly glyph scale and the WORST tile
//    is what gates. The mean is still printed, because the gap between the two
//    numbers is exactly the diagnosis: 8.49 mean / 1.9 worst means "busy", not
//    "dark".
//
// 2. IT MUST RUN ON A REAL GPU OVER HTTP. This used to load file:// on default
//    headless, where the WebGL depth layer cannot build textures at all — so it
//    measured the CSS fallback's framing, not the shader's. The shader samples
//    97% of the texture with depth displacement; that is a different crop, and
//    therefore different pixels behind the copy. It now serves the variant and
//    launches ANGLE, so what it measures is what ships.
import { chromium } from "playwright";
import sharp from "sharp";
import http from "http";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");
const PORT = 8734;

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp" };
const server = http.createServer(async (q, r) => {
  let p = join(dir, decodeURIComponent(q.url.split("?")[0]));
  if (q.url === "/" || q.url === "") p = join(dir, "index.html");
  try {
    const d = await readFile(p);
    r.writeHead(200, { "Content-Type": TYPES[extname(p)] || "application/octet-stream" });
    r.end(d);
  } catch { r.writeHead(404); r.end(); }
});
await new Promise((res) => server.listen(PORT, res));
const HTTP = `http://localhost:${PORT}`;

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
  // the photographer credit is small text over the photograph like any other,
  // and it changes per frame — it must be measured on every frame, not assumed
  { sel: "[data-city-credit]", name: "photo credit", large: false },
];

// A tile is sized from the element's own font so the sample matches what a
// reader resolves: roughly one glyph for the lede, a much larger patch for a
// 5rem headline. Clamped so a tiny counter still gets a few tiles and a huge
// headline does not degenerate to a single one.
const tileFor = (fontPx) => Math.max(8, Math.min(40, Math.round(fontPx * 0.8)));

// Worst-tile is deliberately held to a slightly softer bar than the mean. Every
// target carries a text-shadow, which buys real separation on a hard edge but
// cannot be credited as a flat contrast ratio, and one unlucky tile behind a
// descender should not condemn a frame that reads. 0.8 of AA is the line: it
// still fails the Erasmusbrug lede, which is the frame a human called unreadable.
const WORST_FACTOR = 0.8;

const fail = [];
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=default", "--enable-unsafe-swiftshader"],
});

// Read the pool size from the controller rather than hardcoding it, so a frame
// added to the pool is automatically covered by this check instead of silently
// shipping unmeasured.
const POOL_SIZE = (await readFile(join(dir, "hero-controller.js"), "utf8"))
  .match(/file:\s*"/g).length;

// Desktop is not the hard case. A 390px viewport cover-crops a 3:2 photograph
// down to roughly its central quarter, so a frame can be calm behind the copy
// at 1440 and land that same copy on the busiest part of the image on a phone —
// which is exactly what the first replacement Home frame did. The owner's
// selection rules require the composition to survive that crop, so it is
// measured rather than assumed.
const VIEWPORTS = [
  { w: 1440, h: 900, name: "desktop 1440x900" },
  { w: 390, h: 780, name: "mobile 390x780" },
];

for (const vp of VIEWPORTS) {
// NOT reducedMotion:"reduce" — that flag suppresses the WebGL depth layer, so
// the whole suite would silently measure the CSS fallback's framing instead of
// the shader's. It was safe to set only while the hero still had a Ken Burns
// pan to freeze; the hero is now still until you scroll, so there is nothing
// to hold still and every reason to let the real layer mount.
const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
const page = await ctx.newPage();

console.log(`\n=== hero contrast — ${vp.name} — all ${POOL_SIZE} pool frames ===`);

// Confirm the shader is actually up. If this says false the numbers below
// describe the CSS fallback and are not evidence about what ships.
await page.goto(`${HTTP}/index.html`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const webgl = await page.evaluate(() => document.querySelector("[data-hero]").classList.contains("is-webgl"));
console.log(`    depth layer: ${webgl ? "WebGL (measuring the shader)" : "CSS fallback"}`);

for (let frame = 0; frame < POOL_SIZE; frame++) {
  await page.goto(`${HTTP}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  for (let k = 0; k < frame; k++) {
    await page.click("[data-city-next]");
    await page.waitForTimeout(900);
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
        fontPx: parseFloat(cs.fontSize) || 16,
        x: Math.max(0, Math.round(r.x)), y: Math.max(0, Math.round(r.y)),
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return out;
  }, TARGETS);

  // hide the copy and shoot the bare photo
  await page.evaluate(() => { document.querySelector(".hero__inner").style.visibility = "hidden"; });
  await page.waitForTimeout(200);
  const shot = await page.screenshot();
  await page.evaluate(() => { document.querySelector(".hero__inner").style.visibility = ""; });

  const meta = await sharp(shot).metadata();

  const rows = [];
  for (const it of items) {
    const w = Math.min(it.w, meta.width - it.x);
    const h = Math.min(it.h, meta.height - it.y);
    if (w < 2 || h < 2) continue;

    // one raw read per element; tile means are computed here rather than with
    // a sharp call per tile, which was ~40x slower for identical numbers
    const { data, info } = await sharp(shot)
      .extract({ left: it.x, top: it.y, width: w, height: h })
      .raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;

    const [tr, tg, tb] = parseRGB(it.color);
    const textLum = lum(tr, tg, tb);
    const comps = (it.bg.match(/[\d.]+/g) || []).map(Number);
    // rgb(...) has 3 components and is opaque; only rgba(...) carries alpha
    const alpha = comps.length >= 4 ? comps[3] : 1;
    const hasOwnBg = it.ownBg && comps.length >= 3 && alpha > 0;

    // a control paints its own surface over the photo — composite it, exactly
    // as the mean path always did, so the two numbers stay comparable
    const ratioOf = (r, g, b) => {
      let bgLum;
      if (hasOwnBg) {
        const [br, bg_, bb] = comps;
        bgLum = lum(br * alpha + r * (1 - alpha), bg_ * alpha + g * (1 - alpha), bb * alpha + b * (1 - alpha));
      } else {
        bgLum = lum(r, g, b);
      }
      return contrast(textLum, bgLum);
    };

    // whole-box mean
    let sr = 0, sg = 0, sb = 0;
    for (let i = 0; i < data.length; i += ch) { sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; }
    const n = data.length / ch;
    const meanRatio = ratioOf(sr / n, sg / n, sb / n);

    // worst tile at glyph scale
    const t = tileFor(it.fontPx);
    const cols = Math.max(1, Math.floor(w / t));
    const rowsN = Math.max(1, Math.floor(h / t));
    const cw = w / cols, chh = h / rowsN;
    let worstRatio = Infinity, bad = 0, total = 0;
    for (let cy = 0; cy < rowsN; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const x0 = Math.floor(cx * cw), x1 = Math.floor((cx + 1) * cw);
        const y0 = Math.floor(cy * chh), y1 = Math.floor((cy + 1) * chh);
        let ar = 0, ag = 0, ab = 0, c = 0;
        for (let y = y0; y < y1; y++) {
          for (let x = x0; x < x1; x++) {
            const i = (y * w + x) * ch;
            ar += data[i]; ag += data[i + 1]; ab += data[i + 2]; c++;
          }
        }
        if (!c) continue;
        const r = ratioOf(ar / c, ag / c, ab / c);
        total++;
        if (r < worstRatio) worstRatio = r;
        if (r < (it.large ? 3 : 4.5) * WORST_FACTOR) bad++;
      }
    }

    const need = it.large ? 3 : 4.5;
    const needWorst = need * WORST_FACTOR;
    rows.push({
      name: it.name, mean: meanRatio, worst: worstRatio, need, needWorst,
      badPct: total ? (bad / total) * 100 : 0,
      pass: meanRatio >= need && worstRatio >= needWorst,
    });
  }

  const bad = rows.filter((r) => !r.pass);
  const worstRow = rows.reduce((a, b) => (a && a.worst < b.worst ? a : b), null);
  const flag = bad.length ? "✗" : "✓";
  console.log(`  ${flag} ${String(frame + 1).padStart(2)}/${POOL_SIZE}  ${label.padEnd(30)} worst-tile ${worstRow.worst.toFixed(2)}:1 (${worstRow.name})`);
  for (const r of rows) {
    const mark = r.pass ? " " : "✗";
    console.log(
      `      ${mark} ${r.name.padEnd(18)} mean ${r.mean.toFixed(2).padStart(6)}:1` +
      `   worst-tile ${r.worst.toFixed(2).padStart(6)}:1 (needs ${r.needWorst.toFixed(2)})` +
      `   ${r.badPct.toFixed(0)}% of tiles under`
    );
  }
  for (const r of bad) {
    fail.push(
      r.mean < r.need
        ? `[${vp.name}] frame ${frame + 1} "${label}": ${r.name} mean ${r.mean.toFixed(2)}:1 needs ${r.need}`
        : `[${vp.name}] frame ${frame + 1} "${label}": ${r.name} worst-tile ${r.worst.toFixed(2)}:1 needs ${r.needWorst.toFixed(2)} (${r.badPct.toFixed(0)}% of tiles under) — mean ${r.mean.toFixed(2)}:1 hides it`
    );
  }
}

await ctx.close();
}

await browser.close();
server.close();

console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("Hero copy meets AA on every frame in the pool, by mean and by worst tile.");
else { console.log(`${fail.length} failure(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
