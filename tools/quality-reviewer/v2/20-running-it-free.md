# 20. Running it for free: how a team actually gets access

Written 2026-08-05, answering a direct question: GitHub Copilot has a CLI, would that do the
job, and have we actually solved free access for everyone who needs to run the prompt?

**Short answer: yes, Copilot CLI would run it, and it is free for verified students. But cost
was never the barrier. The two real barriers are that swapping the model invalidates every
number we have, and that most free tiers now train on what you paste into them.**

Voice rules apply. Builds on [07-workflow.md](07-workflow.md) section E, which predates the
2026 policy changes below.

---

## 1. The thing nobody checked: this prompt is small

| | tokens |
|---|---|
| System prompt (`frozen-2026-08-05`) | **3,713** |
| Real deck, smallest of nine | 3,197 |
| Real deck, median of nine | ~5,000 |
| Real deck, largest of nine | 20,260 |
| **Typical review, prompt plus deck** | **~8,700 in** |

Measured with `node run-reviews.js --dry-run` against the nine real cases.

A review is **one message**. It is not an agent loop, not a multi-turn conversation and not a
long context problem. Every free tier on the market has a context window many times this.

That reframes the whole question. We have been treating access as a budget problem. It is not.
Nine thousand tokens once per deliverable is inside the free tier of everything, including
tiers that only allow ten messages in five hours. A team reviewing two deliverables a week uses
two messages a week.

## 2. The four routes, and what each actually costs

| route | cost to a student | model they get | trains on your input? | fit |
|---|---|---|---|---|
| **Copilot CLI**, GitHub Student plan | free, verify at education.github.com/pack | Auto mode routing across OpenAI, Anthropic and Google. No hand-picking premium models since 12 Mar 2026 | **yes by default** on Free/Pro/Pro+ since 24 Apr 2026, opt-out exists. Business and Enterprise excluded | good, with two fixes |
| **Claude free** (claude.ai) | free | Sonnet 4.6 | consumer terms, check current setting | best model fit, closest to what was measured |
| **ChatGPT free** | free | 10 GPT-5.5 messages per 5h, then a smaller model | consumer terms | workable, weakest quota shape |
| **Gemini free** | free | 3.5 Flash | consumer terms | workable, least similar to the measured setup |

Quota is a non-issue everywhere. Claude free gives 20 to 30 messages per 8 to 12 hour window,
dropping to around 6 when uploads are large, which is still about five reviews per window.
ChatGPT free gives 10 messages per 5 hours. One review is one message.

## 3. Copilot CLI specifically, since that was the question

**It would do the job, and the mechanism is clean.** Copilot CLI reads `AGENTS.md` from the
repository root as custom instructions, alongside `.github/copilot-instructions.md` and
`CLAUDE.md`. So the reviewer system prompt becomes a file in a repo rather than something a
student pastes:

```
180dc-reviewer/
  AGENTS.md          <- section A of 04-prompt-templates.md, verbatim
  deck.md            <- the sanitized extracted deck text
```

The student clones, drops their deck text in, runs `copilot`, gets the JSON, opens
https://180dc-reviewer.pages.dev and loads it. That is a genuinely better workflow than pasting
a 3,713 token prompt into a chat window every time, and it makes the prompt version auditable
because it is a file under version control with a hash.

**Two things have to be handled.**

**The model.** Since 12 March 2026 the free student plan routes through Auto mode rather than
letting you select Claude Opus or Sonnet or GPT-5.x. Every measurement in this project was made
on Claude Opus 5 at high effort. Auto mode is a different, unknown and possibly varying model.
See section 4.

**The training default.** From 24 April 2026 GitHub uses interaction data from personal Copilot
Free, Pro and Pro+ plans to train its models unless the user opts out. Interaction data is the
prompts and the inputs, which is exactly the deck. Business and Enterprise are excluded. The
opt-out is one setting: profile picture, Copilot settings, "Allow GitHub to use my data for AI
model training", set to Disabled. **This has to be a verified step in onboarding, not a line in
a guide**, because the default is on and the material is client work.

## 4. The barrier that actually matters: substituting the model invalidates the evidence

Everything in [STATUS.md](STATUS.md) and [18-evidence-base.md](18-evidence-base.md) was
measured on Claude Opus 5, high effort, adaptive thinking. That includes the property the tool
is sold on: **blocking rules missed 0%** across roughly thirty reviews (A1). It also includes
the property that makes a finding trustworthy: **no fabricated quote has ever survived to a
scored result** (A2), which is enforced mechanically by `check-review-v2.js` but produced by the
model's discipline.

Run the same prompt on Gemini Flash or on Copilot Auto and none of those numbers describe what
the student is holding. They may be fine. They may be much worse. Nobody has looked.

