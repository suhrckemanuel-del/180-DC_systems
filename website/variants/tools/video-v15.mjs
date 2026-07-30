// V15 Vantage — generate hero motion clips from the approved stills.
//
// Model: fal-ai/bytedance/seedance/v1/pro/image-to-video
// Chosen over Kling for one reason that decides this job: `camera_fixed`.
// The failure mode for architectural image-to-video is the model inventing a
// camera move and warping the landmark, which is exactly what this variant
// cannot ship. camera_fixed locks the camera so only the scene moves.
//
// Cost control: prints the account balance before and after every run, so the
// true price per clip is measured rather than assumed. Generates only the
// clips named on the command line.
//
// Usage:
//   node video-v15.mjs --list
//   node video-v15.mjs bridge                 # one clip
//   node video-v15.mjs bridge markthal ...    # several
//   node video-v15.mjs --all
import { readFileSync, writeFileSync, mkdirSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const brand = join(here, "..", "_brand");
const outDir = join(here, "raw-video");
mkdirSync(outDir, { recursive: true });

const env = readFileSync(join(here, "..", "..", ".env"), "utf8");
const KEY = env.match(/^FAL_KEY=(.+)$/m)?.[1]?.trim();
if (!KEY) throw new Error("FAL_KEY not found in website/.env");

const MODEL = "fal-ai/bytedance/seedance/v1/pro/image-to-video";

// Every prompt states what moves AND that the architecture does not. The
// landmark geometry is the thing we must protect: a still that is slightly
// wrong is defensible, a moving one that warps is not.
const RIGID = "The architecture is perfectly rigid and does not move, bend, morph or change shape. No people, no vehicles, no boats, no text.";

// The first bridge test proved the geometry holds but the GRADE does not: over
// five seconds the model burned off the fog, saturated the sky and added golden
// reflections, turning a restrained blue-hour frame into a tourist postcard.
// That breaks the variant's look, mismatches the still used as fallback, and
// leaves no clean loop point. Every prompt now pins the grade explicitly.
const GRADE = "Keep the exact original look of the photograph from start to finish: same colour grade, same exposure, same weather, same time of day. Do not brighten, do not add saturation or colour, do not add sunlight or new light sources, do not clear haze or fog, do not change the sky.";

const CLIPS = {
  bridge: {
    src: join(brand, "erasmusbrug-hero-set", "01-blue-hour.png"),
    out: "bridge-blue-hour",
    prompt:
      "Locked-off static shot. " + GRADE + " " +
      "The scene stays a dark, misty, muted blue-hour evening throughout. " +
      "The only movement: thin river mist drifting slowly across the dark water, a gentle ripple on the " +
      "water surface, and slow high cloud. " +
      "The bridge, its white pylon and every cable stay completely still. " + RIGID,
  },
  markthal: {
    src: join(brand, "rotterdam-delft-landmark-set", "03-rotterdam-markthal-evening.png"),
    out: "markthal-evening",
    prompt:
      "Locked-off static shot. " + GRADE + " " +
      "The scene stays a deep blue dusk throughout. " +
      "The only movement: the warm light inside the great archway glowing and shifting very subtly, " +
      "and slow cloud drifting across the sky above the building. " +
      "The building, its grey cladding and glazed facade stay completely still. " + RIGID,
  },
  depot: {
    src: join(brand, "rotterdam-delft-landmark-set", "05-rotterdam-depot-boijmans-golden-hour.png"),
    out: "depot-golden-hour",
    prompt:
      "Locked-off static shot. " + GRADE + " " +
      "The scene stays the same soft golden hour throughout. " +
      "The only movement: slow cloud drifting across the sky with its reflection travelling gradually " +
      "across the curved mirrored facade, and grass and small trees swaying very gently in a light breeze. " +
      "The mirrored building itself stays completely still. " + RIGID,
  },
  delft: {
    src: join(brand, "rotterdam-delft-landmark-set", "06-delft-markt-nieuwe-kerk-golden-hour.png"),
    out: "delft-markt-golden-hour",
    prompt:
      "Locked-off static shot. " + GRADE + " " +
      "The scene stays the same calm golden hour throughout. " +
      "The only movement: slow high cloud drifting across the sky behind the church tower. " +
      "The church tower, the town hall and every building stay completely still. " + RIGID,
  },
};

const api = async (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: { Authorization: `Key ${KEY}`, ...(opts.headers || {}) },
  });

