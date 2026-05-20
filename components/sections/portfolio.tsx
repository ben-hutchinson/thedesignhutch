"use client";

import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { type Project, projects } from "@/content/portfolio";
import { cn } from "@/lib/utils";

export function PortfolioSection() {
  const [featuredProject] = projects;

  return (
    <SectionShell
      id="portfolio"
      className="border-y border-white/10 bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.01]"
    >
      <Reveal className="mb-8">
        <SectionHeading
          eyebrow="Portfolio"
          title="Proof that the work reaches launch."
          description="A closer look at how the design, build, and launch support come together for a real local business."
        />
      </Reveal>

      {featuredProject ? (
        <Reveal>
          <Card className="overflow-hidden p-0">
            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
              <ProjectHomepageScreenshot project={featuredProject} />

              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="text-sm font-medium text-accent-blue">
                  {featuredProject.urlLabel}
                </p>
                <h3 className="mt-4 text-balance font-heading text-4xl font-semibold tracking-[-0.025em] text-white sm:text-5xl">
                  {featuredProject.title}
                </h3>
                <p className="mt-5 text-pretty text-base leading-relaxed text-zinc-300">
                  {featuredProject.summary}
                </p>

                <div className="mt-7 grid gap-3">
                  <ProofPanel
                    label="The challenge"
                    copy={featuredProject.challenge}
                  />
                  <ProofPanel
                    label="The solution"
                    copy={featuredProject.solution}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                      Outcomes
                    </p>
                    <ul className="mt-3 space-y-2">
                      {featuredProject.outcomes.map((outcome) => (
                        <li
                          key={outcome}
                          className="flex gap-2 text-sm text-zinc-200"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                      Timeline
                    </p>
                    <p className="mt-3 text-sm font-medium text-white">
                      {featuredProject.timeline}
                    </p>
                    <div className="relative mt-4">
                      <span className="absolute left-[16%] right-[16%] top-3 h-px bg-gradient-to-r from-accent-blue/65 via-white/25 to-accent-orange/65" />
                      <ol className="grid grid-cols-3 gap-3">
                        {featuredProject.timelineSteps.map((step) => (
                          <li
                            key={`${step.date}-${step.label}`}
                            className="relative flex flex-col items-center text-center"
                          >
                            <span className="z-[1] h-2.5 w-2.5 rounded-full bg-white ring-4 ring-accent-blue/25" />
                            <span className="mt-3 text-[0.68rem] uppercase tracking-[0.14em] text-zinc-500">
                              {step.date}
                            </span>
                            <span className="mt-1 text-xs leading-snug text-zinc-200">
                              {step.label}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredProject.services.map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-zinc-200"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-accent-blue/25 bg-accent-blue/[0.06] p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-accent-blue">
                    Client feedback
                  </p>
                  {featuredProject.testimonial ? (
                    <figure className="mt-3">
                      <blockquote className="text-sm leading-relaxed text-zinc-100">
                        &ldquo;{featuredProject.testimonial.quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-2 text-xs text-zinc-400">
                        {featuredProject.testimonial.attribution}
                      </figcaption>
                    </figure>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-200">
                      This space is ready for an approved client testimonial.
                      For now, it highlights verified project proof: a live
                      website, real screenshots, responsive views, and launch
                      support.
                    </p>
                  )}
                </div>

                <TrackedLink
                  href={featuredProject.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonStyles({}), "mt-8 w-fit justify-center")}
                  tracking={{
                    ctaId: "portfolio_visit_live_site",
                    source: "portfolio",
                    destination: featuredProject.href,
                  }}
                >
                  <span className="relative z-[1]">Visit Live Website</span>
                </TrackedLink>
              </div>
            </div>
          </Card>
        </Reveal>
      ) : null}
    </SectionShell>
  );
}

function ProofPanel({ label, copy }: { label: string; copy: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-200">{copy}</p>
    </div>
  );
}

function ProjectHomepageScreenshot({ project }: { project: Project }) {
  const homepageScreenshot = project.screenshots[0];

  if (!homepageScreenshot) {
    return null;
  }

  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-black p-4 sm:p-5 lg:border-b-0 lg:border-r">
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/15 bg-zinc-100 shadow-[0_30px_90px_-48px_rgba(0,0,0,0.95)]">
        <Image
          src={homepageScreenshot.src}
          alt={homepageScreenshot.alt}
          fill
          sizes="(min-width: 1280px) 58vw, (min-width: 1024px) 54vw, 100vw"
          className="object-contain object-top"
          priority
        />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
        Homepage screenshot
      </p>
    </div>
  );
}
