#!/usr/bin/env node
/*
 * scorecard.js — aggregate one run into the baseline number.
 *
 * BRICK 3 and BRICK 4 of the calibration engine. No API, no network.
 *
 * Reads a run directory produced by run-reviews.js (run-manifest.json plus one
 * <case>.score.json each) and emits:
 *   - scorecard.json   the machine-readable aggregate
 *   - scorecard.md     the readable summary, per-case table and failure patterns
 *   - an append-only line in scores-log.jsonl, keyed by prompt version, model, effort
 *     and matcher version, so runs under different settings are never averaged together
 *
 * LOOP DISCIPLINE (brick 4). Three cases are held out: the restraint case and two others.
 * They are scored and reported every time and are never to be tuned toward. The headline
 * number is reported for the tuning set, the holdout and the full set separately, so a
 * gain that only shows up on the tuning set is visible as exactly that.
 *
 * Usage:
 *   node scorecard.js <run-dir>      aggregate one run
 *   node scorecard.js --latest       aggregate the most recent run
 *   node scorecard.js --log          print the append-only log
 */
'use strict';
const fs = require('fs');
const path = require('path');

const V2 = __dirname;
const OUT_ROOT = path.join(V2, 'eval-runs', 'real-baseline');
const LOG = path.join(OUT_ROOT, 'scores-log.jsonl');

/* The holdout. real-05 is the restraint case (the reviewer's known weakness is
 * over-flagging strong work, and real-05 is the real-data analogue). real-08 covers R0 and
 * real-13 covers R2, so the holdout spans the range without taking the only R1 case out of
 * the tuning set. Fixed here on purpose: a holdout that moves is not a holdout. */
const HOLDOUT = ['real-05', 'real-08', 'real-13'];

const pct = (k, n) => (n === 0 ? null : Math.round(1000 * k / n) / 10);
const fmt = v => (v === null ? '  n/a' : String(v).padStart(5) + '%');

function loadRun(dir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'run-manifest.json'), 'utf8'));
  const scores = fs.readdirSync(dir).filter(f => f.endsWith('.score.json')).sort()
    .map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  return { dir, manifest, scores };
}

function latestRun() {
  if (!fs.existsSync(OUT_ROOT)) return null;
  const dirs = fs.readdirSync(OUT_ROOT)
    .map(d => path.join(OUT_ROOT, d))
    .filter(d => fs.existsSync(path.join(d, 'run-manifest.json')))
    .sort();
  return dirs.length ? dirs[dirs.length - 1] : null;
}

// ---- the metrics ----------------------------------------------------------
function aggregate(scores) {
  const n = scores.length;
  const withMustCatch = scores.filter(s => s.mustCatch.present);
  const restraint = scores.filter(s => s.restraint.isRestraintCase);
  const withSeverity = scores.filter(s => s.severityAlignment);

  return {
    cases: n,
    // headline
    readinessWithinOne: pct(scores.filter(s => s.readiness.withinOne).length, n),
    readinessExact: pct(scores.filter(s => s.readiness.exact).length, n),
    mustCatchRecall: pct(withMustCatch.filter(s => s.mustCatch.verdict === 'hit').length, withMustCatch.length),
    // the same recall counting the near misses a human might adjudicate as hits. Reported
    // as an upper bound, never as the number.
    mustCatchRecallUpperBound: pct(withMustCatch.filter(s => ['hit', 'near'].includes(s.mustCatch.verdict)).length, withMustCatch.length),
    mustCatchCases: withMustCatch.length,
    // the known weakness, first class
    overFlagRateAll: pct(scores.filter(s => s.restraint.overFlag).length, n),
    underFlagRateAll: pct(scores.filter(s => s.readiness.direction === 'under-flag').length, n),
    restraintCases: restraint.length,
    restraintViolations: restraint.filter(s => s.restraint.violation).length,
    restraintViolationRate: pct(restraint.filter(s => s.restraint.violation).length, restraint.length),
    blockingFalsePositiveRate: pct(scores.filter(s => s.restraint.blockingFalsePositive).length, n),
    blockingMissRate: pct(scores.filter(s => s.restraint.goldFiredBlocking && s.restraint.reviewBlockingCount === 0).length,
      scores.filter(s => s.restraint.goldFiredBlocking).length),
    // severity on the matched must-catch
    severityExact: pct(withSeverity.filter(s => s.severityAlignment.exact).length, withSeverity.length),
    severityCases: withSeverity.length,
    // secondary
    goldIssueCoverage: pct(
      scores.reduce((a, s) => a + s.issueCoverage.hits, 0),
      scores.reduce((a, s) => a + s.issueCoverage.goldIssues, 0)),
    meanFindings: n ? Math.round(10 * scores.reduce((a, s) => a + s.reviewShape.findings, 0) / n) / 10 : null,
  };
}

