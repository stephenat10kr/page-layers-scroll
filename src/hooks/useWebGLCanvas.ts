
import { useEffect, useRef } from 'react';
import { createShader, createProgram, vertexShaderSource, fragmentShaderSource, lerp } from '../utils/shaderUtils';
import { getInterpolatedConfig } from '../utils/patternConfigs';

interface UseWebGLCanvasProps {
  activeSection: number;
  transitionProgress: number;
  normalizedScrollX: number;
  normalizedScrollY: number;
}

export const useWebGLCanvas = ({
  activeSection,
  transitionProgress,
  normalizedScrollX,
  normalizedScrollY
}: UseWebGLCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
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

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    // Create program
    const program = createProgram(gl, vertexShader, fragmentShader);
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
      const config = getInterpolatedConfig(activeSection, transitionProgress);
      
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(xyLocation, normalizedScrollX, normalizedScrollY);
      
      // Pass interpolated parameters to shader
      gl.uniform1f(aParamLocation, config.a);
      gl.uniform1f(bParamLocation, config.b);
      gl.uniform1f(nParamLocation, config.n);
      gl.uniform1f(mParamLocation, config.m);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Clean up WebGL resources
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [activeSection, transitionProgress, normalizedScrollX, normalizedScrollY]);
  
  return { canvasRef };
};
