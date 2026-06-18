# Claims Verification Report
**Date:** 2026-06-05
**Method:** 1 extractor agent → 4 independent verifier agents (no agent verified its own extractions)
**Claims checked:** 37 across 5 research files
**Verdict distribution:** 13 VERIFIED · 8 PARTIAL · 4 FAILED · 1 STRUCTURAL ISSUE

---

## STRUCTURAL ISSUE — Read First

### arXiv 2605.17554 — WITHDRAWN (May 30, 2026)
The paper described in the research files as the "academic backbone" and "the only MECE academic rubric purpose-built for consulting deliverables" was **withdrawn from arXiv 6 days ago (May 30, 2026).** A withdrawn preprint cannot be cited as active academic evidence in any pitch or document. It carries zero evidentiary weight and will undermine credibility if cited.

**Options:**
1. Reframe: describe the five-criterion rubric as derived from practitioner standards (Pyramid Principle, MBB slide standards, MECE) rather than anchoring it to a single academic source.
2. Replace: the ERIP model (Veres & Varga-Toldi, 2020, JBIM) is peer-reviewed, verified, and stands on its own as the academic anchor.
3. Use the rubric framework itself without citing the paper — the five criteria (Data Integrity, Analytical Rigor, Relevance & Focus, Execution Precision, Format & Deliverability) are independently defensible.

---

## FAILED CLAIMS — Remove Before Shipping

### FAIL-1: "McKinsey invests $600M+ annually in knowledge development" (Claim 32)
**Status:** FAILED
**What verification found:** This figure does not appear in any McKinsey knowledge-management source. Every search pairing "$600M + McKinsey" returns their 2021 opioid crisis legal settlement. The only knowledge-management budget figures found in secondary sources are from 2002 ($35.8M) — an order of magnitude smaller and two decades old.
**Action:** Drop entirely. If a knowledge-investment reference is needed, McKinsey's published material references "billions invested in knowledge and capability building" without a precise annual figure — use that framing instead.

---

### FAIL-2: "Over a third of projects fail primarily because the problem is poorly defined at the outset, and more than half of project dollars are wasted as a result." — attributed to PMI via CaseBasix (Claim 14)
**Status:** FAILED
**What verification found:** CaseBasix does not cite PMI anywhere on the page. The PMI attribution is a dead citation chain — CaseBasix states the claim without linking to any PMI report. The real PMI figures (from Pulse of the Profession 2014) concern *requirements management* failures, not problem definition: 37% of organizations cite inaccurate requirements as primary failure reason; 51% of project dollars wasted due to poor requirements management. Close in spirit, but different scope, and not traceable through CaseBasix.
**Action:** Either drop, or go directly to PMI Pulse of the Profession 2014 and reframe around requirements/scoping failure. Do not cite CaseBasix as an intermediary.

---

### FAIL-3: "Bolt-on training retains only 20–40% after 30 days. Embedded learning retains 70–90%." (Claim 34)
**Status:** FAILED as citable evidence
**What verification found:** Both figures appear only in a Medium blog post by Brian Naus, affiliated with "Cabin, an AI transformation consultancy." No primary source, no study, no citation — the percentages are asserted as fact with nothing behind them.
**Action:** Drop the specific percentages. The underlying point (embedded learning outperforms one-time training) is well-supported in learning science literature — cite Ebbinghaus forgetting curve, or the Association for Talent Development (ATD) on spacing effects. If a number is needed, the ~70% figure is sometimes attributed to the National Training Laboratories "Learning Pyramid" — though that source is also contested, it is more established than a marketing blog.

---

### FAIL-4: "Top-half performers improved by 11%" — in the BCG/HBS study (Claim 28)
**Status:** FAILED
**What verification found:** No source — not the Organization Science paper, not Mollick's summary, not The Crimson, not VentureBeat — provides 11% as the top-half figure. Mollick says only "The top consultants still got a boost, but less of one" without a percentage.
**Action:** Drop "43% vs 11%." Use: "Bottom-half performers improved by 43%; top performers also improved, though by a smaller margin." No number for the top half.

---

## PARTIAL CLAIMS — Correct Before Using

### PARTIAL-1: "32% quality improvement" vs "40% quality improvement" — BCG/HBS 2023 (Claims 1 & 28)
**Status:** PARTIAL — internal discrepancy resolved
**Finding:** These are not two conflicting claims about the same fact — they are two different statistics.
- **~40%** is the headline figure appearing in all major secondary sources (Mollick/HBS, Harvard Crimson). It is a rounded/simplified summary.
- **29.9–33.9%** are the actual paper table figures (Table 4, Organization Science 2025), representing quality gains per treatment condition.
- **32%** appears to be an average across conditions — plausible, but not the canonical headline.
**Action:** Use **"~40% higher quality"** as the headline stat (it is what the research community cites and what appears in HBS summaries). If challenged, the paper tables show 30–34%, which still rounds to "roughly one-third higher." Do not use 32% — it will confuse anyone familiar with the paper or its coverage.

