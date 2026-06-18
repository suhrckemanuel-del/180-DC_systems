# -*- coding: utf-8 -*-
"""Generates methodology-evidence-base.pdf for the 180DC AI Quality Reviewer:
the methodologies used to make AI deliverables better (why + how) + full cited evidence base,
with source-integrity flags from the verification pass."""
import os
from fpdf import FPDF
from fpdf.enums import XPos, YPos

NX = dict(new_x=XPos.LMARGIN, new_y=YPos.NEXT)
GREEN = (46, 125, 50)
DARK = (28, 28, 28)
GREY = (110, 110, 110)
LINK = (21, 101, 192)
RED = (176, 0, 32)
FONTS = r"C:\Windows\Fonts"


class PDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Arial", "", 8)
        self.set_text_color(*GREY)
        self.cell(0, 8, "180DC AI Quality Reviewer  -  Methodology & Evidence Base", align="L")
        self.cell(0, 8, "Making AI deliverables better", align="R")
        self.ln(10)

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-12)
        self.set_font("Arial", "", 8)
        self.set_text_color(*GREY)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")


def new_pdf():
    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.add_font("Arial", "", os.path.join(FONTS, "arial.ttf"))
    pdf.add_font("Arial", "B", os.path.join(FONTS, "arialbd.ttf"))
    pdf.add_font("Arial", "I", os.path.join(FONTS, "ariali.ttf"))
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.set_margins(18, 16, 18)
    return pdf


def kicker(pdf, text, color=GREEN):
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "B", 9)
    pdf.set_text_color(*color)
    pdf.cell(0, 6, text.upper())
    pdf.ln(7)


def h1(pdf, text):
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "B", 17)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 8, text, **NX)
    pdf.ln(2)


def h2(pdf, text):
    if pdf.get_y() > 250:
        pdf.add_page()
    pdf.set_x(pdf.l_margin)
    pdf.ln(2)
    pdf.set_font("Arial", "B", 12.5)
    pdf.set_text_color(*GREEN)
    pdf.multi_cell(0, 7, text, **NX)
    pdf.ln(1)


def body(pdf, text, size=10):
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "", size)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 5.2, text, **NX)
    pdf.ln(1)


def label(pdf, tag, text, color=GREEN):
    if pdf.get_y() > 262:
        pdf.add_page()
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "B", 9.5)
    pdf.set_text_color(*color)
    pdf.cell(18, 5, tag, new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font("Arial", "", 9.5)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 5, text, **NX)
    pdf.ln(0.5)


def method(pdf, n, title, why, how, refs):
    if pdf.get_y() > 226:
        pdf.add_page()
    pdf.ln(1)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "B", 11)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 6, f"{n}.  {title}", **NX)
    pdf.ln(0.5)
    label(pdf, "Why", why)
    label(pdf, "How", how)
    pdf.set_font("Arial", "", 8.5)
    pdf.set_text_color(*LINK)
    for name, url in refs:
        pdf.set_x(pdf.l_margin)
        if url:
            pdf.multi_cell(0, 4.6, f"  - {name}", link=url, **NX)
        else:
            pdf.set_text_color(*GREY)
            pdf.multi_cell(0, 4.6, f"  - {name}", **NX)
            pdf.set_text_color(*LINK)
    pdf.ln(2)


def ref_list(pdf, theme, items):
    h2(pdf, theme)
    for name, url in items:
        if pdf.get_y() > 268:
            pdf.add_page()
        pdf.set_x(pdf.l_margin)
        pdf.set_font("Arial", "", 9)
        pdf.set_text_color(*DARK)
        pdf.multi_cell(0, 4.8, f"-  {name}", **NX)
        if url:
            pdf.set_x(pdf.l_margin)
            pdf.set_font("Arial", "", 8)
            pdf.set_text_color(*LINK)
            pdf.multi_cell(0, 4.2, f"   {url}", link=url, **NX)
        pdf.ln(0.8)


pdf = new_pdf()

