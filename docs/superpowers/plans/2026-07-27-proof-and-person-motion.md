# Proof + Person Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one-time Portfolio proof assembly and About founder reveal sequences that strengthen project proof and founder trust without making the rest of the editorial site feel over-animated.

**Architecture:** Keep `PortfolioSection` and `AboutSection` as server components and move only their animated inner compositions into focused client wrappers. A small shared hook resolves hydration and reduced-motion state consistently; each wrapper owns its own in-view trigger, variants, and timing. Existing content, semantic order, image optimization, tracking links, static export, and layout remain intact.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, `motion/react` 12.42.2, Playwright, Cloudflare Pages static export

## Global Constraints

- Motion clarifies hierarchy or directs attention; it does not decorate every element.
- Portfolio and About each run once when approximately 25–30% of their composition enters view.
- Reduced-motion visitors receive the complete final composition immediately.
- Server output shows the final visual state so delayed or failed hydration does not hide content.
- Animate only transforms, opacity, clip progress, and SVG path length; do not animate layout properties.
- Do not add dependencies, image assets, parallax, autoplay loops, scroll-linked progress, counters, page transitions, or headline animation.
- Preserve all current copy, colours, typography, links, testimonial semantics, section order, Calendly, and form behaviour.
- Preserve responsive section height and prevent horizontal overflow.
- Preserve the static Next.js export used by Cloudflare Pages.

---

## File Structure

- Create `components/motion/use-resolved-motion.ts`: shared hydration and reduced-motion preference hook used by both showpieces.
- Create `components/motion/portfolio-proof-motion.tsx`: client wrapper for the Portfolio article grid, proof stack, metrics, and testimonial sequence.
- Modify `components/sections/portfolio.tsx`: retain the section header and server-rendered content, passing the existing proof content into `PortfolioProofMotion` slots.
- Create `components/motion/founder-reveal-motion.tsx`: client wrapper for the About grid, portrait wipe, commitment arrows, and annotation.
- Modify `components/sections/about.tsx`: retain the section shell and pass existing About content into `FounderRevealMotion` slots.
- Create `tests/e2e/showpiece-motion.spec.ts`: focused one-time reveal, real rendered-style, reduced-motion, semantics, and overflow regressions.
- Modify `tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png`: approved full-page desktop baseline.
- Modify `tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png`: approved full-page mobile baseline.

---

### Task 1: Portfolio Proof Assembly

**Files:**

- Create: `components/motion/use-resolved-motion.ts`
- Create: `components/motion/portfolio-proof-motion.tsx`
- Modify: `components/sections/portfolio.tsx`
- Create: `tests/e2e/showpiece-motion.spec.ts`

**Interfaces:**

- Produces: `useResolvedMotion(): { hydrated: boolean; reduced: boolean }`
- Produces: `PortfolioProofMotion(props: PortfolioProofMotionProps): JSX.Element`
- `PortfolioProofMotionProps` contains `details`, `metrics`, `testimonial`, `cta`, `desktopImage`, and `mobileImage` React nodes.
- Later tasks consume `useResolvedMotion` without changing its signature.

- [ ] **Step 1: Write the failing Portfolio motion tests**

Create `tests/e2e/showpiece-motion.spec.ts` with real browser assertions. The production mutation these tests catch is removing the in-view transition, replaying it after a second scroll, or leaving reduced-motion visitors in a hidden state.

```ts
import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("selective showpiece motion", () => {
  test("portfolio proof assembles once when it enters view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const root = page.getByTestId("portfolio-proof-motion");
    const desktopProof = page.getByTestId("portfolio-desktop-proof");
    const mobileProof = page.getByTestId("portfolio-mobile-proof");

    await expect(root).toHaveAttribute("data-motion-state", "hidden");
    await expect(desktopProof).toHaveCSS("opacity", "0");
    await expect(mobileProof).toHaveCSS("opacity", "0");

    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(desktopProof).toHaveCSS("opacity", "1");
    await expect(mobileProof).toHaveCSS("opacity", "1");
    await expect(page.getByTestId("portfolio-metric")).toHaveCount(3);
    await expect(page.getByTestId("portfolio-testimonial")).toHaveCSS(
      "opacity",
      "1",
    );

    await page.locator("#hero").scrollIntoViewIfNeeded();
    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
  });

  test("portfolio proof is complete for reduced-motion visitors", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");

    const root = page.getByTestId("portfolio-proof-motion");
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(page.getByTestId("portfolio-desktop-proof")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.getByTestId("portfolio-mobile-proof")).toHaveCSS(
      "opacity",
      "1",
    );
  });
});
```

