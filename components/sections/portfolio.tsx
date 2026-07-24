import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
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
      className="paper-grid section-cut-top text-[#181a17]"
      containerClassName="relative"
    >
      <div
        aria-hidden
        className="absolute right-12 top-2 hidden text-[.63rem] font-bold uppercase tracking-[.14em] text-accent-orange md:block"
      >
        52.8068° N<br />
        2.1004° W
      </div>
      <header className="mb-12 flex items-end gap-6 border-t border-[#181a17]/55 pt-6 sm:gap-9">
        <span className="border-b-2 border-accent-blue pb-1 font-heading text-5xl text-accent-blue sm:text-7xl">
          01
        </span>
        <span className="h-16 w-px bg-[#181a17]/45" />
        <Heading className="font-heading text-5xl leading-none tracking-[-.045em] sm:text-7xl">
          Recent work
        </Heading>
      </header>

      <article className="grid gap-12 lg:grid-cols-[.36fr_.64fr] lg:gap-14">
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
            <div className="grid grid-cols-[8rem_1fr] items-baseline border-b border-[#181a17]/55 py-4">
              <dt className="font-heading text-3xl">Responsive</dt>
              <dd className="text-sm">launch</dd>
            </div>
            <div className="grid grid-cols-[6.5rem_1fr] items-baseline border-b border-[#181a17]/55 py-4">
              <dt className="font-heading text-3xl">Direct</dt>
              <dd className="text-sm">founder collaboration</dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-5 text-sm leading-relaxed text-[#4c4d46]">
            <div>
              <p className="text-[.6rem] font-bold uppercase tracking-[.16em] text-accent-blue">
                The challenge
              </p>
              <p className="mt-2">{project.challenge}</p>
            </div>
            <div>
              <p className="text-[.6rem] font-bold uppercase tracking-[.16em] text-accent-blue">
                The solution
              </p>
              <p className="mt-2">{project.solution}</p>
            </div>
          </div>

          <figure className="mt-9 border-l-2 border-accent-blue pl-6">
            <p className="text-5xl leading-none text-accent-blue">“</p>
            <blockquote className="font-heading text-3xl leading-tight">
              “{project.testimonial?.quote}”
            </blockquote>
            <figcaption className="mt-4 text-xs font-bold uppercase tracking-[.12em]">
              — {project.testimonial?.attribution}
            </figcaption>
          </figure>

          <div className="mt-9 flex flex-wrap gap-7">
            <TrackedLink
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="border-b border-accent-blue pb-1 font-heading text-xl"
              tracking={{
                ctaId: "portfolio_visit_live_site",
                source: "portfolio",
                destination: project.href,
              }}
            >
              View the live website →
            </TrackedLink>
            <TrackedLink
              href="/portfolio"
              className="border-b border-accent-blue pb-1 font-heading text-xl"
              tracking={{
                ctaId: "portfolio_case_study",
                source: "portfolio",
                destination: "/portfolio",
              }}
            >
              Read the case study →
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

          <div className="mt-16 grid gap-6 border-y border-[#181a17]/45 py-6 sm:grid-cols-3">
            <div>
              <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent-blue">
                Outcomes
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {project.outcomes.map((item) => (
                  <li key={item}>+ {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent-blue">
                Timeline
              </p>
              <p className="mt-3 text-sm font-semibold">{project.timeline}</p>
              <ol className="mt-2 text-sm">
                {project.timelineSteps.map((item) => (
                  <li key={`${item.date}-${item.label}`}>
                    {item.date} · {item.label}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[.6rem] font-bold uppercase tracking-[.14em] text-accent-blue">
                Client feedback
              </p>
              <p className="mt-3 text-sm">
                Responsive design, collaborative build and launch support from
                one point of contact.
              </p>
            </div>
          </div>
        </div>
      </article>
    </SectionShell>
  );
}
