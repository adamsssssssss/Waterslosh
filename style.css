// --- START: NEW CODE FOR MOTION CONTROL AND INITIALIZATION ---

// Global object to hold motion data
const motion = {
    x: 0,
    y: 0,
    active: false
};

// Get references to our HTML elements
const startButton = document.getElementById('start-button');
const infoOverlay = document.getElementById('info-overlay');
const debugInfo = document.getElementById('debug-info');
const canvas = document.getElementById('water-canvas');

// Main function to start the experience
function startExperience() {
    // Check if we need to request permission (for iOS 13+)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    addMotionListener();
                } else {
                    alert('Permission to use motion sensors was denied.');
                }
            })
            .catch(console.error);
    } else {
        // For browsers/devices that don't require permission
        addMotionListener();
    }
}

// Function to add the motion event listener
function addMotionListener() {
    window.addEventListener('devicemotion', (event) => {
        // Get acceleration data including gravity
        const accel = event.accelerationIncludingGravity;
        if (accel && accel.x !== null) {
            motion.active = true;
            motion.x = accel.x;
            motion.y = accel.y;
        }

        // Update debug info on screen
        if (debugInfo) {
            debugInfo.innerHTML = `X: ${motion.x.toFixed(2)}, Y: ${motion.y.toFixed(2)}`;
        }
    });

    // Hide the overlay and start the animation
    infoOverlay.classList.add('hidden');
    // We assume the webGL water object is initialized and available globally as 'water'
    if (typeof main !== 'undefined') {
        main();
    }
}

// Attach the start function to our button's click event
startButton.addEventListener('click', startExperience);


// --- END: NEW CODE FOR MOTION CONTROL ---
// --- The rest of this file is the original, adapted WebGL demo code ---


