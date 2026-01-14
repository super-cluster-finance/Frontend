"use client";

import React, { useLayoutEffect, useRef, useCallback, ReactNode } from "react";
import Lenis from "lenis";

/* =========================
   DATA — CORE FLOW STEPS
========================= */
const coreFlow = [
  {
    id: "deposit",
    title: "Deposit Stablecoin",
    desc: "Deposit USDC, IDRX, or other supported stablecoins into the SuperCluster contract.",
  },
  {
    id: "mint",
    title: "Mint sToken",
    desc: "The protocol mints sToken at a 1:1 ratio as proof of ownership and routes funds into Pilot Strategies.",
  },
  {
    id: "wrap",
    title: "Wrap",
    desc: "Wrap sToken into wsToken for broader DeFi compatibility and integrations.",
  },
  {
    id: "rebase",
    title: "Yield Accrual (Rebase)",
    desc: "As AUM grows, the system performs a rebase, increasing balances to reflect earned yield.",
  },
  {
    id: "withdraw",
    title: "Withdraw or Swap",
    desc: "Withdraw through the protocol (1–3 days) or instantly swap on a DEX for immediate liquidity.",
  },
];

/* =========================
   EASING FUNCTIONS
========================= */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/* =========================
   SCROLL STACK ITEM
========================= */
export const ScrollStackItem = ({
  children,
  itemClassName = "",
}: {
  children: ReactNode;
  itemClassName?: string;
}) => (
  <div
    className={`
      scroll-stack-card sticky top-[20vh] w-full h-[320px] mb-8
      bg-black p-8 rounded border border-slate-700
      transform-gpu will-change-transform
      ${itemClassName}
    `}
    style={{
      transformOrigin: "center top",
      transition: "none",
    }}
  >
    {children}
  </div>
);

/* =========================
   SCROLL STACK LOGIC
========================= */
const ScrollStack = ({
  children,
  className = "",
  itemScale = 0.05,
  itemStackDistance = 30,
}: {
  children: ReactNode;
  className?: string;
  itemScale?: number;
  itemStackDistance?: number;
}) => {
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardOffsetsRef = useRef<number[]>([]);

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

  /* UPDATE TRANSFORM */
  const update = useCallback(() => {
    const prevTransforms = new Map<
      HTMLElement,
      { scale: number; y: number; opacity: number }
    >();

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = cardOffsetsRef.current[i];
      const cardHeight = card.offsetHeight;

      // Hitung progress dasar card
      const scrollProgress =
        (scrollTop - cardTop + windowHeight) / windowHeight;
      const progress = Math.min(Math.max(scrollProgress, 0), 1);

      /* target values --- NOT applied directly (smooth later) */
      let targetScale = 1;
      let targetY = 0;
      let targetOpacity = 1;

      // Stacking smooth logic
      for (let j = 0; j < i; j++) {
        const aboveTop = cardOffsetsRef.current[j];
        const aboveBottom = aboveTop + cardHeight;

        if (scrollTop >= aboveTop && scrollTop < aboveBottom) {
          const raw = (scrollTop - aboveTop) / cardHeight;
          const stackT = easeOutCubic(raw);

          targetScale -= itemScale * (1 - stackT);
          targetY -= itemStackDistance * (1 - stackT);
        }
      }

      // Fade in smooth
      if (progress < 0.25) {
        targetOpacity = easeInOutQuad(progress / 0.25);
      }

      /* SMOOTH LERP APPLY */
      const prev = prevTransforms.get(card) || {
        scale: 1,
        y: 0,
        opacity: 1,
      };

      const smoothScale = lerp(prev.scale, targetScale, 0.12);
      const smoothY = lerp(prev.y, targetY, 0.12);
      const smoothOpacity = lerp(prev.opacity, targetOpacity, 0.12);

      prevTransforms.set(card, {
        scale: smoothScale,
        y: smoothY,
        opacity: smoothOpacity,
      });

      card.style.transform = `translate3d(0, ${smoothY}px, 0) scale(${smoothScale})`;
      card.style.opacity = `${smoothOpacity}`;
    });
  }, [itemScale, itemStackDistance]);

  /* INITIALIZE LENIS + CACHE OFFSETS */
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", update);

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    /* Grab cards */
    const cards = Array.from(
      document.querySelectorAll(".scroll-stack-card")
    ) as HTMLElement[];

    cardsRef.current = cards;

    /* Cache offsets BEFORE transform changes */
    cardOffsetsRef.current = cards.map(
      (c) => c.getBoundingClientRect().top + window.scrollY
    );

    update();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      lenis.destroy();
    };
  }, [update]);

  return (
    <div className={`relative w-full overflow-visible ${className}`}>
      <div className="scroll-stack-inner px-6  min-h-screen">{children}</div>
    </div>
  );
};

export default function CoreFlowStackSection() {
  return (
    <section className="relative max-w-7xl mx-auto ">
      <ScrollStack>
        {coreFlow.map((step, i) => (
          <ScrollStackItem key={step.id}>
            <div className="flex flex-col h-full justify-center">
              <div className="text-[#0b84ba] text-6xl font-bold mb-6">
                {i + 1 < 10 ? `0${i + 1}` : i + 1}
              </div>

              <h3 className="text-3xl md:text-6xl text-white mb-4">
                {step.title}
              </h3>

              <p className="text-neutral-400 text-lg max-w-xl ">{step.desc}</p>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
