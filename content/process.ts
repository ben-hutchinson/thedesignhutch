export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  confidencePoint: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Consultation",
    description: "Goals, audience and priorities",
    confidencePoint: "",
  },
  {
    step: "02",
    title: "Design direction",
    description: "A tailored direction before payment",
    confidencePoint: "",
  },
  {
    step: "03",
    title: "Build & launch",
    description: "Responsive build, testing and release",
    confidencePoint: "",
  },
  {
    step: "04",
    title: "Ongoing support",
    description: "Updates, hosting and practical improvements",
    confidencePoint: "",
  },
];
