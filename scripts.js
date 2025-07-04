document.addEventListener('DOMContentLoaded', () => {
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

    // This function will set up and run the simulation.
    // It's called ONLY after we have confirmed sensor access.
    function initializeAndRunSimulation() {
        // Hide the prompt
        startPrompt.style.opacity = '0';
        setTimeout(() => { startPrompt.style.display = 'none'; }, 500);

        // Initialize the fluid simulation
        fluid = webglFluid.default(canvas, config);

        // Add the initial "water"
        const amount = 20;
        const color = { r: 0.1, g: 0.4, b: 1.0 };
        for (let i = 0; i < amount; i++) {
            fluid.splat(Math.random(), Math.random() * 0.25, 0, 0, color, 2.0);
        }

        // Add the motion listener
        window.addEventListener('devicemotion', handleDeviceMotion);
        
        // Add a mouse listener as a fallback for desktop
        canvas.addEventListener('mousemove', handleMouseMove);
    }

    // --- Event Listeners ---

    // The main click handler for the start button
    startButton.addEventListener('click', async () => {
        // This is the modern, robust way to request sensor access on iOS
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState === 'granted') {
                    // Permission granted, let's start!
                    initializeAndRunSimulation();
                } else {
                    // Permission denied by the user
                    promptText.textContent = "Sensor access was denied. This experience cannot continue without it.";
                    startButton.style.display = 'none'; // Hide the button
                }
            } catch (error) {
                // An error occurred, possibly the user dismissed the prompt
                promptText.textContent = "An error occurred while requesting sensor access.";
                console.error(error);
            }
        } else {
            // This runs on devices that don't require explicit permission (e.g., Android)
            initializeAndRunSimulation();
        }
    }, { once: true });

    function handleDeviceMotion(event) {
        if (!fluid) return;
        const accel = event.accelerationIncludingGravity;
        if (!accel || accel.x === null) return;
        
        const forceX = accel.x * 150;
        const forceY = accel.y * -150;
        
        fluid.splat(0.5, 0.5, forceX, forceY, { r: 0, g: 0, b: 0 }, 5.0);
    }
    
    function handleMouseMove(e) {
        if (!fluid) return;
        fluid.splat( e.clientX / window.innerWidth, 1.0 - (e.clientY / window.innerHeight), e.movementX * 2, -e.movementY * 2, {r:1, g:1, b:1}, 0.5 );
    }
});
