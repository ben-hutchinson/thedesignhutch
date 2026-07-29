"use client";

import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { AnimatePresence, useInView } from "motion/react";

import { PortfolioProofMotion } from "@/components/motion/portfolio-proof-motion";
import { useResolvedMotion } from "@/components/motion/use-resolved-motion";
import {
  createPortfolioCarouselState,
  reducePortfolioCarousel,
  shouldSchedulePortfolioAutoplay,
} from "@/components/portfolio/portfolio-carousel-state";
import { type Project } from "@/content/portfolio";

type PortfolioCarouselProps = {
  projects: Project[];
};

type PointerStart = {
  pointerId: number;
  x: number;
  y: number;
};

const AUTOPLAY_DELAY_MS = 8_000;
const SWIPE_THRESHOLD_PX = 60;

function wrappedIndex(index: number, projectCount: number): number {
  return ((index % projectCount) + projectCount) % projectCount;
}

export function PortfolioCarousel({ projects }: PortfolioCarouselProps) {
  const projectCount = projects.length;
  const hasMultipleProjects = projectCount > 1;
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const autoplayInitializedRef = useRef(false);
  const inView = useInView(rootRef, { amount: 0.3 });
  const { hydrated, reduced } = useResolvedMotion();
  const [state, dispatch] = useReducer(
    (currentState, action) =>
      reducePortfolioCarousel(currentState, action, projectCount),
    projectCount,
    createPortfolioCarouselState,
  );
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const project = projects[state.activeIndex];

  useEffect(() => {
    const updateDocumentVisibility = () => {
      setDocumentVisible(document.visibilityState === "visible");
    };

    updateDocumentVisibility();
    document.addEventListener("visibilitychange", updateDocumentVisibility);
    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateDocumentVisibility,
      );
    };
  }, []);

  useEffect(() => {
    if (!hasMultipleProjects) return;

    if (reduced) {
      dispatch({ type: "pause" });
      return;
    }

    if (hydrated && !autoplayInitializedRef.current) {
      autoplayInitializedRef.current = true;
      dispatch({ type: "play" });
    }
  }, [hasMultipleProjects, hydrated, reduced]);

  useEffect(() => {
    const shouldSchedule = shouldSchedulePortfolioAutoplay({
      hasMultipleProjects,
      autoplayEnabled: state.autoplayEnabled,
      hydrated,
      inView,
      documentVisible,
      temporarilyPaused: hovered || focusWithin || reduced,
    });

    if (!shouldSchedule) return;

    const timeout = window.setTimeout(() => {
      dispatch({ type: "next", source: "automatic" });
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [
    documentVisible,
    focusWithin,
    hasMultipleProjects,
    hovered,
    hydrated,
    inView,
    reduced,
    state.activeIndex,
    state.autoplayEnabled,
  ]);

  const navigateManually = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = wrappedIndex(
        state.activeIndex + direction,
        projectCount,
      );
      const nextProject = projects[nextIndex];

      dispatch(
        direction === 1
          ? { type: "next", source: "manual" }
          : { type: "previous" },
      );
      setAnnouncement(
        nextProject
          ? `Project ${nextIndex + 1} of ${projectCount}: ${nextProject.title}`
          : "",
      );
    },
    [projectCount, projects, state.activeIndex],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateManually(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateManually(1);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusWithin(false);
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.target instanceof Element &&
      event.target.closest("a, button, input, select, textarea")
    ) {
      return;
    }

    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const releasePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerStartRef.current = null;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;

    if (!start || start.pointerId !== event.pointerId) {
      releasePointer(event);
      return;
    }

    const horizontalTravel = event.clientX - start.x;
    const verticalTravel = event.clientY - start.y;
    releasePointer(event);

    if (
      Math.abs(horizontalTravel) >= SWIPE_THRESHOLD_PX &&
      Math.abs(horizontalTravel) > Math.abs(verticalTravel)
    ) {
      navigateManually(horizontalTravel < 0 ? 1 : -1);
    }
  };

  if (!project) return null;

  return (
    <div
      ref={rootRef}
      data-testid="portfolio-carousel"
      data-project-count={projectCount}
      data-active-project={project.id}
      data-autoplay-enabled={state.autoplayEnabled}
      className="touch-pan-y"
      onBlur={handleBlur}
      onFocus={() => setFocusWithin(true)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerCancel={releasePointer}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {hasMultipleProjects ? (
        <div className="mb-8 flex items-center justify-end gap-3 border-y border-[#181a17]/35 py-3 sm:gap-4">
          <button
            type="button"
            aria-label="Show previous project"
            className="grid h-11 w-11 place-items-center border border-[#181a17] font-heading text-2xl transition-colors hover:bg-[#181a17] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            onClick={() => navigateManually(-1)}
          >
            <span aria-hidden>←</span>
          </button>
          <p className="min-w-[4.75rem] text-center font-heading text-lg tabular-nums">
            {String(state.activeIndex + 1).padStart(2, "0")} /{" "}
            {String(projectCount).padStart(2, "0")}
          </p>
          <button
            type="button"
            aria-label="Show next project"
            className="grid h-11 w-11 place-items-center border border-[#181a17] font-heading text-2xl transition-colors hover:bg-[#181a17] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            onClick={() => navigateManually(1)}
          >
            <span aria-hidden>→</span>
          </button>
          <span className="mx-1 h-8 w-px bg-[#181a17]/35" aria-hidden />
          <button
            type="button"
            aria-label={
              state.autoplayEnabled
                ? "Pause portfolio rotation"
                : "Start portfolio rotation"
            }
            className="min-h-11 border-b-2 border-accent-blue px-2 font-heading text-base transition-colors hover:text-accent-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
            onClick={() =>
              dispatch({ type: state.autoplayEnabled ? "pause" : "play" })
            }
          >
            {state.autoplayEnabled ? "Pause" : "Play"}
          </button>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {announcement}
          </p>
        </div>
      ) : null}

      <AnimatePresence initial={false} mode="wait" custom={state.direction}>
        <PortfolioProofMotion
          key={project.id}
          project={project}
          priority={state.activeIndex === 0}
          direction={state.direction}
        />
      </AnimatePresence>
    </div>
  );
}
