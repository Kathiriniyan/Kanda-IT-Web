"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

type UseSectionSnapOptions = {
  /** * How long the section stays locked. 
   * "+=150%" means user must scroll 1.5x the viewport height to unlock and leave.
   */
  pinScrollAmount?: string; 
  /** * Sensitivity for entering. "top 85%" means if the top of the section
   * reaches the bottom 15% of the screen, it snaps in.
   */
  snapStart?: string;
};

export function useSectionSnap<T extends HTMLElement>(
  options: UseSectionSnapOptions = {}
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { 
      pinScrollAmount = "+=150%", // Increased default for a better "hold"
      snapStart = "top 85%" 
    } = options;

    const ctx = gsap.context(() => {
      
      // 1. THE MAGNET (Snap INTO view)
      // This pulls the section to the top of the screen when it gets close.
      ScrollTrigger.create({
        trigger: el,
        start: snapStart, 
        end: "top top", 
        // We keep the snap HERE to pull you in, but we do NOT put a snap on the pin.
        snap: {
          snapTo: 1, 
          duration: { min: 0.3, max: 0.6 },
          ease: "power3.inOut",
          inertia: false,
        },
      });

      // 2. THE PIN (Hold in place)
      // This locks the screen. We REMOVED the 'snap' property here.
      // This prevents the "auto-scroll to bottom" bug.
      ScrollTrigger.create({
        trigger: el,
        start: "top top", 
        end: pinScrollAmount, 
        pin: true,            
        pinSpacing: true,     
        scrub: true,          
        anticipatePin: 1, // Smooths the locking moment
        onEnter: () => {
             // Optional: Force stop any inertia from previous scroll
             gsap.to(window, { scrollTo: { y: el }, duration: 0, overwrite: "auto" });
        }
      });

    }, ref);

    return () => ctx.revert();
  }, [options]);

  return ref;
}
