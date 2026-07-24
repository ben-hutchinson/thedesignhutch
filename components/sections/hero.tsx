"use client";

import Link from "next/link";

import { HeroBusinessCard } from "@/components/motion/hero-business-card";
import { buttonStyles } from "@/components/ui/button";
import { heroContent } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden border-b border-white/15 bg-base-950"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <div
        aria-hidden
        className="absolute -right-20 top-24 h-[30rem] w-[30rem] rounded-full border border-accent-blue/30"
      />
      <div
        aria-hidden
        className="absolute -right-8 top-36 h-[22rem] w-[22rem] rotate-12 border border-accent-orange/25"
      />

      <div className="container-shell relative grid min-h-[calc(100svh-4rem)] items-start gap-12 pb-20 pt-16 md:grid-cols-[1.08fr_.92fr] md:gap-14 md:pb-20 md:pt-20">
        <div className="max-w-4xl">
          <p className="mb-6 flex items-center gap-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[#b8b8b0]">
            <span className="h-px w-8 bg-accent-orange" />
            Independent digital workshop
          </p>
          <h1 className="text-balance font-heading text-[clamp(3.35rem,6.4vw,5.9rem)] font-medium leading-[0.87] tracking-[-0.055em] text-[#f5f1e7]">
            {heroContent.headline.slice(0, -1)}
            <span className="text-accent-orange">.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-[#c8c8c0] sm:text-lg">
            {heroContent.subheadline}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
              Book a free consultation
            </Link>
            <Link
              href="#portfolio"
              className={cn(
                buttonStyles({ variant: "secondary", size: "lg" }),
                "justify-center text-[#f5f1e7]",
              )}
              onClick={() =>
                trackCtaClick({
                  ctaId: "hero_secondary",
                  source: "hero",
                  destination: "#portfolio",
                })
              }
            >
              View recent work
            </Link>
          </div>

          <p className="mt-7 text-[0.67rem] font-semibold uppercase tracking-[0.16em] text-[#9d9e96]">
            South Manchester · Cheshire · Founder-led
          </p>
        </div>

        <div className="relative w-full md:mt-24 md:justify-self-end">
          <p className="mb-3 text-right text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#91928b]">
            Tap or drag to turn · No agency handoffs
          </p>
          <HeroBusinessCard />
        </div>
      </div>
    </section>
  );
}
