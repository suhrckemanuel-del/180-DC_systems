#!/usr/bin/env node
/*
 * check-gold.js — consistency checker for a real-NN.gold.md answer-key file.
 *
 * It NEVER sets or suggests a label. It only reads a finished gold and reports internal
 * contradictions between the readiness call, the blocking rule cited, the issue list and
 * the required sections. A clean file prints CONSISTENT and exits 0; any contradiction
 * prints the C-codes and CONTRADICTIONS and exits 1.
 *
 * Usage:  node check-gold.js <path-to-gold.md>
 *
 * The rule set is pinned by fixtures/check-gold.test.sh — run `bash check-gold.test.sh`
 * from the fixtures dir after any change here. Rules mirror 01-rubric-v1.md section B
 * (blocking ceilings) and the worksheet enums.
 */
'use strict';
const fs = require('fs');

// ---- canonical vocabularies -------------------------------------------------
const READINESS = { R0: 0, R1: 1, R2: 2, R3: 3 };
const SEVERITIES = new Set(['critical', 'major', 'minor']);
const ISSUE_TYPES = new Set(['evidence', 'logic', 'recommendation', 'communication', 'scope', 'other']);
// The ten rubric dimensions (01-rubric-v1.md section D), verbatim.
const DIMENSIONS = new Set([
  'Client decision usefulness',
  'Problem framing',
  'Storyline and pyramid logic',
  'Evidence quality',
  'Analysis and insight',
  'Recommendation specificity',
  'Feasibility and implementation',
  'Assumptions and uncertainty',
  'Slide-level communication',
  'Professionalism, tone and confidentiality',
]);
const REQUIRED_SECTIONS = [
  'Expected readiness',
  'Real top issues, ranked',
  'Acceptable AI feedback',
  'Unacceptable AI feedback',
  'False positives to avoid',
  'False negatives to catch',
  'Honest uncertainty',
];

// ---- input ------------------------------------------------------------------
const file = process.argv[2];
if (!file) { console.error('usage: node check-gold.js <gold.md>'); process.exit(2); }
let text;
try { text = fs.readFileSync(file, 'utf8'); }
catch (e) { console.error('cannot read ' + file + ': ' + e.message); process.exit(2); }
const lines = text.split(/\r?\n/);

const flags = [];
const flag = (code, msg) => flags.push('C-' + code + ': ' + msg);

// ---- section presence -------------------------------------------------------
const headerAt = (name) =>
  lines.findIndex((l) => l.replace(/\s+$/, '').match(new RegExp('^##\\s+' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'i')));
for (const s of REQUIRED_SECTIONS) {
  if (headerAt(s) === -1) flag('section', 'missing required section "' + s + '"');
}

// ---- readiness + blocking rule ---------------------------------------------
const levelLine = lines.find((l) => /-\s*\*\*Level:\*\*/i.test(l)) || '';
const levelText = levelLine.replace(/.*\*\*Level:\*\*/i, '').trim();
const rMatch = levelText.match(/\bR([0-3])\b/);
let readiness = null;
if (!rMatch) {
  flag('readiness', 'level "' + levelText + '" is not one of R0/R1/R2/R3');
} else {
  readiness = Number(rMatch[1]);
}

const blockLine = lines.find((l) => /Blocking rules fired/i.test(l)) || '';
const blockText = blockLine.replace(/.*\*\*Blocking rules fired[^*]*\*\*/i, '').trim();
const noBlocking = blockText === '' || /^none\b/i.test(blockText);
const ceilMatch = blockText.match(/R([0-3])\s*ceiling/i);
const ceiling = ceilMatch ? Number(ceilMatch[1]) : null;

// ---- issues -----------------------------------------------------------------
const issuesStart = headerAt('Real top issues, ranked');
const issues = [];
let restraint = false;
if (issuesStart !== -1) {
  // section runs to the next "## " header
  let end = lines.length;
  for (let i = issuesStart + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) { end = i; break; }
  }
  const body = lines.slice(issuesStart + 1, end);
  if (body.some((l) => /none,?\s*restraint case/i.test(l))) restraint = true;
  let cur = null;
  for (const raw of body) {
    if (/^\s*\d+\.\s/.test(raw)) {           // new numbered issue
      cur = { severity: null, dimension: null, type: null, mustCatch: false };
      issues.push(cur);
    }
    if (!cur) continue;
    const sev = raw.match(/severity:\s*([^;]+)/i);
    const dim = raw.match(/dimension:\s*([^;]+)/i);
    const typ = raw.match(/type:\s*([^;]+)/i);
    if (sev) cur.severity = sev[1].trim();
    if (dim) cur.dimension = dim[1].trim();
    if (typ) cur.type = typ[1].trim();
    if (/\[MUST-CATCH\]/i.test(raw)) cur.mustCatch = true;
  }
}

// enum validity
for (const it of issues) {
  if (it.severity && !SEVERITIES.has(it.severity.toLowerCase()))
    flag('severity', 'invalid severity "' + it.severity + '"');
  if (it.dimension && !DIMENSIONS.has(it.dimension))
    flag('dimension', 'invalid dimension "' + it.dimension + '"');
  if (it.type && !ISSUE_TYPES.has(it.type.toLowerCase()))
    flag('issuetype', 'invalid issue type "' + it.type + '"');
}

// ---- cross-field consistency ------------------------------------------------
const mustCatches = issues.filter((i) => i.mustCatch);
const expectedMC = restraint ? 0 : 1;
if (mustCatches.length !== expectedMC)
  flag('mustcatch', (restraint ? 'restraint case should carry 0 must-catch, found ' : 'expected exactly 1 must-catch, found ') + mustCatches.length);
if (mustCatches.some((i) => (i.severity || '').toLowerCase() === 'minor'))
  flag('mustcatch-minor', 'the must-catch issue is only minor severity');

const anyCritical = issues.some((i) => (i.severity || '').toLowerCase() === 'critical');
const allMinor = issues.length > 0 && issues.every((i) => (i.severity || '').toLowerCase() === 'minor');

if (readiness !== null && ceiling !== null && readiness > ceiling)
  flag('ceiling', 'readiness R' + readiness + ' is above the cited R' + ceiling + ' ceiling');
if (noBlocking && readiness !== null && readiness <= READINESS.R1)
  flag('escalation-floor', 'readiness R' + readiness + ' with no blocking rule cited');
if (noBlocking && readiness === READINESS.R2 && allMinor)
  flag('over-escalation', 'R2 with no blocking rule and only minor issues');
if (readiness === READINESS.R3 && anyCritical)
  flag('critical-under-R3', 'a critical issue coexists with an R3 (nearly ready) call');
if (anyCritical && noBlocking)
  flag('crit-needs-block', 'a critical issue is present but no blocking rule is cited');

// ---- report -----------------------------------------------------------------
if (flags.length === 0) {
  console.log('CONSISTENT  ' + file);
  process.exit(0);
}
for (const f of flags) console.log(f);
console.log('CONTRADICTIONS  ' + file + '  (' + flags.length + ')');
process.exit(1);
