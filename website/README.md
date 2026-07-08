# Branch Website Workstream

Building the 180DC Delft-Rotterdam site: researched against the best branches and student consulting clubs, brainstormed wide for the President to cut, and set up for a high-polish multi-variant build.

| File | What it is |
|---|---|
| [00-research.md](00-research.md) | Field notes on the strongest 180DC branch sites (UCLA, Berkeley, Leuven), elite clubs (Berkeley Consulting, Academy Consult), the Dutch incumbent (uniPartners), our own current page — and the six patterns they reduce to |
| [01-brainstorm.md](01-brainstorm.md) | The full inventory: three audiences, complete sitemap (MVP/V2/LATER tiers), content-asset production plan, features and anti-features, the "show the machine" differentiator, design + stack recommendation, operations, GDPR, launch plan, open questions for the President |
| [02-build-stack.md](02-build-stack.md) | The build workflow (3–5 design variants × three iteration passes × Netlify previews, each with a /guide route) and the access shopping list: Netlify token, OpenAI image key, Higgsfield (optional), mood-board flow, safe secret handling, budget (~€10–70 total) |
| [03-cli-toolchain.md](03-cli-toolchain.md) | Printing Press amplification: ready-made CLIs from the 324-CLI public library (openart, pexels, here-now, vercel-admin, analytics suite), CLIs we press ourselves (pinterest from the official spec, pagespeed as the speed gate), the assembled pipeline, and the *simplified* access list that supersedes 02's |
| [04-fable-build-prompt.md](04-fable-build-prompt.md) | **The handoff:** the paste-ready autonomous build prompt (ten radically different design variants × three iteration passes × live Netlify previews + gallery + recommendation) and the state snapshot a fresh session needs (verified credentials, proven deploy/generation methods, honesty rules, Pinterest parked) |

## State

Research, planning and tooling done; **build-ready** (2026-07-09). Working credentials in the local `.env`: OpenAI (gpt-image-2 proven), Netlify (live deploy proven — privacy page at 180dc-delft-rotterdam.netlify.app), Pexels (tested). Pinterest parked pending Pinterest's own approval. Next action: paste [04-fable-build-prompt.md](04-fable-build-prompt.md) Section 1 into a fresh session and let it run. President's [open questions](01-brainstorm.md#11-open-questions-for-the-president) stay open — the variants are designed not to pre-answer them.

## The one-line strategy

A small site full of proof beats a big site full of prose — and no other branch on earth can show *how* they assure quality; we can, so the site should show the machine.
