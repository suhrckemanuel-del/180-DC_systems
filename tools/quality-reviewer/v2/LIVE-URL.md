# Where the reviewer is hosted

**The link: https://180dc-reviewer.pages.dev**

Open it and it works. No install, no API key, no login, nothing to paste into Claude first.
Deployed 2026-08-05.

## Who this link is for

**Named pilot leads, and the project teams they hand a student pack to. Not general
circulation.** The URL is public and unlisted, so nothing stops it travelling; this is the rule,
not the mechanism.

Circulating it to all branch leads needs 10 or more override records from 3 or more distinct
leads and a named owner reading them, and giving it to another branch needs the matcher and a
re-run on top of that. The bars are in [22-trust-boundary.md](22-trust-boundary.md) section 1,
and each one is a thing you can count rather than a judgement call.

## What you get at that link

| view | who it is for | what it shows |
|---|---|---|
| **Lead triage** | project leads | the deck status board, then keep / ask / cut on every finding, your own readiness call, and the note that writes itself |
| **Student view** | consultants | only the findings the lead kept, with the fix locked until they answer the question |
| **Printable** | anyone | the same note on paper, readiness deliberately absent |

Six reviews are bundled into the page, all of them fabricated cases (Client A to Client E).
You can also paste or open your own review JSON, or open a student pack a lead sent you.

## The other 180DC links, so they do not get confused

| project | url | what it is |
|---|---|---|
| `180dc-reviewer` | https://180dc-reviewer.pages.dev | **the working tool.** This one. |
| `180dc-reviewer-mockups` | https://180dc-reviewer-mockups.pages.dev | eight design directions, fabricated data, not a working tool |
| `180dc-variants` | https://180dc-variants.pages.dev | the website variants |

## Redeploying after a change

`index.html` is the source of truth. `site/` is generated and gitignored, so rebuild it, never
edit it.

```
node tools/quality-reviewer/v2/bundle-reviews.js     # only if the bundled reviews changed
node tools/quality-reviewer/v2/build-site.js         # writes site/, refuses on real-case content
npx wrangler pages deploy tools/quality-reviewer/v2/site --project-name=180dc-reviewer --branch=main
```

`build-site.js` will not write a build that carries real-case markers (`Client R` to `Client Z`,
`real-0x`, `real-1x`, `real-baseline`, `eval-cases-real`). It checks the bytes it is about to
write and then re-checks the bytes it actually wrote. Run `node build-site.js --check` to test
without writing.

**Never bundle anything from `eval-runs/real-baseline/`.** Those reviews quote real client decks
verbatim and this is a public URL.

`build-site.js` also prints the kill-switch state and stamps the build date on every build.

## Switching it off

If A1 or A2 is falsified, the tool has to stop being used within the hour.

```
node tools/quality-reviewer/v2/kill-switch.js on "one line on why, shown to whoever opens it"
node tools/quality-reviewer/v2/build-site.js
npx wrangler pages deploy tools/quality-reviewer/v2/site --project-name=180dc-reviewer --branch=main
```

The page then shows a withdrawal notice and nothing else. `kill-switch.js off` and the same two
commands put it back. It reaches the hosted URL on the next page load and it does **not** reach
an open tab, a copy saved to a laptop, or a student pack already sent, so tell people too. The
reasoning and the limits are in [22-trust-boundary.md](22-trust-boundary.md) section 4.

## What leaves the machine

Nothing. The page makes no external request of any kind, and it holds no analytics, no fonts and
no CDN. Triage state lives in `localStorage`; exports are browser downloads. A student link
carries its payload in the URL fragment, which browsers never send to a server, though it will
sit in whatever chat app you paste it into, so treat a link for a real deck the same way you
would treat the deck.