# ---------- COVER ----------
pdf.add_page()
pdf.ln(28)
pdf.set_font("Arial", "B", 9)
pdf.set_text_color(*GREEN)
pdf.cell(0, 6, "180 DEGREES CONSULTING  -  AI QUALITY REVIEWER")
pdf.ln(16)
pdf.set_font("Arial", "B", 28)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 11, "How We Make AI\nDeliverables Better", **NX)
pdf.ln(2)
pdf.set_font("Arial", "", 13)
pdf.set_text_color(*GREY)
pdf.multi_cell(0, 6.5, "The methodologies, the reasons behind them, and the full cited evidence base.", **NX)
pdf.ln(10)
pdf.set_draw_color(*GREEN)
pdf.set_line_width(0.6)
y = pdf.get_y()
pdf.line(18, y, 70, y)
pdf.ln(8)
pdf.set_font("Arial", "", 10.5)
pdf.set_text_color(*DARK)
pdf.multi_cell(0, 5.6,
    "The AI Quality Reviewer holds every 180DC deliverable to a senior-reviewer standard "
    "before the client sees it -- and does it in a way that teaches the consultant, rather "
    "than just correcting them. This document explains the methodologies that make that work "
    "and why each one is there, then lists every source behind them.\n\n"
    "Part 1 highlights the methodologies we use to make deliverables better: for each, WHY we "
    "do it (the problem it solves, the research behind it) and HOW we do it. Part 2 is the full "
    "reference base, grouped by research angle. Part 3 is the source-integrity record -- the "
    "claims an independent verification pass confirmed, corrected, or removed.", **NX)
pdf.ln(7)
pdf.set_font("Arial", "I", 9)
pdf.set_text_color(*GREY)
pdf.multi_cell(0, 5, "Built on four research angles (deliverable anatomy, student failure modes, "
    "professional QA, training & knowledge transfer) plus the system-design research, and an "
    "independent claims-verification pass. Core principle: the reviewer builds the consultant's "
    "skill -- it is a coach, not a ghostwriter.", **NX)

# ---------- PART 1: METHODOLOGIES ----------
pdf.add_page()
kicker(pdf, "Part 1")
h1(pdf, "The methodologies that make deliverables better")
body(pdf, "Each is a deliberate design choice, grounded in how elite firms actually work and in "
    "the research on AI-assisted evaluation and learning. For each: why it is there, and how the "
    "reviewer does it.")
pdf.ln(1)

