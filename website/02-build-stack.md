# Build Stack: Tools, Access, and the High-Polish Workflow

How we'll actually produce a branch site that is visually exceptional *and* fast — adapting the "25 websites with Fable" workflow (Pinterest references → AI image generation → animation assets → build → Netlify → three iteration passes → /guide route) to one branch site done at that level. This file is the shopping list Manuel asked for: what access to get, why, what it costs, and what happens without it.

## The adapted workflow

We don't need 25 sites; we need **3–5 radically different design directions of one site**, each polished through **three iteration passes**, deployed as **live Netlify previews**, so the President chooses between real, clickable options instead of mockups. The winning direction gets the full content build. Every variant documents itself at a `/guide` route (how it was made, how to maintain it) — consistent with the repo's guide culture.

```
mood/reference research  →  design direction briefs (3–5)
        │
asset generation (AI imagery, palettes, type pairings)
        │
build variant  →  iteration pass ×3 (fine-toothed comb:
        │          spacing, motion, contrast, mobile, speed)
        │
deploy preview on Netlify  →  President + exec pick
        │
full content build on winner  →  soft-launch tests  →  launch
```

Iteration-pass definition (from the source prompt, kept verbatim in spirit): after a variant "works," walk it again looking for design problems, opportunities to *complexify* the design where it's flat, and simplify where it's noisy. Three passes minimum before anyone says "ok."

## Access list — in priority order

### 1. Netlify — hosting + preview URLs. **Essential. Free.**
- **What:** create a free Netlify account (any email; a branch email is better than a personal one for turnover), then generate a **Personal Access Token** (User settings → Applications → New access token).
- **Why:** every design variant gets a live URL to share with exec; deploys run from my CLI in seconds; Netlify Forms can even power the client-intake form with zero backend.
- **Cost:** €0 (free tier: 100 GB bandwidth/month — far beyond our needs).
- **Without it:** I can publish preview pages as claude.ai Artifacts and build everything locally in the repo — works for review, but no real URLs, no forms, no custom domain.

### 2. OpenAI API key — image generation ("the ChatGPT one"). **High value. ~€10–20 budget.**
- **What:** an API key from **platform.openai.com** (this is separate from a ChatGPT subscription — it's pay-as-you-go billing; add a payment method, set a €20 hard cap in the billing limits). The image model is **GPT Image** (`gpt-image-1`).
- **Why:** bespoke visual assets no stock library has — consistent illustration style across the site, abstract hero imagery in our palette (engineering-grid × Rotterdam-skyline motifs), section art, OG/social cards. Consistency of style across every image is what makes a site look designed rather than assembled.
- **Cost:** roughly €0.02–0.17 per image depending on quality; a full site's asset set across 5 variants ≈ €10–20.
- **Without it:** CSS/SVG-generated visuals (gradients, patterns, generative shapes — genuinely good for a technical-brand look) + real branch photos. Viable, but less range.
- **Note:** real photography of real teams still beats AI imagery for the Team and Join pages — research pattern from every strong exemplar. AI images are for *brand texture*, never for pretending people exist.

### 3. Higgsfield — motion/animation assets. **Optional wow-layer. Paid sub.**
- **What:** a Higgsfield account (higgsfield.ai), Pro tier or whatever tier includes API/MCP access; then we add their **MCP server** to this environment (`claude mcp` in an interactive session) so I can drive it directly.
- **Why:** animated hero moments — a subtle looping motion piece on the homepage, animated transitions in case-study storytelling. This is the layer that made the YouTuber's sites feel "otherworldly."
- **Cost:** subscription tiers move around; expect ~€10–50/month. Get one month, generate the asset library, cancel.
- **Without it:** CSS/JS animation (scroll-triggered reveals, spring micro-interactions, animated SVG) — which we should do *anyway*, because it's free, crisp at any resolution, and costs ~0 KB of bandwidth. Honest recommendation: **CSS/JS motion is the foundation; Higgsfield is seasoning.** A fast site with tasteful native motion beats a heavy one with video wallpaper — and "polished AND fast" is the stated goal. If we use video loops: compressed, muted, `prefers-reduced-motion` respected, lazy-loaded.

### 4. Pinterest — reference/mood boards. **Optional. Free. Human-in-the-loop anyway.**
- **What:** Pinterest's API is approval-gated and awkward for this; don't bother with tokens. Two workable modes: (a) you (or marketing team) curate a board of sites/styles you love and send me the exported images or public board link; (b) skip Pinterest — I research references directly from the public web-design galleries that are better for this anyway: **awwwards.com, godly.website, land-book.com, dribbble, siteinspire**, which I can already read with my web tools.
- **Why:** taste calibration before building — the design-direction briefs should be grounded in "the branch likes things that look like *this*," not my defaults.
- **Recommendation:** one shared mood board (Pinterest or just a folder of screenshots dropped in `website/moodboard/` — gitignored if licensing is murky) beats any API integration.

### 5. Already have / free — no action needed
- **Fonts:** Google Fonts (free, self-hostable for speed + GDPR). If the brand wants a distinctive licensed face later, that's a €50–200 one-off decision after direction is chosen.
- **Icons:** Lucide/Heroicons (free, MIT).
- **Build tooling:** Node/npm are on this machine; static-site tooling installs freely. GitHub repo → Netlify auto-deploy once the token exists.
- **Analytics:** GoatCounter (free) or Plausible (~€9/mo) — decide at launch, not now.

### 6. Get from humans, not vendors
- **180DC brand assets:** official logo files (SVG), brand guide PDF, and the answer to the standalone-site question — request via the President to 180DC Global.
- **Photos:** one photo session (exec headshots + 20 candid working shots). The single highest-leverage visual asset on the list.
- **Domain:** ~€15/yr, buy *after* the Global brand-rules answer (see [01-brainstorm.md §11](01-brainstorm.md#11-open-questions-for-the-president)).

## How to hand me secrets safely

Never paste tokens into chat or commit them. Put them in a local file the repo ignores:

```
website/.env          ← gitignored (I'll add the rule before first use)
NETLIFY_AUTH_TOKEN=...
OPENAI_API_KEY=...
```

Tell me they're there and I'll wire them into the build scripts via environment variables. Rotate/revoke both when the site ships.

## What I'll do the moment access lands

1. **Netlify token:** deploy a hello-world to lock in the pipeline, then variant previews as they're built.
2. **OpenAI key:** generate the style-consistency test — same subject, 5 style treatments — so we pick the site's visual language deliberately.
3. **Higgsfield (if chosen):** one hero-motion experiment on the leading variant, measured against a CSS-only version for weight and feel.
4. **No access yet:** I can start regardless — design-direction briefs from gallery research, the CSS/SVG variant builds, and Artifact previews need nothing from this list.

## Budget summary

| Item | One-off | Recurring |
|---|---|---|
| Netlify | — | €0 |
| OpenAI images | €10–20 | — |
| Higgsfield (1 month, optional) | ~€10–50 | cancel after |
| Domain (later) | — | ~€15/yr |
| Fonts/icons/build | €0 | €0 |
| **Total to get moving** | **≈ €10–70** | **≈ €0–15/yr** |
