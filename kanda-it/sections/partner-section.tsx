"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PartnerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const counter1Ref = useRef<HTMLParagraphElement>(null);
  const counter2Ref = useRef<HTMLParagraphElement>(null);
  const counter3Ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      const setInitialStates = () => {
        gsap.set([q(".partner-heading"), q(".partner-sub"), q(".partner-card"), q(".partner-bottom")], {
          opacity: 0,
          y: 40,
        });

        // BG "sheet" below → rises up centered
        gsap.set(bg, {
          yPercent: 105,
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
          duration: 1.25,
          ease: "power2.out",
          onUpdate: () => {
            element.innerText = proxy.val.toFixed(decimals) + suffix;
          },
        });
      };

      setInitialStates();

      // ==========================
      // DESKTOP "SLIDE-DECK" (>=1024px)
      // reveal -> hold -> hide (pinned with scrub)
      // ==========================
      mm.add("(min-width: 1024px)", () => {
        setInitialStates();

        let countersPlayed = false;

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=260%", // total "slide deck" scroll length
            pin: true,
            pinSpacing: true,
            scrub: 1, // slow reveal controlled by scroll
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // Play counters once when reveal has mostly completed
              if (!countersPlayed && self.progress > 0.32) {
                countersPlayed = true;
                animateCounter(counter1Ref.current, 0, 1.2, 1, "TB+");
                animateCounter(counter2Ref.current, 0, 99.9, 1, "%");
                animateCounter(counter3Ref.current, 0, 90, 0, "%");
              }

              // If user scrolls back up before reveal, reset counters
              if (countersPlayed && self.progress < 0.15) {
                countersPlayed = false;
                if (counter1Ref.current) counter1Ref.current.innerText = "0TB+";
                if (counter2Ref.current) counter2Ref.current.innerText = "0%";
                if (counter3Ref.current) counter3Ref.current.innerText = "0%";
              }
            },
            onLeaveBack: () => {
              setInitialStates();
              countersPlayed = false;
            },
          },
        });

        // Phase A (0% -> ~35%): reveal BG + content
        tl.to(
          bg,
          {
            yPercent: 0,
            borderTopLeftRadius: "0vw",
            borderTopRightRadius: "0vw",
            duration: 0.35,
            ease: "power3.inOut",
          },
          0
        )
          .to(
            [q(".partner-heading"), q(".partner-sub")],
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.22, ease: "power2.out" },
            0.10
          )
          .to(
            q(".partner-card"),
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.22, ease: "power2.out" },
            0.18
          )
          .to(
            q(".partner-bottom"),
            { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" },
            0.26
          );

        // Phase B (~35% -> ~75%): HOLD (section stays readable while user scrolls)
        // (No animations here — it's intentionally empty)
        tl.to({}, { duration: 0.40 });

        // Phase C (~75% -> 100%): hide/slide out like deck
        tl.to(
          [q(".partner-bottom"), q(".partner-card"), q(".partner-sub"), q(".partner-heading")],
          { opacity: 0, y: 40, stagger: 0.03, duration: 0.18, ease: "power2.inOut" }
        ).to(
          bg,
          {
            yPercent: 105,
            borderTopLeftRadius: "40vw",
            borderTopRightRadius: "40vw",
            duration: 0.25,
            ease: "power3.inOut",
          },
          "<"
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      // ==========================
      // TABLET/MOBILE (<1024px)
      // No pin (prevents "stuck"), but still reveal + hide
      // ==========================
      mm.add("(max-width: 1023px)", () => {
        setInitialStates();

        let countersPlayed = false;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
            onEnter: () => {
              if (!countersPlayed) {
                countersPlayed = true;
                animateCounter(counter1Ref.current, 0, 1.2, 1, "TB+");
                animateCounter(counter2Ref.current, 0, 99.9, 1, "%");
                animateCounter(counter3Ref.current, 0, 90, 0, "%");
              }
            },
            onLeave: () => {
              // hide when user goes past the section
              gsap.to([q(".partner-bottom"), q(".partner-card"), q(".partner-sub"), q(".partner-heading")], {
                opacity: 0,
                y: 30,
                duration: 0.35,
                ease: "power2.inOut",
                overwrite: true,
              });
              gsap.to(bg, {
                yPercent: 105,
                borderTopLeftRadius: "40vw",
                borderTopRightRadius: "40vw",
                duration: 0.45,
                ease: "power3.inOut",
                overwrite: true,
              });
            },
            onLeaveBack: () => {
              countersPlayed = false;
              setInitialStates();
            },
          },
        });

        tl.to(bg, {
          yPercent: 0,
          borderTopLeftRadius: "0vw",
          borderTopRightRadius: "0vw",
          duration: 0.8,
          ease: "power3.inOut",
        })
          .to(
            [q(".partner-heading"), q(".partner-sub")],
            { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
            "-=0.45"
          )
          .to(
            q(".partner-card"),
            { opacity: 1, y: 0, stagger: 0.12, duration: 0.55, ease: "power2.out" },
            "-=0.35"
          )
          .to(q(".partner-bottom"), { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, "-=0.35");

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="
        relative z-10 bg-white
        min-h-[100svh]
        overflow-visible
        flex items-center justify-center
        py-12 md:py-14
      "
    >
      {/* BG Sheet */}
      <div
        ref={bgRef}
        className="absolute inset-0 w-full h-full bg-[#F9F9F9] z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-4 md:px-6 font-urbanist">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8 lg:mb-12">
          <h2
            className="
              partner-heading font-urbanist font-normal text-black tracking-tight leading-[1.05]
              text-[clamp(30px,4.2vw,75px)]
            "
          >
            Your partner for digital <br /> growth through innovation
          </h2>

          <div className="partner-sub lg:max-w-[420px] flex">
            <p className="text-[clamp(14px,1.35vw,17px)] leading-snug text-black/80 my-auto">
              Ready for scalable, custom-built, high-performance tech solutions for your business?
            </p>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* LEFT BIG CARD */}
          <div className="partner-card lg:col-span-7 bg-white rounded-[30px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="w-full md:w-[42%] relative z-10">
              <span className="inline-flex items-center rounded-md bg-[#F2C21A] px-3 py-1 text-[12px] font-bold text-black mb-4">
                Data Engineering
              </span>

              <h3 className="font-urbanist font-normal tracking-tight text-black leading-[1.1] mb-3 text-[clamp(22px,2.2vw,32px)]">
                End-to-End Data <br /> Solutions
              </h3>

              <p className="text-[clamp(13px,1.05vw,14px)] leading-relaxed text-black/70 mb-6 md:mb-0">
                Transform raw information into a powerful asset. Our data team builds the infrastructure you need.
              </p>
            </div>

            <div className="w-full md:w-[55%] bg-white rounded-[24px] p-5 border border-black/5 shadow-sm relative z-10 transition-transform duration-500 group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[13px] font-semibold text-gray-500 mb-3">Data Statistics</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full">
                      <Image src="/assets/partner/data.svg" alt="Data" width={24} height={24} />
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
                />
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-blue-50 blur-[50px] rounded-full -z-0 opacity-50" />
          </div>

          {/* RIGHT CARD */}
          <div className="partner-card lg:col-span-5 bg-black rounded-[30px] p-8 border border-black/5 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="relative z-10 transition-transform duration-500 group-hover:scale-105">
              <h3 className="font-urbanist font-normal tracking-tight text-white leading-tight mb-4 text-[clamp(28px,3vw,44px)]">
                Custom Software
              </h3>

              <p className="text-[clamp(14px,1.35vw,17px)] leading-relaxed text-white/90">
                We develop high-performance mobile apps and ERP systems tailored to your specific workflow.
              </p>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        </div>

        {/* BOTTOM */}
        <div className="partner-bottom mt-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-6 pb-4">
          <div className="lg:col-span-5 flex items-end justify-center lg:justify-end gap-3">
            <span className="text-[18px] text-black/60 font-medium mb-4">Up to</span>
            <span
              ref={counter3Ref}
              className="font-urbanist font-normal tracking-tighter text-black leading-none tabular-nums
                text-[clamp(64px,6.5vw,110px)]
              "
            >
              0%
            </span>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[clamp(13px,1.25vw,16px)] leading-[1.6] text-black/70 max-w-[620px]">
              Boost your operational efficiency by up to 90%. Our custom SAP and POS systems streamline your workflow,
              reduce manual errors, and save time for growing your core business operations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
