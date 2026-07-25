import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { projects } from "@/content/portfolio";

export function PortfolioSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const project = projects[0];
  const Heading = headingLevel;
  if (!project) return null;

  return (
    <SectionShell
      id="portfolio"
      className="paper-grid section-cut-top portfolio-mobile-cut !pb-16 text-[#181a17]"
      containerClassName="relative"
    >
      <div
        aria-hidden
        className="absolute right-12 top-2 hidden text-[.63rem] font-bold uppercase tracking-[.14em] text-accent-orange md:block"
      >
        52.8068° N<br />
        2.1004° W
      </div>
      <header className="mb-0 flex flex-col items-start gap-0 border-t border-[#181a17]/55 pt-3 sm:mb-14 sm:flex-row sm:items-end sm:gap-9 sm:pt-7">
        <span className="border-b-2 border-accent-blue pb-1 pr-16 font-heading text-3xl text-accent-blue sm:pr-0 sm:text-7xl">
          01
        </span>
        <span className="hidden h-16 w-px bg-[#181a17]/45 sm:block" />
        <Heading className="-mt-1 font-heading text-5xl leading-none tracking-[-.045em] sm:mt-0 sm:text-7xl">
          Recent work
        </Heading>
      </header>

      <p className="-mt-3 mb-12 max-w-sm text-xl leading-relaxed text-[#55564f] md:hidden">
        A selection of websites that look the part and perform where it matters.
      </p>

      <article className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:gap-14">
        <div>
          <h2 className="font-heading text-4xl leading-none sm:text-5xl">
            {project.title}
          </h2>
          <p className="mt-4 text-[.64rem] font-bold uppercase tracking-[.2em]">
            Independent music emporium · Stafford
          </p>
          <span className="mt-5 block h-0.5 w-16 bg-accent-blue" />
          <p className="mt-6 font-heading text-2xl leading-snug">
            A clearer, faster website for a much-loved independent record shop.
          </p>

          <dl className="mt-10 border-t border-[#181a17]/55">
            <div className="grid grid-cols-[5.5rem_1fr] items-baseline border-b border-[#181a17]/55 py-4">
              <dt className="font-heading text-4xl">50%</dt>
              <dd className="text-sm">lower infrastructure cost</dd>
            </div>
            <div className="grid grid-cols-[11.5rem_1fr] items-baseline border-b border-[#181a17]/55 py-4">
              <dt className="font-heading text-3xl">Responsive</dt>
              <dd className="text-sm">launch</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] items-baseline border-b border-[#181a17]/55 py-4">
              <dt className="font-heading text-3xl">Direct</dt>
              <dd className="text-sm">founder collaboration</dd>
            </div>
          </dl>

          <figure className="mt-12 grid grid-cols-[3.2rem_1fr] gap-4">
            <p className="font-heading text-6xl leading-none text-accent-blue">
              “
            </p>
            <blockquote className="font-heading text-[2rem] leading-[1.08] sm:text-[2.5rem]">
              It felt like my website
              <br />
              was in good hands.”
            </blockquote>
            <figcaption className="col-start-2 mt-1 flex items-center gap-4 text-sm font-semibold">
              <span className="h-0.5 w-7 bg-accent-blue" />
              {project.testimonial?.attribution}
            </figcaption>
          </figure>

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
            <TrackedLink
              href="/portfolio"
              className="inline-flex items-center gap-5 border-b-2 border-accent-blue pb-1 font-heading text-xl"
              tracking={{
                ctaId: "portfolio_case_study",
                source: "portfolio",
                destination: "/portfolio",
              }}
            >
              Read the case study <ArrowIcon className="text-accent-blue" />
            </TrackedLink>
          </div>
        </div>

        <div>
          <div className="relative border border-[#181a17] bg-[#f8f5ed] p-3 shadow-[0_28px_55px_-35px_rgba(24,26,23,.55)] sm:p-5">
            <div className="relative aspect-[16/11] overflow-hidden bg-white">
              <Image
                src={project.screenshots[0]!.src}
                alt={project.screenshots[0]!.alt}
                fill
                priority
                sizes="(min-width:1024px) 58vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-8 -right-2 w-[31%] rounded-[1.2rem] border-[5px] border-[#222] bg-white p-1 shadow-xl sm:-right-5 sm:w-[25%]">
              <div className="relative aspect-[9/17] overflow-hidden rounded-[.75rem] bg-white">
                <Image
                  src={project.screenshots[2]!.src}
                  alt={project.screenshots[2]!.alt}
                  fill
                  sizes="25vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="mt-40 flex items-center justify-end gap-5 text-[.6rem] font-bold uppercase tracking-[.15em] text-accent-blue"
          >
            <span className="h-px w-48 bg-accent-blue" />
            <span>+</span>
            <span>Editorial digital workshop</span>
            <span>+</span>
          </div>
        </div>
      </article>
    </SectionShell>
  );
}
