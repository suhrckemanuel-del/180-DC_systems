# 07. Workflow, adoption and privacy

Sprint 8 artifact. How real project teams use the reviewer safely without overload, who
is accountable, and what may and may not be uploaded. A tool that is not adopted, or that
leaks data, has failed regardless of how good its reviews are.

Voice rules apply.

---

## A. When in the project cycle to use it

The reviewer is useful at five points, matched to the artifact type it is told about.

| Point in cycle | Artifact | Mode | What the team gets |
|---|---|---|---|
| Early framing | kickoff problem frame, research plan | short | is the problem specific, is scope bounded, are assumptions marked |
| Mid-project synthesis | synthesis memo, interview guide | short or deep | does the evidence point somewhere, is the so-what forming |
| Draft-deck review | draft deck | deep | the full read before it goes to the project lead |
| Final pre-client review | final recommendation deck | deep, then lead | readiness and the delivery-critical issues before sign-off |
| Post-project learning | any | learning block | the reusable habit for the next cycle |

The tool does not judge an early artifact for lacking what it should not yet have. The
artifact-type scope matrix in [01-rubric-v1.md](01-rubric-v1.md) section C governs this.

## B. Who uses it and who is accountable

- **Consultants** run the reviewer on their own drafts, act on the fixes and do their own
  rewrites. The coaching gate means the fix unlocks only after they attempt the reflect
  question.
- **Project leads** run it in lead mode before client delivery, decide which AI feedback
  is valid, and sign off. The AI never signs off. A lead may overrule any finding, and
  that overrule is the accountable human decision.
- **Board reviewers** are the escalation path for a contested or high-stakes call, for
  example a readiness of Not ready that the team disputes.
- **The training team** uses the learning notes across projects to see which habits
  recur and shape the workshop.

The rule: the AI advises, a named human decides. Every review states what it did not
assess, so the human knows where their judgment is still required.

## C. Human sign-off gate

No deliverable goes to a client on the AI review alone. The gate before client delivery:

1. The team runs a deep review and acts on the delivery-critical findings.
2. The project lead runs lead mode, reads the readiness, the blocking issues and the
   questions for the lead, and forms their own view.
3. The lead signs off, or sends it back, or escalates. The sign-off is recorded (a line
   in the project log is enough).

A readiness of Not ready or Needs substantial revision is a strong signal, not a veto.
The lead can still choose to send with a documented reason. The point is that a human
made the call with the risks named.

## D. Adoption design (keep it useful, keep it light)

- **Under 10 to 15 minutes.** A short review is a two-minute paste and a two-minute read.
  A deep review is longer to act on but the read itself stays short because of the noise
  budget.
- **The noise budget is an adoption lever, not just a quality rule.** At most 3 fixes in
  short mode, 5 in deep, 8 evidence-linked comments, 5 lead questions. A team that gets 5
  sharp fixes acts on them. A team that gets 40 comments ignores all of them.
- **No extra admin.** The tool produces the review and the printable. It does not ask the
  team to fill trackers or log into a system. The input template is the only form.
- **No outsourced thinking.** The coaching gate and the no-ghostwriting rule mean the
  consultant does the rewrite. The fix is a direction, never pasteable slide text. If a
  team tries to get the AI to write the deck, it refuses.
- **Start where the pain is.** Introduce it at the draft-deck and final-review points
  first, where the value is most obvious, before pushing it earlier in the cycle.

## E. Data protection

The confidentiality posture is strict because a single leak can end a client
relationship and expose the branch.

**What must not be uploaded:**
- real client names or logos
- private client data, contracts or unpublished financials
- interview transcripts with names
- personal member information
- confidential board discussions

**Sanitization protocol (before any real review):**
- replace the client name with a label (Client A) and stakeholders with roles
  (Stakeholder B, the finance lead)
- remove logos, headers and footers that identify the client
- round or band figures that would identify the client, and mark them as banded
- if a slide cannot be sanitized without losing the point, review it by describing it,
  not by pasting it

**Where outputs live and who sees them:**
- the review JSON and the printable live in the project's own working folder, not a
  public channel
- the student coaching view is for the team, the lead view is for the project lead, the
  printable is for the lead and, if the lead chooses, the board
- nothing from a review goes to a public channel or another branch without VP permission
- reviews are kept for the project's duration and the learning cycle, then the sanitized
  version may be retained as a calibration example and the rest deleted

**During early testing:** synthetic and anonymized material only, per
[00-product-definition.md](00-product-definition.md) and the cases in
[eval-cases/](eval-cases/). No real client material touches the tool until the sign-off
gate and the sanitization protocol are in place and a lead has agreed them.
