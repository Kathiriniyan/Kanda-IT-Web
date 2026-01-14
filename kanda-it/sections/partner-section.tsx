"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSectionSnap } from "@/hooks/useSectionSnap";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection() {
  const snapRef = useSectionSnap<HTMLElement>({
    snapStart: "top 85%",
    pinScrollAmount: "+=100%",
  });

  const leftHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const rightHeadingRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const section = snapRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          toggleActions: "play reverse play reverse",
        },
      });

      tl.fromTo(
        [leftHeadingRef.current, rightHeadingRef.current],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      )
        .fromTo(
          q(".partner-card"),
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .fromTo(
          q(".partner-bottom-content"),
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.3"
        );
    }, snapRef);

    return () => ctx.revert();
  }, [snapRef]);

  return (
    <section
      ref={snapRef}
      className="relative z-10 py-12 md:py-16 bg-[#F9F9F9] overflow-hidden flex items-center"
    >
      <div className="w-full max-w-[1380px] mx-auto px-4 md:px-6 font-urbanist">
        {/* TOP HEADINGS */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
          <h2
            ref={leftHeadingRef}
            className="font-urbanist text-[36px] md:text-[75px] leading-[1.05] tracking-tight text-black font-normal max-w-full"
          >
            Your partner for digital <br /> growth through innovation
          </h2>

          {/* right text = same top/bottom spacing */}
          <div className="lg:max-w-[420px] flex">
            <p
              ref={rightHeadingRef}
              className="text-[15px] md:text-[17px] leading-snug text-black/80 my-auto"
            >
              Ready for scalable, custom-built, high-performance tech solutions
              for your business?
            </p>
          </div>
        </div>

        {/* MIDDLE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT BIG CARD */}
          <div className="partner-card lg:col-span-7 bg-white rounded-[30px] p-8 flex flex-row items-center justify-between border border-gray-100 shadow-sm">
            <div className="w-[42%]">
              <span className="inline-flex items-center rounded-md bg-[#F2C21A] px-3 py-1 text-[12px] font-bold text-black mb-4">
                Data Engineering
              </span>

              <h3 className="font-urbanist text-[26px] md:text-[32px] leading-[1.1] tracking-tight text-black font-normal mb-3">
                End-to-End Data <br /> Solutions
              </h3>

              <p className="text-[14px] leading-relaxed text-black/70">
                Transform raw information into a powerful asset. Our data team
                builds the infrastructure you need.
              </p>
            </div>

            {/* NESTED STATS CARD */}
            <div className="hidden md:block w-[55%] bg-white rounded-[24px] p-5 border border-black/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[13px] font-semibold text-gray-500 mb-3">
                    Data Statistics
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center">
                      <Image
                        src="/assets/partner/data.svg"
                        alt="Data"
                        width={42}
                        height={42}
                      />
                    </div>
                    <div>
                      <p className="text-[11px] text-gray-400">
                        Processing Power
                      </p>
                      <p className="text-[20px] font-bold text-black">1.2TB+</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 text-center min-w-[90px]">
                  <p className="text-[11px] text-gray-400">Accuracy</p>
                  <p className="text-[20px] font-bold text-black">99.9%</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 overflow-hidden">
                <Image
                  src="/assets/partner/graph.png"
                  alt="Graph"
                  width={380}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* RIGHT CARD (UPDATED: WHITE + SHADOW + CENTER CONTENT) */}
          <div className="partner-card lg:col-span-5 bg-black rounded-[30px] p-8 border border-black/5 shadow-md flex flex-col items-center justify-center text-center">
            <h3 className="font-urbanist text-[34px] md:text-[44px] leading-tight tracking-tight text-white font-normal mb-4">
              Custom Software
            </h3>

            <p className="text-[15px] md:text-[17px] leading-relaxed text-white">
              We develop high-performance mobile apps and ERP systems tailored to
              your specific workflow.
            </p>
          </div>
        </div>

        {/* BOTTOM METRIC (UPDATED ALIGNMENT LIKE IMAGE) */}
        <div className="partner-bottom-content mt-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6">
          {/* left metric sits more to the right */}
          <div className="lg:col-span-5 flex items-end justify-center lg:justify-end gap-3">
            <span className="text-[18px] text-black/60 font-medium mb-3">
              Up to
            </span>
            <span className="font-urbanist text-[80px] md:text-[110px] leading-none tracking-tighter text-black font-normal">
              90%
            </span>
          </div>

          {/* paragraph starts from left */}
          <div className="lg:col-span-7">
            <p className="text-[14px] md:text-[16px] leading-[1.6] text-black/70 max-w-[620px]">
              Boost your operational efficiency by up to 90%. Our custom SAP and
              POS systems streamline your workflow, reduce manual errors, and
              save time for growing your core business operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
