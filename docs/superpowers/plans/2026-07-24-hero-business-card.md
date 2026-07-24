# Hero Business Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static homepage hero logo panel with an accessible 3D business card that idly turns, supports drag/tap/keyboard flipping, and recreates the orange contact-details reverse from the supplied recording.

**Architecture:** Add one focused client component that owns the card rotation motion value, visible-side state, idle timer, interaction pause state, and front/back markup. `HeroSection` continues to own only section layout and entry animation, and imports the card in place of its current static image panel.

**Tech Stack:** Next.js 15 App Router static export, React 19, TypeScript, Tailwind CSS 3, Framer Motion 12, Playwright.

## Global Constraints

- Preserve `output: "export"` and the Cloudflare Pages `out` deployment; add no runtime-only Next.js feature.
- Add no new dependency, video, canvas, or WebGL payload.
- Use `contactDetails.email` for the reverse-side email address.
- Disable idle rotation when `prefers-reduced-motion` is enabled.
- Preserve keyboard operation, visible focus, vertical touch scrolling, and responsive rendering.
- Do not alter the navbar logo, contact flow, analytics, or Cloudflare configuration.

---

### Task 1: Lock the card interaction contract with failing browser tests

**Files:**

- Create: `tests/e2e/hero-business-card.spec.ts`

**Interfaces:**

- Consumes: homepage route `/`.
- Produces: an accessibility and DOM contract for a button named `Design Hutch card`, with `data-side="front|back"` and `data-auto-rotate="true|false"`.

- [x] **Step 1: Write the failing keyboard and reduced-motion tests**

```ts
import { expect, test } from "@playwright/test";

test.describe("hero business card", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("flips between its front and back with the keyboard", async ({
    page,
  }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });

    await expect(card).toHaveAttribute("data-side", "front");
    await card.focus();
    await card.press("Enter");
    await expect(card).toHaveAttribute("data-side", "back");
    await expect(card).toHaveAttribute("aria-pressed", "true");

    await card.press("Space");
    await expect(card).toHaveAttribute("data-side", "front");
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("disables idle rotation when reduced motion is requested", async ({
    page,
  }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });

    await expect(card).toHaveAttribute("data-auto-rotate", "false");
    await expect(card).toHaveAttribute("data-side", "front");
  });
});
```

- [x] **Step 2: Run the focused test and verify the red state**

Run:

```bash
npx playwright test tests/e2e/hero-business-card.spec.ts --project=desktop-chromium
```

Expected: both tests fail because no `Design Hutch card` button exists.

- [x] **Step 3: Commit the regression contract with the implementation task, after it reaches green**

Do not commit a knowingly failing default-branch state. Keep this new test uncommitted until Task 2 passes it.

---

### Task 2: Build and integrate the interactive 3D hero card

**Files:**

- Create: `components/motion/hero-business-card.tsx`
- Modify: `components/sections/hero.tsx`
- Test: `tests/e2e/hero-business-card.spec.ts`

**Interfaces:**

- Consumes: `contactDetails.email`, `/brand/design-hutch-logo-full.png`, Framer Motion `animate`, `motion`, and `useMotionValue`.
- Produces: `HeroBusinessCard(): JSX.Element`, exposed as the `Design Hutch card` button contract from Task 1.

- [x] **Step 1: Create the isolated card component**

Implement `components/motion/hero-business-card.tsx` with:

```tsx
"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { contactDetails } from "@/content/site";

const TURN_DURATION_SECONDS = 1.05;
const IDLE_TURN_DELAY_MS = 4_000;

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function isBackRotation(rotation: number) {
  const halfTurns = Math.round(rotation / 180);
  return Math.abs(halfTurns % 2) === 1;
}

function HutOutline() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="h-full w-full">
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 74H78" strokeWidth="5" />
        <path d="M24 42L48 26L72 42" strokeWidth="5.5" />
        <path d="M29 43V73M67 43V73" strokeWidth="5.5" />
        <path d="M40 72V46H48V57H58V46H67" strokeWidth="5.5" />
        <path d="M67 73V57" strokeWidth="5.5" />
        <path d="M71 73C71 62 76 55 81 49C82 58 78 66 71 73Z" strokeWidth="4" />
        <path d="M72 73C78 70 84 68 88 62" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function HeroBusinessCard() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rotationY = useMotionValue(0);
  const dragStartRotation = useRef(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const animationSource = useRef<"idle" | "interaction" | null>(null);
  const didPan = useRef(false);
  const [side, setSide] = useState<"front" | "back">("front");
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const isPaused = isHovered || isFocused || isPanning;

  const settle = useCallback(
    (target: number, source: "idle" | "interaction" = "interaction") => {
      const nextSide = isBackRotation(target) ? "back" : "front";
      setSide(nextSide);
      animationRef.current?.stop();

      if (prefersReducedMotion) {
        animationSource.current = null;
        rotationY.set(nextSide === "back" ? 180 : 0);
        return;
      }

      animationSource.current = source;
      animationRef.current = animate(rotationY, target, {
        duration: TURN_DURATION_SECONDS,
        ease: [0.22, 1, 0.36, 1],
      });
    },
    [prefersReducedMotion, rotationY],
  );

  const flip = useCallback(
    (source: "idle" | "interaction" = "interaction") => {
      const nearestHalfTurn = Math.round(rotationY.get() / 180) * 180;
      settle(nearestHalfTurn + 180, source);
    },
    [rotationY, settle],
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const timer = window.setTimeout(() => flip("idle"), IDLE_TURN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [flip, isPaused, prefersReducedMotion, side]);

  useEffect(() => {
    if (animationSource.current !== "idle") return;
    if (isPaused) {
      animationRef.current?.pause();
      return;
    }
    animationRef.current?.play();
  }, [isPaused]);

  return (
    <div className="relative [perspective:1200px]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-accent-blue/10 blur-3xl" />
      <motion.button
        type="button"
        aria-label={`Design Hutch card, showing ${side}`}
        aria-describedby="hero-card-instructions"
        aria-pressed={side === "back"}
        data-side={side}
        data-auto-rotate={!prefersReducedMotion}
        className="cta-focus relative block aspect-[25/14] w-full touch-pan-y select-none rounded-[1.35rem] text-left [transform-style:preserve-3d]"
        style={{ rotateY: rotationY }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onTapStart={() => {
          didPan.current = false;
        }}
        onTap={() => {
          if (didPan.current) {
            didPan.current = false;
            return;
          }
          flip();
        }}
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault();
            flip();
          }
        }}
        onPanStart={() => {
          setIsPanning(true);
          animationRef.current?.stop();
          dragStartRotation.current = rotationY.get();
        }}
        onPan={(_, info) => {
          didPan.current = Math.abs(info.offset.x) > 5;
          rotationY.set(dragStartRotation.current + info.offset.x * 0.45);
        }}
        onPanEnd={() => {
          settle(Math.round(rotationY.get() / 180) * 180);
          setIsPanning(false);
        }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/10 bg-accent-blue shadow-[0_34px_110px_-60px_rgba(59,130,246,0.95)] [backface-visibility:hidden]">
          <Image
            src="/brand/design-hutch-logo-full.png"
            alt=""
            fill
            priority
            draggable={false}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
        </span>

        <span className="absolute inset-0 overflow-hidden rounded-[1.35rem] border border-white/15 bg-[linear-gradient(135deg,#ff8a1f_0%,#f97316_48%,#df5a0b_100%)] p-[clamp(1.1rem,4vw,2rem)] text-white shadow-[0_34px_110px_-60px_rgba(249,115,22,0.9)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.18),transparent_36%),linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.08)_48%,transparent_72%)]" />
          <span className="relative flex h-full flex-col">
            <span className="font-heading text-[clamp(1.25rem,4.5vw,2.2rem)] font-medium tracking-[-0.025em]">
              Ben Hutchinson
            </span>
            <span className="mt-2 text-[clamp(0.9rem,3vw,1.55rem)] font-medium text-orange-50/95">
              Founder &amp; Developer
            </span>
            <span className="mt-auto max-w-[78%] text-[clamp(0.78rem,3vw,1.35rem)] font-medium tracking-[-0.02em] text-white">
              {contactDetails.email}
            </span>
            <span className="absolute bottom-0 right-0 h-[clamp(2.5rem,9vw,4.5rem)] w-[clamp(2.5rem,9vw,4.5rem)] text-white/95">
              <HutOutline />
            </span>
          </span>
        </span>
      </motion.button>
      <p id="hero-card-instructions" className="sr-only">
        Drag, tap, or press Enter or Space to turn the card.
      </p>
    </div>
  );
}
```