/*
 * Copyright 2010 Evan Wallace
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,

 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// All of the original demo's JS files have been combined into this one file.
// I have removed the original mouse event handlers and will inject motion control
// into the `update` loop.

// Common matrix-related functions
var Matrix = {
    // ... (rest of the combined script)
};
// global so we can call it from the new init code
var main; 

(function() {
    var hasWebGL = (function() { try { return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl'); } catch(e) { return false; } })();

    // All the original JS library files are pasted here.
    // matrix.js
    var Matrix = {
        I: function(size) {
            var M = [];
            for (var i = 0; i < size; i++) {
                M[i] = [];
                for (var j = 0; j < size; j++) {
                    M[i][j] = (i == j) ? 1 : 0;
                }
            }
            return M;
        },
        multiply: function(A, B) {
            var A_rows = A.length, A_cols = A[0].length;
            var B_rows = B.length, B_cols = B[0].length;
            if (A_cols != B_rows) return null;
            var M = [];
            for (var i = 0; i < A_rows; i++) {
                M[i] = [];
                for (var j = 0; j < B_cols; j++) {
                    var sum = 0;
                    for (var k = 0; k < A_cols; k++) {
                        sum += A[i][k] * B[k][j];
                    }
                    M[i][j] = sum;
                }
            }
            return M;
        },
        translate: function(M, V) {
            var T = Matrix.I(M.length);
            for (var i = 0; i < V.length; i++) T[i][M.length-1] = V[i];
            return Matrix.multiply(T, M);
        },
        scale: function(M, V) {
            var T = Matrix.I(M.length);
            for (var i = 0; i < V.length; i++) T[i][i] = V[i];
            return Matrix.multiply(T, M);
        },
        rotate: function(M, angle, V) {
            var x = V[0], y = V[1], z = V[2];
            var s = Math.sin(angle), c = Math.cos(angle), c1 = 1 - c;
            var T = [
                [x*x*c1+c,   x*y*c1-z*s, x*z*c1+y*s, 0],
                [y*x*c1+z*s, y*y*c1+c,   y*z*c1-x*s, 0],
                [z*x*c1-y*s, z*y*c1+x*s, z*z*c1+c,   0],
                [0,          0,          0,          1]
            ];
            return Matrix.multiply(T, M);
        },
        perspective: function(fovy, aspect, near, far) {
            var f = 1 / Math.tan(fovy * Math.PI / 360);
            return [
                [f/aspect, 0, 0, 0],
                [0, f, 0, 0],
                [0, 0, (far+near)/(near-far), 2*far*near/(near-far)],
                [0, 0, -1, 0]
            ];
        },
        ortho: function(l, r, b, t, n, f) {
            return [
                [2/(r-l),0,0,-(r+l)/(r-l)],
                [0,2/(t-b),0,-(t+b)/(t-b)],
                [0,0,-2/(f-n),-(f+n)/(f-n)],
                [0,0,0,1]
            ];
        },
        flatten: function(M) {
            var N = [];
            for (var i = 0; i < M.length; i++) {
                for (var j = 0; j < M[0].length; j++) {
                    N.push(M[j][i]);
                }
            }
            return N;
        }
    };

    // vector.js
    var Vector = {
        add: function(a, b) {
            var V = [];
            for (var i = 0; i < a.length; i++) {
                V[i] = a[i] + b[i];
            }
            return V;
        },
        subtract: function(a, b) {
            var V = [];
            for (var i = 0; i < a.length; i++) {
                V[i] = a[i] - b[i];
            }
            return V;
        },
        multiply: function(a, b) {
            if (typeof a == 'number') {
                var V = [];
                for (var i = 0; i < b.length; i++) {
                    V[i] = a * b[i];
                }
                return V;
            } else if (typeof b == 'number') {
                var V = [];
                for (var i = 0; i < a.length; i++) {
                    V[i] = a[i] * b;
                }
                return V;
            } else {
                var sum = 0;
                for (var i = 0; i < a.length; i++) {
                    sum += a[i] * b[i];
                }
                return sum;
            }
        },
        dot: function(a, b) {
            return Vector.multiply(a, b);
        },
        cross: function(a, b) {
            return [
                a[1] * b[2] - a[2] * b[1],
                a[2] * b[0] - a[0] * b[2],
                a[0] * b[1] - a[1] * b[0]
            ];
        },
        length: function(a) {
            return Math.sqrt(Vector.dot(a, a));
        },
        unit: function(a) {
            return Vector.multiply(1 / Vector.length(a), a);
        }
    };

    function text2html(text) {
        return text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/\n/g, '<br>');
    }

    function handleError(text) {
        var html = text2html(text);
        if (html == 'WebGL not supported') {
            html = 'Your browser does not support WebGL.<br>Please see\
            <a href="http://www.khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">\
            Getting a WebGL Implementation</a>.';
        }
        var loading = document.getElementById('loading');
        loading.innerHTML = html;
        loading.style.zIndex = 1;
    }

    var gl;
    var water;
    var cubemap;
    var sphere;
    var angleX = 0;
    var angleY = 0;

    // The main entry point
    main = function() {
        if (!hasWebGL) {
            handleError('WebGL not supported');
            return;
        }

        try {
            gl = canvas.getContext('experimental-webgl');
        } catch (e) {}
        if (!gl) {
            handleError('WebGL not supported');
            return;
        }
        
        water = new Water();
        sphere = new Sphere();
        cubemap = new Cubemap({
            xneg: 'xneg.jpg', xpos: 'xpos.jpg',
            yneg: 'ypos.jpg', ypos: 'ypos.jpg',
            zneg: 'zneg.jpg', zpos: 'zpos.jpg'
        });

        gl.enable(gl.DEPTH_TEST);

        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                setTimeout(callback, 1000/60);
            };

        var oldTime = 0;
        function update(time) {
            water.update(time - oldTime);
            oldTime = time;
            
            // --- START: NEW MOTION CONTROL LOGIC ---
            if (motion.active) {
                // Map accelerometer data (-9.8 to 9.8) to canvas coordinates (0 to 1)
                // We flip the y-axis because tilting the phone "up" (positive y) should
                // make the sphere move to the "bottom" of the screen (higher y coordinate).
                let targetX = (motion.x / 9.8) * 0.5 + 0.5;
                let targetY = (-motion.y / 9.8) * 0.5 + 0.5;

                // Clamp values between 0 and 1
                targetX = Math.max(0.0, Math.min(1.0, targetX));
                targetY = Math.max(0.0, Math.min(1.0, targetY));

                // Move the sphere constantly to create sloshing
                water.move(targetX, targetY);
            }
            // --- END: NEW MOTION CONTROL LOGIC ---

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.loadIdentity();
            gl.translate(0, 0, -4);
            gl.rotate(angleX, 1, 0, 0);
            gl.rotate(angleY, 0, 1, 0);
            
            gl.disable(gl.DEPTH_TEST);
            cubemap.draw();
            gl.enable(gl.DEPTH_TEST);
            water.draw();
            sphere.draw();
            
            requestAnimationFrame(update);
        }

        update(0);
    }
    
    // Shader utilities
    function getShader(id) {
        var script = document.getElementById(id);
        if (!script) {
            return null;
        }
        var source = '';
        var currentChild = script.firstChild;
        while (currentChild) {
            if (currentChild.nodeType == 3) {
                source += currentChild.textContent;
            }
            currentChild = currentChild.nextSibling;
        }
        var shader;
        if (script.type == 'x-shader/x-fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (script.type == 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }
    
    // Shader Programs
    var programs = {};
    function getProgram(name) {
        var program = programs[name];
        if (program) return program;

        var VSHADER_SOURCE, FSHADER_SOURCE;

        if(name == 'water'){
            VSHADER_SOURCE = `
                uniform mat4 u_modelview;
                uniform mat4 u_projection;
                attribute vec3 a_vertex;
                attribute vec3 a_normal;
                varying vec3 v_normal;
                varying vec3 v_position;
                void main() {
                    v_normal = vec3(u_modelview * vec4(a_normal, 0.0));
                    v_position = vec3(u_modelview * vec4(a_vertex, 1.0));
                    gl_Position = u_projection * vec4(v_position, 1.0);
                }
            `;
            FSHADER_SOURCE = `
                precision mediump float;
                uniform vec3 u_light;
                uniform samplerCube u_cubemap;
                varying vec3 v_normal;
                varying vec3 v_position;
                void main() {
                    vec3 N = normalize(v_normal);
                    vec3 L = normalize(u_light);
                    vec3 E = normalize(-v_position);
                    vec3 R = reflect(-E, N);
                    float diffuse = max(0.0, dot(L, N));
                    float specular = pow(max(0.0, dot(L, R)), 20.0);
                    vec4 color = vec4(vec3(diffuse * 0.2 + specular * 0.8 + 0.2), 1.0);
                    vec4 sky = textureCube(u_cubemap, R);
                    gl_FragColor = mix(color, sky, 0.5);
                }
            `;
        } else if (name == 'cubemap') {
            VSHADER_SOURCE = `
                attribute vec3 a_vertex;
                varying vec3 v_texcoord;
                void main() {
                    v_texcoord = a_vertex;
                    gl_Position = vec4(a_vertex, 1.0);
                }
            `;
            FSHADER_SOURCE = `
                precision mediump float;
                uniform samplerCube u_cubemap;
                uniform mat4 u_modelview;
                uniform mat4 u_projection;
                varying vec3 v_texcoord;
                void main() {
                    mat4 u_inv_modelview = inverse(u_modelview);
                    mat4 u_inv_projection = inverse(u_projection);
                    vec4 clip = u_inv_projection * gl_FragCoord;
                    vec3 V = vec3(u_inv_modelview * vec4(clip.xyz, 0.0));
                    gl_FragColor = textureCube(u_cubemap, V);
                }
            `;
        } else if (name == 'sphere') {
             VSHADER_SOURCE = `
                uniform mat4 u_modelview;
                uniform mat4 u_projection;
                attribute vec3 a_vertex;
                attribute vec3 a_normal;
                varying vec3 v_normal;
                void main() {
                    v_normal = vec3(u_modelview * vec4(a_normal, 0.0));
                    gl_Position = u_projection * u_modelview * vec4(a_vertex, 1.0);
                }
            `;
            FSHADER_SOURCE = `
                precision mediump float;
                varying vec3 v_normal;
                void main() {
                    vec3 N = normalize(v_normal);
                    gl_FragColor = vec4(N * 0.5 + 0.5, 1.0);
                }
            `;
        }

        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, VSHADER_SOURCE);
        gl.compileShader(vertexShader);
        if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(vertexShader);
        
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, FSHADER_SOURCE);
        gl.compileShader(fragmentShader);
        if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(fragmentShader);

        program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw gl.getProgramInfoLog(program);
        }
        
        program.locations = {};
        var result = /attribute\s+\S+\s+(\S+)\s*;/g.exec(VSHADER_SOURCE);
        while (result) {
            var name = result[1];
            program.locations[name] = gl.getAttribLocation(program, name);
            result = /attribute\s+\S+\s+(\S+)\s*;/g.exec(VSHADER_SOURCE);
        }
        result = /uniform\s+\S+\s+(\S+)\s*;/g.exec(VSHADER_SOURCE + FSHADER_SOURCE);
        while (result) {
            var name = result[1];
            program.locations[name] = gl.getUniformLocation(program, name);
            result = /uniform\s+\S+\s+(\S+)\s*;/g.exec(VSHADER_SOURCE + FSHADER_SOURCE);
        }
        
        return programs[name] = program;
    }

    // GL augmentation
    var modelview = Matrix.I(4), projection = Matrix.I(4);
    gl.MODELVIEW = 1;
    gl.PROJECTION = 2;
    var matrix, stack;
    gl.matrixMode = function(mode) {
        switch (mode) {
            case gl.MODELVIEW: matrix = modelview; stack = []; break;
            case gl.PROJECTION: matrix = projection; stack = []; break;
            default: throw 'invalid matrix mode';
        }
    };
    gl.loadIdentity = function() {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                matrix[i][j] = (i == j) ? 1 : 0;
            }
        }
    };
    gl.pushMatrix = function() {
        stack.push(matrix.slice(0));
    };
    gl.popMatrix = function() {
        matrix = stack.pop();
    };
    gl.translate = function(x, y, z) {
        var T = Matrix.translate(matrix, [x, y, z]);
        matrix[0] = T[0];
        matrix[1] = T[1];
        matrix[2] = T[2];
        matrix[3] = T[3];
    };
    gl.scale = function(x, y, z) {
        var T = Matrix.scale(matrix, [x, y, z]);
        matrix[0] = T[0];
        matrix[1] = T[1];
        matrix[2] = T[2];
        matrix[3] = T[3];
    };
    gl.rotate = function(a, x, y, z) {
        var T = Matrix.rotate(matrix, a * Math.PI / 180, [x, y, z]);
        matrix[0] = T[0];
        matrix[1] = T[1];
        matrix[2] = T[2];
        matrix[3] = T[3];
    };
    gl.perspective = function(fovy, aspect, near, far) {
        projection = Matrix.perspective(fovy, aspect, near, far);
    };
    
    // Water simulation
    function Water() {
        this.program = getProgram('water');
        this.resolution = 64;
        this.size = 2;
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.x = this.resolution-1;
        this.y = this.resolution-1;
        
        for (var i = 0; i <= this.resolution; i++) {
            for (var j = 0; j <= this.resolution; j++) {
                var v = [
                    (i/this.resolution - 0.5) * this.size,
                    (j/this.resolution - 0.5) * this.size,
                    0
                ];
                this.vertices.push(v);
                this.normals.push([0, 0, 1]);
            }
        }
        
        for (var i = 0; i < this.resolution; i++) {
            for (var j = 0; j < this.resolution; j++) {
                var i0 = i * (this.resolution + 1) + j;
                var i1 = i0 + 1;
                var i2 = i0 + this.resolution + 1;
                var i3 = i2 + 1;
                this.indices.push(i0, i1, i2);
                this.indices.push(i1, i3, i2);
            }
        }
        
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.vertices)), gl.STATIC_DRAW);
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.normals)), gl.STATIC_DRAW);
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        
        this.height = [];
        this.velocity = [];
        for (var i = 0; i < (this.resolution+1)*(this.resolution+1); i++) {
            this.height.push(0);
            this.velocity.push(0);
        }
    }
    Water.prototype.update = function() {
        for (var i = 0; i <= this.resolution; i++) {
            for (var j = 0; j <= this.resolution; j++) {
                var index = i * (this.resolution + 1) + j;
                var V = this.vertices[index];
                if (i > 0 && i < this.resolution && j > 0 && j < this.resolution) {
                    var sum = 0, count = 0;
                    for (var x = -1; x <= 1; x++) {
                        for (var y = -1; y <= 1; y++) {
                            if (x || y) {
                                sum += this.height[(i+x)*(this.resolution+1) + (j+y)];
                                count++;
                            }
                        }
                    }
                    this.velocity[index] += (sum / count - V[2]) * 0.05;
                    this.velocity[index] *= 0.95;
                    V[2] += this.velocity[index];
                    this.height[index] = V[2];
                } else {
                    V[2] = 0;
                    this.height[index] = 0;
                    this.velocity[index] = 0;
                }
            }
        }
        
        for (var i = 0; i <= this.resolution; i++) {
            for (var j = 0; j <= this.resolution; j++) {
                var N = this.normals[i * (this.resolution + 1) + j];
                if (i > 0 && i < this.resolution && j > 0 && j < this.resolution) {
                    var V0 = this.vertices[i * (this.resolution + 1) + j];
                    var VL = this.vertices[i * (this.resolution + 1) + j-1];
                    var VR = this.vertices[i * (this.resolution + 1) + j+1];
                    var VD = this.vertices[(i-1) * (this.resolution + 1) + j];
                    var VU = this.vertices[(i+1) * (this.resolution + 1) + j];
                    var N = Vector.unit(Vector.cross(Vector.subtract(VR, VL), Vector.subtract(VU, VD)));
                    this.normals[i * (this.resolution + 1) + j] = N;
                }
            }
        }
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.vertices)), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.normals)), gl.STATIC_DRAW);
    };
    Water.prototype.draw = function() {
        gl.useProgram(this.program);
        var locations = this.program.locations;
        gl.uniformMatrix4fv(locations.u_modelview, false, Matrix.flatten(modelview));
        gl.uniformMatrix4fv(locations.u_projection, false, Matrix.flatten(projection));
        gl.uniform3fv(locations.u_light, Vector.unit([1, 1, 1]));
        gl.uniform1i(locations.u_cubemap, 0);
        
        gl.enableVertexAttribArray(locations.a_vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.vertexAttribPointer(locations.a_vertex, 3, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(locations.a_normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.vertexAttribPointer(locations.a_normal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    };
    Water.prototype.move = function(x, y) {
        this.x = Math.floor(x * this.resolution);
        this.y = Math.floor(y * this.resolution);
        this.x = Math.max(0, Math.min(this.resolution-1, this.x));
        this.y = Math.max(0, Math.min(this.resolution-1, this.y));
        this.drop(this.x, this.y, 2);
    };
    Water.prototype.drop = function(x, y, r) {
        for (var i = -r; i <= r; i++) {
            for (var j = -r; j <= r; j++) {
                if (i*i + j*j <= r*r) {
                    var v = this.vertices[(x+i)*(this.resolution+1) + y+j];
                    if (v) v[2] = -0.1;
                }
            }
        }
    };
    
    // Sphere
    function Sphere() {
        this.program = getProgram('sphere');
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        var slices = 32, stacks = 16;
        for (var i = 0; i <= stacks; i++) {
            var v = i / stacks;
            var phi = v * Math.PI;
            for (var j = 0; j <= slices; j++) {
                var u = j / slices;
                var theta = u * Math.PI * 2;
                var N = [Math.cos(theta) * Math.sin(phi), Math.cos(phi), Math.sin(theta) * Math.sin(phi)];
                this.vertices.push(Vector.multiply(0.1, N));
                this.normals.push(N);
            }
        }
        for (var i = 0; i < stacks; i++) {
            for (var j = 0; j < slices; j++) {
                var i0 = i * (slices + 1) + j;
                var i1 = i0 + 1;
                var i2 = i0 + slices + 1;
                var i3 = i2 + 1;
                this.indices.push(i0, i1, i2);
                this.indices.push(i1, i3, i2);
            }
        }
        
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.vertices)), gl.STATIC_DRAW);
        this.normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.normals)), gl.STATIC_DRAW);
        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    }
    Sphere.prototype.draw = function() {
        gl.pushMatrix();
        var x = water.x / water.resolution - 0.5;
        var y = water.y / water.resolution - 0.5;
        gl.translate(x * water.size, y * water.size, water.vertices[water.x*(water.resolution+1) + water.y][2]);
        gl.useProgram(this.program);
        var locations = this.program.locations;
        gl.uniformMatrix4fv(locations.u_modelview, false, Matrix.flatten(modelview));
        gl.uniformMatrix4fv(locations.u_projection, false, Matrix.flatten(projection));
        
        gl.enableVertexAttribArray(locations.a_vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.vertexAttribPointer(locations.a_vertex, 3, gl.FLOAT, false, 0, 0);
        
        gl.enableVertexAttribArray(locations.a_normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_buffer);
        gl.vertexAttribPointer(locations.a_normal, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.popMatrix();
    };
    
    // Cubemap
    function Cubemap(urls) {
        this.program = getProgram('cubemap');
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        
        var v = [[-1,-1,1], [1,-1,1], [1,1,1], [-1,1,1], [-1,-1,-1], [1,-1,-1], [1,1,-1], [-1,1,-1]];
        var i = [2,1,0, 0,3,2, 5,6,7, 7,4,5, 3,0,4, 4,7,3, 6,5,1, 1,2,6, 0,1,5, 5,4,0, 7,6,2, 2,3,7];
        this.vertices = [];
        for (var j = 0; j < i.length; j++) {
            this.vertices.push(v[i[j]]);
        }
        
        this.vertex_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Matrix.flatten(this.vertices)), gl.STATIC_DRAW);
    }
    Cubemap.prototype.draw = function() {
        gl.useProgram(this.program);
        var locations = this.program.locations;
        gl.uniformMatrix4fv(locations.u_modelview, false, Matrix.flatten(modelview));
        gl.uniformMatrix4fv(locations.u_projection, false, Matrix.flatten(projection));
        gl.uniform1i(locations.u_cubemap, 0);
        gl.enableVertexAttribArray(locations.a_vertex);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer);
        gl.vertexAttribPointer(locations.a_vertex, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length);
    };
})();
