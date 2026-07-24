// Automated eval for the V2/V3/V7 rebrand pass.
// Checks functionality (anchors, CTA, assets), brand correctness (green, logo, favicon),
// terminology compliance, and the honesty-rule placeholder register.
// Usage: node eval-v2v3v7.mjs         (from tools/)
// Subjective checks (mobile layout, cleanness, AI-slop) are a separate screenshot review — see EVAL-RUBRIC.md.
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const variants = ["v2-port", "v3-destijl", "v7-polder"];

let failures = 0, warnings = 0;
const log = (v, level, msg) => {
  if (level === "FAIL") failures++;
  if (level === "WARN") warnings++;
  const tag = level === "PASS" ? "  ok " : level === "WARN" ? " warn" : "FAIL ";
  console.log(`[${v}] ${tag} ${msg}`);
};

// invented pine-green values that must be gone
const BAD_GREENS = ["#00693C", "#00502D", "#00512E", "#0A5B34", "#0E7A44", "#006B3C", "#013D22", "#064A2C", "#123A2A", "#00693c"];
const BAD_GREENS_URLENC = ["%2300693C", "%2300512E", "%2300502D"];

for (const v of variants) {
  const dir = join(root, v);
  const idxP = join(dir, "index.html");
  const fcP = join(dir, "for-clients.html");
  const cssP = join(dir, "styles.css");
  if (!existsSync(idxP)) { log(v, "FAIL", "index.html missing"); continue; }
  const idx = readFileSync(idxP, "utf8");
  const fc = existsSync(fcP) ? readFileSync(fcP, "utf8") : "";
  const css = existsSync(cssP) ? readFileSync(cssP, "utf8") : "";
  const html = idx + "\n" + fc;
  // strip CSS /* comments */ before scanning for live color values — historical
  // hex mentions in comments (documenting what changed FROM) are expected and fine.
  const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const all = html + "\n" + cssNoComments;

  // ---- Terminology (hard fails) ----
  for (const [re, label] of [
    [/pro[\s-]?bono/i, "'pro bono'"],
    [/€\s?0(?!\d)/, "'€0'"],
    [/\bat no cost\b/i, "'at no cost'"],
    [/\bno cost\b/i, "'no cost'"],
    [/\bteam lead(er)?\b/i, "'team lead(er)'"],
    [/\bVice President\b/, "'Vice President' (should be Branch Vice-President)"],
  ]) {
    if (re.test(html)) log(v, "FAIL", `terminology: ${label} still present in HTML`);
    else log(v, "PASS", `terminology clear of ${label}`);
  }
  // 'free' and bare 'President' are context-sensitive -> warn for manual check
  if (/\bfree\b/i.test(html)) log(v, "WARN", "'free' appears — verify it's not a cost claim");
  if (/>President</.test(html) || /\bPresident\b(?!<\/)/.test(html) && !/Branch President/.test(html)) {
    if (/>President</.test(html)) log(v, "FAIL", "bare '>President<' — should be 'Branch President'");
  }
  if (/Branch President/.test(html)) log(v, "PASS", "'Branch President' present");
  else log(v, "WARN", "'Branch President' not found — check board roster");
  if (/Branch Vice-?President/.test(html)) log(v, "PASS", "'Branch Vice-President' present");
  else log(v, "WARN", "'Branch Vice-President' not found — check board roster");
  if (/Project Manager/.test(html)) log(v, "PASS", "'Project Manager' present");
  else log(v, "WARN", "'Project Manager' not found — check timeline/roles");
  if (/uniquely affordable|low-cost|very affordable|affordable/i.test(html)) log(v, "PASS", "approved cost language present");
  else log(v, "FAIL", "no approved cost language (affordable/low-cost) found");

  // ---- Brand green ----
  const badFound = [...BAD_GREENS, ...BAD_GREENS_URLENC].filter((g) => all.includes(g));
  if (badFound.length) log(v, "FAIL", `invented green(s) still present: ${badFound.join(", ")}`);
  else log(v, "PASS", "no invented pine-green values remain");
  if (/#78B038/i.test(css)) log(v, "PASS", "brand green #78B038 in CSS");
  else log(v, "FAIL", "brand green #78B038 missing from CSS");
  if (/#4A7322/i.test(css)) log(v, "PASS", "AA green #4A7322 in CSS");
  else log(v, "WARN", "#4A7322 (AA green for text) not found — check link/text contrast");

  // ---- Logo + favicon ----
  if (/img\/180dc-globe\.webp/.test(idx)) log(v, "PASS", "globe mark referenced in index");
  else log(v, "FAIL", "globe mark (img/180dc-globe.webp) not referenced in index");
  if (/180dc-lockup-(branch|white)\.webp/.test(html)) log(v, "PASS", "a full lockup is used");
  else log(v, "WARN", "no full lockup (branch/white) used anywhere");
  if (/D9531F/i.test(idx + fc)) log(v, "FAIL", "orange favicon (#D9531F) still present");
  else log(v, "PASS", "no orange favicon");
  if (/rel="icon"[^>]*%2378B038/i.test(idx)) log(v, "PASS", "favicon uses brand green");
  else log(v, "WARN", "favicon may not be brand green — verify data-URI");

  // ---- IA / sections (index) ----
  const idHas = (name) => new RegExp(`id="${name}"`).test(idx);
  if (idHas("mission")) log(v, "PASS", "Mission section present"); else log(v, "FAIL", "no id=\"mission\" section");
  if (idHas("work") || idHas("portfolio") || idHas("our-work") || /id="[^"]*work[^"]*"/.test(idx)) log(v, "PASS", "Our Work section present");
  else log(v, "FAIL", "no Our Work / Portfolio section id");
  for (const s of ["join", "team", "partners"]) {
    if (idHas(s)) log(v, "PASS", `#${s} section present`); else log(v, "WARN", `no id="${s}" on index`);
  }

  // ---- Primary CTA lands on the form ----
  if (/for-clients\.html#intake/.test(idx)) log(v, "PASS", "primary CTA -> for-clients.html#intake");
  else log(v, "FAIL", "hero CTA does not target for-clients.html#intake");
  if (/id="intake"/.test(fc)) log(v, "PASS", "#intake anchor exists on for-clients");
  else log(v, "FAIL", "for-clients has no id=\"intake\"");

  // ---- Consulting cycles + welcome + expansion ----
  if (/October.?[–-].?January/i.test(fc) && /March.?[–-].?June/i.test(fc)) log(v, "PASS", "both consulting cycles stated");
  else log(v, "FAIL", "consulting cycles (Oct–Jan / Mar–Jun) not both stated on for-clients");
  if (/8[–-]10\s*w|10[–-]12\s*week/i.test(fc)) log(v, "WARN", "generic week-count framing still present on for-clients");
  else log(v, "PASS", "no generic 8–10/10–12 week framing on for-clients");

  // ---- Recruitment windows ----
  if (/September/i.test(idx) && /January\/February|January and February|Jan\/Feb/i.test(idx)) log(v, "PASS", "both recruitment windows stated");
  else log(v, "WARN", "recruitment windows (Sept / Jan–Feb) not both clearly stated");

  // ---- Placeholder register (honesty rules) ----
  const ph = [
    [/case stud/i, "case study"],
    [/Monday/i, "roster/Monday"],
    [/recruitment portal|recruitment[- ]?season/i, "recruitment portal"],
    [/events? (calendar|coming|—)/i, "events"],
    [/testimonial/i, "testimonial"],
    [/partner logos|partner crests/i, "partner logos"],
    [/impact numbers/i, "impact numbers"],
    [/form UI only|not yet wired|not wired/i, "form-only"],
  ];
  for (const [re, label] of ph) {
    if (re.test(html)) log(v, "PASS", `placeholder present: ${label}`);
    else log(v, "WARN", `placeholder possibly missing: ${label}`);
  }

  // ---- Broken same-page anchors ----
  const anchors = [...idx.matchAll(/href="#([a-z0-9-]+)"/gi)].map((m) => m[1]);
  for (const a of new Set(anchors)) {
    if (a === "main") continue;
    if (!new RegExp(`id="${a}"`).test(idx)) log(v, "FAIL", `broken in-page anchor #${a} (no matching id)`);
  }

  // ---- Basic a11y: imgs need alt ----
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  const noAlt = imgs.filter((m) => !/\balt=/.test(m[0]));
  if (noAlt.length) log(v, "WARN", `${noAlt.length} <img> without alt`);
  else if (imgs.length) log(v, "PASS", "all <img> have alt");
}

console.log(`\n=== ${failures} FAIL, ${warnings} WARN ===`);
process.exit(failures ? 1 : 0);
