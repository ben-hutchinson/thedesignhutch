export type Service = {
  title: string;
  summary: string;
  bestFor: string;
};

export const services: Service[] = [
  {
    title: "Brochure Websites",
    summary:
      "High-trust brochure sites that make your business look established and credible immediately.",
    bestFor:
      "Local businesses that rely on first impressions and direct enquiries.",
  },
  {
    title: "E-commerce Stores",
    summary:
      "Conversion-focused storefronts with clearer product hierarchy and friction-free checkout journeys.",
    bestFor:
      "Growing businesses that need online sales without clunky platform limitations.",
  },
  {
    title: "Booking Systems",
    summary:
      "Integrated booking experiences that reduce admin overhead and make appointments easy to secure.",
    bestFor: "Appointment-based services that lose time to manual scheduling.",
  },
  {
    title: "Hosting Help",
    summary:
      "Practical setup, migration, and performance support to keep your website stable and fast.",
    bestFor: "Businesses needing reliability without technical stress.",
  },
  {
    title: "Automation / AI",
    summary:
      "Thoughtful automation that removes repetitive tasks and improves response speed.",
    bestFor: "Teams ready to reduce manual work and operate more efficiently.",
  },
];
