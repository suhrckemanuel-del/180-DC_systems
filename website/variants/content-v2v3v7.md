# Shared Content Spec — V2 (Port), V3 (De Stijl), V7 (Polder) ONLY

**Status:** authoritative source of truth for the V2/V3/V7 client-feedback rebrand pass (2026-07-23).
**Forked from** `content.md`, which stays unchanged and remains canonical for the other seven variants.
Where this file and `content.md` disagree (cost language, roles, IA), **this file wins for V2/V3/V7**.
Honesty rules from `content.md` still apply in full: nothing is invented; every gap renders a **visible** `[PLACEHOLDER — …]`.
Brand facts come from `_brand/BRAND.md` (verified ground truth). Read it before implementing.

---

## 0. GLOBAL RULES (apply to every page of all three variants)

### 0.1 Colour — the verified brand green
Every variant currently uses an **invented deep pine green (`#00693C` / `#00512E` / `#0A5B34` family). That is wrong.** Swap to the real 180DC green:

| Token role | Hex | Where |
|---|---|---|
| Brand green (decorative / large surfaces / buttons / icons / big type) | **`#78B038`** | logos, blocks, chips, section fills, buttons, favicons |
| AA-safe green (body text, links, small text on white) | **`#4A7322`** | links, small labels, anything that must pass WCAG AA on white |
| Extra-safe green (very small text / low-vision) | `#3D6B1C` | optional |

- Replace every `#00693C`-family value in each variant's CSS token block **and** any inline `fill:%2300693C` / `fill='%2300512E'` etc. in favicons and SVGs.
- **Any green used as text on white must be `#4A7322` or darker** — `#78B038` fails AA for text (2.6:1). Buttons: `#78B038` fill with dark ink or white text on top is fine (large/bold).
- **Add much more white space.** 180dc.org is white-dominant with green as accent. Dial back full-bleed saturated bands: prefer white/near-white (`#FFFFFF` / `#FAFBF9`) grounds with green as accent, not green as the field. Keep each variant's identity, but lighten the overall weight.
- De Stijl (V3) keeps its red `#C8102E` / blue `#1348A0` / yellow `#F2CB05` primaries — those are the De Stijl system, not the brand-colour error. **Only the green token changes** (to `#78B038`, with `#4A7322` for green text/links).

### 0.2 Logo — real assets (already compressed + placed in each variant's `img/`)
Three WebP files now live in **`<variant>/img/`** (self-contained so the build copies them):

| File | What it is | Use |
|---|---|---|
| `img/180dc-globe.webp` (260×182, ~14 KB, transparent) | the green globe mark ("the big green ball") | header/nav mark, small accents |
| `img/180dc-lockup-branch.webp` (480×600, ~59 KB, transparent, black text) | globe + "180Degrees Consulting" + green "DELFT ROTTERDAM" | one prominent light-background placement (Mission or hero or footer) |
| `img/180dc-lockup-white.webp` (720×206, ~37 KB, transparent, white wordmark) | globe + white "180Degrees Consulting" | any dark band / dark footer |

- Put the **globe mark in the header** next to the wordmark text (replace the invented `180°` / `180` glyph). Keep the text "180 Degrees Consulting / Delft–Rotterdam" alongside it in the variant's own type.
- Use **one** full lockup somewhere prominent (branch lockup on a light section, white lockup on a dark section). Add `width`/`height` + `loading="lazy"` on any lockup below the fold.
- Alt text: `"180 Degrees Consulting Delft–Rotterdam logo"` for lockups; the header globe can be `aria-hidden` if the wordmark text is adjacent, else alt `"180 Degrees Consulting"`.

### 0.3 Favicon — green, never orange
Replace each variant's favicon data-URI so the green becomes `#78B038` (or `#4A7322` where a fill sits under small text). **V2's favicon is currently orange (`#D9531F`) — change the fill to `#78B038`, dark `#10181E` "180" text on top.** V3: change its `#00693C` block to `#78B038` (keep red/yellow De Stijl blocks). V7: change the dike triangle `#00512E` to `#78B038`, keep the dark base. Apply to **both** `index.html` and `for-clients.html` (and the guide if it sets one).

