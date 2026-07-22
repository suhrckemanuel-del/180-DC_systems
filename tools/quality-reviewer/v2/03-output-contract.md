# 03. Output contract

Sprint 3 artifact. The JSON object is the single source of truth. The model returns one
object, a validator checks it, and every rendered view (dashboard, printable report,
project-lead summary) reads from it. The model never writes prose layout and never
rewrites the deliverable.

This contract is a superset of the v1 schema in [../SYSTEM-PROMPT.md](../SYSTEM-PROMPT.md).
Every v1 field is preserved or consciously superseded, so the future renderer change is
additive. Voice rules apply to every authored field: no Oxford commas, no em or en
dashes. Quotes from the deliverable keep their own punctuation.

The canonical worked example is [eval-cases/case-01.review.json](eval-cases/case-01.review.json),
a full review of [eval-cases/case-01-vague-recommendation.md](eval-cases/case-01-vague-recommendation.md).
Read it alongside this document.

---

## A. Schema (field by field)

```
{
  "meta": {
    "title": "string",
    "client": "string, anonymized label such as Client A",
    "artifactType": "kickoff problem frame | research plan | interview guide | synthesis memo | draft deck | final recommendation deck | implementation roadmap",
    "mode": "short | deep | lead",
    "slideCount": 0,
    "version": "Review v2"
  },

  "readiness": {
    "level": "Not ready for client review | Needs substantial revision | Needs targeted revision | Nearly ready with minor edits",
    "mainReason": "one sentence, the single reason readiness sits here",
    "highestRiskIssue": "one sentence naming the top risk with its location",
    "confidence": "Low | Medium | High",
    "whatCouldChangeIt": "what missing context or evidence would move the level"
  },

  "blockingIssues": [
    {
      "rule": 1,
      "label": "short name of the blocking rule that fired",
      "ceiling": "the readiness level this rule caps at",
      "evidence": [ { "slide": 0, "quote": "verbatim text" } ]
    }
  ],

  "scorecard": {
    "diagnosticMean": 0.0,
    "confidence": "Low | Medium | High",
    "effort": "string, for example 4-6 hrs",
    "dimensions": [
      { "name": "Client decision usefulness", "result": "pass | partial | fail | na", "checksPassed": 0, "checksTotal": 4, "note": "string" }
      // ... exactly the ten dimensions in rubric order, na for out-of-scope dimensions
    ]
  },

  "strengths": [
    { "point": "what the deliverable does well, stated plainly", "quote": "verbatim supporting text", "slide": 0 }
  ],

  "findings": [
    {
      "short": "2 to 4 words",
      "title": "the finding as a full sentence",
      "severity": "critical | major | minor",
      "severityLabel": "High impact | Moderate | Minor",
      "deliveryCritical": true,
      "issueType": "thinking | evidence | recommendation | implementation | communication",
      "owner": "team | project lead | board reviewer | client clarification",
      "principle": "the principle being violated",
      "diagnosis": "plain prose referencing slide numbers",
      "evidence": [ { "slide": 0, "quote": "verbatim text from the deliverable" } ],
      "why": "why the client or a partner loses something",
      "reflect": "the question the consultant answers before the fix unlocks",
      "fix": "the directional move and the principle, never finished slide text",
      "tags": [ "string", "string" ]
    }
  ],

  "comments": [
    { "location": "slide or section", "problem": "string", "why": "string", "fix": "string" }
  ],

  "questionsForLead": [ "string" ],

  "learningNote": {
    "lesson": "the one reusable consulting lesson",
    "weakHabit": "the habit this deliverable reveals",
    "exercise": "one concrete practice exercise",
    "principle": "the principle name"
  },

  "notAssessed": [ "string, each an explicit limit of this review" ],

  "timeline": {
    "sections": [ { "label": "string", "span": 0 } ],
    "tiles": [ { "slide": 1, "state": "pass | partial | critical" } ],
    "callouts": [ { "at": 0, "state": "partial | critical", "label": "string" } ],
    "connectors": [ { "from": 0, "to": 0, "label": "string" } ]
  }
}
```

## B. Field rules (the validator enforces these)

- **readiness.level** is derived from `blockingIssues`, never from `diagnosticMean`.
  If any blocking issue is present, readiness is at or below the lowest ceiling among
  them. The rules are in [01-rubric-v1.md](01-rubric-v1.md) section B.
- **blockingIssues** may be empty. If empty, readiness is R2 when any finding is
  major, R3 when only minor. Every blocking issue carries at least one verbatim quote.
- **scorecard.dimensions** has exactly ten entries in rubric order. Out-of-scope
  dimensions for the artifact type use `result: "na"` and are excluded from
  `diagnosticMean`. Score per in-scope dimension is `1 + 4 * checksPassed / checksTotal`.
  `diagnosticMean` is the mean of in-scope dimension scores to one decimal and is
  labelled diagnostic, not a verdict.