- [ ] **Step 2: Run the Portfolio tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/showpiece-motion.spec.ts --project=desktop-chromium --grep "portfolio proof"
```

Expected: FAIL because `portfolio-proof-motion`, `portfolio-desktop-proof`, and `portfolio-mobile-proof` do not exist.

- [ ] **Step 3: Add the shared hydration and reduced-motion hook**

Create `components/motion/use-resolved-motion.ts`. Use both Motion's preference hook and the native media query because the existing Process implementation established that hydration can otherwise report the preference late.

```ts
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function useResolvedMotion() {
  const motionReduced = useReducedMotion();
  const [browserReduced, setBrowserReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setBrowserReduced(mediaQuery.matches);

    setHydrated(true);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return {
    hydrated,
    reduced: Boolean(motionReduced || browserReduced),
  };
}
```

- [ ] **Step 4: Implement the focused Portfolio client wrapper**

Create `components/motion/portfolio-proof-motion.tsx` with this public interface and state model:

```tsx
"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import { useResolvedMotion } from "@/components/motion/use-resolved-motion";

type PortfolioProofMotionProps = {
  details: ReactNode;
  metrics: ReactNode[];
  testimonial: ReactNode;
  cta: ReactNode;
  desktopImage: ReactNode;
  mobileImage: ReactNode;
};

export function PortfolioProofMotion({
  details,
  metrics,
  testimonial,
  cta,
  desktopImage,
  mobileImage,
}: PortfolioProofMotionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.3 });
  const { hydrated, reduced } = useResolvedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateCompact = () => setCompact(mediaQuery.matches);
    updateCompact();
    mediaQuery.addEventListener("change", updateCompact);
    return () => mediaQuery.removeEventListener("change", updateCompact);
  }, []);

  const revealed = !hydrated || reduced || inView;
  const instant = !hydrated || reduced;
  const state = revealed ? "visible" : "hidden";

  return (
    <article
      ref={rootRef}
      data-testid="portfolio-proof-motion"
      data-motion-state={state}
      className="grid gap-12 lg:grid-cols-[.35fr_.65fr] lg:gap-14"
    >
      <div>
        {details}
        <dl className="mt-10 border-t border-[#181a17]/55">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              data-testid="portfolio-metric"
              initial={false}
              animate={
                revealed
                  ? { opacity: 1, scaleX: 1 }
                  : { opacity: 0, scaleX: 0.88 }
              }
              transition={{
                duration: instant ? 0 : 0.28,
                delay: instant ? 0 : 0.66 + index * 0.09,
                ease: "easeOut",
              }}
              className="origin-left border-b border-[#181a17]/55"
            >
              {metric}
            </motion.div>
          ))}
        </dl>
        <motion.figure
          data-testid="portfolio-testimonial"
          initial={false}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: instant ? 0 : 0.3,
            delay: instant ? 0 : 1.12,
            ease: "easeOut",
          }}
          className="mt-12 grid grid-cols-[3.2rem_1fr] gap-x-4 gap-y-2"
        >
          {testimonial}
        </motion.figure>
        {cta}
      </div>

      <div>
        <motion.div
          data-testid="portfolio-desktop-proof"
          initial={false}
          animate={
            revealed
              ? { opacity: 1, y: 0, rotate: 0 }
              : { opacity: 0, y: 32, rotate: -1.5 }
          }
          transition={{
            duration: instant ? 0 : 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative border border-[#181a17] bg-[#f8f5ed] p-3 shadow-[0_28px_55px_-35px_rgba(24,26,23,.55)] sm:p-5"
        >
          <div className="relative aspect-[16/11] overflow-hidden bg-white">
            {desktopImage}
          </div>
          <motion.div
            data-testid="portfolio-mobile-proof"
            initial={false}
            animate={
              revealed
                ? { opacity: 1, x: 0, rotate: 0 }
                : {
                    opacity: 0,
                    x: compact ? 24 : 44,
                    rotate: 1,
                  }
            }
            transition={
              instant
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 190,
                    damping: 24,
                    delay: 0.2,
                  }
            }
            className="absolute -bottom-8 -right-2 w-[31%] rounded-[1.2rem] border-[5px] border-[#222] bg-white p-1 shadow-xl sm:-right-5 sm:w-[25%]"
          >
            <div className="relative aspect-[9/17] overflow-hidden rounded-[.75rem] bg-white">
              {mobileImage}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </article>
  );
}
```

Keep the metric row grid and typography classes on each `metrics` node supplied by the server component. Do not add `overflow-hidden` to the article or proof column because the phone overlap and shadow must remain visible.

- [ ] **Step 5: Wire the existing Portfolio content into the wrapper**

Modify `components/sections/portfolio.tsx`:

1. Import `PortfolioProofMotion`.
2. Replace the current `<article>` with `<PortfolioProofMotion>`.
3. Pass the existing title, category, blue rule, and summary as `details`.
4. Pass exactly three metric row nodes as `metrics`; retain their current grid widths, text, and borders inside the new motion row wrappers.
5. Pass the existing quote mark, blockquote, and figcaption children as `testimonial`, without changing their colour or spacing.
6. Pass the existing tracked live-site link inside its current `mt-9` container as `cta`.
7. Pass the existing desktop and mobile `<Image>` elements as `desktopImage` and `mobileImage`, preserving `alt`, `priority`, `sizes`, and object-position props.

Use this call shape:

```tsx
<PortfolioProofMotion
  details={portfolioDetails}
  metrics={portfolioMetrics}
  testimonial={portfolioTestimonial}
  cta={portfolioCta}
  desktopImage={desktopProofImage}
  mobileImage={mobileProofImage}
