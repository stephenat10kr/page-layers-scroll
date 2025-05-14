
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    RGBA: any;
  }
}

interface AnimatedBackgroundProps {
  scrollPosition: number;
}

const AnimatedBackground = ({ scrollPosition }: AnimatedBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rgbaInstanceRef = useRef<any>(null);
  
  useEffect(() => {
    // Load the RGBA script
    const script = document.createElement('script');
    script.src = 'https://raw.githack.com/strangerintheq/rgba/0.0.1/src/rgba.js';
    script.async = true;
    
    const onScriptLoad = () => {
      if (!containerRef.current) return;
      
      // Initialize RGBA with the shader
      const rgba = new window.RGBA(`void main(void) {
        const float PI = 3.14159265;
        vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / resolution.y;

        vec4 s1 = vec4(1.0, 1.0, 1.0, 2.0);
        vec4 s2 = vec4(-4.0, 4.0, 4.0, 4.6);

        float tx = sin(time)*0.1; 
        float ty = cos(time)*0.1; 

        float a = mix(s1.x, s2.x, xy.x+tx);
        float b = mix(s1.y, s2.y, xy.x+tx);
        float n = mix(s1.z, s2.z, xy.y+ty);
        float m = mix(s1.w, s2.w, xy.y+ty);

        float max_amp = abs(a) + abs(b);
        float amp = a * sin(PI*n*p.x) * sin(PI*m*p.y) + b * sin(PI*m*p.x) * sin(PI*n*p.y);
        float col = 1.0 - smoothstep(abs(amp), 0.0, 0.1);
        gl_FragColor = vec4(vec3(col), 1.0);
      }`, {uniforms: {xy: '2f'}});
      
      rgbaInstanceRef.current = rgba;
      
      // Append the canvas to our container
      if (rgba.canvas && containerRef.current) {
        rgba.canvas.style.position = 'absolute';
        rgba.canvas.style.top = '0';
        rgba.canvas.style.left = '0';
        rgba.canvas.style.width = '100%';
        rgba.canvas.style.height = '100%';
        containerRef.current.appendChild(rgba.canvas);
      }
    };
    
    script.onload = onScriptLoad;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
      if (containerRef.current && rgbaInstanceRef.current?.canvas) {
        containerRef.current.removeChild(rgbaInstanceRef.current.canvas);
      }
    };
  }, []);
  
  // Update the shader parameters based on scroll position
  useEffect(() => {
    if (!rgbaInstanceRef.current) return;
    
    // Convert scroll position to a value between 0 and 1 for the shader
    // We'll use the scroll position to affect both x and y values
    const normalizedScrollX = (scrollPosition % 1000) / 1000;
    const normalizedScrollY = (scrollPosition % 1500) / 1500;
    
    rgbaInstanceRef.current.xy([normalizedScrollX, normalizedScrollY]);
  }, [scrollPosition]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
};

export default AnimatedBackground;