- **findings** honor the noise budget: at most 3 in short mode, at most 5 in deep mode.
  Every finding has at least one evidence quote or it is dropped (quote or abstain).
  `severityLabel` maps from `severity`: critical to High impact, major to Moderate,
  minor to Minor. `fix` is directional and never pasteable slide text (no ghostwriting).
  Findings are sorted by severity, delivery-critical first.
- **strengths** are optional but expected on any review above Not ready. Each is a
  genuine thing the deliverable does well, with a verbatim quote. They drive the
  strengths-first opening of the printable and the coaching view. Do not invent
  strengths, and do not use them to soften a blocking issue.
- **comments** are optional and lighter than findings. At most 8 in total across
  findings plus comments. No generic clarity or formatting comment unless it is tied to
  client usefulness.
- **questionsForLead** at most 5.
- **notAssessed** is required and non-empty. The review always states its limits.
- **timeline** is optional and carried unchanged from v1. Include it for deck-type
  artifacts so the per-slide strip renders. Omit it for a memo or an interview guide.
  When present, `tiles.length` equals `meta.slideCount`.

## C. The report generated from the JSON

The same object renders to the section-4 report. No new model call. Mapping:

| Report section | JSON source |
|---|---|
| 1. Readiness assessment | `readiness` |
| 2. Top 3 to 5 fixes | `findings` (delivery-critical first, with owner and issueType) |
| 3. Rubric scores | `scorecard.dimensions` (with the na dimensions shown as not applicable) |
| 4. Evidence-linked comments | `findings[].evidence` plus `comments` |
| 5. Questions for the project lead | `questionsForLead` |
| 6. Learning note for consultants | `learningNote` |
| 7. What this review did not assess | `notAssessed` |

All three views below are implemented in [index.html](index.html) as of 2026-07-22.

The **project-lead view** (lead mode) shows readiness, the delivery-critical findings,
the blocking issues and the questions for the lead. It hides the reflect-and-fix gate.
The **student view** shows the coaching-shaped findings with the typed-attempt gate
carried from v1 (the fix stays locked until the consultant answers the reflect
question). The **printable** shows readiness, a strengths-first opening, the findings
in coaching shape and the learning note, with the gated fixes hidden on paper so the
printable cannot become ghostwriting.

## D. Validator sketch (check-review-v2)

Built on 2026-07-02 as [check-review-v2.js](check-review-v2.js), standalone rather
than extending the renderer-coupled v1 `check-review.js`. Usage:
`node check-review-v2.js <review.json> [deliverable.md]`. It checks:

1. All required fields present and correctly typed.
2. `scorecard.dimensions` has exactly ten entries with valid `result` values.
3. Every finding and every blocking issue has a non-empty `evidence` array, and each
   quote is a verbatim substring of the supplied deliverable text. The comparison is
   whitespace-normalized: non-breaking spaces (U+00A0 from PDF extractions) become
   spaces and any run of whitespace, including the line wraps of pasted input, counts
   as a single space.
4. Finding count is within the mode budget, comments plus findings do not exceed 8.
5. `readiness.level` is consistent with `blockingIssues`: if a blocking issue exists,
   readiness is at or below its ceiling.
6. No em or en dash appears in any authored field (a plain lint over the string
   fields). Quotes are exempt.
7. `notAssessed` is non-empty.

On any failure the validator returns a clear error list and the renderer refuses to
draw, exactly as v1 does. A broken review never renders as a half-drawn screen.

Built 2026-07-22 as [index.html](index.html), a single self-contained file with no build
step. It ports checks 1, 2, 4, 5, 6 and 7 above plus the deliveryCritical invariants, and
returns the same errors as the CLI on the same input. Check 3's verbatim-quote comparison
cannot run in the browser because it needs the deliverable text, so that check stays
CLI-only. Where the validator and the system prompt disagree on deliveryCritical for a
no-blocker deck, the renderer follows the validator. See the decision log, 2026-07-22.

## E. Dry-run result (Sprint 3 exit check)

The worked example [eval-cases/case-01.review.json](eval-cases/case-01.review.json) was
produced by hand against [04-prompt-templates.md](04-prompt-templates.md) applied to
case 01. It satisfies the contract: ten dimensions scored (none na for a draft deck),
three findings within the deep-mode budget, every quote verbatim from the case text,
readiness R1 consistent with the two blocking issues, and a non-empty notAssessed. It
also matches the case-01 gold label on the readiness level and on all three top issues,
which is the Sprint 3 exit criterion. The automated substring check waits on the v2
validator, tracked in [09-roadmap.md](09-roadmap.md).
