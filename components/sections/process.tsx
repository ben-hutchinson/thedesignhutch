import { LogoMark } from "@/components/brand/logo";
import { SectionShell } from "@/components/layout/section-shell";
import { processSteps } from "@/content/process";

export function ProcessSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <SectionShell id="process" className="paper-grid text-[#181a17]">
      <header className="grid gap-6 lg:grid-cols-[10rem_1fr_auto] lg:items-start">
        <span className="font-heading text-7xl leading-none">03</span>
        <div>
          <Heading className="max-w-4xl font-heading text-[clamp(3.2rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">
            From first conversation to a supported launch
          </Heading>
          <p className="mt-5 text-lg">
            Four clear stages. One person accountable throughout.
          </p>
        </div>
        <LogoMark className="hidden h-24 w-24 lg:block" />
      </header>

      <ol className="relative mt-12 grid gap-0 border-y border-[#181a17]/35 md:grid-cols-4">
        <span
          aria-hidden
          className="absolute left-0 right-0 top-[10.6rem] hidden h-px bg-[linear-gradient(90deg,#181a17_0%,#3453d1_42%,#181a17_68%,#f0642b_100%)] md:block"
        />
        {processSteps.map((step, index) => (
          <li
            key={step.step}
            className={`relative min-h-[24rem] border-b border-[#181a17]/30 p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${index === 1 ? "text-accent-blue" : ""}`}
          >
            <div className="flex items-start justify-between">
              <span className="font-heading text-5xl">{step.step}</span>
              <span className="text-2xl text-accent-orange">+</span>
            </div>
            <h2 className="mt-2 font-body text-sm font-bold">{step.title}</h2>
            <div className="border-current/35 relative mt-7 h-28 border p-3">
              <ServiceProcessSketch index={index} />
              <span
                aria-hidden
                className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-current bg-[var(--paper)]"
              />
            </div>
            <p className="mt-8 text-sm leading-relaxed text-[#454640]">
              {step.description}
            </p>
            <p className="mt-3 text-sm font-semibold">{step.confidencePoint}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-center font-heading text-3xl">
        You always know what happens next.
      </p>
    </SectionShell>
  );
}

function ServiceProcessSketch({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 190 100"
      aria-hidden
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
    >
      <path
        d={
          index === 0
            ? "M22 74 92 20l76 54M38 63v24m111-23v23M67 87V58h52v29"
            : index === 1
              ? "M16 84 92 20l81 64M28 76h137M52 60h86M72 43h45M48 87V63m91 24V62M92 20v67"
              : index === 2
                ? "M18 18h154v70H18zM18 31h154M32 45h126v29H32z"
                : "M26 50h34m14 0h34m14 0h34M60 50a7 7 0 1 0 14 0 7 7 0 1 0-14 0m48 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0"
        }
        strokeWidth="1.4"
      />
    </svg>
  );
}
