// V15 — generate a depth map per hero image with Depth Anything V2 (small, ONNX).
// Runs entirely in Node via transformers.js: no PyTorch, no GPU, no build step
// in the shipped variant. This is a one-off asset step, like prep-v15.mjs.
// Usage: node depth-v15.mjs [--all]
import { pipeline, RawImage } from "@huggingface/transformers";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { mkdirSync, statSync } from "fs";

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, "..", "_brand");
const out = join(here, "..", "v15-vantage", "img");
mkdirSync(out, { recursive: true });

// MUST stay in lockstep with the set in prep-v15.mjs. The two lists are
// separate on purpose (this one is slow and rarely re-run), but a depth map
// inferred from one photograph and applied to another is a silent, invisible
// failure: the displacement field would be reading a different picture than the
// one on screen. Same sources, same names, or not at all.
const photos = join(brand, "photo-set");

const SET = [
  { src: join(photos, "erasmusbrug-night.png"), name: "erasmusbrug-night" },
  { src: join(photos, "delft-oostpoort-air.png"), name: "delft-oostpoort-air" },
  { src: join(photos, "markthal-blue-hour.png"), name: "markthal-blue-hour" },
  { src: join(photos, "delft-nieuwe-kerk.png"), name: "delft-nieuwe-kerk" },
  { src: join(photos, "delft-canal.png"), name: "delft-canal" },
  { src: join(photos, "delft-oostpoort.png"), name: "delft-oostpoort" },
];

const list = process.argv.includes("--all") ? SET : SET.slice(0, 1);

console.log("loading depth-anything-v2-small…");
const depth = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small", {
  dtype: "fp32",
});
console.log("model ready\n");

for (const { src, name } of list) {
  const t0 = Date.now();
  const image = await RawImage.read(src);
  const { depth: map } = await depth(image);

  // depth map is grayscale; the shader only samples luminance, so 8-bit
  // greyscale WebP at half the photo's width is plenty and stays tiny
  const png = await map.toSharp().resize({ width: 768 }).greyscale();
  const file = join(out, `${name}-depth.webp`);
  await png.webp({ quality: 82, effort: 6 }).toFile(file);

  const kb = statSync(file).size / 1024;
  console.log(`${kb.toFixed(1).padStart(6)} KB  ${name}-depth.webp   (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}
