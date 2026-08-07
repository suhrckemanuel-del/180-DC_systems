/* Build the deployable copy of the renderer.

   index.html is already self-contained: no build step, no external request, an
   inline contract validator and the reviews inlined by bundle-reviews.js. This
   script does two things that hosting adds on top of that.

   1. It refuses to produce a build that carries real-case content. The reviews
      under eval-runs/real-baseline/ quote real client deliverables verbatim.
      They are gitignored, and they must never reach a public URL either. The
      check runs against the bytes that are about to be written, not against the
      manifest, because the manifest is the thing most likely to be wrong.

   2. It writes into its own directory so `wrangler pages deploy` gets a clean
      root and publishes exactly one file.

   Usage: node build-site.js          builds into site/
          node build-site.js --check  runs the guard only, writes nothing

   The output directory is gitignored. Rebuild it, do not commit it. */
'use strict';
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'index.html');
const OUT_DIR = path.join(HERE, 'site');
const OUT = path.join(OUT_DIR, 'index.html');

/* Markers for material that may never be published. `Client R` onwards is the
   pseudonym range used by the real cases; case-01 through case-05 use Client A
   to Client E and are fabricated. real-0 and real-1 cover real-00 through
   real-19, which is every real case ref that exists or is likely to. */
const FORBIDDEN = [
  { pattern: /Client\s+[R-Z]\b/g, why: 'a real-case client pseudonym' },
  { pattern: /\breal-0\d/g,       why: 'a real-case ref (real-0x)' },
  { pattern: /\breal-1\d/g,       why: 'a real-case ref (real-1x)' },
  { pattern: /real-baseline/g,    why: 'a path under the gitignored real-baseline tree' },
  { pattern: /eval-cases-real/g,  why: 'a path under the real case files' }
];

function scan(html, label) {
  const hits = [];
  for (const { pattern, why } of FORBIDDEN) {
    const found = html.match(pattern);
    if (found) hits.push({ why, count: found.length, sample: [...new Set(found)].slice(0, 4) });
  }
  if (hits.length) {
    console.error(`\nREFUSING TO BUILD. ${label} carries real-case content:\n`);
    for (const h of hits) console.error(`  ${h.count}x ${h.why}: ${h.sample.join(', ')}`);
    console.error('\nNothing was written. Re-run bundle-reviews.js against the synthetic manifest.\n');
    process.exit(1);
  }
  console.log(`clean: ${label} has zero real-case markers (${FORBIDDEN.length} patterns checked)`);
}

const html = fs.readFileSync(SRC, 'utf8');

/* The bundle must exist and must parse, or the hosted page has an empty picker. */
const m = /<script id="bundled-reviews" type="application\/json">([\s\S]*?)<\/script>/.exec(html);
if (!m) { console.error('no bundle block in index.html'); process.exit(1); }
let bundle;
try { bundle = JSON.parse(m[1]); }
catch (e) { console.error('the bundle block is not valid JSON: ' + e.message); process.exit(1); }
const keys = Object.keys(bundle);
if (!keys.length) { console.error('the bundle is empty. Run: node bundle-reviews.js'); process.exit(1); }
console.log(`bundle: ${keys.length} reviews (${keys.join(', ')})`);

scan(html, 'index.html');

/* The kill switch is a committed constant, so a build carries whatever state
   it was left in. Say which, every time, because deploying a killed build by
   accident and deploying a live one by accident are both possible. */
const kill = /var KILL = \{ active:(true|false)/.exec(html);
if (!kill) { console.error('no KILL block in index.html'); process.exit(1); }
console.log(kill[1] === 'true'
  ? 'KILL SWITCH IS ON. This build shows the withdrawal notice and nothing else.'
  : 'kill switch: off, this build serves the tool');

if (process.argv.includes('--check')) {
  console.log('\ncheck only, nothing written');
  process.exit(0);
}

/* Stamp the build date. A copy saved to a laptop can never be withdrawn
   remotely, so it is made to say how old it is instead. */
const today = new Date().toISOString().slice(0, 10);
const stamped = html.replace(/var BUILD = \{ date:'[^']*'/, `var BUILD = { date:'${today}'`);
if (stamped === html && !html.includes(`var BUILD = { date:'${today}'`)) {
  console.error('could not stamp the build date. Is the BUILD block still in index.html?');
  process.exit(1);
}
console.log(`build date: ${today}`);

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, stamped);

/* Read back what was actually written rather than trusting the write. */
scan(fs.readFileSync(OUT, 'utf8'), 'site/index.html as written');
console.log(`\nwrote ${path.relative(HERE, OUT)} (${(html.length / 1024).toFixed(0)} kB)`);
console.log('deploy: npx wrangler pages deploy tools/quality-reviewer/v2/site --project-name=180dc-reviewer --branch=main');
