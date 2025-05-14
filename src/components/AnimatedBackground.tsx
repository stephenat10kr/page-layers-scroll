
import React from 'react';
import WebGLRenderer from './animated-background/WebGLRenderer';
import { AnimatedBackgroundProps } from './animated-background/types';

const AnimatedBackground = ({ scrollY, activeSection, transitionProgress }: AnimatedBackgroundProps) => {
  return (
    <WebGLRenderer 
      scrollY={scrollY}
      activeSection={activeSection}
      transitionProgress={transitionProgress}
    />
  );
};

export default AnimatedBackground;
