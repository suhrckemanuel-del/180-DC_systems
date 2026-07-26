import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const variant = resolve(here, "..", "v14-confluence");
const publicFiles = ["index.html", "mission.html", "for-clients.html", "for-students.html"];
const html = Object.fromEntries(publicFiles.map((file) => [file, readFileSync(join(variant, file), "utf8")]));
const failures = [];
const pass = (message) => console.log(`PASS  ${message}`);
const fail = (message) => {
  failures.push(message);
  console.error(`FAIL  ${message}`);
};
const expect = (condition, message) => (condition ? pass(message) : fail(message));

const allPublic = publicFiles.map((file) => html[file]).join("\n");
expect(/\b2019\b/.test(allPublic), "founded 2019 is present");
expect(/first multi-city branch/i.test(allPublic), "first multi-city branch is present");
expect(/TU Delft/.test(allPublic) && /Erasmus (University )?Rotterdam/.test(allPublic), "both universities are present");
expect(/October–January/.test(allPublic) && /March–June/.test(allPublic), "both consulting cycles are present");
expect(/Consultant/.test(allPublic) && /Team Leader/.test(allPublic), "Consultant and Team Leader are present");
expect(!/Project Manager/i.test(allPublic), "Project Manager is absent");
expect(/case studies awaiting client consent/i.test(allPublic), "case-study gap is explicit");
expect(/team photos awaiting photo session/i.test(allPublic), "team-photo gap is explicit");
expect(/member testimonials, sourced with consent/i.test(allPublic), "testimonial gap is explicit");

const services = [
  "Digital Transformation",
  "Marketing &amp; Engagement",
  "Financial Sustainability",
  "Market Assessment",
  "Operational Efficiency",
  "Impact Measurement",
];
const extractDescription = (source, service) => {
  const escaped = service.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.match(new RegExp(`<h3>${escaped}</h3><p>([^<]+)</p>`))?.[1]?.trim();
};
for (const service of services) {
  const homeCopy = extractDescription(html["index.html"], service);
  const clientCopy = extractDescription(html["for-clients.html"], service);
  expect(Boolean(homeCopy) && homeCopy === clientCopy, `${service.replace("&amp;", "&")} copy is identical on Home and For clients`);
}

for (const [file, source] of Object.entries(html)) {
  const isHome = file === "index.html";
  const expectedAnchors = isHome
    ? ['href="#services"', 'href="#work"', 'href="#committee"']
    : ['href="index.html#services"', 'href="index.html#work"', 'href="index.html#committee"'];
  expect(expectedAnchors.every((anchor) => source.includes(anchor)), `${file} uses the correct scroll-anchor navigation pattern`);

  const localRefs = [
    ...source.matchAll(/\b(?:href|src|poster|data-src)="([^"]+)"/g),
  ].map((match) => match[1]).filter((ref) =>
    !/^(?:https?:|mailto:|data:|#)/.test(ref)
  );

  for (const ref of localRefs) {
    const [pathPart, fragment] = ref.split("#");
    const target = resolve(variant, pathPart || file);
    if (!existsSync(target)) {
      fail(`${file} has missing local reference ${ref}`);
      continue;
    }
    if (fragment && statSync(target).isFile() && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      expect(new RegExp(`\\bid="${fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(targetHtml), `${file} fragment ${ref} resolves`);
    }
  }
}

const media = [
  ["home-rotterdam-delft.mp4", 720_000],
  ["mission-delft-origin.mp4", 560_000],
  ["clients-rotterdam-port.mp4", 480_000],
  ["students-delft-life.mp4", 480_000],
];
const mediaHashes = new Set();
for (const [file, cap] of media) {
  const path = join(variant, "media", file);
  const bytes = statSync(path).size;
  const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
  mediaHashes.add(hash);
  expect(bytes <= cap, `${file} is ${bytes.toLocaleString()} bytes (cap ${cap.toLocaleString()})`);
}
expect(mediaHashes.size === media.length, "all four route films are byte-distinct");

const commonBytes = ["styles.css", "media-controller.js", "img/180dc-globe.webp", "img/180dc-lockup-white.webp"]
  .reduce((sum, file) => sum + statSync(join(variant, file)).size, 0);
const routeBudgets = [
  ["index.html", "home-rotterdam-delft.mp4", "poster-home-rotterdam-delft.webp", 900_000],
  ["mission.html", "mission-delft-origin.mp4", "poster-mission-delft.webp", 700_000],
  ["for-clients.html", "clients-rotterdam-port.mp4", "poster-clients-rotterdam.webp", 700_000],
  ["for-students.html", "students-delft-life.mp4", "poster-students-delft.webp", 700_000],
];
for (const [page, film, poster, cap] of routeBudgets) {
  const bytes = commonBytes
    + statSync(join(variant, page)).size
    + statSync(join(variant, "media", film)).size
    + statSync(join(variant, "img", poster)).size;
  expect(bytes <= cap, `${page} estimated complete route transfer is ${bytes.toLocaleString()} bytes (cap ${cap.toLocaleString()})`);
}

if (failures.length) {
  console.error(`\n${failures.length} content/integrity failure(s).`);
  process.exit(1);
}
console.log("\nV14 content, link, and budget audit passed.");
