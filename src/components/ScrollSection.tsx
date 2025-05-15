
import React from 'react';

interface ScrollSectionProps {
  section: {
    id: string;
    title: string;
    description: string;
  };
  isActive: boolean;
  index: number;
  activeIndex: number;
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ 
  section, 
  isActive, 
  index, 
  activeIndex 
}) => {
  // Section 4 is a dummy/proxy section for animation, render nothing
  if (index === 3) {
    return null;
  }

  const isVisible = isActive || index === activeIndex + 1 || index === activeIndex - 1;
  
  const getTransformStyles = () => {
    if (!isActive) {
      if (index < activeIndex) {
        return { transform: 'translate3d(-100vw, 0, 0) scale(0.8)', opacity: 0 };
      } else if (index > activeIndex) {
        return { transform: 'translate3d(100vw, 0, 0) scale(0.8)', opacity: 0 };
      }
    }
    return { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 };
  };
  
  return (
    <div 
      className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      style={getTransformStyles()}
    >
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-4xl mx-4 shadow-2xl transform transition-all duration-1000">
        <h2 className="text-4xl font-bold mb-4 text-white">{section.title}</h2>
        <p className="text-xl text-white/90">{section.description}</p>
      </div>
    </div>
  );
};

export default ScrollSection;
