/* Mechanical consistency check for a single-pass human gold worksheet.
   Usage: node check-gold.js <real-NN.gold.md>
   Exit 0 if internally consistent, exit 1 with a contradiction list otherwise.

   This is the compensating control for single-pass labeling (PROTOCOL.md step 4). It
   reports ONLY internal contradictions for a human to resolve. It never proposes, sets or
   changes a label, and it never judges whether the readiness or the issues are RIGHT, only
   whether the sheet contradicts itself. Every flag is for a person to reconcile.

   It targets the labeling-workstation.html export shape (the canonical gold) and degrades
   to best-effort on a hand-filled section C template. Where it cannot read a field it says
   so as a note, it does not invent a verdict.

   Rules mirror check-review-v2.js 8a-8d, adapted from the reviewer JSON to the human sheet:
     8a  a critical issue implies a blocking condition           -> C-crit-needs-block
     8b  a delivery-sinking flag is never minor                  -> C-mustcatch-minor
     8c  the bottom two readiness levels need a blocking rule     -> C-escalation-floor
     8d  no blocker plus all-minor issues means Nearly ready      -> C-over-escalation
*/
'use strict';
const fs = require('fs');

const args = process.argv.slice(2);
if (!args[0]) { console.error('usage: node check-gold.js <real-NN.gold.md>'); process.exit(2); }

let src;
try { src = fs.readFileSync(args[0], 'utf8'); }
catch (e) { console.error('cannot read ' + args[0] + ': ' + e.message); process.exit(2); }

const errs = [];   // internal contradictions, a person must resolve each
const notes = [];  // parse notes: a field could not be read mechanically

const RLABEL = {
  R0: 'Not ready for client review',
  R1: 'Needs substantial revision',
  R2: 'Needs targeted revision',
  R3: 'Nearly ready with minor edits'
};
const LABEL_TO_R = Object.fromEntries(Object.entries(RLABEL).map(([k, v]) => [v.toLowerCase(), k]));
const RINDEX = { R0: 0, R1: 1, R2: 2, R3: 3 }; // R0 worst, R3 best
const SEVS = ['critical', 'major', 'minor'];
const DIMS = ['Client decision usefulness', 'Problem framing', 'Storyline and pyramid logic',
  'Evidence quality', 'Analysis and insight', 'Recommendation specificity',
  'Feasibility and implementation', 'Risks, assumptions and uncertainty',
  'Slide-level communication', 'Professionalism, tone and confidentiality'];
const ITYPES = ['evidence', 'logic', 'recommendation', 'communication', 'scope', 'other'];

/* ---------- parse ---------- */
const lines = src.split(/\r?\n/);

