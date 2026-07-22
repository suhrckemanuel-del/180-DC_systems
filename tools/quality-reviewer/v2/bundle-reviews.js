/* Bundle the authoritative eval-runs outputs into index.html.

   The renderer is a single file that has to work on a double-click, from
   file://, with no server. A browser opened that way cannot fetch() a sibling
   JSON file, so the reviews are inlined into a <script type="application/json">
   block instead. Re-run this after adding or replacing a run.

   Usage: node bundle-reviews.js */
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const HTML = path.join(HERE, 'index.html');

// The five that clear the harness, per eval-runs/README.md, plus the stability
// runs that show the same deck reviewed twice. Order is the order shown.
const MANIFEST = [
  ['case-01', 'eval-runs/case-01-review-v2-live.json', 'Case 01. Vague recommendation', 'Live blind run. Two blocking rules fired.'],
  ['case-02', 'eval-runs/case-02-review-v2-live-r2.json', 'Case 02. Problem framing drift', 'Live blind run under the revised prompt.'],
  ['case-03', 'eval-runs/case-03-review-v2-live.json', 'Case 03. Weak storyline', 'Live blind run. No governing insight.'],
  ['case-04', 'eval-runs/case-04-review-v2-live-r2.json', 'Case 04. Internal contradiction', 'Live blind run. The only R0 in the set.'],
  ['case-05', 'eval-runs/case-05-review-v2-live-r2.json', 'Case 05. Good but not perfect', 'The restraint case. Nearly ready, minor findings only.'],
  ['case-05-drift', 'eval-runs/stability/case-05-run-a.json', 'Case 05, a second run', 'Same deck, same frozen prompt, another run. Fails the contract check, so the renderer refuses to draw it. Kept as the demo of that refusal.']
];

let html = fs.readFileSync(HTML, 'utf8');
const bundle = {};

for (const [key, rel, label, note] of MANIFEST) {
  const file = path.join(HERE, rel);
  if (!fs.existsSync(file)) { console.error('skipped, not found: ' + rel); continue; }
  const review = JSON.parse(fs.readFileSync(file, 'utf8'));
  bundle[key] = { label, note, source: rel, review };
  console.log('bundled ' + rel);
}

const json = JSON.stringify(bundle).replace(/<\//g, '<\\/');
const re = /(<script id="bundled-reviews" type="application\/json">)[\s\S]*?(<\/script>)/;
if (!re.test(html)) { console.error('no bundle block found in index.html'); process.exit(1); }

html = html.replace(re, (m, a, b) => a + json + b);
fs.writeFileSync(HTML, html);
console.log('\nwrote index.html (' + (html.length / 1024).toFixed(0) + ' kB, ' + Object.keys(bundle).length + ' reviews)');
