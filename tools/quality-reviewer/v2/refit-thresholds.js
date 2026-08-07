/* Fit T_NEAR and T_HIT to human-equivalent judgement instead of to fabricated fixtures.

   Inputs, all under eval-runs/real-baseline/threshold-refit/ (gitignored):
     adjudication-A.json   independent adjudicator A, blind to the scores
     adjudication-B.json   independent adjudicator B, blind to A and to the scores
     adjudication-C.json   optional tie-break on the pairs where A and B disagreed
     answer-key.json       the matcher's textScore and support per pair

   What it reports, in order, because the order matters:

   1. Do the two adjudicators agree with each other? If they do not, nothing downstream is
      worth reading, because there is no stable target to fit to. Reported as raw agreement
      and Cohen's kappa.
   2. Is textScore separable at all? Fitting a cut point presumes one exists. If the score
      distributions for "caught" and "not caught" sit on top of each other, no threshold
      helps and the honest finding is that the text-overlap score is the wrong instrument,
      not that the cut point is in the wrong place. Reported as AUC.
   3. Only then, where the cut points belong, swept over a grid and scored by F1.

   Usage: node refit-thresholds.js [--apply]
          --apply rewrites T_HIT/T_NEAR in score-review.js and bumps MATCHER_VERSION. */
'use strict';
const fs = require('fs');
const path = require('path');

const V2 = __dirname;
const DIR = path.join(V2, 'eval-runs', 'real-baseline', 'threshold-refit');
const SCORER = path.join(V2, 'score-review.js');
const APPLY = process.argv.includes('--apply');

