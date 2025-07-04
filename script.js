// Utility to log both to console and the on-screen #debug
function debugLog(msg) {
  console.log(msg);
  const dbg = document.getElementById('debug');
  if (dbg) dbg.textContent += msg + '\n';
}

// Catch any uncaught errors and display them
window.onerror = function(message, source, lineno, colno, error) {
  debugLog(`❌ Error: ${message} (${source}:${lineno}:${colno})`);
};

// 1) Sanity check
debugLog(`GL: ${typeof GL}, Water: ${typeof Water}, window.onload: ${typeof window.onload}`);

// 2) Capture device tilt as a 2D gravity vector
let tiltX = 0, tiltY = 0;
window.addEventListener('deviceorientation', e => {
  tiltX = (e.gamma  / 90) * 4;   // [-4 .. +4]
  tiltY = -(e.beta  / 90) * 4;   // [-4 .. +4], inverted
});

// 3) Monkey-patch the solver to nudge the water downhill
;(function() {
  if (typeof Water !== 'function') {
    debugLog('❌ Water constructor not found – did water.js load?');
    return;
  }
  const originalStep = Water.prototype.stepSimulation;
  Water.prototype.stepSimulation = function() {
    const dt = this.deltaTime || 0.016;
    const N  = this.width * this.height;
    for (let i = 0; i < N; i++) {
      this.velocity[2*i    ] += tiltX * dt;
      this.velocity[2*i + 1] += tiltY * dt;
    }
    // run default solver twice
    originalStep.call(this);
    originalStep.call(this);
  };
  debugLog('✔️ Water.stepSimulation patched.');
})();

// 4) Force-run the init handler from main.js so we actually see the canvas
if (typeof window.onload === 'function') {
  debugLog('▶️ Invoking main.js init()…');
  window.onload();
} else {
  debugLog('❌ main.js didn’t attach window.onload – the demo will not start.');
}
