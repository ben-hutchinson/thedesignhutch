"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { type CarouselDirection } from "@/components/portfolio/portfolio-carousel-state";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { type Project, type ProjectMetric } from "@/content/portfolio";
import { useResolvedMotion } from "@/components/motion/use-resolved-motion";

type PortfolioProofMotionProps = {
  project: Project;
  priority: boolean;
  direction: CarouselDirection;
};

const metricPresentationClasses: Record<
  ProjectMetric["presentation"],
  {
    rowClassName: string;
    labelClassName: string;
  }
> = {
  numeric: {
    rowClassName: "grid grid-cols-[5.5rem_1fr] items-baseline py-4",
    labelClassName: "font-heading text-4xl",
  },
  long: {
    rowClassName: "grid grid-cols-[11.5rem_1fr] items-baseline py-4",
    labelClassName: "font-heading text-3xl",
  },
  short: {
    rowClassName: "grid grid-cols-[6.5rem_1fr] items-baseline py-4",
    labelClassName: "font-heading text-3xl",
  },
};

export function PortfolioProofMotion({
  project,
  priority,
  direction,
}: PortfolioProofMotionProps) {
  void direction;
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
  const desktopPriority = priority ? { priority: true } : {};

  return (
    <article
      ref={rootRef}
      data-testid="portfolio-proof-motion"
      data-motion-state={state}
      className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:gap-14"
    >
      <div>
        <h2 className="font-heading text-4xl leading-none sm:text-5xl">
          {project.title}
        </h2>
        <p className="mt-4 text-[.64rem] font-bold uppercase tracking-[.2em]">
          {project.eyebrow}
        </p>
        <span className="mt-5 block h-0.5 w-16 bg-accent-blue" />
        <p className="mt-6 font-heading text-2xl leading-snug">
          {project.proofHeadline}
        </p>
        <dl className="mt-10 border-t border-[#181a17]/55">
          {project.proofMetrics.map((metric, index) => {
            const presentation = metricPresentationClasses[metric.presentation];

            return (
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
                className={`${presentation.rowClassName} origin-left border-b border-[#181a17]/55`}
              >
                <dt className={presentation.labelClassName}>{metric.label}</dt>
                <dd className="text-sm">{metric.detail}</dd>
              </motion.div>
            );
          })}
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
          <span
            data-portfolio-quote-mark
            aria-hidden
            className="font-heading text-6xl leading-none text-accent-blue"
          >
            “
          </span>
          <blockquote className="font-heading text-[2rem] leading-[1.08] sm:text-[2.5rem]">
            {project.featuredQuoteLines[0]}
            <br />
            {project.featuredQuoteLines[1]}
            <span
              data-portfolio-quote-mark
              aria-hidden
              className="ml-1 inline-block align-[-0.08em] text-accent-blue"
            >
              ”
            </span>
          </blockquote>
          <figcaption className="col-start-2 flex items-center gap-4 text-sm font-semibold">
            <span className="h-0.5 w-7 bg-accent-blue" />
            {project.testimonial?.attribution}
          </figcaption>
        </motion.figure>
        <div className="mt-9 flex flex-wrap gap-7">
          <TrackedLink
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-5 border-b-2 border-accent-blue pb-1 font-heading text-xl"
            tracking={{
              ctaId: "portfolio_visit_live_site",
              source: "portfolio",
              destination: project.href,
            }}
          >
            View the live website <ArrowIcon className="text-accent-blue" />
          </TrackedLink>
        </div>
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
            <Image
              src={project.proofImages.desktop.src}
              alt={project.proofImages.desktop.alt}
              fill
              {...desktopPriority}
              sizes="(min-width:1024px) 58vw, 100vw"
              className="object-cover object-top"
            />
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
              <Image
                src={project.proofImages.mobile.src}
                alt={project.proofImages.mobile.alt}
                fill
                sizes="25vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}
