document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('glcanvas');
    const startPrompt = document.getElementById('start-prompt');

    // --- Configuration for the fluid simulation ---
    const config = {
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 1,
        VELOCITY_DISSIPATION: 0.3,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 20,
        SPLAT_RADIUS: 0.3,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.6,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 0.8,
    };

    // --- Main Logic ---

    // Declare the fluid variable here, but we will initialize it later.
    let fluid = null;

    // This function is called when the user taps the start prompt.
    function startExperience() {
        // *** THE FIX IS HERE: ***
        // Initialize the fluid simulation now, after the user has interacted.
        // This is much safer and more compatible with modern browsers.
        if (!fluid) {
            fluid = webglFluid.default(canvas, config);
        }

        // Hide the prompt with a fade-out effect
        startPrompt.style.opacity = '0';
        setTimeout(() => {
            startPrompt.style.display = 'none';
        }, 500);

        // Now we can add the fluid and set up the motion listeners
        addInitialFluid();
        setupEventListeners();
    }

    function addInitialFluid() {
        const amount = 20;
        const color = { r: 0.1, g: 0.4, b: 1.0 };
        for (let i = 0; i < amount; i++) {
            fluid.splat(
                Math.random(), 
                Math.random() * 0.25, 
                0, 0, 
                color, 2.0
            );
        }
    }

    function setupEventListeners() {
        // Request permission for motion sensors (required on iOS)
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        window.addEventListener('devicemotion', handleDeviceMotion);
                    }
                })
                .catch(console.error);
        } else {
            // For other browsers (like Chrome on Android)
            window.addEventListener('devicemotion', handleDeviceMotion);
        }

        // Fallback for desktop testing with a mouse
        canvas.addEventListener('mousemove', (e) => {
            if (!fluid) return;
            fluid.splat(
                e.clientX / window.innerWidth,
                1.0 - (e.clientY / window.innerHeight),
                e.movementX * 2,
                -e.movementY * 2,
                {r:1, g:1, b:1}, 0.5
            );
        });
    }

    function handleDeviceMotion(event) {
        if (!fluid) return;
        const accel = event.accelerationIncludingGravity;
        if (!accel || accel.x === null) return;
        
        const forceX = accel.x * 150;
        const forceY = accel.y * -150;
        
        fluid.splat(0.5, 0.5, forceX, forceY, { r: 0, g: 0, b: 0 }, 5.0);
    }
    
    // Listen for the first user interaction to start everything
    startPrompt.addEventListener('click', startExperience, { once: true });
});
