"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_W = 1380; // max container width you designed for
const DESIGN_H = 820; // designed "full view" height for section content

// ✅ set this to your fixed navbar height (px)
const NAV_H = 60;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export default function PartnerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const fitWrapRef = useRef<HTMLDivElement>(null);

  const counter1Ref = useRef<HTMLParagraphElement>(null);
  const counter2Ref = useRef<HTMLParagraphElement>(null);
  const counter3Ref = useRef<HTMLSpanElement>(null);

  const [desktopScale, setDesktopScale] = useState(1);

  /**
   * ✅ Fit-to-viewport scale (DESKTOP):
   * - includes navbar height so content never slides under fixed nav
   * - allows scaling lower on short-height screens
   */
  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // breathing room (avoid pin jitter / edges)
      const paddingW = vw * 0.06;
      const paddingH = vh * 0.08;

      const availableW = vw - paddingW;
      // ✅ subtract navbar height too
      const availableH = vh - paddingH - NAV_H;

      const scaleW = availableW / DESIGN_W;
      const scaleH = availableH / DESIGN_H;

      // ✅ allow lower on mini-height desktops so it doesn't collide with nav
      const minScale = vw >= 1024 ? 0.62 : 1; // only matters on desktop
      const s = clamp(Math.min(1, scaleW, scaleH), minScale, 1);

      setDesktopScale(s);
    };

    compute();

    const ro = new ResizeObserver(() => compute());
    ro.observe(document.documentElement);
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("resize", compute);
      ro.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const fitWrap = fitWrapRef.current;

    if (!section || !bg || !fitWrap) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      const setInitialStatesDesktop = () => {
        gsap.set([q(".partner-heading"), q(".partner-sub"), q(".partner-card"), q(".partner-bottom")], {
          opacity: 0,
          y: 32,
        });

        gsap.set(bg, {
          yPercent: 18,
          transformOrigin: "50% 100%",
          borderTopLeftRadius: "40vw",
          borderTopRightRadius: "40vw",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          willChange: "transform, border-radius",
        });

        if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
        if (counter2Ref.current) counter2Ref.current.innerText = "0%";
        if (counter3Ref.current) counter3Ref.current.innerText = "0%";
      };

      // ✅ Mobile/tablet: content should NOT start hidden
      const setInitialStatesMobile = () => {
        gsap.set([q(".partner-heading"), q(".partner-sub"), q(".partner-card"), q(".partner-bottom")], {
          opacity: 1,
          y: 0,
          clearProps: "transform",
        });

        // keep background stable so nothing “flies away” and hides content
        gsap.set(bg, {
          yPercent: 0,
          transformOrigin: "50% 100%",
          borderTopLeftRadius: "0vw",
          borderTopRightRadius: "0vw",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
          willChange: "transform, border-radius",
        });

        // counters start at 0, but visible content remains visible
        if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
        if (counter2Ref.current) counter2Ref.current.innerText = "0%";
        if (counter3Ref.current) counter3Ref.current.innerText = "0%";
      };

      const animateCounter = (
        element: HTMLElement | null,
        start: number,
        end: number,
        decimals: number = 0,
        suffix: string = ""
      ) => {
        if (!element) return;
        const proxy = { val: start };
        return gsap.to(proxy, {
          val: end,
          duration: 1.1,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => {
            element.innerText = proxy.val.toFixed(decimals) + suffix;
          },
        });
      };

      /**
       * ✅ Desktop pin ONLY when height is reasonable.
       * (Your desktop behavior stays the same)
       */
      mm.add("(min-width: 1024px) and (min-height: 700px)", () => {
        setInitialStatesDesktop();
        let countersPlayed = false;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: `top top+=${NAV_H}`,
            end: () => "+=" + Math.round(window.innerHeight * 2.4),
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            onEnter: () => gsap.set(section, { zIndex: 20 }),
            onLeave: () => gsap.set(section, { zIndex: 10 }),

            onUpdate: (self) => {
              if (!countersPlayed && self.progress > 0.28) {
                countersPlayed = true;
                animateCounter(counter1Ref.current, 0, 1.2, 1, "TB+");
                animateCounter(counter2Ref.current, 0, 99.9, 1, "%");
                animateCounter(counter3Ref.current, 0, 90, 0, "%");
              }

              if (countersPlayed && self.progress < 0.1) {
                countersPlayed = false;
                if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
                if (counter2Ref.current) counter2Ref.current.innerText = "0%";
                if (counter3Ref.current) counter3Ref.current.innerText = "0%";
              }
            },

            onLeaveBack: () => {
              countersPlayed = false;
              setInitialStatesDesktop();
            },
          },
        });

        tl.to(bg, {
          yPercent: 0,
          borderTopLeftRadius: "0vw",
          borderTopRightRadius: "0vw",
          duration: 0.12,
          ease: "power3.out",
        })
          .to(
            [q(".partner-heading"), q(".partner-sub")],
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.18, ease: "power2.out" },
            0.06
          )
          .to(
            q(".partner-card"),
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.22, ease: "power2.out" },
            0.12
          )
          .to(q(".partner-bottom"), { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.18)
          .to({}, { duration: 0.55 })
          .to([q(".partner-bottom"), q(".partner-card"), q(".partner-sub"), q(".partner-heading")], {
            opacity: 0,
            y: 28,
            stagger: 0.03,
            duration: 0.18,
            ease: "power2.inOut",
          })
          .to(
            bg,
            {
              yPercent: -105,
              borderTopLeftRadius: "40vw",
              borderTopRightRadius: "40vw",
              duration: 0.22,
              ease: "power3.inOut",
            },
            "<"
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /**
       * ✅ Mini-height desktop: keep your non-pin animation style
       * (but still okay because desktop-ish)
       */
      mm.add("(min-width: 1024px) and (max-height: 699px)", () => {
        setInitialStatesDesktop();
        let countersPlayed = false;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `top top+=${NAV_H}`,
            end: "bottom 20%",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!countersPlayed && self.progress > 0.3) {
                countersPlayed = true;
                animateCounter(counter1Ref.current, 0, 1.2, 1, "TB+");
                animateCounter(counter2Ref.current, 0, 99.9, 1, "%");
                animateCounter(counter3Ref.current, 0, 90, 0, "%");
              }
              if (countersPlayed && self.progress < 0.1) {
                countersPlayed = false;
                if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
                if (counter2Ref.current) counter2Ref.current.innerText = "0%";
                if (counter3Ref.current) counter3Ref.current.innerText = "0%";
              }
            },
            onLeaveBack: () => {
              countersPlayed = false;
              setInitialStatesDesktop();
            },
          },
        });

        tl.to(bg, {
          yPercent: 0,
          borderTopLeftRadius: "0vw",
          borderTopRightRadius: "0vw",
          duration: 0.22,
          ease: "power3.out",
        })
          .to(
            [q(".partner-heading"), q(".partner-sub")],
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.2, ease: "power2.out" },
            0.1
          )
          .to(
            q(".partner-card"),
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.22, ease: "power2.out" },
            0.16
          )
          .to(q(".partner-bottom"), { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.22)
          .to({}, { duration: 0.28 })
          .to([q(".partner-bottom"), q(".partner-card"), q(".partner-sub"), q(".partner-heading")], {
            opacity: 0,
            y: 24,
            stagger: 0.03,
            duration: 0.16,
            ease: "power2.inOut",
          })
          .to(
            bg,
            {
              yPercent: -105,
              borderTopLeftRadius: "40vw",
              borderTopRightRadius: "40vw",
              duration: 0.2,
              ease: "power3.inOut",
            },
            "<"
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /**
       * ✅ Mobile/tablet: NO hiding timeline.
       * Content stays visible. Only counters animate when section enters.
       */
      mm.add("(max-width: 1023px)", () => {
        setInitialStatesMobile();

        let countersPlayed = false;

        const st = ScrollTrigger.create({
          trigger: section,
          start: `top top+=${NAV_H + 40}`, // enters below navbar nicely
          end: "bottom top+=20%",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // play once when you’ve actually started seeing it
            if (!countersPlayed && self.progress > 0.12) {
              countersPlayed = true;
              animateCounter(counter1Ref.current, 0, 1.2, 1, "TB+");
              animateCounter(counter2Ref.current, 0, 99.9, 1, "%");
              animateCounter(counter3Ref.current, 0, 90, 0, "%");
            }
          },
          onLeaveBack: () => {
            // keep content visible; only reset numbers
            countersPlayed = false;
            if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
            if (counter2Ref.current) counter2Ref.current.innerText = "0%";
            if (counter3Ref.current) counter3Ref.current.innerText = "0%";
          },
        });

        return () => {
          st.kill();
        };
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={
        {
          ["--nav-h" as any]: `${NAV_H}px`,
        } as React.CSSProperties
      }
      className="
        relative z-10
        bg-[#F9F9F9]
        overflow-visible
        flex justify-center
        items-start
        min-h-[100svh]
        pt-[calc(var(--nav-h)+clamp(12px,2.5vh,44px))]
        pb-[clamp(14px,3vh,56px)]
      "
    >
      {/* BG Sheet */}
      <div ref={bgRef} className="absolute inset-0 w-full h-full bg-[#F9F9F9] z-0 pointer-events-none" />

      {/* ✅ scale wrapper only matters on desktop; on mobile it stays 1 */}
      <div
        ref={fitWrapRef}
        className="relative z-10 w-full"
        style={{
          transform: `scale(${desktopScale})`,
          transformOrigin: "top center",
        }}
      >
        <div className="w-full max-w-[1380px] mx-auto px-4 md:px-6 font-urbanist">
          {/* TOP */}
          <div className="flex flex-col lg:flex-row justify-between gap-3 md:gap-4 mb-6 lg:mb-[clamp(18px,3vh,48px)]">
            <h2
              className="
                partner-heading font-urbanist font-normal text-black tracking-tight leading-[1.05]
                text-[clamp(28px,6.4vw,75px)]
              "
            >
              Your partner for digital <br /> growth through innovation
            </h2>

            <div className="partner-sub lg:max-w-[420px] flex">
              <p className="text-[clamp(13px,3.6vw,17px)] leading-snug text-black/80 my-auto">
                Ready for scalable, custom-built, high-performance tech solutions for your business?
              </p>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
            {/* LEFT BIG CARD */}
            <div className="partner-card lg:col-span-7 bg-white rounded-[24px] md:rounded-[30px] p-5 md:p-8 flex flex-col md:flex-row items-center justify-between border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="w-full md:w-[42%] relative z-10">
                <span className="inline-flex items-center rounded-md bg-[#F2C21A] px-3 py-1 text-[12px] font-bold text-black mb-4">
                  Data Engineering
                </span>

                <h3 className="font-urbanist font-normal tracking-tight text-black leading-[1.1] mb-3 text-[clamp(20px,4.8vw,32px)]">
                  End-to-End Data <br /> Solutions
                </h3>

                <p className="text-[clamp(13px,3.4vw,14px)] leading-relaxed text-black/70 mb-5 md:mb-0">
                  Transform raw information into a powerful asset. Our data team builds the infrastructure you need.
                </p>
              </div>

              <div className="w-full md:w-[55%] bg-white rounded-[20px] md:rounded-[24px] p-4 md:p-5 border border-black/5 shadow-sm relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[13px] font-semibold text-gray-500 mb-3">Data Statistics</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center bg-gray-50 rounded-full">
                        <Image src="/assets/partner/data.svg" alt="Data" width={34} height={34} />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400">Processing Power</p>
                        <p ref={counter1Ref} className="text-[20px] font-bold text-black tabular-nums">
                          0TB+
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 text-center min-w-[90px]">
                    <p className="text-[11px] text-gray-400">Accuracy</p>
                    <p ref={counter2Ref} className="text-[20px] font-bold text-black tabular-nums">
                      0%
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <Image
                    src="/assets/partner/graph.png"
                    alt="Graph"
                    width={380}
                    height={150}
                    className="w-full h-auto"
                    priority={false}
                  />
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-50 blur-[50px] rounded-full -z-0 opacity-50" />
            </div>

            {/* RIGHT CARD */}
            <div className="partner-card lg:col-span-5 bg-black rounded-[24px] md:rounded-[30px] p-6 md:p-8 border border-black/5 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
                <h3 className="font-urbanist font-normal tracking-tight text-white leading-tight mb-3 md:mb-4 text-[clamp(24px,6vw,44px)]">
                  Custom Software
                </h3>

                <p className="text-[clamp(13px,3.6vw,17px)] leading-relaxed text-white/90">
                  We develop high-performance mobile apps and ERP systems tailored to your specific workflow.
                </p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* BOTTOM */}
          <div className="partner-bottom mt-6 lg:mt-[clamp(18px,3vh,40px)] grid grid-cols-1 lg:grid-cols-12 items-center gap-4 md:gap-6 pb-2">
            <div className="lg:col-span-5 flex items-end justify-center lg:justify-end gap-3">
              <span className="text-[16px] md:text-[18px] text-black/60 font-medium mb-3 md:mb-4">
                Up to
              </span>
              <span
                ref={counter3Ref}
                className="
                  font-urbanist font-normal tracking-tighter text-black leading-none tabular-nums
                  text-[clamp(48px,12vw,104px)]
                "
              >
                0%
              </span>
            </div>

            <div className="lg:col-span-7">
              <p className="text-[clamp(13px,3.5vw,16px)] leading-[1.6] text-black/70 max-w-[620px]">
                Boost your operational efficiency by up to 90%. Our custom SAP and POS systems streamline your workflow,
                reduce manual errors, and save time for growing your core business operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