---

### PARTIAL-2: arXiv 2605.17554 rubric details (Claims 2 & 8)
**Status:** PARTIAL (and WITHDRAWN — see structural issue above)
**Finding:** The five criteria (Data Integrity, Analytical Rigor, Relevance & Focus, Execution Precision, Format & Deliverability) are confirmed exactly. The benchmark of 42 prompts is confirmed. However: (a) the paper describes a **single** Principal Domain Expert, not plural "practitioners"; (b) the paper has been **withdrawn**.
**Action:** Do not cite this paper. Use the criteria independently as a practitioner-grounded framework.

---

### PARTIAL-3: INFORMS 2023 free-riding finding (Claim 15)
**Status:** PARTIAL — significant framing error
**Finding:** The paper is real (Rajagopalan, Woodside & Belanger, INFORMS Transactions on Education). But it is a **pedagogical improvement paper**, not an observational study of student consulting failures. The free-riding finding describes problems in their *first course iteration (CP 1.0)* that they then solved with a redesigned approach (CP 2.0). Presenting this as a general finding about student consulting misrepresents the paper.
**Action:** If used, cite accurately: "early iterations of structured student consulting courses documented free-riding and dysfunctional team dynamics before intervention (Rajagopalan et al., 2023)." Do not present as a general indictment of the category.

---

### PARTIAL-4: ConsultingQuest 35% executive satisfaction stat (Claim 17)
**Status:** PARTIAL — wrong page, right stat, wrong attribution
**Finding:** The 35% stat is real but the cited URL does not contain it. The actual source trail: **Source Global Research** → ConsultingQuest → research files. Source Global Research is a legitimate B2B research firm specializing in the consulting industry. The exact phrasing from ConsultingQuest: "According to Source Global Research, only 35% of executives say that the consulting firms they've worked with have added more value than they took in fees."
**Action:** Cite as: "Source Global Research (via ConsultingQuest): only 35% of executives say their consulting firms added more value than they took in fees." Better: go directly to Source Global Research and locate the original report.

---

### PARTIAL-5: ICLR 2025 study — 27% / 20,000 reviews (Claim 26)
**Status:** PARTIAL — minor precision issues
**Finding:** The study is real and strong. Actual figures: 26.6% (rounds to 27% — acceptable), ~18,946 reviews received feedback (rounds to "~20,000" — acceptable). The full study involved ~44,000 total reviews (treatment + control), making "20,000 LLM-generated feedbacks" an understatement of study scale.
**Bonus stat not in research files:** 89% of blinded expert assessments rated AI-revised reviews as higher quality. This is a stronger, more vivid stat than "27% updated."
**Action:** Keep 27% and ~20,000. Add: "89% of blinded expert assessments rated AI-revised reviews as higher quality."

---

### PARTIAL-6: BCG September 2024 study framing (Claim 29)
**Status:** PARTIAL — numbers verified, framing too loose
**Finding:** 480 consultants, 49 percentage point improvement — both confirmed. But the 49pp figure describes a specific data science benchmark: consultants with no programming experience went from 17% to 86% of what a data scientist accomplished in 90 minutes on Python/predictive modeling tasks.
**Action:** Use the more vivid framing: "Consultants with no programming background, using GenAI, achieved 86% of a data scientist benchmark — up from 17% unaided. A 49 percentage point jump." This is more concrete and memorable than "49pp improvement on complex tasks."

---

### PARTIAL-7: FeedbackWriter RCT (Claim 31)
**Status:** PARTIAL — missing key details, omits null finding
**Finding:** N=354, significantly higher-quality revisions, gains increasing with TA adoption — all verified. Missing: Cohen's d = 0.50 (a meaningful, citable effect size). Also omitted: post-test learning outcome scores showed **no significant difference** between conditions — the AI improved revision quality but not downstream learning scores.
**Action:** Add Cohen's d = 0.50. Disclose the null on post-test outcomes — a branch director who reads the paper will find it, so disclosing preemptively is stronger than being caught omitting it.

---

