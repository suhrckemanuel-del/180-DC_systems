// V13 hard requirements: the site must render complete and legible with
// JavaScript disabled, and must not animate under prefers-reduced-motion.
// Usage: node check-degraded.mjs <outdir> <url...>
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const [outdir, ...urls] = process.argv.slice(2);
if (!outdir || !urls.length) { console.error("usage: node check-degraded.mjs <outdir> <url...>"); process.exit(1); }
mkdirSync(outdir, { recursive: true });

const browser = await chromium.launch();

const modes = [
  { name: "nojs", ctx: { javaScriptEnabled: false, viewport: { width: 1440, height: 900 } } },
  { name: "reduced", ctx: { reducedMotion: "reduce", viewport: { width: 1440, height: 900 } } },
];

for (const m of modes) {
  const ctx = await browser.newContext(m.ctx);
  for (const url of urls) {
    const slug = url.split("/").pop().replace(".html", "");
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(600);

    const probe = await page.evaluate(() => {
      const vis = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return { op: +cs.opacity, w: Math.round(r.width), h: Math.round(r.height) };
      };
      // anything that animates in must not be left invisible
      const hidden = [...document.querySelectorAll(".reveal, .tile img, .ap-type, .ap-lede, .pslide")]
        .filter((el) => +getComputedStyle(el).opacity < 0.9).length;
      const running = document.getAnimations
        ? document.getAnimations().filter((a) => a.playState === "running").length
        : -1;
      return {
        h1: document.querySelector("h1") ? document.querySelector("h1").textContent.trim().slice(0, 34) : null,
        apType: vis(document.querySelector(".ap-type")),
        apP: getComputedStyle(document.body).getPropertyValue("--ap-p").trim(),
        trackScrollable: (() => {
          const t = document.querySelector(".panel-track");
          return t ? t.scrollWidth > t.clientWidth || getComputedStyle(t).overflowX === "auto" : null;
        })(),
        controlsShown: !!document.querySelector(".panel-nav") &&
          getComputedStyle(document.querySelector(".panel-nav")).display !== "none",
        hiddenCount: hidden,
        runningAnims: running,
      };
    });
    await page.screenshot({ path: join(outdir, `${slug}--${m.name}.png`), fullPage: true });
    console.log(`[${m.name}] ${slug}`, JSON.stringify(probe));
    await page.close();
  }
  await ctx.close();
}
await browser.close();
