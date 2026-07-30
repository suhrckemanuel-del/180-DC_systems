// V15 Vantage — round 2: interaction polish, smoothness, accessibility.
import { chromium, devices } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");
const PAGES = ["index", "for-clients", "mission", "for-students", "guide"];
const url = (p) => pathToFileURL(join(dir, `${p}.html`)).href;

const fail = [];
const note = (w, m) => { fail.push(`${w}: ${m}`); console.log(`  ✗ ${w}: ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

const browser = await chromium.launch({ args: ["--enable-gpu-rasterization"] });

/* ------------------------------------------------------ scroll smoothness */
console.log("\n=== scroll smoothness (parallax + Ken Burns active) ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Headless frame timing is not a real-vsync proxy, so measure what actually
  // determines smoothness instead: whether scrolling forces layout/style work.
  // A transform-only parallax should produce ~0 Layout events while scrolling.
  const client = await ctx.newCDPSession(page);
  await client.send("Performance.enable");

  const before = Object.fromEntries((await client.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));

  await page.evaluate(async () => {
    // behavior:"instant" is required: the stylesheet sets scroll-behavior:
    // smooth, so a plain scrollTo() every frame restarts a smooth animation
    // each time and the page never actually moves — the loop below used to
    // finish at scrollY 0 while appearing to scroll.
    const start = performance.now();
    while (performance.now() - start < 1600) {
      const p = (performance.now() - start) / 1600;
      window.scrollTo({ top: Math.round(p * 1000), behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(r));
    }
  });

  const after = Object.fromEntries((await client.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  const d = (k) => (after[k] || 0) - (before[k] || 0);

  const layouts = d("LayoutCount");
  const recalcs = d("RecalcStyleCount");
  const layoutMs = d("LayoutDuration") * 1000;
  const styleMs = d("RecalcStyleDuration") * 1000;
  console.log(`  during 1.6s scroll: ${layouts} layouts (${layoutMs.toFixed(1)}ms), ${recalcs} style recalcs (${styleMs.toFixed(1)}ms)`);

  // ~96 frames in 1.6s. The defect this guards against is layout on EVERY
  // frame, which would land near 96. A pinned (position:sticky) stage costs a
  // small fixed number of passes, so the ceiling is set well clear of that
  // while still catching per-frame layout. Total layout time is the sharper
  // signal and is checked separately.
  if (layouts > 35) note("smoothness", `${layouts} layout passes during scroll — likely per-frame layout`);
  if (layoutMs > 40) note("smoothness", `${layoutMs.toFixed(0)}ms in layout during a 1.6s scroll`);

  // Confirm scrolling actually drove the hero. A staged hero moves via the
  // eased --hero-p (dolly) rather than a transform written onto .hero__media,
  // so either signal counts — what must never happen is neither.
  const drove = await page.evaluate(() => {
    const hero = document.querySelector("[data-hero]");
    const media = document.querySelector(".hero__media");
    return {
      staged: hero.classList.contains("hero--stage"),
      mediaTransform: getComputedStyle(media).transform,
      heroP: parseFloat(getComputedStyle(hero).getPropertyValue("--hero-p")) || 0,
    };
  });
  if (drove.staged) {
    if (drove.heroP <= 0.01) note("smoothness", `staged hero did not advance (--hero-p ${drove.heroP})`);
  } else if (drove.mediaTransform === "none") {
    note("smoothness", "parallax transform never applied during scroll");
  }
  await ctx.close();
}
ok("smoothness measured");

/* -------------------------------------------- IntersectionObserver pausing */
console.log("\n=== motion pauses off-screen / hidden tab ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  const inView = await page.evaluate(() => document.querySelector("[data-hero]").classList.contains("is-paused"));
  if (inView) note("pause", "hero paused while in view");

  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(700);
  const out = await page.evaluate(() => ({
    paused: document.querySelector("[data-hero]").classList.contains("is-paused"),
    playState: getComputedStyle(document.querySelector(".hero__img")).animationPlayState,
    willChange: getComputedStyle(document.querySelector(".hero__media")).willChange,
  }));
  if (!out.paused) note("pause", "hero not paused after scrolling out of view");
  if (out.playState !== "paused") note("pause", `Ken Burns play-state is ${out.playState} off-screen`);
  if (out.willChange !== "auto") note("pause", `will-change left as ${out.willChange} off-screen`);
  await ctx.close();
}
ok("pausing checked");

/* -------------------------------------------------- mobile menu contents */
console.log("\n=== mobile menu contents + targets ===");
{
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.click("[data-nav-toggle]");
  await page.waitForTimeout(700);

  const m = await page.evaluate(() => {
    const menu = document.querySelector("[data-mobile-menu]");
    const vis = (el) => el && getComputedStyle(el).display !== "none" && el.getBoundingClientRect().height > 0;
    return {
      links: menu.querySelectorAll("a").length,
      searchVisible: vis(menu.querySelector(".nav-search")),
      profileVisible: vis(menu.querySelector(".nav-profile")),
      toolsOpacity: getComputedStyle(menu.querySelector(".mobile-menu__tools")).opacity,
    };
  });
  if (m.links !== 6) note("menu", `expected 6 links, found ${m.links}`);
  if (!m.searchVisible) note("menu", "Search not repeated in mobile menu (spec requires it)");
  if (!m.profileVisible) note("menu", "Profile not repeated in mobile menu (spec requires it)");
  if (Number(m.toolsOpacity) < 0.9) note("menu", `tools row stuck at opacity ${m.toolsOpacity}`);

  const small = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("header button, .mobile-menu a, .mobile-menu button, .city-switch button").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.height < 44 || r.width < 44) out.push(`${el.className.toString().split(" ")[0] || el.tagName} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    return out;
  });
  if (small.length) note("targets", `under 44px on touch: ${small.join(", ")}`);
  await ctx.close();
}
ok("mobile menu checked");

