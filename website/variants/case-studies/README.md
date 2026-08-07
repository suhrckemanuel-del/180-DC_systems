# Selected deliverables viewer

This is a standalone public route: `/case-studies/`.

Each case opens the selected original pages rather than a rewritten case study:

| Client | Selected pages/slides |
|---|---|
| One Acre Fund | Problem statement, assessment criteria, product x criteria matrix, action plan |
| Barefoot College International | Executive summary, livelihood pillars, implementation plan, conclusion |
| Stahili | Funding evaluation, stakeholder matrix, implementation plan |
| Saaras Foundation | Branding methodology, findings, 70-20-10 content rule, conclusion |
| GoodHout | Social deployment timeline, website presence, final recommendation |

The viewer route is copied to the deployed Pages site by `tools/build-dist.mjs`. The existing V15 section can link each card to this route or simply use `/case-studies/#one-acre-fund` and the other card anchors.
