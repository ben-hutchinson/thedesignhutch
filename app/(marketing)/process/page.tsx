import type { Metadata } from "next";

import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { ProcessSection } from "@/components/sections/process";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Understand The Design Hutch process from free consultation and design approval through build, launch, and support.",
  alternates: {
    canonical: "/process",
  },
};

export default function ProcessPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["process"]} />
      <ProcessSection />
    </SiteShell>
  );
}
