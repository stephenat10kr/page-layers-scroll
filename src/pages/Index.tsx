import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";

const Index = () => {
  const [activeSection, setActiveSection] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sections = [
    {
      id: "section1",
      title: "Section One",
      description: "This is the first scroll-jacked section with a unique animation.",
      color: "bg-blue-500"
    },
    {
      id: "section2",
      title: "Section Two",
      description: "As you scroll, this section smoothly transitions into view.",
      color: "bg-purple-500"
    },
    {
      id: "section3",
      title: "Section Three",
      description: "The final section in our scroll-jacked area before continuing to the footer.",
      color: "bg-pink-500"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const scrollContainer = scrollContainerRef.current;
      const { top, height } = scrollContainer.getBoundingClientRect();
      const scrollPosition = -top;
      const sectionHeight = height / 4; // Divide by 4 instead of 3 for the extra scroll
      
      if (scrollPosition < 0) return;
      
      // Keep section 3 active during the last 100vh of scroll
      let currentSection;
      if (scrollPosition >= sectionHeight * 3) {
        currentSection = 2; // Keep section 3 (index 2) active for the last section
      } else {
        currentSection = Math.min(
          Math.floor(scrollPosition / sectionHeight),
          sections.length - 1
        );
      }
      
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
      
      {/* Scroll-jacked section - increased from 300vh to 400vh */}
      <div 
        ref={scrollContainerRef}
        className="h-[400vh] relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
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
