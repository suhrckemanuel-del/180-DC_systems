// V15 Vantage — depth hero audit.
// The WebGL layer needs a real origin (file:// images are cross-origin data and
// cannot become textures), so this script serves the variant over HTTP and
// tests both paths: enhanced over HTTP, cleanly degraded over file://.
import { chromium } from "playwright";
import sharp from "sharp";
import http from "http";
import { readFile } from "fs/promises";
import { readdirSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join, extname } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");
const PORT = 8731;

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

const fail = [];
const note = (w, m) => { fail.push(`${w}: ${m}`); console.log(`  ✗ ${w}: ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

// SwiftShader lets this run headless; it is slower than any real GPU, which
// makes it a useful worst case for the layer's own performance guard.
const browser = await chromium.launch({
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

const heroState = (page) => page.evaluate(() => {
  const h = document.querySelector("[data-hero]");
  const cv = h && h.querySelector(".hero__canvas");
  const img = h && h.querySelector(".hero__img");
  // After a swap the crossfade legitimately leaves one layer at opacity 0 and
  // the other at 1, so the invariant is "some layer is painted", not "the
  // first one is". Report the brightest layer.
  const layers = h ? [...h.querySelectorAll(".hero__img")] : [];
  const topOpacity = layers.length
    ? Math.max(...layers.map((el) => parseFloat(getComputedStyle(el).opacity) || 0))
    : null;
  return {
    webgl: !!h && h.classList.contains("is-webgl"),
    canvas: cv ? `${cv.width}x${cv.height}` : null,
    imgOpacity: topOpacity === null ? null : String(topOpacity),
    kenBurns: img ? getComputedStyle(img).animationName : null,
    staged: !!h && h.classList.contains("hero--stage"),
    imgTransform: img ? getComputedStyle(img).transform : null,
    mediaHeight: h ? getComputedStyle(h.querySelector(".hero__media")).height : null,
    heroHeight: h ? h.offsetHeight : 0,
  };
});

// average absolute pixel delta between two screenshots of the same region
const motion = async (page, ms, clip) => {
  const a = await page.screenshot({ clip });
  await page.waitForTimeout(ms);
  const b = await page.screenshot({ clip });
  const [ra, rb] = await Promise.all([
    sharp(a).greyscale().raw().toBuffer(),
    sharp(b).greyscale().raw().toBuffer(),
  ]);
  let sum = 0, moved = 0;
  for (let i = 0; i < ra.length; i++) {
    const d = Math.abs(ra[i] - rb[i]);
    sum += d;
    if (d > 2) moved++;
  }
  return { mean: sum / ra.length, movedPct: (moved / ra.length) * 100 };
};

const CLIP = { x: 0, y: 90, width: 1440, height: 680 };

/* ------------------------------------------------------------ depth maps */
console.log("\n=== depth maps present for every pooled frame ===");
{
  const imgs = readdirSync(join(dir, "img"));
  const js = await readFile(join(dir, "hero-controller.js"), "utf8");
  const files = [...js.matchAll(/file:\s*"([^"]+)"/g)].map((m) => m[1]);
  // The pool is the source of truth for its own size — hardcoding a count here
  // just means this check goes stale the next time a frame is added.
  if (files.length < 8) note("pool", `pool shrank to ${files.length} entries`);
  for (const f of files) {
    if (!imgs.includes(`${f}-depth.webp`)) note("depth", `missing img/${f}-depth.webp`);
    if (!imgs.includes(`${f}-2x.webp`)) note("hidpi", `missing img/${f}-2x.webp`);
  }
  ok(`${files.length} frames, each with a depth map and a 2x tier`);
}

/* ------------------------------------------------- enhanced path (HTTP) */
console.log("\n=== served over HTTP: layer mounts and moves ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
  await page.goto(`${HTTP}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const st = await heroState(page);
  if (!st.webgl) note("http", "depth layer did not mount over HTTP");
  if (st.webgl) {
    if (st.canvas === "300x150") note("http", "canvas left at default size — resize() never ran");
    if (st.imgOpacity !== "0") note("http", `<img> still painted (opacity ${st.imgOpacity})`);
    if (st.kenBurns !== "none") note("http", "CSS Ken Burns still running under the canvas");
    // the overscan must be gone: that is the sharpness win
    if (parseFloat(st.mediaHeight) > st.heroHeight + 1) {
      note("http", `media still oversized (${st.mediaHeight} vs hero ${st.heroHeight}px)`);
    }
  }
  if (errs.length) note("http", `page errors: ${errs.join(" | ")}`);

  // Measure over a short window straight after mount, before the layer has
  // seen enough frames to judge itself.
  const m = await motion(page, 1200, CLIP);
  const after = await heroState(page);
  console.log(`  motion with no input: ${m.movedPct.toFixed(1)}% of pixels, mean delta ${m.mean.toFixed(2)}`);

  if (st.webgl && after.webgl) {
    // layer held: it must genuinely be moving the scene
    if (m.movedPct < 10) note("http", `depth layer up but static (${m.movedPct.toFixed(1)}% pixels moved)`);
  } else if (st.webgl && !after.webgl) {
    // This machine could not hold the frame rate, so the layer stood itself
    // down. That is the guard working — headless runs on SwiftShader, which
    // is far slower than any real GPU. What matters is that it handed back
    // to a working hero rather than leaving a dead canvas.
    console.log("  note: performance guard stood the layer down (expected under software rendering)");
    // The hand-back is a 0.62s opacity transition (.hero__img). The stand-down
    // can land anywhere inside the motion window above, so reading opacity
    // immediately samples a half-finished fade and fails at, say, 0.53. Let it
    // settle before asserting — this check was flaky, not the page.
    const settled = await page.waitForFunction(() => {
      const layers = [...document.querySelectorAll(".hero__img")];
      return layers.some((el) => parseFloat(getComputedStyle(el).opacity) > 0.99);
    }, null, { timeout: 2500 }).then(() => true).catch(() => false);
    if (!settled) note("http", "layer stood down but no <img> layer is painted");
    Object.assign(after, await heroState(page));
    // A staged hero deliberately does NOT resume the pan: styles.css swaps
    // Ken Burns for a scroll-driven dolly on the same --hero-p value
    // (.hero--stage:not(.is-webgl) .hero__img { animation: none }). Asserting
    // kenBurns unconditionally here reported a false failure on every machine
    // slow enough to trip the guard. Check whichever fallback this hero
    // actually uses — the file:// block above already draws the distinction.
    if (after.staged) {
      if (!after.imgTransform || after.imgTransform === "none") {
        note("http", "layer stood down but the staged fallback has no dolly transform");
      }
    } else if (after.kenBurns !== "kenBurns") {
      note("http", "layer stood down but CSS pan did not resume");
    }
  }
  await ctx.close();
  ok("HTTP path checked");
}

/* ------------------------------------------------ reduced motion is still */
console.log("\n=== prefers-reduced-motion: nothing moves ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${HTTP}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const st = await heroState(page);
  if (st.webgl) note("reduced-motion", "depth layer mounted despite reduce preference");
  if (st.imgOpacity !== "1") note("reduced-motion", `hero <img> not visible (opacity ${st.imgOpacity})`);

  const m = await motion(page, 2500, CLIP);
  console.log(`  motion: ${m.movedPct.toFixed(1)}% of pixels`);
  if (m.movedPct > 0.5) note("reduced-motion", `hero still animating (${m.movedPct.toFixed(1)}%)`);
  await ctx.close();
  ok("reduced motion checked");
}

/* ------------------------------------------------- degraded path (file://) */
console.log("\n=== opened as a plain file: degrades, never breaks ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
  await page.goto(pathToFileURL(join(dir, "index.html")).href, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const st = await heroState(page);
  // WebGL textures cannot be built from file:// images; the point is that the
  // page must be indistinguishable from the pre-WebGL build, not that it works
  if (st.webgl && st.canvas === null) note("file", "is-webgl set but no canvas — inconsistent state");
  if (!st.webgl) {
    if (st.imgOpacity !== "1") note("file", `fallback <img> hidden (opacity ${st.imgOpacity}) — hero would be blank`);
    // staged heroes use the scroll dolly instead of the pan; either counts
    if (st.kenBurns !== "kenBurns" && !st.staged) note("file", "fallback CSS pan not running");
    if (st.staged && (!st.imgTransform || st.imgTransform === "none")) {
      note("file", "staged fallback has no dolly transform on the image");
    }
  }
  if (errs.length) note("file", `page errors: ${errs.join(" | ")}`);

  // whatever path it took, the hero must not be a blank rectangle
  const shot = await page.screenshot({ clip: CLIP });
  const stats = await sharp(shot).stats();
  const spread = Math.max(...stats.channels.map((c) => c.max - c.min));
  if (spread < 40) note("file", `hero appears blank (channel spread ${spread})`);
  console.log(`  mounted webgl: ${st.webgl} | fallback img opacity: ${st.imgOpacity} | pan: ${st.kenBurns}`);
  await ctx.close();
  ok("file:// path checked");
}

/* -------------------------------------------------- cycling stays coherent */
console.log("\n=== cycling under the depth layer ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 140)));
  await page.goto(`${HTTP}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const before = await page.screenshot({ clip: CLIP });
  await page.click("[data-city-next]");
  await page.waitForTimeout(2200);
  const after = await page.screenshot({ clip: CLIP });

  const [ra, rb] = await Promise.all([
    sharp(before).greyscale().raw().toBuffer(),
    sharp(after).greyscale().raw().toBuffer(),
  ]);
  let sum = 0;
  for (let i = 0; i < ra.length; i++) sum += Math.abs(ra[i] - rb[i]);
  const delta = sum / ra.length;

  const label = await page.textContent("[data-city-label]");
  const count = await page.textContent("[data-city-count]");
  if (!label.includes("Golden hour")) note("cycle", `label wrong after next: ${label}`);
  if (!/^2 \/ \d+$/.test(count.trim())) note("cycle", `count wrong after next: ${count}`);
  if (delta < 8) note("cycle", `frame did not visibly change (mean delta ${delta.toFixed(1)})`);

  // whether the layer survived or stood down, what is on screen must be right
  const stats = await sharp(after).stats();
  const spread = Math.max(...stats.channels.map((c) => c.max - c.min));
  if (spread < 40) note("cycle", "hero blank after swap");
  const st = await heroState(page);
  // Same trap as the stand-down check above: handing back to the <img> is a
  // 0.62s opacity transition, and the perf guard can fire at any point — so an
  // instantaneous read lands mid-fade and reports a blank hero that the pixel
  // check immediately above just proved is not blank. Let it settle first.
  if (!st.webgl) {
    const painted = await page.waitForFunction(() => {
      const layers = [...document.querySelectorAll(".hero__img")];
      return layers.some((el) => parseFloat(getComputedStyle(el).opacity) > 0.99);
    }, null, { timeout: 2500 }).then(() => true).catch(() => false);
    if (!painted) note("cycle", "layer stood down but <img> left hidden — blank hero");
  }
  if (errs.length) note("cycle", `page errors: ${errs.join(" | ")}`);

  console.log(`  after next: ${label.trim()} | ${count.trim()} | delta ${delta.toFixed(1)} | webgl still up: ${st.webgl}`);
  await ctx.close();
  ok("cycling checked");
}

await browser.close();
server.close();

console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("Depth hero: all checks passed.");
else { console.log(`${fail.length} issue(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
