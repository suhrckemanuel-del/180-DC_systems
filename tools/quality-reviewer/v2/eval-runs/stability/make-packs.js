/* Build byte-identical blind input packs for the stability runs.
   Strips the case file's failure-mode header (title line plus the "Built to test"
   paragraph) so the runner cannot read what the case is designed to test. */
'use strict';
const fs = require('fs');
const path = require('path');

const CASES = path.join(__dirname, '..', '..', 'eval-cases');
const OUT = path.join(__dirname, "inputs");

const meta = {
  '01': { file: 'case-01-vague-recommendation.md', client: 'a regional food-redistribution non-profit, call it Client A', artifact: 'draft deck', q: 'Should Client A expand into a neighbouring region (Region B) or deepen operations in its current region.', stage: 'mid', maturity: 'working draft' },
  '02': { file: 'case-02-problem-framing-drift.md', client: 'a youth-education non-profit, call it Client B', artifact: 'draft deck', q: 'How can Client B increase individual donations to close a funding gap.', stage: 'mid', maturity: 'working draft' },
  '03': { file: 'case-03-weak-storyline.md', client: 'a community health clinic, call it Client C', artifact: 'draft deck', q: 'Which of three possible new services should Client C launch first with its limited capacity.', stage: 'mid', maturity: 'working draft' },
  '04': { file: 'case-04-contradiction-no-implementation.md', client: 'a social enterprise selling refurbished bicycles and training young people in repair skills, call it Client D', artifact: 'final recommendation deck', q: 'How can Client D become financially self-sustaining within two years.', stage: 'final', maturity: 'near final' },
  '05': { file: 'case-05-good-but-not-perfect.md', client: 'a community arts non-profit, call it Client E', artifact: 'final recommendation deck', q: 'Should Client E introduce a paid membership scheme to diversify income, and if so how.', stage: 'final', maturity: 'near final' }
};

for (const [id, m] of Object.entries(meta)) {
  const raw = fs.readFileSync(path.join(CASES, m.file), 'utf8');
  const lines = raw.split(/\r?\n/);
  // keep from the first slide block onward, dropping every header line before it
  const start = lines.findIndex(l => /^\*\*Slide 1\./.test(l));
  if (start < 0) throw new Error('no slide 1 in ' + m.file);
  const body = lines.slice(start).join('\n').trim();

  const pack = `MODE: deep
CLIENT TYPE (anonymized): ${m.client}
ARTIFACT TYPE: ${m.artifact}
CLIENT QUESTION: ${m.q}
INTENDED AUDIENCE:
PROJECT STAGE: ${m.stage}
DRAFT MATURITY: ${m.maturity}
SPECIFIC FEEDBACK REQUESTED:
KNOWN CONSTRAINTS:
WHAT THE TEAM IS UNSURE ABOUT:
EVIDENCE AND SOURCE NOTES:
RECOMMENDATIONS (if any):
IMPLEMENTATION PLAN (if any):

DELIVERABLE TEXT (one block per slide or section, with numbers):

${body}
`;
  fs.writeFileSync(path.join(OUT, 'case-' + id + '-input.md'), pack);
  console.log('wrote case-' + id + '-input.md  (' + pack.length + ' chars)');
}
