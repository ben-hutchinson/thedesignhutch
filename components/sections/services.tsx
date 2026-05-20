"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

const rotateMs = 5200;

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const activeService = services[activeIndex];

  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % services.length);
    }, rotateMs);

    return () => window.clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? services.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % services.length);
  };

  return (
    <SectionShell
      id="services"
      className="bg-gradient-to-b from-transparent via-white/[0.012] to-transparent"
    >
      <Reveal className="mb-12">
        <SectionHeading
          eyebrow="Services"
          title="Premium services designed for local-business growth."
          description="Clear scope, practical delivery, and modern web capability without clutter or agency overhead."
        />
      </Reveal>

      <Reveal>
        <div
          className="relative overflow-hidden rounded-[1.65rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.16),rgba(255,255,255,0.035)_42%,rgba(249,115,22,0.1))] p-4 shadow-card sm:p-5 lg:p-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:36px_36px] opacity-20" />
          <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-stretch">
            <div className="bg-base-950/72 min-h-[24rem] overflow-hidden rounded-[1.25rem] border border-white/10 p-6 sm:min-h-[22rem] sm:p-8 lg:p-10">
              <motion.div
                key={activeService.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col justify-between"
                aria-live="polite"
              >
                <div>
                  <h3 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.025em] text-white sm:text-5xl">
                    {activeService.title}
                  </h3>
                  <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-300 sm:text-xl">
                    {activeService.summary}
                  </p>
                </div>

                <div className="bg-black/28 mt-10 rounded-2xl border border-white/10 p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                    Best for
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-zinc-100 sm:text-lg">
                    {activeService.bestFor}
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-between gap-3 lg:w-40 lg:flex-col lg:items-stretch">
              <button
                type="button"
                className="cta-focus inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-accent-blue/45 hover:bg-accent-blue/15"
                aria-label="Show previous service"
                onClick={goToPrevious}
              >
                <ArrowIcon direction="left" />
              </button>

              <div className="flex items-center justify-center gap-2 lg:flex-col">
                {services.map((service, index) => (
                  <button
                    key={service.title}
                    type="button"
                    className={cn(
                      "cta-focus h-2.5 rounded-full transition-all",
                      activeIndex === index
                        ? "w-8 bg-accent-blue lg:h-8 lg:w-2.5"
                        : "w-2.5 bg-white/25 hover:bg-white/45 lg:h-2.5 lg:w-2.5",
                    )}
                    aria-label={`Show ${service.title}`}
                    aria-current={activeIndex === index ? "true" : undefined}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="cta-focus inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition hover:border-accent-blue/45 hover:bg-accent-blue/15"
                aria-label="Show next service"
                onClick={goToNext}
              >
                <ArrowIcon direction="right" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-200">
            Need a combination of services? I can scope a custom plan around
            your business stage and goals.
          </p>
          <TrackedLink
            href="#contact"
            className={cn(buttonStyles({ size: "md" }), "justify-center")}
            tracking={{
              ctaId: "services_custom_scope",
              source: "services",
              destination: "#contact",
            }}
          >
            <span className="relative z-[1]">Discuss Your Project</span>
          </TrackedLink>
        </Card>
      </Reveal>
    </SectionShell>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={cn("h-4 w-4", direction === "left" && "rotate-180")}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 10H16M11.5 5.5L16 10L11.5 14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
