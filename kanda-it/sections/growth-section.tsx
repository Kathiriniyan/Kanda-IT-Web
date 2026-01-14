"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionSnap } from "@/hooks/useSectionSnap";

gsap.registerPlugin(ScrollTrigger);

export default function GrowthSection() {
  // ✅ SLIDE DECK CONFIG
  // URATION
  const snapRef = useSectionSnap<HTMLElement>({
    // Determines how "magnetic" the entry is. 
    // "top 85%" = As soon as it peeks 15% into view, it snaps full screen.
    snapStart: "top 85%", 
    
    // Determines how long you have to scroll to leave.
    // "+=100%" = Scroll 1 full screen height to unlock and leave.
    // Increase to "+=150%" if you want them to stay longer.
    pinScrollAmount: "+=100%", 
  });

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const iconGroupRef = useRef<HTMLDivElement | null>(null);
  const growthBadgeRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const section = snapRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);

      const words = title.querySelectorAll("[data-word]");
      const iconGroup = iconGroupRef.current;
      const badge = growthBadgeRef.current;
      const cards = q(".growth-card");
      const plays = q(".growth-play");

      // Initial states
      gsap.set(words, { opacity: 0, y: 50 });
      gsap.set(iconGroup, { opacity: 0, scale: 0.5 });
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(plays, { scale: 0, rotation: -45 });
      gsap.set(badge, { scale: 0, rotation: -90 });

      // Create a timeline that plays when the section LOCKS (Pins)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top", // Exactly when it snaps into full view
          toggleActions: "play reverse play reverse", // Replays if you leave and come back
        },
      });

      tl.to(iconGroup, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
        .to(
          words,
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          badge,
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6"
        )
        .to(
          plays,
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        );
    }, snapRef);

    return () => ctx.revert();
  }, [snapRef]);

  return (
    <section
      ref={snapRef}
      // Added z-10 to ensure it sits on top during the snap transition
      className="relative z-10 bg-white h-screen overflow-hidden flex flex-col items-center justify-center"
    >
      <div className="relative w-full px-4 md:px-8 lg:px-12 flex flex-col items-center">
        <div className="relative z-10 w-full max-w-[1400px] flex flex-col items-center lg:items-start lg:ml-32">
          <h2
            ref={titleRef}
            className="font-urbanist text-[clamp(44px,5vw,88px)] lg:text-[105px] leading-[1.0] tracking-tight text-black font-normal w-full"
          >
            {/* ROW 1 */}
            <div className="flex flex-col lg:flex-row items-center lg:justify-start relative w-full lg:w-fit mb-2 lg:mb-4 lg:ml-32">
              <div className="relative flex items-center justify-center lg:justify-start w-fit">
                <div
                  ref={iconGroupRef}
                  className="inline-flex items-center mr-3 md:mr-6 align-middle"
                >
                  <div className="relative z-0">
                    <Image
                      src="/assets/growth/flash.svg"
                      alt="Flash"
                      width={85}
                      height={85}
                      className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] drop-shadow-sm"
                    />
                  </div>
                  <div className="relative z-10 -ml-4 md:-ml-6">
                    <Image
                      src="/assets/growth/analytics.svg"
                      alt="Analytics"
                      width={85}
                      height={85}
                      className="w-[60px] h-[60px] md:w-[90px] md:h-[90px] drop-shadow-xl"
                    />
                  </div>
                </div>

                <span data-word className="inline-block relative z-10">
                  Solutions
                </span>

                {/* Desktop Card */}
                <div
                  className="
                    growth-card
                    hidden lg:block
                    mt-8 w-full max-w-[420px] relative z-20
                    lg:absolute lg:left-[100%]
                    lg:top-[80%] lg:-translate-y-[50%]
                    lg:mt-0 lg:ml-8 lg:max-w-[380px] lg:w-[400px]
                    pointer-events-none lg:pointer-events-auto
                  "
                >
                  <div className="growth-play absolute -left-6 -top-6 z-30 cursor-pointer hover:scale-105 transition-transform pointer-events-auto">
                    <Image
                      src="/assets/growth/play.svg"
                      alt="Play"
                      width={80}
                      height={80}
                      className="w-[70px] h-[70px] drop-shadow-2xl"
                    />
                  </div>

                  <div className="relative rounded-[24px] bg-white shadow-[0_30px_80px_-10px_rgba(0,0,0,0.08)] p-2">
                    <div className="rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        src="/assets/growth/graph.png"
                        alt="Analytics Dashboard"
                        width={420}
                        height={240}
                        className="w-full h-auto object-cover"
                        priority
                      />
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-100/50 blur-[60px] -z-10" />
                </div>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="flex items-center justify-center lg:justify-start w-full ml-0 lg:ml-14 mb-2 lg:mb-4">
              <span data-word className="inline-block mr-3 md:mr-6">
                that
              </span>
              <span
                data-word
                className="inline-block mr-3 md:mr-6 text-[#E5E5E5] font-light"
              >
                scale
              </span>
              <span data-word className="inline-block">
                your
              </span>
            </div>

            {/* ROW 3 */}
            <div className="flex items-center justify-center flex-wrap w-full lg:ml-auto">
              <span data-word className="inline-block mr-3 md:mr-6">
                business
              </span>

              <span
                ref={growthBadgeRef}
                className="inline-flex align-middle mx-1 md:mx-4"
              >
                <Image
                  src="/assets/growth/growth.svg"
                  alt="Growth"
                  width={90}
                  height={90}
                  className="w-[70px] h-[70px] md:w-[95px] md:h-[95px] drop-shadow-lg"
                />
              </span>

              <span data-word className="inline-block ml-2 md:ml-3">
                growth
              </span>
            </div>

            {/* Mobile Card */}
            <div className="growth-card lg:hidden mt-10 w-full flex justify-center">
              <div
                className="
                  relative z-20 w-full
                  max-w-[320px] sm:max-w-[360px] md:max-w-[420px]
                  pointer-events-none
                "
              >
                <div
                  className="
                    growth-play absolute -left-4 -top-4 md:-left-6 md:-top-6 z-30
                    cursor-pointer hover:scale-105 transition-transform pointer-events-auto
                  "
                >
                  <Image
                    src="/assets/growth/play.svg"
                    alt="Play"
                    width={80}
                    height={80}
                    className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] md:w-[70px] md:h-[70px] drop-shadow-2xl"
                  />
                </div>

                <div className="relative rounded-[24px] bg-white shadow-[0_30px_80px_-10px_rgba(0,0,0,0.08)] p-2">
                  <div className="rounded-[20px] overflow-hidden bg-gray-50 border border-gray-100">
                    <Image
                      src="/assets/growth/graph.png"
                      alt="Analytics Dashboard"
                      width={420}
                      height={240}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-100/50 blur-[60px] -z-10" />
              </div>
            </div>
          </h2>
        </div>
      </div>
    </section>
  );
}