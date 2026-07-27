"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { useResolvedMotion } from "@/components/motion/use-resolved-motion";

type PortfolioProofMotionProps = {
  details: ReactNode;
  metrics: {
    detail: string;
    detailClassName: string;
    label: string;
    labelClassName: string;
    rowClassName: string;
  }[];
  testimonial: ReactNode;
  cta: ReactNode;
  desktopImage: ReactNode;
  mobileImage: ReactNode;
};

export function PortfolioProofMotion({
  details,
  metrics,
  testimonial,
  cta,
  desktopImage,
  mobileImage,
}: PortfolioProofMotionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const { hydrated, reduced } = useResolvedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateCompact = () => setCompact(mediaQuery.matches);
    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);
    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  const revealed = !hydrated || reduced || inView;
  const instant = !hydrated || reduced;
  const state = revealed ? "visible" : "hidden";

  return (
    <article
      ref={rootRef}
      data-testid="portfolio-proof-motion"
      data-motion-state={state}
      className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:gap-14"
    >
      <div>
        {details}
        <dl className="mt-10 border-t border-[#181a17]/55">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              data-testid="portfolio-metric"
              initial={false}
              animate={
                revealed
                  ? { opacity: 1, scaleX: 1 }
                  : { opacity: 0, scaleX: 0.88 }
              }
              transition={{
                duration: instant ? 0 : 0.28,
                delay: instant ? 0 : 0.66 + index * 0.09,
                ease: "easeOut",
              }}
              className={`${metric.rowClassName} origin-left border-b border-[#181a17]/55`}
            >
              <dt className={metric.labelClassName}>{metric.label}</dt>
              <dd className={metric.detailClassName}>{metric.detail}</dd>
            </motion.div>
          ))}
        </dl>
        <motion.figure
          data-testid="portfolio-testimonial"
          initial={false}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: instant ? 0 : 0.3,
            delay: instant ? 0 : 1.12,
            ease: "easeOut",
          }}
          className="mt-12 grid grid-cols-[3.2rem_1fr] gap-x-4 gap-y-2"
        >
          {testimonial}
        </motion.figure>
        {cta}
      </div>

      <div>
        <motion.div
          data-testid="portfolio-desktop-proof"
          initial={false}
          animate={
            revealed
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: 32, rotate: -1.5 }
          }
          transition={{
            duration: instant ? 0 : 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative border border-[#181a17] bg-[#f8f5ed] p-3 shadow-[0_28px_55px_-35px_rgba(24,26,23,.55)] sm:p-5"
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-white">
            {desktopImage}
          </div>
          <motion.div
            data-testid="portfolio-mobile-proof"
            initial={false}
            animate={
              revealed
                ? { opacity: 1, x: 0, rotate: 0 }
                : {
                    opacity: 0,
                    x: compact ? 24 : 44,
                    rotate: 1,
                  }
            }
            transition={
              instant
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 190,
                    damping: 24,
                    delay: 0.2,
                  }
            }
            className="absolute -bottom-8 -right-2 w-[31%] rounded-[1.2rem] border-[5px] border-[#222] bg-white p-1 shadow-xl sm:-right-5 sm:w-[25%]"
          >
            <div className="relative aspect-[9/17] overflow-hidden rounded-[.75rem] bg-white">
              {mobileImage}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}
