
export interface AnimatedBackgroundProps {
  scrollY: number;
  activeSection: number;
  transitionProgress: number;
  isExiting: boolean;
}

export interface PatternConfig {
  a: number;
  b: number;
  n: number;
  m: number;
}

export const patternConfigs: PatternConfig[] = [
  { a: 1.0, b: 1.0, n: 1.0, m: 2.0 },   // Section 1
  { a: 2.0, b: -1.5, n: 2.0, m: 3.0 },  // Section 2
  { a: -3.0, b: 3.0, n: 3.0, m: 4.0 },  // Section 3
  { a: 2.5, b: -1.0, n: 4.0, m: 1.0 },  // Section 4
  { a: 1.5, b: -2.5, n: 5.0, m: 2.0 }   // End state - new pattern for transition
];
