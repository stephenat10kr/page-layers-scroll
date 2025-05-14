
// WebGL shader source code and utility functions

// Vertex shader source
export const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0, 1);
  }
`;

// Fragment shader source
export const fragmentShaderSource = `
  precision mediump float;
  uniform vec2 resolution;
  uniform float time;
  uniform vec2 xy;
  uniform float a_param;
  uniform float b_param;
  uniform float n_param;
  uniform float m_param;

  void main(void) {
    const float PI = 3.14159265;
    vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;

    float tx = sin(time)*0.1; 
    float ty = cos(time)*0.1; 

    float a = a_param + tx * 0.2;
    float b = b_param + tx * 0.2;
    float n = n_param + ty * 0.2;
    float m = m_param + ty * 0.2;

    float max_amp = abs(a) + abs(b);
    float amp = a * sin(PI*n*p.x) * sin(PI*m*p.y) + b * sin(PI*m*p.x) * sin(PI*n*p.y);
    float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
    gl_FragColor = vec4(vec3(col), 1.0);
  }
`;

// Create and compile a shader
export const createShader = (
  gl: WebGLRenderingContext, 
  type: number, 
  source: string
): WebGLShader => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  // Check for compilation errors
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error('Shader compilation failed');
  }
  
  return shader;
};

// Create a shader program from vertex and fragment shaders
export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram => {
  const program = gl.createProgram()!;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // Check for linking errors
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('Program linking failed');
  }
  
  return program;
};

// Utility function for linear interpolation
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};
