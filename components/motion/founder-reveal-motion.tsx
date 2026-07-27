"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { useResolvedMotion } from "@/components/motion/use-resolved-motion";

type FounderRevealMotionProps = {
  intro: ReactNode;
  stats: ReactNode;
  commitments: readonly string[];
  cta: ReactNode;
  additionalCopy: ReactNode;
  portrait: ReactNode;
};

function DrawnCommitmentArrow({
  revealed,
  instant,
  index,
}: {
  revealed: boolean;
  instant: boolean;
  index: number;
}) {
  return (
    <motion.span
      data-testid="about-commitment-arrow"
      aria-hidden
      initial={false}
      animate={revealed ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: instant ? 0 : 0.2,
        delay: instant ? 0 : 0.76 + index * 0.12,
      }}
      className="inline-flex text-accent-orange"
    >
      <svg
        viewBox="0 0 28 16"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.4"
      >
        <motion.path
          d="M1 8h24M19 2l6 6-6 6"
          initial={false}
          animate={revealed ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: instant ? 0 : 0.34,
            delay: instant ? 0 : 0.72 + index * 0.12,
            ease: "easeOut",
          }}
        />
      </svg>
    </motion.span>
  );
}

export function FounderRevealMotion({
  intro,
  stats,
  commitments,
  cta,
  additionalCopy,
  portrait,
}: FounderRevealMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const compositionInView = useInView(rootRef, { once: true, amount: 0.27 });
  const portraitInView = useInView(portraitRef, {
    once: true,
    amount: 0.27,
  });
  const { hydrated, reduced } = useResolvedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateCompact = () => setCompact(mediaQuery.matches);

    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);
    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  const revealed =
    !hydrated || reduced || (compact ? portraitInView : compositionInView);
  const instant = !hydrated || reduced;

  return (
    <div
      ref={rootRef}
      data-testid="founder-reveal-motion"
      data-motion-state={revealed ? "visible" : "hidden"}
      className="grid md:min-h-[58rem] md:grid-cols-[.46fr_.54fr] md:items-stretch"
    >
      <div className="relative z-10 px-[var(--space-container-x)] py-14 md:py-16">
        {intro}
        {stats}
        <p className="mt-6 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#9fb1ff]">
          What you can expect
        </p>
        <ul className="mt-3 space-y-2">
          {commitments.map((item, index) => (
            <li key={item} className="flex items-center gap-4 text-sm">
              <DrawnCommitmentArrow
                revealed={revealed}
                instant={instant}
                index={index}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {cta}
        {additionalCopy}
      </div>

      <div
        ref={portraitRef}
        className="relative min-h-[38rem] md:min-h-[58rem]"
      >
        <motion.figure
          data-testid="founder-portrait-motion"
          initial={false}
          animate={
            revealed
              ? { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
              : {
                  opacity: 0,
                  scale: 0.985,
                  clipPath: "inset(0% 0% 100% 0%)",
                }
          }
          transition={{
            duration: instant ? 0 : 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          {portrait}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(90deg,#151714_0%,transparent_20%)]"
          />
          <motion.p
            data-testid="founder-annotation-motion"
            initial={false}
            animate={
              revealed ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 8, y: 6 }
            }
            transition={{
              duration: instant ? 0 : 0.3,
              delay: instant ? 0 : 1.32,
              ease: "easeOut",
            }}
            className="absolute right-10 top-1/2 rotate-[-5deg] font-heading text-2xl italic text-accent-orange"
          >
            One person
            <br />
            all the way ←
          </motion.p>
        </motion.figure>
      </div>
    </div>
  );
}
