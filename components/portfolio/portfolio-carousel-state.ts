export type CarouselDirection = -1 | 1;

export type PortfolioCarouselState = {
  activeIndex: number;
  autoplayEnabled: boolean;
  direction: CarouselDirection;
};

export type PortfolioCarouselAction =
  | { type: "next"; source: "automatic" | "manual" }
  | { type: "previous" }
  | { type: "play" }
  | { type: "pause" };

export type PortfolioAutoplayOptions = {
  hasMultipleProjects: boolean;
  autoplayEnabled: boolean;
  hydrated: boolean;
  inView: boolean;
  documentVisible: boolean;
  temporarilyPaused: boolean;
};

function hasMultipleProjects(projectCount: number): boolean {
  return projectCount > 1;
}

function normalizeIndex(index: number, projectCount: number): number {
  return ((index % projectCount) + projectCount) % projectCount;
}

function dormantState(): PortfolioCarouselState {
  return { activeIndex: 0, autoplayEnabled: false, direction: 1 };
}

export function createPortfolioCarouselState(
  projectCount: number,
): PortfolioCarouselState {
  if (!hasMultipleProjects(projectCount)) {
    return dormantState();
  }

  return { activeIndex: 0, autoplayEnabled: false, direction: 1 };
}

export function reducePortfolioCarousel(
  state: PortfolioCarouselState,
  action: PortfolioCarouselAction,
  projectCount: number,
): PortfolioCarouselState {
  if (!hasMultipleProjects(projectCount)) {
    return dormantState();
  }

  const activeIndex = normalizeIndex(state.activeIndex, projectCount);

  switch (action.type) {
    case "next":
      return {
        activeIndex: normalizeIndex(activeIndex + 1, projectCount),
        autoplayEnabled:
          action.source === "automatic" ? state.autoplayEnabled : false,
        direction: 1,
      };
    case "previous":
      return {
        activeIndex: normalizeIndex(activeIndex - 1, projectCount),
        autoplayEnabled: false,
        direction: -1,
      };
    case "play":
      return { ...state, activeIndex, autoplayEnabled: true };
    case "pause":
      return { ...state, activeIndex, autoplayEnabled: false };
  }
}

export function shouldSchedulePortfolioAutoplay(
  options: PortfolioAutoplayOptions,
): boolean {
  return (
    options.hasMultipleProjects &&
    options.autoplayEnabled &&
    options.hydrated &&
    options.inView &&
    options.documentVisible &&
    !options.temporarilyPaused
  );
}