/>
```

Define those six React nodes immediately before the return in `PortfolioSection`, after the existing `project` guard. Keep all visible strings identical to the current component.

- [ ] **Step 6: Run the Portfolio tests and existing Portfolio regressions**

Run:

```bash
npx playwright test tests/e2e/showpiece-motion.spec.ts tests/e2e/editorial-fidelity.spec.ts --project=desktop-chromium --grep "portfolio"
```

Expected: PASS. Confirm that the proof moves from opacity `0` to `1`, remains visible after scrolling away and back, and is immediately complete with reduced motion.

- [ ] **Step 7: Review React and static-rendering boundaries**

Run:

```bash
npm run typecheck
npm run lint
```

Expected: both commands exit `0`. Inspect the rendered component boundary to confirm `PortfolioSection` remains a server component and only the inner proof wrapper includes `"use client"`.

- [ ] **Step 8: Commit the Portfolio showpiece**

```bash
git add components/motion/use-resolved-motion.ts components/motion/portfolio-proof-motion.tsx components/sections/portfolio.tsx tests/e2e/showpiece-motion.spec.ts
git commit -m "feat: animate the portfolio proof assembly"
```

---

### Task 2: Founder Photograph and Commitment Reveal

**Files:**

- Create: `components/motion/founder-reveal-motion.tsx`
- Modify: `components/sections/about.tsx`
- Modify: `tests/e2e/showpiece-motion.spec.ts`

**Interfaces:**

- Consumes: `useResolvedMotion(): { hydrated: boolean; reduced: boolean }` from Task 1.
- Produces: `FounderRevealMotion(props: FounderRevealMotionProps): JSX.Element`.
- `FounderRevealMotionProps` contains `intro`, `stats`, `commitments`, `cta`, `additionalCopy`, and `portrait`.

- [ ] **Step 1: Add failing founder reveal tests**

Append these tests inside the existing `selective showpiece motion` describe block. The production mutation they catch is removing the photographic wipe, failing to reveal arrows, replaying on a second visit, or hiding the final composition in reduced-motion mode.

```ts
test("founder portrait develops and commitment arrows draw once", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepareDeterministicPage(page);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const root = page.getByTestId("founder-reveal-motion");
  const portrait = page.getByTestId("founder-portrait-motion");
  const arrows = page.getByTestId("about-commitment-arrow");

  await expect(root).toHaveAttribute("data-motion-state", "hidden");
  await expect(portrait).toHaveCSS("opacity", "0");
  await expect(arrows).toHaveCount(3);
  await expect(arrows.first()).toHaveCSS("opacity", "0");

  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-state", "visible");
  await expect(portrait).toHaveCSS("opacity", "1");
  await expect(arrows.first()).toHaveCSS("opacity", "1");
  await expect(arrows.last()).toHaveCSS("opacity", "1");
  await expect(page.getByTestId("founder-annotation-motion")).toHaveCSS(
    "opacity",
    "1",
  );

  await page.locator("#hero").scrollIntoViewIfNeeded();
  await root.scrollIntoViewIfNeeded();
  await expect(root).toHaveAttribute("data-motion-state", "visible");
});

