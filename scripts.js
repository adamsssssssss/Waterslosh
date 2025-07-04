document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const canvas = document.getElementById('glcanvas');
    const startPrompt = document.getElementById('start-prompt');
    const startButton = document.getElementById('start-button');
    const promptText = document.getElementById('prompt-text');

    let fluid = null;

    const config = {
        SIM_RESOLUTION: 128, DYE_RESOLUTION: 1024, CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1, VELOCITY_DISSIPATION: 0.3, PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20, CURL: 30, SPLAT_RADIUS: 0.3, SPLAT_FORCE: 6000,
        SHADING: true, COLORFUL: true, COLOR_UPDATE_SPEED: 10, PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 }, TRANSPARENT: false, BLOOM: true,
        BLOOM_ITERATIONS: 8, BLOOM_RESOLUTION: 256, BLOOM_INTENSITY: 0.6,
        BLOOM_THRESHOLD: 0.6, BLOOM_SOFT_KNEE: 0.7, SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196, SUNRAYS_WEIGHT: 0.8,
    };

    // This is the animation loop. It runs on every frame.
    function animate() {
        if (fluid) {
            fluid.step(); // This crucial line updates and draws the simulation
        }
        requestAnimationFrame(animate); // Request the next frame
    }

    // This function sets up and runs the simulation.
    function initializeAndRunSimulation() {
        startPrompt.style.opacity = '0';
        setTimeout(() => { startPrompt.style.display = 'none'; }, 500);

        // *** THE FINAL FIX IS HERE ***
        // The library call should be webglFluid(), not webglFluid.default()
        fluid = webglFluid(canvas, config);

        addInitialFluid();

        window.addEventListener('devicemotion', handleDeviceMotion);
        canvas.addEventListener('mousemove', handleMouseMove);
        
        // Kick off the animation loop
        animate();
    }
    
    // This function adds the initial pool of "water"
    function addInitialFluid() {
        const amount = 20;
        const color = { r: 0.1, g: 0.4, b: 1.0 };
        for (let i = 0; i < amount; i++) {
            fluid.splat(Math.random(), Math.random() * 0.25, 0, 0, color, 2.0);
        }
    }

    // This function applies force based on the phone's tilt
    function handleDeviceMotion(event) {
        if (!fluid) return;
        const accel = event.accelerationIncludingGravity;
        if (!accel || accel.x === null) return;
        
        const forceX = accel.x * 150;
        const forceY = accel.y * -150;
        
        fluid.splat(0.5, 0.5, forceX, forceY, { r: 0, g: 0, b: 0 }, 5.0);
    }
    
    // Fallback for desktop testing
    function handleMouseMove(e) {
        if (!fluid) return;
        fluid.splat( e.clientX / window.innerWidth, 1.0 - (e.clientY / window.innerHeight), e.movementX * 2, -e.movementY * 2, {r:1, g:1, b:1}, 0.5 );
    }

    // Main event listener for the start button
    startButton.addEventListener('click', async () => {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState === 'granted') {
                    initializeAndRunSimulation();
                } else {
                    promptText.textContent = "Sensor access was denied. This experience cannot continue.";
                    startButton.style.display = 'none';
                }
            } catch (error) {
                console.error(error);
                promptText.textContent = "An error occurred while requesting sensor access.";
            }
        } else {
            initializeAndRunSimulation();
        }
    }, { once: true });
});
