#!/usr/bin/env node
/*
 * run-reviews.js — run the frozen reviewer over every gold-backed real case and score it.
 *
 * BRICK 2 of the calibration engine. This is the only file in the harness that spends money.
 *
 * Per case: build the reviewer input (frozen system prompt from 04-prompt-templates.md
 * section A, plus the section B template filled from the case file, MODE deep) -> call the
 * model with the output contract as a response schema -> validate with check-review-v2.js
 * (contract plus verbatim quotes) -> score with score-review.js -> collect.
 *
 * HARD RULES ENFORCED HERE
 *   1. A case is only ever run when its gold exists, passes check-gold.js and carries no
 *      REVIEW-NEEDED banner. Everything else is skipped and reported as skipped.
 *   2. The system prompt is read from the frozen document at run time and hashed. The hash
 *      goes in the manifest, so a run under an edited prompt is visibly not comparable.
 *   3. Everything written lands under a gitignored output directory. Reviews quote client
 *      decks verbatim.
 *
 * Usage:
 *   node run-reviews.js --dry-run                 build the packs, estimate cost, no API call
 *   node run-reviews.js                           the real run (spends money, needs an API key)
 *   node run-reviews.js --cases 05,13             a subset
 *   node run-reviews.js --rescore <run-dir>       re-score an existing run, no API call
 *   node run-reviews.js --effort xhigh            override the effort level
 *   node run-reviews.js --help                    print this list, spends nothing
 *
 * Unknown flags exit 2 rather than running. Do not guess a flag: an unrecognised one used
 * to be treated as a plain live run over every case.
 *
 * Env: ANTHROPIC_API_KEY (or an `ant auth login` profile). Required only for the real run
 * above. The two modes below never touch the SDK and never need a key or spend anything:
 *
 *   node run-reviews.js --emit-packs              write per-case input packs, no API call
 *   node run-reviews.js --collect <packs-dir>     score subagent-produced reviews, no API call
 *
 * The no-API path: emit-packs writes each eligible case's frozen-prompt + input pack to
 * <outDir>/<caseId>.input.md. A Claude Code agent (this session, or a subagent per case)
 * reads that file, plays the reviewer exactly as instructed, and writes ONLY the JSON
 * object to <outDir>/<caseId>.review.json, nothing else in the file. Once every case has a
 * review.json sitting next to its input.md, --collect validates each against the contract
 * and scores it against gold, same as the API path does, with zero dollars spent.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseGold, scoreReview, goldEligibility, MATCHER_VERSION } = require('./score-review.js');

// ---- pinned run configuration ---------------------------------------------
/* Everything here is recorded in the run manifest. Changing any of it makes a run
 * incomparable with earlier ones, which is the point of pinning it in one place. */
const CONFIG = {
  model: 'claude-opus-5',
  effort: 'high',            // low | medium | high | xhigh | max
  thinking: 'adaptive',
  maxTokens: 64000,          // streamed, so no HTTP timeout risk
  mode: 'deep',
  promptVersion: 'frozen-2026-08-05c',   // the tag the labeling record pins the prompt to
  concurrency: 3,
  // Claude Opus 5, dollars per million tokens. Used only for the cost estimate line.
  price: { inputPerM: 5, outputPerM: 25 },
};

const V2 = __dirname;
const CASES_DIR = path.join(V2, 'eval-cases-real');
const GOLD_DIR = path.join(CASES_DIR, 'labeling');
const OUT_ROOT = path.join(V2, 'eval-runs', 'real-baseline');

// ---- frozen prompt --------------------------------------------------------
/* Read section A out of 04-prompt-templates.md rather than copying it into this file, so
 * the harness cannot drift from the document, and hash it so the manifest proves which
 * text ran. */
function loadFrozenPrompt() {
  const doc = fs.readFileSync(path.join(V2, '04-prompt-templates.md'), 'utf8');
  const start = doc.indexOf('## A. System prompt');
  if (start === -1) throw new Error('cannot find section A in 04-prompt-templates.md');
  const open = doc.indexOf('```', start);
  const close = doc.indexOf('```', open + 3);
  if (open === -1 || close === -1) throw new Error('cannot find the section A code fence');
  const text = doc.slice(open + 3, close).replace(/^\r?\n/, '').replace(/\r?\n$/, '');
  const hash = require('crypto').createHash('sha256').update(text).digest('hex').slice(0, 16);
  return { text, hash };
}

