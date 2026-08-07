# 22. The trust boundary

**This is a control document, not an analysis.** It says who is allowed to have this tool, what
has to be true before the next group gets it, and what stops it. Everything in it is either
enforced by code in `index.html` or assigned to a named human with a trigger and a deadline.

Written 2026-08-07, because an audit found that production had outrun measurement and the only
thing written down about it was a paragraph in STATUS.md. A paragraph is not a control.

Voice rules apply.

---

## 1. The evidence bar for rollout

Each row is an audience. The bar is a thing that is either measurably true or measurably false.
"When we feel confident" is not a bar and does not appear.

| audience | what they get | the bar | today |
|---|---|---|---|
| **A named pilot lead**, on their own team's deliverable | the lead view, their own triage, the note back to the team | **A1**: blocking rules missed 0% across 25 or more reviews. **A2 enforced in the deployed path**: nothing leaves the tab without a quote check that passed or a waiver recorded on the override record. Readiness never preselected, a written reason required to differ. The 07-workflow section C sign-off gate. | **MET** |
| **A whole project team**, students receiving packs and links | the student view, the kept set, the printable | everything above, plus: **no readiness level in the payload a student receives**, asserted rather than designed-in. The no-ghostwriting reveal gate. | **MET as of this build.** It was **not met before it**, see section 5. |
| **All branch leads**, the URL circulated internally | the same, unsupervised | everything above, plus: **10 or more override records from 3 or more distinct leads**, each carrying `lead.vsByHand`, with fewer than 2 leads reporting `slower`. A **named owner** who reads every record inside a week. | **NOT MET.** Zero records collected. No owner named. |
| **Another branch** | the same, outside this owner's reach | everything above, plus: **`mc-match-3` validated at AUC 0.85 or better and accuracy 92% or better** on the 178-pair set (today: 0.718 and 88%, against 85% for a constant that ignores the input). The nine real cases **re-run on the shipped prompt at N of 3 or more draws**, readiness exact-match reported with its spread rather than as a point. | **NOT MET, and not close.** Both are the next two builds. |
| **Anything client-facing** | nothing | not an evidence bar. A standing prohibition, unchanged since [07-workflow.md](07-workflow.md) section C. No deliverable reaches a client on this review alone, at any level of measured performance. | **PROHIBITED** |

Two things follow that are easy to miss.

**The bars are cumulative and the third one is now measurable because of this sprint.** Before
today nothing in the product recorded whether a lead found the loop cheaper than doing the work
by hand, so the bar for circulating the link could never have been evaluated. `lead.vsByHand`
and `lead.secondsOnTask` now make it a counting exercise.

**A better matcher does not unlock the second or third row.** Those rows turn on A1, A2 and
cost, none of which the matcher touches. `mc-match-3` gates external claims and other branches.
Saying so stops the whole rollout from queueing behind one build that is genuinely hard.

---

## 2. The stop conditions, made detectable

The four triggers in STATUS.md were things a human had to notice. Two are now enforced by the
product. One is sampled. One is asked by the product and escalated by a human.

| stop condition | how it is caught now | who acts, and when |
|---|---|---|
| **1. It missed a real blocking problem** (falsifies A1) | **Sampled, not detected.** A lead who adds a High impact item under "Add what it missed" is saying the reviewer missed something serious. That lands in the override record as `added[]` with `severity: critical`. It is not proof a blocking rule should have fired, and it is the only sampler that exists. | The reviewer owner reads every record carrying a critical `added` **within a week**, pulls that deck and decides whether a blocking rule should have fired. **Two confirmed cases falsify A1 and trip section 4.** |
| **2. A fabricated or altered quote reaches a student** (falsifies A2) | **Enforced.** The lead pastes the deck text; every quote in every finding, blocking issue and strength is checked as a verbatim substring, with the same normalisation `check-review-v2.js` uses. Release, the note, the student pack and the student link are all disabled until it passes. A lead who cannot supply the text can waive it, in writing, and the waiver is stamped on the note, the printable, the student banner and the record. | Nobody has to act for this to hold. A record arriving with `quoteCheck.status: "failed"` should not exist and means the gate was bypassed; a record with `"waived"` is legitimate and worth reading. |
| **3. A student sees a readiness level** | **Enforced twice, and the payload is redacted.** The outbound scan blocks release if any student-visible field names one of the four levels. The student pack now ships with `readiness` and `blockingIssues` removed, declared in `redactions`, and the contract validator checks the redaction was actually done. A `MutationObserver` on the student and print views replaces the whole view with a stop panel if a level string ever reaches the DOM by any route. | The stop panel tells the reader this is stop condition 3 and that the fix is to re-run the review, never to edit it. It names the owner's document rather than a person, so it does not rot. |
| **4. A lead finds it slower than doing it by hand** | **Asked by the product, escalated by a human.** One optional three-way control at the point of release, recorded as `lead.vsByHand` alongside `secondsOnTask`, which was already there. The counterfactual is the half only the lead has. | The reviewer owner reads it with every record. **Two `slower` answers from distinct leads inside the first ten records means stop expanding and re-scope.** That is a product decision, not a prompt bug, and treating it as a prompt bug is the failure mode to avoid. |

### What the quote check does not cover

- **A quote that is verbatim and misleading.** Verbatim is a floor, not a ceiling. Pulled out of
  context, a true quote can still support a false finding, and no mechanical check reaches that.
