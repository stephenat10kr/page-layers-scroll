
import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  className?: string;
}

const AnimatedBackground = ({ className }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Load the RGBA library dynamically
    const script = document.createElement('script');
    script.src = 'https://raw.githack.com/strangerintheq/rgba/0.0.1/src/rgba.js';
    script.async = true;
    
    let rgba: any;

    script.onload = () => {
      // Make sure the canvas exists and RGBA is loaded
      if (!canvasRef.current || !window.RGBA) return;
      
      // Initialize the RGBA instance with the shader
      rgba = new window.RGBA(`void main(void) {
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
      }`, {
        uniforms: {xy: '2f'},
        canvas: canvasRef.current
      });

      // Update shader uniforms based on scroll position
      const handleScroll = () => {
        if (!rgba) return;
        
        // Calculate scroll position as values between 0 and 1
        const scrollY = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollRatio = Math.min(scrollY / maxScroll, 1);
        
        // Use scroll position to affect the shader
        rgba.xy([scrollRatio, scrollRatio * 0.5]);
      };

      window.addEventListener('scroll', handleScroll);
      
      // Trigger initial render
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className || ''}`}
      style={{ opacity: 0.3 }}
    />
  );
};

export default AnimatedBackground;