METHODS = [
 ("Lead-with-the-answer structure (Pyramid Principle, action titles, SCR)",
  "The single most-cited standard for consulting decks: state the conclusion first, every slide title a full insight sentence, narrative following Situation-Complication-Resolution. Student decks default to research-report dumps without it -- the most common structural failure.",
  "The rubric checks each slide title for a claim vs a topic label, runs the 'horizontal flow' test (do the titles alone tell the story?), and checks the deck follows an SCR arc with the resolution carrying the weight.",
  [("The Minto Pyramid Principle: How McKinsey Structures Slides", "https://winningpresentations.com/pyramid-principle-presentations/"),
   ("How to use McKinsey's SCR framework (Slideworks)", "https://slideworks.io/resources/how-to-use-McKinseys-scr-framework-with-examples"),
   ("How to write action titles like McKinsey (Slideworks)", "https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey")]),

 ("Evidence-quality and sourcing as a scored dimension",
  "Evidence quality is the largest divider between strong and weak deliverables, and surface-level secondary research is the defining student failure mode. Clients pay for insight they could not have found themselves.",
  "A criterion checks whether claims are cited and verifiable, whether sources are high-quality, and whether assumptions are made explicit -- exactly the structured, cited synthesis AI is strongest at raising to a baseline.",
  [("Primary Research vs Secondary Research", "https://research.com/research/primary-research-vs-secondary-research"),
   ("ERIP: service-quality model of management consulting (Emerald, JBIM 2020)", "https://www.emerald.com/insight/content/doi/10.1108/JBIM-05-2020-0226/full/html")]),

 ("Recommendation specificity and actionability gate",
  "Generic recommendations that could apply to any company are the most common fatal flaw; only ~35% of executives say consultants added more value than they took in fees. The fix is concrete: named action, owner, timeframe, measurable outcome.",
  "An observable criterion: each recommendation must contain (a) a named action, (b) a responsible party, (c) a timeframe, (d) a measurable outcome -- and is flagged 'could this apply to any company?' if generic.",
  [("The Perfect Consulting Deliverable (David A. Fields)", "https://davidafields.com/the-perfect-consulting-deliverable/"),
   ("The 7 essential rules of writing a good consultancy report", "https://www.flyingsolo.com.au/startup/the-7-essential-rules-of-writing-a-good-consultancy-report/")]),

 ("A quality rubric anchored in ERIP + MBB practitioner standards",
  "We need a defensible, MECE quality framework. (Note: the 2025 arXiv consulting benchmark we first drew the five criteria from was WITHDRAWN -- see Part 3 -- so we anchor on the peer-reviewed ERIP model and practitioner standards instead, and use the criteria as practitioner-grounded, uncited to that paper.)",
  "Dimensions: analytical rigour, evidence & sourcing, insight specificity, narrative structure, relevance & focus, methodology transparency, format & deliverability, client-contextual fit -- each defined as an observable text property, not a judgement call.",
  [("ERIP service-quality model (Emerald, JBIM 2020)", "https://www.emerald.com/insight/content/doi/10.1108/JBIM-05-2020-0226/full/html"),
   ("Consulting Slide Standards: rules MBB follow (Deckary)", "https://deckary.com/blog/consulting-slide-standards")]),

 ("Criterion-specialist, multi-pass evaluation",
  "A single generalist call that scores all criteria at once 'satisfices' -- it spreads attention and under-applies each rubric. Specialist evaluators that each judge one criterion adhere to the rubric far better.",
  "Production runs one API call per criterion in parallel, then a synthesis call aggregates -- and surfaces conflicts between specialist reviewers (structure vs evidence vs craft) so the consultant makes the strategic call.",
  [("Specialists or Generalists? (arXiv 2601.22386)", "https://arxiv.org/abs/2601.22386"),
   ("CritiqueCrew: multi-perspective critique (CHI 2026) -- named method, no canonical link on file", "")]),

 ("Teach-don't-correct output format (principle -> diagnosis -> why -> question -> gated fix)",
  "A tool that just hands over the fix creates dependency. Naming the violated principle transfers a reusable standard; asking the consultant the question BEFORE revealing the fix triggers the generation effect, which is what makes feedback stick.",
  "Every finding is rendered as: the named principle, the specific diagnosis, why it matters, a question -- and only then a fix, hidden behind a click. Max three findings surfaced per pass to avoid overwhelm.",
  [("Deliberate practice & feedback (Ericsson, PubMed)", "https://pubmed.ncbi.nlm.nih.gov/18778378/"),
   ("SafeTutors: pedagogical harm rises when AI rewrites (arXiv 2603.17373)", "https://arxiv.org/abs/2603.17373")]),

 ("Anti-dependency learning loop (graduated fading, multi-turn limit)",
  "The goal is to accelerate student -> practitioner, not to create reliance. Pedagogical-harm rates jump sharply (17.7% -> 77.8%) when an AI tutor slides into doing the work. Scaffolding should fade as competence grows (Vygotsky's ZPD).",
  "The reviewer tracks which principles a consultant has already been flagged for and reduces explanation on repeat exposure; it refuses to rewrite slides ('what would a fix look like if you applied the principle?'); and it asks a pre-submission self-assessment first.",
  [("AI scaffolding and the Zone of Proximal Development", "https://elearningindustry.com/the-esl-id-edge-ai-scaffolding-and-the-zone-of-proximal-development"),
   ("Cognitive Apprenticeship Model with LLMs (arXiv 2601.19053)", "https://arxiv.org/abs/2601.19053"),
   ("SafeTutors (arXiv 2603.17373)", "https://arxiv.org/abs/2603.17373")]),

 ("Evaluation-reliability methods (observable criteria, anchor examples, G-Eval, sandwich prompt)",
  "Without score-anchor examples an LLM judge defaults to '3 for everything'; instructions buried mid-context lose ~30% effectiveness ('lost in the middle'). Reliability is engineered, not assumed.",
  "Every criterion is an observable text property with 3 written anchors (what a 1, 3, 5 looks like) and 4-6 explicit G-Eval sub-steps; the rubric sits at the TOP and BOTTOM of the prompt with the document in the middle.",
  [("Leveraging LLM Feedback to Enhance Review Quality (ICLR 2025)", "https://blog.iclr.cc/2025/04/15/leveraging-llm-feedback-to-enhance-review-quality/"),
   ("G-Eval / 'lost in the middle' / score-anchoring -- named methods, no canonical link on file", "")]),

 ("Human-in-the-loop adoption and QA rhythm",
  "Professional quality is a review hierarchy plus iterative storyboard reviews, not a separate QA team. And adoption collapses within weeks if team leads bypass the tool -- so the lead must visibly use it first.",
  "The reviewer fires at three points (week-2 draft, pre-submission QA, on-demand); team leads run the QA pass through it first; and it borrows the 'obligation to dissent' stance -- it is built to challenge, never to rubber-stamp.",
  [("Into all problem-solving, a little dissent must fall (McKinsey)", "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/into-all-problem-solving-a-little-dissent-must-fall"),
   ("What an Engagement Manager at McKinsey does (CaseBasix)", "https://www.casebasix.com/pages/what-does-an-engagement-manager-at-mckinsey-do"),
   ("Engagement Quality Reviewer standard (PCAOB AS 1220)", "https://pcaobus.org/oversight/standards/auditing-standards/details/AS1220")]),

 ("Grounded in evidence that AI lifts deliverable quality -- most for the weakest",
  "The premise itself is evidenced. In a 758-consultant BCG/HBS trial, AI-assisted work was ~40% higher quality, and the bottom-half performers improved 43% -- AI is a skill equaliser. The right comparison for 180DC is not 'AI vs a McKinsey partner' but 'AI vs no substantive feedback'.",
  "The reviewer targets exactly the gap the research identifies -- structure, evidence, specificity -- to pull bottom-quartile deliverables toward the standard the best teams already hit.",
  [("Navigating the Jagged Technological Frontier (HBS, Dell'Acqua et al. 2023)", "https://www.hbs.edu/faculty/Pages/item.aspx?num=64700"),
   ("Field experiment, published version (Organization Science 2025)", "https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838"),
   ("GenAI for knowledge workers: 17% -> 86% of a data-scientist benchmark (BCG, Sept 2024)", "https://www.bcg.com/press/5september2024-generative-ai-knowledge-workers-consultants")]),

 ("Institutional-memory layer (V3: RAG over exemplary deliverables)",
  "McKinsey's Lilli shows that on-demand access to accumulated, quality-approved work IS training infrastructure -- a junior immediately performs higher. This is the long-term moat once the tool is trusted.",
  "A future version retrieves from 180DC's best past deliverables so findings can say 'the strongest deliverables on similar projects used approach X' -- branch knowledge, on tap.",
  [("Meet Lilli, our generative AI tool (McKinsey)", "https://www.mckinsey.com/about-us/new-at-mckinsey-blog/meet-lilli-our-generative-ai-tool"),
   ("Knowledge management in large consulting firms (Document360)", "https://document360.com/blog/knowledge-management-in-large-consulting-firms/")]),
]

