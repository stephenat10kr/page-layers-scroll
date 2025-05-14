
import React from 'react';
import { useWebGLCanvas } from '../hooks/useWebGLCanvas';

interface AnimatedBackgroundProps {
  scrollY: number;
  normalizedScrollProgress: number;
}

const AnimatedBackground = ({ scrollY, normalizedScrollProgress }: AnimatedBackgroundProps) => {
  // Calculate normalized scroll values used for subtle variations
  const normalizedScrollX = (scrollY % 1000) / 1000;
  
  // Use the WebGL canvas hook to handle all the WebGL setup and rendering
  const { canvasRef } = useWebGLCanvas({
    normalizedScrollProgress,
    normalizedScrollX
  });

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    />
  );
};

export default AnimatedBackground;
