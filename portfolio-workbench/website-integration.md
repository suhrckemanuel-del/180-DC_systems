# Portfolio website integration

## What the site should publish

Publish rebuilt case studies, never the source reports or source slide decks. Each case should be an approved, 5-7 section narrative and contain only approved copy, approved reconstructed visuals and an explicit service category.

## Recommended first release

Add an `Our work` destination to the client-facing site with a five-card grid. Cards should show:

- an approved or anonymised case title;
- a service category (for example, growth strategy, operating model or digital presence);
- one decision-led sentence; and
- one approved thumbnail or abstract visual.

Each card opens a dedicated case-study page. Do not offer a source-deck download. A consistent final call to action should invite a prospective client to discuss a comparable question.

For the existing V15 client-page section, use `v15-case-study-section.md`. It provides the exact three-card layout, proposed content hierarchy and the case-to-card mapping.

## Case-study page structure

1. Decision question and concise answer
2. Engagement scope and service area
3. Approach: two or three evidence streams
4. Approved insights or recommendations
5. One or two reconstructed exhibits
6. What happened next, only if verified and approved
7. Client enquiry call to action

## Safe content model

The site data should hold only public-safe fields: `slug`, `title`, `service`, `summary`, `question`, `approach`, `insights`, `approvedExhibits`, `outcome`, `status` and `publicOkRecord`. The route should render an entry only when `status` is `approved` and its `PUBLIC-OK` record is complete.

Keep raw filenames, original slide numbers, source files, client contact details and claim-register evidence outside the website repository and outside the build output.

## Staged rollout

1. Build the reusable case-study template with placeholder content.
2. Complete a sanitized source pack and the Quality Reviewer pass for one candidate.
3. Obtain a signed `PUBLIC-OK` record and populate the first real case.
4. Add the other four only after their separate approval checks.

This lets the visual system be implemented immediately without accidentally publishing client material.
