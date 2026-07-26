// Assemble the consolidated single-site tree in ../dist:
//   dist/index.html                  ← gallery (from ../gallery/ if present, else stub)
//   dist/v<N>-<slug>/                ← variant pages + assets
//   dist/v<N>-<slug>/guide/index.html← guide.html relocated, links rewritten
// Sources in ../v* stay canonical and untouched.
import { cpSync, mkdirSync, rmSync, readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const variants = readdirSync(root).filter(
  (d) => /^v\d+-/.test(d) && statSync(join(root, d)).isDirectory()
);

for (const v of variants) {
  const src = join(root, v);
  const out = join(dist, v);
  cpSync(src, out, { recursive: true });

  // relocate guide.html -> guide/index.html with path rewrites
  const guidePath = join(out, "guide.html");
  if (existsSync(guidePath)) {
    let g = readFileSync(guidePath, "utf8");
    g = g
      .replaceAll('href="styles.css"', 'href="../styles.css"')
      .replaceAll('href="index.html"', 'href="../"')
      .replaceAll('href="mission.html"', 'href="../mission.html"')
      .replaceAll('href="for-clients.html"', 'href="../for-clients.html"')
      .replaceAll('href="for-students.html"', 'href="../for-students.html"')
      .replaceAll('href="guide.html"', 'href="./"')
      .replaceAll('src="img/', 'src="../img/');
    mkdirSync(join(out, "guide"), { recursive: true });
    writeFileSync(join(out, "guide", "index.html"), g);
    rmSync(guidePath);
  }

  // rewrite links to the guide in the variant's other pages
  for (const f of readdirSync(out).filter((f) => f.endsWith(".html"))) {
    const p = join(out, f);
    let h = readFileSync(p, "utf8");
    h = h.replaceAll('href="guide.html"', 'href="guide/"');
    writeFileSync(p, h);
  }
}

// gallery
const gallerySrc = join(root, "gallery");
if (existsSync(gallerySrc)) {
  cpSync(gallerySrc, dist, { recursive: true });
} else {
  writeFileSync(
    join(dist, "index.html"),
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>180DC Delft–Rotterdam — design variants</title></head><body style="font-family:system-ui;max-width:52rem;margin:3rem auto;padding:0 1rem;line-height:1.6"><h1>180DC Delft–Rotterdam — design variants</h1><p>Gallery under construction. Completed variants:</p><ul>${variants
      .map((v) => `<li><a href="/${v}/">${v}</a> · <a href="/${v}/guide/">guide</a></li>`)
      .join("")}</ul></body></html>`
  );
}
console.log(`dist assembled: ${variants.join(", ")}${existsSync(gallerySrc) ? " + gallery" : " + stub gallery"}`);
