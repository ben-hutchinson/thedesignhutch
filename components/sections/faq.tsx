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
      className="border-y border-white/15 bg-base-900 !py-10 text-[#f5f1e7]"
      withTransition={false}
    >
      <div className="grid gap-8 lg:grid-cols-[.34fr_.66fr] lg:items-start lg:gap-14">
        <Heading className="max-w-md font-heading text-[clamp(3.2rem,4.5vw,4.3rem)] leading-[.88] tracking-[-.05em] lg:pl-10">
          Questions
          <br />
          before we start
        </Heading>
        <Accordion
          theme="dark"
          items={faqs.slice(0, 4).map((item, index) => ({
            id: `faq-${index + 1}`,
            question:
              index === 2
                ? "Can you redesign my existing site?"
                : index === 3
                  ? "What happens after launch?"
                  : item.question,
            answer: item.answer,
          }))}
        />
      </div>
    </SectionShell>
  );
}
