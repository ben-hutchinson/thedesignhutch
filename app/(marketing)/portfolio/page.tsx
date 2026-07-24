import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { PortfolioSection } from "@/components/sections/portfolio";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Portfolio",
  description:
    "See launched project proof from The Design Hutch, including challenge, solution, outcomes, timeline, and client feedback.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["portfolio"]} />
      <PortfolioSection />
    </SiteShell>
  );
}
