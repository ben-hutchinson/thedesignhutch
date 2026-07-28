# Portfolio Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Portfolio proof assembly automatically support multiple rotating projects while preserving the approved one-project appearance and replaying its motion sequence on every project change.

**Architecture:** Keep `PortfolioSection` server-rendered and pass serializable project data into a focused `PortfolioCarousel` client controller. Move visible proof content into the `Project` model, isolate index/autoplay transitions in a pure reducer, and let `PortfolioProofMotion` render one keyed project at a time inside `AnimatePresence`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, `motion/react`, Node test runner, Playwright.

## Global Constraints

- No new dependency; reuse `motion/react`.
- Preserve static export and Cloudflare Pages compatibility.
- Keep the current single-project presentation visually unchanged and hide all carousel controls when fewer than two projects exist.
- Use an eight-second autoplay interval for multiple projects.
- Pause autoplay on hover, focus, out-of-view, and hidden-document states; manual navigation disables autoplay until explicit play.
- Reduced-motion visitors start without autoplay and receive immediate, non-travelling slide changes.
- Do not publish invented portfolio projects or unapproved client assets.
- Animate transforms and opacity only; prevent layout shift and horizontal overflow.

---

### Task 1: Data-driven project proof model

**Files:**

- Modify: `content/portfolio.ts`
- Create: `tests/unit/portfolio-content.test.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: `ProjectMetric`, `ProjectProofImage`, and expanded `Project` types.
- Produces: every project’s `id`, `eyebrow`, `proofHeadline`, `proofMetrics`, `featuredQuoteLines`, and `proofImages` fields.
- Produces: `npm run test:unit` using Node’s native TypeScript-aware test runner.

- [ ] **Step 1: Add a failing project-content contract test**

Create `tests/unit/portfolio-content.test.ts` with literal expectations that catch missing carousel identity or hard-coded proof content:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { projects } from "../../content/portfolio.ts";

test("every portfolio project contains a complete featured proof", () => {
  assert.ok(projects.length > 0);
  assert.deepEqual(
    projects.map((project) => ({
      id: project.id,
      eyebrow: project.eyebrow,
      headline: project.proofHeadline,
      metricCount: project.proofMetrics.length,
      quoteLines: project.featuredQuoteLines.length,
      desktop: project.proofImages.desktop.src,
      mobile: project.proofImages.mobile.src,
    })),
    [
      {
        id: "double-double-good",
        eyebrow: "Independent music emporium · Stafford",
        headline:
          "A clearer, faster website for a much-loved independent record shop.",
        metricCount: 3,
        quoteLines: 2,
        desktop: "/portfolio/doubledoublegood/desktop-home.webp",
        mobile: "/portfolio/doubledoublegood/mobile-home.webp",
      },
    ],
  );
});
```

- [ ] **Step 2: Add the unit-test script and verify RED**

Add this script to `package.json`:

```json
"test:unit": "node --test tests/unit/*.test.ts"
```

Run: `npm run test:unit`

Expected: FAIL because the current `Project` shape has no `id`, `eyebrow`, `proofHeadline`, `proofMetrics`, `featuredQuoteLines`, or `proofImages` fields.

- [ ] **Step 3: Expand the content model and migrate the real project**

Add these types to `content/portfolio.ts`:

```ts
export type ProjectMetric = {
  label: string;
  detail: string;
  presentation: "numeric" | "short" | "long";
};

export type ProjectProofImage = {
  src: string;
  alt: string;
};
```

Extend `Project` with:

```ts
id: string;
eyebrow: string;
proofHeadline: string;
proofMetrics: [ProjectMetric, ProjectMetric, ProjectMetric];
featuredQuoteLines: [string, string];
proofImages: {
  desktop: ProjectProofImage;
  mobile: ProjectProofImage;
}
```

Populate the Double Double Good entry with the exact literals asserted by the test. Use these metric presentations:

```ts
proofMetrics: [
  { label: "50%", detail: "lower infrastructure cost", presentation: "numeric" },
  { label: "Responsive", detail: "launch", presentation: "long" },
  { label: "Direct", detail: "founder collaboration", presentation: "short" },
],
featuredQuoteLines: ["It felt like my website", "was in good hands"],
```

Retain existing longer-form fields and screenshots so no future case-study capability is removed.

- [ ] **Step 4: Verify GREEN**

Run: `npm run test:unit`

Expected: one passing test and zero failures.

- [ ] **Step 5: Commit the data contract**

```bash
git add package.json content/portfolio.ts tests/unit/portfolio-content.test.ts
git commit -m "refactor: make portfolio proof data driven"
```