for i, (t, why, how, refs) in enumerate(METHODS, 1):
    method(pdf, i, t, why, how, refs)

# ---------- PART 2: REFERENCES ----------
pdf.add_page()
kicker(pdf, "Part 2")
h1(pdf, "Complete reference base")
body(pdf, "Every source behind the methodologies, grouped by research angle. Sources flagged in "
    "Part 3 are marked there; the unsupported ones have been left out of this list by design.")

THEMES = [
 ("1 -- Anatomy of an excellent consulting deliverable", [
    ("The Minto Pyramid Principle: How McKinsey Structures Slides", "https://winningpresentations.com/pyramid-principle-presentations/"),
    ("Consulting Slide Standards: Rules MBB Follow (Deckary)", "https://deckary.com/blog/consulting-slide-standards"),
    ("The Pyramid Principle - Consulting Toolbox (Slideworks)", "https://slideworks.io/resources/the-pyramid-principle-mckinsey-toolbox-with-examples"),
    ("How McKinsey Consultants Make Presentations (Slideworks)", "https://slideworks.io/resources/how-mckinsey-consultants-make-presentations"),
    ("McKinsey Presentation Structure (SlideModel)", "https://slidemodel.com/mckinsey-presentation-structure/"),
    ("MBB Slide Design & Structure Guide (Deckary)", "https://deckary.com/blog/pillar-consulting-presentations-guide"),
    ("How to use the SCR framework (Slideworks)", "https://slideworks.io/resources/how-to-use-McKinseys-scr-framework-with-examples"),
    ("McKinsey SCR Framework (ManagementConsulted)", "https://managementconsulted.com/mckinsey-scr-framework/"),
    ("Situation-Complication-Resolution Framework (Stratechi)", "https://www.stratechi.com/situation-complication-resolution-scr-framework/"),
    ("What Your Consulting Effort is Worth to Clients (David A. Fields)", "https://www.davidafields.com/what-your-consulting-effort-is-worth-to-clients-a-surprising-analysis/"),
    ("The Perfect Consulting Deliverable (David A. Fields)", "https://davidafields.com/the-perfect-consulting-deliverable/"),
    ("The 7 essential rules of writing a good consultancy report", "https://www.flyingsolo.com.au/startup/the-7-essential-rules-of-writing-a-good-consultancy-report/"),
    ("Better consulting reports in 10 steps", "https://www.writing-skills.com/knowledge-hub/better-consulting-reports-in-10-steps/"),
    ("Consulting Report Template (Consulting Success)", "https://www.consultingsuccess.com/consulting-report-template"),
    ("Primary Research vs Secondary Research", "https://research.com/research/primary-research-vs-secondary-research"),
    ("ERIP service-quality model (Emerald, JBIM 2020)", "https://www.emerald.com/insight/content/doi/10.1108/JBIM-05-2020-0226/full/html"),
    ("ERIP model (ResearchGate abstract)", "https://www.researchgate.net/publication/347063018_ERIP_service_quality_model_of_management_consulting_projects"),
    ("CMCE Consultant Value Add research report", "https://www.cmce.org.uk/article/research-report-consultant-value-add-maximising-value-your-management-consultant"),
    ("CMCE Management Consultant Value Report", "https://www.cmce.org.uk/knowledge-bank/cmce-management-consultant-value-report"),
    ("CMCE Roundtable: Excellence in Consulting", "https://cmce.org.uk/knowledge-bank/cmce-roundtable-discussion-excellence-consulting"),
    ("Consulting Is More Than Giving Advice (HBR, Turner 1982)", "https://hbr.org/1982/09/consulting-is-more-than-giving-advice"),
    ("A Conceptual Framework for Analyzing Quality Gaps in Consulting (UJM 2016)", "https://www.hrpub.org/download/20160630/UJM1-12104214.pdf"),
    ("Managing Quality in Management Consulting (ResearchGate)", "https://www.researchgate.net/publication/343111050_Managing_Quality_in_Management_Consulting"),
    ("Perspectives on Quality Assurance in Management Consulting (ResearchGate)", "https://www.researchgate.net/publication/361278042_Perspectives_on_Quality_and_Quality_Assurance_in_the_Management_Consulting_Sector"),
    ("180 Degrees Consulting USC (client testimonials)", "https://www.180degreesusc.org/"),
    ("How To Evaluate The Quality Of A Consultant? (Consulting Quest)", "https://consultingquest.com/podcasts_smcs/quality-of-a-consultant/"),
 ]),
 ("2 -- Failure modes in student / pro-bono consulting", [
    ("Student Consulting -- Does it deliver? (Tom Spencer, 2018)", "https://www.spencertom.com/2018/06/24/student-consulting-does-it-deliver/"),
    ("Why are some consulting projects so unsuccessful? (Tom Spencer, 2020)", "https://www.spencertom.com/2020/08/09/why-are-some-consulting-projects-so-unsuccessful/"),
    ("180 Degrees Consulting -- Our Services", "https://www.180dc.org/our-services"),
    ("Glassdoor reviews of 180 Degree Consulting", "https://www.glassdoor.com/Reviews/180-Degree-Consulting-Reviews-E581682.htm"),
    ("How Consultants Shape Nonprofits (Reisman, SSIR / Stanford UP 2024)", "https://ssir.org/books/excerpts/entry/how-consultants-shape-nonprofits-leah-reisman"),
    ("To Pro Bono or Not Pro Bono (OneTenth Consulting, 2020)", "https://onetenth.consulting/blog/2020/4/26/to-pro-bono-or-not-pro-bono-a-nonprofit-technology-managers-conundrum"),
    ("Why Management Consulting Projects Fail (CaseBasix)", "https://www.casebasix.com/pages/why-management-consulting-projects-fail"),
    ("Common Mistakes Using Consulting Frameworks (CaseBasix)", "https://www.casebasix.com/pages/consulting-framework-mistakes"),
    ("An Agile Approach to Student Consulting Projects (INFORMS TE 2023)", "https://pubsonline.informs.org/doi/10.1287/ited.2023.0057"),
    ("Project Management for Consulting Success (ConsultingQuest)", "https://consultingquest.com/insights/project-management-for-consulting-success/"),
    ("Getting Pro Bono Help (Consulting Within Reach)", "https://www.consultingwithinreach.com/blog/23-getting_pro_bono_help/view"),
    ("The Pyramid Principle: How Consultants Structure Arguments (Deckary)", "https://deckary.com/blog/pyramid-principle-consulting"),
    ("Project Partners Must Have Skin in the Game (ClearBox)", "https://www.clearbox.co.uk/project-partners-must-have-skin-in-the-game/"),
    ("The Ultimate Guide to Scoping (StrategyU)", "https://strategyu.co/scoping-in-consulting/"),
 ]),
 ("3 -- Quality assurance in professional firms", [
    ("Decoding High Performance at McKinsey (StrategyU)", "https://strategyu.co/decoding-high-performance-mckinsey-company/"),
    ("Into all problem-solving, a little dissent must fall (McKinsey)", "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/into-all-problem-solving-a-little-dissent-must-fall"),
    ("What an Engagement Manager at McKinsey does (CaseBasix)", "https://www.casebasix.com/pages/what-does-an-engagement-manager-at-mckinsey-do"),
    ("What a McKinsey Partner does (Hacking the Case Interview)", "https://www.hackingthecaseinterview.com/pages/mckinsey-partner"),
    ("How to write action titles like McKinsey (Slideworks)", "https://slideworks.io/resources/how-to-write-action-titles-like-mckinsey"),
    ("Engagement Quality Reviewer standard (PCAOB AS 1220)", "https://pcaobus.org/oversight/standards/auditing-standards/details/AS1220"),
    ("Engagement Quality Reviews: what auditors should know (Journal of Accountancy)", "https://www.journalofaccountancy.com/news/2024/dec/engagement-quality-reviews-what-auditors-should-know/"),
    ("Knowledge Management in Large Consulting Firms (Document360)", "https://document360.com/blog/knowledge-management-in-large-consulting-firms/"),
    ("Embracing Apprenticeship as a Way of Life (McKinsey)", "https://www.mckinsey.com/featured-insights/people-in-progress/embracing-apprenticeship-as-a-way-of-life-a-new-definition-for-an-old-idea"),
    ("McKinsey's AI tooling / Lilli context (StrategyU)", "https://strategyu.co/mckinsey-ai/"),
    ("Consulting Deliverables (TCGen)", "https://www.tcgen.com/product-management/consulting-deliverables/"),
    ("LLM Feedback Improves Review Specificity & Actionability (arXiv 2504.09737)", "https://arxiv.org/abs/2504.09737"),
    ("Leveraging LLM Feedback to Enhance Review Quality (ICLR 2025)", "https://blog.iclr.cc/2025/04/15/leveraging-llm-feedback-to-enhance-review-quality/"),
 ]),
 ("4 -- Training, knowledge transfer & AI quality uplift", [
    ("From Orientation to Impact: rethinking onboarding / Embark (McKinsey)", "https://www.mckinsey.com/featured-insights/people-in-progress/from-orientation-to-impact-rethinking-how-we-prepare-new-hires"),
    ("Learning & Development -- apprenticeship model (Bain)", "https://www.bain.com/careers/life-at-bain/supporting-your-growth/learning-development/"),
    ("Navigating the Jagged Technological Frontier (HBS, 2023)", "https://www.hbs.edu/faculty/Pages/item.aspx?num=64700"),
    ("Jagged Frontier field experiment (Organization Science 2025)", "https://pubsonline.informs.org/doi/10.1287/orsc.2025.21838"),
    ("GenAI for Knowledge Workers & Consultants (BCG, Sept 2024)", "https://www.bcg.com/press/5september2024-generative-ai-knowledge-workers-consultants"),
    ("Deliberate Practice and Expert Performance (Ericsson, PubMed)", "https://pubmed.ncbi.nlm.nih.gov/18778378/"),
    ("Deliberate Practice (Ericsson, PMC full text)", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6824411/"),
    ("AI feedback improves writing revisions -- FeedbackWriter RCT (arXiv 2602.16820)", "https://arxiv.org/html/2602.16820"),
    ("AI-mediated feedback RCT (PMC12109289)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12109289/"),
    ("Cognitive Apprenticeship Model with LLMs (arXiv 2601.19053)", "https://arxiv.org/abs/2601.19053"),
    ("Meet Lilli, our generative AI tool (McKinsey)", "https://www.mckinsey.com/about-us/new-at-mckinsey-blog/meet-lilli-our-generative-ai-tool"),
    ("AI Scaffolding and the Zone of Proximal Development (eLearning Industry)", "https://elearningindustry.com/the-esl-id-edge-ai-scaffolding-and-the-zone-of-proximal-development"),
 ]),
 ("5 -- AI evaluation architecture & build methods", [
    ("Specialists or Generalists? Criterion-specialist evaluation (arXiv 2601.22386)", "https://arxiv.org/abs/2601.22386"),
    ("SafeTutors: pedagogical harm in extended AI tutoring (arXiv 2603.17373)", "https://arxiv.org/abs/2603.17373"),
    ("LLM Feedback to Enhance Review Quality (arXiv 2504.09737)", "https://arxiv.org/abs/2504.09737"),
    ("CritiqueCrew: multi-perspective critique (CHI 2026) -- named method, no canonical link on file", ""),
    ("G-Eval, score-anchoring, 'lost in the middle' -- named prompt-reliability methods, no canonical link on file", ""),
 ]),
]

for theme, items in THEMES:
    ref_list(pdf, theme, items)

# ---------- PART 3: SOURCE INTEGRITY ----------
pdf.add_page()
kicker(pdf, "Part 3", RED)
h1(pdf, "Source integrity -- what we verified, fixed, and removed")
body(pdf, "Before any pitch, an independent pass (one extractor agent, then four verifier agents, "
    "no agent checking its own work) tested 37 claims across the research: 13 verified, 8 partial, "
    "4 failed, 1 withdrawn. Including this is what makes the evidence base safe to stand behind.")

h2(pdf, "Removed -- do not cite or quote")
for t in [
    "arXiv 2605.17554 (the 2025 consulting-deliverable benchmark) was WITHDRAWN on 2026-05-30. We no longer cite it; the five rubric criteria are used as practitioner-grounded and anchored on ERIP instead.",
    "'McKinsey invests $600M+ annually in knowledge development' -- unsupported; the only matching figure is an unrelated legal settlement. Dropped.",
    "'Over a third of projects fail due to poor problem definition' (attributed to PMI via CaseBasix) -- dead citation chain; the real PMI figures concern requirements management. Dropped.",
    "'Bolt-on training retains 20-40% vs embedded 70-90%' -- traces only to a marketing blog with no study behind it. Dropped.",
    "'Top-half performers improved 11%' in the BCG/HBS study -- no source gives this number. Dropped (keep the verified 43% bottom-half figure).",
]:
    label(pdf, "Drop", t, RED)

h2(pdf, "Corrected -- use the right version")
for t in [
    "Quality uplift: use '~40% higher quality' (the figure the research community cites; paper tables show 30-34%). Do NOT use 32%.",
    "BCG Sept 2024: frame as 'no-programming consultants reached 86% of a data-scientist benchmark, up from 17%' -- more concrete than '49pp'.",
    "The 35% executive-value stat: attribute to Source Global Research (via ConsultingQuest), not ConsultingQuest alone.",
    "Bain quote: 'We operate under an apprenticeship model, so you learn directly from senior leaders.' (use the actual wording).",
    "INFORMS free-riding: cite as a problem in an EARLY course iteration that was then fixed -- not a general indictment of student consulting.",
]:
    label(pdf, "Fix", t)

h2(pdf, "Verified -- stand behind these")
for t in [
    "BCG/HBS 2023 (758 consultants): 12.2% more tasks, 25.1% faster, ~40% higher quality; 43% improvement for bottom-half performers.",
    "BCG Sept 2024 (480 consultants): 17% -> 86% of a data-scientist benchmark using GenAI.",
    "ERIP model: 22 expert interviews, 600-page transcript, four dimensions (Expertise, Relations, Involvement, Performance). Peer-reviewed -- now the primary academic anchor.",
    "McKinsey Lilli: 72% adoption, 100k+ documents, ~30% time saving on research & synthesis.",
    "ICLR 2025 review study: ~27% of reviewers updated their work; 89% of blinded experts rated AI-revised reviews higher quality.",
    "Tom Spencer (2018) student-consulting critiques; OneTenth 'twice as many disasters'; CMCE 57% value-from-coaching finding.",
]:
    label(pdf, "Use", t)

# ---------- APPENDIX ----------
pdf.add_page()
kicker(pdf, "Appendix")
h1(pdf, "Source documents in this folder")
docs = [
    ("research/01-deliverable-quality-anatomy/findings.md", "What makes an excellent consulting deliverable -- 10 findings + 8 quality dimensions."),
    ("research/02-failure-modes-student-consulting/findings.md", "How student/pro-bono deliverables fail -- failure taxonomy + root causes."),
    ("research/04-quality-assurance-professional-services/findings.md", "How MBB / Big 4 enforce quality -- QA mechanisms catalogue + what transfers to 180DC."),
    ("research/05-training-and-knowledge-transfer/findings.md", "How firms build skill -- apprenticeship, deliberate practice, AI as equaliser."),
    ("research/system-vision-brief.md", "The AI Quality Reviewer design: architecture, output format, learning loop, build plan."),
    ("research/verification-report.md", "The independent claims-verification pass that Part 3 summarises."),
]
for name, desc in docs:
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "B", 10)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 5.4, name, **NX)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("Arial", "", 9.5)
    pdf.set_text_color(*GREY)
    pdf.multi_cell(0, 5, desc, **NX)
    pdf.ln(1.5)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "methodology-evidence-base.pdf")
pdf.output(out)
print("Wrote", out)
