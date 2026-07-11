// Download Google Fonts woff2 (latin subset) for self-hosting.
// Usage: node getfont.mjs <outdir> "Family:wght@400;700" ["Family2:ital,wght@0,400"] ...
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const [outdir, ...specs] = process.argv.slice(2);
if (!outdir || specs.length === 0) { console.error("usage: node getfont.mjs <outdir> <family-spec...>"); process.exit(1); }
mkdirSync(outdir, { recursive: true });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

for (const spec of specs) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(spec).replace(/%3A/g, ":").replace(/%40/g, "@").replace(/%3B/g, ";").replace(/%2C/g, ",")}&display=swap`;
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();
  // keep only latin blocks
  const blocks = css.split("/*").filter(b => b.startsWith(" latin */"));
  for (const b of blocks) {
    for (const m of b.matchAll(/font-family: '([^']+)';[\s\S]*?font-style: (\w+);[\s\S]*?font-weight: (\d+);[\s\S]*?url\((https:[^)]+\.woff2)\)/g)) {
      const [, fam, style, weight, url] = m;
      const fname = `${fam.replace(/\s+/g, "")}-${weight}${style === "italic" ? "i" : ""}.woff2`;
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(join(outdir, fname), buf);
      console.log(`${fname} ${(buf.length / 1024).toFixed(0)}KB`);
    }
  }
}
