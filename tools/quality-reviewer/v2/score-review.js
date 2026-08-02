#!/usr/bin/env node
/*
 * score-review.js — score one contract-valid review JSON against one human gold label.
 *
 * BRICK 1 of the calibration engine. No API, no network, deterministic.
 *
 * It NEVER writes, edits or suggests a gold. It reads a finished gold and a finished
 * review and reports the match on four axes:
 *
 *   1. readiness      exact and within-one (headline is within-one, exact tracked beside it)
 *   2. must-catch     did the review find the one issue the human said must be found
 *   3. restraint      on a gold restraint case, did the review escalate above the gold
 *   4. severity       on the matched must-catch, did it grade the issue like the human
 *
 * Matching a free-text human finding to a free-text model finding is the hard part and it
 * is never certain. The rule here is deliberately conservative: a hit needs real text
 * overlap AND two of three supporting signals (slide proximity, issue-type compatibility,
 * dimension cue). Anything weaker is reported as `near` for a human to adjudicate and is
 * NOT counted in recall. Every verdict carries its basis so the call can be audited.
 *
 * Usage:
 *   node score-review.js <review.json> <gold.md> [--json]
 *   node score-review.js --parse <gold.md> [--json]      inspect the parsed gold only
 *   node score-review.js --eligible <labeling-dir>       list golds a run is allowed to use
 *
 * Exit 0 on success (a bad score is still a successful scoring run), 2 on usage or parse
 * failure. Scores are advisory numbers, not a pass/fail gate.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/* ------------------------------------------------------------------------- *
 * Version stamp. Any change to thresholds, clusters or the match rule must
 * bump this, because scores from different matcher versions are not comparable.
 * ------------------------------------------------------------------------- */
const MATCHER_VERSION = 'mc-match-1';

/* Thresholds. These are UNVALIDATED until the first real baseline run: they were
 * calibrated on fabricated fixtures only (fixtures/score-review.test.sh). Review them
 * against the first batch of `near` verdicts before anyone quotes the recall number as
 * settled, and bump MATCHER_VERSION if they move. */
const T_HIT = 0.45;   // text score at or above this can be a hit
const T_NEAR = 0.28;  // text score at or above this can be a near miss
const SLIDE_TOLERANCE = 2; // a finding may sit this many slides off the gold location

// ---- readiness ------------------------------------------------------------
// R0 is the worst, R3 the best. "Escalating above the gold" means moving toward R0.
const LEVELS = [
  'Not ready for client review',      // R0
  'Needs substantial revision',       // R1
  'Needs targeted revision',          // R2
  'Nearly ready with minor edits',    // R3
];

// ---- vocabularies ---------------------------------------------------------
// The gold worksheet enum (check-gold.js) and the output contract enum are different
// vocabularies written by different people for different jobs. These two maps are the
// only bridge between them and both are deliberately loose: they gate nothing on their
// own, they only supply one of three supporting signals.
const GOLD_TYPE_TO_ISSUE_TYPES = {
  evidence: ['evidence'],
  logic: ['thinking', 'communication'],
  recommendation: ['recommendation', 'implementation'],
  communication: ['communication'],
  scope: null,   // too broad to constrain
  other: null,
};

// Gold dimension names (check-gold.js DIMENSIONS) to contract dimension names. Only
// number 8 differs in wording.
const GOLD_DIM_TO_CONTRACT_DIM = {
  'Assumptions and uncertainty': 'Risks, assumptions and uncertainty',
};

// Cue terms per gold dimension. A finding "touches the dimension" when its text uses at
// least one cue. This is the dimension signal: lexically independent of the issue text
// overlap, so it is not just the same measurement twice.
const DIMENSION_CUES = {
  'Client decision usefulness': ['decision', 'decide', 'act', 'actionable', 'useful', 'usefulness', 'takeaway'],
  'Problem framing': ['framing', 'frame', 'scope', 'problem', 'question', 'drift', 'mandate'],
  'Storyline and pyramid logic': ['storyline', 'pyramid', 'summary', 'executive', 'narrative', 'logic', 'message', 'flow', 'order', 'structure', 'headline'],
  'Evidence quality': ['evidence', 'source', 'sourced', 'sourcing', 'data', 'proof', 'sample', 'cite', 'citation', 'methodology', 'unsourced', 'support', 'respondent'],
  'Analysis and insight': ['analysis', 'analyse', 'analyze', 'insight', 'interpret', 'implication', 'depth', 'reasoning', 'derivation'],
  'Recommendation specificity': ['recommendation', 'recommend', 'specific', 'vague', 'concrete', 'generic', 'owner', 'actionable'],
  'Feasibility and implementation': ['feasibility', 'feasible', 'implement', 'implementation', 'capacity', 'resource', 'cost', 'timeline', 'plan', 'step', 'rollout'],
  'Assumptions and uncertainty': ['assumption', 'uncertainty', 'risk', 'caveat', 'limitation', 'confidence', 'sensitivity'],
  'Slide-level communication': ['slide', 'dense', 'density', 'text', 'layout', 'readable', 'skim', 'clutter', 'volume', 'concise', 'wall', 'page'],
  'Professionalism, tone and confidentiality': ['tone', 'professional', 'confidential', 'privacy', 'brochure', 'marketing', 'named'],
};