// section split on "## " headers; keep a normalized key
const sections = {};
let cur = '$top';
sections[cur] = [];
for (const ln of lines) {
  const h = ln.match(/^##\s+(.+?)\s*$/);
  if (h) { cur = norm(h[1]); sections[cur] = []; }
  else sections[cur].push(ln);
}
function norm(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
function sectionText(...keys) {
  for (const k of keys) if (sections[k] !== undefined) return sections[k].join('\n').trim();
  return null;
}
function sectionExists(...keys) { return keys.some(k => sections[k] !== undefined); }

// readiness block
const readyBlock = sections[norm('Expected readiness')] ? sections[norm('Expected readiness')].join('\n') : '';
const levelLine = firstMatch(readyBlock, /-\s*\*\*Level:?\*\*\s*(.+)/i);
const reasonLine = firstMatch(readyBlock, /-\s*\*\*One-sentence reason:?\*\*\s*(.+)/i);
const blockLine = firstMatch(readyBlock, /-\s*\*\*Blocking rules[^*]*\*\*\s*(.*)/i);

function firstMatch(text, re) { const m = text.match(re); return m ? m[1].trim() : null; }

// resolve readiness to an R-token
let readiness = null;
if (levelLine) {
  const rtok = levelLine.match(/\bR([0-3])\b/);
  if (rtok) readiness = 'R' + rtok[1];
  else {
    const low = levelLine.toLowerCase();
    for (const [lab, r] of Object.entries(LABEL_TO_R)) if (low.includes(lab)) { readiness = r; break; }
  }
}

// blocking rule: present if the line is non-empty and not "none"
const blockRaw = (blockLine || '').trim();
const hasBlockingRule = blockRaw.length > 0 && !/^none\b/i.test(blockRaw) && norm(blockRaw) !== '';
// a cited ceiling, if the human wrote an R-token in the blocking line
let citedCeiling = null;
if (hasBlockingRule) {
  const cm = blockRaw.match(/\bR([0-3])\b/);
  if (cm) citedCeiling = 'R' + cm[1];
}

// issues
const issuesBlock = sections[norm('Real top issues ranked')] ||
  sections[norm('Real top issues')] || [];
const issueText = issuesBlock.join('\n');
const restraint = /\bnone[,]?\s+restraint case\b/i.test(issueText) || /restraint case\b/i.test(issueText) && /\bnone\b/i.test(issueText);

const issues = [];
{
  let curIssue = null;
  for (const raw of issuesBlock) {
    const ln = raw.replace(/\s+$/, '');
    const numbered = ln.match(/^(\d+)\.\s+(.*)/);
    if (numbered) {
      curIssue = { n: +numbered[1], text: numbered[2].trim(), sev: null, dim: null, itype: null, loc: null, mc: false };
      issues.push(curIssue);
      continue;
    }
    if (!curIssue) continue;
    if (/\[MUST-?CATCH\]/i.test(ln)) curIssue.mc = true;
    // canonical workstation meta line: "- severity: X; dimension: Y; type: Z; at: W"
    const sm = ln.match(/severity:\s*([A-Za-z]+)/i); if (sm && !curIssue.sev) curIssue.sev = sm[1].toLowerCase();
    const dm = ln.match(/dimension:\s*([^;]+)/i); if (dm && !curIssue.dim) curIssue.dim = dm[1].trim();
    const tm = ln.match(/type:\s*([A-Za-z]+)/i); if (tm && !curIssue.itype) curIssue.itype = tm[1].toLowerCase();
    const lm = ln.match(/\bat:\s*(.+)/i); if (lm && !curIssue.loc) curIssue.loc = lm[1].trim();
  }
}
const mcCount = issues.filter(i => i.mc).length;

/* ---------- checks ---------- */

// valid readiness level
if (!readiness) errs.push('C-readiness: no valid readiness level found (expected one of R0..R3 or its label in "**Level:**")');

// exactly one must-catch, or a declared restraint case
if (restraint && mcCount > 0)
  errs.push('C-mustcatch: restraint case is declared but ' + mcCount + ' issue(s) are also marked [MUST-CATCH]');
else if (!restraint && mcCount === 0)
  errs.push('C-mustcatch: no issue is marked [MUST-CATCH] and no restraint case is declared (exactly one must-catch, or the restraint box)');
else if (!restraint && mcCount > 1)
  errs.push('C-mustcatch: ' + mcCount + ' issues are marked [MUST-CATCH], exactly one is allowed');

// valid severities, dimensions, issue types on each issue
issues.forEach(is => {
  if (is.sev === null) notes.push('issue ' + is.n + ': could not read a severity (expected "severity: critical|major|minor")');
  else if (!SEVS.includes(is.sev)) errs.push('C-severity: issue ' + is.n + ' has invalid severity "' + is.sev + '"');
  if (is.dim !== null && !DIMS.some(d => is.dim.toLowerCase().includes(d.toLowerCase())))
    errs.push('C-dimension: issue ' + is.n + ' dimension "' + is.dim + '" is not one of the ten rubric dimensions');
  if (is.itype !== null && !ITYPES.includes(is.itype))
    errs.push('C-issuetype: issue ' + is.n + ' type "' + is.itype + '" is not a valid issue type');
});

// readiness at or below any cited blocking-rule ceiling
if (readiness && citedCeiling && RINDEX[readiness] > RINDEX[citedCeiling])
  errs.push('C-ceiling: readiness ' + readiness + ' is better than the cited ceiling ' + citedCeiling +
    ' (a blocking rule caps readiness at ' + citedCeiling + ' or worse)');

// 8c mirror: the bottom two readiness levels need a blocking rule
if (readiness && RINDEX[readiness] <= RINDEX.R1 && !hasBlockingRule)
  errs.push('C-escalation-floor: readiness ' + readiness + ' (' + RLABEL[readiness] +
    ') requires at least one blocking rule, but "Blocking rules fired" is empty or "none"');

// 8d mirror: no blocker and every issue minor means R3
const realIssues = issues.filter(i => i.sev !== null);
if (readiness && RINDEX[readiness] < RINDEX.R3 && !hasBlockingRule && !restraint &&
    realIssues.length > 0 && realIssues.every(i => i.sev === 'minor'))
  errs.push('C-over-escalation: readiness ' + readiness + ' but no blocking rule and every issue is minor (this shape is R3, Nearly ready)');

// no critical issue under an R3
if (readiness === 'R3')
  issues.forEach(is => { if (is.sev === 'critical')
    errs.push('C-critical-under-R3: issue ' + is.n + ' is critical but readiness is R3 (Nearly ready cannot carry a critical issue)'); });

// 8a mirror: a critical issue implies a blocking condition
if (!hasBlockingRule)
  issues.forEach(is => { if (is.sev === 'critical')
    errs.push('C-crit-needs-block: issue ' + is.n + ' is critical but no blocking rule is cited (a critical issue is a blocking condition)'); });

// 8b mirror: the delivery-sinking must-catch is never minor
issues.forEach(is => { if (is.mc && is.sev === 'minor')
  errs.push('C-mustcatch-minor: issue ' + is.n + ' is the must-catch but its severity is minor (a review "fails" for missing it, so it cannot be minor)'); });

// every section filled
const SECTION_CHECK = [
  { keys: [norm('Expected readiness')], label: 'Expected readiness', filled: () => !!(levelLine && reasonLine) },
  { keys: [norm('Real top issues ranked'), norm('Real top issues')], label: 'Real top issues, ranked', filled: () => issues.length > 0 || restraint },
  { keys: [norm('Acceptable AI feedback')], label: 'Acceptable AI feedback' },
  { keys: [norm('Unacceptable AI feedback')], label: 'Unacceptable AI feedback' },
  { keys: [norm('False positives to avoid')], label: 'False positives to avoid' },
  { keys: [norm('False negatives to catch')], label: 'False negatives to catch' },
  { keys: [norm('Honest uncertainty')], label: 'Honest uncertainty' }
];
SECTION_CHECK.forEach(s => {
  if (!sectionExists(...s.keys)) { errs.push('C-section: section "' + s.label + '" is missing'); return; }
  const ok = s.filled ? s.filled() : (sectionTextByKeys(s.keys).length > 0);
  if (!ok) errs.push('C-section: section "' + s.label + '" is empty');
});
function sectionTextByKeys(keys) {
  for (const k of keys) if (sections[k] !== undefined) return sections[k].join('\n').trim();
  return '';
}
if (!reasonLine) errs.push('C-section: the one-sentence readiness reason is empty');

/* ---------- report ---------- */
const rlabel = readiness ? readiness + ' ' + RLABEL[readiness] : '(unreadable)';
if (errs.length) {
  console.log('CONTRADICTIONS (' + errs.length + ') in ' + args[0] + ':');
  errs.forEach(e => console.log('  - ' + e));
  console.log('  (each is for the labeler to resolve. this check never sets or suggests a label.)');
} else {
  console.log('CONSISTENT: ' + args[0] + '. readiness ' + rlabel + ', ' + issues.length +
    ' issue(s), ' + (restraint ? 'restraint case' : mcCount + ' must-catch') +
    ', ' + (hasBlockingRule ? 'blocking rule cited' : 'no blocking rule') + '.');
  console.log('  (mechanical consistency only. it does not judge whether the label is correct.)');
}
notes.forEach(n => console.log('  note: ' + n));
process.exit(errs.length ? 1 : 0);
