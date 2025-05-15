
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContentfulAsset } from "./useContentfulAsset";
import Preloader from "./Preloader";
import { useIsMobile } from "./use-mobile";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default Contentful asset ID for the video
const DEFAULT_VIDEO_ASSET_ID = "1A0xTn5l44SvzrObLYLQmG";

interface ScrubStickyVideoProps {
  // Optional: Allow passing a direct video URL instead of fetching from Contentful
  videoSrc?: string;
  // Optional: Contentful asset ID for the video
  contentfulAssetId?: string;
  // Optional: Height of the scroll area (default: 300vh)
  scrollHeight?: string;
}

const ScrubStickyVideo: React.FC<ScrubStickyVideoProps> = ({
  videoSrc: directVideoSrc,
  contentfulAssetId = DEFAULT_VIDEO_ASSET_ID,
  scrollHeight = "300vh"
}) => {
  const { data: videoAsset, isLoading } = useContentfulAsset(contentfulAssetId);
  const videoSrc = directVideoSrc || (videoAsset?.fields?.file?.url 
    ? `https:${videoAsset.fields.file.url}`
    : undefined);
  
  const [loadProgress, setLoadProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Simulate loading progress
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let timeElapsed = 0;
    const totalLoadTime = 12000; // 12 seconds total loading time
    
    const startingProgress = isLoading ? 0 : 60;
    setLoadProgress(startingProgress);
    
    if (showPreloader) {
      progressInterval = setInterval(() => {
        timeElapsed += 100;
        
        // Calculate progress percentage
        const baseProgress = Math.min(
          (timeElapsed / totalLoadTime) * 100, 
          videoSrc ? 98 : 90
        );
        
        const finalProgress = !isLoading && videoSrc ? 
          Math.min(baseProgress + 2, 100) : 
          baseProgress;
          
        setLoadProgress(Math.min(startingProgress + finalProgress, 100));
        
        if (finalProgress >= 100 || timeElapsed >= totalLoadTime) {
          clearInterval(progressInterval);
          
          if (timeElapsed >= totalLoadTime) {
            setLoadProgress(100);
          }
        }
      }, 100);
    }
    
    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading, showPreloader, videoSrc]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    document.body.style.overflow = 'auto';
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };

  // Set up scroll trigger for video scrubbing
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    
    if (!video || !container || !videoSrc) return;

    // Optimize video element
    video.controls = false;
    video.playsInline = true;
    video.muted = true;
    video.preload = "auto";
    
    // Explicitly pause the video during initialization
    video.pause();

    // Mobile-specific optimizations
    if (isMobile) {
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.style.transform = "translate3d(0,0,0)";
      video.style.willChange = "contents";
      
      if (video.readyState >= 1) {
        video.currentTime = 0.001;
      }
    } else {
      video.style.willChange = "contents";
      if (navigator.userAgent.indexOf("Chrome") > -1) {
        video.style.transform = "translate3d(0,0,0)";
      }
    }

    const setupScrollTrigger = () => {
      // Make sure we have video duration before setting up
      if (!video.duration && !isMobile) {
        console.log("Video duration not yet available");
        return;
      }

      // Clean up existing scroll trigger
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
      
      // Set initial state
      video.pause();
      if (isMobile) {
        video.currentTime = 0.001;
      }
      
      // Create new scroll trigger
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: isMobile ? 0.5 : 0.4,
        onUpdate: (self) => {
          const progress = self.progress;
          if (isNaN(progress) || !video.duration) return;
          
          const newTime = progress * video.duration;
          video.currentTime = newTime;
        }
      });
    };

    // Set up scroll trigger when video metadata is loaded
    const setupEvents = ['loadedmetadata', 'canplay', 'loadeddata'];
    const handleVideoReady = () => {
      setupScrollTrigger();
      
      // Clean up event listeners once setup is complete
      setupEvents.forEach(event => {
        video.removeEventListener(event, handleVideoReady);
      });
    };
    
    // Add event listeners for video ready state
    setupEvents.forEach(event => {
      video.addEventListener(event, handleVideoReady);
    });
    
    // Fallback setup after timeout
    const timeoutId = setTimeout(() => {
      setupScrollTrigger();
    }, 300);
    
    // Disable scrolling while preloader is active
    if (showPreloader) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      setupEvents.forEach(event => {
        video.removeEventListener(event, handleVideoReady);
      });
      clearTimeout(timeoutId);
      document.body.style.overflow = 'auto';
    };
  }, [videoSrc, isMobile, showPreloader]);

  return (
    <>
      {showPreloader && (
        <Preloader 
          progress={loadProgress} 
          onComplete={handlePreloaderComplete} 
        />
      )}
      <div className="relative">
        {/* Sticky video container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-0 bg-black">
          {videoSrc && (
            <video 
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
              onCanPlay={handleVideoLoaded}
              style={{
                opacity: videoLoaded ? 1 : 0,
                transition: "opacity 0.5s ease-in-out"
              }}
            />
          )}
        </div>
        
        {/* Scrollable container to control the video */}
        <div 
          ref={containerRef}
          className="bg-transparent"
          style={{ height: scrollHeight }}
        />
      </div>
    </>
  );
};

export default ScrubStickyVideo;
