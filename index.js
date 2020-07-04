
const grid_size = 10;
const dim = 3;

function index(i, j, k) {
  return i * grid_size * grid_size + j * grid_size + k;
}

function create_grid() {
  let grid_x = new Float32Array(grid_size * grid_size * grid_size);
  let grid_y = new Float32Array(grid_size * grid_size * grid_size);
  let grid_z = new Float32Array(grid_size * grid_size * grid_size);

  for (let i = 0; i < grid_size; i++) {
    for (let j = 0; j < grid_size; j++) {
      for (let k = 0; k < grid_size; k++) {
        const idx = index(i, j, k);
        grid_x[idx] = 1 * (i - grid_size / 2)
        grid_y[idx] = 1 * (j - grid_size / 2)
        grid_z[idx] = 1 * (k - grid_size / 2)

      }
    }
  }
  return [grid_x, grid_y, grid_z];
}

function create_velocity() {
  let grid_x = new Float32Array(grid_size * grid_size * grid_size);
  let grid_y = new Float32Array(grid_size * grid_size * grid_size);
  let grid_z = new Float32Array(grid_size * grid_size * grid_size);

  for (let i = 0; i < grid_size; i++) {
    for (let j = 0; j < grid_size; j++) {
      for (let k = 0; k < grid_size; k++) {
        const idx = index(i, j, k);
        grid_x[idx] = 0;
        grid_y[idx] = 0;
        grid_z[idx] = 0;
      }
    }
  }
  return [grid_x, grid_y, grid_z];
}

const [gxi, gyi, gzi] = create_grid();
const [grid_x, grid_y, grid_z] = create_grid();
const [vx, vy, vz] = create_velocity();
let normal_array = new Float32Array(4 * grid_size * grid_size * grid_size);

function compute_force() {
  const k_spring = 100;

  let force_x = new Float32Array(grid_size * grid_size * grid_size);
  let force_y = new Float32Array(grid_size * grid_size * grid_size);
  let force_z = new Float32Array(grid_size * grid_size * grid_size);

  for (let i = 0; i < grid_size; i++) {
    for (let j = 0; j < grid_size; j++) {
      for (let k = 0; k < grid_size; k++) {

        let idx = index(i, j, k);
        let volume_coeff = 50;
        let width = 0;
        let height = 0;
        let depth = 0;

        if (i > 0) {
          let idx2 = index(i - 1, j, k);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          width += grid_x[idx] - grid_x[idx2];
        } else {
          width += 1;
        }

        if (i < grid_size - 1) {
          let idx2 = index(i + 1, j, k);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          width -= grid_x[idx] - grid_x[idx2];
        } else {
          width += 1;
        }

        if (j > 0) {
          let idx2 = index(i, j - 1, k);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          height += grid_y[idx] - grid_y[idx2];
        }else {
          height += 1;
        }
        
        if (j < grid_size - 1) {
          let idx2 = index(i, j + 1, k);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          height -= grid_y[idx] - grid_y[idx2];
        } else {
          height += 1;
        }
        
        if (k > 0) {
          let idx2 = index(i, j, k - 1);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          depth += grid_z[idx] - grid_z[idx2];
        }else {
          depth += 1;
        }
        
        if (k < grid_size - 1) {
          let idx2 = index(i, j, k + 1);
          force_x[idx] += -k_spring * ((grid_x[idx] - grid_x[idx2]) - (gxi[idx] - gxi[idx2]));
          force_y[idx] += -k_spring * ((grid_y[idx] - grid_y[idx2]) - (gyi[idx] - gyi[idx2]));
          force_z[idx] += -k_spring * ((grid_z[idx] - grid_z[idx2]) - (gzi[idx] - gzi[idx2]));
          depth -= grid_z[idx] - grid_z[idx2];
        } else {
          depth += 1;
        }
        
        
        let force = volume_coeff * (8 - depth * width * height);
        
        if (i > 0) {
          let idx2 = index(i - 1, j, k);
          force_x[idx2] -= force;
        }

        if (i < grid_size - 1) {
          let idx2 = index(i + 1, j, k);
          force_x[idx2] += force;
        }

        if (j > 0) {
          let idx2 = index(i, j - 1, k);
          force_y[idx2] -= force;
        }

        if (j < grid_size - 1) {
          let idx2 = index(i, j + 1, k);
          force_y[idx2] += force;
        }

       if (k > 0) {
          let idx2 = index(i, j, k - 1);
          force_z[idx2] -= force;
        }

        if (k < grid_size - 1) {
          let idx2 = index(i, j, k + 1);
          force_z[idx2] += force;
        }
        
      }
    }
  }
  return [force_x, force_y, force_z];
}

let time = 0;

let mouse_x = 0;
let mouse_y = 0;

let mouse_down = (e) => {
  mouse_x = e.clientX;
  mouse_y = e.clientY;
};

