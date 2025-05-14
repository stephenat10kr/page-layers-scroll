
// Pattern configurations for the animated background
import { lerp, easeInOutCubic } from './shaderUtils';

export interface PatternConfig {
  a: number;
  b: number;
  n: number;
  m: number;
}

// Define pattern configurations for each transition point (0vh, 100vh, 200vh, 300vh, 400vh)
export const patternConfigs: PatternConfig[] = [
  { a: 1.0, b: 1.0, n: 1.0, m: 2.0 },    // 0vh - Initial pattern
  { a: 3.0, b: -2.0, n: 2.5, m: 3.5 },   // 100vh - Second section point
  { a: -4.0, b: 4.0, n: 4.0, m: 4.6 },   // 200vh - Third section point
  { a: 5.0, b: -4.5, n: 6.0, m: 3.0 },   // 300vh - Fourth section point
  { a: 2.0, b: 3.0, n: 8.0, m: 2.0 }     // 400vh - Final section point
];

// Get interpolated configuration from a single normalized scroll progress (0-1)
export const getInterpolatedConfigFromProgress = (
  normalizedScrollProgress: number
): PatternConfig => {
  // Map the normalizedScrollProgress (0-1) to segment (0-4)
  // 0: 0-0.25, 1: 0.25-0.5, 2: 0.5-0.75, 3: 0.75-1.0
  const segment = Math.min(Math.floor(normalizedScrollProgress * 4), 3);
  
  // Calculate progress within the current segment (0-1)
  const segmentProgress = (normalizedScrollProgress * 4) - segment;
  
  // Apply easing to the segment progress for smoother transitions
  const easedProgress = easeInOutCubic(segmentProgress);
  
  const currentConfig = patternConfigs[segment];
  const nextConfig = patternConfigs[segment + 1];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, easedProgress),
    b: lerp(currentConfig.b, nextConfig.b, easedProgress),
    n: lerp(currentConfig.n, nextConfig.n, easedProgress),
    m: lerp(currentConfig.m, nextConfig.m, easedProgress),
  };
};