/* Synonym clusters. The human gold and the model say the same thing in different words:
 * "shows how" against "implementation path", "executive summary" against "governing
 * message". Each cluster collapses to one concept token so overlap can see through the
 * wording. Kept to general consulting-review vocabulary on purpose. Widening these to
 * chase a specific case would be tuning the scorer toward the answer key. */
const CLUSTERS = {
  '@recommendation': ['recommendation', 'recommendations', 'recommend', 'recommended', 'recommending', 'advice', 'advise', 'advises', 'advising', 'guidance', 'takeaway', 'takeaways'],
  '@implementation': ['implement', 'implementation', 'implementing', 'execute', 'execution', 'rollout', 'playbook', 'operationalise', 'operationalize', 'howto'],
  '@actionable': ['actionable', 'actionability', 'action', 'actions', 'act', 'acted', 'usable', 'apply'],
  '@evidence': ['evidence', 'source', 'sources', 'sourced', 'sourcing', 'proof', 'substantiate', 'substantiated', 'cite', 'cited', 'citation', 'unsourced', 'ungrounded', 'grounded', 'groundedness', 'methodology', 'traceable'],
  '@sample': ['sample', 'samples', 'respondent', 'respondents', 'interviewee', 'interviewees', 'sampling'],
  '@storyline': ['storyline', 'pyramid', 'narrative', 'governing', 'headline', 'throughline', 'sowhat'],
  '@execsummary': ['execsummary', 'summary', 'executive', 'summarise', 'summarize'],
  '@density': ['dense', 'density', 'fluff', 'clutter', 'cluttered', 'overload', 'overloaded', 'volume', 'concise', 'conciseness', 'distil', 'distill', 'distilled', 'skim', 'skimming', 'verbose', 'wordy'],
  '@decision': ['decision', 'decisions', 'decide', 'decides', 'deciding', 'choice', 'choose'],
  '@competitor': ['competitor', 'competitors', 'competitive', 'competition', 'benchmark', 'benchmarking', 'rival', 'rivals'],
  '@feasibility': ['feasible', 'feasibility', 'capacity', 'resourcing', 'budget', 'timeline', 'staffing'],
  '@specific': ['specific', 'specificity', 'concrete', 'concretely', 'vague', 'vagueness', 'generic', 'unclear', 'ambiguous', 'nonspecific'],
  '@value': ['value', 'valuable', 'benefit', 'benefits', 'payoff', 'roi'],
  '@pricing': ['price', 'prices', 'pricing', 'commission', 'monetisation', 'monetization', 'willingnesstopay'],
  '@reasoning': ['reasoning', 'rationale', 'derivation', 'justification', 'justify', 'justified', 'because', 'logic'],
  // absence words only. Bare negation (no, never, without) is deliberately left out: it
  // appears in almost every finding and every gold issue, so clustering it would inflate
  // every overlap score by a constant.
  '@absent': ['missing', 'absent', 'absence', 'lacks', 'lack', 'lacking', 'omits', 'omitted', 'omission'],
};

// phrase to single token, applied before tokenizing so multiword concepts survive
const PHRASES = [
  [/executive summar(y|ies)/gi, ' execsummary '],
  [/pyramid principle/gi, ' pyramid '],
  [/governing (message|insight|idea)/gi, ' governing '],
  [/so what/gi, ' sowhat '],
  [/willingness to pay/gi, ' willingnesstopay '],
  [/how to/gi, ' howto '],
  [/shows? how/gi, ' howto '],
  [/show(ing)? the how/gi, ' howto '],
  [/next steps?/gi, ' nextstep '],
  [/wall of text/gi, ' density '],
];

