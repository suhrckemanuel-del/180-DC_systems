/* Measure run-to-run stability across repeated reviews of ONE case.
   Usage: node check-stability.js <run1.json> <run2.json> [run3.json ...]

   Answers the question progress.md "Next actions" item 1 asks and nothing else answers:
   under a frozen prompt, how much does the same deck's review move between runs.
   The effectiveness review section 6 calls this the single most important pre-pilot
   measurement, and warns that "readiness matched" masks it, because readiness is the
   most robust output by construction. So this reports readiness LAST and the things
   underneath it first.

   Reports, it does not pass or fail. There is no agreed threshold yet. Setting one is
   a judgment call for the project owner once there is a first number to look at.

   Known limitation, read before quoting the number. Findings are matched by quote
   containment, so two runs that quote the same line at different spans count as one
   catch. Two runs that make the same point from DIFFERENT lines still count as two.
   So the stable-core percentage is a FLOOR on agreement, not an exact measure. It
   understates stability and never overstates it. A human should eyeball the unstable
   list before treating a low score as real drift. */
'use strict';
const fs = require('fs');

const files = process.argv.slice(2);
if (files.length < 2) {
  console.error('usage: node check-stability.js <run1.json> <run2.json> [run3.json ...]');
  console.error('  pass 3 to 5 runs of the SAME case under a frozen prompt');
  process.exit(1);
}

const runs = files.map(f => {
  try { return { file: f, r: JSON.parse(fs.readFileSync(f, 'utf8')) }; }
  catch (e) { console.error('cannot read ' + f + ': ' + e.message); process.exit(1); }
});

const norm = s => String(s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const uniq = a => [...new Set(a)];
const pct = (n, d) => d === 0 ? 'n/a' : (100 * n / d).toFixed(0) + '%';

// A finding's identity is its evidence quote, not its title. Two runs can word the same
// catch differently, so titles overstate variance. Quotes are the grounded anchor.
//
// But runs also quote the SAME line at different spans ("close the scheme." versus
// "close the scheme. reinvest the budget."). Exact-string identity would score those as
// two different findings and badly overstate drift, which would make the tool look less
// stable than it is. So quotes are clustered by containment first: if one quote contains
// the other, they are the same catch. Cluster label is the shortest member, the common core.
function rawQuotes(r) {
  return uniq((r.findings || []).flatMap(f => (f.evidence || []).map(q => norm(q.quote))))
    .filter(Boolean);
}

function buildClusters(all) {
  const sorted = [...all].sort((a, b) => a.length - b.length);
  const reps = [];
  for (const q of sorted) {
    const hit = reps.find(rep => q.includes(rep) || rep.includes(q));
    if (!hit) reps.push(q);
  }
  return reps;
}

function labelOf(reps, q) {
  return reps.find(rep => q.includes(rep) || rep.includes(q)) || q;
}

console.log('Stability across ' + runs.length + ' runs\n');
for (const { file, r } of runs) {
  console.log('  ' + file.split(/[\\/]/).pop());
}
console.log();

// 1. Finding-set agreement. The headline number.
const REPS = buildClusters(uniq(runs.flatMap(({ r }) => rawQuotes(r))));
const keySets = runs.map(({ r }) => new Set(rawQuotes(r).map(q => labelOf(REPS, q))));
const allKeys = uniq(keySets.flatMap(s => [...s]));
const inAll = allKeys.filter(k => keySets.every(s => s.has(k)));
const inSome = allKeys.filter(k => !keySets.every(s => s.has(k)));

console.log('1. Finding set (identity = evidence quote)');
console.log('   distinct findings across all runs : ' + allKeys.length);
console.log('   found in EVERY run (stable core)  : ' + inAll.length + '  (' + pct(inAll.length, allKeys.length) + ')');
console.log('   found in only SOME runs (drift)   : ' + inSome.length + '  (' + pct(inSome.length, allKeys.length) + ')');
if (inSome.length) {
  console.log('   unstable findings:');
  inSome.forEach(k => {
    const n = keySets.filter(s => s.has(k)).length;
    console.log('     [' + n + '/' + runs.length + '] "' + k.slice(0, 70) + '"');
  });
}

// 2. Counts that the noise budget depends on.
const nf = runs.map(({ r }) => (r.findings || []).length);
const nc = runs.map(({ r }) => (r.comments || []).length);
const nb = runs.map(({ r }) => (r.blockingIssues || []).length);
const spread = a => Math.max(...a) - Math.min(...a);
console.log('\n2. Counts        min  max  spread   values');
console.log('   findings      ' + String(Math.min(...nf)).padEnd(5) + String(Math.max(...nf)).padEnd(5) + String(spread(nf)).padEnd(8) + nf.join(', '));
console.log('   comments      ' + String(Math.min(...nc)).padEnd(5) + String(Math.max(...nc)).padEnd(5) + String(spread(nc)).padEnd(8) + nc.join(', '));
console.log('   blockingIssues' + String(Math.min(...nb)).padEnd(5) + String(Math.max(...nb)).padEnd(5) + String(spread(nb)).padEnd(8) + nb.join(', '));

// 3. Blocking-rule accounting. Effectiveness review section 5 flags this as unpinned:
//    the prompt never says whether to list the binding blocker or every blocker.
const ruleSets = runs.map(({ r }) => new Set((r.blockingIssues || []).map(b => String(b.rule))));
const allRules = uniq(ruleSets.flatMap(s => [...s]));
const stableRules = allRules.filter(k => ruleSets.every(s => s.has(k)));
console.log('\n3. Blocking rules cited');
console.log('   rules seen        : ' + (allRules.length ? allRules.sort().join(', ') : 'none'));
console.log('   cited in every run: ' + (stableRules.length ? stableRules.sort().join(', ') : 'none') +
  '  (' + pct(stableRules.length, allRules.length) + ')');

// 4. Severity distribution, the input the readiness ladder rests on.
console.log('\n4. Severity mix per run');
runs.forEach(({ file, r }, i) => {
  const s = (r.findings || []).map(f => f.severity);
  const c = k => s.filter(x => x === k).length;
  console.log('   run ' + (i + 1) + ': critical ' + c('critical') + ', major ' + c('major') + ', minor ' + c('minor'));
});

// 5. Confidence and the diagnostic mean.
const conf = runs.map(({ r }) => (r.scorecard || {}).confidence);
const means = runs.map(({ r }) => (r.scorecard || {}).diagnosticMean).filter(x => typeof x === 'number');
console.log('\n5. Scorecard');
console.log('   confidence     : ' + conf.join(', ') + (uniq(conf).length === 1 ? '  (stable)' : '  (VARIES)'));
if (means.length) console.log('   diagnosticMean : ' + means.join(', ') + '  spread ' + spread(means).toFixed(2));

// 6. Readiness last, on purpose.
const lv = runs.map(({ r }) => (r.readiness || {}).level);
console.log('\n6. Readiness (reported last: it is the most robust output by construction)');
console.log('   ' + lv.join(' | ') + (uniq(lv).length === 1 ? '\n   stable across runs' : '\n   VARIES across runs'));

console.log('\nRead the drift in section 1 before the agreement in section 6.');
