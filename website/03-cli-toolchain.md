# CLI Toolchain: Amplifying the Website Build with the Printing Press

[Printing Press](https://github.com/mvanhorn/cli-printing-press) (installed locally, v4.3.0) generates agent-native CLIs from any API spec — and its [public library](https://github.com/mvanhorn/printing-press-library) already holds 324 published CLIs. This changes the [02-build-stack.md](02-build-stack.md) access list: several things we planned to do by hand or skip now have ready-made or pressable tooling. Surveyed 2026-07-08.

## Why CLIs amplify this specifically

Every asset step becomes scriptable and repeatable instead of click-work: pull the mood board, generate the imagery, bulk-fetch photos, deploy the variant, score its speed — each one command, each loggable, each runnable by next year's team (or their chatbot) from a documented script. The website stops being artisanal and becomes a pipeline, which is the same move the branch makes everywhere else.

## Ready-made in the library (install, don't build)

| CLI | What it does for us | Needs |
|---|---|---|
| **openart** | Generate **images and video** from the terminal across Seedance, Kling and other models, using OpenArt credits — one account covers both the bespoke imagery (planned via OpenAI) *and* the hero motion loops (planned via Higgsfield). Strongest single simplification of the access list. | OpenArt account + credits |
| **pexels** | Free professional stock photos/videos with bulk download, dedup, quota forecasting — placeholder photography for every variant until the real branch photo session happens. | Free API key |
| **here-now** | *"Publish a folder to a live URL in one command"* — instant throwaway previews of design variants before we even wire Netlify/Vercel. | To verify |
| **vercel-admin** | Full deploy/domains/env admin if we choose Vercel over Netlify (Netlify's official CLI is fine too — decision rides on the hosting choice, both free). | Vercel token |
| **figma** | Frame extracts, design tokens, comments audit — only if marketing designs in Figma. | Figma token |
| **cloudflare** + **cf-domain** | Domain search/registration and Pages hosting as a third hosting option; DNS management once the domain exists. | CF account |
| **google-analytics**, **google-search-console**, **clarity** | The post-launch measurement suite, all agent-queryable. | Post-launch |
| **instagram** | Branch account metrics when marketing wants launch numbers. | Later |

Install path: `printing-press` can pull published CLIs into the local library (or `/printing-press-import <name>`), then `go install`. Go 1.26.3 is already on this machine.

## Not in the library — press them (this is the creative part)

| CLI to generate | From | Why it earns its place |
|---|---|---|
| **pinterest-pp-cli** | Pinterest's [official OpenAPI spec](https://github.com/pinterest/api-description) (v5.23.0) | The mood-board workflow, solved: Manuel curates a Pinterest board of sites/styles he likes → one command pulls every pin, image and note into a local folder/SQLite store → design-direction briefs are grounded in the branch's actual taste. Generation already kicked off locally. |
| **pagespeed-pp-cli** | Google PageSpeed Insights API (free, public spec) | Makes "polished AND fast" a *measured gate*: every iteration pass on every variant ends with a Lighthouse score logged to the repo. Speed stops being a vibe — same eval-harness instinct as the reviewer. |
| **google-fonts-pp-cli** *(optional, tiny)* | Google Webfonts Developer API | Search/pair/download fonts for self-hosting (faster + GDPR-cleaner than CDN loading). A script also suffices; press it only if font iteration gets heavy. |
| **openai-images asset pipeline** *(only if OpenArt disappoints)* | OpenAI's official OpenAPI spec | Same idea as openart but on GPT Image; the press version would add the asset ledger (prompt → file → variant → where used) in SQLite, which is what keeps 5 variants' imagery organized. |

## Completes the loop (not printing-press, still needed)

- **Playwright (local npm install):** screenshots of every variant at every iteration pass — my eyes on the design. Without this, visual iteration is blind; with it, the three-pass comb works on rendered pixels, not source code. No account, no token.
- **netlify-cli (official):** if the hosting decision lands on Netlify rather than Vercel/Cloudflare Pages.

## The pipeline, assembled

```
pinterest-pp-cli pull board ──► mood corpus ──► design briefs
openart / pexels ──► asset library (ledgered)
build variant ──► here-now / netlify deploy ──► live URL
        │
Playwright screenshots + pagespeed score ──► iteration pass (×3)
        │
President picks ──► full build ──► GA/GSC/Clarity post-launch
```

## Revised access list (simpler than 02's)

1. **OpenArt account + credits** — replaces both the OpenAI-images *and* Higgsfield line items (Kling-class video included). Higgsfield only if OpenArt's motion output disappoints on the hero test.
2. **Pexels API key** — free, 2 minutes.
3. **Pinterest developer app** — developers.pinterest.com → create app → token with `boards:read`, `pins:read` (reads your own boards, which is exactly the mood-board use). Then curate one board.
4. **Netlify or Vercel token** — hosting choice pending; both free tiers.
5. Everything else from [02-build-stack.md](02-build-stack.md#6-get-from-humans-not-vendors) unchanged: brand assets from Global, photo session, domain-after-brand-answer.

Secrets go in `website/.env` (gitignored), as before.

## Status

- `pinterest-pp-cli`: **pressed, built and installed** (2026-07-08, generated from Pinterest's official v5 spec). 16 API interfaces including `boards`, `pins`, `media`, `pinterest-search` and `trends`, with local SQLite sync, full-text search and `--agent` mode. Lives in `~/printing-press/library/pinterest-pp-cli`, binary on PATH. Remaining to use it: Manuel registers an OAuth app at developers.pinterest.com (`pinterest-pp-cli auth setup` prints the exact steps), then `auth login`, then curate a mood board.
- Library installs (openart, pexels, here-now): next, in dependency order — here-now first (needs no account), then pexels, then openart when credits exist.
- pagespeed press: after the first variant exists to score.
