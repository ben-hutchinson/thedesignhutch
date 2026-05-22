import type { Metadata } from "next";

import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { FaqSection } from "@/components/sections/faq";
import { faqs } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about The Design Hutch pricing, timelines, redesigns, hosting, support, and DIY website builders.",
  alternates: {
    canonical: "/faq",
  },
};

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
          __html: JSON.stringify(jsonLdFaqPage),
        }}
      />
      <FunnelTracker sectionIds={["faq"]} />
      <FaqSection />
    </SiteShell>
  );
}
