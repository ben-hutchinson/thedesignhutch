"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

import { ProcessIllustration } from "@/components/motion/process-illustrations";
import type { ProcessStep } from "@/content/process";

const stageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      delay: 0.65 + index * 0.62,
      ease: "easeOut" as const,
    },
  }),
};

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.25 });
  const motionReducedPreference = useReducedMotion();
  const [browserReducedPreference, setBrowserReducedPreference] =
    useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () =>
      setBrowserReducedPreference(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  const reduced = Boolean(
    motionReducedPreference || browserReducedPreference,
  );
  const isRevealed = reduced || isInView;

  return (
    <div ref={timelineRef} className="relative mt-10">
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 right-0 top-[11.25rem] z-10 hidden h-10 w-full md:block"
      >
        <motion.path
          data-testid="process-line"
          d="M8 21C170 4 255 34 402 20S666 28 804 19s244 11 388-3"
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={
            isRevealed
              ? { pathLength: 1, opacity: 1 }
              : { pathLength: 0, opacity: 0 }
          }
          transition={{
            duration: reduced ? 0 : 1.25,
            ease: "easeInOut",
          }}
        />
      </svg>
      <ol
        data-testid="process-timeline"
        className="grid grid-cols-2 border-y border-[#181a17]/35 md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <motion.li
            key={step.step}
            custom={index}
            initial={reduced ? false : "hidden"}
            animate={isRevealed ? "visible" : "hidden"}
            variants={stageVariants}
            className="relative min-h-[22rem] border-b border-r border-[#181a17]/25 p-4 even:border-r-0 md:border-b-0 md:border-r md:p-6 md:even:border-r md:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-4xl sm:text-5xl">
                {step.step}
              </span>
              <motion.span
                initial={reduced ? false : { opacity: 0, rotate: -8 }}
                animate={
                  isRevealed
                    ? { opacity: 1, rotate: -4 }
                    : { opacity: 0, rotate: -8 }
                }
                transition={{
                  duration: reduced ? 0 : 0.35,
                  delay: reduced ? 0 : 1.12 + index * 0.62,
                }}
                className="max-w-20 text-right font-heading text-sm italic leading-tight text-accent-orange"
              >
                {step.annotation}
              </motion.span>
            </div>
            <h2 className="mt-1 font-body text-sm font-bold">{step.title}</h2>
            <div className="mt-5 h-28 text-[#343630] sm:h-32">
              <ProcessIllustration
                index={index}
                revealed={isRevealed}
                reduced={reduced}
                delay={0.9 + index * 0.62}
              />
            </div>
            <span
              aria-hidden
              className="absolute top-[12.1rem] z-20 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-blue bg-[var(--paper)] md:left-1/2 md:block"
            />
            <p className="mt-7 text-sm leading-relaxed text-[#454640]">
              {step.description}
            </p>
            <p className="mt-3 border-t border-[#181a17]/25 pt-3 text-xs font-bold leading-relaxed text-accent-blue">
              {step.outcome}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
