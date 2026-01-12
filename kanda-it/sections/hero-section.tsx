"use client";

import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";

export default function HeroSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Animation Refs
  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  // State for the dynamic SVG path
  const [clipPathId] = useState("hero-card-clip");
  const [pathD, setPathD] = useState("");

  // 1. GSAP Animation Setup (Hero card parts animate together)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        [h1Ref.current, introRef.current],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.75, ease: "power4.out", stagger: 0 }
      ).fromTo(
        [cardRef.current, robotRef.current, badgeRef.current],
        { opacity: 0, y: 22, scale: 0.99 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0 },
        "-=0.25"
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  // 2. Logic to Generate the SVG Path for Rounded Notch (notch only on >=1024)
  useLayoutEffect(() => {
    const updatePath = () => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Notch only on >=1024 (lg)
      const isLg = window.innerWidth >= 1024;

      let notchW = 0;
      let notchH = 0;

      if (isLg) {
        notchW = Math.max(280, Math.min(window.innerWidth * 0.26, 340));
        notchH = Math.max(160, Math.min(window.innerWidth * 0.18, 210));
      }

      const R = 24; // Outer Card Radius
      const notchR = 24; // Inner Notch Radius

      let d = "";

      if (!isLg) {
        d = `
          M 0,${R}
          Q 0,0 ${R},0
          L ${W - R},0
          Q ${W},0 ${W},${R}
          L ${W},${H - R}
          Q ${W},${H} ${W - R},${H}
          L ${R},${H}
          Q 0,${H} 0,${H - R}
          Z
        `;
      } else {
        d = `
          M 0,${R}
          Q 0,0 ${R},0
          L ${W - R},0
          Q ${W},0 ${W},${R}
          L ${W},${H - R}
          Q ${W},${H} ${W - R},${H}

          L ${notchW + notchR},${H}
          Q ${notchW},${H} ${notchW},${H - notchR}
          L ${notchW},${H - notchH + notchR}
          Q ${notchW},${H - notchH} ${notchW - notchR},${H - notchH}
          L ${notchR},${H - notchH}
          Q 0,${H - notchH} 0,${H - notchH - notchR}
          L 0,${R}
          Z
        `;
      }

      setPathD(d.replace(/\s+/g, " "));
    };

    updatePath();

    const resizeObserver = new ResizeObserver(() => updatePath());
    if (cardRef.current) resizeObserver.observe(cardRef.current);
    window.addEventListener("resize", updatePath);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, []);

  return (
    <section ref={wrapRef} className="bg-white overflow-hidden">
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id={clipPathId} clipPathUnits="userSpaceOnUse">
            <path d={pathD} />
          </clipPath>
        </defs>
      </svg>

      <div className="px-4 md:px-8 lg:px-12 xl:px-16 pt-28 md:pt-36 pb-20">
        <div className="mx-auto max-w-[1400px]">
          {/* ======================= HEADING ======================= */}
          <div className="text-center mb-10 md:mb-14">
            <h1
              ref={h1Ref}
              className="
                font-urbanist font-light uppercase text-black
                text-[clamp(40px,5.5vw,96px)]
                leading-[1.08] tracking-[0.06em]
              "
            >
              <div className="relative inline-block w-full">
                <span className="absolute left-0 top-0 h-[2px] w-[72px] bg-[#FF5F15] md:hidden" />

                <div className="hidden md:inline-flex items-center gap-4 md:gap-8 flex-wrap justify-center">
                  <span className="font-extrabold">EMPOWERING DIGITAL</span>
                  <span className="h-[2px] w-[90px] md:w-[140px] lg:w-[190px] bg-[#FF5F15]" />
                </div>

                <div className="md:hidden pt-4">
                  <div className="flex justify-center">
                    <span className="font-extrabold">EMPOWERING DIGITAL</span>
                  </div>
                  <div className="flex justify-center mt-2">
                    <span>INNOVATION &amp; GROWTH</span>
                  </div>
                </div>

                <div className="hidden md:inline-flex items-center gap-4 md:gap-8 flex-wrap justify-center md:mt-2">
                  <span className="h-[2px] w-[90px] md:w-[140px] lg:w-[190px] bg-[#FF5F15]" />
                  <span>INNOVATION &amp; GROWTH</span>
                </div>

                <span className="absolute right-0 bottom-0 h-[2px] w-[72px] bg-[#FF5F15] md:hidden" />
              </div>
            </h1>
          </div>

          {/* ======================= INTRO ======================= */}
          <div className="mt-8 lg:mt-12">
            <div ref={introRef} className="w-full">
              <div
                className="
                  max-w-[360px] md:pl-10 md:max-w-[420px]
                  mx-auto md:mx-0
                  text-center md:text-left
                "
              >
                <h3 className="text-[15px] md:text-base font-bold text-black font-urbanist">
                  Kanda-it
                </h3>
                <p className="mt-2 text-[12px] md:text-[13px] leading-relaxed text-zinc-600 font-medium">
                  is a technology partner specializing in Web and App
                  Development, Automation, and Data Management. We deliver
                  custom ERP solutions, driving efficiency and digital
                  transformation for businesses seeking quality results.
                </p>
              </div>
            </div>
          </div>

          {/* ======================= HERO CARD ======================= */}
          <div className="mt-8 md:mt-10 relative w-full">
            <div
              className="
                relative w-full max-w-[1280px] mx-auto overflow-visible
                [--notch-w:0px] [--notch-h:0px]
                lg:[--notch-w:clamp(280px,26vw,340px)]
                lg:[--notch-h:clamp(160px,18vw,210px)]
              "
            >
              {/* Card */}
              <div
                ref={cardRef}
                className="
                  relative w-full
                  h-[650px] sm:h-[720px] lg:h-[500px]
                  shadow-2xl text-white
                "
                style={{
                  clipPath: `url(#${clipPathId})`,
                  willChange: "clip-path",
                }}
              >
                {/* Background */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#151515] to-[#E65C00]" />

                  <div
                    className="
                      absolute inset-0
                      bg-[url('/assets/hero-bg-mobile.png')] lg:bg-[url('/assets/hero-bg.png')]
                      bg-no-repeat opacity-95 mix-blend-overlay
                    "
                    style={{
                      backgroundSize: "210% 210%",
                      backgroundPosition: "55% 60%",
                    }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.55),transparent_60%)]" />
                </div>

                {/* Content */}
                <div
                  className="
                    relative z-40 h-full
                    grid grid-cols-1 lg:grid-cols-2
                    p-6 sm:p-8 lg:p-14
                    lg:pb-14
                    pb-[220px] sm:pb-[250px]
                    gap-4 sm:gap-5 lg:gap-0
                  "
                >
                  {/* Left side */}
                  <div className="flex flex-col justify-between h-full text-center lg:text-left items-center lg:items-start">
                    <h2 className="font-urbanist font-semibold leading-tight text-[20px] sm:text-[22px] lg:text-[28px]">
                      <span className="lg:hidden">
                        Seamless Digital Solutions &amp; Scalable Systems
                      </span>
                      <span className="hidden lg:inline">
                        Seamless Digital <br />
                        Solutions &amp; Scalable <br />
                        Systems
                      </span>
                    </h2>

                    <ul
                      className="space-y-2 mt-2 sm:mt-3 lg:mt-auto w-full max-w-[360px] lg:max-w-none mx-auto lg:mx-0"
                      style={{ paddingBottom: "calc(var(--notch-h) + 18px)" }}
                    >
                      {[
                        "Expert Full-Stack Talent",
                        "Automated Business Flow",
                        "Custom ERP Architecture",
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-center lg:justify-start gap-3 text-[12px] sm:text-[13px] lg:text-[14px] font-medium text-white/90"
                        >
                          <span className="text-[#FF7A30] font-bold text-[16px] leading-none">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col justify-start lg:justify-center items-center lg:items-end text-center lg:text-right mt-0">
                    <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-white/85 leading-relaxed max-w-[330px] mb-3 sm:mb-4 lg:mb-9">
                      Deploy high-performance web applications and automated
                      workflows. Scale your business operations with our
                      dedicated expert developers.
                    </p>

                    <div className="flex items-center justify-center lg:justify-end gap-3">
                      <Link
                        href="/"
                        className="
                          bg-white text-black px-6 py-3 rounded-full text-[13px] font-bold shadow-lg
                          hover:bg-gray-100 transition-colors
                          inline-flex items-center justify-center
                          whitespace-nowrap
                        "
                      >
                        Schedule a free call
                      </Link>

                      <Link
                        href="/"
                        className="
                          w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-lg
                          hover:bg-gray-100 transition-colors
                          shrink-0
                        "
                        aria-label="Open"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 13L13 1M13 1H5M13 1V9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* ROBOT INSIDE CARD ON <1024 */}
                <div
                  className="
                    absolute inset-x-0 bottom-0
                    z-30
                    lg:hidden
                    pointer-events-none
                    flex justify-center
                  "
                >
                  <div className="w-[320px] sm:w-[440px]">
                    <Image
                      src="/assets/hero.png"
                      alt="Robot Head"
                      width={1400}
                      height={1400}
                      priority
                      className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Robot (DESKTOP >=1024) */}
              <div
                ref={robotRef}
                className="
                  absolute
                  left-[56%] lg:left-[54%]
                  bottom-[5px]
                  z-30
                  pointer-events-none
                  w-[320px] sm:w-[440px] lg:w-[700px]
                  hidden lg:block
                "
                style={{ transform: "translateX(-50%) translateY(-48%)" }}
              >
                <Image
                  src="/assets/hero.png"
                  alt="Robot Head"
                  width={1400}
                  height={1400}
                  priority
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Badge (mobile full width, desktop notch width + right margin) */}
              <div
                ref={badgeRef}
                className="
                  pointer-events-auto
                  mt-5 lg:mt-0
                  lg:absolute lg:left-0 lg:bottom-0
                  lg:z-50
                  mx-auto lg:mx-0

                  w-full
                  max-w-[100vw]
                  lg:max-w-none

                  lg:w-[calc(var(--notch-w)-20px)]
                  lg:mr-8
                  xl:mr-10
                "
                style={{
                  transform: "translate3d(0,0,0)",
                  marginBottom: "clamp(0px, 0.9vw, 4px)",
                }}
              >
                <div
                  className="bg-[#EAEAEA] rounded-[24px] p-6 shadow-xl relative overflow-hidden"
                  style={{
                    minHeight: "max(180px, calc(var(--notch-h) - 18px))",
                  }}
                >
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/50 rounded-full blur-xl" />

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-3xl font-bold font-urbanist text-black">
                        100%
                      </h4>
                      <p className="text-[10px] font-bold tracking-wider text-black mt-1 uppercase">
                        Quality Guarantee
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 11L11 1M11 1H3M11 1V9"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <p className="text-[11px] leading-tight text-zinc-600 mt-3 mb-4">
                    expert team delivers precision-engineered solutions tailored
                    to your unique business goals and digital growth.
                  </p>

                  <Link
                    href="/"
                    className="text-xs font-bold text-black border-b border-black/30 pb-0.5 hover:border-black transition-colors"
                  >
                    See services
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ======================= END HERO CARD ======================= */}
        </div>
      </div>
    </section>
  );
}
