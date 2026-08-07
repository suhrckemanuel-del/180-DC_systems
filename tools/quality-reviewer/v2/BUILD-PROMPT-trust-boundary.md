# Paste-ready build prompt: the trust boundary (finding E)

**Run on Opus.** This is judgment work with safety consequences on a live product, and it
changes what a real team is allowed to rely on. Do not run it on a fast model.

Paste everything below the line into a fresh chat. It is self-contained.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything lives under
`tools/quality-reviewer/v2/`. **Build and decide. Write no new strategy documents.**

## The finding this exists to close

An audit on 2026-08-05 named the biggest risk nobody had written down:

> The tool is already live and used by leads for real triage, running a prompt version its own
> docs call "unmeasured, and currently unmeasurable", scored by a matcher this week's sprint
> showed is barely better than a constant that ignores the input, sitting on a readiness signal
> already shown to flip between R0 and R2 on byte-identical input. Nobody has written an
> operational stop-rule for that stack.

Production has outrun measurement. That can be a deliberate, defensible choice. It is only
defensible with the boundary written down **and enforced**, and right now it is neither.

## What has already been done, so you do not redo it

`STATUS.md` now carries a **"When NOT to trust this tool"** section: what is safe to rely on
(findings, evidence quotes, the lead's own triage record), what is not (the readiness level as
a judgment, any recall or coverage number in external communication, anything at all on the
current prompt), and four stop-and-escalate triggers.

**That is a paragraph, not a control.** Your job is to turn it into something that holds when
nobody is reading STATUS.md.

## Read first, in this order

- `STATUS.md`, the "When NOT to trust this tool" section
- `18-evidence-base.md` sections A and C. A1, A2, A4 and A8 are the load-bearing ones
- `21-scorer-refit-sprint.md` section 5, why the scorer cannot currently support a claim
- `07-workflow.md` sections B and C, the existing human sign-off gate
- `index.html`, the live product. It is the source of truth; `site/` is generated

## Build these four things

### 1. The evidence bar for rollout, as a decision table

One table in `22-trust-boundary.md`: for each audience (a single pilot lead, a whole project
team, all branch leads, another branch, anything client-facing), what evidence must exist
before they get it. Tie each row to a specific measurable thing that either exists or does not,
not to a judgment call. "mc-match-3 validated at AUC above X on the 178-pair set" is a bar.
"When we feel confident" is not.

Be willing to conclude that the current rollout is **already past its bar**. If so, say what
should be pulled back and say it plainly.

### 2. The stop conditions, made detectable

The four triggers in STATUS are currently things a human would have to notice. At least two can
be instrumented, and one already nearly is:

- A fabricated or altered quote reaching a student. `check-review-v2.js` verifies quotes
  mechanically against source text, but **the live renderer never runs that check**, because the
  browser does not have the deliverable. Decide whether the lead view should require a
  quote-verified review before it will render, and if so build it: the lead has the deck.
- A student seeing a readiness level. The student view is built to make this impossible. Add an
  assertion that fails loudly rather than relying on it staying true.

For the two that cannot be instrumented (a missed blocking problem, a lead finding it slower
than doing it by hand), specify who asks, when, and what they do with the answer.

### 3. The in-product warning, and get its dose right

The product currently presents the AI readiness level to a lead beside its own picker, labelled
as a suggestion. Given A4, decide whether that labelling is strong enough, and change it if not.

The failure mode to avoid in both directions: a banner nobody reads, or so much hedging the
tool looks broken and gets abandoned. **The findings are trustworthy and should not be hedged.
The readiness level is not and must be.** Make that asymmetry legible in the interface rather
than uniform caution across everything.

### 4. The kill switch

If A1 or A2 is ever falsified, someone has to be able to stop the tool being used within the
hour. Today that means telling people to stop. Decide whether the hosted page needs a way to
disable itself, and build it if so. Constraints: no backend, no API key, self-contained, works
from `file://`. A committed flag plus a redeploy is an acceptable answer if you argue it.

## Hard constraints

- **Do not touch** `04-prompt-templates.md`, `01-rubric-v1.md`, `03-output-contract.md` or
  anything under `eval-runs/`. This sprint changes what people are allowed to rely on, not what
  the reviewer says.
- No real-case content in anything deployed. `build-site.js` enforces this; do not weaken it.
- Any change to `index.html` must keep the contract validator, the no-ghostwriting gate, the
  undecided-by-default triage and the student view's exclusion of readiness. Those are load
  bearing and each has a written reason.
- Redeploy and verify what is actually served, not what you uploaded.

## Definition of done

- `22-trust-boundary.md` with the rollout decision table, the detectability plan and the
  kill-switch decision. One page. It is a control document, not an essay.
- The instrumented stop conditions built and demonstrated failing when they should.
- Whatever in-product change you concluded was needed, live at the URL and verified.
- One paragraph in `STATUS.md` replacing the current "When NOT to trust this tool" prose with a
  pointer to the control, keeping the plain-language summary.
- An honest sentence on whether the current rollout was already past its bar.

## What would make this sprint a failure

Producing a longer, more careful description of the risk. The risk is already described. If at
the end nothing about the product or the process behaves differently, this did not work.