function failurePatterns(scores, manifest) {
  const out = [];
  const bad = (manifest.cases || []).filter(c => c.status === 'ok' && c.contractValid === false);
  if (bad.length) out.push({ pattern: 'contract-invalid reviews', cases: bad.map(c => c.case), note: 'the validator rejected the JSON, see contractReport in the manifest' });
  const broken = (manifest.cases || []).filter(c => ['error', 'refused', 'unparseable'].includes(c.status));
  if (broken.length) out.push({ pattern: 'runs that did not produce a review', cases: broken.map(c => c.case + ' (' + c.status + ')'), note: 'excluded from every metric above' });

  const over = scores.filter(s => s.restraint.overFlag);
  if (over.length) out.push({ pattern: 'escalated above the gold', cases: over.map(s => s.case + ' by ' + s.restraint.escalationSteps), note: 'the known weakness. On a restraint case this is a scored failure' });
  const under = scores.filter(s => s.readiness.direction === 'under-flag');
  if (under.length) out.push({ pattern: 'softer than the gold', cases: under.map(s => s.case + ' by ' + s.readiness.delta), note: 'the rubric errs toward Nearly ready by design, so some of this is expected' });

  const misses = scores.filter(s => s.mustCatch.verdict === 'miss');
  if (misses.length) {
    out.push({ pattern: 'must-catch missed entirely', cases: misses.map(s => s.case), note: 'no finding came close to the one issue the human said must be found' });
    const byDim = {};
    for (const s of misses) byDim[s.mustCatch.gold.dimension] = (byDim[s.mustCatch.gold.dimension] || 0) + 1;
    const repeated = Object.entries(byDim).filter(([, c]) => c > 1).sort((a, b) => b[1] - a[1]);
    if (repeated.length) out.push({ pattern: 'misses cluster on a dimension', cases: repeated.map(([d, c]) => d + ' x' + c), note: 'a dimension the reviewer may systematically underweight' });
  }
  const nears = scores.filter(s => s.mustCatch.verdict === 'near');
  if (nears.length) out.push({ pattern: 'near misses awaiting human adjudication', cases: nears.map(s => s.case), note: 'right concept, one supporting signal short. Read the match basis and decide' });

  const fps = scores.filter(s => s.falsePositiveWatch.length);
  if (fps.length) out.push({ pattern: 'findings overlapping the gold false-positive list', cases: fps.map(s => s.case), note: 'advisory only, check whether the reviewer flagged an extraction artifact' });

  const blockMiss = scores.filter(s => s.restraint.goldFiredBlocking && s.restraint.reviewBlockingCount === 0);
  if (blockMiss.length) out.push({ pattern: 'gold fired a blocking rule, review fired none', cases: blockMiss.map(s => s.case), note: 'the deck should have been capped and was not' });
  return out;
}