### 0.4 Terminology — non-negotiable (from BRAND.md Yes/No table)
**Remove every instance of "pro bono", "free", "€0", and "no cost".** Reframe using the approved language: **"uniquely affordable" / "low-cost" / "very affordable"** consulting. Do not invent a price or say a number; do not say "free". The underlying offer is unchanged — this is brand-consistent phrasing only.

| ❌ Remove / rename | ✅ Replace with |
|---|---|
| "pro bono", "100% pro bono", "€0", "at no cost", "no cost", "free" | "uniquely affordable", "low-cost", "very affordable" (pick per context; never a number) |
| "Why free doesn't mean unchecked" | "Why affordable doesn't mean unchecked" |
| "pro-bono experts" (knowledge partners) | "expert advisors" / "expert mentors" (NOT "volunteer") |
| "team lead" / "team leader" / "dedicated lead" | **"Project Manager"** |
| "President" (board) | **"Branch President"** |
| "Vice President" (board) | **"Branch Vice-President"** |
| "Chapters/Offices/Clubs/Societies" | "Branches" (already correct in these variants) |

Director titles (Marketing/Events/External Relations/Human Resources/Consulting Director) stay as-is — acceptable Branch Executive titles. Keep `@180dc.org` emails. Keep "Junior Consultant" for first-project members where roles are named.

### 0.5 The "first multi-city branch" claim
**Keep it** — it is 180DC's own live public claim (verbatim on 180dc.org today, see BRAND.md). Do not invent further stats around it. Log in each guide that a one-line board sign-off (Stefan Kluwer) is recommended before it's treated as final, but it should not be deleted.

### 0.6 Board roster — pending Monday confirmation
The `monday` MCP could not be authorised in this session (needs interactive OAuth). Keep the snapshot roster below, but render a **visible flag** in the Board section: `[PLACEHOLDER — roster pending confirmation against Monday.com]`. Log in each guide that Monday auth is an outstanding blocker.

---

## 1. INFORMATION ARCHITECTURE (the point of this pass — reduce clutter)

