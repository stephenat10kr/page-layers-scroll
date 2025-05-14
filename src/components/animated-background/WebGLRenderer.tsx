
import React, { useEffect, useRef, useState } from 'react';
import { getInterpolatedConfig } from './utils';
import { vertexShaderSource, fragmentShaderSource } from './shaders';

interface WebGLRendererProps {
  scrollY: number;
  activeSection: number;
  transitionProgress: number;
  isExiting: boolean;
}

const WebGLRenderer = ({ scrollY, activeSection, transitionProgress, isExiting }: WebGLRendererProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shaderRef = useRef<number | null>(null);
  const [transitionSection, setTransitionSection] = useState<number>(0);
  
  // Normalized scroll position values (0 to 1) - still used for subtle variations
  const normalizedScrollX = (scrollY % 1000) / 1000;
  const normalizedScrollY = scrollY / (document.body.scrollHeight - window.innerHeight);
  
  // Calculate transition section based on scroll position
  useEffect(() => {
    if (isExiting) {
      setTransitionSection(3); // Exit buffer
    } else {
      setTransitionSection(activeSection); // Section transitions (0, 1, 2)
    }
  }, [activeSection, isExiting]);

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
    const transitionSectionLocation = gl.getUniformLocation(program, "transitionSection");

    let startTime = Date.now();

    // Animation loop
    const animate = () => {
      if (!canvas) return;
      
      const time = (Date.now() - startTime) * 0.001;
      
      // Get interpolated pattern configuration
      const config = getInterpolatedConfig(activeSection, transitionProgress, isExiting);
      
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(xyLocation, normalizedScrollX, normalizedScrollY);
      
      // Pass interpolated parameters to shader
      gl.uniform1f(aParamLocation, config.a);
      gl.uniform1f(bParamLocation, config.b);
      gl.uniform1f(nParamLocation, config.n);
      gl.uniform1f(mParamLocation, config.m);
      
      // Pass transition section to shader
      gl.uniform1i(transitionSectionLocation, transitionSection);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      shaderRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (shaderRef.current !== null) {
        cancelAnimationFrame(shaderRef.current);
      }
    };
  }, [activeSection, transitionProgress, normalizedScrollX, normalizedScrollY, isExiting, transitionSection]);
  
  return (
    <>
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      />
      
      {/* Optional section indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm font-mono z-10">
        {transitionSection === 0 && "Section 1→2"}
        {transitionSection === 1 && "Section 2→3"}
        {transitionSection === 2 && "Section 3→Exit"}
        {transitionSection === 3 && "Exit Buffer"}
      </div>
    </>
  );
};

export default WebGLRenderer;
