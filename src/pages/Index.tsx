
import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { RevealText } from "@/exportable-components";

console.log("Index page loaded, RevealText imported");

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
    },
    {
      id: "section4",
      title: "",
      description: ""
    }
  ];

  console.log("Rendering Index component with RevealText");
  
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      // Track scroll position for animations
      setScrollY(window.scrollY);
      
      const scrollContainer = scrollContainerRef.current;
      const { top, height, bottom } = scrollContainer.getBoundingClientRect();
      const scrollPosition = -top;
      const sectionHeight = height / 4; // Divide by 4 for four 100vh transition segments
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
      } else if (scrollPosition < sectionHeight * 3) {
        // 200vh to 300vh - Section 3 to Section 4 transition
        currentSection = 2;
        progress = (scrollPosition - sectionHeight * 2) / sectionHeight;
      } else {
        // 300vh to 400vh - Section 4 to End transition
        currentSection = 3;
        progress = (scrollPosition - sectionHeight * 3) / sectionHeight;
      }
      
      // Apply ease-in-out smoothing to the progress
      progress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
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
      {/* Normal scrolling section at top with HeroText integration */}
      <Hero />
      
      {/* RevealText component between Hero and animated sections */}
      <div className="relative z-30">
        <RevealText
          defaultText="Scroll down to discover more about our immersive experiences and interactive stories."
          buttonText="JOIN OUR COMMUNITY"
          backgroundColor="#1A1F2C"
          textColor="#FFFFFF"
          textGradient="linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%)"
        />
      </div>
      
      {/* Scroll-jacked section - 400vh for four 100vh transition segments */}
      <div 
        ref={scrollContainerRef}
        className="h-[400vh] relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
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
                   backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%), 
                                     radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 0%)`,
                   backgroundSize: "100px 100px"
                 }}>
            </div>
            <div className="absolute inset-0 w-full h-full" 
                 style={{
                   backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, 
                                    rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)`,
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
