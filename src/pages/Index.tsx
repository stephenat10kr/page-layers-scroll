
import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const [normalizedScrollProgress, setNormalizedScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
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
      description: "The third section with its own distinct animation pattern."
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
      
      if (scrollPosition < 0) return;
      
      // Calculate a single normalized scroll progress (0 to 1)
      const progress = Math.max(0, Math.min(1, scrollPosition / height));
      setNormalizedScrollProgress(progress);
      
      // For section visibility, we still need to know the active section
      const sectionHeight = height / 3; // 3 sections sharing 400vh total height
      const currentSection = Math.min(
        Math.floor(scrollPosition / sectionHeight),
        sections.length - 1
      );
      
      // Update active section for rendering content
      setActiveSection(currentSection);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections.length]);
  
  // We still need activeSection for content display purposes
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Normal scrolling section at top */}
      <Hero />
      
      {/* Scroll-jacked section - 400vh total, with 3 sections */}
      <div 
        ref={scrollContainerRef}
        className="h-[400vh] relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          {/* WebGL animated background - now only using normalizedScrollProgress */}
          <AnimatedBackground 
            scrollY={scrollY} 
            normalizedScrollProgress={normalizedScrollProgress}
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
