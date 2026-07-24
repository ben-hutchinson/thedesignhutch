import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { AboutSection } from "@/components/sections/about";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Meet Ben Hutchinson, founder and developer behind The Design Hutch, with direct accountability from first call to launch.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["about"]} />
      <AboutSection />
    </SiteShell>
  );
}
