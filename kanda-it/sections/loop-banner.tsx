"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
import AnimatedContent from "@/components/animated-content";

type VelocityMapping = {
  input: [number, number];
  output: [number, number];
};

type LoopBannerProps = {
  topText?: string;
  bottomText?: string;
  velocity?: number;
  className?: string;

  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;

  scrollContainerRef?: React.RefObject<HTMLElement>;
};

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const update = () => {
      if (ref.current) setWidth(ref.current.offsetWidth);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M32 2c2 14 8 20 30 30-22 10-28 16-30 30-2-14-8-20-30-30C24 22 30 16 32 2z" />
    </svg>
  );
}

/**
 * ✅ Fix: show sparkle AFTER the last word too
 * Input: "Be ✦ Creative ✦ With ✦ Kanda ✦ IT ✦"
 * Output: Be ✦ Creative ✦ With ✦ Kanda ✦ IT ✦   (ending sparkle included)
 */
function MarqueeContent({
  text,
  className,
  sparkleClassName,
}: {
  text: string;
  className?: string;
  sparkleClassName?: string;
}) {
  const hasTrailingStar = /✦\s*$/.test(text);

  const parts = text
    .split("✦")
    .map((s) => s.trim())
    .filter(Boolean);

  const sparkleEl = (
    <Sparkle
      className={`mx-[clamp(14px,2.2vw,34px)] h-[clamp(18px,2.8vw,44px)] w-[clamp(18px,2.8vw,44px)] ${sparkleClassName ?? ""}`}
    />
  );

  return (
    <span className={`inline-flex items-center ${className ?? ""}`}>
      {parts.map((p, i) => (
        <React.Fragment key={`${p}-${i}`}>
          <span>{p}</span>

          {/* middle sparkles */}
          {i !== parts.length - 1 && sparkleEl}
        </React.Fragment>
      ))}

      {/* ✅ trailing sparkle if your string ends with ✦ */}
      {hasTrailingStar && sparkleEl}
    </span>
  );
}

function VelocityRow({
  text,
  baseVelocity,
  scrollContainerRef,
  damping,
  stiffness,
  numCopies,
  velocityMapping,
  rowTextClassName,
}: {
  text: string;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  damping: number;
  stiffness: number;
  numCopies: number;
  velocityMapping: VelocityMapping;
  rowTextClassName: string;
}) {
  const baseX = useMotionValue(0);

  const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const spans = Array.from({ length: numCopies }).map((_, i) => (
    <span key={i} ref={i === 0 ? copyRef : null} className="flex-shrink-0">
      <MarqueeContent text={text} className={rowTextClassName} sparkleClassName="" />
      <span className="inline-block w-[clamp(24px,3vw,56px)]" />
    </span>
  ));

  return (
    <div className="relative overflow-hidden w-full">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {spans}
      </motion.div>
    </div>
  );
}

export default function LoopBanner({
  topText = "Be ✦ Creative ✦ With ✦ Kanda ✦ IT ✦",
  bottomText = "Service 1 ✦ Service 2 ✦ Service 3 ✦ Service 4 ✦ Service 5 ✦",
  velocity = 60,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 10,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  scrollContainerRef,
}: LoopBannerProps) {
  const sharedRowText =
    "text-white font-urbanist font-extrabold uppercase leading-none tracking-[0.06em] " +
    "text-[clamp(18px,3.4vw,56px)]";

  return (
    <section className={`w-full ${className}`}>
      <AnimatedContent
        distance={24}
        duration={0.9}
        ease="power3.out"
        threshold={0.2}
      >
        <div
          className="
            w-screen overflow-hidden
            bg-[#FF5F15]
            py-[clamp(14px,2.2vw,26px)]
          "
        >
          <VelocityRow
            text={topText}
            baseVelocity={velocity}
            scrollContainerRef={scrollContainerRef}
            damping={damping}
            stiffness={stiffness}
            numCopies={numCopies}
            velocityMapping={velocityMapping}
            rowTextClassName={sharedRowText}
          />

          <div className="h-[clamp(10px,1.3vw,18px)]" />

          <VelocityRow
            text={bottomText}
            baseVelocity={-velocity}
            scrollContainerRef={scrollContainerRef}
            damping={damping}
            stiffness={stiffness}
            numCopies={numCopies}
            velocityMapping={velocityMapping}
            rowTextClassName={sharedRowText}
          />
        </div>
      </AnimatedContent>
    </section>
  );
}
