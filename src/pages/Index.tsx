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
      const singleSectionHeight = 100; // Each section transition takes 100vh
      const viewportHeight = window.innerHeight;
      
      if (scrollPosition < 0) return;
      
      // Check if we're in exit transition (section is starting to leave viewport)
      const isLeavingViewport = bottom < viewportHeight && bottom > 0;
      setIsExiting(isLeavingViewport);
      
      // Calculate which section is active based on the new transitions
      let currentSection;
      let progress;
      
      if (scrollPosition >= 300) {
        // Beyond 300vh, we're in the exit transition
        currentSection = 2; // Keep section 3 active during exit
        
        if (isLeavingViewport) {
          // Calculate exit transition progress (0 -> 1 as section leaves)
          progress = Math.pow(1 - (bottom / viewportHeight), 2);
        } else {
          // Still in the container but beyond 300vh
          progress = Math.min((scrollPosition - 300) / 100, 1);
        }
      } else {
        // We're within the main transitions (0-300vh)
        currentSection = Math.min(Math.floor(scrollPosition / 100), 2);
        
        // Calculate transition progress within current section (0-1)
        const sectionScrollStart = currentSection * 100;
        const rawProgress = (scrollPosition - sectionScrollStart) / 100;
        
        // Apply ease-in-out smoothing
        progress = rawProgress < 0.5 
          ? 2 * rawProgress * rawProgress 
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
      }
      
      setTransitionProgress(Math.max(0, Math.min(1, progress)));
      
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
      
      {/* Scroll-jacked section - maintained at 400vh */}
      <div 
        ref={scrollContainerRef}
        className="h-[400vh] relative"
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
