import { SectionShell } from "@/components/layout/section-shell";
import { PortfolioCarousel } from "@/components/portfolio/portfolio-carousel";
import { projects } from "@/content/portfolio";

export function PortfolioSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;

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

      <PortfolioCarousel projects={projects} />
    </SectionShell>
  );
}
