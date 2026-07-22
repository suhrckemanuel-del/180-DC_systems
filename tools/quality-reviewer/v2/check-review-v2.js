/* Validate a v2 review JSON against 03-output-contract.md.
   Usage: node check-review-v2.js <review.json> [deliverable.md]
   The optional deliverable file enables the verbatim-quote check (contract D.3).
   Exit 0 valid, exit 1 invalid with an error list. */
'use strict';
const fs = require('fs');

const args = process.argv.slice(2);
if (!args[0]) { console.error('usage: node check-review-v2.js <review.json> [deliverable.md]'); process.exit(1); }

const errs = [];
const warns = [];

let raw;
try { raw = fs.readFileSync(args[0], 'utf8'); }
catch (e) { console.error('cannot read ' + args[0] + ': ' + e.message); process.exit(1); }

let r;
try { r = JSON.parse(raw); }
catch (e) { console.log('INVALID:\n  - not parseable JSON: ' + e.message); process.exit(1); }

const READINESS = [
  'Not ready for client review',
  'Needs substantial revision',
  'Needs targeted revision',
  'Nearly ready with minor edits'
];
const CONFIDENCE = ['Low', 'Medium', 'High'];
const MODES = ['short', 'deep', 'lead'];
const ARTIFACTS = ['kickoff problem frame', 'research plan', 'interview guide',
  'synthesis memo', 'draft deck', 'final recommendation deck', 'implementation roadmap'];
const SEVERITIES = { critical: 'High impact', major: 'Moderate', minor: 'Minor' };
const ISSUE_TYPES = ['thinking', 'evidence', 'recommendation', 'implementation', 'communication'];
const OWNERS = ['team', 'project lead', 'board reviewer', 'client clarification'];
const RESULTS = ['pass', 'partial', 'fail', 'na'];
const DIMENSIONS = [
  'Client decision usefulness', 'Problem framing', 'Storyline and pyramid logic',
  'Evidence quality', 'Analysis and insight', 'Recommendation specificity',
  'Feasibility and implementation', 'Risks, assumptions and uncertainty',
  'Slide-level communication', 'Professionalism, tone and confidentiality'
];
const TOP_KEYS = ['meta', 'readiness', 'blockingIssues', 'scorecard', 'strengths',
  'findings', 'comments', 'questionsForLead', 'learningNote', 'notAssessed', 'timeline'];
const FINDING_KEYS = ['short', 'title', 'severity', 'severityLabel', 'deliveryCritical',
  'issueType', 'owner', 'principle', 'diagnosis', 'evidence', 'why', 'reflect', 'fix', 'tags'];

function isStr(v) { return typeof v === 'string' && v.length > 0; }

// 1. Required fields and types
Object.keys(r).forEach(k => { if (!TOP_KEYS.includes(k)) errs.push('unknown top-level field "' + k + '"'); });
['verdict', 'approval', 'ranking', 'grade'].forEach(k => {
  if (r[k] !== undefined || (r.scorecard && r.scorecard[k] !== undefined))
    errs.push('forbidden field "' + k + '": the reviewer never approves, grades or ranks');
});
['meta', 'readiness', 'scorecard', 'learningNote'].forEach(k => {
  if (!r[k] || typeof r[k] !== 'object') errs.push('missing object: ' + k);
});
if (!Array.isArray(r.findings)) errs.push('findings must be an array');
if (!Array.isArray(r.blockingIssues)) errs.push('blockingIssues must be an array');
if (errs.length) { report(); }

if (r.meta) {
  if (!isStr(r.meta.title)) errs.push('meta.title missing');
  if (!ARTIFACTS.includes(r.meta.artifactType)) errs.push('meta.artifactType invalid: ' + r.meta.artifactType);
  if (!MODES.includes(r.meta.mode)) errs.push('meta.mode invalid: ' + r.meta.mode);
  if (typeof r.meta.slideCount !== 'number') errs.push('meta.slideCount must be a number');
  if (r.meta.version !== 'Review v2') errs.push('meta.version must be "Review v2"');
}
if (r.readiness) {
  if (!READINESS.includes(r.readiness.level)) errs.push('readiness.level invalid: ' + r.readiness.level);
  if (!CONFIDENCE.includes(r.readiness.confidence)) errs.push('readiness.confidence invalid');
  ['mainReason', 'highestRiskIssue', 'whatCouldChangeIt'].forEach(k => {
    if (!isStr(r.readiness[k])) errs.push('readiness.' + k + ' missing');
  });
}

