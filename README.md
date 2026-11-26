# Cycle Sync

A small HTML5 canvas animation built with p5.js. Open `index.html` in a browser; no build or installation is needed. An internet connection is required to load the pinned p5.js dependency from jsDelivr.

The canvas starts with three concentric arcs. Use the slider below it to select 1–10 arcs. Each arc has its own length and rotation speed. The layout resizes to fit the screen, and the pause button stops or resumes the animation. If your system requests reduced motion, it starts paused.

The speed slider adjusts all arcs together from 0× (stationary) to 5×, starting at 1×. Changes preserve the arcs' current positions and relative speeds.

Files:
- `index.html` — page and controls
- `style.css` — layout and colors
- `sketch.js` — p5.js animation and interaction

p5.js reference: https://p5js.org/reference/p5/arc/