// ---- rendering ------------------------------------------------------------
function renderCaseTable(scores) {
  const head = 'case      set    gold  pred  d   must-catch  sev        blocking(g/r)  findings';
  const rows = scores.map(s => [
    s.case.padEnd(9),
    (HOLDOUT.includes(s.case) ? 'hold ' : 'tune ').padEnd(6),
    ('R' + s.readiness.goldIdx).padEnd(5),
    ('R' + s.readiness.predIdx).padEnd(5),
    String(s.readiness.delta === null ? '?' : (s.readiness.delta > 0 ? '+' + s.readiness.delta : s.readiness.delta)).padEnd(3),
    s.mustCatch.verdict.padEnd(11),
    (s.severityAlignment ? (s.severityAlignment.exact ? 'exact' : s.severityAlignment.direction) : '-').padEnd(10),
    ((s.restraint.goldFiredBlocking ? 'yes' : 'no') + '/' + s.restraint.reviewBlockingCount).padEnd(14),
    String(s.reviewShape.findings),
  ].join(' '));
  return [head, ...rows].join('\n');
}

function renderScorecard(card) {
  const L = [];
  const m = card.manifest;
  L.push('BASELINE SCORECARD');
  L.push('run          ' + path.basename(card.dir));
  L.push('prompt       ' + m.promptVersion + '  sha256:' + m.promptSha256);
  L.push('model        ' + m.model + ', effort ' + m.effort + ', thinking ' + m.thinking + ', mode ' + m.mode);
  L.push('matcher      ' + m.matcherVersion);
  L.push('finished     ' + m.finishedAt);
  L.push('');
  L.push('HEADLINE (full set, n=' + card.all.cases + ')');
  L.push('  readiness within one level   ' + fmt(card.all.readinessWithinOne));
  L.push('  readiness exact              ' + fmt(card.all.readinessExact));
  L.push('  must-catch recall            ' + fmt(card.all.mustCatchRecall) + '   (upper bound counting near misses ' + fmt(card.all.mustCatchRecallUpperBound) + ')');
  L.push('  over-flag rate               ' + fmt(card.all.overFlagRateAll) + '   the known weakness, escalating above the gold');
  L.push('  restraint violations         ' + card.all.restraintViolations + ' of ' + card.all.restraintCases + ' restraint case(s)');
  L.push('  severity exact on the match  ' + fmt(card.all.severityExact) + '   (n=' + card.all.severityCases + ')');
  L.push('');
  L.push('SPLIT (the holdout is reported, never tuned toward: ' + HOLDOUT.join(', ') + ')');
  L.push('                               tuning        holdout');
  const line = (label, key) => L.push('  ' + label.padEnd(29) + fmt(card.tuning[key]) + '        ' + fmt(card.holdout[key]));
  line('readiness within one', 'readinessWithinOne');
  line('readiness exact', 'readinessExact');
  line('must-catch recall', 'mustCatchRecall');
  line('over-flag rate', 'overFlagRateAll');
  L.push('  ' + 'cases'.padEnd(29) + String(card.tuning.cases).padStart(6) + '        ' + String(card.holdout.cases).padStart(6));
  L.push('');
  L.push('SECONDARY (full set)');
  L.push('  under-flag rate              ' + fmt(card.all.underFlagRateAll));
  L.push('  blocking false positives     ' + fmt(card.all.blockingFalsePositiveRate));
  L.push('  blocking rules missed        ' + fmt(card.all.blockingMissRate));
  L.push('  gold issue coverage          ' + fmt(card.all.goldIssueCoverage) + '   (all ranked gold issues, not just the must-catch)');
  L.push('  mean findings per review     ' + card.all.meanFindings);
  L.push('');
  L.push('PER CASE');
  L.push(renderCaseTable(card.scores));
  L.push('');
  L.push('FAILURE PATTERNS');
  if (!card.failurePatterns.length) L.push('  none detected');
  for (const p of card.failurePatterns) {
    L.push('  - ' + p.pattern + ': ' + p.cases.join(', '));
    L.push('      ' + p.note);
  }
  L.push('');
  L.push('READ THIS BEFORE QUOTING THE NUMBER');
  L.push('  - Must-catch matching is text overlap plus two of three supporting signals. It is');
  L.push('    deliberately conservative, so recall is a floor and the near misses are the band');
  L.push('    where a human call decides. Read the match basis in the per-case score files.');
  L.push('  - ' + card.all.cases + ' cases is a small sample. One case moves the headline by about ' +
    (card.all.cases ? Math.round(1000 / card.all.cases) / 10 : 0) + ' points.');
  L.push('  - Scores from different prompt versions, models, effort levels or matcher versions');
  L.push('    are not comparable. The log key carries all four.');
  return L.join('\n');
}

