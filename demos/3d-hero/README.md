# 3D hero demo — "The Review Pass"

A demo hero section for a future branch website. Open [index.html](index.html) in any browser — it is a single self-contained file with no dependencies and no network requests.

The concept: a 3D lattice of nodes (raw student deliverables) hangs in space, wired to its nearest neighbours. A luminous plane sweeps through it on a loop; nodes it touches ignite from cold slate to teal and push pulses of light along their edges before the lattice cools back to raw. Raw work in, refined insight out — the senior-reviewer pass, rendered literally.

Implementation notes:

- The 3D is hand-rolled on a 2D canvas (rotation + perspective projection), no Three.js or any library, which is why the file works offline and stays small (~33 KB).
- The scene responds to mouse position, respects `prefers-reduced-motion`, and adapts its layout on narrow screens (lattice moves to the top, copy anchors below).
- Draw calls are batched into precomputed brightness tiers, so the frame cost is roughly constant regardless of node count. To change density, adjust the point-count clamp in `resize()`.

Built as an experiment in prompting a frontier model for 3D web design: one detailed creative brief (aesthetic references, interaction requirements, self-containment constraint), one shot, then visual verification in a headless browser.
