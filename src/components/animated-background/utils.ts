
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values
export const lerp = (start: number, end: number, t: number) => {
  // Apply easing for smoother transitions
  const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return start * (1 - easedT) + end * easedT;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number, isExiting: boolean) => {
  // If we're in the last section and exiting, we don't need special handling
  // as there's no exit buffer anymore
  const currentConfig = patternConfigs[activeSection];
  
  // For the last section, or if we're exiting, don't transition to anything
  if (activeSection === patternConfigs.length - 1 || isExiting) {
    return currentConfig;
  }
  
  // Normal section transitions
  const nextConfig = patternConfigs[activeSection + 1];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
    b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
    n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
    m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
  };
};
