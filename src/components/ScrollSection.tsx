
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  section: {
    id: string;
    title: string;
    description: string;
    color: string;
  };
  isActive: boolean;
  index: number;
  activeIndex: number;
}

const ScrollSection = ({ section, isActive, index, activeIndex }: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Calculate the offset based on how far we are from the active section
  const offset = index - activeIndex;
  
  // Only visible when it's the active section or the next section
  const isVisible = offset >= -1 && offset <= 1;
  
  // Calculate opacity and transform based on the offset
  let opacity = 1;
  let transform = "translateX(0)";
  
  if (offset > 0) {
    // Next section(s)
    opacity = 0.2;
    transform = "translateX(50%)";
  } else if (offset < 0) {
    // Previous section(s)
    opacity = 0;
    transform = "translateX(-50%)";
  }

  return (
    <div 
      ref={sectionRef}
      className={cn(
        "absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-1000 ease-in-out",
        section.color,
        isVisible ? "" : "hidden"
      )}
      style={{ 
        opacity,
        transform
      }}
    >
      <div className="max-w-3xl mx-auto text-center p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
        <p className="text-xl">{section.description}</p>
        
        <div className="mt-8 p-6 rounded-lg bg-slate-50">
          <p className="text-slate-600">
            This is section {index + 1} of our scroll-jacked experience. As you scroll, 
            the background stays fixed while the content animates smoothly between sections.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScrollSection;
