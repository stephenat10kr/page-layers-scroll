
import { PatternConfig, patternConfigs } from './types';

// Linear interpolation function to blend between values
export const lerp = (start: number, end: number, t: number) => {
  // Apply easing for smoother transitions
  const easedT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return start * (1 - easedT) + end * easedT;
};

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (activeSection: number, transitionProgress: number, isExiting: boolean) => {
  // We only have two configurations now - the main one and the exit one
  const mainConfig = patternConfigs[0];
  const exitConfig = patternConfigs[1];
  
  // If we're exiting, interpolate between the main and exit config
  if (isExiting) {
    return {
      a: lerp(mainConfig.a, exitConfig.a, transitionProgress),
      b: lerp(mainConfig.b, exitConfig.b, transitionProgress),
      n: lerp(mainConfig.n, exitConfig.n, transitionProgress),
      m: lerp(mainConfig.m, exitConfig.m, transitionProgress),
    };
  }
  
  // If not exiting, just use the main config
  return { ...mainConfig };
};
