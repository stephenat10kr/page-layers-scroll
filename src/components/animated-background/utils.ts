
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values
export const lerp = (start: number, end: number, t: number) => {
  // Apply easing for smoother transitions
  const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return start * (1 - easedT) + end * easedT;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number, isExiting: boolean) => {
  const currentConfig = patternConfigs[activeSection];
  
  // For the last section, if we're in transition, blend to the "end" config
  if (activeSection === 3 && transitionProgress > 0) {
    const endConfig = patternConfigs[4]; // End state pattern
    return {
      a: lerp(currentConfig.a, endConfig.a, transitionProgress),
      b: lerp(currentConfig.b, endConfig.b, transitionProgress),
      n: lerp(currentConfig.n, endConfig.n, transitionProgress),
      m: lerp(currentConfig.m, endConfig.m, transitionProgress),
    };
  }
  
  // For other sections, check if we're transitioning to the next section
  if (activeSection < patternConfigs.length - 2 && !isExiting) {
    const nextConfig = patternConfigs[activeSection + 1];
    return {
      a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
      b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
      n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
      m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
    };
  }
  
  return currentConfig;
};
