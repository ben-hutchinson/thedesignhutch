import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { ServicesSection } from "@/components/sections/services";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore The Design Hutch services: brochure websites, e-commerce stores, booking systems, hosting help, and automation support.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["services"]} />
      <ServicesSection />
    </SiteShell>
  );
}
