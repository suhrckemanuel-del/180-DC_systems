// V15 Vantage — build audit. Round 1: do the effects actually work?
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");

// Derive the pool from the controller so the cycling arithmetic below follows
// the pool instead of a hardcoded eight. The wrap-around and rapid-click checks
// target positions relative to the end of the pool, not fixed indices.
const POOL = [...readFileSync(join(dir, "hero-controller.js"), "utf8")
  .matchAll(/file:\s*"([^"]+)"/g)].map((m) => m[1]);
const N = POOL.length;
const PAGES = ["index", "for-clients", "mission", "for-students", "guide"];
const url = (p) => pathToFileURL(join(dir, `${p}.html`)).href;

const fail = [];
const note = (page, msg) => { fail.push(`${page}: ${msg}`); console.log(`  ✗ ${page}: ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

const browser = await chromium.launch();

/* ---------------------------------------------- console + effect presence */
console.log("\n=== console errors + effect wiring ===");
for (const p of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(url(p), { waitUntil: "load" });
  await page.waitForTimeout(500);

  if (errs.length) note(p, `console errors: ${errs.join(" | ")}`);

  const r = await page.evaluate(() => {
    const out = {};
    const hero = document.querySelector("[data-hero]");
    out.hasHero = !!hero;
    if (hero) {
      const blur = hero.querySelector(".hero__blur");
      const cs = blur && getComputedStyle(blur);
      out.blurFilter = cs ? (cs.backdropFilter || cs.webkitBackdropFilter) : null;
      out.blurMask = cs ? (cs.maskImage || cs.webkitMaskImage) : null;
      out.layers = hero.querySelectorAll(".hero__img").length;
      const img = hero.querySelector(".hero__img");
      out.kenBurns = img ? getComputedStyle(img).animationName : null;
      out.staged = hero.classList.contains("hero--stage");
      out.dollyTransform = img ? getComputedStyle(img).transform : null;
      out.imgComplete = img ? img.complete && img.naturalWidth > 0 : false;
      out.heroH = hero.offsetHeight;
    }
    const glass = document.querySelector(".liquid-glass");
    if (glass) {
      const b = getComputedStyle(glass, "::before");
      out.glassMaskComposite = b.maskComposite || b.webkitMaskComposite;
      out.glassPadding = b.padding;
      out.glassBackdrop = getComputedStyle(glass).backdropFilter || getComputedStyle(glass).webkitBackdropFilter;
    }
    out.noJsClass = document.documentElement.classList.contains("no-js");
    return out;
  });

  if (r.hasHero) {
    if (!r.blurFilter || r.blurFilter === "none") note(p, "hero blur backdrop-filter missing");
    if (!r.blurMask || r.blurMask === "none") note(p, "hero blur mask-image missing");
    if (r.layers !== 2) note(p, `expected 2 hero img layers, found ${r.layers}`);
    // A staged hero replaces the CSS pan with the scroll dolly by design, so
    // the motion to assert there is the transform driven by --hero-p.
    if (r.staged) {
      if (!r.dollyTransform || r.dollyTransform === "none") {
        note(p, "staged hero has neither pan nor scroll dolly on the image");
      }
    } else if (r.kenBurns !== "kenBurns") {
      note(p, `Ken Burns animation not applied (${r.kenBurns})`);
    }
    if (!r.imgComplete) note(p, "hero image failed to load");
  }
  if (r.noJsClass) note(p, "no-js class was not removed");
  if (r.glassMaskComposite && !/exclude|xor/.test(r.glassMaskComposite)) {
    note(p, `liquid-glass mask-composite wrong: ${r.glassMaskComposite}`);
  }
  await ctx.close();
}
ok("console + effect wiring checked");

/* --------------------------------------------------------- image cycling */
console.log("\n=== image cycling ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "load" });
  await page.waitForTimeout(400);

  const before = await page.evaluate(() => ({
    label: document.querySelector("[data-city-label]").textContent,
    count: document.querySelector("[data-city-count]").textContent,
  }));

  // Wait for the specific expected frame to be the fully-opaque, painted
  // layer. A generic "some layer is at opacity 1" predicate is already true
  // before the swap starts, so it would pass instantly and prove nothing.
  const settledOn = (frag) =>
    page.waitForFunction((f) => {
      const imgs = [...document.querySelectorAll(".hero__img")];
      const vis = imgs.find((i) => getComputedStyle(i).opacity === "1");
      return !!vis && (vis.getAttribute("src") || "").includes(f) &&
             vis.complete && vis.naturalWidth > 0;
    }, frag, { timeout: 6000 });

  await page.click("[data-city-next]");
  await settledOn("golden-hour");

  const after = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll(".hero__img")];
    const visible = imgs.find((i) => getComputedStyle(i).opacity === "1");
    return {
      label: document.querySelector("[data-city-label]").textContent,
      count: document.querySelector("[data-city-count]").textContent,
      visibleSrc: visible ? visible.getAttribute("src") : null,
      visibleAlt: visible ? visible.alt : null,
      visibleComplete: visible ? visible.complete && visible.naturalWidth > 0 : false,
      hiddenAriaHidden: imgs.filter((i) => getComputedStyle(i).opacity !== "1").every((i) => i.getAttribute("aria-hidden") === "true"),
    };
  });

  if (before.label === after.label) note("cycling", "label did not change after next");
  if (after.count !== `2 / ${N}`) note("cycling", `count wrong after one next: ${after.count}`);
  if (!after.visibleSrc?.includes("golden-hour")) note("cycling", `wrong image after next: ${after.visibleSrc}`);
  if (!after.visibleComplete) note("cycling", "swapped-in image not fully decoded/painted");
  if (!after.visibleAlt) note("cycling", "visible layer has empty alt");
  if (!after.hiddenAriaHidden) note("cycling", "hidden layer not aria-hidden");

  // wrap-around backwards from index 0
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click("[data-city-prev]");          // 2/N -> 1/N
  await settledOn("blue-hour");
  await page.click("[data-city-prev]");          // 1/N -> wraps to N/N
  await settledOn(POOL[N - 1]);
  const wrapped = await page.evaluate(() => document.querySelector("[data-city-count]").textContent);
  if (wrapped !== `${N} / ${N}`) note("cycling", `wrap-around wrong: ${wrapped}`);

  // rapid clicking must not desync label from painted image. We are sitting on
  // the last pool entry after the wrap above, so six forward clicks land on
  // index (N-1+6) mod N — computed, not assumed.
  const rapidIdx = (N - 1 + 6) % N;
  for (let i = 0; i < 6; i++) await page.click("[data-city-next]");
  await settledOn(POOL[rapidIdx]);
  const rapid = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll(".hero__img")];
    const visible = imgs.find((i) => getComputedStyle(i).opacity === "1");
    return { count: document.querySelector("[data-city-count]").textContent, src: visible?.getAttribute("src") };
  });
  if (rapid.count !== `${rapidIdx + 1} / ${N}`) {
    note("cycling", `after 6 rapid clicks count=${rapid.count}, expected ${rapidIdx + 1} / ${N}`);
  }
  if (!rapid.src?.includes(POOL[rapidIdx])) {
    note("cycling", `after rapid clicks painted image is ${rapid.src}, expected ${POOL[rapidIdx]}`);
  }
  await ctx.close();
}
ok("cycling checked");

/* ------------------------------------------------- mobile menu / no CLS */
console.log("\n=== mobile menu: layout shift ===");
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 } });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "load" });
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    window.__shifts = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__shifts += e.value;
    }).observe({ type: "layout-shift", buffered: false });
  });

  const box = (sel) => page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width };
  }, sel);

  const heroBefore = await box("h1");
  await page.click("[data-nav-toggle]");
  await page.waitForTimeout(700);

  const menuOpen = await page.evaluate(() => {
    const m = document.querySelector("[data-mobile-menu]");
    return { open: m.classList.contains("is-open"), vis: getComputedStyle(m).visibility, bodyOverflow: document.body.style.overflow };
  });
  const heroAfter = await box("h1");
  const cls = await page.evaluate(() => window.__shifts);

  if (!menuOpen.open) note("menu", "menu did not open");
  if (menuOpen.vis !== "visible") note("menu", `menu visibility ${menuOpen.vis}`);
  if (menuOpen.bodyOverflow !== "hidden") note("menu", "body scroll not locked");
  if (heroBefore && heroAfter && (Math.abs(heroBefore.x - heroAfter.x) > 0.5 || Math.abs(heroBefore.w - heroAfter.w) > 0.5)) {
    note("menu", `layout shifted on open: x ${heroBefore.x}->${heroAfter.x}, w ${heroBefore.w}->${heroAfter.w}`);
  }
  if (cls > 0.01) note("menu", `layout-shift score ${cls.toFixed(4)} on menu open`);

  // escape closes and restores
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const closed = await page.evaluate(() => ({
    open: document.querySelector("[data-mobile-menu]").classList.contains("is-open"),
    overflow: document.body.style.overflow,
    focus: document.activeElement?.getAttribute("data-nav-toggle") !== null,
  }));
  if (closed.open) note("menu", "Escape did not close menu");
  if (closed.overflow === "hidden") note("menu", "scroll lock not released on close");
  if (!closed.focus) note("menu", "focus not returned to toggle");
  await ctx.close();
}
ok("mobile menu checked");

/* ------------------------------------------------------- reduced motion */
console.log("\n=== prefers-reduced-motion ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "load" });
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(400);

  const r = await page.evaluate(() => {
    const img = document.querySelector(".hero__img");
    const media = document.querySelector(".hero__media");
    const h1 = document.querySelector("h1");
    return {
      anim: getComputedStyle(img).animationName,
      imgTransform: getComputedStyle(img).transform,
      mediaTransform: getComputedStyle(media).transform,
      h1Opacity: getComputedStyle(h1).opacity,
      imgVisible: img.complete && img.naturalWidth > 0,
    };
  });
  if (r.anim !== "none") note("reduced-motion", `Ken Burns still running: ${r.anim}`);
  if (r.mediaTransform !== "none") note("reduced-motion", `parallax transform still applied: ${r.mediaTransform}`);
  if (r.h1Opacity !== "1") note("reduced-motion", `entrance animation left h1 at opacity ${r.h1Opacity}`);
  if (!r.imgVisible) note("reduced-motion", "hero image not rendered");
  await ctx.close();
}
ok("reduced motion checked");

/* ------------------------------------------------------ no-JS behaviour */
console.log("\n=== JavaScript disabled ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "load" });
    // the entrance stagger runs to 900ms + 1s duration; wait it out before
    // asserting on final opacity, otherwise we measure mid-animation
    await page.waitForTimeout(2200);
    const img = await page.$(".hero__img");
    if (p !== "guide") {
      if (!img) { note(p + " (no-js)", "hero image element missing"); continue; }
      const shown = await img.evaluate((el) => el.complete && el.naturalWidth > 0 && getComputedStyle(el).opacity === "1");
      if (!shown) note(p + " (no-js)", "hero image not visible without JS");
    }
    const h1 = await page.$("h1");
    if (h1) {
      const vis = await h1.evaluate((el) => getComputedStyle(el).opacity);
      if (vis !== "1") note(p + " (no-js)", `h1 stuck at opacity ${vis} without JS`);
    }
    const switchVisible = await page.evaluate(() => {
      const s = document.querySelector(".city-switch");
      return s ? getComputedStyle(s).display !== "none" : false;
    });
    if (switchVisible) note(p + " (no-js)", "cycling control shown but non-functional without JS");
  }
  await ctx.close();
}
ok("no-JS checked");

/* ---------------------------------------------------- overflow + weight */
console.log("\n=== horizontal overflow + page weight ===");
for (const w of [320, 360, 390, 620, 768, 900, 1024, 1100, 1179, 1180, 1280, 1440, 1920]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "load" });
    await page.waitForTimeout(250);
    const over = await page.evaluate(() => {
      const de = document.documentElement;
      if (de.scrollWidth <= de.clientWidth + 1) return null;
      const bad = [...document.querySelectorAll("body *")]
        .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1)
        .slice(0, 3)
        .map((el) => el.tagName + "." + (el.className || "").toString().split(" ")[0]);
      return { sw: de.scrollWidth, cw: de.clientWidth, bad };
    });
    if (over) note(`${p} @${w}`, `horizontal overflow ${over.sw}>${over.cw} — ${over.bad.join(", ")}`);
  }
  await ctx.close();
}

{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    let bytes = 0;
    const seen = new Set();
    page.on("response", async (res) => {
      const u = res.url();
      if (seen.has(u) || u.startsWith("data:")) return;
      seen.add(u);
      try { bytes += (await res.body()).length; } catch {}
    });
    await page.goto(url(p), { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const kb = bytes / 1024;
    console.log(`  ${kb.toFixed(1).padStart(7)} KB  ${p}.html (initial load)`);
    if (kb > 1024) note(p, `page weight ${kb.toFixed(0)} KB exceeds 1 MB budget`);
    page.removeAllListeners("response");
  }
  await ctx.close();
}

await browser.close();

console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("All checks passed.");
else { console.log(`${fail.length} issue(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
