import { FunnelTracker } from "@/components/analytics/funnel-tracker";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSection } from "@/components/sections/hero";
import { SiteOverviewSection } from "@/components/sections/site-overview";
import { services } from "@/content/services";
import { contactDetails, serviceAreas } from "@/content/site";
import { siteConfig } from "@/lib/constants";

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  email: contactDetails.email,
  sameAs: [],
};

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteConfig.url}/#localbusiness`,
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  parentOrganization: {
    "@id": `${siteConfig.url}/#organization`,
  },
  priceRange: "££",
  areaServed: serviceAreas.map((area) => ({
    "@type": "AdministrativeArea",
    name: area,
  })),
  address: {
    "@type": "PostalAddress",
    addressLocality: "South Manchester",
    addressRegion: "Greater Manchester",
    addressCountry: "GB",
  },
  email: contactDetails.email,
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: service.title,
      description: service.summary,
    },
  })),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: contactDetails.email,
    availableLanguage: ["en"],
  },
};

export default function HomePage() {
  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganization),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdLocalBusiness),
        }}
      />
      <FunnelTracker sectionIds={["site-overview"]} />
      <HeroSection />
      <SiteOverviewSection />
    </SiteShell>
  );
}
