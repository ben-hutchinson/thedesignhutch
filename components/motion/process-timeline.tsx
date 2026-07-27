import { ProcessIllustration } from "@/components/motion/process-illustrations";
import type { ProcessStep } from "@/content/process";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative mt-10">
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 right-0 top-[11.25rem] z-10 hidden h-10 w-full md:block"
      >
        <path
          d="M8 21C170 4 255 34 402 20S666 28 804 19s244 11 388-3"
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="2"
        />
      </svg>
      <ol
        data-testid="process-timeline"
        className="grid grid-cols-2 border-y border-[#181a17]/35 md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <li
            key={step.step}
            className="relative min-h-[22rem] border-b border-r border-[#181a17]/25 p-4 even:border-r-0 md:border-b-0 md:border-r md:p-6 md:even:border-r md:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-4xl sm:text-5xl">
                {step.step}
              </span>
              <span className="max-w-20 rotate-[-4deg] text-right font-heading text-sm italic leading-tight text-accent-orange">
                {step.annotation}
              </span>
            </div>
            <h2 className="mt-1 font-body text-sm font-bold">{step.title}</h2>
            <div className="mt-5 h-28 text-[#343630] sm:h-32">
              <ProcessIllustration index={index} />
            </div>
            <span
              aria-hidden
              className="absolute top-[12.1rem] z-20 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-blue bg-[var(--paper)] md:left-1/2 md:block"
            />
            <p className="mt-7 text-sm leading-relaxed text-[#454640]">
              {step.description}
            </p>
            <p className="mt-3 border-t border-[#181a17]/25 pt-3 text-xs font-bold leading-relaxed text-accent-blue">
              {step.outcome}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
