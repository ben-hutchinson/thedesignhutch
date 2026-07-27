export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  outcome: string;
  annotation: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Consultation",
    description:
      "We map your goals, audience, current friction and the job the website needs to do.",
    outcome: "A clear brief and agreed priorities",
    annotation: "Listen first",
  },
  {
    step: "02",
    title: "Design direction",
    description:
      "You see the structure, visual language and key journey before the full build begins.",
    outcome: "A direction you approve before build",
    annotation: "Shape the idea",
  },
  {
    step: "03",
    title: "Build & launch",
    description:
      "I build responsively, test the important paths and prepare a careful release.",
    outcome: "A tested site ready for real customers",
    annotation: "Make it work",
  },
  {
    step: "04",
    title: "Ongoing support",
    description:
      "After launch I can handle hosting, updates and practical improvements as needs change.",
    outcome: "A reliable site that keeps improving",
    annotation: "Keep it useful",
  },
];
