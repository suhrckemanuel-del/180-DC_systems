# Website Brainstorm: The Full Inventory

Everything the branch site *could* contain, organized so the President can cut, not so we can build it all. Grounded in [00-research.md](00-research.md). Items are tiered: **[MVP]** = launch blocker, **[V2]** = first semester after launch, **[LATER]** = only when the content pipeline exists. Rule of thumb from the research: a small site full of proof beats a big site full of prose.

## 1. Who the site is for (three doors, five jobs)

| Audience | Their question | The page that answers it |
|---|---|---|
| Non-profit / social enterprise director | "Can these students actually help me, and what does it cost me to find out?" | For Clients + Our Work + How It Works |
| Prospective student consultant | "What do I get out of this for my career, and can I get in?" | Join + Alumni/Careers + FAQ |
| Sponsor / partner firm | "What's in it for us — access to which students, visibility to whom?" | Partners |
| University stakeholders & press | "Is this legitimate and worth associating with?" | About + Impact |
| 180DC Global + other branches | "What can we learn/copy?" | The AI-lab story (see §5) |

Every page below serves exactly one door. Anything serving "everyone" serves no one (research pattern #1).

## 2. Sitemap — every candidate page

### The spine [MVP]
- **Home** — one screen must do: positioning line (*"Engineering meets business: TU Delft × Erasmus Rotterdam, consulting for organisations doing good"*), one proof row (projects delivered / consultants trained / cities), three door-buttons (Get consulting / Join us / Partner with us), one flagship case teaser, footer with 180DC global affiliation.
- **For Clients** — who qualifies (non-profits, social enterprises, mission-driven orgs), what engagements look like, the service areas (keep the six from the current page but each with a one-line concrete example), *what it costs (pro bono — say it early and big)*, and **the engagement timeline** (our version of Leuven's 8-week visual: scoping call → proposal → 8–10 week project with named touchpoints → final board-ready presentation). CTA: intake form.
- **Our Work** — the case study gallery. Launch bar: minimum 3 anonymized-or-approved case studies (Situation → Approach → Outcome, one pull-quote, one number each). This is the page that kills "Coming soon." Case Study Forge ([lab/demos.md #3](../lab/demos.md#3-case-study-forge)) is the production line.
- **Join** — why join (career outcomes first — research pattern #4), who we look for (explicitly: *no consulting experience required; engineers, designers, economists wanted* — the Delft×Rotterdam mix is the brand), what you'll do semester by semester, application timeline + form/portal link, FAQ.
- **Team** — exec with photos/roles/LinkedIn (already exists on the global page — port and improve), president's welcome note with name and term (Berkeley's cheap-authenticity move).
- **Contact** — one form routing to three inboxes (client / applicant / partner), physical footprint (Delft + Rotterdam), socials.

### The proof layer [V2]
- **Impact** — counters (projects, organisations served, consultant hours donated, students trained), map of client locations, and the **annual Impact Report** as downloadable PDF (Leuven's compounding artifact; year 1 can be modest and honest).
- **Alumni & Careers** — where members went (destination logo wall once real; individual "where are they now" cards before that), testimonials tying the branch experience to the job they landed. Feeds recruitment *and* gives sponsors their audience argument.
- **Partners** — Academy Consult's two-tier model: *recruiting partners* (firms who want access to members: sponsor package, event slots, CV-book) and *knowledge partners* (trainers, mentors, pro-bono experts). Each tier gets its own pitch and its own CTA. Kills "No items found."
- **Testimonials everywhere, page nowhere** — client quotes live on For Clients, student quotes on Join, partner quotes on Partners. A testimonial page is where quotes go to be unread.

### The differentiator layer [V2→LATER] — see §5
- **How We Work / Quality** — the page no other branch can write.
- **Blog / Field Notes** [LATER] — only with an owner and a pipeline; a stale blog is negative proof.
- **Events / Case Competition** [LATER] — UCLA's flagship-event model, only if the branch actually runs one.

## 3. Content assets needed (the real work — the site is the cheap part)

| Asset | For | Source / production line | Blocker level |
|---|---|---|---|
| 3+ case studies, client-approved or anonymized | Our Work | Case Study Forge on past deliverables + consent checklist | **Launch** |
| Positioning line + 150-word boilerplate | Home, everything | Write once, President signs off | **Launch** |
| Engagement timeline graphic | For Clients | Design from our actual process (scoping → review → delivery) | **Launch** |
| Exec photos + welcome note | Team | One photo session | **Launch** |
| Client intake form (5 fields max) | For Clients | Form tool; feeds the Discovery-to-Proposal Copilot | **Launch** |
| 5–8 client + student testimonial quotes | Distributed | Ask at project close (add to handover interview!) and semester end | V2 |
| Impact numbers, honestly sourced | Home, Impact | Count what's countable; never inflate (quote-or-abstain applies to marketing too) | V2 |
| Destination/alumni list | Alumni | LinkedIn sweep + alumni consent | V2 |
| Impact Report PDF | Impact | Annual ritual, semester-close | V2 |
| Photo library (real teams, real events — no stock) | Everywhere | Designate a photographer per event | Ongoing |

## 4. Features & functionality

- **[MVP]** Client intake form · application form/portal link · mobile-first responsive · dark-mode-friendly · privacy page.
- **[V2]** Application status FAQ bot fed by the FAQ page · newsletter signup (only with an owner) · calendar embed for info sessions.
- **[LATER]** Member login area (resist — maintenance trap) · CV-book access for sponsors (gated, GDPR-heavy — needs real thought) · multilingual NL/EN (English-first is fine for both campuses; Dutch helps client acquisition among small local non-profits — decide with data).
- **Anti-features (deliberately not):** member blog with open posting, forums, events calendar without an events pipeline, anything requiring weekly maintenance by a specific person. Every feature must survive the turnover test: *who updates this in 3 years when nobody who built it is here?*

## 5. The differentiator: show the machine

No branch surveyed can prove how they assure quality. We can, and it's already public:

- **"How We Work" page [V2, but the strategic heart]:** the quality system, told for a client audience — every deliverable passes an AI-assisted senior review calibrated against real cases; every project is scoped with a structured discovery process; every final deck survives a murder board before the client sees it. Diagram, not essay. Link the [public repo](https://github.com/suhrckemanuel-del/180-DC_systems) for the skeptical.
- **Why it converts every audience at once:** clients get de-risking ("they have an actual QA system"), students get the career pitch ("learn AI-augmented consulting no other club teaches"), partners get the story ("the AI-native student consultancy"), 180DC Global gets a reason to hand us an innovation award — which then feeds the awards row (UCLA's playbook).
- **Honesty guard:** claim only what's real. "AI-assisted review on every deliverable" only goes live when it *is* true on every deliverable. The page ships with the practice, not before it.

## 6. Design direction

- **Brand constraint first [open question #1]:** 180DC Global has brand guidelines and hosts our page on 180dc.org. Confirm what a standalone branch site may/must do (UCLA, Berkeley, Leuven all run standalone sites, so precedent exists — but check the rules before buying a domain).
- Domain candidates: `180dcdelftrotterdam.org` (long), `180dc.nl` (if available — strong), subdomain per global policy.
- Look: clean, fast, photo-real (no stock consultants shaking hands), 180DC green as accent with lots of white; the *engineering × business* identity can carry a subtle technical visual language (grids, diagrams) that differentiates from every business-school-vibe branch site.
- Tone: Academy Consult's lesson — youth as asset, never apologized for. "Radical thinking, professional discipline."
- Accessibility: WCAG AA, semantic HTML — cheap at build time, expensive to retrofit, and mission-aligned (non-profit clients include accessibility-focused orgs).

## 7. Tech stack options

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Static site (Astro/Eleventy/plain) + GitHub Pages/Netlify, content as markdown in a repo** | Free, fast, version-controlled, AI-assistable, survives turnover as code, matches how this team already works | Non-technical editors need a lesson (or an AI assistant) | **Recommended** — the branch's whole toolchain is repo-based; the site becomes another artifact the AI team's methods maintain |
| Squarespace/Wix (what UCLA/Berkeley use) | Anyone can edit | ~€200+/yr, content trapped in a vendor, no version control, dies when the card expires | Fallback if exec insists on WYSIWYG |
| Webflow | Design power | Cost + steepest turnover risk of all | No |
| WordPress | Familiar | Maintenance/security burden nobody will own | No |

Static + repo also means: case studies are markdown files produced by Case Study Forge, the site rebuilds automatically, and CONTEXT.md-style docs teach the next maintainer. The website becomes *part of the AI lab*, not a separate chore.

## 8. Operations (the part that decides if it's alive in 2 years)

- **Named role:** website keeper (can be the memory-keeper role from [Branch Brain](../lab/top7/04-branch-brain.md) — same instinct), with a 30-min monthly ritual: link check, one content update, form-inbox check.
- **Content calendar tied to existing rituals, not goodwill:** project close → case study + client quote (add to the handover interview); semester close → impact numbers + alumni update; recruitment open → Join page refresh. Never "post when something happens."
- **The turnover test as launch gate:** a new member must be able to add a case study by following a one-page how-to (or by pasting the how-to into a chatbot). Same handoff bar as every branch tool.
- Analytics: privacy-friendly (Plausible/GoatCounter — GDPR-simple, no cookie banner circus). Measure the only three funnels that matter: client form submits, application starts, partner contacts.

## 9. Legal & compliance (Netherlands / EU)

- GDPR: privacy statement, minimal form data, no tracking cookies (see analytics choice), photo consent for every face on the site, alumni/member consent for names and destinations.
- Client confidentiality: case studies follow the repo's anonymization/consent standard — the [Case Study Forge risk controls](../lab/demos.md#3-case-study-forge) (adversarial "guess the client" pass) apply to every published case.
- 180DC Global trademark/brand usage — same open question as §6.

## 10. Launch plan

1. **Sprint 0 — decisions (President + exec):** standalone site yes/no, domain, brand-rule check with Global, who is website keeper, which 3 projects become launch case studies.
2. **Sprint 1 — content before code:** write the 3 case studies (Forge + consent), positioning line, engagement timeline, team photos. *If the content isn't producible, we learn it now, not after building an empty shell — the current page's exact failure.*
3. **Sprint 2 — build MVP:** the six spine pages, static stack, forms wired, analytics on.
4. **Soft launch:** exec review → 5 outsiders (1 real non-profit contact, 2 students who don't know us, 1 sponsor contact, 1 professor) do a think-aloud test on the three doors.
5. **Public launch** aligned with a moment that gives it traffic: recruitment opening or a signed client announcement.
6. **V2 within the semester:** Impact, Partners, Alumni, How We Work — each shipping only when its content actually exists.

## 11. Open questions for the President

1. Standalone site vs improving the 180dc.org page only — and Global's brand rules either way.
2. Budget reality: domain (~€15/yr) + nothing (static) vs ~€200/yr (site builder).
3. Which past projects may be published, and who contacts those clients for consent.
4. Dutch language: launch English-only or bilingual?
5. Does the branch want the AI story front-and-center ("the AI-native branch") or as a quiet quality page? This is a positioning choice above the AI team's pay grade — it shapes recruitment, client mix, and how Global sees us.
6. Who owns the website-keeper role starting day one.
