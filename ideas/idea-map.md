# Idea map

The shared brainstorming surface. Every box is an idea or a piece of work. Every arrow is a dependency or a feeds-into. Edit the graph as the thinking moves. This is meant to be messy and alive, not final.

Legend: solid nodes are shipped or built, dashed thinking is open. Colors group by theme.

```mermaid
graph TD
  MISSION([Mission:<br/>every deliverable MBB-grade<br/>and the consultant learns why]):::mission

  %% --- Built ---
  QR[Quality Reviewer<br/>flagship, working]:::built
  HR[HR Screener<br/>designed, gated]:::built
  DT[Deck Transform<br/>methodology]:::built

  %% --- Foundation ---
  RES[(Research evidence base)]:::found
  TRUST{{Trust thesis:<br/>why teams adopt AI}}:::found

  %% --- Open directions (brainstorm here) ---
  V2[Reviewer V2:<br/>verifier pass + self-consistency]:::open
  GOLD[Golden-set calibration:<br/>~10 labelled decks]:::open
  WORKSHOP[AI workshop curriculum<br/>for the branch]:::open
  INTAKE[Client intake assistant?]:::open
  SCOPE[Scoping / proposal helper?]:::open
  PORTFOLIO[Branch portfolio site<br/>from this repo?]:::open

  TRUST --> MISSION
  RES --> QR
  RES --> HR
  MISSION --> QR
  MISSION --> HR
  MISSION --> DT
  MISSION --> WORKSHOP

  QR --> V2
  V2 --> GOLD
  QR -. shares the deterministic-contract pattern .-> HR
  QR -. shares the renderer pattern .-> PORTFOLIO
  WORKSHOP -. teaches .-> QR
  MISSION -.-> INTAKE
  INTAKE -.-> SCOPE

  classDef mission fill:#0F8455,color:#fff,stroke:#0F8455;
  classDef built fill:#E8F6EF,stroke:#16A66A,color:#111;
  classDef found fill:#F1FAF5,stroke:#6e7378,color:#111;
  classDef open fill:#FDF4E3,stroke:#E8910C,color:#111,stroke-dasharray: 4 3;
```

## Reading the map

- **Built (green):** the three tools that exist today.
- **Foundation (grey):** the research base and the trust thesis that everything sits on.
- **Open (amber, dashed):** directions to brainstorm. These are spark or shaping stage, not commitments.

## Prompts for the next session

- Which open node has the highest leverage for the branch this term, not for us.
- What is missing from the map entirely. What problem is no one naming.
- Which built tool would benefit most from the next unit of effort.
- Where does the trust thesis change what we should build first.
