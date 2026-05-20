export const founderProfile = {
  name: "Ben Hutchinson",
  role: "Founder + Developer",
  summary:
    "The Design Hutch is intentionally founder-led. You work directly with the person planning, designing, and building your site from first call to launch.",
};

export const founderImage: {
  src: string | null;
  alt: string;
} = {
  src: "/founder/ben-hutchinson-headshot-cropped.jpg",
  alt: "Ben Hutchinson, founder of The Design Hutch",
};

export const trustStats = [
  { label: "Years coding", value: "5+" },
  { label: "Agency handoffs", value: "0" },
  { label: "Point of contact", value: "1" },
] as const;

export const proofHighlights = [
  {
    title: "Founder-led delivery",
    description:
      "You speak directly with the person planning, designing, and building your website.",
  },
  {
    title: "One point of contact",
    description:
      "No agency handoffs, account managers, or confusing chains of responsibility.",
  },
  {
    title: "Launch and maintenance support",
    description:
      "I can stay involved after launch for updates, hosting help, and practical improvements.",
  },
] as const;

export const founderCommitments = [
  "Clear, practical advice without technical jargon.",
  "Design and build quality focused on real business outcomes.",
  "Personal accountability and support beyond launch.",
  "Collaborative decisions at each key milestone.",
  "Transparent updates from first call to release.",
] as const;