The specific things a weaker model is likely to break, in order of how much it would matter:

1. **Quote-or-abstain.** A model that paraphrases instead of quoting verbatim fails the
   contract check and the review will not render. That is the good failure mode: the validator
   catches it. But a team hitting it repeatedly will just stop using the tool.
2. **Valid JSON in one shot.** The contract has ten scored dimensions, a computed mean that must
   match to one decimal, and cross-field invariants. Smaller models drift on this.
3. **The synthesis protocol.** Eight steps, nine lenses, a noise budget and a priority order.
   The two newest steps, the reader test and the comparator test, are exactly the kind of
   instruction a weaker model skips.

**This is cheap to settle and the harness already does it.** `run-reviews.js` takes any model,
the nine gold-backed cases exist, and `scorecard.js` produces the comparison. One run of nine
cases on the candidate free-tier model, scored against the same golds, answers it. That is a
known, bounded piece of work, and until someone does it the honest phrasing to a student is
"this was built and tested on Claude Opus, your results on a free tier are unmeasured".

## 5. The other barrier: confidentiality, and it moved in 2026

[07-workflow.md](07-workflow.md) section E already sets the rule and the sanitization protocol:
pseudonymise the client, roles instead of names, band identifying figures, and if a slide
cannot be sanitized then describe it rather than paste it. That protocol is what makes any of
this legal and it is unchanged.

What changed is the default on the other side. Section E was written when the assumption was
that a paid or business tier would not train on input. In 2026 the consumer and individual
tiers of the major services generally do, unless the user turns it off, and GitHub's own change
on 24 April 2026 is the clearest case. So the protocol now needs one more step:

> Before a member reviews anything real, they opt out of model training on whichever service
> they use, and a lead confirms it. Sanitization first, opt-out second. Neither substitutes for
> the other.

Sanitization is the load-bearing control. The opt-out is the backstop for the case where
sanitization was imperfect, which it sometimes will be, because a student in a hurry misses a
logo in a footer.

## 6. What I would actually do

**Recommended: Claude free as the default route, Copilot CLI as the power route.**

Claude free runs Sonnet 4.6, which is the closest available thing to the Opus 5 the tool was
measured on, and it takes file uploads, so a student pastes the prompt once and attaches the
deck. It is the lowest-friction path for someone who is not technical, which is most of a
consulting branch.

Copilot CLI is the better shape for anyone comfortable in a terminal, because `AGENTS.md` makes
the prompt version auditable and removes the paste step entirely. It is free for every verified
student via the Student Developer Pack, which nearly every 180DC member qualifies for.

One practical note on the Claude route: the system prompt is written to be pasted as **Claude
Project instructions**, and Projects may need a paid tier. The free-tier workaround is to paste
section A as the first message of a new conversation and the deck as the second. It costs 3,713
tokens per review, which is nothing, and it works anywhere.

## 7. Next steps, in order of what unblocks what

1. **Run the nine cases on the candidate free-tier model** and score against the existing golds.
   Until this exists, every claim about what a student gets for free is a guess. This is the
   only item here that is real work, and the harness already does it.
2. **Build the `AGENTS.md` repo.** Half an hour. Section A verbatim, a README, a place to drop
   deck text. It also makes the prompt hash checkable by anyone, which the pasting route never
   will be.
3. **Add the training opt-out to onboarding** as a confirmed step with a lead check, alongside
   the existing sanitization protocol.
4. **Write the one-page student guide** once step 1 says which service to point people at. Not
   before, because pointing a branch at a model we have not tested is how the tool gets a
   reputation for being wrong.

---

## Sources

- [GitHub Copilot plans and pricing](https://github.com/features/copilot/plans)
- [Important updates to GitHub Copilot for Students](https://github.com/orgs/community/discussions/189268)
- [Updates to GitHub Copilot interaction data usage policy](https://github.blog/news-insights/company-news/updates-to-github-copilot-interaction-data-usage-policy/)
- [FAQ: Privacy Statement update on Copilot data use for model training (Free/Pro/Pro+)](https://github.com/orgs/community/discussions/188488)
- [Adding custom instructions for GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions)
- [Copilot coding agent now supports AGENTS.md custom instructions](https://github.blog/changelog/2025-08-28-copilot-coding-agent-now-supports-agents-md-custom-instructions/)
- [GitHub Student Developer Pack](https://education.github.com/pack)
- [LLM usage limits 2026 comparison](https://exploreaitogether.com/llm-usage-limits-comparison/)
- [ChatGPT vs Claude vs Gemini, June 2026 plans and limits](https://www.morphllm.com/comparisons/chatgpt-vs-claude-vs-gemini)
