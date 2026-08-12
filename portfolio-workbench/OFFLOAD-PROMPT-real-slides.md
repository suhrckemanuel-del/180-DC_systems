# Offload prompt — replace the case exhibits with real deliverable slides

Paste everything below the line into a fresh session. It is written to be
self-contained: assume the reader knows nothing about this repo.

Keep this file updated when the state changes, or the next paste will be wrong.

---

## Task

The client page of the V15 website shows five case-study exhibits. They are
**hand-rebuilt HTML** — real reasoning from real engagements, re-set for the web.
Nothing on the site is AI-generated; do not go looking for AI content to remove.

The owner wants those replaced with **the actual deliverable slides**, and wants
the pool widened first: go through every deliverable the branch has, judge them
properly, and pick the best **3 to 5 slides** that carry real value and contain
nothing sensitive.

You are working in `c:\Users\Manuel\180-DC_systems`, branch `idea/reviewer-v2`.

## Step 0, and it blocks everything

**The source decks are not in this checkout.** Confirm before planning anything:

```bash
ls portfolio-workbench/private portfolio-workbench/qa portfolio-workbench/candidates
```

All three are gitignored and absent here. What you do have:

| Where | What | Note |
|---|---|---|
| `website/variants/_case-candidates/` | 18 slide renders as WebP, 5 clients, plus thumbs | Gitignored. Already reviewed, see below |
| `tools/quality-reviewer/v2/eval-cases-real/real-*.md` | 8 pseudonymised deliverables, text only | Gitignored. Real client text. No images |
| `origin/wip/case-study-gallery-private-content` @ `2fec5c7` | the same 18 renders as PNG | The branch this all came from |

If the task needs slides beyond the 18, **ask the owner for the deck archive
first**. Do not guess, and do not treat the 8 pseudonymised text files as a
substitute: they carry no slides and they are not cleared for publication.

To render new slides once you have decks: `tools/deck-transform/pptx_review.py`
exports each slide to a 1920×1080 PNG through PowerPoint COM and pulls structured
text with python-pptx. It is the tool that produced the existing 18.

## What has already been decided, so you do not redo it

A full reviewer pass ran on all 18 slides on 2026-08-08. Read
`portfolio-workbench/SLIDE-REVIEW-2026-08-08.md` before forming any opinion. The
short version:

**Three slides are hard blockers. Do not publish, do not put in front of a
client for approval, do not "fix".**

- `saaras--11` — names two organisations that were never clients, one a
  suicide-prevention charity, rates their marketing and publishes "200 followers
  and 5 likes per post". Also criticises the client by name.
- `oaf--21` — carries a live `(link to spreadsheet)` hyperlink nobody has
  resolved, and names `Pumps (NEW PROD.)`, an unlaunched client product. Its rank
  column also contradicts its own scores.
- `stahili--18` — publicly ranks a charity's donors above its beneficiaries.
  That risk lands on the client, not on the branch.

**Ten are cleared or need a small fix.** `oaf--05` and `goodhout--35` are the
two strongest single pages in the pool. Full per-slide disposition is in the
review file.

## The gates, in order. None is optional.

1. **Consent.** No `PUBLIC-OK.md` record exists for any of the five clients.
   `portfolio-workbench/README.md` makes a completed record, signed by a named
   lead, a hard requirement before any public copy or exhibit is used. The email
   that unblocks it is written and ready at
   `portfolio-workbench/consent-request-email.md`.
2. **Client identity is in the image.** Anonymising the card does nothing: the
   BCI executive summary names "Barefoot College International" and the region in
   the slide itself, and `oaf--05` names One Acre Fund. Real slides mean named
   clients. There is no anonymous version of this option.
3. **The branch's own spec disagrees with real slides.**
   `portfolio-workbench/v15-case-study-section.md` says "Do not use client logos,
   real screenshots, client names or performance figures" and "We never publish a
   source deck". The shipped `app.js` on the wip branch does all four. The spec
   was written first and is the more careful document. If the owner overrules it,
   fine, it is their call, but say so out loud rather than quietly shipping
   against it.

## Selection criteria for a slide

A slide earns a place only if all of these hold.