---

### Task 2: Pure carousel state and autoplay policy

**Files:**

- Create: `components/portfolio/portfolio-carousel-state.ts`
- Create: `tests/unit/portfolio-carousel-state.test.ts`

**Interfaces:**

- Produces: `CarouselDirection = -1 | 1`.
- Produces: `PortfolioCarouselState = { activeIndex: number; autoplayEnabled: boolean; direction: CarouselDirection }`.
- Produces: `createPortfolioCarouselState(projectCount: number): PortfolioCarouselState`.
- Produces: `reducePortfolioCarousel(state, action, projectCount): PortfolioCarouselState`.
- Produces: `shouldSchedulePortfolioAutoplay(options): boolean`.

- [ ] **Step 1: Write failing state-transition tests**

Create table-driven tests that assert literal outcomes for:

```ts
assert.deepEqual(createPortfolioCarouselState(1), {
  activeIndex: 0,
  autoplayEnabled: false,
  direction: 1,
});

assert.deepEqual(
  reducePortfolioCarousel(
    { activeIndex: 2, autoplayEnabled: true, direction: 1 },
    { type: "next", source: "automatic" },
    3,
  ),
  { activeIndex: 0, autoplayEnabled: true, direction: 1 },
);

assert.deepEqual(
  reducePortfolioCarousel(
    { activeIndex: 0, autoplayEnabled: true, direction: 1 },
    { type: "previous" },
    3,
  ),
  { activeIndex: 2, autoplayEnabled: false, direction: -1 },
);

assert.deepEqual(
  reducePortfolioCarousel(
    { activeIndex: 0, autoplayEnabled: true, direction: 1 },
    { type: "next", source: "manual" },
    3,
  ),
  { activeIndex: 1, autoplayEnabled: false, direction: 1 },
);
```

Also assert that `play` enables multiple-project autoplay, `pause` disables it, zero-project inputs remain safe, and `shouldSchedulePortfolioAutoplay` returns true only when all six conditions are true: multiple projects, autoplay enabled, hydrated, in view, document visible, and not temporarily paused.

- [ ] **Step 2: Verify RED**

Run: `npm run test:unit`

Expected: FAIL with module-not-found for `portfolio-carousel-state.ts`.

- [ ] **Step 3: Implement the minimal pure reducer**

Implement discriminated actions:

```ts
export type PortfolioCarouselAction =
  | { type: "next"; source: "automatic" | "manual" }
  | { type: "previous" }
  | { type: "play" }
  | { type: "pause" };
```

Normalize the index with modulo arithmetic, force the dormant zero/one-project state to index zero with autoplay off, preserve autoplay only for automatic advancement, and make `shouldSchedulePortfolioAutoplay` a side-effect-free boolean predicate.

- [ ] **Step 4: Verify GREEN and mutation coverage**

Run: `npm run test:unit`

Expected: all content and state tests pass. Confirm mentally that reversing either modulo direction, preserving autoplay after manual navigation, or ignoring one pause condition would fail at least one assertion.

- [ ] **Step 5: Commit the state machine**

```bash
git add components/portfolio/portfolio-carousel-state.ts tests/unit/portfolio-carousel-state.test.ts
git commit -m "feat: add portfolio carousel state machine"
```

---

### Task 3: Data-driven proof rendering with dormant single-project controls

**Files:**

- Create: `components/portfolio/portfolio-carousel.tsx`
- Modify: `components/motion/portfolio-proof-motion.tsx`
- Modify: `components/sections/portfolio.tsx`
- Modify: `tests/e2e/conversion.spec.ts`
- Modify: `tests/e2e/showpiece-motion.spec.ts`

**Interfaces:**

- Consumes: `Project[]`, `createPortfolioCarouselState`, `reducePortfolioCarousel`, and `shouldSchedulePortfolioAutoplay`.
- Produces: `<PortfolioCarousel projects={projects} />`.
- Changes: `<PortfolioProofMotion project={project} priority={boolean} direction={CarouselDirection} />` renders one complete proof.

- [ ] **Step 1: Add failing single-project browser assertions**

Extend the existing portfolio conversion test with:

```ts
const carousel = page.getByTestId("portfolio-carousel");
await expect(carousel).toHaveAttribute("data-project-count", "1");
await expect(carousel).toHaveAttribute(
  "data-active-project",
  "double-double-good",
);
await expect(
  page.getByRole("button", { name: "Show previous project" }),
).toHaveCount(0);
await expect(
  page.getByRole("button", { name: "Show next project" }),
).toHaveCount(0);
await expect(
  page.getByRole("button", { name: /portfolio rotation/i }),
).toHaveCount(0);
```

