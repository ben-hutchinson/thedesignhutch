"use client";

import { useState } from "react";

import { PortfolioProofMotion } from "@/components/motion/portfolio-proof-motion";
import { createPortfolioCarouselState } from "@/components/portfolio/portfolio-carousel-state";
import { type Project } from "@/content/portfolio";

type PortfolioCarouselProps = {
  projects: Project[];
};

export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const [state] = useState(() => createPortfolioCarouselState(projects.length));
  const project = projects[state.activeIndex];

  if (!project) return null;

  return (
    <div
      data-testid="portfolio-carousel"
      data-project-count={projects.length}
      data-active-project={project.id}
    >
      <PortfolioProofMotion
        key={project.id}
        project={project}
        priority={state.activeIndex === 0}
        direction={state.direction}
      />
    </div>
  );
}
