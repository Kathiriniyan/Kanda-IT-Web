"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import AnimatedContent from "@/components/animated-content";
import { excellenceItems, type ExcellenceItem } from "@/data/excellence";

type Props = {
  className?: string;

  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
};

const MOBILE_BREAKPOINT = 768;
const DEFAULT_SPOTLIGHT_RADIUS = 320;

// ✅ White theme + orange accents
const ORANGE_RGB = "255, 95, 21"; // #FF5F15
const AMBER_RGB = "245, 158, 11"; // amber-ish

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  enabled?: boolean;
  spotlightRadius?: number;
  disable?: boolean;
}> = ({ gridRef, enabled = true, spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS, disable = false }) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disable || !gridRef.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 860px;
      height: 860px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${ORANGE_RGB}, 0.14) 0%,
        rgba(${ORANGE_RGB}, 0.08) 18%,
        rgba(${ORANGE_RGB}, 0.05) 30%,
        rgba(${ORANGE_RGB}, 0.03) 45%,
        rgba(${ORANGE_RGB}, 0.015) 65%,
        transparent 70%
      );
      z-index: 60;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: multiply;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const inside =
        !!rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll(".bento-card");

      if (!inside) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.22, ease: "power2.out" });
        cards.forEach((c) => (c as HTMLElement).style.setProperty("--glow-intensity", "0"));
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const el = card as HTMLElement;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        const distance =
          Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
        const d = Math.max(0, distance);

        minDistance = Math.min(minDistance, d);

        let glow = 0;
        if (d <= proximity) glow = 1;
        else if (d <= fadeDistance) glow = (fadeDistance - d) / (fadeDistance - proximity);

        updateCardGlowProperties(el, e.clientX, e.clientY, glow, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.95
          : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.95
          : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.14 : 0.25,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gridRef.current?.querySelectorAll(".bento-card").forEach((c) => {
        (c as HTMLElement).style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, { opacity: 0, duration: 0.22, ease: "power2.out" });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleLeave);
      spotlightRef.current?.remove();
    };
  }, [gridRef, enabled, spotlightRadius, disable]);

  return null;
};

const BentoCard: React.FC<{
  item: ExcellenceItem;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  disable?: boolean;
  className?: string;
}> = ({
  item,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  disable = false,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const magnetTween = useRef<gsap.core.Tween | null>(null);

  const rgb = item.accent === "amber" ? AMBER_RGB : ORANGE_RGB;
  const Icon = item.icon;

  useEffect(() => {
    if (disable || !ref.current) return;
    const el = ref.current;

    const onEnter = () => gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out" });

    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.28, ease: "power2.out" });
      gsap.to(el, { y: 0, duration: 0.18, ease: "power2.out" });
      magnetTween.current?.kill();
    };

    const onMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;

      if (enableTilt) {
        const rx = ((y - cy) / cy) * -10;
        const ry = ((x - cx) / cx) * 10;
        gsap.to(el, {
          rotateX: rx,
          rotateY: ry,
          duration: 0.1,
          ease: "power2.out",
          transformPerspective: 1000,
        });
      }

      if (enableMagnetism) {
        const mx = (x - cx) * 0.05;
        const my = (y - cy) * 0.05;
        magnetTween.current = gsap.to(el, { x: mx, y: my, duration: 0.22, ease: "power2.out" });
      }
    };

    const onClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - r.width, y),
        Math.hypot(x, y - r.height),
        Math.hypot(x - r.width, y - r.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 20;
        background: radial-gradient(circle,
          rgba(${rgb}, 0.32) 0%,
          rgba(${rgb}, 0.16) 30%,
          transparent 70%
        );
      `;
      el.appendChild(ripple);

      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        {
          scale: 1,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        }
      );
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("click", onClick);
      magnetTween.current?.kill();
    };
  }, [disable, enableTilt, enableMagnetism, clickEffect, rgb]);

  return (
    <div
      ref={ref}
      className={[
        "bento-card relative overflow-hidden rounded-2xl",
        "border border-gray-200",
        "bg-white",
        "shadow-[0_14px_45px_rgba(0,0,0,0.08)]",
        "transition-shadow duration-200",
        enableBorderGlow ? "card--border-glow" : "",
        className,
      ].join(" ")}
      style={
        {
          "--glow-x": "50%",
          "--glow-y": "50%",
          "--glow-intensity": "0",
          "--glow-radius": "260px",
          "--glow-color": rgb,
        } as React.CSSProperties
      }
    >
      {/* subtle inner gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_10%,rgba(255,95,21,0.10),transparent_55%)] opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.06),transparent_55%)]" />

      <div className="relative p-6 sm:p-7 h-full flex flex-col">
        {/* icon area (fixed height to keep equal cards) */}
        <div className="relative h-[108px] sm:h-[120px] rounded-xl bg-gray-50 border border-gray-200 grid place-items-center overflow-hidden">
          <div
            className="absolute -right-10 -top-10 w-44 h-44 rounded-full blur-3xl"
            style={{ background: `rgba(${rgb}, 0.16)` }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,255,255,0.9),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_115%,rgba(0,0,0,0.08),transparent_60%)]" />

          <div
            className="relative z-10 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-2xl border bg-white grid place-items-center"
            style={{
              borderColor: `rgba(${rgb}, 0.35)`,
              boxShadow: `0 0 28px rgba(${rgb}, 0.12)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl blur-xl"
              style={{ background: `rgba(${rgb}, 0.12)` }}
            />
            <Icon
              className="relative z-10"
              width={32}
              height={32}
              style={{ color: `rgb(${rgb})` }}
            />
          </div>

          {/* dots */}
          <div
            className="absolute left-5 top-5 w-2.5 h-2.5 rounded-full"
            style={{ background: `rgba(${rgb}, 0.18)` }}
          />
          <div className="absolute right-9 top-8 w-2 h-2 rounded-full bg-black/10" />
          <div
            className="absolute right-6 top-12 w-2.5 h-2.5 rounded-full"
            style={{ background: `rgba(${rgb}, 0.14)` }}
          />
        </div>

        {/* text */}
        <div className="mt-5 flex-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: `rgb(${rgb})` }} />
            <p className="text-[11px] tracking-[0.16em] uppercase text-gray-500 font-semibold">
              {item.label}
            </p>
          </div>

          <h3 className="mt-2 text-[18px] sm:text-[19px] font-semibold text-gray-900 leading-tight">
            {item.title}
          </h3>

          <p className="mt-3 text-[13px] sm:text-[13.5px] leading-relaxed text-gray-600 line-clamp-3">
            {item.description}
          </p>
        </div>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-gray-200 via-gray-100 to-transparent" />
      </div>
    </div>
  );
};

