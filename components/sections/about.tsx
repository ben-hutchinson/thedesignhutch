import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import {
  founderCommitments,
  founderImage,
  founderProfile,
  trustStats,
} from "@/content/about";

export function AboutSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <SectionShell
      id="about"
      className="relative overflow-hidden bg-base-950 !py-0 text-[#f5f1e7]"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[4.6rem] bg-[var(--paper)] [clip-path:polygon(0_0,100%_0,100%_100%,79%_100%,71%_20%,64%_100%,0_100%)]"
      />
      <div className="container-shell !px-0">
        <div className="grid pt-[4.6rem] md:min-h-[58rem] md:grid-cols-[.46fr_.54fr] md:items-stretch">
          <div className="relative z-10 px-[var(--space-container-x)] py-14 md:py-16">
            <p className="border-t border-accent-blue pt-3 text-sm font-bold tracking-[.16em] text-[#8da3ff]">
              04
            </p>
            <Heading className="mt-6 max-w-2xl font-heading text-[clamp(3.4rem,6vw,6rem)] leading-[.88] tracking-[-.055em] md:ml-11">
              The person designing and building your website
            </Heading>
            <p className="mt-6 font-heading text-3xl text-[#8da3ff] md:ml-11">
              {founderProfile.name}
            </p>
            <p className="mt-1 text-[.65rem] font-bold uppercase tracking-[.2em] text-[#9fb1ff] md:ml-11">
              {founderProfile.role}
            </p>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#c4c4bd] md:ml-11">
              You work directly with me from the first conversation through
              design, build, launch and ongoing support.
            </p>

            <dl className="mt-7 grid grid-cols-3 border-y border-accent-blue/70">
              {trustStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="border-r border-accent-blue/60 px-4 py-4 last:border-0"
                >
                  <dt className="text-[.58rem] font-bold text-[#9fb1ff]">
                    0{index + 1}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold">
                    {index === 0
                      ? "5+ years coding"
                      : index === 1
                        ? "One point of contact"
                        : "No agency handoffs"}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#9fb1ff]">
              What you can expect
            </p>
            <ul className="mt-3 space-y-2">
              {founderCommitments.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-4 text-sm">
                  <span className="text-[#9fb1ff]">→</span>
                  {item}
                </li>
              ))}
            </ul>
            <TrackedLink
              href="/contact"
              className="mt-7 flex max-w-[21rem] items-center justify-between bg-accent-blue px-7 py-4 font-semibold text-white"
              tracking={{
                ctaId: "about_start_conversation",
                source: "about",
                destination: "/contact",
              }}
            >
              Start a conversation <ArrowIcon />
            </TrackedLink>
            <div className="sr-only">
              {founderCommitments.slice(3).join(" ")}
            </div>
          </div>

          <figure className="relative min-h-[38rem] md:min-h-[58rem]">
            {founderImage.src ? (
              <Image
                src={founderImage.src}
                alt={founderImage.alt}
                fill
                priority={headingLevel === "h1"}
                sizes="(min-width:768px) 54vw, 100vw"
                className="object-cover object-[50%_45%]"
              />
            ) : null}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,#151714_0%,transparent_20%)]"
            />
            <p className="absolute right-10 top-1/2 rotate-[-5deg] font-heading text-2xl italic text-accent-orange">
              One person
              <br />
              all the way ←
            </p>
          </figure>
        </div>
      </div>
    </SectionShell>
  );
}