/* Pull one "## X." section out of a markdown document, up to the next "## " heading. */
function loadSection(file, heading) {
  const doc = fs.readFileSync(path.join(V2, file), 'utf8');
  const start = doc.indexOf(heading);
  if (start === -1) throw new Error('cannot find "' + heading + '" in ' + file);
  const after = doc.slice(start + heading.length);
  const m = /\r?\n## /.exec(after);
  const end = m ? start + heading.length + m.index : doc.length;
  return doc.slice(start, end).trim();
}

/* The reference material the system prompt REFERS TO but does not contain.
 *
 * Found 2026-08-05 by a blind smoke-test reviewer, and it is longstanding: every pack back
 * to the 07-29 baseline had this gap. Section A says "Cut to the noise budget for the mode
 * (below)" and there was no below, because only section A was extracted. It says "see the
 * scope matrix you were given" and nothing was given. And it says "matching the v2 output
 * contract" while the contract lived only in a note inside run-manifest.json, which the
 * reviewing subagent is never told to read.
 *
 * The practical effect was that the reviewer's noise budget, its artifact-type scope rules
 * and its output shape all depended on how the human operator happened to word the subagent
 * instruction. That is an uncontrolled variable sitting underneath every measurement the
 * project has taken. Putting the material in the pack makes the pack self-contained, so the
 * result depends on the frozen text and nothing else. */
function loadReferenceBlocks() {
  const text = [
    '<!-- REFERENCE MATERIAL. The system prompt above refers to each of these. It is part of',
    '     the frozen context and it is hashed with the prompt. -->',
    '',
    '# The three modes, and the noise budget the prompt tells you to cut to',
    '',
    loadSection('04-prompt-templates.md', '## C. The three modes'),
    '',
    '# The artifact-type scope matrix the prompt says you were given',
    '',
    loadSection('01-rubric-v1.md', '## C. Artifact-type scope matrix'),
    '',
    '# The v2 output contract your JSON must match exactly',
    '',
    fs.readFileSync(path.join(V2, '03-output-contract.md'), 'utf8').trim(),
  ].join('\n');
  const hash = require('crypto').createHash('sha256').update(text).digest('hex').slice(0, 16);
  return { text, hash };
}

/* The section B field labels, read from the same document. Used to assert the pack this
 * file builds still matches the template the teams are told to paste. */
function loadInputTemplateLabels() {
  const doc = fs.readFileSync(path.join(V2, '04-prompt-templates.md'), 'utf8');
  const start = doc.indexOf('## B. Team input template');
  const open = doc.indexOf('```', start);
  const close = doc.indexOf('```', open + 3);
  const block = doc.slice(open + 3, close);
  return block.split(/\r?\n/).map(l => (l.match(/^([A-Z][A-Z \-()]*[A-Z)]):/) || [])[1]).filter(Boolean);
}

// ---- case files -----------------------------------------------------------
function findCaseFile(caseId) {
  const hit = fs.readdirSync(CASES_DIR).find(f => f.startsWith(caseId + '-') && f.endsWith('.md'));
  return hit ? path.join(CASES_DIR, hit) : null;
}

/* Pull the intake header off a case file and split the deliverable body away from it.
 * The body starts at the first numbered slide or page block. */
function readCase(caseFile) {
  const raw = fs.readFileSync(caseFile, 'utf8');
  const lines = raw.split(/\r?\n/);
  const first = lines.findIndex(l => /^\*\*(Slide|Page)\s*1\./.test(l));
  if (first < 0) throw new Error('no "Slide 1." or "Page 1." block in ' + path.basename(caseFile));
  const header = lines.slice(0, first).join('\n');
  const body = lines.slice(first).join('\n').trim();
  const field = name => {
    const m = header.match(new RegExp('\\*\\*' + name + '[^*]*:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\s*[-*]?\\s*\\*\\*|\\n\\n)', 'i'));
    return m ? m[1].replace(/\s*\n\s*/g, ' ').trim().replace(/\.$/, '') : '';
  };
  const blocks = (raw.match(/^\*\*(Slide|Page)\s*\d+\./gm) || []).length;
  return {
    file: caseFile,
    client: field('Client \\(pseudonymised\\)'),
    artifactRaw: field('Artifact type'),
    question: field('Client question'),
    stageRaw: field('Deliverable stage'),
    blocks, body,
  };
}

