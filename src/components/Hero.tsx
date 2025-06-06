
import { HeroText } from "@/exportable-components";
import ScrubStickyVideo from "./ScrubStickyVideo";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative">
      {/* Video component as background with sticky positioning */}
      <div className="fixed top-0 left-0 w-full h-screen z-0">
        <ScrubStickyVideo />
      </div>
      
      {/* HeroText component scrolls normally on top of the sticky video */}
      <div className="relative z-10">
        <HeroText />
      </div>
      
      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg 
          className="w-10 h-10 mx-auto text-white opacity-70" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
