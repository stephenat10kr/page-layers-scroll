
// Pattern configurations for the animated background
import { lerp } from './shaderUtils';

export interface PatternConfig {
  a: number;
  b: number;
  n: number;
  m: number;
}

// Define pattern configurations for each transition point (0vh, 100vh, 200vh, 300vh, 400vh)
export const patternConfigs: PatternConfig[] = [
  { a: 1.0, b: 1.0, n: 1.0, m: 2.0 },    // 0vh - Initial pattern
  { a: 3.0, b: -2.0, n: 2.5, m: 3.5 },   // 100vh - Second section
  { a: -4.0, b: 4.0, n: 4.0, m: 4.6 },   // 200vh - Third section
  { a: 5.0, b: -4.5, n: 6.0, m: 3.0 },   // 300vh - Fourth section
  { a: 2.0, b: 3.0, n: 8.0, m: 2.0 }     // 400vh - Final pattern
];

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (
  activeSection: number, 
  transitionProgress: number
): PatternConfig => {
  const currentConfig = patternConfigs[activeSection];
  const nextConfig = patternConfigs[Math.min(activeSection + 1, patternConfigs.length - 1)];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, transitionProgress),
    b: lerp(currentConfig.b, nextConfig.b, transitionProgress),
    n: lerp(currentConfig.n, nextConfig.n, transitionProgress),
    m: lerp(currentConfig.m, nextConfig.m, transitionProgress),
  };
};