/* Map the intake metadata onto the contract's artifact-type enum and the template's stage
 * and maturity vocabularies. Written down rather than inferred at the call site because
 * the mapping is a judgment call that has to stay identical across runs.
 *
 * "report" is not in the contract enum. Reports here are documents that are expected to
 * recommend, so they map to final recommendation deck, which is the only enum value that
 * scores recommendation specificity and feasibility in full. Both draft deck and final
 * recommendation deck score all ten dimensions (rubric section C), so the choice between
 * them never changes which dimensions are in scope. */
function deriveInputMeta(c) {
  const stage = /final/i.test(c.stageRaw) ? 'final'
    : /deliverable\s*1/i.test(c.stageRaw) ? 'early'
      : 'mid';
  const isReport = /report|business plan|memo/i.test(c.artifactRaw);
  const artifactType = (stage === 'final' || isReport) ? 'final recommendation deck' : 'draft deck';
  const maturity = stage === 'final' ? 'near final' : 'working draft';
  return { artifactType, stage, maturity };
}

function buildInputPack(c, meta, templateLabels) {
  const pack = `MODE: ${CONFIG.mode}
CLIENT TYPE (anonymized): ${c.client}
ARTIFACT TYPE: ${meta.artifactType}
CLIENT QUESTION: ${c.question}
INTENDED AUDIENCE:
PROJECT STAGE: ${meta.stage}
DRAFT MATURITY: ${meta.maturity}
SPECIFIC FEEDBACK REQUESTED:
KNOWN CONSTRAINTS:
WHAT THE TEAM IS UNSURE ABOUT:
EVIDENCE AND SOURCE NOTES:
RECOMMENDATIONS (if any):
IMPLEMENTATION PLAN (if any):

DELIVERABLE TEXT (one block per slide or section, with numbers):

${c.body}
`;
  // the blank fields are deliberate: the human labeler had no extra context either, so
  // supplying any would make the run and the gold answer different questions.
  const emitted = pack.split(/\r?\n/).map(l => (l.match(/^([A-Z][A-Z \-()]*[A-Z)]):/) || [])[1]).filter(Boolean);
  for (const label of templateLabels) {
    if (!emitted.includes(label)) throw new Error('input pack is missing template field "' + label + '"');
  }
  return pack;
}

// ---- the response schema --------------------------------------------------
/* The output contract as a JSON schema, so the model cannot return a shape the validator
 * would reject. Structured outputs require additionalProperties false on every object and
 * do not support array length or numeric range constraints, so the ten-dimension rule and
 * the noise budget stay where they already are: in the prompt, and in check-review-v2.js.
 *
 * `timeline` is deliberately absent. It is optional in the contract, no scoring metric
 * reads it, and its tiles-length invariant would fail a 43 slide deck over a field that
 * only drives an optional strip in the renderer. Recorded in the manifest as a deviation. */