const STOP = new Set(('a an the and or but if then than that this these those it its is are was were be been being do does did done has have had ' +
  'for from with without into onto over under about across of on in at by to as not no nor so such very more most much many few some any all ' +
  'they them their there here what which who whom when where why how can could should would may might will shall must ' +
  'one two three also just only even still yet already now already need needs needed use used using make makes made get gets got ' +
  'client clients deck decks slide slides team teams deliverable deliverables consultant consultants report reports ' +
  'issue issues finding findings review reviews thing things lot lots way ways part parts point points').split(/\s+/));

// build the term to concept map once, and refuse to start on an ambiguous cluster or on a
// cluster term the stopword list would swallow before the cluster ever sees it
const TERM_TO_CONCEPT = new Map();
for (const [id, terms] of Object.entries(CLUSTERS)) {
  for (const t of terms) {
    if (TERM_TO_CONCEPT.has(t)) throw new Error('term "' + t + '" is in two clusters: ' + TERM_TO_CONCEPT.get(t) + ' and ' + id);
    if (STOP.has(t)) throw new Error('cluster term "' + t + '" (' + id + ') is also a stopword, it would never reach the cluster');
    TERM_TO_CONCEPT.set(t, id);
  }
}
const CLUSTER_TERMS = [...TERM_TO_CONCEPT.keys()];

