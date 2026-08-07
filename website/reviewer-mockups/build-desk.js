#!/usr/bin/env node
/*
 * build-desk.js — one template, two datasets.
 *
 * The reviewer mockups are a single self-contained page whose entire content lives in one
 * <script id="data" type="application/json"> blob. That separation is the whole reason this
 * script is short: the template never needs to know whether it is rendering an invented deck
 * or a real one.
 *
 *   fabricated  -> index.html        tracked, deployable, safe to show anyone
 *   live        -> live/index.html   GITIGNORED, quotes a real client deck verbatim
 *
 * WHY live/ IS GITIGNORED AND MUST STAY THAT WAY
 * A real review contains verbatim quotes from a real client deliverable. website/ is a
 * deployed Cloudflare Pages tree. A live build committed here would publish client material
 * to the open web. live/ is ignored as a whole directory, the same pattern eval-runs uses,
 * because a whole-directory rule cannot be defeated by someone adding a new filename.
 * `--live` refuses to write if its own output path is not ignored.
 *
 * Usage
 *   node build-desk.js --extract              index.html -> template.html + data-fabricated.json
 *   node build-desk.js --fabricated           rebuild the tracked index.html
 *   node build-desk.js --verify               prove the extract/rebuild round trip is lossless
 *   node build-desk.js --live --review <p>    build live/index.html from a real review JSON
 *        [--case real-13] [--out <path>]
 *
 * The live path never mutates its input. It only reads the review JSON and, if it can find
 * one, the case file the review was produced from (for real page labels).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HERE = __dirname;
const REPO = path.resolve(HERE, '..', '..');
const INDEX = path.join(HERE, 'index.html');
const TEMPLATE = path.join(HERE, 'template.html');
const FABRICATED = path.join(HERE, 'data-fabricated.json');
const CASES_DIR = path.join(REPO, 'tools', 'quality-reviewer', 'v2', 'eval-cases-real');

const OPEN = '<script id="data" type="application/json">';
const CLOSE = '</script>';
const MARK = '__DATA__';

// ---- template plumbing -----------------------------------------------------
/* The data blob sits on one line between OPEN and the next CLOSE. Splitting on those two
 * markers rather than parsing the HTML keeps every byte outside the blob untouched, which is
 * what makes --verify able to prove the refactor changed nothing. */
function split(html) {
  const a = html.indexOf(OPEN);
  if (a === -1) throw new Error('no <script id="data"> block in ' + INDEX);
  const b = html.indexOf(CLOSE, a + OPEN.length);
  if (b === -1) throw new Error('unterminated <script id="data"> block');
  return { head: html.slice(0, a + OPEN.length), raw: html.slice(a + OPEN.length, b), tail: html.slice(b) };
}

/* JSON.stringify emits "</script>" intact, which would close the tag early and break the
 * page. Escaping the slash is invisible to JSON.parse and standard practice for JSON
 * embedded in HTML. Nothing else needs escaping: this blob is read with
 * JSON.parse(el.textContent), never evaluated as a JS string literal. */
