# 3D city hero demo — Rotterdam to Delft

A game-like hero section for a future branch website: a stylized low-poly night world containing both home cities, rendered live in hand-written WebGL. Open [index.html](index.html) in any browser — one self-contained 87 KB file, no libraries, no network requests.

What's in the world:

- **Rotterdam:** the Erasmusbrug (cable fan and bent pylon), Euromast, De Rotterdam, the Markthal, the Cube Houses, a skyline of lit towers, and the Nieuwe Maas with moving reflections.
- **Delft:** the Nieuwe Kerk (109 m spire), the leaning Oude Kerk, ~200 gabled canal houses along the canals, the Markt and Stadhuis, and Molen de Roos with turning sails.
- **Between:** polder fields, a canal grid, wind turbines, and the railway — with a glowing train that travels between the cities.

How it behaves:

- A ~75-second cinematic camera tour loops through both cities. Drag to take control (orbit with inertia), scroll or pinch to zoom; after 5 seconds idle the tour smoothly resumes from wherever you left the camera.
- Landmark callouts fade in when the camera is near them (max two at a time, never over the copy).
- Respects `prefers-reduced-motion`, adapts to mobile (copy anchors bottom), falls back to a styled static hero if WebGL is unavailable.

Implementation notes: all 3D is hand-rolled (procedural geometry, GLSL shaders, no Three.js), ~19,700 triangles drawn in 13 draw calls per frame, world geometry uploaded to the GPU once at load. Distances are honest per building (1 unit = 4 m); only the inter-city gap is compressed for composition. Companion piece to the simpler [3d-hero](../3d-hero/) demo, same brand system.
