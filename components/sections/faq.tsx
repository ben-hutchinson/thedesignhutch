import {
  TrackedAnchor,
  TrackedLink,
} from "@/components/analytics/tracked-link";
import { SectionShell } from "@/components/layout/section-shell";
import { Reveal } from "@/components/motion/reveal";
import { Accordion } from "@/components/ui/accordion";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/content/faq";
import { contactDetails } from "@/content/site";
import { cn } from "@/lib/utils";

export function FaqSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  return (
    <SectionShell id="faq" className="bg-base-900 text-[#f5f1e7]">
      <Reveal className="mb-10">
        <SectionHeading
          level={headingLevel}
          eyebrow="Questions before we start"
          title="Straight answers, before you commit."
          description="If you are comparing options, these are the practical questions most owners ask before moving forward."
        />
      </Reveal>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
        <Reveal>
          <Accordion
            theme="dark"
            items={faqs.map((item, index) => ({
              id: `faq-${index + 1}`,
              question: item.question,
              answer: item.answer,
            }))}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="h-full border-white/20 text-white [background:#151714]">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-300">
              Still deciding?
            </p>
            <h3 className="mt-3 font-heading text-3xl text-white">
              Get a no-pressure consultation.
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              You can ask anything about scope, timing, budget, or technical
              setup before committing.
            </p>

            <div className="mt-5 space-y-3 border border-white/20 bg-white/[.03] p-4">
              <p className="text-sm text-zinc-200">
                Prefer email first?
                <TrackedAnchor
                  href={`mailto:${contactDetails.email}`}
                  className="ml-1 font-medium text-[#9fb1ff] hover:text-white"
                  tracking={{
                    ctaId: "faq_email",
                    source: "faq",
                    destination: `mailto:${contactDetails.email}`,
                  }}
                >
                  {contactDetails.email}
                </TrackedAnchor>
              </p>
              <TrackedLink
                href="/contact"
                className={cn(buttonStyles({}), "w-full justify-center")}
                tracking={{
                  ctaId: "faq_enquiry",
                  source: "faq",
                  destination: "/contact",
                }}
              >
                <span className="relative z-[1]">Send Enquiry</span>
              </TrackedLink>
            </div>
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
}
