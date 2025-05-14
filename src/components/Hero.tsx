
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 animate-fade-in">
          Scroll Experience
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in animation-delay-150">
          Explore our interactive scrolling experience. Start by scrolling down this normal section, 
          then experience our scroll-jacked animation area, before reaching the final content.
        </p>
        <div className="pt-6 animate-fade-in animation-delay-300">
          <Button size="lg" className="rounded-full px-8">
            Start Scrolling
          </Button>
        </div>
        
        <div className="pt-20 animate-bounce">
          <svg 
            className="w-10 h-10 mx-auto text-slate-400" 
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
      
      <div className="my-32 max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold mb-2">Feature {item}</h3>
              <p className="text-slate-600">
                This is a normal scrolling section at the top of the page.
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto text-center my-20">
        <h2 className="text-2xl font-semibold mb-4">Scroll Down to Experience</h2>
        <p className="text-slate-600 mb-10">
          Continue scrolling to reach our special scroll-jacked section with animated transitions.
        </p>
      </div>
    </div>
  );
};

export default Hero;
