// V15 Vantage — round 3: content parity, terminology, honesty, link integrity.
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync, readdirSync } from "fs";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "v15-vantage");

// The controller's POOL is the source of truth for how many frames exist.
// Deriving it here means adding a frame updates this check automatically; the
// assertion that still bites is that every page's rendered counter agrees.
const POOL_SIZE = readFileSync(join(dir, "hero-controller.js"), "utf8")
  .match(/file:\s*"/g).length;
const PAGES = ["index", "for-clients", "mission", "for-students", "guide"];
const url = (p) => pathToFileURL(join(dir, `${p}.html`)).href;

const fail = [];
const note = (w, m) => { fail.push(`${w}: ${m}`); console.log(`  ✗ ${w}: ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

/* ------------------------------------------------------- terminology ---- */
console.log("\n=== terminology (BRAND.md yes/no table) ===");
{
  // "Team Leader" is the deliberate house exception: v14-confluence and the
  // build brief both use it, diverging from BRAND.md's "Project Manager".
  const banned = [
    [/\bpro[- ]bono\b/i, "pro bono"],
    [/\bfree consult/i, "free consulting"],
    [/€\s?0\b/, "€0"],
    [/\bProject Manager\b/, "Project Manager"],
    [/\bchapters?\b/i, "chapter(s)"],
    [/\b180Degrees\b/, "180Degrees (no space)"],
    [/\bstudent consultanc/i, "student consultancy"],
    [/\bvolunteer consult/i, "volunteer consulting"],
    [/\bAssociate Consultant\b/, "Associate Consultant"],
    [/@180degreesconsulting\.org/i, "wrong email domain"],
  ];
  for (const p of PAGES) {
    const html = readFileSync(join(dir, `${p}.html`), "utf8");
    // strip the guide's own quoting of the rule names
    for (const [re, name] of banned) {
      if (re.test(html)) note(p, `banned term present: ${name}`);
    }
  }
}
ok("terminology checked");

/* ---------------------------------------------------- content parity ---- */
console.log("\n=== content parity ===");
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const required = {
    index: ["2019", "first multi-city branch", "TU Delft", "Erasmus", "Consultant", "Team Leader",
            "October–January", "March–June", "Digital Transformation", "Impact Measurement",
            "uniquely affordable"],
    "for-clients": ["Team Leader", "October–January", "March–June", "Digital Transformation",
                    "Impact Measurement", "uniquely affordable", "4–6"],
    mission: ["2019", "first multi-city branch", "TU Delft", "Erasmus", "October–January",
              "March–June", "Team Leader", "uniquely affordable"],
    "for-students": ["Consultant", "Team Leader", "October–January", "March–June",
                     "September", "January/February", "TU Delft", "Erasmus"],
    guide: ["Photographer", "Licence", "2019", "Consultant", "Team Leader", "October–January", "March–June"],
  };

  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    // lowercased: innerText reflects text-transform, so uppercase UI rows
    // would otherwise read as missing
    const text = (await page.evaluate(() => document.body.innerText)).toLowerCase();
    for (const term of required[p]) {
      if (!text.includes(term.toLowerCase())) note(p, `missing required fact/term: "${term}"`);
    }
  }

  // six service areas on the two pages that list them
  for (const p of ["index", "for-clients"]) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    const n = await page.evaluate(() => {
      const names = ["Digital Transformation", "Marketing & Engagement", "Financial Sustainability",
                     "Market Assessment", "Operational Efficiency", "Impact Measurement"];
      const t = document.body.innerText;
      return names.filter((x) => t.includes(x)).length;
    });
    if (n !== 6) note(p, `${n}/6 service areas present`);
  }

  /* ------------------------------------------------ photo credits ------- */
  //
  // This block used to assert the OPPOSITE: that every page disclosed
  // AI-generated backgrounds. The imagery is now licensed photography, so the
  // disclosure would be a false statement and the credit is the thing that
  // must be present. Both directions are checked — a missing credit is an
  // unlicensed publication, and a surviving disclosure is a lie.
  console.log("\n=== photography credits ===");
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const t = document.body.innerText;
      const footer = document.querySelector(".footer-legal")?.innerText || "";
      const credit = document.querySelector("[data-city-credit]")?.textContent || "";
      return {
        footerCredits: /photograph|credit/i.test(footer),
        footerLinks: !!document.querySelector('.footer-legal a[href*="images"], .footer-legal a[href*="guide"]'),
        // the hero names the photographer of the frame on screen
        heroCredit: credit.trim(),
        hasHero: !!document.querySelector("[data-hero]"),
        // No page may CLAIM the imagery is generated. Present tense only: the
        // guide legitimately records that an earlier build used AI renders and
        // why they were replaced, and flagging that would push the page toward
        // hiding its own history, which is the opposite of the point.
        claimsAI: /\b(is|are)\s+AI-generated/i.test(t),
      };
    });
    if (!r.footerCredits) note(p, "footer does not credit the photography");
    if (!r.footerLinks) note(p, "footer credit does not link to the ledger");
    if (r.claimsAI) note(p, "page still claims the backgrounds are AI-generated");
    if (r.hasHero && !r.heroCredit) note(p, "hero shows no photographer credit for the current frame");
  }

  // every pooled frame must carry a credit in the controller
  {
    const js = readFileSync(join(dir, "hero-controller.js"), "utf8");
    const files = [...js.matchAll(/file:\s*"([^"]+)"/g)].length;
    const credits = [...js.matchAll(/credit:\s*"([^"]+)"/g)].map((m) => m[1]);
    if (credits.length !== files) note("pool", `${credits.length} credits for ${files} frames`);
    // The pool is no longer Commons-only, so the licence a credit may name is
    // no longer only a Creative Commons one. Pexels frames carry the Pexels
    // License, which compels no attribution at all — they are credited anyway,
    // and the credit still has to say under what terms the photograph is used.
    for (const c of credits) {
      if (!/(CC0|CC BY|Public domain|Pexels License|Unsplash License)/i.test(c)) {
        note("pool", `credit has no licence: "${c}"`);
      }
    }
  }

  /* ------------------------------------------------ placeholder honesty - */
  console.log("\n=== placeholders present ===");
  // for-clients dropped from 3 to 2 when the demo intake form was removed. That
  // placeholder disclosed a form that did not submit anywhere; there is no form
  // now, so there is nothing left to disclose. Email was always the real route.
  //
  // for-students dropped from 5 to 3 when the member-stories section was cut.
  // Two of those placeholders were reserved testimonial cards. Reserving space
  // for quotes that nobody has offered is not the same promise as reserving
  // space for case studies that exist and await consent, and the owner cut it.
  //
  // index dropped from 5 to 3 when the reserved case tiles were replaced. They
  // reserved space for case studies that now exist on the client page, so
  // leaving them would have been a page promising work it was already showing
  // one click away. Team photos, partners and the member area still reserve.
  const expectPlaceholders = { index: 3, "for-clients": 2, mission: 2, "for-students": 3, guide: 1 };
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    const n = await page.evaluate(() => document.querySelectorAll(".placeholder").length);
    if (n < expectPlaceholders[p]) note(p, `only ${n} visible placeholders, expected >= ${expectPlaceholders[p]}`);
  }

  /* ------------------------------------------------------ link integrity */
  console.log("\n=== link + asset integrity ===");
  for (const p of PAGES) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    const links = await page.evaluate(() =>
      [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"))
    );
    for (const h of links) {
      if (/^(https?:|mailto:|#)/.test(h)) {
        if (h.startsWith("#")) {
          const found = await page.evaluate((id) => !!document.querySelector(id), h);
          if (!found) note(p, `dead in-page anchor ${h}`);
        }
        continue;
      }
      const [file, hash] = h.split("#");
      if (file && !existsSync(join(dir, file))) { note(p, `dead link target ${h}`); continue; }
      if (hash) {
        const target = file || `${p}.html`;
        const html = readFileSync(join(dir, target), "utf8");
        if (!new RegExp(`id="${hash}"`).test(html)) note(p, `dead anchor ${h}`);
      }
    }

    // scroll the whole page first so lazy-loaded footer art is actually fetched
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(600);

    const badImgs = await page.evaluate(() =>
      [...document.querySelectorAll("img")]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.getAttribute("src"))
    );
    if (badImgs.length) note(p, `images failed to load: ${badImgs.join(", ")}`);

    const meta = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      icon: !!document.querySelector('link[rel="icon"]'),
      lang: document.documentElement.lang,
    }));
    if (!meta.title || meta.title.length < 10) note(p, "missing/short <title>");
    if (!meta.desc) note(p, "missing meta description");
    if (!meta.icon) note(p, "missing favicon");
    if (meta.lang !== "en") note(p, `lang="${meta.lang}"`);
  }

  /* ----------------------------------------- pool wiring on every page -- */
  console.log("\n=== image pool wired on every page ===");
  for (const p of PAGES.filter((x) => x !== "guide")) {
    await page.goto(url(p), { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({
      count: document.querySelector("[data-city-count]")?.textContent,
      start: document.querySelector("[data-hero]")?.dataset.heroStart,
    }));
    if (!new RegExp(`/ ${POOL_SIZE}$`).test(r.count || "")) {
      note(p, `counter reads "${r.count}", pool has ${POOL_SIZE} frames`);
    }
  }

  // every pooled image must exist on disk in both widths
  const imgs = readdirSync(join(dir, "img"));
  const js = readFileSync(join(dir, "hero-controller.js"), "utf8");
  const files = [...js.matchAll(/file:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (files.length < 4) note("pool", `POOL shrank to ${files.length} entries`);
  for (const f of files) {
    if (!imgs.includes(`${f}.webp`)) note("pool", `missing img/${f}.webp`);
    if (!imgs.includes(`${f}-sm.webp`)) note("pool", `missing img/${f}-sm.webp`);
  }

  await browser.close();
}

/* ------------------------------------------------ no framework / build -- */
console.log("\n=== zero-dependency check ===");
{
  for (const p of PAGES) {
    const html = readFileSync(join(dir, `${p}.html`), "utf8");
    const externalScripts = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
    for (const s of externalScripts) {
      if (/^https?:|^\/\//.test(s)) note(p, `external script: ${s}`);
    }
    if (/react|tailwind|lucide|jquery|vue|bootstrap/i.test(html)) note(p, "framework reference found");
  }
  const files = readdirSync(dir);
  for (const f of ["package.json", "node_modules", "vite.config.js", "webpack.config.js"]) {
    if (files.includes(f)) note("build", `${f} present — variant must have no build step`);
  }
  const css = readFileSync(join(dir, "styles.css"), "utf8");
  const imports = [...css.matchAll(/@import url\("([^"]+)"\)/g)].map((m) => m[1]);
  console.log(`  external CSS imports: ${imports.length ? imports.join(", ") : "none"}`);
}
ok("zero-dependency checked");

console.log("\n=== SUMMARY ===");
if (!fail.length) console.log("All round-3 checks passed.");
else { console.log(`${fail.length} issue(s):`); fail.forEach((f) => console.log(" - " + f)); }
process.exit(fail.length ? 1 : 0);
