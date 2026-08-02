// Pre-screen candidate photographs against the hero's real copy boxes before
// any of them get wired into the pool.
//
// It reproduces the hero framing offline — 3:2 crop, cover-fit into 1440x900 —
// and runs the same worst-tile contrast metric as audit-v15-hero-contrast.mjs.
// Sweeping the crop bias also answers "can a different crop of this frame save
// it", which is handoff §3 route (b), without a browser round trip per attempt.
//
// It is deliberately PESSIMISTIC: it does not model .hero__blur, which smooths
// the bottom ~45% of the frame and so lifts the lede, city label, counter and
// credit. A frame that screens well here will measure at least as well live.
import sharp from "sharp";
import { basename } from "path";

const lum = (r, g, b) => {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => { const [x, y] = [a, b].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// measured live from index.html at 1440x900
const BOXES = [
  { name: "meta text",    large: false, rgba: [255, 255, 255, 0.92], fontPx: 12.4,  x: 286, y: 248, w: 196, h: 20 },
  { name: "headline",     large: true,  rgba: [255, 255, 255, 1],    fontPx: 81.6,  x: 100, y: 294, w: 915, h: 274 },
  { name: "lede",         large: false, rgba: [255, 255, 255, 1],    fontPx: 19.2,  x: 100, y: 587, w: 712, h: 92 },
  { name: "city label",   large: false, rgba: [255, 255, 255, 1],    fontPx: 12.8,  x: 375, y: 796, w: 161, h: 17 },
  { name: "city counter", large: false, rgba: [255, 255, 255, 0.8],  fontPx: 11.84, x: 375, y: 814, w: 161, h: 15 },
  { name: "photo credit", large: false, rgba: [255, 255, 255, 0.78], fontPx: 10.88, x: 550, y: 813, w: 150, h: 18 },
];

const VW = 1440, VH = 900;
const tileFor = (fontPx) => Math.max(8, Math.min(40, Math.round(fontPx * 0.8)));
const WORST_FACTOR = 0.8;

// crop `src` to 3:2 at the given bias, then cover-fit into the 1440x900 hero
async function heroFrame(src, biasX, biasY) {
  const m = await sharp(src).metadata();
  const target = 1.5;
  let cw = m.width, chh = Math.round(m.width / target);
  if (chh > m.height) { chh = m.height; cw = Math.round(m.height * target); }
  const left = Math.round((m.width - cw) * biasX);
  const top = Math.round((m.height - chh) * biasY);

  // cover-fit 3:2 into 1440x900: fills width, crops height symmetrically
  const dispH = Math.round(VW / target); // 960
  const off = Math.round((dispH - VH) / 2);
  return sharp(src)
    .extract({ left, top, width: cw, height: chh })
    .resize(VW, dispH, { kernel: "lanczos3" })
    .extract({ left: 0, top: off, width: VW, height: VH })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
}

function score(buf, info) {
  const { data } = { data: buf };
  const ch = info.channels;
  const rows = [];
  for (const b of BOXES) {
    const [tr, tg, tb, ta] = b.rgba;
    const need = b.large ? 3 : 4.5;
    const needWorst = need * WORST_FACTOR;

    const ratioOf = (r, g, b2) => {
      // text colour may be translucent: composite it over the photo first,
      // which is what the eye actually sees
      const er = tr * ta + r * (1 - ta), eg = tg * ta + g * (1 - ta), eb = tb * ta + b2 * (1 - ta);
      return contrast(lum(er, eg, eb), lum(r, g, b2));
    };

    let sr = 0, sg = 0, sb = 0, n = 0;
    for (let y = b.y; y < b.y + b.h; y++) {
      for (let x = b.x; x < b.x + b.w; x++) {
        const i = (y * VW + x) * ch;
        sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; n++;
      }
    }
    const mean = ratioOf(sr / n, sg / n, sb / n);

    const t = tileFor(b.fontPx);
    const cols = Math.max(1, Math.floor(b.w / t)), rowsN = Math.max(1, Math.floor(b.h / t));
    const cw = b.w / cols, chh = b.h / rowsN;
    let worst = Infinity, bad = 0, total = 0;
    for (let cy = 0; cy < rowsN; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const x0 = b.x + Math.floor(cx * cw), x1 = b.x + Math.floor((cx + 1) * cw);
        const y0 = b.y + Math.floor(cy * chh), y1 = b.y + Math.floor((cy + 1) * chh);
        let ar = 0, ag = 0, ab = 0, c = 0;
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const i = (y * VW + x) * ch; ar += data[i]; ag += data[i + 1]; ab += data[i + 2]; c++;
        }
        if (!c) continue;
        const r = ratioOf(ar / c, ag / c, ab / c);
        total++; if (r < worst) worst = r; if (r < needWorst) bad++;
      }
    }
    rows.push({ name: b.name, mean, worst, need, needWorst, badPct: total ? (bad / total) * 100 : 0,
      headroom: Math.min(mean / need, worst / needWorst) });
  }
  return rows;
}

const files = process.argv.slice(2);
const sweep = [];
for (let by = 0.20; by <= 0.801; by += 0.05) sweep.push(by);

for (const f of files) {
  const name = basename(f);
  let best = null;
  for (const by of sweep) {
    let out;
    try { out = await heroFrame(f, 0.5, by); } catch { continue; }
    const rows = score(out.data, out.info);
    const min = Math.min(...rows.map((r) => r.headroom));
    if (!best || min > best.min) best = { min, by, rows };
  }
  if (!best) { console.log(`${name}: could not frame`); continue; }
  const verdict = best.min >= 1 ? "PASS" : "fail";
  console.log(`\n${name}  best biasY=${best.by.toFixed(2)}  headroom=${best.min.toFixed(2)}  ${verdict}`);
  for (const r of best.rows) {
    const mark = (r.mean >= r.need && r.worst >= r.needWorst) ? " " : "✗";
    console.log(`   ${mark} ${r.name.padEnd(13)} mean ${r.mean.toFixed(2).padStart(6)}  worst ${r.worst.toFixed(2).padStart(6)} / ${r.needWorst.toFixed(2)}   ${r.badPct.toFixed(0)}% under`);
  }
}
