
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values with enhanced easing
export const lerp = (start: number, end: number, t: number) => {
  // Apply easing for smoother transitions
  const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return start * (1 - easedT) + end * easedT;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number, isExiting: boolean) => {
  // For the exit transition - make it more dynamic
  if (isExiting) {
    const currentConfig = patternConfigs[patternConfigs.length - 2]; // Section 3
    const exitConfig = patternConfigs[patternConfigs.length - 1]; // Exit config
    
    // Use a more dramatic easing for exit transition
    const exitT = Math.sin(transitionProgress * Math.PI / 2); // More accelerated easing
    
    return {
      a: lerp(currentConfig.a, exitConfig.a, exitT),
      b: lerp(currentConfig.b, exitConfig.b, exitT),
      n: lerp(currentConfig.n, exitConfig.n, exitT),
      m: lerp(currentConfig.m, exitConfig.m, exitT),
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
