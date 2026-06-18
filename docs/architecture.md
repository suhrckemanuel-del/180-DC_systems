# Architecture

How the pieces fit, and the one design pattern they share.

## System map

```mermaid
flowchart TB
  MANDATE([Branch AI mandate:<br/>quality, speed, teaching])
  RESEARCH[(Research evidence base)]

  subgraph TOOLS [Tools]
    QR[Quality Reviewer]
    HR[HR Screener]
    DT[Deck Transform]
  end

  MANDATE --> QR
  MANDATE --> HR
  MANDATE --> DT
  RESEARCH --> QR
  RESEARCH --> HR
  QR -. teaches .-> CONSULTANT([Consultant learns the principle])
```

## The shared pattern: a deterministic contract

Every tool keeps the model smart and the renderer dumb. The model returns one structured object. A static template owns every pixel. They only meet through a schema, so the output is auditable and stable run to run.

```mermaid
flowchart LR
  D[Deliverable as text<br/>one block per slide] --> M[Reviewer model<br/>SYSTEM-PROMPT]
  M -->|one JSON object| S[(Schema contract)]
  S --> V{check-review.js<br/>validates}
  V -->|valid| R[Static renderer<br/>index.html]
  V -->|invalid| E[Clear error list,<br/>never a broken UI]
  R --> TL[Team Lead Mode:<br/>scorecard + timeline]
  R --> ST[Student Mode:<br/>coaching + gated fix]
```

## Quality Reviewer in detail

The five criteria, scored as binary checks, in diagnostic priority order:

```mermaid
flowchart TD
  subgraph SCAN [Diagnostic priority order]
    C1[1. Internal contradiction]
    C2[2. Missing or late governing insight]
    C3[3. Recommendations without a decision]
    C4[4. Ungrounded headline numbers]
    C5[5. QA artifacts]
  end
  C1 --> PICK[Pick top three findings,<br/>severity sorted]
  C2 --> PICK
  C3 --> PICK
  C4 --> PICK
  C5 --> PICK
  PICK --> GATE[Each fix locks behind<br/>the consultant's own attempt]
```

Score per criterion = 1 + 4 times checksPassed / checksTotal. Overall is the mean to one decimal. Verdict is Needs revision if any criterion fails, Minor revision if all pass or partial with at least one partial, Ready only if all pass.

## Where the diagrams live

This repo uses Mermaid in markdown so diagrams render directly on GitHub, version with the code and stay editable in plain text. The brainstorming map in [../ideas/idea-map.md](../ideas/idea-map.md) uses the same approach.
