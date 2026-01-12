'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap } from 'gsap';

export default function HeroSection() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const h1Ref = useRef<HTMLHeadingElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(h1Ref.current, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' })
        .fromTo(introRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
        .fromTo(cardRef.current, { opacity: 0, y: 24, scale: 0.99 }, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, '-=0.15')
        .fromTo(robotRef.current, { opacity: 0, y: 26, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.7 }, '-=0.55')
        .fromTo(badgeRef.current, { opacity: 0, y: 16, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.55 }, '-=0.45');
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="bg-white overflow-hidden">
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
              <div className="max-w-[360px] md:pl-10 md:max-w-[420px]">
                <h3 className="text-[15px] md:text-base font-bold text-black font-urbanist">Kanda-it</h3>
                <p className="mt-2 text-[12px] md:text-[13px] leading-relaxed text-zinc-600 font-medium">
                  is a technology partner specializing in Web and App Development, Automation, and Data
                  Management. We deliver custom ERP solutions, driving efficiency and digital transformation
                  for businesses seeking quality results.
                </p>
              </div>
            </div>
          </div>

          {/* ======================= HERO CARD (UPDATED) ======================= */}
          <div className="mt-8 md:mt-10 relative w-full">
            <div className="relative w-full max-w-[1280px] mx-auto overflow-visible">
              {/* Card */}
              <div
                ref={cardRef}
                className="
                  relative w-full
                  h-[350px] sm:h-[400px] md:h-[460px] lg:h-[500px]
                  rounded-[34px] sm:rounded-[38px] md:rounded-[44px]
                  overflow-hidden shadow-2xl text-white
                "
              >
                {/* Background */}
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#151515] to-[#E65C00]" />

                  {/* ✅ Bigger hero-bg look */}
                  <div
                    className="absolute inset-0 bg-[url('/assets/hero-bg.png')] bg-no-repeat opacity-95 mix-blend-overlay"
                    style={{
                      backgroundSize: '145% 145%',
                      backgroundPosition: '60% 55%',
                    }}
                  />

                  <div
                    className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay"
                    style={{ backgroundSize: '220px 220px' }}
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.55),transparent_60%)]" />

                  {/* ✅ Cut corner space (white block) */}
                  <div
                    className="
                      hidden md:block
                      absolute left-0 bottom-0
                      w-[340px] lg:w-[360px]
                      h-[180px] lg:h-[190px]
                      bg-white
                      rounded-tr-[44px]
                      z-[5]
                    "
                  />
                </div>

                {/* ✅ Content MUST be above robot so list stays visible */}
                <div className="relative z-40 h-full grid grid-cols-1 md:grid-cols-2 p-8 sm:p-10 md:p-12 lg:p-14">
                  {/* Left side */}
                  <div className="flex flex-col justify-between h-full">
                    <h2 className="font-urbanist font-bold leading-tight text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px]">
                      Seamless Digital <br />
                      Solutions &amp; Scalable <br />
                      Systems
                    </h2>

                    {/* ✅ Push list above the cut-corner area on md+ */}
                    <ul className="space-y-2 mt-6 md:mt-auto md:pb-[180px] lg:pb-[195px]">
                      {['Expert Full-Stack Talent', 'Automated Business Flow', 'Custom ERP Architecture'].map(
                        (item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 text-[12px] sm:text-[13px] md:text-[14px] font-medium text-white/90"
                          >
                            <span className="text-[#FF7A30] font-bold text-[16px] leading-none">✓</span>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col justify-end items-start md:items-end text-left md:text-right mt-6 md:mt-0">
                    <p className="text-[12px] sm:text-[13px] md:text-[14px] text-white/85 leading-relaxed max-w-[330px] mb-6 md:mb-9">
                      Deploy high-performance web applications and automated workflows. Scale your business
                      operations with our dedicated expert developers.
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        href="/"
                        className="bg-white text-black px-6 py-3 rounded-full text-[13px] font-bold shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        Schedule a free call
                      </Link>

                      <Link
                        href="/"
                        className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              </div>

              {/* Badge inside cut corner */}
              <div
                ref={badgeRef}
                className="
                  pointer-events-auto
                  mt-6 md:mt-0
                  md:absolute md:left-0 md:bottom-0
                  md:z-50
                  w-full max-w-[300px]
                  md:w-[320px]
                "
              >
                <div className="bg-[#EAEAEA] rounded-[24px] p-6 shadow-xl relative overflow-hidden md:ml-4 md:mb-4">
                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/50 rounded-full blur-xl" />

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-3xl font-bold font-urbanist text-black">100%</h4>
                      <p className="text-[10px] font-bold tracking-wider text-black mt-1 uppercase">
                        Quality Guarantee
                      </p>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    expert team delivers precision-engineered solutions tailored to your unique business goals
                    and digital growth.
                  </p>

                  <Link
                    href="/"
                    className="text-xs font-bold text-black border-b border-black/30 pb-0.5 hover:border-black transition-colors"
                  >
                    See services
                  </Link>
                </div>
              </div>

              {/* ✅ Robot: moved slightly RIGHT + behind text */}
              <div
                ref={robotRef}
                className="
                  absolute
                  left-[56%] md:left-[55%] lg:left-[54%]
                  bottom-0
                  z-30
                  pointer-events-none
                  w-[320px] sm:w-[440px] md:w-[600px] lg:w-[700px]
                "
                style={{
                  transform: 'translateX(-50%) translateY(-48%)',
                }}
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
            </div>
          </div>
          {/* ======================= END HERO CARD ======================= */}
        </div>
      </div>
    </section>
  );
}