const evidence = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      slide: { type: 'integer', description: 'slide or page number the quote comes from' },
      quote: { type: 'string', description: 'verbatim text from the deliverable' },
    },
    required: ['slide', 'quote'], additionalProperties: false,
  },
};

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    meta: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        client: { type: 'string' },
        artifactType: { type: 'string', enum: ['kickoff problem frame', 'research plan', 'interview guide', 'synthesis memo', 'draft deck', 'final recommendation deck', 'implementation roadmap'] },
        mode: { type: 'string', enum: ['short', 'deep', 'lead'] },
        slideCount: { type: 'integer' },
        version: { type: 'string', enum: ['Review v2'] },
      },
      required: ['title', 'client', 'artifactType', 'mode', 'slideCount', 'version'], additionalProperties: false,
    },
    readiness: {
      type: 'object',
      properties: {
        level: { type: 'string', enum: ['Not ready for client review', 'Needs substantial revision', 'Needs targeted revision', 'Nearly ready with minor edits'] },
        mainReason: { type: 'string' },
        highestRiskIssue: { type: 'string' },
        confidence: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        whatCouldChangeIt: { type: 'string' },
      },
      required: ['level', 'mainReason', 'highestRiskIssue', 'confidence', 'whatCouldChangeIt'], additionalProperties: false,
    },
    blockingIssues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          rule: { type: 'integer' },
          label: { type: 'string' },
          ceiling: { type: 'string', enum: ['Not ready for client review', 'Needs substantial revision', 'Needs targeted revision', 'Nearly ready with minor edits'] },
          evidence,
        },
        required: ['rule', 'label', 'ceiling', 'evidence'], additionalProperties: false,
      },
    },
    scorecard: {
      type: 'object',
      properties: {
        diagnosticMean: { type: 'number' },
        confidence: { type: 'string', enum: ['Low', 'Medium', 'High'] },
        effort: { type: 'string', description: 'rough hours to fix, for example 4-6 hrs' },
        dimensions: {
          type: 'array',
          description: 'exactly the ten rubric dimensions, in rubric order',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', enum: ['Client decision usefulness', 'Problem framing', 'Storyline and pyramid logic', 'Evidence quality', 'Analysis and insight', 'Recommendation specificity', 'Feasibility and implementation', 'Risks, assumptions and uncertainty', 'Slide-level communication', 'Professionalism, tone and confidentiality'] },
              result: { type: 'string', enum: ['pass', 'partial', 'fail', 'na'] },
              checksPassed: { type: 'integer' },
              checksTotal: { type: 'integer' },
              note: { type: 'string' },
            },
            required: ['name', 'result', 'checksPassed', 'checksTotal', 'note'], additionalProperties: false,
          },
        },
      },
      required: ['diagnosticMean', 'confidence', 'effort', 'dimensions'], additionalProperties: false,
    },
    strengths: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          point: { type: 'string' },
          quote: { type: 'string', description: 'verbatim supporting text' },
          slide: { type: 'integer' },
        },
        required: ['point', 'quote', 'slide'], additionalProperties: false,
      },
    },
    findings: {
      type: 'array',
      description: 'at most five in deep mode, sorted by severity with delivery-critical first',
      items: {
        type: 'object',
        properties: {
          short: { type: 'string', description: '2 to 4 words' },
          title: { type: 'string' },
          severity: { type: 'string', enum: ['critical', 'major', 'minor'] },
          severityLabel: { type: 'string', enum: ['High impact', 'Moderate', 'Minor'] },
          deliveryCritical: { type: 'boolean' },
          issueType: { type: 'string', enum: ['thinking', 'evidence', 'recommendation', 'implementation', 'communication'] },
          owner: { type: 'string', enum: ['team', 'project lead', 'board reviewer', 'client clarification'] },
          principle: { type: 'string' },
          diagnosis: { type: 'string' },
          evidence,
          why: { type: 'string' },
          reflect: { type: 'string' },
          fix: { type: 'string', description: 'directional move plus the principle, never pasteable slide text' },
          tags: { type: 'array', items: { type: 'string' } },
        },
        required: ['short', 'title', 'severity', 'severityLabel', 'deliveryCritical', 'issueType', 'owner', 'principle', 'diagnosis', 'evidence', 'why', 'reflect', 'fix', 'tags'],
        additionalProperties: false,
      },
    },
    comments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          problem: { type: 'string' },
          why: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['location', 'problem', 'why', 'fix'], additionalProperties: false,
      },
    },
    questionsForLead: { type: 'array', items: { type: 'string' }, description: 'at most five' },
    learningNote: {
      type: 'object',
      properties: {
        lesson: { type: 'string' },
        weakHabit: { type: 'string' },
        exercise: { type: 'string' },
        principle: { type: 'string' },
      },
      required: ['lesson', 'weakHabit', 'exercise', 'principle'], additionalProperties: false,
    },
    notAssessed: { type: 'array', items: { type: 'string' }, description: 'required and non-empty' },
  },
  required: ['meta', 'readiness', 'blockingIssues', 'scorecard', 'strengths', 'findings', 'comments', 'questionsForLead', 'learningNote', 'notAssessed'],
  additionalProperties: false,
};

// ---- the call -------------------------------------------------------------
async function callReviewer(client, systemPrompt, inputPack, cfg) {
  const stream = client.messages.stream({
    model: cfg.model,
    max_tokens: cfg.maxTokens,
    system: [{ type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } }],
    thinking: { type: cfg.thinking },
    output_config: {
      effort: cfg.effort,
      format: { type: 'json_schema', schema: REVIEW_SCHEMA },
    },
    messages: [{ role: 'user', content: inputPack }],
  });
  const message = await stream.finalMessage();
  if (message.stop_reason === 'refusal') {
    const e = new Error('model refused: ' + JSON.stringify(message.stop_details || {}));
    e.refusal = true;
    throw e;
  }
  const text = (message.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return { message, text };
}