A first-time visitor must instantly find three things: **who we are / what we do**, **I want to apply**, **I want a project.** Tighten the top nav to the essentials (in each variant's label idiom):

**Nav order (all three):** `Mission` · `What we do` · `Our work` · `For clients` · `Join` · `Team` · `Contact`
- Drop jargon nav labels. V2: nav "Team" not "Crew"; V7: "Team" is fine alongside its "Water board" flavour heading, but the nav label should read clearly.
- The brand mark (globe + wordmark) links home; a separate "Home" item is optional — prefer dropping it to reduce clutter.
- **Partners** moves out of the top nav into the hero "three doors" + footer (still a real audience, just not top-level clutter).

**Homepage section order (all three):**
1. Hero + three doors
2. **Mission** (NEW — see §2)
3. Proof row (recoloured; cost cell reworded)
4. What we do (the six service areas — unchanged copy)
5. Quality system (recoloured; reworded per §0.4)
6. **Our work / Portfolio** (NEW dedicated section — see §3)
7. **Join** (rebuilt — see §5)
8. Partners (reworded)
9. **Team / Board** (photo slots + roster flag — see §6)
10. Footer

### 1.1 The three doors (hero primary CTAs — all variants)
1. **Work with us** → `for-clients.html#intake` — **must land directly on the booking form**, one click, no further scrolling. (Currently it lands at the top of for-clients; change the href to the `#intake` anchor.)
2. **Join as a consultant** → `#join`
3. **Partner with us** → `#partners` (or `#contact`)

---

## 2. MISSION (new section — currently missing on all three)

Heading idea: **"Our mission"** (variant may theme the label, e.g. V2 "Our heading", V7 a datum band — but the word "mission" should be legible).

Copy (use as-is or lightly adapt to the variant's voice; do not add invented facts):

> **We make high-quality strategy consulting available to the organisations that do the most good and can least afford it** — non-profits, social enterprises, and mission-driven institutions — while giving students from TU Delft and Erasmus Rotterdam their first real consulting experience.
>
> Two cities, two universities, one team: the technical depth of Delft and the business acumen of Rotterdam, pointed at problems that matter. We are the first multi-city branch of 180 Degrees Consulting, the world's largest university-based consultancy.
>
> Our focus is impact — but it isn't a gate. We work with almost any organisation trying to do good. If that's you, you're in the right place; if you're not sure you fit, ask us anyway.

The third paragraph is the **softened relocation** of the old exclusionary qualifier ("If your primary goal is impact rather than profit… you likely qualify"). That old line must be **removed** from the For-Clients hero and this welcoming version used instead (see §4).

Optional: place `img/180dc-lockup-branch.webp` in this section on a light ground.

---

## 3. OUR WORK / PORTFOLIO (new dedicated section — must NOT be buried in the quality copy)

Its own section on the homepage **and** its own nav entry ("Our work"). No real case studies exist yet → honest placeholder, but give it real structure.

Heading: **"Our work"**
Intro copy:

> Our first case studies are being prepared for publication, with client consent. Until then, here is exactly what a 180DC engagement produces: a board-ready strategy deck, every underlying analysis handed to you, quality-assured before it reaches your desk.

Then show **three reserved case-study cards**, each visibly a placeholder, each showing the **Situation → Approach → Outcome** structure as the design:

- Card label: `[PLACEHOLDER — case study awaiting client consent]`
- Visible sub-structure per card: three stacked slots labelled **Situation**, **Approach**, **Outcome** (empty/hatched).
- **Never** invent clients, outcomes, numbers, or logos.

Render the cards in the variant's idiom (V2: container placards; V3: Mondrian cells; V7: surveyed parcels).

---

## 4. FOR CLIENTS (the engagement page)

### 4.1 Who qualifies — soften and welcome (remove the gate)
**Delete** the hero line "If your organisation's primary goal is impact rather than profit … you likely qualify." Replace the For-Clients hero sub with:

> We work with almost any organisation doing good — non-profits, social enterprises, and mission-driven teams. Impact is our focus, not a barrier to entry. Quality is protected by our review system, not a fee: our consulting is **uniquely affordable**, and our students do it for the experience and the mission.

### 4.2 The two consulting cycles (replace generic "8–10 week" / "10–12 week" framing)
State the branch's two real engagement cycles explicitly, and anchor the timeline to them:

> **We run two consulting cycles a year: October–January and March–June.** Each engagement is scoped to a single cycle — roughly a semester of work by a dedicated team.

Rework the four-phase timeline so durations are **cycle-relative**, not invented week counts. Keep the four phases and their descriptions (they're good), just retitle the durations:

1. **Scoping call** — *start of cycle.* A structured discovery conversation: your challenge, your constraints, what success looks like. One hour, no commitment.
2. **Proposal, signed by you** — *week 1.* A written scope: what we will answer, what we won't, and what you'll hold at the end. No surprises mid-project.
3. **The project** — *the cycle.* A team of 4–6 student consultants with a dedicated **Project Manager** (← renamed from "team lead"). A mid-point review where you course-correct, and working sessions as the analysis firms up. Your time: about an hour a week.
4. **Board-ready presentation** — *end of cycle.* Presented to you, with every underlying analysis handed over. Yours to use, cite, and build on.

Remove any "8–10 wks" / "10–12 weeks" duration chips/labels (e.g. the V2 service-table "Passage" column of "8–10 wks", the "10–12 weeks" hero copy). Where a duration must appear, say **"one consulting cycle."**

### 4.3 Always expanding — welcome out-of-scope inquiries
Add a line near the six service areas:

> These six areas are where most of our work sits — but the branch is always expanding and we take projects case by case. If your challenge sits outside this list, ask anyway; out-of-scope inquiries are welcome.

### 4.4 Six service areas — UNCHANGED
Keep all six areas and their one-line descriptions verbatim (Digital Transformation, Marketing & Engagement, Financial Sustainability, Market Assessment, Operational Efficiency, Impact Measurement — see `content.md` §3). Only strip any "€0/pro bono/8–10 wks" chrome around them.

### 4.5 Cost language on this page
- V2 for-clients "Bill of lading" card: keep the visual card, but change `€0 · Pro bono` / `Freight: Prepaid — by us` → **"Cost: uniquely affordable"**; rename "team lead" → "Project Manager"; relabel "Bill of lading" plainly (e.g. "Engagement summary") — see §7 V2 jargon note.
- V3/V7 "€0" hero blocks / "Fee: €0" → **"Uniquely affordable"** / "Low-cost, always."
- Quality heading "Why free doesn't mean unchecked" → **"Why affordable doesn't mean unchecked."**

### 4.6 Booking form — KEEP the pattern (client praised it)
Do not redesign the intake form. Keep the five/four-field pattern (name, organisation, email, challenge; V3's "what happens after you press send" note is good — keep). Keep the `[PLACEHOLDER — form UI only, not yet wired to a backend]` note. Ensure the hero "Work with us" / "Start a scoping call" primary CTA anchors straight to this form (`#intake`).

---

## 5. JOIN (rebuilt — for students)

Heading: **"Join us"** / keep each variant's flavour ("No consulting experience required" is a strong subhead — keep it).

### 5.1 Two recruitment windows
> We recruit twice a year, once per consulting cycle: **Cycle 1 recruits in September; Cycle 2 recruits in January/February.**

Reserve a **recruitment-portal link slot**: `[PLACEHOLDER — recruitment portal link, opens each recruitment season]`.

### 5.2 Two roles — describe both

**Consultant** (entry role; first-project members are **Junior Consultants**):
> **No experience required — and we mean it.** Our consultants are engineers, designers, economists, and social scientists who arrive fresh and learn on the job, with a trained team and a Project Manager around them. People sometimes talk themselves out of applying because they think they need consulting experience first — you don't, and it shouldn't stop you. You'll work directly with a real organisation's leadership for a cycle and leave with a board-ready deliverable you helped build.

**Project Manager** (per terminology — never "Team Leader"):
> Project Managers lead a consulting team through a cycle. Experience is wanted here: the usual path is one cycle as a Consultant, then stepping up to Project Manager the next. You'll own scope, client relationship, and quality for your project.

What you learn (keep): structured problem-solving, client communication, and AI-assisted consulting methods no other student club teaches. Who we want (keep): students from both campuses — TU Delft technical depth and Erasmus business acumen are equally the brand.

### 5.3 Testimonial slots (placeholder — sourced later with consent)
Reserve **two or three member-testimonial slots**, each visibly a placeholder, each structured to hold: *why they liked it* + *where they work now.*
`[PLACEHOLDER — member testimonial, sourced with consent: what they took from it and where they are now]`

### 5.4 Events — reserved section/slot
Reserve a distinct **Events** block (a small section, or a clearly separate sub-block within Join — not merged into the role copy):
> **Events.** Info sessions, workshops, and socials run through each recruitment season and cycle.
`[PLACEHOLDER — events calendar coming soon]`

---

## 6. TEAM / BOARD

### 6.1 Reserve real photo slots
Every board member gets a **reserved portrait slot** rendered in the variant's own placeholder idiom (see §7 per-variant). No stock faces. Keep the "every 180DC branch is entirely student-run" framing. Add a small `[PLACEHOLDER — team photos awaiting photo session]` note.

### 6.2 Roster — renamed roles + Monday flag
Render this roster (roles renamed per §0.4). Add the visible flag: `[PLACEHOLDER — roster pending confirmation against Monday.com]`.

| Name | Role (rendered) | Email |
|---|---|---|
| Stefan Kluwer | **Branch President** | s.kluwer@180dc.org |
| Zhi Yu Yap | **Branch Vice-President** | z.yuyap@180dc.org |
| Phuong Anh Nguyen | Marketing Director | a.nguyen@180dc.org |
| Austeja Kupsyte | Events Director | a.kupsyte@180dc.org |
| Benas Maciulskis | External Relations Director | b.maciulskis@180dc.org |
| Sarayesha Fazila | Human Resources Director | s.fazila@180dc.org |
| James Ward | Consulting Director | j.ward@180dc.org |
| Fredrik Nygaard Løvåsen | Consulting Director | f.nygaard@180dc.org |

---

## 7. PER-VARIANT ADAPTATION NOTES

### V2 — Port
- **Keep the industrial/port visual identity** (crane silhouettes, container geometry, manifest tables, colour blocks — recoloured to `#78B038` greens). **Dial back cargo/freight/shipping jargon in the actual copy** — the client likes the theme, not the terminology. Specifically:
  - Nav: **"Crew" → "Team"**.
  - Hero code strip: drop "CARGO 180U-…· PRO BONO STRATEGY" → e.g. `DELFT × ROTTERDAM · EST. 2019 · AFFORDABLE STRATEGY`.
  - "Cargo manifest — verified" → "What we're made of — verified, nothing invented" (plain).
  - "Six containers — pick your load" → "What we do" (keep the container *visual*, drop the load metaphor in the heading). Decorative `180U-SVC-00x` codes may stay as small visual labels but keep them muted.
  - "Every deliverable clears customs" → "Every deliverable is reviewed before it reaches you." "Port control — quality assurance" tag may stay (short, doesn't obscure).
  - for-clients: "Bill of lading" card → relabel **"Engagement summary"**; "Route plan / Port 00 / passage" steppers may keep light port flavour but must read clearly; `€0 · Pro bono` / `Freight` → "Cost: uniquely affordable".
  - "Vessel 180U-2019-DR" footer legal line — keep light, it's decorative, harmless.
- **Portrait slots (Board):** reserved 3:4 photo frames — dashed border + diagonal hatch (reuse V1's `.frame-slot` pattern), recoloured to V2 green, arranged in a card grid; name + role + email beneath each. Replace the current "Crew manifest" table with this photo-slot grid (or keep a compact row layout, but the reserved photo slot must be present and obvious).

### V3 — De Stijl
- Mondrian grid identity stays. **Only the green primary changes** to `#78B038` (and `#4A7322` for green text/links). Red/blue/yellow stay.
- Add much more white: De Stijl is white-dominant with placed colour — lean into that (it already does; keep the green band lighter/smaller).
- New Mission, Our work, rebuilt Join, Events, testimonials as Mondrian cells.
- **Portrait slots (Board):** reserved square photo frames with the 6px black De Stijl border, a primary-colour block as the placeholder fill (rotate green/red/blue/yellow), name + role + email below — the monogram-slot idea adapted to De Stijl squares. Keep the mosaic feel.

### V7 — Polder
- Landscape-strata identity stays; NAP datum bands stay. Recolour `--dike` / `--green` / `--green-ink` to the `#78B038` / `#4A7322` family (keep the water/field neutrals; ensure green text on land bands still clears AA — use `#4A7322`/`#3D6B1C`).
- The descent metaphor is nice but **reduce clutter**: make sure Mission / What we do / Our work / Join / Team read clearly through the flavour. New sections get their own NAP bands.
- **Portrait slots (Board / "het waterschap"):** reserved 3:4 dashed "plot" frames with a faint field-green hatch (reuse V1 hatched-frame pattern in polder greens), grid layout — "each plot reserved for the photo session, no stock faces." Name + role + email per plot. Replace the plain `<ul class="board">` list with reserved-frame plots.
- Keep the pump/quality SVG; keep the honesty note. Reword any "pro bono / €0 / free" (the pump copy and for-clients "Fee: €0" / "why free doesn't mean unchecked").

---

## 8. HONESTY-RULE PLACEHOLDER REGISTER (every one must render visibly)
- Impact numbers (proof row): `[PLACEHOLDER — impact numbers, honestly sourced, with the first Impact Report]`
- Case studies (Our work): `[PLACEHOLDER — case study awaiting client consent]` (×3 cards, Situation→Approach→Outcome visible)
- Board photos: reserved portrait frames (visual) + `[PLACEHOLDER — team photos awaiting photo session]`
- Board roster: `[PLACEHOLDER — roster pending confirmation against Monday.com]`
- Recruitment portal: `[PLACEHOLDER — recruitment portal link, opens each recruitment season]`
- Events: `[PLACEHOLDER — events calendar coming soon]`
- Testimonials: `[PLACEHOLDER — member testimonial, sourced with consent: what they took from it and where they are now]` (×2–3)
- Partner logos: `[PLACEHOLDER — partner logos awaiting first partnerships]`
- Intake form: `[PLACEHOLDER — form UI only, not yet wired to a backend]`

## 9. OUTSTANDING BLOCKERS (log these in each variant's guide, don't stop for them)
1. **Monday.com auth** — MCP needs interactive OAuth; roster shown is the live-page snapshot, flagged pending.
2. **"First multi-city branch" sign-off** — confirmed on 180dc.org; recommend a one-line confirmation from Stefan Kluwer before treating as final.
3. **Real photos, case studies, testimonials, partner logos, live form backend, recruitment/events links** — all reserved as visible placeholders per honesty rules.
