export const navItems = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const overviewCards = [
  {
    href: "/services",
    label: "Services",
    title: "Choose the right build scope",
    description:
      "Brochure websites, e-commerce, booking systems, hosting help, and practical automation support.",
    ctaLabel: "Explore services",
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    title: "See proof from a real launch",
    description:
      "Review past projects, including the challenge, solution, outcome and a client testimonial.",
    ctaLabel: "See project proof",
  },
  {
    href: "/process",
    label: "Process",
    title: "Understand how the project runs",
    description:
      "A clear four-step journey from consultation and design approval through build, launch, and support.",
    ctaLabel: "See the process",
  },
  {
    href: "/faq",
    label: "FAQ",
    title: "Remove common blockers",
    description:
      "Straight answers on cost, timing, redesigns, hosting, support, and alternatives to DIY builders.",
    ctaLabel: "Read the answers",
  },
  {
    href: "/about",
    label: "About",
    title: "Know who is building it",
    description:
      "Founder-led delivery, five-plus years coding, one point of contact, and direct accountability.",
    ctaLabel: "Meet the founder",
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Start with a free review",
    description:
      "Send an enquiry, email directly, or book a consultation to get practical next steps.",
    ctaLabel: "Book the review",
  },
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
