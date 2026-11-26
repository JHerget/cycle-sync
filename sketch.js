/* p5.js instance mode keeps the animation separate from the page controls. */
const countInput = document.getElementById('arc-count');
const countOutput = document.getElementById('arc-count-value');
const speedInput = document.getElementById('speed');
const speedOutput = document.getElementById('speed-value');
const pauseButton = document.getElementById('pause');
const container = document.getElementById('canvas-container');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let arcCount = Number(countInput.value);
let speedMultiplier = Number(speedInput.value);
let paused = reducedMotion.matches;

function updatePauseButton() {
  pauseButton.textContent = paused ? 'Resume animation' : 'Pause animation';
  pauseButton.setAttribute('aria-pressed', String(paused));
}

updatePauseButton();

if (typeof window.p5 !== 'function') {
  document.getElementById('load-error').hidden = false;
} else {
  new p5((p) => {
    let elapsed = 0;
    const colors = ['#76e4d2', '#86bfff', '#c1a0ff', '#ffadcd', '#ffd18a'];

    p.setup = () => {
      const size = Math.floor(container.clientWidth);
      p.createCanvas(size, size).parent(container);
      p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
      p.noFill();
      p.strokeCap(p.ROUND);
      if (paused) p.noLoop();
    };

    p.draw = () => {
      // Clamp long gaps so switching tabs doesn't cause a sudden jump.
      if (!paused) elapsed += Math.min(p.deltaTime, 100) / 1000 * speedMultiplier;
      p.background('#0b1018');
      p.translate(p.width / 2, p.height / 2);

      const outerRadius = p.width * 0.43;
      const innerRadius = p.width * 0.13;
      const spacing = (outerRadius - innerRadius) / Math.max(arcCount - 1, 1);
      const thickness = Math.min(p.width * 0.018, spacing * 0.45);

      // A quiet outer boundary holds the concentric motion together.
      p.stroke('#263244');
      p.strokeWeight(1);
      p.circle(0, 0, p.width * 0.94);

      for (let i = 0; i < arcCount; i += 1) {
        const radius = outerRadius - i * spacing;
        const speed = 0.18 + i * 0.085;
        const start = (elapsed * speed + i * 1.38) % p.TWO_PI;
        const length = p.PI * (0.65 + ((i * 0.37) % 1));

        p.stroke('#182332');
        p.strokeWeight(1);
        p.circle(0, 0, radius * 2);

        p.stroke(colors[i % colors.length]);
        p.strokeWeight(thickness);
        p.arc(0, 0, radius * 2, radius * 2, start, start + length);
      }
    };

    countInput.addEventListener('input', () => {
      arcCount = Number(countInput.value);
      countOutput.value = String(arcCount);
      if (paused) p.redraw();
    });

    speedInput.addEventListener('input', () => {
      speedMultiplier = Number(speedInput.value);
      speedOutput.value = `${speedMultiplier.toFixed(1)}×`;
      speedInput.setAttribute('aria-valuetext', `${speedMultiplier.toFixed(1)} times normal speed`);
    });

    pauseButton.addEventListener('click', () => {
      paused = !paused;
      updatePauseButton();
      if (paused) p.noLoop();
      else p.loop();
    });

    p.windowResized = () => {
      const size = Math.floor(container.clientWidth);
      p.resizeCanvas(size, size);
    };
  });
}
