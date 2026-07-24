import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactSection } from "@/components/sections/contact";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Book a free website consultation or send an enquiry to The Design Hutch.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <SiteShell>
      <FunnelTracker sectionIds={["contact"]} />
      <ContactSection />
    </SiteShell>
  );
}