Update the motion test to locate the proof within `portfolio-carousel` and retain all current proof, metric, testimonial, reduced-motion, and no-JavaScript expectations.

- [ ] **Step 2: Verify RED**

Run:

```bash
npx playwright test tests/e2e/conversion.spec.ts tests/e2e/showpiece-motion.spec.ts --project=desktop-chromium
```

Expected: FAIL because `portfolio-carousel` and its data attributes do not exist.

- [ ] **Step 3: Refactor the proof renderer around `Project`**

Change `PortfolioProofMotion` to accept a project instead of prebuilt React nodes. Render its title, eyebrow, headline, metrics, featured quote lines, attribution, CTA, and two proof images from project data. Map `numeric`, `short`, and `long` metric presentations to the existing static Tailwind class strings so the current project keeps its exact widths and type sizes.

Keep `useInView({ once: true, amount: 0.3 })`, the hydration-safe final server state, the compact mobile distance, and all existing test IDs. Set image `priority` only when the received `priority` prop is true.

- [ ] **Step 4: Add the dormant carousel shell**

Create `PortfolioCarousel` as a client component. For this task it renders the active project and exposes:

```tsx
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
```

Return `null` for an empty project collection. Render no controls for the current one-project collection. Replace the hard-coded proof construction in `PortfolioSection` with `<PortfolioCarousel projects={projects} />` while leaving its shell, heading, coordinates, and mobile introduction unchanged.

- [ ] **Step 5: Verify GREEN and current visual fidelity**

Run:

```bash
npm run test:unit
npx playwright test tests/e2e/conversion.spec.ts tests/e2e/showpiece-motion.spec.ts --project=desktop-chromium
```

Expected: all targeted tests pass and no visual snapshot changes are required for the one-project page.

- [ ] **Step 6: Commit the renderer refactor**

```bash
git add components/portfolio/portfolio-carousel.tsx components/motion/portfolio-proof-motion.tsx components/sections/portfolio.tsx tests/e2e/conversion.spec.ts tests/e2e/showpiece-motion.spec.ts
git commit -m "refactor: render portfolio proof through carousel shell"
```

---

### Task 4: Multi-project controls, autoplay, swipe, and replayed motion

**Files:**

- Modify: `components/portfolio/portfolio-carousel.tsx`
- Modify: `components/motion/portfolio-proof-motion.tsx`
- Modify: `tests/unit/portfolio-carousel-state.test.ts`
- Create temporarily, then remove before commit: `content/portfolio-carousel.fixture.ts`

**Interfaces:**

- Consumes: reducer and autoplay predicate from Task 2.
- Produces: previous, next, play/pause, counter, live announcement, swipe, keyboard navigation, visibility pausing, and direction-aware `AnimatePresence` transitions.

- [ ] **Step 1: Prepare a temporary two-project local fixture**

Create an uncommitted fixture by cloning the complete real project and changing only `id`, `title`, `href`, `eyebrow`, `proofHeadline`, metrics, quote lines, and alt text to obvious test values. Temporarily pass `[projects[0], fixtureProject]` into `PortfolioCarousel` from `PortfolioSection`. This fixture exists only to exercise the real rendered component and must be removed before the task commit.

- [ ] **Step 2: Add temporary failing interaction tests**

In a temporary Playwright spec outside committed source, assert:

```ts
await expect(
  page.getByRole("button", { name: "Show previous project" }),
).toBeVisible();
await expect(
  page.getByRole("button", { name: "Show next project" }),
).toBeVisible();
await expect(page.getByText("01 / 02", { exact: true })).toBeVisible();
await page.getByRole("button", { name: "Show next project" }).click();
await expect(page.getByTestId("portfolio-carousel")).toHaveAttribute(
  "data-active-project",
  "carousel-fixture",
);
await expect(page.getByText("02 / 02", { exact: true })).toBeVisible();
await expect(
  page.getByRole("button", { name: "Start portfolio rotation" }),
).toBeVisible();
await expect(page.getByRole("status")).toContainText("Project 2 of 2");
```

Also exercise previous wrap-around, ArrowLeft/ArrowRight within the carousel, a horizontal swipe greater than 60px, focus pause, explicit play/pause, and reduced-motion initial pause.

- [ ] **Step 3: Verify RED**

Run the temporary spec against `http://127.0.0.1:4173/`.

Expected: FAIL because multi-project controls and navigation are not implemented.