function embed(obj) {
  return JSON.stringify(obj)
    .replace(/<\//g, '<\\/');
}

function readTemplate() {
  if (!fs.existsSync(TEMPLATE)) throw new Error('no template.html yet — run: node build-desk.js --extract');
  const t = fs.readFileSync(TEMPLATE, 'utf8');
  if (!t.includes(MARK)) throw new Error('template.html has lost its ' + MARK + ' placeholder');
  return t;
}

function render(data) { return readTemplate().replace(MARK, () => embed(data)); }

// ---- extract ---------------------------------------------------------------
function extract() {
  const { head, raw, tail } = split(fs.readFileSync(INDEX, 'utf8'));
  const data = JSON.parse(raw);
  fs.writeFileSync(TEMPLATE, head + MARK + tail);
  fs.writeFileSync(FABRICATED, JSON.stringify(data, null, 2) + '\n');
  console.log('wrote template.html and data-fabricated.json');
  console.log('  template   ' + (head.length + MARK.length + tail.length).toLocaleString() + ' bytes');
  console.log('  data       ' + Object.keys(data).join(', '));
  return 0;
}

// ---- verify ----------------------------------------------------------------
/* Byte-identity of the whole file is the wrong test: pretty-printing the extracted JSON is
 * the point of extracting it, so the blob legitimately differs. The right test is that
 * everything OUTSIDE the blob is byte-identical and the blob parses to a deep-equal object.
 * That is exactly "the page renders the same content from the same template". */
function verify() {
  const current = split(fs.readFileSync(INDEX, 'utf8'));
  const rebuilt = split(render(JSON.parse(fs.readFileSync(FABRICATED, 'utf8'))));
  const shellSame = current.head === rebuilt.head && current.tail === rebuilt.tail;
  const dataSame = JSON.stringify(sortDeep(JSON.parse(current.raw))) === JSON.stringify(sortDeep(JSON.parse(rebuilt.raw)));
  console.log('template shell byte-identical : ' + (shellSame ? 'yes' : 'NO'));
  console.log('data deep-equal               : ' + (dataSame ? 'yes' : 'NO'));
  if (shellSame && dataSame) { console.log('\nround trip is lossless — index.html renders identical content.'); return 0; }
  console.error('\nround trip is NOT lossless. Do not commit.');
  return 1;
}

function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === 'object') {
    return Object.keys(v).sort().reduce((o, k) => { o[k] = sortDeep(v[k]); return o; }, {});
  }
  return v;
}

// ---- real data derivation --------------------------------------------------
/* A real review JSON carries no `timeline` and no `pages`: run-reviews.js deliberately omits
 * timeline from the response schema, and pages describe the deck rather than the review. Both
 * are DERIVED here from the review's own evidence, never invented. If a slide is not cited by
 * any finding it is 'pass', which is the same meaning the fabricated strip carries. */
function deriveTimeline(review) {
  const n = review.meta.slideCount || 0;
  const findings = review.findings || [];
  const blocking = review.blockingIssues || [];

  const worst = {};
  const mark = (slide, state) => {
    if (!slide || slide < 1) return;
    const rank = { pass: 0, partial: 1, critical: 2 };
    if (!worst[slide] || rank[state] > rank[worst[slide]]) worst[slide] = state;
  };
  findings.forEach(f => (f.evidence || []).forEach(e =>
    mark(e.slide, f.severity === 'critical' ? 'critical' : 'partial')));
  blocking.forEach(b => (b.evidence || []).forEach(e => mark(e.slide, 'critical')));

  const tiles = [];
  for (let i = 1; i <= n; i++) tiles.push({ slide: i, state: worst[i] || 'pass' });

  const callouts = findings
    .map(f => { const e = (f.evidence || [])[0]; return e ? { at: e.slide, state: f.severity === 'critical' ? 'critical' : 'partial', label: f.short } : null; })
    .filter(Boolean);

  /* A finding citing two different slides IS a connector: it is the tool saying these two
   * pages disagree. That is the same thing the fabricated connectors express by hand. */
  const connectors = [];
  findings.forEach(f => {
    const slides = [...new Set((f.evidence || []).map(e => e.slide))].filter(Boolean).sort((a, b) => a - b);
    if (slides.length >= 2) connectors.push({ from: slides[0], to: slides[slides.length - 1], label: f.short });
  });

  return { sections: [], tiles, callouts, connectors };
}

/* Real page labels come from the case file's "**Slide N. Title**" headers. The file is read
 * here and never echoed to a console, so the operator running the build does not pull client
 * deck text into a transcript. Falls back to bare numbering when the case file is absent. */
function derivePages(review, caseId) {
  const n = review.meta.slideCount || 0;
  const bare = () => Array.from({ length: n }, (_, i) => ({ n: i + 1, label: 'Page ' + (i + 1) }));
  if (!caseId || !fs.existsSync(CASES_DIR)) return bare();
  const hit = fs.readdirSync(CASES_DIR).find(f => f.startsWith(caseId + '-') && f.endsWith('.md'));
  if (!hit) return bare();
  const raw = fs.readFileSync(path.join(CASES_DIR, hit), 'utf8');
  const labels = {};
  const re = /^\*\*(?:Slide|Page)\s*(\d+)\.\s*([^*]*?)\s*\*\*/gm;
  let m;
  while ((m = re.exec(raw))) labels[Number(m[1])] = m[2].trim();
  const out = [];
  for (let i = 1; i <= n; i++) out.push({ n: i, label: labels[i] || 'Page ' + i });
  return out;
}

