"use client";

import { useState } from "react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { LogoMark } from "@/components/brand/logo";
import { SectionShell } from "@/components/layout/section-shell";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

function ServiceSketch({ index }: { index: number }) {
  if (index === 0)
    return (
      <svg
        viewBox="0 0 180 90"
        aria-hidden
        className="h-20 w-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <rect x="10" y="10" width="160" height="68" />
        <path d="M10 23h160M23 16h1m7 0h1m7 0h1M28 36h58v29H28zm0 0 58 29m0-29L28 65M101 38h50m-50 10h42m-42 10h47" />
      </svg>
    );
  if (index === 1)
    return (
      <svg
        viewBox="0 0 180 90"
        aria-hidden
        className="h-20 w-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M10 18h160v58H10zm0 13h160M20 41h140M20 66h140M35 64V51h20v13M38 51v-6c0-9 14-9 14 0v6M83 64V43h15v21M85 43v-7h11v7M124 64c0-12 24-12 24 0" />
        <path d="M21 25h73m53 0h12" />
      </svg>
    );
  if (index === 2)
    return (
      <svg
        viewBox="0 0 180 90"
        aria-hidden
        className="h-20 w-40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <rect x="12" y="9" width="156" height="72" />
        <path d="M12 24h156M55 24v57M25 36h18m-18 9h18m-18 9h18" />
        {Array.from({ length: 15 }, (_, dot) => (
          <circle
            key={dot}
            cx={75 + (dot % 5) * 17}
            cy={38 + Math.floor(dot / 5) * 15}
            r={3}
          />
        ))}
        <circle cx="109" cy="53" r="7" strokeWidth="2.5" />
      </svg>
    );
  if (index === 3)
    return (
      <svg
        viewBox="0 0 160 72"
        aria-hidden
        className="h-20 w-40"
        fill="none"
        stroke="currentColor"
      >
        <rect x="24" y="8" width="108" height="14" />
        <rect x="24" y="29" width="108" height="14" />
        <rect x="24" y="50" width="108" height="14" />
        <circle cx="120" cy="15" r="2" fill="currentColor" />
        <circle cx="120" cy="36" r="2" fill="currentColor" />
        <circle cx="120" cy="57" r="2" fill="currentColor" />
      </svg>
    );
  if (index === 4)
    return (
      <svg
        viewBox="0 0 160 72"
        aria-hidden
        className="h-20 w-40"
        fill="none"
        stroke="currentColor"
      >
        <rect x="18" y="8" width="32" height="20" />
        <circle cx="86" cy="20" r="12" />
        <path d="M50 18h24M86 32v16m0 0-24 14m24-14 24 14" />
        <circle cx="60" cy="62" r="8" />
        <circle cx="112" cy="62" r="8" />
      </svg>
    );
  return null;
}

export function ServicesSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return (
    <SectionShell
      id="services"
      className="bg-base-950 !py-0 text-[#f4f0e6]"
      containerClassName="!max-w-none !px-0"
    >
      <div className="mx-auto grid max-w-[94rem] lg:min-h-[64rem] lg:grid-cols-[24rem_1fr]">
        <div className="paper-grid relative min-h-[34rem] border-r border-[#181a17]/40 p-8 text-[#181a17] sm:p-12 lg:min-h-full">
          <p
            data-section-number
            className="font-heading text-6xl text-accent-blue"
          >
            01
          </p>
          <Heading className="mt-6 max-w-xs font-heading text-6xl leading-[.9] tracking-[-.05em]">
            What I can build
          </Heading>
          <p className="mt-7 max-w-xs text-lg leading-relaxed text-[#686860]">
            Practical digital work, scoped around what your business needs next.
          </p>
          <div className="absolute bottom-10 left-10 right-10 hidden text-[#77766e] lg:block">
            <p className="mb-3 rotate-[-4deg] font-heading text-lg italic text-accent-orange">
              Clear structure. Useful work.
            </p>
            <LogoMark
              className="mx-auto h-52 w-60"
              imageClassName="brightness-0"
            />
            <p className="mt-2 text-right font-heading text-lg italic">
              Built for local business.
            </p>
          </div>
        </div>

        <div className="relative px-6 sm:px-10 lg:px-4">
          <div className="flex justify-between border-b border-white/25 py-4 text-[.6rem] font-bold uppercase tracking-[.18em] text-accent-orange">
            <span>The Design Hutch</span>
            <span>Founder-led web design</span>
          </div>
          <ol>
            {services.map((service, index) => {
              const isOpen = activeIndex === index;
              const triggerId = `service-trigger-${index + 1}`;
              const panelId = `service-panel-${index + 1}`;

              return (
                <li
                  key={service.title}
                  data-state={isOpen ? "open" : "closed"}
                  className={cn(
                    "border-b transition-colors duration-300",
                    isOpen
                      ? "border-accent-blue text-[#7f98ff]"
                      : "border-white/25 text-[#f4f0e6]",
                  )}
                >
                  <h2>
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="cta-focus grid min-h-[9.25rem] w-full grid-cols-[3.5rem_1fr_2rem] items-center gap-4 py-5 text-left sm:grid-cols-[5rem_10rem_1fr_2rem] sm:gap-6 lg:grid-cols-[7rem_18rem_1fr_2rem] lg:gap-12"
                      onClick={() => setActiveIndex(isOpen ? null : index)}
                    >
                      <span className="font-heading text-4xl sm:text-5xl">
                        0{index + 1}
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "hidden transition-colors sm:block",
                          isOpen ? "text-[#7f98ff]" : "text-[#a8a79f]",
                        )}
                      >
                        <ServiceSketch index={index} />
                      </span>
                      <span>
                        <span className="block font-heading text-3xl leading-none sm:text-4xl">
                          {service.title}
                        </span>
                        <span
                          className={cn(
                            "mt-2 block text-sm transition-colors",
                            isOpen ? "text-[#c8c9c3]" : "text-[#aaa9a2]",
                          )}
                        >
                          {service.summary}
                        </span>
                      </span>
                      <span aria-hidden className="text-3xl font-light">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                  </h2>
                  {isOpen ? (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="ml-[3.5rem] border-t border-white/20 pb-6 pt-4 sm:ml-[21rem] lg:ml-[37rem]"
                    >
                      <p className="max-w-xl pr-6 text-sm leading-relaxed text-white/75">
                        <strong className="mr-2 uppercase tracking-[.12em] text-[#9aafff]">
                          Best for
                        </strong>
                        {service.bestFor}
                      </p>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <TrackedLink
            href="/contact"
            className="my-8 flex items-center justify-between border border-[#7f98ff] px-7 py-5 font-heading text-3xl text-[#7f98ff] transition hover:bg-accent-blue hover:text-white sm:text-4xl"
            tracking={{
              ctaId: "services_custom_scope",
              source: "services",
              destination: "/contact",
            }}
          >
            Discuss your project <ArrowIcon />
          </TrackedLink>
        </div>
      </div>
    </SectionShell>
  );
}