- [ ] **Step 4: Implement accessible controls and state transitions**

Use `useReducer`, with a reducer closure over `projects.length`. Render controls only when `projects.length > 1`. Use buttons with these action-oriented accessible names:

```tsx
aria-label="Show previous project"
aria-label="Show next project"
aria-label={state.autoplayEnabled ? "Pause portfolio rotation" : "Start portfolio rotation"}
```

Format the visible counter with `String(index + 1).padStart(2, "0")`. Update a visually hidden `role="status" aria-live="polite" aria-atomic="true"` only after manual previous, next, keyboard, or swipe changes.

- [ ] **Step 5: Implement autoplay pause conditions**

Track `hovered`, `focusWithin`, `documentVisible`, and live `useInView` state. Install a `visibilitychange` listener once. Use a cleaned-up `window.setTimeout(..., 8000)` only when `shouldSchedulePortfolioAutoplay` returns true. Dispatch automatic next without disabling autoplay. On first hydrated non-reduced render with multiple projects, dispatch `play`; dispatch `pause` whenever reduced motion becomes true.

- [ ] **Step 6: Implement pointer and keyboard navigation**

Capture pointer start coordinates. On pointer release, navigate only when horizontal travel is at least 60px and exceeds vertical travel. Use pointer capture so release remains reliable. Handle ArrowLeft and ArrowRight when focus is inside the carousel without changing focus. Every manual navigation dispatch disables autoplay and announces the selected project.

- [ ] **Step 7: Replay the proof assembly directionally**

Wrap the keyed proof in `AnimatePresence` with `mode="wait"`, using direction as custom variant data. The outgoing slide fades and travels approximately 40px opposite the navigation direction; the incoming slide begins approximately 40px along the navigation direction. Under reduced motion, use zero-duration opacity-only replacement and remove all nested delays, travel, rotation, and spring behaviour.

- [ ] **Step 8: Verify GREEN with the temporary fixture**

Run the temporary interaction spec on desktop and mobile. Confirm autoplay advances after eight seconds only while active, hover/focus pauses it, manual controls disable it, play restarts it, reduced motion does not autoplay, swipe works without blocking vertical page scroll, and every selected proof ends fully visible.

- [ ] **Step 9: Remove all temporary fixture code and rerun permanent tests**

Delete the temporary project fixture and temporary Playwright spec, restore `PortfolioSection` to pass the real `projects` collection, then run:

```bash
npm run test:unit
npx playwright test tests/e2e/conversion.spec.ts tests/e2e/showpiece-motion.spec.ts
```

Expected: all permanent tests pass; controls remain absent with one live project.

- [ ] **Step 10: Commit the carousel interaction**

```bash
git add components/portfolio/portfolio-carousel.tsx components/motion/portfolio-proof-motion.tsx tests/unit/portfolio-carousel-state.test.ts
git commit -m "feat: add accessible portfolio project rotation"
```

---

### Task 5: Full quality and Cloudflare static-export verification

**Files:**

- Modify only if a verified regression requires a targeted fix.

**Interfaces:**

- Verifies the complete feature against repository quality gates and the approved spec.

- [ ] **Step 1: Run static checks and production build**

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Expected: all commands exit zero; Next generates the static `out` directory and the existing Pages Function remains unaffected.

- [ ] **Step 2: Run all automated tests**

```bash
npm run test:unit
npm run test:contact-handler
npm run test:e2e
```

Expected: all unit, handler, accessibility, SEO, motion, conversion, and visual tests pass with only intentional viewport skips.

- [ ] **Step 3: Validate the rendered page using the Browser plugin**

The flow under test is: `/` and `/portfolio` load → Portfolio enters view → the existing single project assembles → no dormant carousel controls or layout regressions appear.

Check at 1440×900 and 412×915:

- Correct URL/title and meaningful DOM.
- No Next.js error overlay.
- No relevant console warnings or errors.
- No horizontal overflow, clipping, or layout shift.
- Double Double Good title, proof images, metrics, quotation, attribution, and live-site link are visible.
- Screenshot evidence matches the approved editorial composition.

- [ ] **Step 4: Review the React implementation**

Confirm the client boundary is limited to the controller/proof, event listeners and timers clean up, functional state transitions are used, inactive images are not priority-loaded, and no new dependency or waterfall was introduced.

- [ ] **Step 5: Close any verified QA regression through its owning task**

If Task 5 exposes a regression, return to the task that owns that behaviour, add or tighten its failing test, make the smallest correction, rerun Task 5 in full, and include the correction in that task's exact file set. If no regression appears, do not create an empty commit.
