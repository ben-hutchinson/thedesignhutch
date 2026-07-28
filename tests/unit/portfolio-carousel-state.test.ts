import type { PortfolioCarouselAction } from "../../components/portfolio/portfolio-carousel-state";

const assert: typeof import("node:assert/strict") = require("node:assert/strict");
const test: typeof import("node:test") = require("node:test");
const {
  createPortfolioCarouselState,
  reducePortfolioCarousel,
  shouldSchedulePortfolioAutoplay,
} = require("../../components/portfolio/portfolio-carousel-state.ts") as typeof import("../../components/portfolio/portfolio-carousel-state");

test("creates a dormant state for one project", () => {
  assert.deepEqual(createPortfolioCarouselState(1), {
    activeIndex: 0,
    autoplayEnabled: false,
    direction: 1,
  });
});

test("reduces carousel navigation with literal outcomes", () => {
  const cases = [
    {
      name: "wraps automatic next navigation and preserves autoplay",
      state: { activeIndex: 2, autoplayEnabled: true, direction: 1 as const },
      action: { type: "next", source: "automatic" } as PortfolioCarouselAction,
      projectCount: 3,
      want: { activeIndex: 0, autoplayEnabled: true, direction: 1 },
    },
    {
      name: "wraps previous navigation and pauses autoplay",
      state: { activeIndex: 0, autoplayEnabled: true, direction: 1 as const },
      action: { type: "previous" } as PortfolioCarouselAction,
      projectCount: 3,
      want: { activeIndex: 2, autoplayEnabled: false, direction: -1 },
    },
    {
      name: "pauses autoplay after manual next navigation",
      state: { activeIndex: 0, autoplayEnabled: true, direction: 1 as const },
      action: { type: "next", source: "manual" } as PortfolioCarouselAction,
      projectCount: 3,
      want: { activeIndex: 1, autoplayEnabled: false, direction: 1 },
    },
  ];

  for (const { name, state, action, projectCount, want } of cases) {
    assert.deepEqual(reducePortfolioCarousel(state, action, projectCount), want, name);
  }
});

test("enables autoplay only when multiple projects can advance", () => {
  assert.deepEqual(
    reducePortfolioCarousel(
      { activeIndex: 0, autoplayEnabled: false, direction: 1 },
      { type: "play" },
      3,
    ),
    { activeIndex: 0, autoplayEnabled: true, direction: 1 },
  );

  assert.deepEqual(
    reducePortfolioCarousel(
      { activeIndex: 0, autoplayEnabled: false, direction: 1 },
      { type: "play" },
      1,
    ),
    { activeIndex: 0, autoplayEnabled: false, direction: 1 },
  );
});

test("pause disables autoplay without changing the active slide", () => {
  assert.deepEqual(
    reducePortfolioCarousel(
      { activeIndex: 1, autoplayEnabled: true, direction: -1 },
      { type: "pause" },
      3,
    ),
    { activeIndex: 1, autoplayEnabled: false, direction: -1 },
  );
});

test("zero-project inputs remain dormant and safe", () => {
  assert.deepEqual(createPortfolioCarouselState(0), {
    activeIndex: 0,
    autoplayEnabled: false,
    direction: 1,
  });

  assert.deepEqual(
    reducePortfolioCarousel(
      { activeIndex: 4, autoplayEnabled: true, direction: -1 },
      { type: "next", source: "automatic" },
      0,
    ),
    { activeIndex: 0, autoplayEnabled: false, direction: 1 },
  );
});

test("schedules autoplay only when every scheduling condition is true", () => {
  const enabled = {
    hasMultipleProjects: true,
    autoplayEnabled: true,
    hydrated: true,
    inView: true,
    documentVisible: true,
    temporarilyPaused: false,
  };

  assert.equal(shouldSchedulePortfolioAutoplay(enabled), true);

  for (const key of [
    "hasMultipleProjects",
    "autoplayEnabled",
    "hydrated",
    "inView",
    "documentVisible",
  ] as const) {
    assert.equal(
      shouldSchedulePortfolioAutoplay({ ...enabled, [key]: false }),
      false,
      `does not schedule when ${key} is false`,
    );
  }

  assert.equal(
    shouldSchedulePortfolioAutoplay({ ...enabled, temporarilyPaused: true }),
    false,
  );
});
