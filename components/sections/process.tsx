import { LogoMark } from "@/components/brand/logo";
import { SectionShell } from "@/components/layout/section-shell";
import { ProcessTimeline } from "@/components/motion/process-timeline";
import { processSteps } from "@/content/process";

export function ProcessSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <SectionShell
      id="process"
      className="paper-grid !pb-0 !pt-16 text-[#181a17]"
    >
      <header className="grid gap-6 lg:grid-cols-[10rem_1fr_auto] lg:items-start">
        <span
          data-section-number
          className="font-heading text-7xl leading-none"
        >
          03
        </span>
        <div>
          <Heading className="max-w-4xl font-heading text-[clamp(3.2rem,5.2vw,5.2rem)] leading-[.92] tracking-[-.05em]">
            From first conversation to a supported launch
          </Heading>
          <p className="mt-5 text-lg">
            Four clear stages. One person accountable throughout.
          </p>
        </div>
        <LogoMark
          className="hidden h-20 w-24 lg:block"
          imageClassName="brightness-0"
        />
      </header>

      <ProcessTimeline steps={processSteps} />
      <p className="py-4 text-center font-heading text-3xl">
        You always know what happens next.
      </p>
    </SectionShell>
  );
}
