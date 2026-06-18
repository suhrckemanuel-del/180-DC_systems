# Ideas

This is the brainstorming workbench. The next phase of work is more thinking than building, so this space exists to capture directions, connect them and pressure-test them before anything gets built.

The rule here is **diagrams first**. Two people brainstorming need one shared picture, not two long documents.

## How it works

1. **One idea, one card.** Every idea is a small markdown file in [cards/](cards/), made from [templates/idea-template.md](templates/idea-template.md). Keep it short: the idea, why it matters, what it connects to, the open question.
2. **Link everything.** Each card lists what it builds on and what it feeds. Links are how ideas stop being a flat list and start being a graph.
3. **Visualize in one map.** [idea-map.md](idea-map.md) holds the master Mermaid graph. When you add a card, add a node and an edge. The map is the brainstorming surface: open it, see the whole shape, find the gaps.
4. **Track status in the backlog.** [backlog.md](backlog.md) is the flat table: every idea, its stage and its owner.

## Stages

An idea moves through: `spark` (raw) to `shaping` (being defined) to `ready` (clear enough to build or pitch) to `building` to `shipped`, or `parked` if set aside. The stage lives on the card and in the backlog.

## Why Mermaid and markdown

Diagrams render on GitHub, version with the rest of the repo and stay editable as plain text. No binary diagram files, no separate tool, no lock-in. You can edit the map in any editor and see it rendered on push.

## To add an idea

1. Copy [templates/idea-template.md](templates/idea-template.md) to `cards/<short-name>.md` and fill it in.
2. Add a node and at least one edge to [idea-map.md](idea-map.md).
3. Add a row to [backlog.md](backlog.md).

## From idea to branch

When a card reaches `building`, it becomes a branch with the same slug (for example the card `intake-assistant` becomes the branch `idea/intake-assistant`). That keeps the thinking and the code linked. See [../docs/workflow.md](../docs/workflow.md).