test("founder composition is complete for reduced-motion visitors", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await prepareDeterministicPage(page);
  await page.goto("/");

  await expect(page.getByTestId("founder-reveal-motion")).toHaveAttribute(
    "data-motion-state",
    "visible",
  );
  await expect(page.getByTestId("founder-portrait-motion")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.getByTestId("about-commitment-arrow").first()).toHaveCSS(
    "opacity",
    "1",
  );
});
```

- [ ] **Step 2: Run the founder tests and verify RED**

Run:

```bash
npx playwright test tests/e2e/showpiece-motion.spec.ts --project=desktop-chromium --grep "founder"
```

Expected: FAIL because `founder-reveal-motion`, `founder-portrait-motion`, and `founder-annotation-motion` do not exist.

- [ ] **Step 3: Implement the Founder client wrapper**

Create `components/motion/founder-reveal-motion.tsx`:

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "motion/react";

import { useResolvedMotion } from "@/components/motion/use-resolved-motion";

type FounderRevealMotionProps = {
  intro: ReactNode;
  stats: ReactNode;
  commitments: readonly string[];
  cta: ReactNode;
  additionalCopy: ReactNode;
  portrait: ReactNode;
};

function DrawnCommitmentArrow({
  revealed,
  instant,
  index,
}: {
  revealed: boolean;
  instant: boolean;
  index: number;
}) {
  return (
    <motion.span
      data-testid="about-commitment-arrow"
      aria-hidden
      initial={false}
      animate={revealed ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: instant ? 0 : 0.2,
        delay: instant ? 0 : 0.76 + index * 0.12,
      }}
      className="inline-flex text-accent-orange"
    >
      <svg
        viewBox="0 0 28 16"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.4"
      >
        <motion.path
          d="M1 8h24M19 2l6 6-6 6"
          initial={false}
          animate={revealed ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{
            duration: instant ? 0 : 0.34,
            delay: instant ? 0 : 0.72 + index * 0.12,
            ease: "easeOut",
          }}
        />
      </svg>
    </motion.span>
  );
}

export function FounderRevealMotion({
  intro,
  stats,
  commitments,
  cta,
  additionalCopy,
  portrait,
}: FounderRevealMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.27 });
  const { hydrated, reduced } = useResolvedMotion();
  const revealed = !hydrated || reduced || inView;
  const instant = !hydrated || reduced;

  return (
    <div
      ref={rootRef}
      data-testid="founder-reveal-motion"
      data-motion-state={revealed ? "visible" : "hidden"}
      className="grid md:min-h-[58rem] md:grid-cols-[.46fr_.54fr] md:items-stretch"
    >
      <div className="relative z-10 px-[var(--space-container-x)] py-14 md:py-16">
        {intro}
        {stats}
        <p className="mt-6 text-[.62rem] font-bold uppercase tracking-[.16em] text-[#9fb1ff]">
          What you can expect
        </p>
        <ul className="mt-3 space-y-2">
          {commitments.map((item, index) => (
            <li key={item} className="flex items-center gap-4 text-sm">
              <DrawnCommitmentArrow
                revealed={revealed}
                instant={instant}
                index={index}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {cta}
        {additionalCopy}
      </div>

      <motion.figure
        data-testid="founder-portrait-motion"
        initial={false}
        animate={
          revealed
            ? { opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }
            : {
                opacity: 0,
                scale: 0.985,
                clipPath: "inset(0% 0% 100% 0%)",
              }
        }
        transition={{
          duration: instant ? 0 : 0.82,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative min-h-[38rem] md:min-h-[58rem]"
      >
        {portrait}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#151714_0%,transparent_20%)]"
        />
        <motion.p
          data-testid="founder-annotation-motion"
          initial={false}
          animate={
            revealed ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 8, y: 6 }
          }
          transition={{
            duration: instant ? 0 : 0.3,
            delay: instant ? 0 : 1.32,
            ease: "easeOut",
          }}
          className="absolute right-10 top-1/2 rotate-[-5deg] font-heading text-2xl italic text-accent-orange"
        >
          One person
          <br />
          all the way ←
        </motion.p>
      </motion.figure>
    </div>
  );
}
```

