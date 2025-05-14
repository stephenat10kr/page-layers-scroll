
import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sections = [
    {
      id: "section1",
      title: "Section One",
      description: "This is the first scroll-jacked section with a unique animation."
    },
    {
      id: "section2",
      title: "Section Two",
      description: "As you scroll, this section smoothly transitions into view."
    },
    {
      id: "section3",
      title: "Section Three",
      description: "The final section in our scroll-jacked area before continuing to the footer."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      // Track scroll position for animations
      setScrollY(window.scrollY);
      
      const scrollContainer = scrollContainerRef.current;
      const { top, height, bottom } = scrollContainer.getBoundingClientRect();
      const scrollPosition = -top;
      const sectionHeight = height / 3; // Divide by 3 for three 100vh transition segments (removed exit buffer)
      const viewportHeight = window.innerHeight;
      
      if (scrollPosition < 0) return;
      
      // Check if we're in exit transition (section is starting to leave viewport)
      const isLeavingViewport = bottom < viewportHeight && bottom > 0;
      setIsExiting(isLeavingViewport);
      
      // Determine which section is active based on our transition points
      let currentSection;
      let progress;
      
      // Calculate section and transition progress based on scroll position
      if (scrollPosition < sectionHeight) {
        // 0vh to 100vh - Section 1 to Section 2 transition
        currentSection = 0;
        progress = scrollPosition / sectionHeight;
      } else if (scrollPosition < sectionHeight * 2) {
        // 100vh to 200vh - Section 2 to Section 3 transition
        currentSection = 1;
        progress = (scrollPosition - sectionHeight) / sectionHeight;
      } else {
        // 200vh to 300vh - Section 3 (no more exit transition)
        currentSection = 2;
        progress = 1;
      }
      
      // If we're leaving the viewport, calculate exit progress
      if (isLeavingViewport) {
        // Calculate exit transition progress (0 -> 1 as section leaves)
        progress = Math.pow(1 - (bottom / viewportHeight), 2);
      } else {
        // Apply ease-in-out smoothing to the progress
        progress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      }
      
      // Ensure progress is within bounds
      progress = Math.max(0, Math.min(1, progress));
      setTransitionProgress(progress);
      
      if (currentSection >= 0 && currentSection < sections.length) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Normal scrolling section at top */}
      <Hero />
      
      {/* Scroll-jacked section - 300vh for three 100vh transition segments (removed exit buffer) */}
      <div 
        ref={scrollContainerRef}
        className="h-[300vh] relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          {/* WebGL animated background */}
          <AnimatedBackground 
            scrollY={scrollY} 
            activeSection={activeSection}
            transitionProgress={transitionProgress}
            isExiting={isExiting}
          />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 w-full h-full" 
                 style={{ 
                   backgroundImage: `radial-gradient(circle at 25px 25px, rgba(0,0,0,0.2) 2%, transparent 0%), 
                                     radial-gradient(circle at 75px 75px, rgba(0,0,0,0.2) 2%, transparent 0%)`,
                   backgroundSize: "100px 100px"
                 }}>
            </div>
            <div className="absolute inset-0 w-full h-full" 
                 style={{
                   backgroundImage: `linear-gradient(45deg, rgba(30,41,59,0.1) 25%, transparent 25%, transparent 50%, 
                                    rgba(30,41,59,0.1) 50%, rgba(30,41,59,0.1) 75%, transparent 75%, transparent)`,
                   backgroundSize: "60px 60px"
                 }}>
            </div>
          </div>
          
          {sections.map((section, index) => (
            <ScrollSection
              key={section.id}
              section={section}
              isActive={index === activeSection}
              index={index}
              activeIndex={activeSection}
            />
          ))}
        </div>
      </div>
      
      {/* Normal scrolling section at bottom */}
      <Footer />
    </div>
  );
};

export default Index;
