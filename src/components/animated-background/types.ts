
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
  { a: 0.0, b: 1.5, n: 3.5, m: 2.0 }    // Exit transition
];
