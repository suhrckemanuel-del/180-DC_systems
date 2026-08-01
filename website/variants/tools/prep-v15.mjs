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

// Sources are real, licensed photographs of Rotterdam and Delft, cropped to a
// common 3:2 by tools/_fetch-photos.mjs and recorded with photographer, licence
// and source URL in _brand/photo-set/SOURCES.json. That file is the input to
// both v15-vantage/MEDIA-CREDITS.md and the credit ledger in guide.html.
//
// Nothing here is generated. The variant previously shipped AI renders and
// disclosed them; it no longer does either.
const photos = join(brand, "photo-set");

// Cycling order alternates the two cities rather than grouping them, so the
// branch reads as Delft–Rotterdam wherever a visitor enters the pool.
const set = [
  { src: join(photos, "erasmusbrug-night.png"),   name: "erasmusbrug-night",    q: 74 },
  { src: join(photos, "delft-oostpoort-air.png"), name: "delft-oostpoort-air",  q: 74 },
  { src: join(photos, "markthal-blue-hour.png"),  name: "markthal-blue-hour",   q: 72 }, // dense facade, thousands of small windows
  { src: join(photos, "delft-nieuwe-kerk.png"),   name: "delft-nieuwe-kerk",    q: 74 },
  { src: join(photos, "delft-canal.png"),         name: "delft-canal",          q: 74 },
  { src: join(photos, "delft-oostpoort.png"),     name: "delft-oostpoort",      q: 74 },
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
