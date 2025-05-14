
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  scrollY: number;
  activeSection: number;
  transitionProgress: number;
  isExiting: boolean;
}

interface PatternConfig {
  a: number;
  b: number;
  n: number;
  m: number;
}

const AnimatedBackground = ({ scrollY, activeSection, transitionProgress, isExiting }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderRef = useRef<any>(null);
  
  // Define pattern configurations for each section with subtler differences
  const patternConfigs: PatternConfig[] = [
    { a: 1.0, b: 1.0, n: 1.0, m: 2.0 },   // Section 1
    { a: 2.0, b: -1.5, n: 2.0, m: 3.0 },  // Section 2 - reduced differences
    { a: -3.0, b: 3.0, n: 3.0, m: 4.0 },  // Section 3 - reduced differences
    { a: 0.0, b: 1.5, n: 3.5, m: 2.0 }    // Exit transition configuration - smoothed
  ];

  // Linear interpolation function to blend between values
  const lerp = (start: number, end: number, t: number) => {
    // Apply easing for smoother transitions
    const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return start * (1 - easedT) + end * easedT;
  };

  // Get interpolated configuration between current and next section
  const getInterpolatedConfig = () => {
    // For the exit transition
    if (isExiting) {
      const currentConfig = patternConfigs[patternConfigs.length - 2]; // Section 3
      const exitConfig = patternConfigs[patternConfigs.length - 1]; // Exit config
      
      return {
        a: lerp(currentConfig.a, exitConfig.a, transitionProgress),
        b: lerp(currentConfig.b, exitConfig.b, transitionProgress),
        n: lerp(currentConfig.n, exitConfig.n, transitionProgress),
        m: lerp(currentConfig.m, exitConfig.m, transitionProgress),
      };
    }
    
    // Normal section transitions
    const currentConfig = patternConfigs[activeSection];
    const nextConfig = patternConfigs[Math.min(activeSection + 1, patternConfigs.length - 2)];
    
    return {
      a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
      b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
      n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
      m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
    };
  };

  // Normalized scroll position values (0 to 1) - still used for subtle variations
  const normalizedScrollX = (scrollY % 1000) / 1000;
  const normalizedScrollY = scrollY / (document.body.scrollHeight - window.innerHeight);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shader source code
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
    `;

    const fragmentShaderSource = `
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

        // Slow down the time factor for more subtle animation
        float tx = sin(time * 0.6)*0.05; 
        float ty = cos(time * 0.6)*0.05; 

        float a = a_param + tx * 0.15;
        float b = b_param + tx * 0.15;
        float n = n_param + ty * 0.15;
        float m = m_param + ty * 0.15;

        float max_amp = abs(a) + abs(b);
        float amp = a * sin(PI*n*p.x) * sin(PI*m*p.y) + b * sin(PI*m*p.x) * sin(PI*n*p.y);
        float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
        gl_FragColor = vec4(vec3(col), 1.0);
      }
    `;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Set up attributes and uniforms
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const timeLocation = gl.getUniformLocation(program, "time");
    const resolutionLocation = gl.getUniformLocation(program, "resolution");
    const xyLocation = gl.getUniformLocation(program, "xy");
    const aParamLocation = gl.getUniformLocation(program, "a_param");
    const bParamLocation = gl.getUniformLocation(program, "b_param");
    const nParamLocation = gl.getUniformLocation(program, "n_param");
    const mParamLocation = gl.getUniformLocation(program, "m_param");

    let startTime = Date.now();

    // Animation loop
    const animate = () => {
      if (!canvas) return;
      
      const time = (Date.now() - startTime) * 0.001;
      
      // Get interpolated pattern configuration
      const config = getInterpolatedConfig();
      
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(xyLocation, normalizedScrollX, normalizedScrollY);
      
      // Pass interpolated parameters to shader
      gl.uniform1f(aParamLocation, config.a);
      gl.uniform1f(bParamLocation, config.b);
      gl.uniform1f(nParamLocation, config.n);
      gl.uniform1f(mParamLocation, config.m);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      shaderRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (shaderRef.current) {
        cancelAnimationFrame(shaderRef.current);
      }
    };
  }, [activeSection, transitionProgress, normalizedScrollX, normalizedScrollY, isExiting]);

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
};

export default AnimatedBackground;
