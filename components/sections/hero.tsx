"use client";

import Link from "next/link";

import { HeroBusinessCard } from "@/components/motion/hero-business-card";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { buttonStyles } from "@/components/ui/button";
import { heroContent } from "@/content/site";
import { trackCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate min-h-[44rem] overflow-hidden border-b border-white/15 bg-base-950 md:-mt-16 md:min-h-[56.5rem]"
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

      <div className="container-shell relative grid min-h-[44rem] items-start gap-8 pb-9 pt-8 md:min-h-[56.5rem] md:grid-cols-[.88fr_1.12fr] md:gap-10 md:pb-16 md:pt-[11.8rem]">
        <div className="max-w-[38rem] pl-4 md:pl-10">
          <h1 className="text-balance font-heading text-[3.1rem] font-medium leading-[0.91] tracking-[-0.055em] text-[#f5f1e7] sm:text-[3.35rem] md:text-[clamp(3.35rem,5.1vw,4.85rem)]">
            {heroContent.headline.slice(0, -1)}
            <span className="text-accent-orange">.</span>
          </h1>
          <p className="mt-5 max-w-[29rem] text-pretty text-base leading-relaxed text-[#bdbdb6] sm:text-lg md:mt-8">
            <span className="md:hidden">{heroContent.subheadline}</span>
            <span className="hidden md:inline">
              {heroContent.desktopSubheadline}
            </span>
          </p>

          <div className="mt-3 flex flex-col items-start gap-3 sm:flex-row md:mt-8">
            <Link
              href="/contact"
              className={cn(
                buttonStyles({ size: "lg" }),
                "min-w-[15.5rem] justify-between px-6 text-left normal-case tracking-normal md:min-w-[17.5rem]",
              )}
              onClick={() =>
                trackCtaClick({
                  ctaId: "hero_primary",
                  source: "hero",
                  destination: "/contact",
                })
              }
            >
              <span>Book a free consultation</span>
              <ArrowIcon className="text-accent-orange" />
            </Link>
            <Link
              href="#portfolio"
              className="cta-focus inline-flex items-center self-start border-b-2 border-accent-orange px-0 py-2 font-medium text-[#f5f1e7] transition hover:border-white md:min-h-12 md:py-0"
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

          <p
            data-testid="hero-trust-line"
            className="mt-1 flex items-center gap-3 text-sm text-[#c1c1ba] sm:text-base md:mt-8 md:gap-4"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-accent-orange" />
            South Manchester <span className="text-accent-orange">·</span>
            Cheshire <span className="text-accent-orange">·</span> Founder-led
          </p>
        </div>

        <div className="relative w-full md:mt-36 md:translate-x-16 md:justify-self-end">
          <HeroBusinessCard />
        </div>
      </div>
    </section>
  );
}
