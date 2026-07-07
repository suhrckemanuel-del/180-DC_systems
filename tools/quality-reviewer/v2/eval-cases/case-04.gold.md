# Case 04. Gold label

Human-written before the AI reviewed the case. Voice rules apply.

- **Case:** [case-04-contradiction-no-implementation.md](case-04-contradiction-no-implementation.md)
- **Artifact type:** final recommendation deck.
- **Expected readiness:** Not ready for client review (R0).
- **Expected readiness reason:** the recommendation to hire three staff and take a lease
  directly contradicts the deck's own statement that Client D cannot take on fixed costs
  or hire until revenue grows.

## Real top issues (ranked)

1. **Internal contradiction the recommendation walks into (blocking, rule 1).** Slide 3
   states Client D "cannot take on new fixed costs without new income first" and that
   "hiring is not possible until revenue grows". Slide 6 recommends hiring three paid
   staff and taking a lease immediately. The recommendation breaks the deck's own
   constraint. Ceiling R0. Severity: high. Issue type: thinking.
2. **Overconfident financial claims (major, dimensions 4 and 8).** "Revenue will double
   in year one" (slide 7) and "The plan is low-risk" (slide 8) are stated as certainties
   with a single peer comparison behind them and no assumptions or risks named. Severity:
   high. Issue type: evidence.
3. **No feasible implementation path (major, dimension 7).** Given no reserves, the deck
   does not sequence how the fixed costs get funded before the revenue arrives. "Sign a
   lease. Recruit staff. Launch." ignores the cash constraint. Severity: medium. Issue
   type: implementation.

## Acceptable AI feedback

- Names the contradiction between slide 3 and slide 6 as the fatal issue and sets
  readiness to Not ready.
- Flags the certainty of the doubling claim and the low-risk assertion and asks for the
  assumptions and a downside.
- Asks how the fixed costs are funded before revenue grows, given no reserves.

## Unacceptable AI feedback

- Endorsing or rejecting the shopfront on its merits. The reviewer flags that the plan
  contradicts the stated constraint and is overconfident, it does not decide whether a
  shop is wise.
- Inventing a phased plan for the team (that is their thinking to do). It may point to
  the need for a self-funding sequence or a pilot, directionally.

## False positives to avoid

- Flagging the storyline. The SCR structure is actually decent here. The problem is the
  contradiction and the overconfidence, not the flow.
- Flagging slide-level titles as the top issue. They are acceptable.

## False negatives to catch

- Missing the contradiction. This is the defining issue and the reason for R0. A review
  that lands at Needs targeted revision has failed.
- Treating "revenue will double" as an acceptable supported claim.
