// 1) Sanity-check that the core libs loaded
console.log(
  'GL:',    typeof GL,
  'Water:', typeof Water,
  'initFn:',typeof window.onload
);

// 2) Capture device tilt → a simple 2D gravity vector
let tiltX = 0, tiltY = 0;
window.addEventListener('deviceorientation', e => {
  tiltX = (e.gamma / 90) * 4;     // [-4, +4]
  tiltY = -(e.beta  / 90) * 4;    // inverted front/back
});

// 3) Monkey-patch the solver to nudge the water downhill each frame
;(function() {
  const originalStep = Water.prototype.stepSimulation;
  Water.prototype.stepSimulation = function() {
    const dt = this.deltaTime || 0.016;
    const N  = this.width * this.height;
    for (let i = 0; i < N; i++) {
      this.velocity[2*i    ] += tiltX * dt;
      this.velocity[2*i + 1] += tiltY * dt;
    }
    // run the default solver twice for stability
    originalStep.call(this);
    originalStep.call(this);
  };
})();

// 4) Force-run the init handler from main.js so the canvas appears
if (typeof window.onload === 'function') {
  console.log('▶️ Initializing WebGL Water demo…');
  window.onload();
} else {
  console.error('❌ main.js never attached an onload handler. Check your script URLs.');
}
