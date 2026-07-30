// V15 Vantage — compress the AI-generated Rotterdam/Delft hero set to WebP.
// Sources are the two generated PNG sets in _brand/ (1536x1024 each). They are
// NOT photography; provenance + prompts are disclosed in v15-vantage/guide.html.
// Two widths per image: full (1600) for desktop heroes, sm (900) for phones.
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, "..", "_brand");
const out = join(here, "..", "v15-vantage", "img");
mkdirSync(out, { recursive: true });

// Sources are the 2K regeneration in _brand/hero-set-2k (see regen-v15.mjs).
// The original 1536 sets stay in _brand/ as the provenance record. The point of
// the regeneration is that the 2400px tier below now carries real detail rather
// than a lanczos upscale of 1536.
const src2k = join(brand, "hero-set-2k");

// Cycling order is the narrative order: Rotterdam dusk -> night -> Delft.
const set = [
  { src: join(src2k, "01-blue-hour.png"),                        name: "erasmusbrug-blue-hour",   q: 74 },
  { src: join(src2k, "02-golden-hour-drama.png"),                name: "erasmusbrug-golden-hour", q: 72 },
  { src: join(src2k, "03-storm-light.png"),                      name: "erasmusbrug-storm-light", q: 72 },
  { src: join(src2k, "04-minimalist-fog.png"),                   name: "erasmusbrug-fog",         q: 78 }, // near-white gradients band badly; needs headroom
  { src: join(src2k, "05-night-energy.png"),                     name: "erasmusbrug-night",       q: 74 },
  { src: join(src2k, "rotterdam-02-erasmusbrug-pylon-night.png"), name: "erasmusbrug-pylon-night", q: 74 },
  { src: join(src2k, "delft-02-canal-night.png"),                name: "delft-canal-night",       q: 74 },
  { src: join(src2k, "delft-01-oostpoort-night.png"),            name: "delft-oostpoort-night",   q: 74 },
  { src: join(src2k, "03-rotterdam-markthal-evening.png"),       name: "markthal-evening",        q: 74 },
  { src: join(src2k, "06-delft-markt-nieuwe-kerk-golden-hour.png"), name: "delft-nieuwe-kerk",    q: 74 },
];

// Three widths. The hero is a cover-crop that the browser magnifies, so even a
// 1440px viewport asks for ~1.2x the 1600px asset and a 2x display asks for
// ~2.5x — measured, see guide.html. The 2400px tier is fetched only by
// high-DPI screens via srcset and costs ~25 KB more than the 1600.
for (const { src, name, q } of set) {
  await sharp(src).resize({ width: 2400, kernel: "lanczos3" })
    .webp({ quality: q + 2, effort: 6 }).toFile(join(out, `${name}-2x.webp`));
  await sharp(src).resize({ width: 1600, kernel: "lanczos3" })
    .webp({ quality: q + 4, effort: 6 }).toFile(join(out, `${name}.webp`));
  await sharp(src).resize({ width: 900, kernel: "lanczos3" })
    .webp({ quality: q, effort: 6 }).toFile(join(out, `${name}-sm.webp`));
}

// Brand marks, reused from the vetted V14 set.
const v14img = join(here, "..", "v14-confluence", "img");
for (const f of ["180dc-globe.webp", "180dc-lockup-white.webp"]) {
  await sharp(join(v14img, f)).toFile(join(out, f));
}

let total = 0;
let biggest = 0;
for (const f of readdirSync(out).sort()) {
  const kb = statSync(join(out, f)).size / 1024;
  total += kb;
  if (!f.includes("-sm") && f.includes("erasmus") || f.includes("delft")) biggest = Math.max(biggest, kb);
  console.log(`${kb.toFixed(1).padStart(7)} KB  ${f}`);
}
console.log(`${total.toFixed(1).padStart(7)} KB  TOTAL img/`);
console.log(`${biggest.toFixed(1).padStart(7)} KB  largest single hero (per-page initial cost)`);
