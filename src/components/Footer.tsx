
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="min-h-screen">
      <div className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center p-6">
          <h2 className="text-4xl font-bold mb-6">Back to Normal Scrolling</h2>
          <p className="text-xl mb-8">
            You've completed the scroll-jacked section and returned to a normal scrolling area.
          </p>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">About Us</h3>
              <p className="text-slate-600">
                This is a demonstration of combining normal scrolling with scroll-jacked sections.
                It creates an engaging and memorable user experience.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Services</h3>
              <ul className="space-y-2 text-slate-600">
                <li>Interactive Web Experiences</li>
                <li>UI/UX Design</li>
                <li>Frontend Development</li>
                <li>Creative Direction</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact</h3>
              <p className="text-slate-600">
                Get in touch to learn more about how we can help with your next project.
              </p>
              <Button className="mt-4" variant="outline">Contact Us</Button>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-200 text-center text-slate-500">
            <p>© 2025 Scroll Experience. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