The photograph uses a composited clip-path and transform only. The text content remains outside the clip and stays readable. The three arrow paths retain their current visual shape.

- [ ] **Step 4: Wire the existing About content into the wrapper**

Modify `components/sections/about.tsx`:

1. Import `FounderRevealMotion` and remove the now-unused `ArrowIcon` import for commitments; retain `ArrowIcon` for the CTA.
2. Keep `SectionShell`, its `id`, background, overflow, padding, and `withTransition={false}` unchanged.
3. Replace only the current inner grid with `FounderRevealMotion`.
4. Pass the existing section number, heading, founder name, role, and direct-working paragraph as `intro`.
5. Pass the existing three-column `<dl>` unchanged as `stats`.
6. Pass `founderCommitments.slice(0, 3)` as `commitments`.
7. Pass the existing tracked CTA with its exact copy and analytics metadata as `cta`.
8. Pass the existing screen-reader-only remaining commitments as `additionalCopy`.
9. Pass the existing optimized founder `<Image>` as `portrait`, preserving `alt`, `fill`, priority, sizes, object fit, and object position.

Use this call shape inside the existing `container-shell`:

```tsx
<FounderRevealMotion
  intro={founderIntro}
  stats={founderStats}
  commitments={founderCommitments.slice(0, 3)}
  cta={founderCta}
  additionalCopy={founderAdditionalCopy}
  portrait={founderPortrait}
/>
```

Define those five React nodes immediately before the return in `AboutSection`. Keep all visible copy and all existing classes on those nodes unchanged.

- [ ] **Step 5: Run the founder tests and About regressions**

Run:

```bash
npx playwright test tests/e2e/showpiece-motion.spec.ts tests/e2e/editorial-fidelity.spec.ts tests/e2e/conversion.spec.ts --project=desktop-chromium --grep "founder|about route|commitment"
```

Expected: PASS. Confirm the portrait and three arrows remain in the DOM, reach opacity `1`, remain visible after scrolling away and back, and skip all delays in reduced-motion mode.

- [ ] **Step 6: Run desktop and mobile overflow checks**

Add this test to `tests/e2e/showpiece-motion.spec.ts`:

```ts
test("showpiece motion does not change responsive page geometry", async ({
  page,
}) => {
  await prepareDeterministicPage(page);
  await page.goto("/");

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
  await expect(page.getByTestId("portfolio-proof-motion")).toBeAttached();
  await expect(page.getByTestId("founder-reveal-motion")).toBeAttached();
});
```

After the main describe block, add a JavaScript-disabled fallback check so the server-output requirement is exercised directly:

```ts
test.describe("static showpiece fallback", () => {
  test.use({ javaScriptEnabled: false });

  test("proof and founder content stay visible without hydration", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByAltText(
        "Double Double Good website desktop homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByAltText(
        "Double Double Good website mobile homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByAltText("Ben Hutchinson, founder of The Design Hutch"),
    ).toBeVisible();
    await expect(
      page.getByText("It felt like my website", { exact: false }),
    ).toBeVisible();
  });
});
```

Run:

```bash
npx playwright test tests/e2e/showpiece-motion.spec.ts
```

Expected: PASS in both `desktop-chromium` and `mobile-chromium` projects, including the JavaScript-disabled fallback.

- [ ] **Step 7: Review the React client boundaries**

Run:

```bash
npm run lint
npm run typecheck
```

Expected: both commands exit `0`. Confirm there are no new global listeners without cleanup, no layout-property animations, no new dependency, and no conversion of `AboutSection` itself into a client component.

- [ ] **Step 8: Commit the founder showpiece**

```bash
git add components/motion/founder-reveal-motion.tsx components/sections/about.tsx tests/e2e/showpiece-motion.spec.ts
git commit -m "feat: animate the founder trust reveal"
```

---

### Task 3: Visual Calibration, Browser QA, and Static Export

**Files:**

- Modify: `components/motion/portfolio-proof-motion.tsx` only if browser calibration exposes excessive travel, clipping, or spring overshoot.
- Modify: `components/motion/founder-reveal-motion.tsx` only if browser calibration exposes wipe, arrow, or annotation timing problems.
- Modify: `tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png`

**Interfaces:**

- Consumes both completed showpiece components.
- Produces reviewed desktop and mobile baselines and a fully verified static-export branch.

