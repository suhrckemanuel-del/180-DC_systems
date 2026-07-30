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

// Every frame now comes from the 2K regeneration (regen-v15.mjs). The original
// 1536 sets stay in _brand/ as the provenance record, but they are no longer
// what ships: a depth map inferred from the 1536 source and applied to a 2528px
// photo would be reading a different picture than the one on screen.
const src2k = join(brand, "hero-set-2k");

const SET = [
  { src: join(src2k, "01-blue-hour.png"), name: "erasmusbrug-blue-hour" },
  { src: join(src2k, "02-golden-hour-drama.png"), name: "erasmusbrug-golden-hour" },
  { src: join(src2k, "03-storm-light.png"), name: "erasmusbrug-storm-light" },
  { src: join(src2k, "04-minimalist-fog.png"), name: "erasmusbrug-fog" },
  { src: join(src2k, "05-night-energy.png"), name: "erasmusbrug-night" },
  { src: join(src2k, "rotterdam-02-erasmusbrug-pylon-night.png"), name: "erasmusbrug-pylon-night" },
  { src: join(src2k, "delft-02-canal-night.png"), name: "delft-canal-night" },
  { src: join(src2k, "delft-01-oostpoort-night.png"), name: "delft-oostpoort-night" },
  { src: join(src2k, "03-rotterdam-markthal-evening.png"), name: "markthal-evening" },
  { src: join(src2k, "06-delft-markt-nieuwe-kerk-golden-hour.png"), name: "delft-nieuwe-kerk" },
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
