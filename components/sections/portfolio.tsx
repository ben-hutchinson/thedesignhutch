import Image from "next/image";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { PortfolioProofMotion } from "@/components/motion/portfolio-proof-motion";
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

  const portfolioDetails = (
    <>
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
    </>
  );
  const portfolioMetrics = [
    {
      label: "50%",
      detail: "lower infrastructure cost",
      rowClassName: "grid grid-cols-[5.5rem_1fr] items-baseline py-4",
      labelClassName: "font-heading text-4xl",
      detailClassName: "text-sm",
    },
    {
      label: "Responsive",
      detail: "launch",
      rowClassName: "grid grid-cols-[11.5rem_1fr] items-baseline py-4",
      labelClassName: "font-heading text-3xl",
      detailClassName: "text-sm",
    },
    {
      label: "Direct",
      detail: "founder collaboration",
      rowClassName: "grid grid-cols-[6.5rem_1fr] items-baseline py-4",
      labelClassName: "font-heading text-3xl",
      detailClassName: "text-sm",
    },
  ];
  const portfolioTestimonial = (
    <>
      <span
        data-portfolio-quote-mark
        aria-hidden
        className="font-heading text-6xl leading-none text-accent-blue"
      >
        “
      </span>
      <blockquote className="font-heading text-[2rem] leading-[1.08] sm:text-[2.5rem]">
        It felt like my website
        <br />
        was in good hands
        <span
          data-portfolio-quote-mark
          aria-hidden
          className="ml-1 inline-block align-[-0.08em] text-accent-blue"
        >
          ”
        </span>
      </blockquote>
      <figcaption className="col-start-2 flex items-center gap-4 text-sm font-semibold">
        <span className="h-0.5 w-7 bg-accent-blue" />
        {project.testimonial?.attribution}
      </figcaption>
    </>
  );
  const portfolioCta = (
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
    </div>
  );
  const desktopProofImage = (
    <Image
      src={project.screenshots[0]!.src}
      alt={project.screenshots[0]!.alt}
      fill
      priority
      sizes="(min-width:1024px) 58vw, 100vw"
      className="object-cover object-top"
    />
  );
  const mobileProofImage = (
    <Image
      src={project.screenshots[2]!.src}
      alt={project.screenshots[2]!.alt}
      fill
      sizes="25vw"
      className="object-cover object-top"
    />
  );

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
          <span data-section-number>02</span>
        </span>
        <span className="hidden h-16 w-px bg-[#181a17]/45 sm:block" />
        <Heading className="-mt-1 font-heading text-5xl leading-none tracking-[-.045em] sm:mt-0 sm:text-7xl">
          Recent work
        </Heading>
      </header>

      <p className="-mt-3 mb-12 max-w-sm text-xl leading-relaxed text-[#55564f] md:hidden">
        A selection of websites that look the part and perform where it matters.
      </p>

      <PortfolioProofMotion
        details={portfolioDetails}
        metrics={portfolioMetrics}
        testimonial={portfolioTestimonial}
        cta={portfolioCta}
        desktopImage={desktopProofImage}
        mobileImage={mobileProofImage}
      />
    </SectionShell>
  );
}