// ---- live build ------------------------------------------------------------
function isIgnored(p) {
  try {
    execFileSync('git', ['check-ignore', '-q', p], { cwd: REPO, stdio: 'ignore' });
    return true;
  } catch (e) { return false; }
}

function live(argv) {
  const arg = (k, d) => { const i = argv.indexOf('--' + k); return i === -1 ? d : argv[i + 1]; };
  const reviewPath = arg('review', null);
  if (!reviewPath) { console.error('--live needs --review <path to a review JSON>'); return 2; }
  if (!fs.existsSync(reviewPath)) { console.error('no such review: ' + reviewPath); return 2; }

  const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  if (!review.meta || !review.findings) { console.error('that file is not a Review v2 object'); return 2; }

  const caseId = arg('case', null) || (path.basename(reviewPath).match(/^(real-\d+)/) || [])[1] || null;
  const outPath = path.resolve(arg('out', path.join(HERE, 'live', 'index.html')));

  /* Refuse to write client quotes anywhere git would track them. This is the guard that
   * makes the whole live path safe to run casually. */
  if (!isIgnored(outPath)) {
    console.error('REFUSING: ' + outPath);
    console.error('is not gitignored. A live build quotes a real client deck verbatim and');
    console.error('website/ is a deployed tree. Add the directory to .gitignore first.');
    return 2;
  }

  const data = {
    review: Object.assign({}, review, { timeline: review.timeline || deriveTimeline(review) }),
    pages: derivePages(review, caseId),
    // portfolio and practice are cross-team and longitudinal. No single real review can
    // supply them, and the app already hides directions D when they are absent, so they are
    // omitted rather than faked. Showing invented data beside real data is the one thing
    // this build must never do.
    notice: '<b>Live review of a real client deliverable.</b> Every quote below is verbatim ' +
      'from the deck. Internal use only — do not screenshot, forward or publish. ' +
      'Directions D are hidden: they need cross-team data no single review carries.',
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, render(data));

  const t = data.review.timeline;
  console.log('built ' + path.relative(REPO, outPath).replace(/\\/g, '/') + '  (gitignored, confirmed)');
  console.log('  case         ' + (caseId || 'unknown'));
  console.log('  source       ' + path.relative(REPO, path.resolve(reviewPath)).replace(/\\/g, '/'));
  console.log('  readiness    ' + review.readiness.level);
  console.log('  findings     ' + review.findings.length +
    '   blocking rules ' + ((review.blockingIssues || []).map(b => b.rule).join(', ') || 'none'));
  console.log('  pages        ' + data.pages.length +
    (data.pages.some(p => !/^Page \d+$/.test(p.label)) ? ' (real labels from the case file)' : ' (bare numbering, no case file found)'));
  console.log('  timeline     ' + t.tiles.length + ' tiles, ' + t.callouts.length +
    ' callouts, ' + t.connectors.length + ' connectors (derived from the review\'s own evidence)');
  return 0;
}

// ---- main ------------------------------------------------------------------
const USAGE = [
  'build-desk.js — one template, two datasets.',
  '',
  '  --extract                    index.html -> template.html + data-fabricated.json',
  '  --fabricated                 rebuild the tracked index.html from the template',
  '  --verify                     prove the round trip is lossless',
  '  --live --review <path>       build live/index.html from a real review JSON',
  '         [--case real-13] [--out <path>]',
  '',
  'live builds quote real client decks and are refused unless the output path is gitignored.',
].join('\n');

function main(argv) {
  if (!argv.length || argv.includes('--help') || argv.includes('-h')) { console.log(USAGE); return 0; }
  if (argv.includes('--extract')) return extract();
  if (argv.includes('--verify')) return verify();
  if (argv.includes('--live')) return live(argv);
  if (argv.includes('--fabricated')) {
    fs.writeFileSync(INDEX, render(JSON.parse(fs.readFileSync(FABRICATED, 'utf8'))));
    console.log('rebuilt index.html from template.html + data-fabricated.json');
    return 0;
  }
  console.error('unrecognised arguments: ' + argv.join(' ') + '\n');
  console.error(USAGE);
  return 2;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));
