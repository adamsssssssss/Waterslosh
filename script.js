// Utility: log to console AND on-screen #debug
function debugLog(msg) {
  console.log(msg);
  const dbg = document.getElementById('debug');
  if (dbg) dbg.textContent += msg + '\n';
}

// Catch uncaught errors
window.onerror = function(message, source, lineno, colno) {
  debugLog(`❌ Error: ${message} (${source}:${lineno}:${colno})`);
};

// 1) Sanity-check core libs
debugLog(`GL: ${typeof GL}, Water: ${typeof Water}, window.onload: ${typeof window.onload}`);

// 2) Capture device tilt → gravity vector
let tiltX = 0, tiltY = 0;
window.addEventListener('deviceorientation', e => {
  tiltX = (e.gamma  / 90) * 4;  // left/right tilt [-4..4]
  tiltY = -(e.beta / 90) * 4;   // front/back tilt [-4..4], inverted
});

// 3) Monkey-patch the solver to nudge water downhill each frame
;(function() {
  if (typeof Water !== 'function') {
    debugLog('❌ Water constructor not found – water.js didn’t load?');
    return;
  }
  const origStep = Water.prototype.stepSimulation;
  Water.prototype.stepSimulation = function() {
    const dt = this.deltaTime || 0.016;
    const N  = this.width * this.height;
    for (let i = 0; i < N; i++) {
      this.velocity[2*i    ] += tiltX * dt;
      this.velocity[2*i + 1] += tiltY * dt;
    }
    // run original solver twice for stability
    origStep.call(this);
    origStep.call(this);
  };
  debugLog('✔️ Patched Water.stepSimulation');
})();

// 4) Force-run main.js init() so the canvas is created
if (typeof window.onload === 'function') {
  debugLog('▶️ Invoking main.js init()…');
  window.onload();
} else {
  debugLog('❌ main.js init not found – check script URLs');
}
