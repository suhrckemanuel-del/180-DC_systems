// Render the exact 1440x900 hero framing for a source + crop bias, so a crop
// can be judged by eye rather than by score alone.
//
// _screen-frames.mjs optimises contrast with no idea whether the frame is worth
// looking at — an empty black sky scores perfectly. This is the counterweight:
// always look at the crop the score picked before believing it.
import sharp from "sharp";

const [src, out, bxs, bys] = process.argv.slice(2);
const biasX = Number(bxs ?? 0.5), biasY = Number(bys ?? 0.5);
const VW = 1440, VH = 900, target = 1.5;

const m = await sharp(src).metadata();
let cw = m.width, chh = Math.round(m.width / target);
if (chh > m.height) { chh = m.height; cw = Math.round(m.height * target); }
const left = Math.round((m.width - cw) * biasX);
const top = Math.round((m.height - chh) * biasY);
const dispH = Math.round(VW / target);
const off = Math.round((dispH - VH) / 2);

await sharp(src)
  .extract({ left, top, width: cw, height: chh })
  .resize(VW, dispH, { kernel: "lanczos3" })
  .extract({ left: 0, top: off, width: VW, height: VH })
  .png().toFile(out);

console.log(`${src}\n  source ${m.width}x${m.height} -> 3:2 crop ${cw}x${chh} at (${left},${top})  bias ${biasX}/${biasY}\n  wrote ${out}`);
