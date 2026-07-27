import { SectionShell } from "@/components/layout/section-shell";
import { Accordion } from "@/components/ui/accordion";
import { faqs } from "@/content/faq";

export function FaqSection({
  headingLevel = "h1",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  return (
    <SectionShell
      id="faq"
      className="border-t border-white/15 bg-base-900 !py-10 text-[#f5f1e7]"
      withTransition={false}
    >
      <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr] lg:items-start lg:gap-14">
        <div className="lg:pl-10">
          <p
            data-section-number
            className="border-t border-accent-blue pt-3 text-sm font-bold tracking-[.16em] text-[#8da3ff]"
          >
            04
          </p>
          <Heading className="mt-6 max-w-md font-heading text-[clamp(3.2rem,4.5vw,4.3rem)] leading-[.88] tracking-[-.05em]">
            Questions
            <br />
            before we start
          </Heading>
        </div>
        <Accordion
          theme="dark"
          items={faqs.map((item, index) => ({
            id: `faq-${index + 1}`,
            question: item.question,
            answer: item.answer,
          }))}
        />
      </div>
    </SectionShell>
  );
}
