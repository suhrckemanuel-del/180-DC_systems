# The Fable Build Prompt

Paste **Section 1** verbatim into a fresh Claude Code session in this repo (`c:\Users\User\Desktop\180dc-ai`). Section 2 is the state snapshot the prompt tells the session to read — keep both in this file so it stays one self-contained handoff. Written 2026-07-09.

---

## Section 1 — THE PROMPT (paste everything in this block)

> I want you to build **ten radically different design variants** of the 180 Degrees Consulting Delft-Rotterdam branch website as a way to demonstrate extreme web-design capability — and so our President can choose between real, live, clickable options instead of mockups. This is the flagship creative build of our AI lab: treat it as a portfolio piece. You have total creative freedom within the guardrails below.
>
> **First, load context (15 minutes, no skipping):** read `website/04-fable-build-prompt.md` Section 2 (state snapshot: working credentials, proven deploy method, CLI locations), then `website/00-research.md` (what the best branch sites do), `website/01-brainstorm.md` (sitemap and content plan — the MVP spine is your content), `website/02-build-stack.md` and `website/03-cli-toolchain.md` (tooling), and `docs/overview.md` (the branch's five principles — they bind marketing copy too).
>
> **Scope per variant:** a complete **homepage**, one representative **interior page** (For Clients *or* Our Work — pick whichever the direction shows off best), and a **/guide route** documenting how that variant was made, its design system (palette, type, spacing, motion rules), and how to extend it to the full site. Ten variants × three pages. The winning direction gets the full six-page build later — these are living design proposals, not throwaways.
>
> **Shared content, single source of truth:** before building anything, write `website/variants/content.md` — the real copy every variant must use identically (positioning line, service areas, engagement timeline, join pitch, team, CTAs), drawn from the brainstorm's MVP spine and the real branch page. Variants compete on design only; identical content is what makes the comparison honest.
>
> **The directions — five prescribed, five you invent.**
>
> First build these five (adapt names, keep the spread — each must be *unmistakably* different at first glance):
> 1. **Blueprint** — TU Delft engineering heritage: the visual language of technical drawings — faint drafting-grid background, thin dimension lines and measurement annotations, schematic hover states, precise annotation typography. The site as an engineer's drawing of itself.
> 2. **Port of Rotterdam** — industrial-modern: container geometry, bold cargo color blocks, manifest-style data tables, crane silhouettes.
> 3. **De Stijl** — Dutch modernist: Mondrian-inspired asymmetric grids, primary accents against 180-green, oversized geometric composition.
> 4. **The Terminal** — the AI-native branch: dark-first, monospace accents, the quality pipeline rendered as a live-feeling system diagram, subtle scan/cursor motion.
> 5. **Soft Impact** — warm and human for non-profit directors: photography-led, rounded geometry, gentle motion, generous air, pastel-shifted green.
>
> **Then stop and invent five more yourself.** This is the real test. Before designing them, write `website/variants/DIRECTIONS-6-10.md`: what you learned from building and critiquing the first five (what sang, what fell flat, what no direction has dared yet), then five *new* design theses — each one sentence of concept + one sentence of why it serves the mission (social impact, student energy, the Delft×Rotterdam engineering-meets-business identity). Rules for the invented five: no overlap with the first five or with each other; at least two must be riskier than anything in the first five; at least one must be something you have never seen a consulting site do; none may be a generic template style ("clean SaaS landing page" is a failure). Then build them with the same process. If one of your inventions beats all five of mine, the experiment worked.
>
> **Assets and tools you have working right now** (details + proven commands in Section 2): `gpt-image-2` via the OpenAI key for bespoke style-consistent imagery (budget: **≤ €15 total**, favor low/medium quality, reuse across passes); Pexels API for real photography; Google Fonts downloaded and self-hosted; hand-built SVG/CSS generative art (free — lean on it); Netlify API zip-deploys (method proven live). **Pinterest is NOT available** — its API approval is pending and may take weeks; do not block on it, do not retry it beyond one probe; taste-calibrate instead from awwwards/godly/land-book/siteinspire via web research, one mood note per direction written into its /guide.
>
> **Hard constraints, all ten variants:**
> - Static HTML/CSS/JS only (no build framework unless a variant truly needs it) — every page must also work with JS disabled.
> - Performance is part of the design: Lighthouse Performance and Accessibility ≥ 95 per page, first load ≤ 1 MB per page, images compressed (WebP/AVIF), fonts subset, `prefers-reduced-motion` respected everywhere motion exists.
> - Semantic HTML, keyboard-navigable, WCAG AA contrast — including on the wild directions; making Brutalist accessible is the flex.
> - Responsive from 320px to 4K; test both.
> - **Honesty rules (non-negotiable, from `docs/overview.md`):** no invented statistics, no fake testimonials, no fabricated client logos, no stock photos presented as our team. Where real content doesn't exist yet, design the *slot* and mark it visibly `[PLACEHOLDER — awaiting real content]`. Quote-or-abstain applies to marketing.
> - Confidentiality: no real client names anywhere; use the repo's pseudonym conventions if case content is needed.
>
> **Process per variant:** build → deploy to its own Netlify site named `180dc-v<N>-<slug>` (e.g. `180dc-v1-blueprint.netlify.app`) via the zip-deploy method in Section 2 → then **three critique-and-improve rounds**, each round driven by **the Critic**:
>
> The Critic is a separate fresh-context agent (spawn it as a subagent — same independent-verifier pattern as the branch's Reviewer V2: never let the builder grade its own work). Per round: install Playwright if not present, screenshot desktop + mobile of every page, hand the Critic the screenshots + live URL + that variant's one-line design thesis — nothing else, no build rationale to bias it. The Critic is a harsh, world-class art director; it must return a ranked list of 5–10 *specific* problems and opportunities across: visual hierarchy, typographic craft (scale rhythm, line length, widows), color discipline, spacing consistency, motion purpose, distinctiveness ("would I recognize this site with the logo removed?"), memorability of the hero, and mission fit (does this *feel* like students doing serious social-impact work?). Vague notes ("improve spacing") are invalid — every note names an element and a fix. Complexify where the design is flat or timid; simplify where it's noisy. The builder then implements the top notes, redeploys, and logs the Critic's notes + what changed in that variant's /guide. A round that changes nothing is a failed round. Run a Lighthouse/PageSpeed check each round and record scores in the /guide.
>
> **Priority order, explicit:** creative design excellence and mission soul come first; functionality can be stubbed (forms may be non-submitting `[PLACEHOLDER]` UI, backend nothing) — but the performance/accessibility bars below are part of design craft, not "functionality", and still bind.
>
> **When all ten are live:** build an eleventh Netlify site, `180dc-variants` — the gallery: a screenshot card per variant linking to its live URL, its Lighthouse scores, page weight, one-line design thesis, and a voting-friendly comparison table. Then write `website/variants/RECOMMENDATION.md`: your ranked top 3 with reasoning against the audiences in `01-brainstorm.md` (client / student / partner), and what you'd steal from the non-winners into the final build. Commit all variant source under `website/variants/` (compress images first; keep the repo delta sane), push, and only then report back with: the gallery URL, all eleven live URLs, the recommendation, and total spend.
>
> **Working agreement:** you are autonomous end-to-end — do not stop to ask questions until the gallery is live and the recommendation is written; make the call yourself and log it in the relevant /guide. The only hard stops: never commit secrets (`website/.env` stays gitignored), never exceed the €15 image budget, never violate the honesty rules, and if Netlify or OpenAI credentials fail, fix what you can and finish every variant that doesn't need the broken thing before reporting. Be ambitious: this should look like ten different world-class studios each pitched the same client. Go.

---

## Section 2 — STATE SNAPSHOT (what a fresh session needs to know)

### Credentials — all in `website/.env` (gitignored, never commit)
| Key | Status (verified 2026-07-09) |
|---|---|
| `OPENAI_API_KEY` | ✅ Valid. Has **gpt-image-2** access. Proven: one test generation done (~€0.01). Sizes 1024x1024/1536x1024/1024x1536, quality low/medium/high, response is b64_json |
| `NETLIFY_AUTH_TOKEN` | ✅ Valid (account suhrckemanuel@gmail.com). Proven live deploy done |
| `PEXELS_API_KEY` | ✅ Valid (tested: search works). Header: `Authorization: <key>` |
| `PINTEREST_ACCESS_TOKEN` / `PINTEREST_CLIENT_ID` | ⛔ Present but **blocked upstream**: Pinterest trial-access approval pending; API returns "consumer type not supported". Probe once, then ignore |
| `OPENART_API_KEY` | Empty — deliberately not purchased. CSS/JS motion only; no video assets this round |

### Proven Netlify deploy method (no CLI needed)
1. Create site: `POST https://api.netlify.com/api/v1/sites` with `Authorization: Bearer $NETLIFY_AUTH_TOKEN`, JSON body `{"name":"180dc-v1-blueprint"}` → returns `id` and `ssl_url`.
2. Zip the site folder (PowerShell `Compress-Archive` — note: bash-invoked PowerShell zips fail silently, use the PowerShell tool).
3. Deploy: `POST https://api.netlify.com/api/v1/sites/<id>/deploys` with header `Content-Type: application/zip`, `--data-binary @site.zip`.
4. Verify HTTP 200 on the ssl_url.

Existing Netlify sites (leave untouched): `180dc-delft-rotterdam.netlify.app` — hosts the Pinterest-app privacy policy at its root; do not overwrite.

### Image generation (proven call)
`POST https://api.openai.com/v1/images/generations` with the OpenAI bearer, JSON `{"model":"gpt-image-2","prompt":"...","size":"1536x1024","quality":"low","n":1}` → decode `data[0].b64_json`. A successful 180-green "blueprint grid dissolving into gradient wave" test lives in the session scratchpad precedent. Style consistency per variant: write one style suffix per direction and append it to every prompt for that variant.

### Local CLIs (from the Printing Press work)
- `pinterest-pp-cli` — built and installed (`~/go/bin/`), 16 interfaces incl. boards/pins/search/trends. Blocked on Pinterest approval; when the approval email arrives, `auth login --client-id --client-secret` (creds in `.env`) unlocks board sync.
- `printing-press` v4.3.0 + Go 1.26.3 installed — can press more CLIs (pagespeed is the queued candidate) but don't press new CLIs mid-build unless genuinely needed.
- Node/npm available — `npm i playwright` + `npx playwright install chromium` for screenshots (not yet installed; first build task).

### Content sources (real, usable today)
- Positioning and service areas: `website/01-brainstorm.md` §2 + the live branch page (180dc.org/branches/Delft-Rotterdam — 8 exec members with roles listed there).
- Branch principles for copy discipline: `docs/overview.md`.
- The quality-system story (for the "show the machine" sections): `CONTEXT.md` §3, `lab/ranking.md` top-7.
- What does NOT exist yet (design slots + `[PLACEHOLDER]`, never invent): case studies, client testimonials, impact numbers, alumni destinations, partner logos, team photos.

### Decisions already made (don't relitigate)
- Static-first stack; repo is the CMS; Netlify hosting (research: `01-brainstorm.md` §7).
- Pinterest parked; galleries are the reference source.
- No OpenArt/Higgsfield this round — CSS/SVG motion carries it.
- The President cuts scope, we don't: variants are proposals, gallery + recommendation is the deliverable.
- Open questions for the President (`01-brainstorm.md` §11) stay open — variants must not hard-commit to answers (e.g. keep the AI story present but toggleable in prominence: Terminal variant leads with it, others carry it as a page).

### Budget ledger (append as you spend)
- 2026-07-08: OpenAI test image ≈ €0.01. Total to date: ≈ €0.01 of €15.
