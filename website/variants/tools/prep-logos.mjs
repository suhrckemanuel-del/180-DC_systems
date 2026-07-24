import sharp from "sharp";
const brand = "C:/Users/User/Desktop/180dc-ai/website/variants/_brand";

// 1) Full branch lockup (square: globe + 180Degrees Consulting + DELFT ROTTERDAM), black text on light bg.
{
  const src = `${brand}/180dc-logo-black-text.png`;
  const out = `${brand}/180dc-lockup-branch.webp`;
  const img = sharp(src).trim();
  await img.resize({ width: 640, withoutEnlargement: true }).webp({ quality: 88 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log("lockup-branch.webp", m.width + "x" + m.height);
}

// 2) White wordmark lockup (landscape, for dark backgrounds).
{
  const src = `${brand}/180dc-logo-white.png`;
  const out = `${brand}/180dc-lockup-white.webp`;
  await sharp(src).trim().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 88 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log("lockup-white.webp", m.width + "x" + m.height);
}

// 3) Globe mark only — crop the top region of the square logo (above the wordmark), then trim tight.
{
  const src = `${brand}/180dc-logo-black-text.png`;
  const meta = await sharp(src).metadata();
  const cropH = Math.round(meta.height * 0.60); // globe sits in the top ~60%
  const out = `${brand}/180dc-globe.webp`;
  await sharp(src)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .trim()
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log("globe.webp", m.width + "x" + m.height);
}