let mouse_up = (e) => {
  let dx = e.clientX - mouse_x;
  let dy = e.clientY - mouse_y;

  for (let i = 0; i < grid_size; i++) {
    for (let j = 0; j < grid_size; j++) {
      for (let k = 0; k < grid_size; k++) {
        let idx = index(i, j, k);
        vx[idx] += dx;
        vy[idx] -= dy;
      }
    }
  }

}

document.addEventListener('mousedown', mouse_down);
document.addEventListener('mouseup', mouse_up);
document.addEventListener('touchstart', mouse_down);
document.addEventListener('touchend', mouse_up);

document.addEventListener('keypress', (e) => {
  if(e.code == 'Space'){
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        for (let k = 0; k < grid_size; k++) {
          let idx = index(i, j, k);
          vy[idx] += 100 / (j + 1);
        }
      }
    }
  }

  if(String.fromCharCode(e.keyCode) == 'd'){
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        for (let k = 0; k < grid_size; k++) {
          let idx = index(i, j, k);
          vx[idx] += 20 / (j + 1);
        }
      }
    }
  }

  if(String.fromCharCode(e.keyCode) == 'a'){
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        for (let k = 0; k < grid_size; k++) {
          let idx = index(i, j, k);
          vx[idx] -= 20 / (j + 1);
        }
      }
    }
  }

  if(String.fromCharCode(e.keyCode) == 'w'){
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        for (let k = 0; k < grid_size; k++) {
          let idx = index(i, j, k);
          vz[idx] -= 20 / (j + 1);
        }
      }
    }
  }

  if(String.fromCharCode(e.keyCode) == 's'){
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        for (let k = 0; k < grid_size; k++) {
          let idx = index(i, j, k);
          vz[idx] += 20 / (j + 1);
        }
      }
    }
  }

});

function update(dt) {
  time += dt;

  
  let [force_x, force_y, force_z] = compute_force();

  const max_force = 15;

  for (let i = 0; i < grid_size * grid_size * grid_size; i++) {
    

    vx[i] += force_x[i] * dt;
    vy[i] += (force_y[i] - 10) * dt;
    vz[i] += force_z[i] * dt;

    if (isNaN(vx[i])) {
      vx[i] = 0;
    } else if (vx[i] < -max_force) {
      vx[i] = -max_force;
    } else if (vx[i] > max_force) {
      vx[i] = max_force;
    }

    if (isNaN(vy[i])) {
      vy[i] = 0;
    }else if (vy[i] < -max_force) {
      vy[i] = -max_force;
    } else if (vy[i] > max_force) {
      vy[i] = max_force;
    }

    if (isNaN(vz[i])) {
      vz[i] = 0;
    }else if (vz[i] < -max_force) {
      vz[i] = -max_force;
    } else if (vz[i] > max_force) {
      vz[i] = max_force;
    }

    grid_x[i] += vx[i] * dt;
    grid_y[i] += vy[i] * dt;
    grid_z[i] += vz[i] * dt;

    vx[i] *= (1 - dt);
    vy[i] *= (1 - dt);
    vz[i] *= (1 - dt);

  }

  for (let i = 0; i < grid_size * grid_size * grid_size; i++) {
    if (grid_y[i] < -20) {
      grid_y[i] = -20;
      if (vy[i] < 0) {
        vy[i] = -vy[i];
      }
    }

    if (grid_x[i] < -20) {
      grid_x[i] = -20;
      if (vx[i] < 0) {
        vx[i] = -vx[i];
      }
    }
  }
  

}