/* -------------------------------------------------------------- contrast */
console.log("\n=== contrast ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const lum = (r, g, b) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(...a), lum(...b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const parse = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const samples = await page.evaluate(() => {
      const sel = [
        ["body copy", ".section p"],
        ["card copy", ".card p"],
        ["eyebrow", ".eyebrow"],
        ["fact dt", ".fact-list dt"],
        ["footer link", ".footer-links a"],
        ["placeholder", ".placeholder"],
        ["muted", ".form-note, .person p, .timeline-step p"],
      ];
      const out = [];
      for (const [name, s] of sel) {
        const el = document.querySelector(s);
        if (!el) continue;
        let bgEl = el, bg = "rgba(0, 0, 0, 0)";
        while (bgEl && (bg === "rgba(0, 0, 0, 0)" || bg === "transparent")) {
          bg = getComputedStyle(bgEl).backgroundColor;
          bgEl = bgEl.parentElement;
        }
        const cs = getComputedStyle(el);
        out.push({ name, fg: cs.color, bg, size: parseFloat(cs.fontSize), weight: cs.fontWeight });
      }
      return out;
    });
    for (const s of samples) {
      const r = ratio(parse(s.fg), parse(s.bg));
      const large = s.size >= 24 || (s.size >= 18.66 && Number(s.weight) >= 700);
      const need = large ? 3 : 4.5;
      if (r < need) note(`${p} contrast`, `${s.name} ${r.toFixed(2)}:1 (needs ${need}) fg=${s.fg} bg=${s.bg}`);
    }
  }
  await ctx.close();
}
ok("contrast checked");

/* ----------------------------------------------------------------- focus */
console.log("\n=== keyboard focus visibility ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(url("index"), { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  // real Tab traversal — programmatic .focus() does not arm :focus-visible
  const missing = [];
  for (let i = 0; i < 22; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        cls: (el.className.toString().split(" ")[0] || "?"),
        ring: cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0,
        text: (el.textContent || "").trim().slice(0, 20),
      };
    });
    if (r && !r.ring) missing.push(`${r.tag}.${r.cls}("${r.text}")`);
  }
  if (missing.length) note("focus", `no ring while tabbing: ${[...new Set(missing)].slice(0, 6).join(", ")}`);

  // search panel is operable by keyboard
  await page.click('[data-panel-open="site-search"]');
  await page.waitForTimeout(400);
  const focused = await page.evaluate(() => document.activeElement?.id);
  if (focused !== "site-search-input") note("focus", `search panel did not focus its input (got ${focused})`);
  await page.keyboard.type("students");
  await page.waitForTimeout(200);
  const hits = await page.evaluate(() => document.querySelectorAll("[data-search-results] a").length);
  if (hits === 0) note("search", "no results for a term that exists in the index");
  await ctx.close();
}
ok("focus checked");

/* ------------------------------------------------------------- headings */
console.log("\n=== heading order + landmarks ===");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const hs = [...document.querySelectorAll("h1,h2,h3")].map((h) => ({
        lvl: Number(h.tagName[1]),
        text: h.textContent.trim().slice(0, 40),
        hidden: !h.offsetParent && getComputedStyle(h).display === "none",
      })).filter((h) => !h.hidden);
      const jumps = [];
      for (let i = 1; i < hs.length; i++) if (hs[i].lvl - hs[i - 1].lvl > 1) jumps.push(`${hs[i - 1].lvl}->${hs[i].lvl} at "${hs[i].text}"`);
      return {
        h1: hs.filter((h) => h.lvl === 1).length,
        jumps,
        main: document.querySelectorAll("main").length,
        imgNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
      };
    });
    if (r.h1 !== 1) note(p, `${r.h1} visible <h1> (expected 1)`);
    if (r.jumps.length) note(p, `heading level jump: ${r.jumps.join("; ")}`);
    if (r.main !== 1) note(p, `${r.main} <main> landmarks`);
    if (r.imgNoAlt) note(p, `${r.imgNoAlt} img without alt attribute`);
  }
  await ctx.close();
}
ok("headings checked");

await browser.close();
console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("All round-2 checks passed.");
else { console.log(`${fail.length} issue(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