function renderShareable(card) {
  const m = card.manifest;
  return [
    'Reviewer v2 baseline, aggregate only (no client content, no gold labels)',
    '  cases                       ' + card.all.cases,
    '  readiness within one level  ' + fmt(card.all.readinessWithinOne),
    '  readiness exact             ' + fmt(card.all.readinessExact),
    '  must-catch recall           ' + fmt(card.all.mustCatchRecall),
    '  over-flag rate              ' + fmt(card.all.overFlagRateAll),
    '  prompt ' + m.promptVersion + ', model ' + m.model + ', effort ' + m.effort + ', matcher ' + m.matcherVersion,
  ].join('\n');
}

// ---- brick 4: append-only log --------------------------------------------
function appendLog(card) {
  const m = card.manifest;
  const entry = {
    at: new Date().toISOString(),
    run: path.basename(card.dir),
    key: [m.promptVersion, m.model, m.effort, m.matcherVersion].join('|'),
    promptVersion: m.promptVersion, promptSha256: m.promptSha256,
    model: m.model, effort: m.effort, mode: m.mode, matcherVersion: m.matcherVersion,
    all: card.all, tuning: card.tuning, holdout: card.holdout,
    holdoutCases: HOLDOUT,
    usage: m.usage, estimatedCostUsd: m.estimatedCostUsd,
  };
  fs.mkdirSync(path.dirname(LOG), { recursive: true });
  fs.appendFileSync(LOG, JSON.stringify(entry) + '\n');
  return entry;
}

function printLog() {
  if (!fs.existsSync(LOG)) { console.log('no scores log yet at ' + LOG); return; }
  const rows = fs.readFileSync(LOG, 'utf8').split(/\r?\n/).filter(Boolean).map(l => JSON.parse(l));
  console.log('date                 key                                                       n  w1     exact  recall  overflag');
  for (const r of rows) {
    console.log([
      r.at.slice(0, 19),
      r.key.padEnd(56).slice(0, 56),
      String(r.all.cases).padStart(2),
      fmt(r.all.readinessWithinOne), fmt(r.all.readinessExact),
      fmt(r.all.mustCatchRecall), fmt(r.all.overFlagRateAll),
    ].join(' '));
  }
}

// ---- main -----------------------------------------------------------------
function main(argv) {
  if (argv.includes('--log')) { printLog(); return 0; }
  let dir = argv.find(a => !a.startsWith('--'));
  if (argv.includes('--latest') || !dir) dir = latestRun();
  if (!dir) { console.error('usage: node scorecard.js <run-dir> | --latest | --log'); return 2; }
  dir = path.resolve(dir);

  const { manifest, scores } = loadRun(dir);
  if (!scores.length) { console.error('no .score.json files in ' + dir); return 2; }

  const card = {
    dir, manifest, scores,
    holdoutCases: HOLDOUT,
    all: aggregate(scores),
    tuning: aggregate(scores.filter(s => !HOLDOUT.includes(s.case))),
    holdout: aggregate(scores.filter(s => HOLDOUT.includes(s.case))),
  };
  card.failurePatterns = failurePatterns(scores, manifest);

  const text = renderScorecard(card);
  fs.writeFileSync(path.join(dir, 'scorecard.json'), JSON.stringify(card, null, 2));
  fs.writeFileSync(path.join(dir, 'scorecard.md'), '```\n' + text + '\n```\n');
  const entry = appendLog(card);

  console.log(text);
  console.log('\nSAFE TO SHARE (aggregates only)\n' + renderShareable(card).split('\n').map(l => '  ' + l).join('\n'));
  console.log('\nwrote scorecard.json, scorecard.md, and appended to scores-log.jsonl under key ' + entry.key);
  return 0;
}

module.exports = { aggregate, failurePatterns, HOLDOUT, loadRun, latestRun };

if (require.main === module) process.exit(main(process.argv.slice(2)));
