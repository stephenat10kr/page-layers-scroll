import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ExportableForm from "./Form";
import { createContentfulClient } from "./contentfulClient";
import { ContentfulRevealTextEntry } from "./types";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

console.log("RevealText component file loaded and executing");

interface RevealTextProps {
  // Contentful configuration
  contentfulSpaceId?: string;
  contentfulAccessToken?: string;
  contentfulEntryId?: string;
  contentType?: string;
  // Form configuration
  hubspotPortalId?: string;
  hubspotFormId?: string;
  // Text configuration
  defaultText?: string;
  // Button configuration
  buttonText?: string;
  buttonClassName?: string;
  // Modal configuration
  formTitle?: string;
  // Styling
  backgroundColor?: string;
  textColor?: string;
  textGradient?: string;
}

const RevealText = ({
  contentfulSpaceId,
  contentfulAccessToken,
  contentfulEntryId,
  contentType = 'revealText',
  defaultText = "Default reveal text",
  buttonText = "STAY IN THE LOOP",
  buttonClassName = "h-[48px] rounded-full bg-coral text-black hover:bg-coral/90",
  formTitle = "Curious?<br>Sign up to hear about upcoming events and membership offerings.",
  hubspotPortalId,
  hubspotFormId,
  backgroundColor = "#203435",
  textColor = "#FFF4F1",
  textGradient = "linear-gradient(90deg, #FFB577 0%, #FFB577 100%)",
}: RevealTextProps) => {
  console.log("RevealText component rendering with props:", { 
    defaultText, 
    backgroundColor, 
    textColor, 
    textGradient 
  });
  
  const textRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  
  const contentfulClient = contentfulSpaceId && contentfulAccessToken 
    ? createContentfulClient(contentfulSpaceId, contentfulAccessToken) 
    : null;

  const {
    data: revealTextContent,
    isLoading,
    error
  } = useQuery({
    queryKey: ['revealText', contentfulSpaceId, contentfulEntryId],
    queryFn: async () => {
      console.log("Fetching reveal text from Contentful");
      if (!contentfulClient) {
        console.log("No Contentful client available, using default text");
        return null;
      }

      try {
        if (contentfulEntryId) {
          // If specific entry ID is provided, fetch that entry
          const entry = await contentfulClient.getEntry(contentfulEntryId);
          console.log("Contentful entry response:", entry);
          if (entry && entry.fields && 'revealText' in entry.fields) {
            const textContent = entry.fields.revealText as string;
            return {
              sys: entry.sys,
              fields: {
                text: textContent
              }
            } as ContentfulRevealTextEntry;
          }
        } else {
          // Otherwise query entries by content type
          const response = await contentfulClient.getEntries({
            content_type: contentType,
            limit: 1
          });
          
          console.log("Contentful response:", response);
          
          if (response.items.length === 0) {
            console.log(`No entries found for content type '${contentType}'`);
            return null;
          }
          
          const entry = response.items[0];
          
          if (entry && entry.fields && 'revealText' in entry.fields) {
            const textContent = entry.fields.revealText as string;
            return {
              sys: entry.sys,
              fields: {
                text: textContent
              }
            } as ContentfulRevealTextEntry;
          }
          console.log("Entry found but missing expected field, fields available:", Object.keys(entry.fields));
        }
        return null;
      } catch (err) {
        console.error("Error fetching from Contentful:", err);
        return null;
      }
    },
    enabled: !!contentfulClient
  });

  useEffect(() => {
    console.log("RevealText useEffect running", { 
      textRef: !!textRef.current,
      componentRef: !!componentRef.current 
    });
    
    const text = textRef.current;
    if (!text) {
      console.warn("Text ref is not available yet");
      return;
    }

    // Get the text content
    const originalText = text.textContent || "";
    console.log("Original text content:", originalText);

    // Split text into words
    const words = originalText.split(" ");

    // Create HTML structure with words and characters wrapped in spans
    const formattedHTML = words.map(word => {
      const charSpans = word.split("").map(char => `<span class="char">${char}</span>`).join("");
      return `<div class="word" style="display: inline-block; margin-right: 0.25em;">${charSpans}</div>`;
    }).join("");
    text.innerHTML = formattedHTML;
    
    try {
      // Make sure ScrollTrigger is registered before using it
      if (!ScrollTrigger) {
        console.error("ScrollTrigger is not available");
        return;
      }
      
      // Check if the component is visible
      const componentElement = componentRef.current;
      if (componentElement) {
        const rect = componentElement.getBoundingClientRect();
        console.log("RevealText component position:", {
          top: rect.top,
          bottom: rect.bottom,
          visible: rect.top < window.innerHeight && rect.bottom > 0
        });
      }

      console.log("Setting up GSAP animation");
      
      // Simplify the animation for debugging
      const spans = text.querySelectorAll(".char");
      console.log(`Found ${spans.length} spans to animate`);
      
      // Create a simple animation without ScrollTrigger first
      gsap.to(spans, {
        color: textColor,
        stagger: 0.01,
        duration: 0.5,
        delay: 0.5
      });
      
      // Try a simpler ScrollTrigger setup
      ScrollTrigger.create({
        trigger: text,
        start: "top bottom",
        onEnter: () => console.log("ScrollTrigger entered"),
        onLeave: () => console.log("ScrollTrigger left"),
        markers: true // Add markers for debugging
      });
      
      return () => {
        // Clean up animations
        gsap.killTweensOf(spans);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    } catch (err) {
      console.error("Error setting up GSAP animation:", err);
    }
  }, [revealTextContent, defaultText, textColor]); // Add textColor as dependency

  // If component is loading, render a placeholder
  if (isLoading) {
    console.log("RevealText is loading");
    return (
      <div 
        className="w-full py-24 relative z-20" 
        style={{ backgroundColor }}
        ref={componentRef}
      >
        <div className="grid grid-cols-12 max-w-[90%] mx-auto">
          <div className="col-span-12 md:col-span-9 h-32 animate-pulse bg-gray-800 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Error loading reveal text:", error);
  }

  // Always render component, even with error
  const textToDisplay = revealTextContent?.fields.text || defaultText;
  console.log("Rendering RevealText component with text:", textToDisplay);

  return (
    <>
      <div 
        className="w-full py-24 relative z-20 border-t border-b" 
        style={{ 
          backgroundColor,
          borderColor: "rgba(255, 255, 255, 0.1)"
        }}
        id="reveal-text-section"
        ref={componentRef}
      >
        <div className="grid grid-cols-12 max-w-[90%] mx-auto">
          <div 
            ref={textRef} 
            className="title-md col-span-12 md:col-span-9 mb-8 text-4xl font-bold" 
            style={{
              color: textColor,
              background: textGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: "1.2",
              whiteSpace: "pre-wrap",
              wordBreak: "normal"
            }}
          >
            {textToDisplay}
          </div>
          <div className="col-span-12 md:col-span-9">
            <Button 
              variant="default" 
              className={buttonClassName}
              onClick={() => {
                console.log("Button clicked");
                setIsFormOpen(true);
              }}
              style={{
                backgroundColor: "#9b87f5",
                color: "white"
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
      
      <ExportableForm 
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formTitle}
        hubspotPortalId={hubspotPortalId}
        hubspotFormId={hubspotFormId}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    </>
  );
};

export default RevealText;
