export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  confidencePoint: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Free Consultation",
    description:
      "We clarify your goals, audience, and what your website needs to improve first.",
    confidencePoint: "You get practical direction before committing to a build.",
  },
  {
    step: "02",
    title: "Design Approval",
    description:
      "You review a tailored design direction aligned to your brand and conversion goals.",
    confidencePoint: "No payment is due until this direction is approved.",
  },
  {
    step: "03",
    title: "Build & Launch",
    description:
      "I develop the site for speed, SEO, and a smooth journey from landing to enquiry.",
    confidencePoint: "Everything is tested for mobile performance and clarity.",
  },
  {
    step: "04",
    title: "Support",
    description:
      "Post-launch support is available for updates, hosting help, and growth improvements.",
    confidencePoint: "You keep a direct line to the same person after launch.",
  },
];