// ---- text helpers ---------------------------------------------------------
function normalizeText(s) {
  let t = ' ' + String(s || '') + ' ';
  for (const [re, rep] of PHRASES) t = t.replace(re, rep);
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function singular(w) {
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  return w;
}

/* Edit distance, capped. Golds are typed by hand under time pressure and one of them
 * spells "reccomendation", so an exact-only lexicon would silently lose the concept.
 * Only long words get the tolerance, which keeps short words (act, art) from colliding. */
function within(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

const FUZZY_CACHE = new Map();
function fuzzyConcept(w) {
  if (w.length < 7) return null;
  if (FUZZY_CACHE.has(w)) return FUZZY_CACHE.get(w);
  const max = w.length >= 11 ? 2 : 1;
  let hit = null;
  for (const t of CLUSTER_TERMS) {
    if (t.length < 7) continue;
    if (within(w, t, max)) { hit = TERM_TO_CONCEPT.get(t); break; }
  }
  FUZZY_CACHE.set(w, hit);
  return hit;
}

/* Bag of concepts. A term becomes its cluster id when it has one, otherwise it stays
 * itself, so one set holds both the collapsed concepts and the distinctive raw words. */
function concepts(s) {
  const out = new Set();
  for (const raw of normalizeText(s).split(' ')) {
    if (!raw || raw.length < 3 || STOP.has(raw)) continue;
    const w = singular(raw);
    if (STOP.has(w)) continue;
    out.add(TERM_TO_CONCEPT.get(raw) || TERM_TO_CONCEPT.get(w) || fuzzyConcept(w) || w);
  }
  return out;
}

const coverage = (a, b) => (a.size === 0 ? 0 : [...a].filter(x => b.has(x)).length / a.size);
const shared = (a, b) => [...a].filter(x => b.has(x));

// ---- gold parsing ---------------------------------------------------------
const SECTIONS = ['Expected readiness', 'Real top issues, ranked', 'Acceptable AI feedback',
  'Unacceptable AI feedback', 'False positives to avoid', 'False negatives to catch', 'Honest uncertainty'];

function sectionLines(lines, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('^##\\s+' + esc + '\\s*$', 'i');
  const start = lines.findIndex(l => re.test(l.replace(/\s+$/, '')));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^##\s+/.test(lines[i])) { end = i; break; }
  return lines.slice(start + 1, end);
}

/* "s16-s21, s23-s30" / "p10" / "all" / "unstated" to slide spans. `unconstrained` means
 * the human did not pin the issue to a location, so location cannot count against a
 * candidate finding. */
function parseAt(raw) {
  const at = String(raw || '').trim().toLowerCase();
  if (!at || /^(all|unstated|n\/a|none)\b/.test(at)) return { unconstrained: true, spans: [], raw: at };
  const spans = [];
  for (const tok of at.split(',')) {
    const m = tok.trim().match(/^[sp]?(\d+)\s*(?:-\s*[sp]?(\d+))?$/);
    if (m) spans.push([Number(m[1]), Number(m[2] || m[1])]);
  }
  return spans.length ? { unconstrained: false, spans, raw: at } : { unconstrained: true, spans: [], raw: at };
}

function firstSentence(s) {
  const t = String(s || '').trim();
  const m = t.match(/^(.+?[.!?])(\s|$)/);
  return (m ? m[1] : t).trim();
}

function parseGold(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const base = path.basename(file);
  const idFromName = (base.match(/^(real-\d+)/) || [])[1];
  const idFromHead = (text.match(/#\s*Worksheet:\s*(real-\d+)/i) || [])[1];

  const gold = {
    file, caseId: idFromName || idFromHead || base,
    caseFile: (text.match(/\*\*Case file:\*\*\s*(.+)/) || [])[1] || null,
    labeler: (text.match(/Labeler:\s*([A-Za-z0-9]+)/) || [])[1] || null,
    reviewNeeded: /REVIEW-NEEDED/i.test(text),
    missingSections: SECTIONS.filter(s => sectionLines(lines, s) === null),
    issues: [], mustCatch: null, restraint: { isRestraintCase: false, basis: null },
  };

  const levelLine = lines.find(l => /-\s*\*\*Level:\*\*/i.test(l)) || '';
  const levelText = levelLine.replace(/.*\*\*Level:\*\*/i, '').trim();
  const rm = levelText.match(/\bR([0-3])\b/);
  gold.readinessIdx = rm ? Number(rm[1]) : null;
  gold.readinessText = levelText || null;
  gold.readinessLevel = gold.readinessIdx === null ? null : LEVELS[gold.readinessIdx];
  gold.reason = ((lines.find(l => /One-sentence reason:/i.test(l)) || '').replace(/.*One-sentence reason:\*\*/i, '') || '').trim();

  const blockLine = lines.find(l => /Blocking rules fired/i.test(l)) || '';
  const blockText = blockLine.replace(/.*\*\*Blocking rules fired[^*]*\*\*/i, '').trim();
  gold.blockingText = blockText;
  gold.hasBlocking = !(blockText === '' || /^none\b/i.test(blockText));

  const body = sectionLines(lines, 'Real top issues, ranked') || [];
  let cur = null;
  for (const raw of body) {
    const numbered = raw.match(/^\s*(\d+)\.\s+(.*)$/);
    if (numbered) {
      cur = { rank: Number(numbered[1]), text: numbered[2].trim(), severity: null, dimension: null, type: null, mustCatch: false, at: null };
      gold.issues.push(cur);
      continue;
    }
    if (!cur) continue;
    const meta = /severity:|dimension:|type:|at:/i.test(raw);
    if (meta) {
      const sev = raw.match(/severity:\s*([^;]+)/i);
      const dim = raw.match(/dimension:\s*([^;]+)/i);
      const typ = raw.match(/type:\s*([^;]+)/i);
      const at = raw.match(/at:\s*([^;]+)/i);
      if (sev) cur.severity = sev[1].trim().toLowerCase();
      if (dim) cur.dimension = dim[1].trim();
      if (typ) cur.type = typ[1].trim().toLowerCase();
      if (at) cur.at = parseAt(at[1]);
    }
    if (/\[MUST-CATCH\]/i.test(raw)) cur.mustCatch = true;
    if (!meta && !/^\s*-\s/.test(raw) && raw.trim()) cur.text += ' ' + raw.trim();   // wrapped prose
  }
  for (const it of gold.issues) {
    if (!it.at) it.at = parseAt('unstated');
    it.anchor = firstSentence(it.text);
  }
  gold.mustCatch = gold.issues.find(i => i.mustCatch) || null;

  // restraint: either the explicit worksheet marker, or the gold naming restraint in the
  // section that says what feedback would be wrong (real-05 does exactly this).
  if (body.some(l => /none,?\s*restraint case/i.test(l))) {
    gold.restraint = { isRestraintCase: true, basis: 'issues section marks "none, restraint case"' };
  } else {
    const un = (sectionLines(lines, 'Unacceptable AI feedback') || []).join(' ');
    if (/restraint/i.test(un)) gold.restraint = { isRestraintCase: true, basis: 'gold names restraint under "Unacceptable AI feedback"' };
  }

  gold.falsePositives = (sectionLines(lines, 'False positives to avoid') || []).join(' ').trim();
  gold.falseNegatives = (sectionLines(lines, 'False negatives to catch') || []).join(' ').trim();
  return gold;
}

// ---- gold eligibility (hard rule 2) ---------------------------------------
/* A run may only touch a case whose gold exists, passes check-gold.js and carries no
 * REVIEW-NEEDED banner. Everything else is skipped, loudly. */
function goldEligibility(goldFile) {
  const out = { file: goldFile, eligible: false, reasons: [] };
  if (!fs.existsSync(goldFile)) { out.reasons.push('no gold file'); return out; }
  let gold;
  try { gold = parseGold(goldFile); }
  catch (e) { out.reasons.push('gold does not parse: ' + e.message); return out; }
  out.caseId = gold.caseId;
  out.caseFile = gold.caseFile;
  if (gold.reviewNeeded) out.reasons.push('carries a REVIEW-NEEDED banner, human call pending');
  try {
    execFileSync(process.execPath, [path.join(__dirname, 'check-gold.js'), goldFile], { stdio: 'pipe' });
  } catch (e) {
    const said = String((e.stdout || '')).trim().split(/\r?\n/).filter(Boolean).join('; ');
    out.reasons.push('check-gold.js reports contradictions: ' + (said || 'exit ' + e.status));
  }
  if (gold.readinessIdx === null) out.reasons.push('no parseable readiness level');
  if (!gold.mustCatch && !gold.restraint.isRestraintCase) out.reasons.push('no must-catch and not a restraint case');
  out.eligible = out.reasons.length === 0;
  return out;
}

function listEligibleGolds(dir) {
  return fs.readdirSync(dir)
    .filter(f => /^real-\d+\.gold\.md$/.test(f))
    .sort()
    .map(f => goldEligibility(path.join(dir, f)));
}

// ---- matching -------------------------------------------------------------
function findingText(f) {
  return [f.short, f.title, f.principle, f.diagnosis, f.why, f.fix, (f.tags || []).join(' ')].filter(Boolean).join(' . ');
}

function slideOverlap(goldAt, finding) {
  const slides = (finding.evidence || []).map(e => e.slide).filter(n => typeof n === 'number');
  if (goldAt.unconstrained) return { ok: true, basis: 'gold location is "' + goldAt.raw + '", not constraining', slides };
  if (!slides.length) return { ok: false, basis: 'finding carries no slide number', slides };
  for (const s of slides) {
    for (const [lo, hi] of goldAt.spans) {
      if (s >= lo && s <= hi) return { ok: true, basis: 'slide ' + s + ' inside gold span ' + lo + '-' + hi, slides };
      if (s >= lo - SLIDE_TOLERANCE && s <= hi + SLIDE_TOLERANCE)
        return { ok: true, basis: 'slide ' + s + ' within ' + SLIDE_TOLERANCE + ' of gold span ' + lo + '-' + hi, slides };
    }
  }
  return { ok: false, basis: 'slides ' + slides.join(',') + ' are outside gold ' + goldAt.raw, slides };
}

function typeCompatible(goldType, issueType) {
  const allowed = GOLD_TYPE_TO_ISSUE_TYPES[goldType];
  if (allowed === null || allowed === undefined) return { ok: true, basis: 'gold type "' + goldType + '" does not constrain issueType' };
  return allowed.includes(issueType)
    ? { ok: true, basis: 'issueType "' + issueType + '" is compatible with gold type "' + goldType + '"' }
    : { ok: false, basis: 'issueType "' + issueType + '" is not one of ' + allowed.join('/') + ' for gold type "' + goldType + '"' };
}

function dimensionSignal(goldDim, finding, review) {
  const cues = DIMENSION_CUES[goldDim] || [];
  const bag = concepts(findingText(finding));
  const hitCues = cues.filter(c => bag.has(singular(c)) || bag.has(TERM_TO_CONCEPT.get(c) || c));
  const contractDim = GOLD_DIM_TO_CONTRACT_DIM[goldDim] || goldDim;
  const row = ((review.scorecard && review.scorecard.dimensions) || []).find(d => d.name === contractDim);
  return {
    ok: hitCues.length > 0,
    basis: hitCues.length ? 'uses dimension cues: ' + hitCues.slice(0, 4).join(', ') : 'no cue for "' + goldDim + '" in the finding text',
    scorecardResult: row ? row.result : null,   // reported, never a gate: "partial" is near universal
  };
}

/* Score one gold issue against one finding. Text overlap is mandatory, the other three
 * signals vote. Two of three plus enough text is a hit. */
function scorePair(goldIssue, finding, findingIdx, review) {
  const fBag = concepts(findingText(finding));
  const aBag = concepts(goldIssue.anchor);
  const bBag = concepts(goldIssue.text);
  const anchorCoverage = coverage(aBag, fBag);
  const bodyCoverage = coverage(bBag, fBag);
  const textScore = 0.65 * anchorCoverage + 0.35 * bodyCoverage;

  const slide = slideOverlap(goldIssue.at, finding);
  const type = typeCompatible(goldIssue.type, finding.issueType);
  const dim = dimensionSignal(goldIssue.dimension, finding, review);
  const support = [slide.ok, type.ok, dim.ok].filter(Boolean).length;

  let verdict = 'miss';
  if (textScore >= T_HIT && support >= 2) verdict = 'hit';
  else if ((textScore >= T_NEAR && support >= 2) || (textScore >= T_HIT && support === 1)) verdict = 'near';

  return {
    findingIndex: findingIdx, short: finding.short, severity: finding.severity, issueType: finding.issueType,
    verdict,
    textScore: Number(textScore.toFixed(3)),
    anchorCoverage: Number(anchorCoverage.toFixed(3)),
    bodyCoverage: Number(bodyCoverage.toFixed(3)),
    support,
    slide, type, dimension: dim,
    sharedConcepts: shared(aBag, fBag).sort(),
  };
}

function bestMatch(goldIssue, review) {
  const cands = (review.findings || []).map((f, i) => scorePair(goldIssue, f, i, review));
  const rank = { hit: 2, near: 1, miss: 0 };
  cands.sort((a, b) => (rank[b.verdict] - rank[a.verdict]) || (b.textScore - a.textScore) || (b.support - a.support));
  return { best: cands[0] || null, candidates: cands.slice(0, 3) };
}

// ---- the score ------------------------------------------------------------
const SEV_RANK = { critical: 0, major: 1, minor: 2 };

function scoreReview(review, gold, extra) {
  const predIdx = LEVELS.indexOf(review.readiness && review.readiness.level);
  const goldIdx = gold.readinessIdx;
  const delta = predIdx === -1 || goldIdx === null ? null : predIdx - goldIdx;

  const readiness = {
    gold: gold.readinessLevel, goldIdx,
    predicted: (review.readiness && review.readiness.level) || null, predIdx: predIdx === -1 ? null : predIdx,
    exact: delta === 0,
    withinOne: delta !== null && Math.abs(delta) <= 1,
    delta,
    // delta < 0 means the model called it worse than the human did
    direction: delta === null ? 'unscored' : delta === 0 ? 'exact' : delta < 0 ? 'over-flag' : 'under-flag',
  };

  // must-catch recall
  let mustCatch = { present: false, verdict: 'na', note: 'gold carries no must-catch (restraint case)' };
  let severityAlignment = null;
  if (gold.mustCatch) {
    const { best, candidates } = bestMatch(gold.mustCatch, review);
    mustCatch = {
      present: true,
      verdict: best ? best.verdict : 'miss',
      gold: {
        rank: gold.mustCatch.rank, anchor: gold.mustCatch.anchor, severity: gold.mustCatch.severity,
        dimension: gold.mustCatch.dimension, type: gold.mustCatch.type, at: gold.mustCatch.at.raw,
      },
      match: best && best.verdict !== 'miss' ? best : null,
      candidates,
    };
    if (mustCatch.verdict === 'hit') {
      const pg = SEV_RANK[gold.mustCatch.severity];
      const pp = SEV_RANK[best.severity];
      severityAlignment = {
        gold: gold.mustCatch.severity, predicted: best.severity,
        exact: pg === pp,
        steps: (pg === undefined || pp === undefined) ? null : Math.abs(pg - pp),
        direction: pg === pp ? 'exact' : pp < pg ? 'harsher' : 'softer',
      };
    }
  }

  // coverage of the rest of the gold list, secondary and diagnostic only
  const byIssue = gold.issues.map(it => {
    const { best } = bestMatch(it, review);
    return { rank: it.rank, mustCatch: it.mustCatch, severity: it.severity, anchor: it.anchor, verdict: best ? best.verdict : 'miss', findingIndex: best && best.verdict !== 'miss' ? best.findingIndex : null };
  });

  // restraint and over-flagging
  const nBlocking = (review.blockingIssues || []).length;
  const criticals = (review.findings || []).filter(f => f.severity === 'critical').length;
  const goldCriticals = gold.issues.filter(i => i.severity === 'critical').length;
  const overFlag = delta !== null && delta < 0;
  const restraint = {
    isRestraintCase: gold.restraint.isRestraintCase,
    basis: gold.restraint.basis,
    overFlag,
    escalationSteps: overFlag ? -delta : 0,
    blockingFalsePositive: !gold.hasBlocking && nBlocking > 0,
    manufacturedCriticals: goldCriticals === 0 && criticals > 0 ? criticals : 0,
    goldFiredBlocking: gold.hasBlocking,
    reviewBlockingCount: nBlocking,
  };
  restraint.violation = restraint.isRestraintCase &&
    (restraint.overFlag || restraint.blockingFalsePositive || restraint.manufacturedCriticals > 0);

  // advisory: findings that echo the gold's "false positives to avoid" text
  const fpBag = concepts(gold.falsePositives);
  const falsePositiveWatch = fpBag.size === 0 ? [] : (review.findings || []).map((f, i) => {
    const c = coverage(concepts(findingText(f)), fpBag);
    return { findingIndex: i, short: f.short, overlapWithFalsePositiveList: Number(c.toFixed(3)) };
  }).filter(x => x.overlapWithFalsePositiveList >= 0.25);

  return {
    matcherVersion: MATCHER_VERSION,
    thresholds: { hit: T_HIT, near: T_NEAR, slideTolerance: SLIDE_TOLERANCE },
    case: gold.caseId,
    goldFile: path.basename(gold.file),
    scoredAt: new Date().toISOString(),
    run: extra || null,
    readiness, mustCatch, severityAlignment, restraint,
    issueCoverage: {
      goldIssues: gold.issues.length,
      hits: byIssue.filter(b => b.verdict === 'hit').length,
      nears: byIssue.filter(b => b.verdict === 'near').length,
      byIssue,
    },
    reviewShape: {
      findings: (review.findings || []).length,
      blockingIssues: nBlocking,
      criticals,
      confidence: (review.readiness && review.readiness.confidence) || null,
      diagnosticMean: (review.scorecard && review.scorecard.diagnosticMean) || null,
    },
    falsePositiveWatch,
  };
}

// ---- human-readable report ------------------------------------------------
function renderScore(s) {
  const L = [];
  const tick = b => (b ? 'yes' : 'no');
  L.push('CASE ' + s.case + '   (' + s.goldFile + ', matcher ' + s.matcherVersion + ')');
  L.push('');
  L.push('READINESS');
  L.push('  gold      ' + s.readiness.gold + '  (R' + s.readiness.goldIdx + ')');
  L.push('  review    ' + s.readiness.predicted + '  (R' + s.readiness.predIdx + ')');
  L.push('  exact ' + tick(s.readiness.exact) + ', within-one ' + tick(s.readiness.withinOne) + ', delta ' + s.readiness.delta + ' (' + s.readiness.direction + ')');
  L.push('');
  L.push('MUST-CATCH  ' + s.mustCatch.verdict.toUpperCase());
  if (s.mustCatch.present) {
    L.push('  gold issue  ' + s.mustCatch.gold.anchor);
    L.push('  gold meta   severity ' + s.mustCatch.gold.severity + '; dimension ' + s.mustCatch.gold.dimension + '; type ' + s.mustCatch.gold.type + '; at ' + s.mustCatch.gold.at);
    for (const c of s.mustCatch.candidates) {
      L.push('  - [' + c.verdict + '] finding ' + (c.findingIndex + 1) + ' "' + c.short + '"  text ' + c.textScore + ' (anchor ' + c.anchorCoverage + ', body ' + c.bodyCoverage + '), support ' + c.support + '/3');
      L.push('      slide:     ' + c.slide.basis);
      L.push('      type:      ' + c.type.basis);
      L.push('      dimension: ' + c.dimension.basis + ' [scorecard: ' + c.dimension.scorecardResult + ']');
      if (c.sharedConcepts.length) L.push('      shared:    ' + c.sharedConcepts.join(' '));
    }
  } else {
    L.push('  ' + s.mustCatch.note);
  }
  if (s.severityAlignment) {
    L.push('');
    L.push('SEVERITY ON THE MATCH');
    L.push('  gold ' + s.severityAlignment.gold + ' vs review ' + s.severityAlignment.predicted +
      '  (' + (s.severityAlignment.exact ? 'exact' : s.severityAlignment.steps + ' step ' + s.severityAlignment.direction) + ')');
  }
  L.push('');
  L.push('RESTRAINT AND OVER-FLAGGING');
  L.push('  restraint case      ' + tick(s.restraint.isRestraintCase) + (s.restraint.basis ? '  (' + s.restraint.basis + ')' : ''));
  L.push('  escalated above gold ' + tick(s.restraint.overFlag) + (s.restraint.overFlag ? ', by ' + s.restraint.escalationSteps + ' level(s)' : ''));
  L.push('  blocking issues     gold ' + tick(s.restraint.goldFiredBlocking) + ', review ' + s.restraint.reviewBlockingCount +
    (s.restraint.blockingFalsePositive ? '   <-- blocking false positive' : ''));
  if (s.restraint.manufacturedCriticals) L.push('  criticals with none in gold: ' + s.restraint.manufacturedCriticals);
  if (s.restraint.violation) L.push('  ** RESTRAINT VIOLATION on a gold restraint case **');
  L.push('');
  L.push('SECONDARY');
  L.push('  gold issue coverage  ' + s.issueCoverage.hits + ' hit, ' + s.issueCoverage.nears + ' near, of ' + s.issueCoverage.goldIssues);
  for (const b of s.issueCoverage.byIssue) {
    L.push('    ' + b.rank + '. [' + b.verdict + '] ' + (b.mustCatch ? '(must-catch) ' : '') + b.anchor.slice(0, 90));
  }
  L.push('  review shape         ' + s.reviewShape.findings + ' findings, ' + s.reviewShape.blockingIssues + ' blocking, ' +
    s.reviewShape.criticals + ' critical, confidence ' + s.reviewShape.confidence + ', diagnosticMean ' + s.reviewShape.diagnosticMean);
  if (s.falsePositiveWatch.length) {
    L.push('  findings overlapping the gold false-positive list (advisory, not scored):');
    for (const f of s.falsePositiveWatch) L.push('    finding ' + (f.findingIndex + 1) + ' "' + f.short + '"  overlap ' + f.overlapWithFalsePositiveList);
  }
  return L.join('\n');
}

// ---- CLI ------------------------------------------------------------------
function main(argv) {
  const asJson = argv.includes('--json');
  const args = argv.filter(a => a !== '--json');

  if (args[0] === '--eligible') {
    const dir = args[1] || path.join(__dirname, 'eval-cases-real', 'labeling');
    const rows = listEligibleGolds(dir);
    if (asJson) { console.log(JSON.stringify(rows, null, 2)); return 0; }
    console.log('Gold eligibility in ' + dir);
    for (const r of rows) console.log('  ' + (r.eligible ? 'OK      ' : 'SKIP    ') + path.basename(r.file) + (r.eligible ? '' : '  -- ' + r.reasons.join('; ')));
    console.log('  ' + rows.filter(r => r.eligible).length + ' of ' + rows.length + ' usable');
    return 0;
  }

  if (args[0] === '--parse') {
    if (!args[1]) { console.error('usage: node score-review.js --parse <gold.md>'); return 2; }
    const g = parseGold(args[1]);
    if (asJson) { console.log(JSON.stringify(g, null, 2)); return 0; }
    console.log(g.caseId + '  R' + g.readinessIdx + ' ' + g.readinessLevel);
    console.log('  case file      ' + g.caseFile);
    console.log('  blocking       ' + (g.hasBlocking ? g.blockingText : 'none'));
    console.log('  restraint case ' + g.restraint.isRestraintCase + (g.restraint.basis ? '  (' + g.restraint.basis + ')' : ''));
    console.log('  missing sections ' + (g.missingSections.length ? g.missingSections.join(', ') : 'none'));
    console.log('  issues:');
    for (const it of g.issues)
      console.log('    ' + it.rank + '. ' + (it.mustCatch ? '[MUST-CATCH] ' : '') + it.severity + ' / ' + it.dimension + ' / ' + it.type + ' / at ' + it.at.raw +
        '\n        ' + it.anchor);
    return 0;
  }

  if (args.length < 2) {
    console.error('usage: node score-review.js <review.json> <gold.md> [--json]');
    console.error('       node score-review.js --parse <gold.md> [--json]');
    console.error('       node score-review.js --eligible <labeling-dir> [--json]');
    return 2;
  }

  const [reviewPath, goldPath] = args;
  const elig = goldEligibility(goldPath);
  if (!elig.eligible) {
    console.error('REFUSING to score against a gold that is not final: ' + elig.reasons.join('; '));
    return 2;
  }
  let review;
  try { review = JSON.parse(fs.readFileSync(reviewPath, 'utf8')); }
  catch (e) { console.error('cannot read review JSON: ' + e.message); return 2; }

  const gold = parseGold(goldPath);
  const s = scoreReview(review, gold, { reviewFile: path.basename(reviewPath) });
  console.log(asJson ? JSON.stringify(s, null, 2) : renderScore(s));
  return 0;
}

module.exports = {
  parseGold, scoreReview, renderScore, goldEligibility, listEligibleGolds, LEVELS, MATCHER_VERSION,
  _concepts: concepts,   // exported for fixtures/score-review.test.sh only
};

if (require.main === module) process.exit(main(process.argv.slice(2)));