// 2. Exactly ten dimensions in rubric order
if (r.scorecard) {
  const dims = r.scorecard.dimensions;
  if (!Array.isArray(dims) || dims.length !== 10) {
    errs.push('scorecard.dimensions must have exactly 10 entries, has ' + (dims ? dims.length : 'none'));
  } else {
    dims.forEach((d, i) => {
      if (d.name !== DIMENSIONS[i]) errs.push('dimension ' + (i + 1) + ' out of rubric order: "' + d.name + '" expected "' + DIMENSIONS[i] + '"');
      if (!RESULTS.includes(d.result)) errs.push('dimension "' + d.name + '" invalid result: ' + d.result);
      if (d.result !== 'na') {
        if (typeof d.checksPassed !== 'number' || typeof d.checksTotal !== 'number' || d.checksTotal < 1)
          errs.push('dimension "' + d.name + '" checks malformed');
        else {
          const expect = d.checksPassed === d.checksTotal ? 'pass' : d.checksPassed <= 1 ? 'fail' : 'partial';
          if (d.result !== expect) warns.push('dimension "' + d.name + '" result "' + d.result + '" does not match checks ' + d.checksPassed + '/' + d.checksTotal + ' (expected ' + expect + ')');
        }
      }
    });
    const scored = dims.filter(d => d.result !== 'na' && typeof d.checksPassed === 'number' && d.checksTotal > 0);
    if (scored.length) {
      const mean = scored.reduce((s, d) => s + 1 + 4 * d.checksPassed / d.checksTotal, 0) / scored.length;
      if (typeof r.scorecard.diagnosticMean !== 'number' || Math.abs(r.scorecard.diagnosticMean - mean) > 0.05)
        errs.push('scorecard.diagnosticMean ' + r.scorecard.diagnosticMean + ' does not equal computed mean ' + mean.toFixed(1));
    }
  }
  if (!CONFIDENCE.includes(r.scorecard.confidence)) errs.push('scorecard.confidence invalid');
}

// 3. Evidence on every finding and blocking issue, quotes verbatim
const deliverable = args[1] ? fs.readFileSync(args[1], 'utf8') : null;
const norm = s => s.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const hay = deliverable ? norm(deliverable) : null;
function checkEvidence(list, label) {
  (list || []).forEach((item, i) => {
    const ev = item.evidence;
    if (!Array.isArray(ev) || ev.length === 0) { errs.push(label + ' ' + (i + 1) + ' has no evidence (quote or abstain)'); return; }
    ev.forEach(q => {
      if (typeof q.slide !== 'number' || !isStr(q.quote)) { errs.push(label + ' ' + (i + 1) + ' evidence entry malformed'); return; }
      if (hay && !hay.includes(norm(q.quote)))
        errs.push(label + ' ' + (i + 1) + ' quote not verbatim in deliverable: "' + q.quote.slice(0, 60) + '"');
    });
  });
}
checkEvidence(r.findings, 'finding');
checkEvidence(r.blockingIssues, 'blocking issue');
if (!deliverable) warns.push('no deliverable file given, verbatim-quote check skipped');

// finding shape, severity mapping, sort order
(r.findings || []).forEach((f, i) => {
  FINDING_KEYS.forEach(k => { if (f[k] === undefined) errs.push('finding ' + (i + 1) + ' missing field "' + k + '"'); });
  if (!Object.keys(SEVERITIES).includes(f.severity)) errs.push('finding ' + (i + 1) + ' invalid severity: ' + f.severity);
  else if (f.severityLabel !== SEVERITIES[f.severity]) errs.push('finding ' + (i + 1) + ' severityLabel "' + f.severityLabel + '" does not map from severity "' + f.severity + '"');
  if (!ISSUE_TYPES.includes(f.issueType)) errs.push('finding ' + (i + 1) + ' invalid issueType: ' + f.issueType);
  if (!OWNERS.includes(f.owner)) errs.push('finding ' + (i + 1) + ' invalid owner: ' + f.owner);
  if (typeof f.deliveryCritical !== 'boolean') errs.push('finding ' + (i + 1) + ' deliveryCritical must be boolean');
});

// 4. Noise budget by mode
const budget = { short: 3, deep: 5, lead: 5 };
const mode = r.meta && r.meta.mode;
const nFind = (r.findings || []).length;
const nComm = (r.comments || []).length;
if (mode && nFind > budget[mode]) errs.push(nFind + ' findings exceeds the ' + mode + '-mode budget of ' + budget[mode]);
if (nFind + nComm > 8) errs.push('findings plus comments is ' + (nFind + nComm) + ', budget is 8');
if ((r.questionsForLead || []).length > 5) errs.push('questionsForLead exceeds 5');

