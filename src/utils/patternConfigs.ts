
// Pattern configurations for the animated background
import { lerp } from './shaderUtils';

export interface PatternConfig {
  a: number;
  b: number;
  n: number;
  m: number;
}

// Define pattern configurations for each transition point (0vh, 100vh, 200vh, 300vh)
export const patternConfigs: PatternConfig[] = [
  { a: 1.0, b: 1.0, n: 1.0, m: 2.0 },    // 0vh - Initial pattern
  { a: 3.0, b: -2.0, n: 2.5, m: 3.5 },   // 100vh - Second section
  { a: -4.0, b: 4.0, n: 4.0, m: 4.6 },   // 200vh - Third section
  { a: 5.0, b: -4.5, n: 6.0, m: 3.0 }    // 300vh - Final pattern
];

// Get interpolated configuration between current and next section
export const getInterpolatedConfig = (
  activeSection: number, 
  transitionProgress: number
): PatternConfig => {
  // Map the 3 sections (0, 1, 2) to the 4 pattern configurations
  let patternIndex: number;
  let nextPatternIndex: number;
  let adjustedProgress: number = transitionProgress;
  
  if (activeSection === 0) {
    // Section 1: Maps between patterns 0 and 1
    patternIndex = 0;
    nextPatternIndex = 1;
  } else if (activeSection === 1) {
    // Section 2: Maps between patterns 1 and 2
    patternIndex = 1;
    nextPatternIndex = 2;
  } else {
    // Section 3: Maps between patterns 2 and 3
    patternIndex = 2;
    nextPatternIndex = 3;
  }
  
  const currentConfig = patternConfigs[patternIndex];
  const nextConfig = patternConfigs[nextPatternIndex];
  
  return {
    a: lerp(currentConfig.a, nextConfig.a, adjustedProgress),
    b: lerp(currentConfig.b, nextConfig.b, adjustedProgress),
    n: lerp(currentConfig.n, nextConfig.n, adjustedProgress),
    m: lerp(currentConfig.m, nextConfig.m, adjustedProgress),
  };
};
