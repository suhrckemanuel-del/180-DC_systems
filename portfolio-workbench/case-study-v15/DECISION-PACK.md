# V15 case-study decision pack

Status: private board review only. Nothing in this pack is approved for public release.

## Recommendation

Feature three cases in this order:

1. **SCEF: partnership strategy and operating system.** The strongest end-to-end consulting story. Five slides connect strategy architecture, measurement, evaluation and practical adoption. This is the clearest evidence that the branch can design how a recurring management decision is made.
2. **One Acre Fund: B2B offering selection.** The strongest analytical decision story. Five pages expose the question, criteria, comparison, limitations and next workstream. The work demonstrates useful restraint because it identifies uncertainty and keeps the client's decision ownership visible.
3. **GoodHout: digital growth priorities.** The strongest breadth and commercial-execution case. Four slides turn customer perception, social deployment and search priorities into a consolidated recommendation. Its evidence chain is thinner than SCEF or OAF, so all captions stay framed as method or proposed action.

Keep two reserves:

- **Stahili: funding and stakeholder strategy.** Two strong decision matrices. Reserve because both expose sensitive client strategy and the source does not consistently show owner, timing or success measures.
- **Circular IQ: circularity positioning.** Two visually strong recommendation slides. Reserve because other candidate slides were vetoed and the survivors require roadmap consent and a current regulatory review.

Together the featured cases show operating-system design, transparent option analysis and practical commercial execution. The brand benefit comes from visible reasoning and action, not invented outcomes.

Weighted case totals: SCEF 90, OAF 81, GoodHout 76, Stahili 71 and Circular IQ 69. A red finding remains a veto regardless of score.

## Review artifacts

- `review-pack/source-inventory.csv`: every PPTX and PDF in the source archive, with exact path, count, category, likely service area and risk.
- `review-pack/selection-table.md`: every proposed slide/page, weighted score, fact/inference/action/unknown classification, decision demonstrated, exact risk and required consent or edit.
- `review-pack/publication-risk-register.md`: independent red/amber/green review, including vetoes.
- `review-pack/consent-checklists-and-client-request.md`: case-specific approval requirements and client outreach draft.
- `private-preview/selected-finalists-contact-sheet.png`: contact sheet for the 18 final featured and reserve exhibits.
- `review-pack/private-finalist-contact-sheet.pdf`: broader five-page archive contact sheet covering 53 high-potential assets.

## V15 placement plan

Keep the current `For clients` page placement between the consulting-cycle section and service-area section. Keep the current concise cards, native dialog, keyboard navigation and no-JavaScript fallback.

Desktop order: SCEF, OAF and GoodHout as the featured row, followed by Stahili and Circular IQ as visibly labelled reserves in the private preview. Production should launch with the three featured cards only unless the board deliberately promotes a reserve.

Mobile order stays the same. Each dialog contains the actual source-slide/page images in narrative order. Surrounding HTML is limited to case framing, captions, alt descriptions, risk labels and full-size links.

## Preview-only implementation

The working preview is `private-preview/v15-vantage/for-clients.html`. It is a copy of the current `origin/main` V15 and does not replace or modify `website/variants/v15-vantage`.

Changed preview files:

- `private-preview/v15-vantage/for-clients.html`: decision-led cards, original source-slide figures, captions, alt text, full-size inspection links and a `noindex` directive.
- `private-preview/v15-vantage/styles.css`: responsive exhibit framing and persistent green/amber condition labels.
- `private-preview/v15-vantage/case-assets/`: only the 18 selected rendered originals.

Production protection:

- Source decks, archive renders and the preview are under `portfolio-workbench`, outside the production builder's `website/variants` source tree.
- The normal V15 files under `website/variants/v15-vantage` are unchanged.
- The preview is local only. It has not been deployed, pushed or given a stable public asset URL.
- Red-vetoed slides are absent from the preview assets.
- Public integration remains blocked until exact case consent, final image hashes, approved captions and any source/legal checks are recorded.

## Verification gates

Before approving a private deployment:

1. Confirm all five cards open the correct native dialog, previous/next case navigation works, Escape closes it and focus returns to the opener.
2. Disable JavaScript and confirm all 18 original exhibits remain reachable in normal page flow.
3. Check desktop and mobile widths for complete images, readable captions, no horizontal page overflow and functional full-size links.
4. Confirm every image loads, every `alt` description is meaningful and every selected source locator matches the manifest.
5. Confirm `website/variants` and a normal production build contain none of `case-assets`, `private-preview` or the source filenames.

Before any production replacement, repeat visual QA against the exact post-consent image hashes and captions.

## Stop decision

No selected exhibit is public-ready. No case-specific consent record was found. OAF, GoodHout, Stahili and Circular IQ all retain amber conditions. SCEF is structurally green but still needs exact-slide, name and logo consent. Any edit after approval requires a new image hash and another visual review.

## My decisions needed

1. Approve SCEF, OAF and GoodHout as the featured cases, with Stahili and Circular IQ as reserves.
2. Approve named-client and logo treatment for each case, or require anonymisation and a new source-preserving visual review.
3. Approve consent outreach using the case-specific checklist and exact attached exhibits.
4. Approve a private, access-controlled preview deployment after the unresolved amber checks are closed.
5. Approve production replacement only after written consent, final risk review and responsive QA.