// ---- validation and scoring ----------------------------------------------
function validateReview(reviewPath, caseFile) {
  try {
    const out = execFileSync(process.execPath, [path.join(V2, 'check-review-v2.js'), reviewPath, caseFile], { encoding: 'utf8' });
    return { valid: true, report: out.trim() };
  } catch (e) {
    return { valid: false, report: String(e.stdout || e.message).trim() };
  }
}

// ---- run bookkeeping ------------------------------------------------------
function stamp() { return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19); }

function estimateTokens(s) { return Math.ceil(s.length / 3.6); }   // rough, English prose plus markup

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return results;
}

// ---- main -----------------------------------------------------------------
const USAGE = [
  'run-reviews.js — run the frozen reviewer over the gold-backed real cases and score it.',
  '',
  'Spends money:',
  '  node run-reviews.js                    the real run (needs ANTHROPIC_API_KEY)',
  '  node run-reviews.js --cases 05,13      a subset of the above',
  '  node run-reviews.js --model <id>       override the pinned model',
  '  node run-reviews.js --effort <level>   low | medium | high | xhigh | max',
  '  node run-reviews.js --concurrency <n>  parallel cases',
  '',
  'Free (no API call, no key):',
  '  node run-reviews.js --dry-run          build the packs and estimate cost',
  '  node run-reviews.js --emit-packs       write per-case input packs for subagents',
  '  node run-reviews.js --collect <dir>    score subagent-produced reviews in <dir>',
  '  node run-reviews.js --rescore <dir>    re-score an existing run with the current matcher',
  '  node run-reviews.js --help             this text',
].join('\n');

/* Flags that take the next argv entry as their value. Everything else is a boolean. */
const VALUE_FLAGS = ['cases', 'rescore', 'collect', 'model', 'effort', 'concurrency'];
const BOOL_FLAGS = ['dry-run', 'emit-packs', 'help', 'h'];