- **It carries a claim, not a label.** Every deck in the pool heads pages with
  "Executive Summary" or "Conclusion" and buries the point in the body. A slide
  whose title states the so-what is worth ten that do not.
- **It stands alone.** A portfolio exhibit has no presenter. If it needs the
  previous slide to make sense, it is not an exhibit.
- **It survives a phone.** An A4 report page lands around 3px x-height at 390px
  and no viewer trick fixes it. Several pages in the pool fail on this alone.
- **No third party is named or rated.** Competitor analyses and stakeholder
  matrices are where this goes wrong.
- **No criticism of the client** that would embarrass them on the consultancy's
  own marketing page.
- **No individuals, contact details, live links, unlaunched products, or figures
  precise enough to be commercially sensitive.**

Rank and annotate. Do not draw the cutoff yourself; the owner does that.

## Where the code is

- `website/variants/v15-vantage/for-clients.html` — the `#work` section: five
  `.case-card`s and, in `[data-case-details]`, five `.case-detail` articles.
- `website/variants/v15-vantage/case-gallery.js` — the dialog. Detail nodes are
  **moved** into it and moved back, never cloned, because cloning duplicates
  every id and breaks the anchors and `aria-labelledby`. A comment node marks the
  original position.
- `website/variants/v15-vantage/styles.css` — `.slide-panel` is a rebuilt
  exhibit, `.slide-figure` is an original page. Both already exist and are styled.
- `website/variants/v15-vantage/index.html` — homepage teaser lists the five case
  titles and links to `for-clients.html#work`. **If you change the case list,
  change it here too.** There used to be two competing work sections and it took
  a while to notice.

## Traps that have already cost time

1. **`build-dist.mjs` copies `website/variants/v*/` wholesale.** Put client
   renders anywhere under `v15-vantage/` and the next routine deploy publishes
   them. They live in `_case-candidates/`, outside that glob and gitignored, for
   exactly this reason. If you copy them in to build something, copy them back
   out and clear `dist/` afterwards.
2. **Production versus preview.** `tools/deploy-cf.ps1` deploys to production.
   For anything not consent-cleared, deploy to a preview branch instead:
   `npx wrangler pages deploy ..\dist --project-name 180dc-variants --branch board-review --commit-dirty=true`.
   Preview URLs are immutable, so a board link keeps working. The existing
   comparison is at `board-review.180dc-variants.pages.dev`. Note `$PSScriptRoot`
   is empty in an inline PowerShell command, so read `website/.env` by absolute
   path when you set the Cloudflare token yourself.
3. **Cloudflare Pages returns HTTP 200 for missing assets**, serving an HTML
   fallback. Verify by `content_type` and size with a cache-buster, never by
   status code. Production once silently reverted to a months-old build and every
   asset still answered 200.
4. **`audit-v15-r3.mjs` asserts a placeholder count per page.** Removing or
   adding a placeholder fails the suite until you update `expectPlaceholders`.
   That is deliberate.
5. **`sharp.stats()` ignores `.extract()`.** It returns whole-image statistics
   for any region you ask for. Any pixel measurement must read raw bytes.
6. **A `mailto:` does nothing** for anyone without a desktop mail client. Do not
   use one as the only route to anything.

## Running it

```bash
cd website/variants/v15-vantage && node -e "…"   # static server on 8099, see V15-HANDOFF.md §7
cd website/variants/tools
node audit-v15.mjs          # wiring, no-JS, overflow at 320px, page weight
node audit-v15-r2.mjs       # smoothness, a11y, contrast, focus, targets
node audit-v15-r3.mjs       # parity, terminology, photo credits, placeholder counts
node _links.mjs             # every link and button resolves. Note: it skips mailto:
```

Run them one at a time, they share ports. All three must pass before deploying.

## Done means

- Every published slide passes all six selection criteria, with the reasoning
  written down per slide.
- A `PUBLIC-OK.md` exists per client, or nothing named is on production.
- The homepage teaser and the client page agree on the case list.
- Three suites and `_links.mjs` green.
- Verified live by `content_type`, not status code.
- Anything not consent-cleared is on a preview URL, and production is confirmed
  clean of it by fetching one of the renders and checking it returns the HTML
  fallback rather than an image.
