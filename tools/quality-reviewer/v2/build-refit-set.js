/* Build the blind adjudication set for the T_NEAR / T_HIT re-fit.

   score-review.js has carried this comment since it was written:

     Thresholds. These are UNVALIDATED until the first real baseline run: they were
     calibrated against fabricated fixtures. Re-check them once real verdicts are
     settled, and bump MATCHER_VERSION if they move.

   That re-check never happened, and the gate stop of 2026-08-03 showed why it matters: the
   must-catch verdict flips between miss and near on three of four stability cases under a
   frozen prompt on identical input, one flip decided by 0.005. Communication-typed findings
   sit in that band by construction, so nothing about the 08-05 prompt edits can be measured
   until the cut points are fitted to human judgement instead of to fixtures.

   This script produces the material for that judgement. For every (gold issue, review
   finding) pair across the stability runs it emits the two texts and nothing else. The
   textScore, the verdict and the three support signals are all withheld, because an
   adjudicator who can see the number will agree with the number and the fit will be
   circular. Scores are written to a separate answer key that the adjudicators never read.

   CONFIDENTIALITY. Gold anchors and finding text both quote real client deliverables. The
   output goes under eval-runs/real-baseline/, which is gitignored as a whole tree. This
   script refuses to write anywhere else.

   Usage: node build-refit-set.js */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./score-review.js');

const V2 = __dirname;
const STAB = path.join(V2, 'eval-runs', 'real-baseline', 'stability');
const GOLD_DIR = path.join(V2, 'eval-cases-real', 'labeling');
const OUT = path.join(V2, 'eval-runs', 'real-baseline', 'threshold-refit');

/* Hard stop: the output must sit inside the gitignored real-baseline tree. */
if (!OUT.includes(path.join('eval-runs', 'real-baseline'))) {
  console.error('refusing to write outside eval-runs/real-baseline/');
  process.exit(1);
}

const RUNS = ['_collect-a', '_collect-b', '_collect-c'];

/* A deterministic shuffle, so the adjudication order carries no signal from the score
 * ordering but the set is reproducible. */
function seededShuffle(arr, seed) {
  let s = seed;
  const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clip(s, n) {
  s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n) + '...' : s;
}

const pairs = [];
const key = [];
let runsSeen = 0, missingGold = 0;

for (const run of RUNS) {
  const dir = path.join(STAB, run);
  if (!fs.existsSync(dir)) { console.error('missing run dir: ' + run); continue; }
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.review.json')) continue;
    const caseId = f.replace('.review.json', '');
    const review = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const goldFile = path.join(GOLD_DIR, caseId + '.gold.md');
    if (!fs.existsSync(goldFile)) { missingGold++; continue; }
    const gold = S.parseGold(goldFile);
    runsSeen++;

    const issues = gold.issues || [];
    const findings = review.findings || [];
    for (const gi of issues) {
      findings.forEach((fd, idx) => {
        const sp = S._scorePair(gi, fd, idx, review);
        const id = caseId + '-' + run.replace('_collect-', '') + '-g' + gi.rank + '-f' + idx;
        pairs.push({
          id,
          goldIssue: {
            anchor: gi.anchor,
            detail: clip(gi.text, 700),
            severity: gi.severity,
            dimension: gi.dimension,
            type: gi.type,
            mustCatch: !!gi.mustCatch,
            location: (gi.at && gi.at.raw) || 'not stated',
          },
          reviewFinding: {
            short: fd.short,
            title: fd.title,
            diagnosis: clip(fd.diagnosis, 700),
            why: clip(fd.why, 400),
            severity: fd.severity,
            issueType: fd.issueType,
            evidence: (fd.evidence || []).slice(0, 2).map(e => ({ slide: e.slide, quote: clip(e.quote, 260) })),
          },
        });
        key.push({
          id, case: caseId, run: run.replace('_collect-', ''),
          goldRank: gi.rank, mustCatch: !!gi.mustCatch, findingIndex: idx,
          textScore: sp.textScore, anchorCoverage: sp.anchorCoverage, bodyCoverage: sp.bodyCoverage,
          support: sp.support, slideOk: sp.slide.ok, typeOk: sp.type.ok, dimOk: sp.dimension.ok,
          currentVerdict: sp.verdict,
        });
      });
    }
  }
}

fs.mkdirSync(OUT, { recursive: true });

/* Subset. Adjudicating all 282 pairs would spend most of the effort on pairs that share no
 * vocabulary at all, which tell you nothing about where the cut point belongs. Take every
 * pair near the decision boundary, plus controls from well above and well below it. The
 * controls are the check on the adjudicator: an adjudicator who calls a 0.9 pair "no" or a
 * 0.02 pair "yes" is not reading carefully, and that is worth knowing before their
 * judgements are used to move a threshold. */
const BAND_LO = 0.12, BAND_HI = 0.65, N_CONTROL = 15;
const scoreOf = new Map(key.map(k => [k.id, k.textScore]));
const inBand = pairs.filter(p => { const t = scoreOf.get(p.id); return t >= BAND_LO && t <= BAND_HI; });
const highs = seededShuffle(pairs.filter(p => scoreOf.get(p.id) > BAND_HI), 11).slice(0, N_CONTROL);
const lows = seededShuffle(pairs.filter(p => scoreOf.get(p.id) < BAND_LO), 22).slice(0, N_CONTROL);
const selected = inBand.concat(highs, lows);

const shuffled = seededShuffle(selected, 20260805);
const task = {
  task: 'threshold-refit-adjudication-1',
  builtAt: new Date().toISOString(),
  question:
    'For each pair: does the review finding catch the gold issue? Answer "yes" if a project ' +
    'lead reading the review would consider that gold issue raised, "partial" if the review ' +
    'gestures at it but a lead would not count it as caught, "no" otherwise. One sentence of ' +
    'reasoning per pair. You are NOT told the matcher score and must not try to infer it.',
  answerFormat: '{ "adjudications": [ { "id": "...", "verdict": "yes|partial|no", "why": "..." } ] }',
  pairCount: shuffled.length,
  pairs: shuffled,
};

fs.writeFileSync(path.join(OUT, 'adjudication-set.json'), JSON.stringify(task, null, 1));
fs.writeFileSync(path.join(OUT, 'answer-key.json'), JSON.stringify({ builtAt: task.builtAt, key }, null, 1));

const band = key.filter(k => k.textScore >= 0.15 && k.textScore <= 0.60).length;
console.log('runs scored          ' + runsSeen + (missingGold ? ('  (' + missingGold + ' skipped, no gold)') : ''));
console.log('pairs emitted        ' + pairs.length);
console.log('  in the 0.15-0.60 ambiguous band  ' + band);
console.log('  currently hit      ' + key.filter(k => k.currentVerdict === 'hit').length);
console.log('  currently near     ' + key.filter(k => k.currentVerdict === 'near').length);
console.log('  currently miss     ' + key.filter(k => k.currentVerdict === 'miss').length);
console.log('\nwrote ' + path.relative(V2, path.join(OUT, 'adjudication-set.json')) + '  (no scores in it)');
console.log('wrote ' + path.relative(V2, path.join(OUT, 'answer-key.json')) + '  (scores, adjudicators never read this)');