function load(f, optional) {
  const p = path.join(DIR, f);
  if (!fs.existsSync(p)) {
    if (optional) return null;
    console.error('missing ' + f + '. Run the adjudicators first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const A = load('adjudication-A.json');
const B = load('adjudication-B.json');
const C = load('adjudication-C.json', true);
const KEY = load('answer-key.json');

const keyById = new Map(KEY.key.map(k => [k.id, k]));
const a = new Map(A.adjudications.map(x => [x.id, x.verdict]));
const b = new Map(B.adjudications.map(x => [x.id, x.verdict]));
const c = C ? new Map(C.adjudications.map(x => [x.id, x.verdict])) : new Map();

const ids = [...a.keys()].filter(id => b.has(id) && keyById.has(id));
const onlyA = [...a.keys()].filter(id => !b.has(id));
const onlyB = [...b.keys()].filter(id => !a.has(id));

console.log('=== 1. Do the adjudicators agree? ===\n');
console.log('pairs adjudicated by both   ' + ids.length +
  (onlyA.length || onlyB.length ? '   (A only ' + onlyA.length + ', B only ' + onlyB.length + ')' : ''));

const LEVELS = ['no', 'partial', 'yes'];
let agree = 0;
const confusion = {};
for (const L1 of LEVELS) for (const L2 of LEVELS) confusion[L1 + '|' + L2] = 0;
for (const id of ids) {
  const x = a.get(id), y = b.get(id);
  if (x === y) agree++;
  confusion[x + '|' + y]++;
}
const rawAgree = agree / ids.length;

/* Cohen's kappa over the three labels. */
const countA = {}, countB = {};
for (const L of LEVELS) { countA[L] = 0; countB[L] = 0; }
for (const id of ids) { countA[a.get(id)]++; countB[b.get(id)]++; }
const pe = LEVELS.reduce((s, L) => s + (countA[L] / ids.length) * (countB[L] / ids.length), 0);
const kappa = (rawAgree - pe) / (1 - pe);

console.log('raw agreement               ' + (rawAgree * 100).toFixed(1) + '%');
console.log('Cohen\'s kappa               ' + kappa.toFixed(3) + '   ' + kappaLabel(kappa));
console.log('\nconfusion (rows A, cols B):');
console.log('          ' + LEVELS.map(l => l.padStart(8)).join(''));
for (const L1 of LEVELS)
  console.log(L1.padEnd(10) + LEVELS.map(L2 => String(confusion[L1 + '|' + L2]).padStart(8)).join(''));

function kappaLabel(k) {
  if (k < 0.2) return '(poor: the target is not stable, stop here)';
  if (k < 0.4) return '(fair: weak, treat any fit as provisional)';
  if (k < 0.6) return '(moderate)';
  if (k < 0.8) return '(substantial)';
  return '(near complete)';
}

/* ---- consensus label ---------------------------------------------------- */
const disagreements = [];
const consensus = new Map();
for (const id of ids) {
  const x = a.get(id), y = b.get(id);
  if (x === y) { consensus.set(id, x); continue; }
  if (c.has(id)) { consensus.set(id, c.get(id)); continue; }
  disagreements.push({ id, A: x, B: y });
  /* Without a tie-break, take the more conservative of the two. A pair one adjudicator
   * called "yes" and the other "no" is not evidence that it was caught. */
  consensus.set(id, LEVELS[Math.min(LEVELS.indexOf(x), LEVELS.indexOf(y))]);
}
if (disagreements.length && !C) {
  fs.writeFileSync(path.join(DIR, 'disagreements.json'),
    JSON.stringify({ note: 'A and B split on these. Adjudicate into adjudication-C.json to break the ties.', count: disagreements.length, disagreements }, null, 1));
  console.log('\n' + disagreements.length + ' unresolved disagreements written to disagreements.json');
  console.log('(resolved conservatively for now: the lower of the two labels)');
}

/* ---- 2. separability ---------------------------------------------------- */
console.log('\n\n=== 2. Is textScore separable at all? ===\n');

const rows = ids.map(id => ({ id, label: consensus.get(id), ...keyById.get(id) }));
const caught = rows.filter(r => r.label === 'yes');
const notCaught = rows.filter(r => r.label === 'no');
const partial = rows.filter(r => r.label === 'partial');

function stats(xs) {
  if (!xs.length) return 'n=0';
  const v = xs.map(r => r.textScore).sort((p, q) => p - q);
  const mean = v.reduce((s, x) => s + x, 0) / v.length;
  return 'n=' + String(v.length).padStart(3) + '  min ' + v[0].toFixed(3) +
    '  median ' + v[Math.floor(v.length / 2)].toFixed(3) +
    '  mean ' + mean.toFixed(3) + '  max ' + v[v.length - 1].toFixed(3);
}
console.log('consensus yes      ' + stats(caught));
console.log('consensus partial  ' + stats(partial));
console.log('consensus no       ' + stats(notCaught));

/* AUC by the Mann-Whitney U identity: the probability a random caught pair outscores a
 * random not-caught pair. 0.5 is a coin, 1.0 is perfect separation. */
function auc(pos, neg) {
  if (!pos.length || !neg.length) return NaN;
  let wins = 0;
  for (const p of pos) for (const n of neg) {
    if (p.textScore > n.textScore) wins++;
    else if (p.textScore === n.textScore) wins += 0.5;
  }
  return wins / (pos.length * neg.length);
}
const aucHit = auc(caught, notCaught.concat(partial));
const aucNear = auc(caught.concat(partial), notCaught);
console.log('\nAUC, yes vs (partial+no)   ' + fmt(aucHit) + '   ' + aucLabel(aucHit));
console.log('AUC, (yes+partial) vs no   ' + fmt(aucNear) + '   ' + aucLabel(aucNear));

function fmt(x) { return isNaN(x) ? 'n/a' : x.toFixed(3); }
function aucLabel(x) {
  if (isNaN(x)) return '';
  if (x < 0.6) return '<- barely better than a coin. No cut point will fix this.';
  if (x < 0.7) return '<- weak separation';
  if (x < 0.8) return '<- usable';
  if (x < 0.9) return '<- good';
  return '<- strong';
}

/* ---- 3. fit ------------------------------------------------------------- */
console.log('\n\n=== 3. Where do the cut points belong? ===\n');

const CUR = { hit: 0.45, near: 0.28 };

/* Reproduce the verdict rule from scorePair exactly. */
function verdictFor(r, tHit, tNear) {
  if (r.textScore >= tHit && r.support >= 2) return 'hit';
  if ((r.textScore >= tNear && r.support >= 2) || (r.textScore >= tHit && r.support === 1)) return 'near';
  return 'miss';
}
function prf(pred, truth) {
  let tp = 0, fp = 0, fn = 0;
  for (let i = 0; i < pred.length; i++) {
    if (pred[i] && truth[i]) tp++;
    else if (pred[i] && !truth[i]) fp++;
    else if (!pred[i] && truth[i]) fn++;
  }
  const p = tp + fp ? tp / (tp + fp) : 0;
  const r = tp + fn ? tp / (tp + fn) : 0;
  return { p, r, f1: p + r ? 2 * p * r / (p + r) : 0, tp, fp, fn };
}

const grid = [];
for (let h = 0.20; h <= 0.90; h += 0.01) grid.push(Number(h.toFixed(2)));

/* T_HIT: predict "hit", target is consensus "yes". */
let bestHit = null;
for (const h of grid) {
  const pred = rows.map(r => verdictFor(r, h, 0) === 'hit');
  const truth = rows.map(r => r.label === 'yes');
  const s = prf(pred, truth);
  if (!bestHit || s.f1 > bestHit.f1) bestHit = { t: h, ...s };
}
/* T_NEAR: predict "hit or near", target is consensus "yes or partial". */
let bestNear = null;
for (const n of grid) {
  if (n > bestHit.t) continue;
  const pred = rows.map(r => verdictFor(r, bestHit.t, n) !== 'miss');
  const truth = rows.map(r => r.label === 'yes' || r.label === 'partial');
  const s = prf(pred, truth);
  if (!bestNear || s.f1 > bestNear.f1) bestNear = { t: n, ...s };
}

function line(name, t, s) {
  return name.padEnd(12) + t.toFixed(2) +
    '   precision ' + (s.p * 100).toFixed(0).padStart(3) + '%' +
    '   recall ' + (s.r * 100).toFixed(0).padStart(3) + '%' +
    '   F1 ' + s.f1.toFixed(3) +
    '   (tp ' + s.tp + ' fp ' + s.fp + ' fn ' + s.fn + ')';
}
const curHit = prf(rows.map(r => verdictFor(r, CUR.hit, CUR.near) === 'hit'), rows.map(r => r.label === 'yes'));
const curNear = prf(rows.map(r => verdictFor(r, CUR.hit, CUR.near) !== 'miss'), rows.map(r => r.label === 'yes' || r.label === 'partial'));

console.log('current (fitted to fabricated fixtures):');
console.log('  ' + line('T_HIT', CUR.hit, curHit));
console.log('  ' + line('T_NEAR', CUR.near, curNear));
console.log('\nfitted to the adjudications:');
console.log('  ' + line('T_HIT', bestHit.t, bestHit));
console.log('  ' + line('T_NEAR', bestNear.t, bestNear));
console.log('\nF1 change   T_HIT ' + (curHit.f1).toFixed(3) + ' -> ' + bestHit.f1.toFixed(3) +
  '    T_NEAR ' + (curNear.f1).toFixed(3) + ' -> ' + bestNear.f1.toFixed(3));

/* What this does to the headline metric: must-catch verdicts across the 12 runs. */
console.log('\n\n=== 4. Effect on the must-catch verdict, the metric that flipped ===\n');
const mc = {};
for (const r of rows.filter(x => x.mustCatch)) {
  const k = r.case + ' run-' + r.run;
  const old = verdictFor(r, CUR.hit, CUR.near);
  const neu = verdictFor(r, bestHit.t, bestNear.t);
  if (!mc[k]) mc[k] = { old: 'miss', neu: 'miss' };
  const rank = v => ({ miss: 0, near: 1, hit: 2 }[v]);
  if (rank(old) > rank(mc[k].old)) mc[k].old = old;
  if (rank(neu) > rank(mc[k].neu)) mc[k].neu = neu;
}
const keys = Object.keys(mc).sort();
console.log('case / run'.padEnd(22) + 'before'.padEnd(10) + 'after');
for (const k of keys) {
  const ch = mc[k].old === mc[k].neu ? '' : '   <- changed';
  console.log(k.padEnd(22) + mc[k].old.padEnd(10) + mc[k].neu + ch);
}
const changed = keys.filter(k => mc[k].old !== mc[k].neu).length;
console.log('\n' + changed + ' of ' + keys.length + ' must-catch verdicts change under the new cut points.');

/* ---- apply -------------------------------------------------------------- */
if (!APPLY) {
  console.log('\n\nDry run. Re-run with --apply to write these into score-review.js and bump MATCHER_VERSION.');
  process.exit(0);
}
if (isNaN(aucHit) || aucHit < 0.6) {
  console.error('\nREFUSING TO APPLY: AUC ' + fmt(aucHit) + ' says textScore barely separates caught from not-caught.');
  console.error('Moving the cut point cannot fix an instrument that is not discriminating. Report this instead.');
  process.exit(1);
}
if (kappa < 0.2) {
  console.error('\nREFUSING TO APPLY: adjudicator kappa ' + kappa.toFixed(3) + ' is too low to fit against.');
  process.exit(1);
}

let src = fs.readFileSync(SCORER, 'utf8');
const before = src;
src = src.replace(/const MATCHER_VERSION = '([^']+)';/, (m, v) => {
  const n = v.replace(/(\d+)$/, (d) => String(+d + 1));
  console.log('\nMATCHER_VERSION ' + v + ' -> ' + n);
  return "const MATCHER_VERSION = '" + n + "';";
});
src = src.replace(/const T_HIT = [\d.]+;/, 'const T_HIT = ' + bestHit.t + ';');
src = src.replace(/const T_NEAR = [\d.]+;/, 'const T_NEAR = ' + bestNear.t + ';');
src = src.replace(/\/\* Thresholds\. These are UNVALIDATED[\s\S]*?\*\//,
  '/* Thresholds. Fitted 2026-08-05 against ' + ids.length + ' blind pair adjudications from two\n' +
  ' * independent adjudicators (raw agreement ' + (rawAgree * 100).toFixed(0) + '%, kappa ' + kappa.toFixed(2) + ') over the twelve\n' +
  ' * stability runs. AUC of textScore against the consensus label was ' + fmt(aucHit) + '. Method and\n' +
  ' * result in 21-scorer-refit-sprint.md. Scores are NOT comparable across MATCHER_VERSION. */');
if (src === before) { console.error('nothing was replaced, check the patterns'); process.exit(1); }
fs.writeFileSync(SCORER, src);
console.log('T_HIT  ' + CUR.hit + ' -> ' + bestHit.t);
console.log('T_NEAR ' + CUR.near + ' -> ' + bestNear.t);
console.log('\nwrote score-review.js. Every previously scored result is now stale: re-score before comparing.');
