<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Fluid Simulation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- This is where the WebGL fluid simulation will be rendered -->
    <canvas id="glcanvas"></canvas>

    <!-- 
        A startup promp is crucial, especially for iOS, 
        which requires user interaction to grant permission for motion sensors.
    -->
    <div id="start-prompt">
        <div class="content">
            <h1>Fluid Simulation</h1>
            <p>Tap the screen to begin and grant sensor access.</p>
        </div>
    </div>
    
    <!-- We load the external library first, then our script -->
    <script src="https://cdn.jsdelivr.net/gh/PavelDoGreat/WebGL-Fluid-Simulation/dist/webgl-fluid.js"></script>
    <script src="scripts.js"></script>
</body>
</html>
