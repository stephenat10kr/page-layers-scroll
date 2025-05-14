
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values
export const lerp = (start: number, end: number, t: number) => {
  // Apply easing for smoother transitions
  const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return start * (1 - easedT) + end * easedT;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number) => {
  // Normal section transitions
  const currentConfig = patternConfigs[activeSection];
  const nextConfig = patternConfigs[Math.min(activeSection + 1, patternConfigs.length - 1)];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
    b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
    n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
    m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
  };
};
