export const navItems = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const contactDetails = {
  email: "hello@thedesignhutch.com",
  calendlyUrl:
    "https://calendly.com/hello-thedesignhutch?hide_landing_page_details=1&hide_gdpr_banner=1",
  formspreeEndpoint: "https://formspree.io/f/mojbeved",
};

export const serviceAreas = ["South Manchester", "Cheshire"] as const;

export const heroContent = {
  headline:
    "Modern websites that help local businesses look trusted and win enquiries.",
  subheadline:
    "I work directly with South Manchester and Cheshire businesses to audit outdated sites, redesign the customer journey, launch the new website, and support it after go-live.",
  proofChips: [
    "Free website review",
    "Design + build to launch",
    "Maintenance after launch",
  ],
} as const;

export const consultationChecklist = [
  "Current-site review",
  "Mobile and SEO friction notes",
  "Priority roadmap",
  "Rough scope and timeline",
] as const;
