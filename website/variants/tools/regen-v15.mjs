// V15 Vantage — regenerate the hero stills at 2K+ from the approved 1536 sources.
//
// Why this exists: the native sources are 1536x1024. prep-v15.mjs lanczos-
// upscales them to a "2400px" tier, so that tier carries no detail the 1536
// did not already have. On a DPR-2 display at 1440 CSS px the shader draws
// into a 2880px buffer, which means 1536px of real detail stretched 1.875x.
// That is the softness. The fix is real pixels, not a better resampler.
//
// Model: fal-ai/nano-banana-pro/edit — image-to-image, not text-to-image.
// Composition parity is the whole point: the hero contrast audit samples the
// real pixels behind the hero copy on all eight frames, and PROMPTS.md's
// "keep the entire lower third calm and low-detail" is what makes white type
// readable there. A fresh text-to-image roll would put both back in play and
// cost more attempts than it saves per image.
//
// Cost control: prints the account balance before and after every run, so the
// true price per image is measured rather than assumed. Generates only the
// frames named on the command line. There is no --all until one is approved.
//
// Usage:
//   node regen-v15.mjs --list
//   node regen-v15.mjs blue-hour            # one frame
//   node regen-v15.mjs blue-hour night ...  # several
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, "..", "_brand");
const outDir = join(brand, "hero-set-2k");
mkdirSync(outDir, { recursive: true });

const env = readFileSync(join(here, "..", "..", ".env"), "utf8");
const KEY = env.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) throw new Error("FAL_KEY not found in website/.env");

const MODEL = "fal-ai/nano-banana-pro/edit";

// The instruction is deliberately conservative. We are not asking for a new
// picture; we are asking for the same picture with more real detail in it.
// Everything the audits depend on — framing, grade, the calm lower third —
// is named as a thing that must NOT change.
const HOLD =
  "Preserve the composition, framing, camera position, horizon line, colour grade, " +
  "exposure, weather and time of day exactly as they are. Do not move, add or remove " +
  "any element. Do not change the sky, the water or the skyline. Do not brighten, " +
  "saturate, or clear haze or mist.";

const SHARPEN =
  "Increase only the level of genuine fine detail and optical sharpness: crisper cable " +
  "and structural geometry, finer texture in water and cloud, cleaner edges on distant " +
  "buildings. Photographic detail, not painterly embellishment or added contrast.";

const LOWER_THIRD =
  "Keep the entire lower third calm, low-detail and uncluttered so it stays usable as a " +
  "background for overlaid white text.";

const BAN = "No people, no boats, no vehicles, no text, no typography, no logos, no watermarks, no borders.";

const FRAMES = {
  "blue-hour":     { src: ["erasmusbrug-hero-set", "01-blue-hour.png"],                  out: "01-blue-hour" },
  "golden-hour":   { src: ["erasmusbrug-hero-set", "02-golden-hour-drama.png"],          out: "02-golden-hour-drama" },
  "storm-light":   { src: ["erasmusbrug-hero-set", "03-storm-light.png"],                out: "03-storm-light" },
  "fog":           { src: ["erasmusbrug-hero-set", "04-minimalist-fog.png"],             out: "04-minimalist-fog" },
  "night":         { src: ["erasmusbrug-hero-set", "05-night-energy.png"],               out: "05-night-energy" },
  "pylon-night":   { src: ["rotterdam-delft-night-set", "rotterdam-02-erasmusbrug-pylon-night.png"], out: "rotterdam-02-erasmusbrug-pylon-night" },
  "canal-night":   { src: ["rotterdam-delft-night-set", "delft-02-canal-night.png"],     out: "delft-02-canal-night" },
  "oostpoort":     { src: ["rotterdam-delft-night-set", "delft-01-oostpoort-night.png"], out: "delft-01-oostpoort-night" },
  // Added to the pool on the owner's call: the landmark set was generated but
  // never wired in. Markthal gives Rotterdam a second, non-bridge subject and
  // the Nieuwe Kerk gives Delft its civic landmark.
  "markthal":      { src: ["rotterdam-delft-landmark-set", "03-rotterdam-markthal-evening.png"],        out: "03-rotterdam-markthal-evening" },
  "nieuwe-kerk":   { src: ["rotterdam-delft-landmark-set", "06-delft-markt-nieuwe-kerk-golden-hour.png"], out: "06-delft-markt-nieuwe-kerk-golden-hour" },
};

const balance = async () => {
  const r = await fetch("https://rest.alpha.fal.ai/billing/user_balance", {
    headers: { Authorization: `Key ${KEY}` },
  });
  return parseFloat(await r.text());
};

const args = process.argv.slice(2);
if (!args.length || args.includes("--list")) {
  console.log("frames:", Object.keys(FRAMES).join(", "));
  console.log("\nusage: node regen-v15.mjs blue-hour");
  process.exit(0);
}

const unknown = args.filter((a) => !FRAMES[a]);
if (unknown.length) throw new Error(`unknown frame(s): ${unknown.join(", ")}`);

const before = await balance();
console.log(`balance before: $${before.toFixed(4)}`);

for (const name of args) {
  const f = FRAMES[name];
  const srcPath = join(brand, ...f.src);
  const b64 = readFileSync(srcPath).toString("base64");

  console.log(`\n${name}: ${f.src.join("/")} -> 2K`);
  const t0 = Date.now();

  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Key ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `Reproduce this exact photograph at much higher resolution. ${HOLD} ${SHARPEN} ${LOWER_THIRD} ${BAN}`,
      image_urls: [`data:image/png;base64,${b64}`],
      resolution: "2K",
      aspect_ratio: "3:2",
      num_images: 1,
      output_format: "png",
    }),
  });

  if (!res.ok) {
    console.error(`  FAILED ${res.status}: ${(await res.text()).slice(0, 400)}`);
    continue;
  }
  const json = await res.json();
  const url = json?.images?.[0]?.url;
  if (!url) {
    console.error("  no image in response:", JSON.stringify(json).slice(0, 400));
    continue;
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const dest = join(outDir, `${f.out}.png`);
  writeFileSync(dest, buf);
  console.log(`  saved ${dest}  ${(buf.length / 1024 / 1024).toFixed(2)} MB  in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}

const after = await balance();
console.log(`\nbalance after:  $${after.toFixed(4)}`);
console.log(`spent:          $${(before - after).toFixed(4)}  over ${args.length} image(s)`);
