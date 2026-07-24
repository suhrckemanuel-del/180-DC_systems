# Paste-ready prompt for the next chat (build phase)

---

Working in c:\Users\User\Desktop\180dc-ai, branch idea/reviewer-v2. Read
tools/quality-reviewer/v2/progress.md and 15-implementation-plan.md to orient, then
build. Do not write another design document.

**Where this stands.** The design phase is over-served. There are seventeen numbered
docs, a rubric, an output contract, a validator, five synthetic cases with live blind
runs, and fourteen anonymised real cases. What there is not is a working product. The
v2 output is raw JSON. There is no renderer, so nothing can be shown to anyone. I have
been over-idealizing and over-scoping this. Your job this session is to make it real and
produce results, not to expand the plan.

**Decisions already made, do not reopen them.** Two hand-labelers exist and possibly a
third. An ex-consultant is available for calibration. Confidentiality is cleared for
the current demo scope and clients permit anonymised reuse of past deliverables.
Sanitization escalates to the lead ahead of it when something is pre-sensitive. My
capacity is up to 20 focused hours in a good week, averaging about 10. The pilot is
next cycle. Both student mode and lead mode open now, with heavy emphasis on student
mode, so the board sees the whole thing and can react to it. This knowingly overrides
the effectiveness review's "not yet direct student-facing" verdict, and I accept that
risk for a board demo. Do not re-litigate it.

**Build priority, in order.**

1. **The v2 renderer.** This is the gap between a spec and a product. Build the view
   that turns a v2 review JSON into something a human reads: a student coaching view
   and a lead view, per 03-output-contract.md and the two-view design in
   07-workflow.md. v1 has a working index.html in ../ to learn from, and v2 has none.
   Readiness surfaces in lead mode. The coaching gate should actually gate, not just be
   specified. Make it run on the existing outputs in eval-runs/ so it is demoable the
   moment it exists.
2. **Close the audit gap.** The only independent scoring artifact,
   eval-runs/scoring-2026-07-03.md, scored the pre-fix case 05 and concludes NOT GREEN.
   The re-score that supposedly turned the set green was never written up, so the green
   claim currently rests on a prose line in progress.md. Re-score the post-fix set with
   a fresh-context scorer and commit the sheet.
3. **Measure run-to-run stability.** check-stability.js already exists and computes the
   variance. It needs the runs: three to five per case under a frozen prompt. This is
   the single most important pre-pilot number and it is currently an assumption.
4. **Support the human labeling track**, which runs in parallel and which you cannot do
   for us. Build tooling that makes labeling faster, never the labels themselves.

**Hard constraints, unchanged.** No AI-written or AI-suggested gold labels for real
cases, ever. No reviewer run on any real case before adjudicated gold exists. Never put
a real client name or identifier into any artifact. No Oxford commas, no em or en
dashes.

**Working style.** Be ambitious with subagents and parallel delegation. Clean up as you
go. Where a design doc contradicts what you are building, fix the doc in place with a
decision-log line rather than writing a new document about it. Bias to the smallest
thing that produces a real result over the most complete thing.

**Committing.** Only commit once there is an actual working improvement, something that
runs and is better than what came before. Not planning artifacts. Ask me before pushing.

Start by telling me what you are building first and why, in five lines, then build it.
