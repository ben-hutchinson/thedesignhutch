import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/process";

export function ProcessSection() {
  return (
    <SectionShell
      id="process"
      className="bg-gradient-to-b from-transparent via-white/[0.01] to-transparent"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeading
            eyebrow="Process"
            title="Simple, transparent steps from first call to launch."
            description="The process is built to reduce uncertainty and keep momentum. You always know what happens next and why."
          />
        </Reveal>

        <div className="space-y-3">
          {processSteps.map((step, index) => (
            <Reveal key={step.step} delay={index * 0.06}>
              <Card className="relative overflow-hidden p-0">
                <div className="grid gap-4 p-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-5 sm:p-6">
                  <div className="bg-accent-blue/12 flex h-11 w-11 items-center justify-center rounded-full border border-accent-blue/35 font-heading text-base text-accent-blue">
                    {step.step}
                  </div>

                  <div>
                    <h3 className="font-heading text-2xl text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                      {step.description}
                    </p>
                    <p className="mt-3 text-sm font-medium text-white">
                      {step.confidencePoint}
                    </p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
