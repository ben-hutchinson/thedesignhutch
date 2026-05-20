export type ProjectScreenshot = {
  src: string;
  alt: string;
  label: string;
};

export type Project = {
  title: string;
  href: string;
  urlLabel: string;
  summary: string;
  challenge: string;
  solution: string;
  outcomes: string[];
  services: string[];
  timeline: string;
  timelineSteps: {
    date: string;
    label: string;
  }[];
  testimonial?: {
    quote: string;
    attribution: string;
  };
  screenshots: ProjectScreenshot[];
};

export const projects: Project[] = [
  {
    title: "Double Double Good",
    href: "https://doubledoublegood.co.uk",
    urlLabel: "doubledoublegood.co.uk",
    summary:
      "A clean, mobile-aware website for an independent music emporium, built to make stock, opening details, and shop credibility easier to understand at a glance.",
    challenge:
      "The business needed migrating from a legacy PHP Wordpress site to a modernised, enticing website that customers could reliably check before visiting.",
    solution:
      "The site presents the shop clearly across desktop and mobile, with a focused homepage, direct navigation, practical contact routes, and visual detail that reflects the business without adding friction.",
    outcomes: [
      "Clearer first impression for new customers",
      "Reduced monthly infra spend from legacy PHP website by 50%",
      "Live website with direct routes to shop information and contact",
    ],
    services: ["Website design", "Responsive build", "Launch support"],
    timeline: "Brochure website launch",
    timelineSteps: [
      { date: "April", label: "Design consultation" },
      { date: "April", label: "Development work" },
      { date: "May", label: "Deployment" },
    ],
    testimonial: {
      quote:
        "Ben at The Design Hutch was fantastic. Initially came with a few design ideas which we refined and decided on. He then took it away and redesigned the website, checking in on key decisions along the way. It felt like my website was in good hands. Finally, we came together for an exciting release of the new website.",
      attribution: "Double Double Good",
    },
    screenshots: [
      {
        src: "/portfolio/doubledoublegood/desktop-home.png",
        alt: "Double Double Good website desktop homepage screenshot",
        label: "Desktop home",
      },
      {
        src: "/portfolio/doubledoublegood/desktop-scroll.png",
        alt: "Double Double Good website desktop content screenshot",
        label: "Desktop detail",
      },
      {
        src: "/portfolio/doubledoublegood/mobile-home.png",
        alt: "Double Double Good website mobile homepage screenshot",
        label: "Mobile view",
      },
    ],
  },
];
