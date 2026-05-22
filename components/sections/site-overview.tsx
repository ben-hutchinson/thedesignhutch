import Link from "next/link";

import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { overviewCards } from "@/content/site";

export function SiteOverviewSection() {
  return (
    <SectionShell
      id="site-overview"
      className="border-y border-white/10 bg-gradient-to-b from-white/[0.018] via-transparent to-white/[0.012]"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card, index) => (
          <Reveal key={card.href} delay={index * 0.04}>
            <Link
              href={card.href}
              aria-label={`${card.label}: ${card.title}`}
              className="cta-focus group block h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent-blue/35 hover:bg-accent-blue/[0.06] sm:p-6"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-accent-blue">
                {card.label}
              </p>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {card.description}
              </p>
              <span className="mt-5 inline-flex w-fit rounded-full border border-accent-orange/35 bg-accent-orange/10 px-4 py-2 text-sm font-semibold text-accent-orange shadow-[0_0_24px_rgba(249,115,22,0.12)] transition group-hover:border-accent-orange/70 group-hover:bg-accent-orange group-hover:text-white">
                {card.ctaLabel}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
