# Slide review — the five candidate case studies

Reviewer method applied to all 18 candidate slides, one pass per client, quote-or-abstain,
max three findings each. Run 2026-08-08 against the renders committed on
`wip/case-study-gallery-private-content` at `2fec5c7`.

**Headline: none of the five sets is publishable as-is.** Five independent passes reached
that conclusion separately. One set is a hard stop. The rest need targeted work plus
client sign-off.

No `PUBLIC-OK.md` record exists for any of the five clients. Per the workbench's own
decision rule that alone blocks publication, independently of everything below.

---

## Set verdicts

| Set | Readiness | What drives it |
|---|---|---|
| Saaras Foundation | **R1** | Names, rates and publishes a follower count for two non-client charities, and criticises the client |
| One Acre Fund | R2 | Rank column contradicts its own scores; ships a live spreadsheet link; discloses an unlaunched product |
| Stahili | R2 | Stakeholder matrix contradicts its own legend; unlabeled axes; donors ranked above beneficiaries |
| Barefoot College | R2 | Typos in the most-read cells; "three pillars" vs "four main pillars"; two pages fail on a phone |
| GoodHout | R2 | The "website presence" exhibit is a section divider with no finding on it |

## Per-slide disposition

| Slide | Keep? | Action |
|---|---|---|
| `oaf--05` problem statement | yes | Publish as-is. Cleanest single exhibit in the whole pool |
| `oaf--07` criteria | after fix | `Sources:` is blank. Fill it. Thin 11 bullets to the five headers |
| `oaf--21` matrix | **hold** | Rank contradicts score (18.9 and 18.7 both rank 7, no rank 10 in ten rows). Also `(link to spreadsheet)` and `Pumps (NEW PROD.)` |
| `oaf--31` action plan | after fix | Relabel the `In this Presentation` chip; it is meaningless on a web page |
| `bci--02` exec summary | yes | Strongest prose page. Re-set as web text rather than a page image |
| `bci--14` livelihood pillars | re-set | 430 words, no visual. Collapsed heading: `value chain.Why this pillar approach matters` |
| `bci--20` implementation | re-set | Typo `Identiying` in the first bullet of the first phase. Two-column table dies on a phone |
| `bci--29` conclusion | yes | Fine. Same re-set caveat |
| `stahili--07` funding | after fix | `Overall score` uses part-filled circles with no key anywhere. Add one, plus the missing `*` footnote |
| `stahili--18` stakeholders | **hold** | Legend numbers 8 stakeholders, quadrants contain 7. Axes unlabeled. See risk note below |
| `stahili--22` implementation | after fix | Copy: `until possible` is not parseable, `has hardship getting funding for` |
| `saaras--05` methodology | rebuild | Labelled methodology, but its dominant visual argues market size |
| `saaras--11` findings | **remove** | See blocker below. Not fixable by trimming |
| `saaras--29` 70-20-10 | rebuild | Best-designed page in the pool. Needs a correct third-party source credit, not `180DC research` |
| `saaras--44` conclusion | cut or revise | Carries no message. Strike `considering the current stature of their competitors` |
| `goodhout--09` timeline | after fix | A timeline with no time on it. Typo `KIP's` |
| `goodhout--19` website presence | **swap** | It is a table of contents, not a finding. Replace with the page carrying the actual result |
| `goodhout--35` recommendation | yes | Should lead the set. A real, specific, falsifiable recommendation |

---

## The blocker: `saaras--11`

The page names two organisations that were never clients, describes them, rates their
marketing, and then publishes this:

> "Both organisations post around twice a week. On average, they have 200 followers and
> 5 likes per post. The effectiveness can therefore be improved."

One of the two is a suicide-prevention charity. Publishing a competitive rating of a named
suicide-prevention charity's marketing performance, on our own promotional page, is a
reputational hazard for them and for us, and it is not something they ever agreed to.

The same page also criticises the client, in public, by name:

> "the mission and vision are not explicitly transmitted"
> "interaction with beneficiaries, donors and partners is low"

Correct as consulting work. Unpublishable as marketing.

There is a compounding effect if `saaras--44` ships alongside it: that page's phrase
"the current stature of their competitors" is anonymous alone, but next to `saaras--11`
it resolves to two named charities and to "200 followers and 5 likes per post".

## Two other items that need a decision, not an edit

**`oaf--21` carries a live hyperlink reading `(link to spreadsheet)`.** Nobody has
verified where it points. If it resolves to a working sheet with client data or an open
share setting, that is a confidentiality breach in the artifact and the set drops to R1.
Resolve or strip it before anything ships. The same slide names `Pumps (NEW PROD.)`,
an unlaunched client product, inside a scored comparison table.

**`stahili--18` places `Manage closely: Gov. Agencies, Donors` above
`Keep informed: Beneficiaries, Communities`.** Standard stakeholder practice, defensible
in a room. On a public page it is a charity shown ranking its donors above the people it
serves. That risk lands on the client, not on us, which makes it their call and not ours.

## The structural finding

Several of these are not slides. `saaras--05/11/44` and all four BCI pages are A4 report
pages of justified running body text, with page numbers and numbered section headings.
Rendered to a 390px phone their body text lands around 3 to 4px of x-height, roughly a
third of what is readable, and justified text forces horizontal scrolling once zoomed.

This is the same conclusion the workbench spec already reached independently, and the same
one reached before any of these renders were examined: **rebuild exhibits from approved
content, do not republish source pages.** Three separate routes to the same answer is
enough to treat it as settled.

## Where this leaves the gallery

The viewer mechanism itself is sound and worth keeping: a native `<dialog>`, keyboard
navigation, deep links per case. What it is currently wired to is the problem.

Note the branch contradicts itself here. `portfolio-workbench/v15-case-study-section.md`
says "Do not use client logos, real screenshots, client names or performance figures on
the card by default" and "We never publish a source deck or confidential client
information". The shipped `app.js` sets `client: "ONE ACRE FUND"` as the card heading and
opens the original pages. The spec is right and the implementation is not.

**Before any of this can go public, in order:**

1. Resolve the `oaf--21` spreadsheet link. Unknown exposure outranks everything else.
2. Drop `saaras--11` from the candidate pool entirely.
3. Decide whether client names appear at all. The spec says no by default; the
   implementation says yes. That decision changes every card.
4. Get a completed `PUBLIC-OK.md` per client, signed by a named lead, per the workbench's
   own decision rule.
5. Rebuild the surviving exhibits as web content rather than page images.

## Repository exposure, separate from publication

The 18 renders are committed to `wip/case-study-gallery-private-content`, and that
repository is **public on GitHub**. Real client names appear in the filenames and in the
slides. This is live now and is independent of whether the website ever ships them. It
needs a decision on its own timeline: rewriting that branch's history is the only way to
remove them, and any fork or clone taken meanwhile keeps a copy.

The renders used for this review are held at `website/variants/_case-candidates/`, which
is gitignored and sits outside `website/variants/v*/` so `build-dist.mjs` cannot sweep
them into a deploy.