- **A deck that is not text.** A scanned PDF with no text layer cannot be checked. That is what
  the waiver is for, and why the waiver degrades loudly instead of failing shut. A control that
  bricks the tool on a common input gets routed around, and a routed-around control is worse
  than none.
- **The record's own honesty.** `quoteCheck.deckSha256` ties the verdict to the exact bytes
  checked, but the bytes are client-confidential and are deliberately not kept, in the tab or in
  `localStorage`. The record says a check happened against a hash, not what was in it.

---

## 3. The in-product warning, and its dose

The readiness level sat next to the lead's own picker labelled "Reviewer suggests". Given A4,
that is not strong enough. "Suggests" is what a competent system does. A4 says the same deck,
the same bytes, came back R0, R0 and R2, with blocking rules firing `1,4`, then `1,2`, then
none. That is not a suggestion.

**The failure mode runs in both directions**: a banner nobody reads, or so much hedging that the
tool looks broken and gets abandoned. The answer is not a middle setting. It is an asymmetry,
because the underlying evidence is asymmetric.

What changed:

- **The findings are stated flat, with no hedge.** A new two-cell strip under the tiles says so
  in the left cell: every finding carries a checkable quote, this review's quotes have been
  machine-checked, and across roughly thirty reviews the reviewer has not once missed a problem
  a human rated blocking. That is A1 and A2, said plainly, and it is the half of the tool a lead
  should lean on.
- **The AI grade is stated as unreliable**, in the right cell, in the tile, and on the picker
  chip, which now reads "AI guess" rather than "Reviewer suggests". The sentence a lead reads is
  that the same deck has come back at two different grades and it is not worth quoting.
- **Nothing else acquired a caveat.** The scorecard, the timeline and the blocking issues are
  unchanged. Uniform caution is what makes people stop reading warnings.

One row, two cells, no modal, no dismissible banner. If a lead reads exactly one thing on the
page they read which half to trust.

---

## 4. The kill switch

**Decision: a committed flag plus a redeploy. No remote check, now or later.**

`index.html` makes no network request of any kind, holds no analytics, no fonts and no CDN, and
that property is why a lead can put a real client deck into it. A remote kill would mean the
page phoning home on every open. It would trade a real, stated privacy guarantee for a partial
kill, and it would still miss the cases a committed flag misses.

The whole path is three commands and takes about a minute:

```
node kill-switch.js on "one line on why, shown to whoever opens it"
node build-site.js
npx wrangler pages deploy tools/quality-reviewer/v2/site --project-name=180dc-reviewer --branch=main
```

The page then renders a withdrawal notice and nothing else. No picker, no paste box, no view.
`node kill-switch.js off` and the same two commands reverse it. `build-site.js` prints the
switch state on every build, so deploying a killed build by accident and deploying a live one by
accident are both visible.

**Trip it when:** A1 is falsified (two confirmed missed blocking problems, per section 2), or A2
is falsified (one confirmed fabricated or altered quote that reached a student or a client). One
case is enough for A2 because a fabricated quote is unrecoverable in a way a miss is not.

**What it does not reach, stated plainly because a control with unstated limits is a lie:**

- a tab already open,
- a copy of the file saved to a laptop, which is a supported way to run this,
- a student pack or a student link already sent.

The only mitigation available without a network is that a build stamps its own date and any copy
more than 90 days old says so at the top of the page and points at the live URL. For the rest,
the recall path is telling people, and the withdrawal notice says not to use a saved copy.

**What a kill does not withdraw:** reviews already triaged and the notes written from them. A
named human made every call in those. That is the point of the sign-off gate and it survives the
tool being switched off.

---

## 5. Was the current rollout already past its bar?

**Yes, on one count, and it is back inside it as of this build.**

The tool has been live at a public URL since 2026-08-05, used by leads on real deliverables. The
first row of section 1 was met throughout: the findings had A1 and A2 behind them, readiness was
never preselected, and the sign-off gate held.

The second row was not. A2 is the claim that no fabricated quote has ever survived to a scored
result, and it is true, but it is a fact about `check-review-v2.js` running in the harness. The
deployed renderer never ran that check, because the browser does not have the deliverable, and
the product's own comment said so. So for two days a lead could load any review JSON and release
it to their team with no quote verified by anything. And every student pack carried the full
readiness block and every blocking-issue ceiling in its payload, so the level a student must
never see was one text editor away. Both are closed above.

**What should still be pulled back, and it is a process change rather than a code change:** the
link should not be circulated beyond named pilot leads until the third row's bar is met. It is
public and unlisted today, which is one paste away from being met by accident.
[LIVE-URL.md](LIVE-URL.md) now says who the link is for.

**One thing this sprint found that nobody was looking for.** A bundled review, `case-05-drift`,
carries a readiness level inside a finding's `fix` text, which is student-facing. It happens to
be caught today by the contract validator failing that review for unrelated reasons, so no
student could have reached it. The leak was real, the protection was luck, and it is exactly the
case the section 2 assertion now catches on its own terms.

---

## 6. What changed in the record

The override record moves to **`override-log-2`**. It adds two fields and removes none, so every
`override-log-1` consumer still reads it, and the renderer restores either version.

| field | why |
|---|---|
| `quoteCheck` | status, timestamp, quote count, missing count, deck sha256 and length, and the waiver reason. A triage that went out with unchecked quotes has to be findable afterwards. |
| `lead.vsByHand` | `faster`, `same`, `slower` or null. The counterfactual for `secondsOnTask`, which the tool has always had and could never interpret. |

Recorded in [17-override-log.md](17-override-log.md) section 2.
