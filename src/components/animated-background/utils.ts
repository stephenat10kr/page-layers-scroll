
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values
export const lerp = (start: number, end: number, t: number) => {
  // Simplified linear interpolation without easing
  return start * (1 - t) + end * t;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number, isExiting: boolean) => {
  // For the exit transition - simplified
  if (isExiting) {
    const currentConfig = patternConfigs[Math.min(activeSection, 2)];
    return currentConfig; // Just use the current config without transition
  }
  
  // Get current config
  const currentConfig = patternConfigs[Math.min(activeSection, 2)];
  
  // If we're in section 2 transitioning to section 3, skip interpolation
  if (activeSection === 2) {
    return currentConfig;
  }
  
  // Normal section transitions for section 0->1 and 1->2
  const nextConfig = patternConfigs[Math.min(activeSection + 1, 2)];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
    b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
    n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
    m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
  };
};
