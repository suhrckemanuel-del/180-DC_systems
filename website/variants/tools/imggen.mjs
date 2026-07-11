// Generate an image via gpt-image-2 and save as PNG. Appends to the budget ledger.
// Usage: node imggen.mjs "<prompt>" <outfile.png> [size] [quality]
//   size: 1024x1024 | 1536x1024 | 1024x1536 (default 1536x1024)
//   quality: low | medium | high (default low)
import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(join(here, "..", "..", ".env"), "utf8");
const key = envText.match(/^OPENAI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) throw new Error("OPENAI_API_KEY not found");

const [prompt, outfile, size = "1536x1024", quality = "low"] = process.argv.slice(2);
if (!prompt || !outfile) { console.error("usage: node imggen.mjs <prompt> <outfile> [size] [quality]"); process.exit(1); }

const res = await fetch("https://api.openai.com/v1/images/generations", {
  method: "POST",
  headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  body: JSON.stringify({ model: "gpt-image-2", prompt, size, quality, n: 1 }),
});
if (!res.ok) { console.error(await res.text()); process.exit(1); }
const data = await res.json();
writeFileSync(outfile, Buffer.from(data.data[0].b64_json, "base64"));
// rough cost table (EUR): low ~0.01, medium ~0.04, high ~0.15 per image at 1536x1024
const cost = { low: 0.011, medium: 0.042, high: 0.155 }[quality] ?? 0.05;
appendFileSync(join(here, "ledger.csv"), `${new Date().toISOString()},${quality},${size},${cost},${outfile}\n`);
console.log(`saved ${outfile} (~€${cost})`);
