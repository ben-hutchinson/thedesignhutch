import type { Metadata } from "next";

import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { ServicesSection } from "@/components/sections/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore The Design Hutch services: brochure websites, e-commerce stores, booking systems, hosting help, and automation support.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["services"]} />
      <ServicesSection />
    </SiteShell>
  );
}
