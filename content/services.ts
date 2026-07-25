export type Service = {
  title: string;
  summary: string;
  bestFor: string;
};

export const services: Service[] = [
  {
    title: "Brochure websites",
    summary: "Build trust and generate enquiries",
    bestFor:
      "Local businesses that rely on first impressions and direct enquiries.",
  },
  {
    title: "E-commerce stores",
    summary: "Sell clearly without platform clutter",
    bestFor:
      "Growing businesses that need online sales without clunky platform limitations.",
  },
  {
    title: "Booking systems",
    summary: "Make appointments easier to secure",
    bestFor: "Appointment-based services that lose time to manual scheduling.",
  },
  {
    title: "Hosting help",
    summary: "Keep the site fast, stable and supported",
    bestFor: "Businesses needing reliability without technical stress.",
  },
  {
    title: "Automation & AI",
    summary: "Remove repetitive work thoughtfully",
    bestFor: "Teams ready to reduce manual work and operate more efficiently.",
  },
];