const balance = async () => {
  const r = await api("https://rest.alpha.fal.ai/billing/user_balance");
  return r.ok ? parseFloat(await r.text()) : NaN;
};

const upload = async (path) => {
  const bytes = readFileSync(path);
  const init = await api(
    "https://rest.alpha.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content_type: "image/png", file_name: path.split(/[\\/]/).pop() }),
    }
  );
  if (!init.ok) throw new Error(`initiate failed: ${init.status} ${await init.text()}`);
  const { upload_url, file_url } = await init.json();
  const put = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: bytes,
  });
  if (!put.ok) throw new Error(`upload failed: ${put.status}`);
  return file_url;
};

const generate = async (name) => {
  const clip = CLIPS[name];
  if (!clip) throw new Error(`unknown clip "${name}" — try --list`);

  process.stdout.write(`\n[${name}] uploading source…\n`);
  const imageUrl = await upload(clip.src);

  const payload = {
    prompt: clip.prompt,
    image_url: imageUrl,
    camera_fixed: true,     // the whole reason this model was chosen
    duration: "5",
    resolution: "1080p",
    // "auto" keeps the source's 3:2 framing. The first test used 16:9, which
    // reframed the shot and added one more way for the output to diverge.
    aspect_ratio: "auto",
    enable_safety_checker: true,
    // Pin the last frame back to the source. The first test showed this model
    // produces plenty of motion but drifts hard in grade, so bounding both ends
    // is now the fix rather than the risk — and it yields a clean loop free.
    end_image_url: imageUrl,
  };

  const submit = await api(`https://queue.fal.run/${MODEL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!submit.ok) throw new Error(`submit failed: ${submit.status} ${await submit.text()}`);
  const { request_id, status_url, response_url } = await submit.json();
  process.stdout.write(`[${name}] queued ${request_id}\n`);

  let waited = 0;
  for (;;) {
    await new Promise((r) => setTimeout(r, 5000));
    waited += 5;
    const s = await api(status_url);
    const st = await s.json();
    if (st.status === "COMPLETED") break;
    if (st.status === "FAILED" || st.error) throw new Error(`generation failed: ${JSON.stringify(st).slice(0, 300)}`);
    process.stdout.write(`[${name}] ${st.status} (${waited}s)\r`);
    if (waited > 600) throw new Error("timed out after 10 minutes");
  }

  const res = await api(response_url);
  const out = await res.json();
  const videoUrl = out?.video?.url;
  if (!videoUrl) throw new Error(`no video in response: ${JSON.stringify(out).slice(0, 300)}`);

  const buf = Buffer.from(await (await fetch(videoUrl)).arrayBuffer());
  const file = join(outDir, `${clip.out}.mp4`);
  writeFileSync(file, buf);
  process.stdout.write(`[${name}] saved ${(statSync(file).size / 1024 / 1024).toFixed(2)} MB -> ${file}\n`);
  return file;
};

/* ------------------------------------------------------------------ main */

const args = process.argv.slice(2);
if (args.includes("--list") || args.length === 0) {
  console.log("clips:", Object.keys(CLIPS).join(", "));
  console.log("model:", MODEL);
  console.log("\nprompts:");
  for (const [k, v] of Object.entries(CLIPS)) console.log(`\n[${k}]\n  ${v.prompt}`);
  console.log(`\nbalance: $${(await balance()).toFixed(2)}`);
  process.exit(0);
}

const names = args.includes("--all") ? Object.keys(CLIPS) : args;
const before = await balance();
console.log(`balance before: $${before.toFixed(2)}  |  generating: ${names.join(", ")}`);

for (const n of names) {
  try {
    await generate(n);
  } catch (e) {
    console.error(`\n[${n}] ERROR: ${e.message}`);
  }
}

const after = await balance();
console.log(`\nbalance after:  $${after.toFixed(2)}   (spent $${(before - after).toFixed(3)} on ${names.length} clip(s))`);
