import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { FaqSection } from "@/components/sections/faq";
import { faqs } from "@/content/faq";
import { toJsonLdScriptValue } from "@/lib/json-ld";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "FAQ",
  description:
    "Answers to common questions about The Design Hutch pricing, timelines, redesigns, hosting, support, and DIY website builders.",
  path: "/faq",
});

const jsonLdFaqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLdScriptValue(jsonLdFaqPage),
        }}
      />
      <FunnelTracker sectionIds={["faq"]} />
      <FaqSection />
    </SiteShell>
  );
}
