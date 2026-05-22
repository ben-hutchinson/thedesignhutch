import type { Metadata } from "next";

import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactSection } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a free website consultation or send an enquiry to The Design Hutch.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["contact"]} />
      <ContactSection />
    </SiteShell>
  );
}