export default function ExcellenceSection({
  className = "",
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
}: Props) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMobileDetection();
  const disable = isMobile;

  // layout map (same as your reference 2 / 3 / 2)
  const cards = useMemo(() => {
    const byId = Object.fromEntries(excellenceItems.map((x) => [x.id, x]));
    return {
      topLeft: byId.automation,
      topCenter: byId.quality,
      topRight: byId.erp,
      bottomLeft: byId.speed,
      center: byId.team,
      bottomCenter: byId.scale,
    };
  }, []);

  return (
    <section className={`relative w-full bg-white overflow-hidden ${className}`}>
      <style>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 260px;
          --glow-color: ${ORANGE_RGB};
        }

        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 6px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.55)) 0%,
            rgba(var(--glow-color), calc(var(--glow-intensity) * 0.22)) 32%,
            transparent 64%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          opacity: 1;
          z-index: 10;
        }
      `}</style>

      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          disable={disable}
        />
      )}

      {/* soft white/orange background like your features section style */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,95,21,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,95,21,0.10),transparent_58%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-16 lg:px-24 xl:px-32 py-16 sm:py-20">
        {/* heading (white theme) */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5F15]" />
            Excellence
          </p>
          <h2 className="mt-3 text-gray-900 font-urbanist font-extrabold tracking-[-0.02em] text-[clamp(30px,4vw,52px)]">
            Service Excellence
          </h2>
          <p className="mt-3 text-gray-600 text-[13px] sm:text-[14px] max-w-[62ch] mx-auto leading-relaxed">
            High-impact systems, disciplined quality, and reliable delivery — built around your business goals and growth.
          </p>
        </div>

        <AnimatedContent
          distance={24}
          duration={0.85}
          ease="power3.out"
          threshold={0.15}
          className="!visible"
        >
          <div
            ref={gridRef}
            className="bento-section grid grid-cols-1 lg:grid-cols-3 gap-5"
          >
            {/* Left column (2 cards) */}
            <div className="grid gap-5">
              <BentoCard
                item={cards.topLeft}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[292px]"
              />
              <BentoCard
                item={cards.bottomLeft}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[292px]"
              />
            </div>

            {/* Middle column (3 stacked) */}
            <div className="grid gap-5">
              <BentoCard
                item={cards.topCenter}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[270px]"
              />
              <BentoCard
                item={cards.center}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[270px]"
              />
              <BentoCard
                item={cards.bottomCenter}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[270px]"
              />
            </div>

            {/* Right column (2 cards) */}
            <div className="grid gap-5">
              <BentoCard
                item={cards.topRight}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[292px]"
              />
              {/* same scaling card in right-bottom like your ref layout */}
              <BentoCard
                item={cards.bottomCenter}
                enableBorderGlow={enableBorderGlow}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disable={disable}
                className="min-h-[292px]"
              />
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