- [ ] **Step 1: Start the local site and inspect the Portfolio sequence with the in-app Browser**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Use the Browser plugin at `http://127.0.0.1:4173/` with a desktop viewport near `1440×900`:

1. Confirm the page title and H1 identify The Design Hutch homepage.
2. Confirm the DOM snapshot contains meaningful content and no framework error overlay.
3. Scroll from Hero into Portfolio without jumping directly to the final state.
4. Confirm desktop proof, phone proof, metrics, and testimonial reveal in that order.
5. Scroll away and back; confirm the composition does not replay.
6. Confirm the live-site link still opens the same destination.
7. Confirm console logs contain no relevant errors or warnings.
8. Capture a viewport screenshot after the proof settles to `/private/tmp/design-hutch-proof-person-portfolio-desktop.png`.

- [ ] **Step 2: Inspect the About sequence with the in-app Browser**

Continue in the same browser tab:

1. Scroll naturally from FAQ into About.
2. Confirm the photograph develops top-to-bottom without changing section height.
3. Confirm the orange arrows draw top-to-bottom while their text stays stationary.
4. Confirm “One person all the way” arrives last.
5. Scroll away and back; confirm the sequence remains complete.
6. Confirm the About CTA still navigates to `/contact`.
7. Capture a viewport screenshot after the reveal settles to `/private/tmp/design-hutch-proof-person-about-desktop.png`.

- [ ] **Step 3: Repeat the visual checks at mobile size**

Set the Browser viewport to approximately `412×915` and repeat both sequences:

- Portfolio travel is shorter than desktop and neither proof clips horizontally.
- Founder text is readable before the portrait itself approaches the viewport.
- The portrait wipe and arrow sequence do not create a scroll trap or layout shift.
- The mobile sticky CTA remains usable and does not cover essential copy.
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

Save settled screenshots to:

- `/private/tmp/design-hutch-proof-person-portfolio-mobile.png`
- `/private/tmp/design-hutch-proof-person-about-mobile.png`

Reset the temporary viewport override before finalizing the review tab.

- [ ] **Step 4: Calibrate only values that fail the approved motion direction**

If the browser review finds a mismatch, change only these bounded values:

- Portfolio desktop `y`: 28–36px.
- Portfolio desktop starting rotation: `-1deg` to `-1.5deg`.
- Portfolio phone `x`: 20–28px mobile; 36–48px desktop.
- Portfolio spring damping: 22–28, with no conspicuous overshoot.
- Portrait duration: 700–850ms.
- Arrow stagger: 90–140ms.
- Annotation reveal: final 250–350ms.

After each calibration, reload the browser tab and repeat the affected interaction before continuing.

- [ ] **Step 5: Regenerate and visually inspect the approved baselines**

Stop the manually started development server so Playwright can own port 4173, then run:

```bash
npm run test:e2e:visual:update
```

Expected: 4 visual tests pass and only the two homepage full-page snapshots change. Open both changed PNG files and verify the resting composition, section geometry, numbering, FAQ/About boundary, footer, and contact section remain correct.

- [ ] **Step 6: Run changed-file formatting and diff checks**

Run:

```bash
npx prettier --check components/motion/use-resolved-motion.ts components/motion/portfolio-proof-motion.tsx components/motion/founder-reveal-motion.tsx components/sections/portfolio.tsx components/sections/about.tsx tests/e2e/showpiece-motion.spec.ts
git diff --check
```

Expected: both commands exit `0`.

- [ ] **Step 7: Run the full verification gate**

Run sequentially so Next.js does not rewrite `.next/types` while TypeScript reads it:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Expected:

- ESLint exits `0`.
- TypeScript exits `0`.
- Next.js compiles and statically exports all existing routes, including `/`, `/portfolio`, and `/about`.
- The complete Playwright suite has zero failures across desktop and mobile.
- Accessibility, SEO, interaction, reduced-motion, and visual tests remain green.

- [ ] **Step 8: Commit reviewed baselines and final calibration**

```bash
git add components/motion/portfolio-proof-motion.tsx components/motion/founder-reveal-motion.tsx tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png
git commit -m "test: verify proof and person motion"
```

If neither motion component changed during calibration, omit those component paths from `git add`.

- [ ] **Step 9: Restore the local review preview**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Open `http://127.0.0.1:4173/` in the in-app Browser, confirm the homepage loads without console errors or horizontal overflow, and leave the tab at the first showpiece the user should review.