async function main(argv) {
  /* Flag guard. This file is the only one in the harness that spends money, and the
   * no-flag invocation is the live run, so anything unrecognised used to fall straight
   * through into a real pass over every case: `--help` once started one. Unknown flags
   * and the --flag=value form (which arg() below cannot see) now exit instead of running. */
  if (argv.includes('--help') || argv.includes('-h')) { console.log(USAGE); return 0; }
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    const name = token.startsWith('-') ? token.replace(/^--?/, '') : null;
    if (name !== null && VALUE_FLAGS.includes(name)) { i++; continue; }   // skip its value
    if (name !== null && BOOL_FLAGS.includes(name)) continue;
    const what = name === null ? 'unexpected argument' : 'unrecognised flag';
    console.error('run-reviews.js: ' + what + ' ' + token);
    console.error('Refusing to run. An argument this file does not understand is not a live run.\n');
    console.error(USAGE);
    return 2;
  }

  const arg = (name, fallback) => {
    const i = argv.indexOf('--' + name);
    return i === -1 ? fallback : argv[i + 1];
  };
  const dryRun = argv.includes('--dry-run');
  const rescoreDir = arg('rescore', null);
  const cfg = Object.assign({}, CONFIG, {
    model: arg('model', CONFIG.model),
    effort: arg('effort', CONFIG.effort),
    concurrency: Number(arg('concurrency', CONFIG.concurrency)),
  });
  const only = arg('cases', null);
  const wanted = only ? only.split(',').map(s => 'real-' + s.trim().replace(/^real-/, '')) : null;

  // ---- rescore path: no API, re-run the matcher over an existing run --------
  if (rescoreDir) {
    const dir = path.resolve(rescoreDir);
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'run-manifest.json'), 'utf8'));
    let n = 0;
    for (const row of manifest.cases.filter(c => c.status === 'ok')) {
      const review = JSON.parse(fs.readFileSync(path.join(dir, row.case + '.review.json'), 'utf8'));
      const gold = parseGold(path.join(GOLD_DIR, row.case + '.gold.md'));
      const s = scoreReview(review, gold, { reviewFile: row.case + '.review.json', rescoredFrom: manifest.matcherVersion });
      fs.writeFileSync(path.join(dir, row.case + '.score.json'), JSON.stringify(s, null, 2));
      n++;
    }
    manifest.matcherVersion = MATCHER_VERSION;
    manifest.rescoredAt = new Date().toISOString();
    fs.writeFileSync(path.join(dir, 'run-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('rescored ' + n + ' cases in ' + dir + ' with matcher ' + MATCHER_VERSION);
    return 0;
  }

  // ---- collect path: no API, no key. Gather subagent-produced reviews from an
  // --emit-packs directory: validate each against the contract, score against gold. -------
  const collectDir = arg('collect', null);
  if (collectDir) {
    const dir = path.resolve(collectDir);
    const manifestPath = path.join(dir, 'run-manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.executionMode !== 'claude-code-subagent') {
      console.error('refusing: ' + dir + ' was not produced by --emit-packs.');
      return 2;
    }
    let ok = 0, invalid = 0, missing = 0;
    for (const row of manifest.cases) {
      if (row.status !== 'pending') continue;
      const reviewPath = path.join(dir, row.case + '.review.json');
      if (!fs.existsSync(reviewPath)) { missing++; console.log('  pending ' + row.case + ': no review.json yet'); continue; }
      const caseFile = findCaseFile(row.case);
      const contract = validateReview(reviewPath, caseFile);
      const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
      const gold = parseGold(path.join(GOLD_DIR, row.case + '.gold.md'));
      const score = scoreReview(review, gold, {
        reviewFile: row.case + '.review.json',
        executionMode: 'claude-code-subagent',
        promptVersion: manifest.promptVersion, promptHash: manifest.promptSha256,
        contractValid: contract.valid,
      });
      fs.writeFileSync(path.join(dir, row.case + '.score.json'), JSON.stringify(score, null, 2));
      row.status = contract.valid ? 'ok' : 'invalid';
      row.contractValid = contract.valid;
      row.contractReport = contract.report;
      if (contract.valid) { ok++; console.log('  ok      ' + row.case + '  readiness ' + score.readiness.predicted + ' (gold ' + score.readiness.gold + '), must-catch ' + score.mustCatch.verdict); }
      else { invalid++; console.log('  INVALID ' + row.case + ': ' + contract.report); }
    }
    manifest.matcherVersion = MATCHER_VERSION;
    manifest.collectedAt = new Date().toISOString();
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\ncollected ' + dir + ': ' + ok + ' ok, ' + invalid + ' invalid, ' + missing + ' still pending.');
    if (missing > 0) console.log('run --collect again once the remaining review.json files are written.');
    if (ok > 0 && missing === 0) console.log('next:  node scorecard.js "' + dir + '"');
    return missing > 0 || invalid > 0 ? 1 : 0;
  }

  // ---- gold gate (hard rule 2) --------------------------------------------
  const goldFiles = fs.readdirSync(GOLD_DIR).filter(f => /^real-\d+\.gold\.md$/.test(f)).sort();
  const gate = goldFiles.map(f => goldEligibility(path.join(GOLD_DIR, f)));
  const skipped = gate.filter(g => !g.eligible)
    .map(g => ({ case: (path.basename(g.file).match(/^(real-\d+)/) || [])[1], status: 'skipped', reasons: g.reasons }));
  let eligible = gate.filter(g => g.eligible).map(g => (path.basename(g.file).match(/^(real-\d+)/) || [])[1]);
  if (wanted) {
    const refused = wanted.filter(c => !eligible.includes(c));
    if (refused.length) {
      console.error('REFUSING: no consistent gold for ' + refused.join(', ') + '. A case is never run without one.');
      return 2;
    }
    eligible = eligible.filter(c => wanted.includes(c));
  }

  console.log('gold gate: ' + eligible.length + ' runnable, ' + skipped.length + ' skipped');
  for (const s of skipped) console.log('  skip ' + s.case + ': ' + s.reasons.join('; '));

  // ---- build the input packs ----------------------------------------------
  const prompt = loadFrozenPrompt();
  /* The material section A refers to but does not contain. Packs are self-contained so a
   * run depends on the frozen text and not on how the operator worded the subagent brief. */
  const refs = loadReferenceBlocks();
  const labels = loadInputTemplateLabels();
  const packs = [];
  for (const caseId of eligible) {
    const gold = parseGold(path.join(GOLD_DIR, caseId + '.gold.md'));
    const caseFile = findCaseFile(caseId);
    if (!caseFile) { skipped.push({ case: caseId, status: 'skipped', reasons: ['case file not found on this machine'] }); continue; }
    const c = readCase(caseFile);
    const meta = deriveInputMeta(c);
    packs.push({ caseId, caseFile, gold, meta, blocks: c.blocks, pack: buildInputPack(c, meta, labels) });
  }

  const inTokens = packs.reduce((s, p) => s + estimateTokens(prompt.text + p.pack), 0);
  const estOut = packs.length * 9000;   // thinking plus one JSON review, order of magnitude
  const estCost = inTokens / 1e6 * cfg.price.inputPerM + estOut / 1e6 * cfg.price.outputPerM;

  console.log('');
  console.log('prompt      ' + cfg.promptVersion + '  sha256:' + prompt.hash + '  (' + estimateTokens(prompt.text) + ' tok)');
  console.log('model       ' + cfg.model + ', effort ' + cfg.effort + ', thinking ' + cfg.thinking + ', mode ' + cfg.mode);
  console.log('matcher     ' + MATCHER_VERSION);
  console.log('cases       ' + packs.length + ': ' + packs.map(p => p.caseId).join(' '));
  for (const p of packs) {
    console.log('  ' + p.caseId + '  ' + String(p.blocks).padStart(2) + ' blocks, ' +
      String(estimateTokens(p.pack)).padStart(6) + ' tok in, gold R' + p.gold.readinessIdx +
      ', ' + p.meta.artifactType + ' / ' + p.meta.stage + ' / ' + p.meta.maturity);
  }
  console.log('estimate    ~' + inTokens.toLocaleString() + ' input tokens, ~' + estOut.toLocaleString() +
    ' output tokens, about $' + estCost.toFixed(2) + ' at ' + cfg.model + ' list price');

  if (dryRun) {
    console.log('\ndry run, no API call made. Drop --dry-run to spend, or use --emit-packs to run with zero spend via a Claude Code subagent instead.');
    return 0;
  }

  if (argv.includes('--emit-packs')) {
    const outDir = path.join(OUT_ROOT, stamp() + '-subagent-packs');
    fs.mkdirSync(outDir, { recursive: true });
    for (const p of packs) {
      const combined = '<!-- SYSTEM PROMPT (frozen ' + cfg.promptVersion + ', sha256:' + prompt.hash +
        ') -->\n\n' + prompt.text +
        '\n\n---\n\n' + refs.text +
        '\n\n---\n\n<!-- USER INPUT for ' + p.caseId + ' -->\n\n' + p.pack;
      fs.writeFileSync(path.join(outDir, p.caseId + '.input.md'), combined);
    }
    const manifest = {
      executionMode: 'claude-code-subagent',
      note: 'No API call was made. Each *.input.md in this folder is SELF-CONTAINED: system ' +
        'prompt, then the reference material it refers to (noise budget, scope matrix, output ' +
        'contract), then the deliverable. Have a Claude Code subagent read one file, act as the ' +
        'reviewer exactly as the system prompt instructs, and write ONLY the JSON object to ' +
        '<caseId>.review.json in this same folder -- no prose before or after the JSON. The ' +
        'subagent must read NOTHING else from this project: no gold, no worksheet, no other ' +
        "case's review, no harness source. Then run: node run-reviews.js --collect \"" + outDir + '"',
      promptVersion: cfg.promptVersion, promptSha256: prompt.hash,
      referenceSha256: refs.hash,
      contextSha256: require('crypto').createHash('sha256').update(prompt.text + refs.text).digest('hex').slice(0, 16),
      matcherVersion: MATCHER_VERSION,
      cases: packs.map(p => ({ case: p.caseId, status: 'pending' })).concat(skipped),
    };
    fs.writeFileSync(path.join(outDir, 'run-manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('\nwrote ' + packs.length + ' input packs to ' + outDir + '. No API call made, nothing spent.');
    console.log('next: have a Claude Code subagent produce each <caseId>.review.json, then:');
    console.log('  node run-reviews.js --collect "' + outDir + '"');
    return 0;
  }

  // ---- the run (API path, needs ANTHROPIC_API_KEY, spends money) ----------
  let Anthropic;
  try { Anthropic = require('@anthropic-ai/sdk'); }
  catch (e) { console.error('missing dependency: run `npm install` in ' + V2); return 2; }
  const client = new Anthropic();

  const outDir = path.join(OUT_ROOT, stamp() + '-' + cfg.model + '-' + cfg.effort);
  fs.mkdirSync(outDir, { recursive: true });
  const started = new Date().toISOString();

  const rows = await pool(packs, cfg.concurrency, async (p) => {
    const t0 = Date.now();
    process.stdout.write('running ' + p.caseId + ' ...\n');
    try {
      const { message, text } = await callReviewer(client, prompt.text, p.pack, cfg);
      fs.writeFileSync(path.join(outDir, p.caseId + '.input.md'), p.pack);
      let review;
      try { review = JSON.parse(text); }
      catch (e) {
        fs.writeFileSync(path.join(outDir, p.caseId + '.raw.txt'), text);
        return { case: p.caseId, status: 'unparseable', error: e.message, seconds: (Date.now() - t0) / 1000 };
      }
      const reviewPath = path.join(outDir, p.caseId + '.review.json');
      fs.writeFileSync(reviewPath, JSON.stringify(review, null, 2));

      const contract = validateReview(reviewPath, p.caseFile);
      const score = scoreReview(review, p.gold, {
        reviewFile: p.caseId + '.review.json',
        model: cfg.model, effort: cfg.effort, promptVersion: cfg.promptVersion, promptHash: prompt.hash,
        contractValid: contract.valid,
      });
      fs.writeFileSync(path.join(outDir, p.caseId + '.score.json'), JSON.stringify(score, null, 2));

      const u = message.usage || {};
      console.log('  done ' + p.caseId + '  readiness ' + score.readiness.predicted +
        ' (gold ' + score.readiness.gold + '), must-catch ' + score.mustCatch.verdict +
        ', contract ' + (contract.valid ? 'valid' : 'INVALID'));
      return {
        case: p.caseId, status: 'ok', seconds: (Date.now() - t0) / 1000,
        contractValid: contract.valid, contractReport: contract.report,
        usage: { input: u.input_tokens, output: u.output_tokens, cacheRead: u.cache_read_input_tokens, cacheWrite: u.cache_creation_input_tokens },
        inputMeta: p.meta,
      };
    } catch (e) {
      console.log('  FAILED ' + p.caseId + ': ' + e.message);
      return { case: p.caseId, status: e.refusal ? 'refused' : 'error', error: e.message, seconds: (Date.now() - t0) / 1000 };
    }
  });

  const usage = rows.filter(r => r.usage).reduce((a, r) => ({
    input: a.input + (r.usage.input || 0), output: a.output + (r.usage.output || 0),
    cacheRead: a.cacheRead + (r.usage.cacheRead || 0), cacheWrite: a.cacheWrite + (r.usage.cacheWrite || 0),
  }), { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
  const cost = usage.input / 1e6 * cfg.price.inputPerM + usage.output / 1e6 * cfg.price.outputPerM;

  const manifest = {
    startedAt: started, finishedAt: new Date().toISOString(),
    model: cfg.model, effort: cfg.effort, thinking: cfg.thinking, mode: cfg.mode, maxTokens: cfg.maxTokens,
    promptVersion: cfg.promptVersion, promptSha256: prompt.hash,
    matcherVersion: MATCHER_VERSION,
    schemaDeviations: ['timeline omitted from the response schema: optional in the contract, not scored, and its tiles-length invariant fails on long decks'],
    inputPackNote: 'audience, requested feedback, constraints, unknowns, evidence notes, recommendations and plan are left blank on purpose, so the reviewer sees what the human labeler saw',
    usage, estimatedCostUsd: Number(cost.toFixed(2)),
    cases: rows.concat(skipped),
  };
  fs.writeFileSync(path.join(outDir, 'run-manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('\nwrote ' + outDir);
  console.log('usage: ' + usage.input.toLocaleString() + ' in, ' + usage.output.toLocaleString() +
    ' out, cache read ' + usage.cacheRead.toLocaleString() + ', about $' + cost.toFixed(2));
  console.log('next:  node scorecard.js "' + outDir + '"');
  return rows.some(r => r.status === 'error') ? 1 : 0;
}

module.exports = { REVIEW_SCHEMA, loadFrozenPrompt, deriveInputMeta, buildInputPack, readCase, CONFIG };

if (require.main === module) {
  main(process.argv.slice(2)).then(c => process.exit(c)).catch(e => { console.error(e); process.exit(1); });
}
