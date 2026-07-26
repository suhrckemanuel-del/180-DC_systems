// V13 Aperture — compress the sourced Pexels photography to WebP.
// Source JPEGs live in the session scratchpad; run once. IDs + credits are
// recorded in v13-aperture/guide.html so the provenance stays auditable.
import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const raw = process.argv[2];
if (!raw) { console.error("usage: node prep-v13.mjs <raw-jpeg-dir>"); process.exit(1); }
const out = join(here, "..", "v13-aperture", "img");

// hero: wide, needs detail (it is clipped inside letterforms) — two widths for srcset
const hero = [
  { id: "5402027", name: "hero-rotterdam.webp", w: 1600, q: 62 },
  { id: "5402027", name: "hero-rotterdam-sm.webp", w: 900, q: 58 },
];

// mosaic tiles: cropped to a consistent 4:3, small and sparing
const tiles = [
  { id: "20053087", name: "tile-rotterdam-skyline.webp", q: 64 },
  { id: "11661493", name: "tile-rotterdam-maas.webp", q: 62 },
  { id: "6197871", name: "tile-delft-above.webp", q: 64 },
  { id: "19104574", name: "tile-delft-oostpoort.webp", q: 64 },
  { id: "7116030", name: "tile-delft-canal.webp", q: 56 }, // grainy source, compresses poorly
];

for (const { id, name, w, q } of hero) {
  await sharp(join(raw, `${id}.jpg`)).resize({ width: w }).webp({ quality: q }).toFile(join(out, name));
}
for (const { id, name, q } of tiles) {
  await sharp(join(raw, `${id}.jpg`))
    .resize({ width: 720, height: 540, fit: "cover", position: "attention" })
    .webp({ quality: q })
    .toFile(join(out, name));
}

// the port frame is reused from V2 (already vetted brand-free); recrop to tile size
await sharp(join(here, "..", "v2-port", "img", "terminal.webp"))
  .resize({ width: 720, height: 540, fit: "cover", position: "attention" })
  .webp({ quality: 64 })
  .toFile(join(out, "tile-port.webp"));

let total = 0;
for (const f of readdirSync(out)) {
  const kb = statSync(join(out, f)).size / 1024;
  total += kb;
  console.log(`${kb.toFixed(1).padStart(7)} KB  ${f}`);
}
console.log(`${total.toFixed(1).padStart(7)} KB  TOTAL img/`);