// 5. Readiness consistent with blocking issues
if (r.readiness && READINESS.includes(r.readiness.level)) {
  const lvl = READINESS.indexOf(r.readiness.level);
  (r.blockingIssues || []).forEach(b => {
    const ceil = READINESS.indexOf(b.ceiling);
    if (ceil === -1) errs.push('blocking issue ceiling invalid: ' + b.ceiling);
    else if (lvl > ceil) errs.push('readiness "' + r.readiness.level + '" is above the ceiling "' + b.ceiling + '" of blocking rule ' + b.rule);
  });
  // the no-blocker escalation floor is enforced as an error in check 8c below
}

// 6. No em or en dash in authored fields (quote fields exempt)
(function lint(node, path) {
  if (typeof node === 'string') {
    if (path.endsWith('.quote')) return;
    if (/[â€“â€”]/.test(node)) errs.push('em or en dash in authored field ' + path);
  } else if (Array.isArray(node)) node.forEach((v, i) => lint(v, path + '[' + i + ']'));
  else if (node && typeof node === 'object') Object.keys(node).forEach(k => lint(node[k], path + '.' + k));
})(r, '$');

// 7. notAssessed non-empty
if (!Array.isArray(r.notAssessed) || r.notAssessed.length === 0) errs.push('notAssessed must be a non-empty array');

// learningNote shape
if (r.learningNote) ['lesson', 'weakHabit', 'exercise', 'principle'].forEach(k => {
  if (!isStr(r.learningNote[k])) errs.push('learningNote.' + k + ' missing');
});

// timeline consistency
if (r.timeline) {
  if (!Array.isArray(r.timeline.tiles)) errs.push('timeline.tiles must be an array');
  else if (r.meta && r.timeline.tiles.length !== r.meta.slideCount)
    errs.push('timeline.tiles length ' + r.timeline.tiles.length + ' differs from meta.slideCount ' + r.meta.slideCount);
}

/* 8. Severity and blocking-rule coherence.
   Encodes the 2026-07-03 severity calibration (see progress.md session 3) in the
   validator instead of leaving it to the prompt. Over-escalation on good work is the
   failure the effectiveness review calls the most likely to burn a team on day one,
   and nothing mechanical was checking it. */
{
  const finds = r.findings || [];
  const nBlock = (r.blockingIssues || []).length;
  const lvl = r.readiness && READINESS.includes(r.readiness.level)
    ? READINESS.indexOf(r.readiness.level) : -1;

  // 8a. deliveryCritical invariant: nothing is delivery-critical with no blocking issue.
  if (nBlock === 0) finds.forEach((f, i) => {
    if (f.deliveryCritical)
      errs.push('finding ' + (i + 1) + ' is deliveryCritical but no blocking issue is listed');
  });

  // 8b. A minor finding is never delivery-critical.
  finds.forEach((f, i) => {
    if (f.severity === 'minor' && f.deliveryCritical)
      errs.push('finding ' + (i + 1) + ' is severity minor but marked deliveryCritical');
  });

  // 8c. Escalation floor: the bottom two readiness levels need a blocking rule.
  if (lvl > -1 && lvl < 2 && nBlock === 0)
    errs.push('readiness "' + r.readiness.level + '" requires at least one blocking issue');

  // 8d. Over-escalation guard: no blocker and every finding minor means Nearly ready.
  if (lvl > -1 && lvl < 3 && nBlock === 0 && finds.length > 0 &&
      finds.every(f => f.severity === 'minor'))
    errs.push('readiness "' + r.readiness.level + '" but no blocking issue and every finding ' +
      'is minor (expected "' + READINESS[3] + '")');

  // 8e. Padding signal: one quote carrying two findings.
  const seen = new Map();
  finds.forEach((f, i) => (f.evidence || []).forEach(q => {
    const k = norm(q.quote || '');
    if (seen.has(k) && seen.get(k) !== i)
      warns.push('finding ' + (i + 1) + ' reuses the quote of finding ' + (seen.get(k) + 1) +
        ', check it is not padding');
    else if (!seen.has(k)) seen.set(k, i);
  }));
}

function report() {
  if (errs.length) {
    console.log('INVALID (' + errs.length + '):');
    errs.forEach(e => console.log('  - ' + e));
  } else {
    console.log('VALID. ' + nFind + ' findings, ' + nComm + ' comments, readiness "' +
      (r.readiness && r.readiness.level) + '", ' + (r.blockingIssues || []).length + ' blocking issues.');
  }
  warns.forEach(w => console.log('  warn: ' + w));
  process.exit(errs.length ? 1 : 0);
}
report();
