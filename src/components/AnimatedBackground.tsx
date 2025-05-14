
import React from 'react';
import WebGLRenderer from './animated-background/WebGLRenderer';
import { AnimatedBackgroundProps } from './animated-background/types';

const AnimatedBackground = ({ scrollY, activeSection, transitionProgress, isExiting }: AnimatedBackgroundProps) => {
  return (
    <WebGLRenderer 
      scrollY={scrollY}
      activeSection={activeSection}
      transitionProgress={transitionProgress}
      isExiting={isExiting}
    />
  );
};

export default AnimatedBackground;