### PARTIAL-8: Bain apprenticeship quote (Claim 35)
**Status:** PARTIAL — paraphrase presented as direct quote
**Finding:** The concept is Bain's and is accurate. But the claimed quote ("All training follows an apprenticeship model — you learn directly from those who have succeeded in your role") is a splice/paraphrase of two separate sentences on the Bain careers page. Actual Bain text: "We operate under an apprenticeship model, so you learn directly from senior leaders."
**Action:** Use the actual quote: *"We operate under an apprenticeship model, so you learn directly from senior leaders."* (Bain.com) — or drop quotation marks and paraphrase clearly.

---

## VERIFIED CLAIMS — Use With Confidence

| # | Claim | Source |
|---|---|---|
| V-1 | 12.2% more tasks, 25.1% faster — BCG/HBS 2023 | Dell'Acqua et al., Org Science 2025 |
| V-2 | ~40% higher quality output — BCG/HBS 2023 | Mollick/HBS summary; paper tables show 30–34% |
| V-3 | 43% quality improvement, bottom-half performers — BCG/HBS 2023 | Mollick (sourced from paper Figure 4) |
| V-4 | 758 BCG consultants, GPT-4 — BCG/HBS 2023 | Dell'Acqua et al. abstract |
| V-5 | 480 consultants, 49pp improvement — BCG Sept 2024 | BCG press release, Sept 5, 2024 |
| V-6 | Tom Spencer 2018 quotes — all 4 attributed quotes | spencertom.com (exact matches) |
| V-7 | OneTenth "twice as many disasters" quote | onetenth.consulting — minor fix: "I've" not "we've" |
| V-8 | McKinsey Lilli: 72% adoption, 100K+ docs, 30% time savings | McKinsey.com firm publications |
| V-9 | McKinsey Embark: "not a lecture series — it's a simulation" | McKinsey.com (confirmed near-verbatim) |
| V-10 | McKinsey Embark: Foundations/Refresher tracks, Day 1 Growth Plan | McKinsey.com (all confirmed) |
| V-11 | arXiv 2601.19053: Cognitive Apprenticeship Model, 6 methods, deeper reasoning | arxiv.org (all details confirmed) |
| V-12 | ERIP model: 22 expert interviews, 600-page transcript, 4 dimensions (Expertise, Relations, Involvement, Performance) | Emerald JBIM 2020 |
| V-13 | CMCE: 57% of clients said coaching client staff was the best way to deliver value | CMCE UK research report |

---

## IMPORTANT ADDITIONS — Upgrade Opportunities

These facts emerged from verification that are **not in the current research files** but strengthen the pitch:

1. **FeedbackWriter Cohen's d = 0.50** — effect size of 50th→70th percentile for revision quality. More precise and harder to dismiss than "significantly higher."

2. **BCG Sept 2024 vivid framing** — "Consultants with no programming background went from 17% → 86% of a data scientist benchmark using GenAI." Far more concrete than "49pp improvement."

3. **ICLR 2025 bonus stat** — "89% of blinded expert assessments rated AI-revised reviews as higher quality." Stronger than the 27% update rate for the pitch.

4. **Source Global Research** — The actual firm behind the 35% client satisfaction stat. A credible B2B research house; citing them directly is stronger than routing through ConsultingQuest.

5. **ERIP model as replacement anchor** — With arXiv 2605.17554 withdrawn, ERIP (peer-reviewed, JBIM 2020) becomes the primary academic citation for consulting quality frameworks. It should be promoted to the role the arXiv paper was playing.

6. **McKinsey Lilli additional stats** — 500,000 prompts/month and 50,000 labor hours recovered monthly, confirmed from McKinsey's own publications. Useful for scale context.

---

## Summary Scorecard

| Category | Count | Items |
|---|---|---|
| VERIFIED | 13 | BCG/HBS core stats, Tom Spencer, Lilli, Embark, ERIP, CMCE, arXiv 2601.19053, OneTenth |
| PARTIAL | 8 | 32%→40% fix, arXiv withdrawn, INFORMS framing, ConsultingQuest source, ICLR precision, BCG Sept framing, FeedbackWriter d, Bain quote |
| FAILED | 4 | $600M McKinsey, PMI/CaseBasix, retention %, 11% top-half |
| STRUCTURAL | 1 | arXiv 2605.17554 withdrawn — replace as academic anchor |

**Bottom line for the pitch:** The BCG/HBS kill-shot stat is solid at ~40% / 43% (drop 32% and 11%). The four failed claims must be removed. The arXiv withdrawal is the biggest structural issue — it removes the "academic backbone" framing, but the pitch survives because the ERIP model, the BCG/HBS study, and the practitioner standards all stand independently.
