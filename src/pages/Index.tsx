
import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [transitionProgress, setTransitionProgress] = useState(0);
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
      const { top, height } = scrollContainer.getBoundingClientRect();
      const scrollPosition = -top;
      const sectionHeight = height / 4; // Change from 5 to 4 since we're going back to 400vh
      
      if (scrollPosition < 0) return;
      
      // Determine current active section
      let currentSection;
      if (scrollPosition >= sectionHeight * 3) {
        currentSection = 2; // Keep section 3 (index 2) active for the last sections
      } else {
        currentSection = Math.min(
          Math.floor(scrollPosition / sectionHeight),
          sections.length - 1
        );
      }
      
      // Calculate transition progress between sections (0 to 1)
      let progress;
      if (currentSection < 2) {
        // For sections 0 and 1, normal transition (0-1)
        const sectionStart = currentSection * sectionHeight;
        progress = (scrollPosition - sectionStart) / sectionHeight;
      } else {
        // For section 2 (index 2), extended transition (0-2) over the last 100vh
        const sectionStart = 2 * sectionHeight; // Start of section 3
        progress = (scrollPosition - sectionStart) / sectionHeight; // Progress over 1 section height
      }
      
      setTransitionProgress(Math.max(0, Math.min(1, progress))); // Changed from 2 to 1 to limit progress to 0-1 for 400vh
      
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
      
      {/* Scroll-jacked section - changed from 500vh to 400vh */}
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