- [x] **Step 2: Replace the static panel in `HeroSection`**

Remove the direct `Image` import and static logo wrapper from `components/sections/hero.tsx`, import `HeroBusinessCard`, and retain the existing entry `motion.div` around it:

```tsx
import { HeroBusinessCard } from "@/components/motion/hero-business-card";

// Inside the existing left-hand entry motion wrapper:
<HeroBusinessCard />;
```

- [x] **Step 3: Run the focused interaction test and verify green**

Run:

```bash
npx playwright test tests/e2e/hero-business-card.spec.ts --project=desktop-chromium
```

Expected: 2 passed.

- [x] **Step 4: Run the interaction test on mobile**

Run:

```bash
npx playwright test tests/e2e/hero-business-card.spec.ts --project=mobile-chromium
```

Expected: 2 passed with the mobile viewport and touch-capable project.

- [x] **Step 5: Commit the behavior and component**

```bash
git add tests/e2e/hero-business-card.spec.ts components/motion/hero-business-card.tsx components/sections/hero.tsx
git commit -m "feat: add interactive hero business card"
```

---

### Task 3: Verify visual fidelity, accessibility, and static deployment

**Files:**

- Modify only if intentionally changed: `tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png`
- Modify only if intentionally changed: `tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png`

**Interfaces:**

- Consumes: the integrated homepage card from Task 2.
- Produces: build, test, accessibility, desktop/mobile screenshot, and browser-console evidence for completion.

- [x] **Step 1: Run static checks and production export**

Run:

```bash
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0; the build emits the static homepage into `out`.

- [ ] **Step 2: Run focused accessibility and visual regression tests**

Run:

```bash
npm run test:e2e:a11y
npm run test:e2e:visual
```

Expected: accessibility passes. The two homepage snapshots may fail only because the approved hero card changes pixels; inspect the diffs before accepting them.

Execution note: accessibility passed, as did both homepage snapshots. The unrelated mobile contact-section baseline remains one pixel shorter than the current staged contact implementation.

- [x] **Step 3: Update only intentional homepage snapshots**

After confirming the diffs are limited to the hero card, run:

```bash
npm run test:e2e:visual:update
npm run test:e2e:visual
```

Expected: updated desktop/mobile homepage baselines and a clean visual test rerun. Contact-section snapshots remain unchanged.

Execution note: no homepage snapshot update was necessary, so the existing baselines were preserved.

- [x] **Step 4: Perform rendered browser QA**

The flow under test is: `/` loads → the hero business card renders front-side → tap/keyboard or horizontal drag reveals the orange back → the card returns to the front without console errors.

Use the in-app Browser at 1440×900 and a mobile-sized viewport. Verify page URL/title, non-empty DOM, no framework overlay, no relevant console warnings/errors, front/back DOM state, visible orange reverse, keyboard focus, and screenshots of front, back, and mobile states.

- [ ] **Step 5: Run final full verification**

Run:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Expected: all commands exit 0 and all configured desktop/mobile tests pass.

- [ ] **Step 6: Commit intentional snapshot updates separately**

```bash
git add tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png docs/superpowers/plans/2026-07-24-hero-business-card.md
git commit -m "test: verify hero business card presentation"
```
