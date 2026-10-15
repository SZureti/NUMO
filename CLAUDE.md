# NUMØ development context

Read NUMO.md for the user-provided specification and README.md for implementation details.

The user explicitly chose Three.js for procedural, interactive 3D number morphing. Preserve that choice. Use vanilla HTML/CSS/JavaScript modules with separate shader, rendering, UI, and game logic files. Three.js and fonts are vendored locally. No build step is required.

Never change the inclusive 1–100 range or five valid-attempt limit. Invalid and duplicate guesses cost no attempts. A correct fifth guess wins. All result-dialog close paths reset the round. Test the game logic independently of animation.

Preserve the chartreuse / ultraviolet / near-black design, responsive composition, keyboard controls, native dialogs, live feedback, and reduced-motion behavior. Explain complex code with useful comments.

The live web root is dist/. Run npm test after gameplay changes. The downloadable source bundle flattens dist/ into numo/ for Live Server. Do not include Site credentials or hosting identity in that download.
