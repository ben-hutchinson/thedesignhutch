import type { Metadata } from "next";

import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { PortfolioSection } from "@/components/sections/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "See launched project proof from The Design Hutch, including challenge, solution, outcomes, timeline, and client feedback.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["portfolio"]} />
      <PortfolioSection />
    </SiteShell>
  );
}
