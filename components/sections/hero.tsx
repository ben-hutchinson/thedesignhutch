"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { AmbientGrid } from "@/components/motion/ambient-grid";
import { buttonStyles } from "@/components/ui/button";
import { heroContent } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <AmbientGrid />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero-noise" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-base-950/60 to-base-950"
      />

      <motion.div
        className="bg-accent-blue/22 pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-[130px]"
        animate={
          prefersReducedMotion ? undefined : { x: [0, 20, 0], y: [0, -14, 0] }
        }
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="bg-accent-orange/14 pointer-events-none absolute -right-24 bottom-8 h-80 w-80 rounded-full blur-[150px]"
        animate={
          prefersReducedMotion ? undefined : { x: [0, -18, 0], y: [0, 16, 0] }
        }
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="container-shell relative flex min-h-[calc(100svh-4rem)] items-center pb-24 pt-20 sm:pb-28 sm:pt-24 lg:py-28">
        <div className="grid w-full gap-10 md:grid-cols-[0.9fr_1fr] md:items-center md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-blue/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-accent-blue shadow-[0_34px_110px_-60px_rgba(59,130,246,0.95)]">
              <Image
                src="/brand/design-hutch-logo-full.png"
                alt="The Design Hutch"
                width={1600}
                height={896}
                priority
                className="h-auto w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.72,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-2xl space-y-6 md:justify-self-end"
          >
            <h1 className="text-balance font-heading text-[clamp(2.35rem,6vw,4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white">
              {heroContent.headline}
            </h1>
            <p className="max-w-xl text-pretty text-lg leading-relaxed text-zinc-300 sm:text-xl">
              {heroContent.subheadline}
            </p>

            <div className="flex flex-wrap gap-2">
              {heroContent.proofChips.map((chip) => (
                <span
                  key={chip}
                  className="border-white/12 rounded-full border bg-white/[0.045] px-3 py-2 text-sm font-medium text-zinc-100 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className={cn(buttonStyles({ size: "lg" }), "justify-center")}
                onClick={() =>
                  trackCtaClick({
                    ctaId: "hero_primary",
                    source: "hero",
                    destination: "/contact",
                  })
                }
              >
                <span className="relative z-[1]">Book Free Consultation</span>
              </Link>
              <Link
                href="/contact"
                className={cn(
                  buttonStyles({ variant: "secondary", size: "lg" }),
                  "justify-center",
                )}
                onClick={() =>
                  trackCtaClick({
                    ctaId: "hero_secondary",
                    source: "hero",
                    destination: "/contact",
                  })
                }
              >
                <span className="relative z-[1]">Send Enquiry</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
