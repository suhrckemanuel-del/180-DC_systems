/* Re-score a finished run under the current MATCHER_VERSION.

   Scores are not comparable across matcher versions. When the thresholds moved on
   2026-08-05 (mc-match-1 to mc-match-2, fitted against 178 blind adjudications, see
   21-scorer-refit-sprint.md) every previously written *.score.json became stale, and
   scorecard.js only aggregates whatever score files it finds. Without this step the
   baseline table silently mixes matcher versions, which is the one thing the log key was
   designed to prevent.

   This re-runs the matcher only. No model call, no new review, no change to any review.json.
   The review text and the gold are both fixed inputs; the only thing that moves is the
   matcher. Run metadata (model, effort, prompt version, contract validity) is carried over
   from the existing score file so the re-score is a pure matcher swap and nothing else.

   Usage: node rescore.js <run-dir> [--dry-run]

   Re-run scorecard.js afterwards to regenerate the aggregate. */
'use strict';
const fs = require('fs');
const path = require('path');
const { parseGold, scoreReview, MATCHER_VERSION } = require('./score-review.js');

const V2 = __dirname;
const GOLD_DIR = path.join(V2, 'eval-cases-real', 'labeling');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const dir = args.filter(a => !a.startsWith('--'))[0];

if (!dir) { console.error('usage: node rescore.js <run-dir> [--dry-run]'); process.exit(2); }
if (!fs.existsSync(dir)) { console.error('no such directory: ' + dir); process.exit(2); }

const manifestPath = path.join(dir, 'run-manifest.json');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};

console.log('run dir         ' + dir);
console.log('matcher now     ' + MATCHER_VERSION);
console.log('manifest says   ' + (manifest.matcherVersion || 'not recorded'));
console.log('');

const reviews = fs.readdirSync(dir).filter(f => f.endsWith('.review.json')).sort();
if (!reviews.length) { console.error('no *.review.json in that directory'); process.exit(2); }

let done = 0, skipped = 0, changed = 0;
const moves = [];

for (const f of reviews) {
  const caseId = f.replace('.review.json', '');
  const goldFile = path.join(GOLD_DIR, caseId + '.gold.md');
  if (!fs.existsSync(goldFile)) {
    console.log('  skip ' + caseId + '  (no gold)');
    skipped++;
    continue;
  }

  const review = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const gold = parseGold(goldFile);
  const scorePath = path.join(dir, caseId + '.score.json');
  const old = fs.existsSync(scorePath) ? JSON.parse(fs.readFileSync(scorePath, 'utf8')) : null;

  /* Carry the run metadata across untouched: this step must change the matcher and
   * nothing else, or the comparison it exists to enable is not clean. */
  const extra = Object.assign({}, (old && old.run) || {}, { reviewFile: f });
  const fresh = scoreReview(review, gold, extra);

  const before = old && old.mustCatch ? old.mustCatch.verdict : null;
  const after = fresh.mustCatch ? fresh.mustCatch.verdict : null;
  if (before !== after) {
    changed++;
    moves.push({ caseId, before, after });
  }

  if (!dryRun) fs.writeFileSync(scorePath, JSON.stringify(fresh, null, 2));
  console.log('  ' + caseId.padEnd(10) +
    (old ? (old.matcherVersion || '?') : 'new').padEnd(14) + '-> ' + MATCHER_VERSION.padEnd(14) +
    'must-catch ' + String(before).padEnd(6) + '-> ' + String(after) +
    (before !== after ? '   <- changed' : ''));
  done++;
}

if (!dryRun && fs.existsSync(manifestPath)) {
  manifest.matcherVersion = MATCHER_VERSION;
  manifest.rescoredAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

console.log('\n' + done + ' re-scored, ' + skipped + ' skipped, ' + changed + ' must-catch verdicts moved');
if (moves.length) {
  console.log('\nmoved:');
  for (const m of moves) console.log('  ' + m.caseId.padEnd(10) + m.before + ' -> ' + m.after);
}
if (dryRun) console.log('\ndry run, nothing written');
else console.log('\nnow re-run: node scorecard.js "' + dir + '"');