function compute_positions() {
  const positions = [];
  const normals = [];

  let push_positions = (indices) => {

    let v1 = [
      grid_x[indices[0]],
      grid_y[indices[0]],
      grid_z[indices[0]]
    ];

    let v2 = [
      grid_x[indices[1]],
      grid_y[indices[1]],
      grid_z[indices[1]]
    ]

    let v3 = [
      grid_x[indices[2]],
      grid_y[indices[2]],
      grid_z[indices[2]]
    ];

    const normal = vec3.cross(
      vec3.create(), 
      vec3.sub(vec3.create(), v2, v1),
      vec3.sub(vec3.create(), v3, v1),
    );

    positions.push(...v1)
    positions.push(...v2)
    positions.push(...v3)

    for (idx of indices) {
        normal_array[4 * idx + 0] += normal[0]
        normal_array[4 * idx + 1] += normal[1]
        normal_array[4 * idx + 2] += normal[2]
        normal_array[4 * idx + 3] ++;
    }
  }

  for (let i = 0; i < grid_size - 1; i++) {
    for (let j = 0; j < grid_size - 1; j++) {
      for (let k of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j + 1, k),
            index(i + 1, j + 1, k)
          ], [
            index(i + 1, j + 1, k),
            index(i + 1, j, k),
            index(i, j, k)
          ],
        ]) { 
          push_positions(indices);
        }
      }  
    }
  }

  for (let i = 0; i < grid_size - 1; i++) {
    for (let k = 0; k < grid_size - 1; k++) {
      for (let j of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j, k + 1),
            index(i + 1, j, k + 1),
          ], [
            index(i + 1, j, k + 1),
            index(i + 1, j, k),
            index(i, j, k),
          ]
        ]) {
          push_positions(indices);

        }
      }  
    }
  }

  for (let k = 0; k < grid_size - 1; k++) {
    for (let j = 0; j < grid_size - 1; j++) {
      for (let i of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j + 1, k),
            index(i, j + 1, k + 1),
          ], [
            index(i, j + 1, k + 1),
            index(i, j, k + 1),
            index(i, j, k),
          ]
        ]) {

          push_positions(indices);

        }
      }  
    }
  }

  for (let i = 0; i < grid_size - 1; i++) {
    for (let j = 0; j < grid_size - 1; j++) {
      for (let k of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j + 1, k),
            index(i + 1, j + 1, k)
          ], [
            index(i + 1, j + 1, k),
            index(i + 1, j, k),
            index(i, j, k)
          ],
        ]) { 
 
          normals.push(normal_array[4 * indices[0] + 0] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 1] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 2] / normal_array[4 * indices[0] + 3])

          normals.push(normal_array[4 * indices[1] + 0] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 1] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 2] / normal_array[4 * indices[1] + 3])

          normals.push(normal_array[4 * indices[2] + 0] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 1] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 2] / normal_array[4 * indices[2] + 3])


        }
      }  
    }
  }

  for (let i = 0; i < grid_size - 1; i++) {
    for (let k = 0; k < grid_size - 1; k++) {
      for (let j of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j, k + 1),
            index(i + 1, j, k + 1),
          ], [
            index(i + 1, j, k + 1),
            index(i + 1, j, k),
            index(i, j, k),
          ]
        ]) {

          normals.push(normal_array[4 * indices[0] + 0] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 1] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 2] / normal_array[4 * indices[0] + 3])

          normals.push(normal_array[4 * indices[1] + 0] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 1] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 2] / normal_array[4 * indices[1] + 3])

          normals.push(normal_array[4 * indices[2] + 0] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 1] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 2] / normal_array[4 * indices[2] + 3])


        }
      }  
    }
  }

  for (let k = 0; k < grid_size - 1; k++) {
    for (let j = 0; j < grid_size - 1; j++) {
      for (let i of [0, grid_size - 1]) {
        for (let indices of [
          [
            index(i, j, k),
            index(i, j + 1, k),
            index(i, j + 1, k + 1),
          ], [
            index(i, j + 1, k + 1),
            index(i, j, k + 1),
            index(i, j, k),
          ]
        ]) {
          normals.push(normal_array[4 * indices[0] + 0] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 1] / normal_array[4 * indices[0] + 3])
          normals.push(normal_array[4 * indices[0] + 2] / normal_array[4 * indices[0] + 3])

          normals.push(normal_array[4 * indices[1] + 0] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 1] / normal_array[4 * indices[1] + 3])
          normals.push(normal_array[4 * indices[1] + 2] / normal_array[4 * indices[1] + 3])

          normals.push(normal_array[4 * indices[2] + 0] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 1] / normal_array[4 * indices[2] + 3])
          normals.push(normal_array[4 * indices[2] + 2] / normal_array[4 * indices[2] + 3])

        }
      }  
    }
  }

  return [new Float32Array(positions), new Float32Array(normals)];
}


main();

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec3 aNormalPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying vec3 v_normal;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition.xyz, 1);
      gl_PointSize = 2.0;
      v_normal = aNormalPosition;
    }
  `;

  // Fragment shader program

  const fsSource = `
    precision highp float;
    varying vec3 v_normal;
    void main(void) {
      vec3 light = vec3(0.2, 0.8, -0.5);
      float shading = 2.0 / 5.0 + 3.0 / 5.0 * dot(light, v_normal);
      gl_FragColor = vec4(shading * vec3(0.39, 1.0, 0), 1.0);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      normalPosition: gl.getAttribLocation(shaderProgram, 'aNormalPosition'),

    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);
  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  return {
    position: positionBuffer,
    normals: normalBuffer,

  };
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime) {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 10000.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [0.0, 20.0, -80.0]);  // amount to translate
  mat4.scale(modelViewMatrix,     // destination matrix
                  modelViewMatrix, [2, 2, 2]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    update(deltaTime);
    let [positions, normals] = compute_positions();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STREAM_DRAW);
    
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);


  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STREAM_DRAW);


  gl.vertexAttribPointer(
    programInfo.attribLocations.normalPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset);
  gl.enableVertexAttribArray(programInfo.attribLocations.normalPosition);

  }

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    gl.drawArrays(gl.TRIANGLES, 0, (grid_size - 1) * (grid_size - 1) * 36);
  }


}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}