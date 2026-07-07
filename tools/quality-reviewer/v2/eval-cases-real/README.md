# Real evaluation cases

Eval cases built from actual past 180DC deliverables via the pipeline in
[../12-real-deck-intake.md](../12-real-deck-intake.md). Unlike the synthetic set in
[../eval-cases/](../eval-cases/), these carry real deck structure, real ambiguity and
real PDF extraction noise. Pseudonymised per the intake policy: client codenames,
people as roles, business facts kept.

Rules that hold in this folder:

- Gold labels (`real-NN.gold.md`) are human-written and adjudicated between the two
  labelers. No AI writes or drafts gold here.
- Case bodies keep extraction noise. Do not clean them up.
- The codename-to-client mapping and the machine triage bands live in the sealed
  selection memo, not here. Labelers: do not read the sealed memo until your labels
  are adjudicated.
- No prompt or rubric change may be justified against a single case from this folder.
  The full set runs, then calibration clusters are read per
  [../05-eval-harness.md](../05-eval-harness.md) section G.

Status: all 14 case files built and anonymisation-QA'd (2026-07-07). Ready for blind
labeling per [labeling/PROTOCOL.md](labeling/PROTOCOL.md). No gold exists yet and the
reviewer has not run on any case.

| Case | Source stage | Case file | Gold label | Baseline run |
|---|---|---|---|---|
| real-01 | D1 | [real-01-consumer-goods-market-entry.md](real-01-consumer-goods-market-entry.md) | pending | not run |
| real-02 | final | [real-02-waste-tech-acquisition-report.md](real-02-waste-tech-acquisition-report.md) | pending | not run |
| real-03 | D1 | [real-03-child-welfare-funding.md](real-03-child-welfare-funding.md) | pending | not run |
| real-04 | D2 | [real-04-senior-living-business-plan.md](real-04-senior-living-business-plan.md) | pending | not run |
| real-05 | D3 | [real-05-conservation-microfinance.md](real-05-conservation-microfinance.md) | pending | not run |
| real-06 | final | [real-06-prevention-nonprofit-strategy.md](real-06-prevention-nonprofit-strategy.md) | pending | not run |
| real-07 | D1 | [real-07-container-housing-analysis.md](real-07-container-housing-analysis.md) | pending | not run |
| real-08 | D2 | [real-08-mobility-aid-research.md](real-08-mobility-aid-research.md) | pending | not run |
| real-09 | D2 | [real-09-integration-saas-pricing.md](real-09-integration-saas-pricing.md) | pending | not run |
| real-10 | final | [real-10-materials-marketing-final.md](real-10-materials-marketing-final.md) | pending | not run |
| real-11 | D1 | [real-11-agritourism-operating-model.md](real-11-agritourism-operating-model.md) | pending | not run |
| real-12 | D1 | [real-12-donation-platform-analysis.md](real-12-donation-platform-analysis.md) | pending | not run |
| real-13 | final | [real-13-packaging-financial-model.md](real-13-packaging-financial-model.md) | pending | not run |
| real-14 | D2 | [real-14-fashion-d2c-strategy.md](real-14-fashion-d2c-strategy.md) | pending | not run |
