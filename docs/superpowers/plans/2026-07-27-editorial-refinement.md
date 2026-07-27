# Editorial Workshop Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the editorial workshop homepage review issues and replace the static process cards with a compact, one-time, hand-drawn landscape timeline that builds trust without lengthening the page.

**Architecture:** Keep static section composition in the existing Next.js section components, isolate stateful service disclosure and timeline animation in focused client components, and retain canonical copy in `content/`. Use Motion for React—the current package name for Framer Motion—for viewport-triggered SVG path drawing and reduced-motion handling while preserving the static Cloudflare Pages export.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 3, Motion for React 12+, Playwright, Cloudflare Pages static export.

## Global Constraints

- Preserve `output: "export"` and the Cloudflare Pages `out` deployment.
- Preserve the working contact form, Cloudflare Turnstile handling, and Calendly booking link.
- Homepage order after the hero must be Services, Portfolio, Process, FAQ, About, Contact.
- Section numbers must be Services `01`, Portfolio `02`, Process `03`, About `04`, Contact `05`.
- The process sequence runs once when it enters view, completes in approximately 3–4 seconds, and remains static.
- Reduced-motion users see the completed timeline immediately.
- Desktop uses one four-stage landscape row; small screens use a compact two-by-two layout with no horizontal page overflow.
- Start each behavioural change with a failing Playwright assertion and do not make animation tests depend on exact frame timing.

---

## File Map

- `app/(marketing)/page.tsx`: canonical homepage section and funnel-tracking order.
- `components/motion/hero-business-card.tsx`: existing card interaction plus visible flip cue.
- `components/sections/services.tsx`: single-open accessible service disclosure interaction.
- `components/sections/portfolio.tsx`: numbering, quote treatment, and redundant-link/rail cleanup.
- `components/sections/process.tsx`: server-rendered process heading and timeline composition boundary.
- `components/motion/process-timeline.tsx`: one-time viewport sequence and responsive four-stage timeline.
- `components/motion/process-illustrations.tsx`: focused decorative SVG drawings for each process stage.
- `content/process.ts`: practical stage descriptions, outcomes, and handwritten annotations.
- `components/sections/faq.tsx`: all canonical FAQs with no index-based wording overrides.
- `components/sections/about.tsx`: three orange commitment arrows.
- `components/sections/contact.tsx`: non-guaranteed personal reply copy in both prompt and success state.
- `components/layout/footer.tsx`: header-consistent brand lockup.
- `package.json`, `package-lock.json`: current Motion for React dependency.
- `tests/e2e/editorial-fidelity.spec.ts`: hierarchy, detail, timeline, and responsive acceptance coverage.
- `tests/e2e/conversion.spec.ts`: updated section order, services interaction expectations, and contact success copy.
- `tests/e2e/hero-business-card.spec.ts`: visible interaction cue.
- `tests/e2e/visual.spec.ts-snapshots/*.png`: reviewed desktop/mobile homepage and contact-section visual baselines.

---

### Task 1: Correct homepage hierarchy and editorial details

**Files:**
- Modify: `tests/e2e/editorial-fidelity.spec.ts`
- Modify: `tests/e2e/conversion.spec.ts`
- Modify: `tests/e2e/hero-business-card.spec.ts`
- Modify: `app/(marketing)/page.tsx`
- Modify: `components/motion/hero-business-card.tsx`
- Modify: `components/sections/portfolio.tsx`
- Modify: `components/sections/faq.tsx`
- Modify: `components/sections/about.tsx`
- Modify: `components/sections/contact.tsx`
- Modify: `components/layout/footer.tsx`

**Interfaces:**
- Consumes: existing `BrandLockup`, `ArrowIcon`, `faqs`, section IDs, and contact submission state.
- Produces: `[data-section-number]`, `[data-portfolio-quote-mark]`, `[data-testid="hero-card-flip-cue"]`, and `[data-testid="about-commitment-arrow"]` hooks used only for stable acceptance checks.

- [ ] **Step 1: Write failing acceptance assertions**

Update the ordered section list in `tests/e2e/conversion.spec.ts`:

```ts
const orderedSections = [
  "hero",
  "services",
  "portfolio",
  "process",
  "faq",
  "about",
  "contact",
];
```

Add this test to `tests/e2e/editorial-fidelity.spec.ts`:

```ts
test("review corrections are present across the editorial homepage", async ({
  page,
}) => {
  await prepareDeterministicPage(page);
  await page.goto("/");

  await expect(page.locator("#services [data-section-number]")).toHaveText("01");
  await expect(page.locator("#portfolio [data-section-number]")).toHaveText("02");

  const portfolio = page.locator("#portfolio");
  await expect(portfolio.locator("[data-portfolio-quote-mark]")).toHaveCount(2);
  await expect(portfolio.locator("[data-portfolio-quote-mark]")).toHaveClass(
    /text-accent-blue/,
  );
  await expect(
    portfolio.getByRole("link", { name: "Read the case study" }),
  ).toHaveCount(0);
  await expect(
    portfolio.getByText("Editorial digital workshop", { exact: true }),
  ).toHaveCount(0);

  const faq = page.locator("#faq");
  await expect(faq.getByRole("button")).toHaveCount(6);
  await expect(
    faq.getByRole("button", { name: "Can you help with hosting and domains?" }),
  ).toBeVisible();
  await expect(
    faq.getByRole("button", { name: "Is this better than a DIY website builder?" }),
  ).toBeVisible();

  await expect(page.getByTestId("about-commitment-arrow")).toHaveCount(3);
  await expect(
    page.getByText("I reply to you personally as soon as I can.", { exact: true }),
  ).toBeVisible();

  const footerWordmark = page.locator("footer").getByText("The Design Hutch", {
    exact: true,
  });
  await expect(footerWordmark).toHaveClass(/font-body/);
  await expect(footerWordmark).toHaveClass(/font-medium/);
});
```

Add this assertion to the shared `beforeEach` page in `tests/e2e/hero-business-card.spec.ts`:

```ts
await expect(page.getByTestId("hero-card-flip-cue")).toContainText("Flip");
```

Replace both old form-success expectations in `tests/e2e/conversion.spec.ts` with:

```ts
await expect(
  page.getByText(
    "Thanks, your enquiry is in. I'll reply personally as soon as I can.",
  ),
).toBeVisible();
```

- [ ] **Step 2: Run the focused tests and verify they fail for the intended reasons**

Run:

```bash
npx playwright test tests/e2e/editorial-fidelity.spec.ts tests/e2e/conversion.spec.ts tests/e2e/hero-business-card.spec.ts --project=desktop-chromium
```

Expected: failures show Portfolio before Services, missing test hooks/cue/arrows, only four FAQs, old reply copy, and old footer typography.

- [ ] **Step 3: Reorder the homepage and correct section details**

In `app/(marketing)/page.tsx`, use the same order for tracking and rendering:

```tsx
<FunnelTracker
  sectionIds={["services", "portfolio", "process", "faq", "about", "contact"]}
/>
<HeroSection />
<ServicesSection headingLevel="h2" />
<PortfolioSection headingLevel="h2" />
<ProcessSection headingLevel="h2" />
<FaqSection headingLevel="h2" />
<AboutSection headingLevel="h2" />
<ContactSection headingLevel="h2" />
```

Apply the exact corrections below:

```tsx
// services.tsx section marker
<p data-section-number className="font-heading text-6xl text-accent-blue">
  01
</p>

// portfolio.tsx section marker
<span
  data-section-number
  className="border-b-2 border-accent-blue pb-1 pr-16 font-heading text-3xl text-accent-blue sm:pr-0 sm:text-7xl"
>
  02
</span>
```

Replace the testimonial figure with two independent blue marks:

```tsx
<figure className="mt-12 grid grid-cols-[3.2rem_1fr] gap-x-4 gap-y-2">
  <span
    data-portfolio-quote-mark
    aria-hidden
    className="font-heading text-6xl leading-none text-accent-blue"
  >
    “
  </span>
  <blockquote className="font-heading text-[2rem] leading-[1.08] sm:text-[2.5rem]">
    It felt like my website
    <br />
    was in good hands
    <span
      data-portfolio-quote-mark
      aria-hidden
      className="ml-1 inline-block align-[-0.08em] text-accent-blue"
    >
      ”
    </span>
  </blockquote>
  <figcaption className="col-start-2 flex items-center gap-4 text-sm font-semibold">
    <span className="h-0.5 w-7 bg-accent-blue" />
    {project.testimonial?.attribution}
  </figcaption>
</figure>
```

Delete the `Read the case study` `TrackedLink` and the full lower rail containing `Editorial digital workshop`. Keep only the live-site link and reduce the right-hand column's trailing whitespace.

Render all canonical FAQs without index overrides:

```tsx
<Accordion
  theme="dark"
  items={faqs.map((item, index) => ({
    id: `faq-${index + 1}`,
    question: item.question,
    answer: item.answer,
  }))}
/>
```

Use three visible orange arrow icons in `components/sections/about.tsx`:

```tsx
<li key={item} className="flex items-center gap-4 text-sm">
  <span data-testid="about-commitment-arrow" aria-hidden>
    <ArrowIcon className="h-5 w-5 shrink-0 text-accent-orange" />
  </span>
  <span>{item}</span>
</li>
```

Update both contact strings:

```ts
const successMessage =
  "Thanks, your enquiry is in. I'll reply personally as soon as I can.";
```

```tsx
<p className="mt-6 rotate-[-2deg] font-heading text-2xl italic text-accent-orange">
  I reply to you personally as soon as I can.
</p>
```

In `components/layout/footer.tsx`, replace the custom `LogoMark` plus heading with the shared header lockup and retain the caption:

```tsx
<span>
  <BrandLockup className="text-[#f5f1e7]" />
  <span className="mt-2 block pl-[4.4rem] text-[.58rem] uppercase tracking-[.28em] text-[#8d8e88]">
    Digital workshop
  </span>
</span>
```

Add a restrained card cue immediately after the card button in `components/motion/hero-business-card.tsx`:

```tsx
<span
  data-testid="hero-card-flip-cue"
  aria-hidden
  className="pointer-events-none absolute -bottom-9 right-1 flex rotate-[6deg] items-center gap-2 font-heading text-sm italic text-accent-orange sm:-right-8 sm:text-base"
>
  <svg viewBox="0 0 42 22" className="h-5 w-10" fill="none">
    <path d="M2 18C12 3 27 3 37 13M31 12l7 1-2-7" stroke="currentColor" />
  </svg>
  Flip
</span>
```

- [ ] **Step 4: Run the focused tests and verify they pass**

Run the same focused Playwright command from Step 2.

Expected: all tests pass on desktop Chromium.

- [ ] **Step 5: Commit the correction set**

```bash
git add 'app/(marketing)/page.tsx' components/motion/hero-business-card.tsx components/sections/portfolio.tsx components/sections/faq.tsx components/sections/about.tsx components/sections/contact.tsx components/layout/footer.tsx tests/e2e/editorial-fidelity.spec.ts tests/e2e/conversion.spec.ts tests/e2e/hero-business-card.spec.ts
git commit -m "fix: apply editorial workshop review corrections"
```

---

### Task 2: Make the Services rows accessible and interactive

**Files:**
- Modify: `tests/e2e/conversion.spec.ts`
- Modify: `components/sections/services.tsx`

**Interfaces:**
- Consumes: `services: Service[]`, `ServiceSketch`, and existing service section styling.
- Produces: buttons named from each service title, `aria-expanded`, `aria-controls`, and panels named `service-panel-N`.

- [ ] **Step 1: Replace the static-services assertion with failing interaction coverage**

Replace `services are all scannable without carousel controls` with:

```ts
test("service rows disclose one useful detail at a time", async ({ page }) => {
  await prepareDeterministicPage(page);
  await page.goto("/");

  const services = page.locator("#services");
  const brochure = services.getByRole("button", { name: /Brochure websites/ });
  const ecommerce = services.getByRole("button", { name: /E-commerce stores/ });

  await expect(brochure).toHaveAttribute("aria-expanded", "false");
  await expect(ecommerce).toHaveAttribute("aria-expanded", "false");
  await expect(services.getByRole("region")).toHaveCount(0);

  await ecommerce.click();
  await expect(ecommerce).toHaveAttribute("aria-expanded", "true");
  await expect(
    services.getByRole("region", { name: /E-commerce stores/ }),
  ).toContainText("Growing businesses that need online sales");

  await brochure.click();
  await expect(brochure).toHaveAttribute("aria-expanded", "true");
  await expect(ecommerce).toHaveAttribute("aria-expanded", "false");
  await expect(services.getByRole("region")).toHaveCount(1);

  await brochure.click();
  await expect(brochure).toHaveAttribute("aria-expanded", "false");
  await expect(services.getByRole("region")).toHaveCount(0);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/conversion.spec.ts --grep "service rows disclose" --project=desktop-chromium
```

Expected: FAIL because the static rows expose no buttons or regions and e-commerce remains highlighted.

- [ ] **Step 3: Convert Services into a single-open disclosure list**

Add `"use client"`, import `useState`, and track `activeIndex: number | null` with a `null` initial value. For each service, calculate `isOpen`, then use this structure:

```tsx
const [activeIndex, setActiveIndex] = useState<number | null>(null);

// Inside services.map
const isOpen = activeIndex === index;
const triggerId = `service-trigger-${index + 1}`;
const panelId = `service-panel-${index + 1}`;

return (
  <li
    key={service.title}
    data-state={isOpen ? "open" : "closed"}
    className={cn(
      "border-b transition-colors duration-300",
      isOpen ? "border-accent-blue text-[#7f98ff]" : "border-white/25 text-[#f4f0e6]",
    )}
  >
    <h2>
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="cta-focus grid min-h-[9.25rem] w-full grid-cols-[3.5rem_1fr_2rem] items-center gap-4 py-5 text-left sm:grid-cols-[5rem_10rem_1fr_2rem] sm:gap-6 lg:grid-cols-[7rem_18rem_1fr_2rem] lg:gap-12"
        onClick={() => setActiveIndex(isOpen ? null : index)}
      >
        <span className="font-heading text-4xl sm:text-5xl">0{index + 1}</span>
        <span aria-hidden className="hidden text-[#a8a79f] sm:block">
          <ServiceSketch index={index} />
        </span>
        <span>
          <span className="block font-heading text-3xl leading-none sm:text-4xl">
            {service.title}
          </span>
          <span className="mt-2 block text-sm text-[#aaa9a2]">
            {service.summary}
          </span>
        </span>
        <span aria-hidden className="text-3xl font-light">
          {isOpen ? "−" : "+"}
        </span>
      </button>
    </h2>
    {isOpen ? (
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="ml-[3.5rem] border-t border-white/20 pb-6 pt-4 sm:ml-[21rem] lg:ml-[37rem]"
      >
        <p className="max-w-xl pr-6 text-sm leading-relaxed text-white/75">
          <strong className="mr-2 uppercase tracking-[.12em] text-[#9aafff]">
            Best for
          </strong>
          {service.bestFor}
        </p>
      </div>
    ) : null}
  </li>
);
```

Import `cn` from `@/lib/utils`. Keep the custom-scope CTA unchanged. Confirm no index-specific colour or minus logic remains.

- [ ] **Step 4: Run the focused service test and accessibility test**

Run:

```bash
npx playwright test tests/e2e/conversion.spec.ts --grep "service rows disclose" --project=desktop-chromium
npx playwright test tests/e2e/a11y.spec.ts --project=desktop-chromium
```

Expected: both commands pass.

- [ ] **Step 5: Commit the service interaction**

```bash
git add components/sections/services.tsx tests/e2e/conversion.spec.ts
git commit -m "feat: make service rows interactive"
```

---

### Task 3: Build the compact landscape process composition

**Files:**
- Modify: `tests/e2e/editorial-fidelity.spec.ts`
- Modify: `content/process.ts`
- Create: `components/motion/process-illustrations.tsx`
- Create: `components/motion/process-timeline.tsx`
- Modify: `components/sections/process.tsx`

**Interfaces:**
- Consumes: `ProcessStep` from `content/process.ts`.
- Produces: `ProcessTimeline({ steps }: { steps: ProcessStep[] })`, `ProcessIllustration({ index }: { index: number })`, and `[data-testid="process-timeline"]` with CSS grid layout.

- [ ] **Step 1: Add failing content and responsive-layout assertions**

Add to `tests/e2e/editorial-fidelity.spec.ts`:

```ts
test("process explains four practical stages in a compact responsive grid", async ({
  isMobile,
  page,
}) => {
  await prepareDeterministicPage(page);
  await page.goto("/");

  const timeline = page.getByTestId("process-timeline");
  await expect(timeline.getByRole("listitem")).toHaveCount(4);
  for (const outcome of [
    "A clear brief and agreed priorities",
    "A direction you approve before build",
    "A tested site ready for real customers",
    "A reliable site that keeps improving",
  ]) {
    await expect(timeline.getByText(outcome, { exact: true })).toBeVisible();
  }

  const columns = await timeline.evaluate(
    (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
  );
  expect(columns).toBe(isMobile ? 2 : 4);
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
```

- [ ] **Step 2: Run the new process test and verify it fails**

Run:

```bash
npx playwright test tests/e2e/editorial-fidelity.spec.ts --grep "process explains" --project=desktop-chromium --project=mobile-chromium
```

Expected: FAIL because the current cards do not expose the timeline hook, new outcomes, or two-column mobile grid.

- [ ] **Step 3: Expand the process content model**

Replace `content/process.ts` with:

```ts
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
    description: "We map your goals, audience, current friction and the job the website needs to do.",
    outcome: "A clear brief and agreed priorities",
    annotation: "Listen first",
  },
  {
    step: "02",
    title: "Design direction",
    description: "You see the structure, visual language and key journey before the full build begins.",
    outcome: "A direction you approve before build",
    annotation: "Shape the idea",
  },
  {
    step: "03",
    title: "Build & launch",
    description: "I build responsively, test the important paths and prepare a careful release.",
    outcome: "A tested site ready for real customers",
    annotation: "Make it work",
  },
  {
    step: "04",
    title: "Ongoing support",
    description: "After launch I can handle hosting, updates and practical improvements as needs change.",
    outcome: "A reliable site that keeps improving",
    annotation: "Keep it useful",
  },
];
```

- [ ] **Step 4: Create coherent SVG process illustrations**

Create `components/motion/process-illustrations.tsx` with four illustrations sharing `viewBox="0 0 220 128"`, `fill="none"`, `stroke="currentColor"`, rounded line caps, and `aria-hidden`. Use these exact primary paths:

```tsx
const sketches = [
  [
    "M30 32h112v72H30zM42 46h55M42 60h82M42 74h68",
    "M151 44c22 0 38 12 38 27s-16 27-38 27l-17 15 4-20c-15-5-25-13-25-22 0-15 16-27 38-27Z",
  ],
  [
    "M24 104 110 28l86 76M45 86h130M66 67h88M87 49h46",
    "M58 108V78m104 30V78M110 28v80M22 42h176M36 34v16m148-16v16",
  ],
  [
    "M24 26h172v78H24zM24 42h172M38 56h144v34H38z",
    "M48 34h2m8 0h2m8 0h2M150 111h52V62h-52zM160 72h32v25h-32z",
  ],
  [
    "M24 75h38l12-27 18 51 18-38 14 14h72",
    "M48 28h124v76H48zM64 42h40M64 54h72M151 43a12 12 0 1 1-1 0",
  ],
] as const;

export function ProcessIllustration({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 220 128" aria-hidden className="h-full w-full" fill="none">
      {sketches[index]?.map((d) => (
        <path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
```

- [ ] **Step 5: Build the responsive static timeline and integrate it**

Create `components/motion/process-timeline.tsx`:

```tsx
import { ProcessIllustration } from "@/components/motion/process-illustrations";
import type { ProcessStep } from "@/content/process";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative mt-10">
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 right-0 top-[11.25rem] hidden h-10 w-full md:block"
      >
        <path
          d="M8 21C170 4 255 34 402 20S666 28 804 19s244 11 388-3"
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="2"
        />
      </svg>
      <ol
        data-testid="process-timeline"
        className="grid grid-cols-2 border-y border-[#181a17]/35 md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <li
            key={step.step}
            className="relative min-h-[22rem] border-b border-r border-[#181a17]/25 p-4 even:border-r-0 md:border-b-0 md:border-r md:p-6 md:even:border-r md:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-4xl sm:text-5xl">{step.step}</span>
              <span className="rotate-[-4deg] font-heading text-sm italic text-accent-orange">
                {step.annotation}
              </span>
            </div>
            <h2 className="mt-1 font-body text-sm font-bold">{step.title}</h2>
            <div className="mt-5 h-28 text-[#343630] sm:h-32">
              <ProcessIllustration index={index} />
            </div>
            <p className="mt-7 text-sm leading-relaxed text-[#454640]">
              {step.description}
            </p>
            <p className="mt-3 border-t border-[#181a17]/25 pt-3 text-xs font-bold text-accent-blue">
              {step.outcome}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
```

Replace the current `<ol>` and `ServiceProcessSketch` in `components/sections/process.tsx` with:

```tsx
<ProcessTimeline steps={processSteps} />
<p className="py-4 text-center font-heading text-3xl">
  You always know what happens next.
</p>
```

- [ ] **Step 6: Run the process test and verify it passes**

Run the same two-project command from Step 2.

Expected: desktop reports four columns, mobile reports two, all outcomes are visible, and no horizontal overflow is introduced.

- [ ] **Step 7: Commit the static timeline composition**

```bash
git add content/process.ts components/motion/process-illustrations.tsx components/motion/process-timeline.tsx components/sections/process.tsx tests/e2e/editorial-fidelity.spec.ts
git commit -m "feat: redesign the process timeline"
```

---

### Task 4: Animate the timeline once with Motion for React

**Files:**
- Modify: `tests/e2e/editorial-fidelity.spec.ts`
- Modify: `components/motion/process-illustrations.tsx`
- Modify: `components/motion/process-timeline.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `ProcessTimeline({ steps })`, browser `prefers-reduced-motion`, and Motion's `motion`, `useInView`, and `useReducedMotion` exports from `motion/react`.
- Produces: `data-timeline-reveal="hidden|visible|reduced"`; an in-view sequence that remains visible because `useInView(..., { once: true })` never resets.

- [ ] **Step 1: Add failing one-time and reduced-motion checks**

Add to `tests/e2e/editorial-fidelity.spec.ts`:

```ts
test("process draws once when it enters view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await prepareDeterministicPage(page);
  await page.goto("/");

  const timeline = page.getByTestId("process-timeline");
  await timeline.scrollIntoViewIfNeeded();
  await expect(timeline).toHaveAttribute("data-timeline-reveal", "visible");
  await page.locator("#hero").scrollIntoViewIfNeeded();
  await timeline.scrollIntoViewIfNeeded();
  await expect(timeline).toHaveAttribute("data-timeline-reveal", "visible");
});

test("process is complete immediately for reduced-motion visitors", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await prepareDeterministicPage(page);
  await page.goto("/");

  const timeline = page.getByTestId("process-timeline");
  await expect(timeline).toHaveAttribute("data-timeline-reveal", "reduced");
  await expect(timeline.getByRole("listitem")).toHaveCount(4);
});
```

- [ ] **Step 2: Run the motion tests and verify they fail**

Run:

```bash
npx playwright test tests/e2e/editorial-fidelity.spec.ts --grep "process draws once|process is complete immediately" --project=desktop-chromium
```

Expected: FAIL because the timeline has no reveal-state attribute or Motion integration.

- [ ] **Step 3: Install the current Framer Motion successor package**

Run:

```bash
npm install motion
```

Expected: `package.json` and `package-lock.json` add Motion 12 or newer. The official upgrade guide identifies `motion` and `motion/react` as the current package/import path for Framer Motion.

- [ ] **Step 4: Add the one-time orchestration and reduced-motion branch**

Add `"use client"` to `components/motion/process-timeline.tsx`, then implement:

```tsx
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const stageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, delay: 0.65 + index * 0.62 },
  }),
};

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(timelineRef, { once: true, amount: 0.25 });
  const shouldReduceMotion = useReducedMotion();
  const isRevealed = Boolean(shouldReduceMotion || isInView);
  const revealState = shouldReduceMotion
    ? "reduced"
    : isInView
      ? "visible"
      : "hidden";

  return (
    <div ref={timelineRef} className="relative mt-10">
      <svg
        aria-hidden
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 right-0 top-[11.25rem] hidden h-10 w-full md:block"
      >
        <motion.path
          d="M8 21C170 4 255 34 402 20S666 28 804 19s244 11 388-3"
          fill="none"
          stroke="var(--accent-blue)"
          strokeWidth="2"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={isRevealed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 1.25, ease: "easeInOut" }}
        />
      </svg>
      <ol
        data-testid="process-timeline"
        data-timeline-reveal={revealState}
        className="grid grid-cols-2 border-y border-[#181a17]/35 md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <motion.li
            key={step.step}
            custom={index}
            initial={shouldReduceMotion ? false : "hidden"}
            animate={isRevealed ? "visible" : "hidden"}
            variants={stageVariants}
            className="relative min-h-[22rem] border-b border-r border-[#181a17]/25 p-4 even:border-r-0 md:border-b-0 md:border-r md:p-6 md:even:border-r md:last:border-r-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-heading text-4xl sm:text-5xl">
                {step.step}
              </span>
              <span className="rotate-[-4deg] font-heading text-sm italic text-accent-orange">
                {step.annotation}
              </span>
            </div>
            <h2 className="mt-1 font-body text-sm font-bold">{step.title}</h2>
            <div className="mt-5 h-28 text-[#343630] sm:h-32">
              <ProcessIllustration
                index={index}
                revealed={isRevealed}
                reduced={Boolean(shouldReduceMotion)}
                delay={0.9 + index * 0.62}
              />
            </div>
            <p className="mt-7 text-sm leading-relaxed text-[#454640]">
              {step.description}
            </p>
            <p className="mt-3 border-t border-[#181a17]/25 pt-3 text-xs font-bold text-accent-blue">
              {step.outcome}
            </p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
```

In `process-illustrations.tsx`, add `"use client"`, import `motion` from `motion/react`, change the public signature to the exact prop type below, and replace each static `<path>` with `motion.path`:

```tsx
type ProcessIllustrationProps = {
  index: number;
  revealed: boolean;
  reduced: boolean;
  delay: number;
};

export function ProcessIllustration({
  index,
  revealed,
  reduced,
  delay,
}: ProcessIllustrationProps) {
  return (
    <svg viewBox="0 0 220 128" aria-hidden className="h-full w-full" fill="none">
      {sketches[index]?.map((d) => (
<motion.path
  key={d}
  d={d}
  stroke="currentColor"
  strokeWidth="1.35"
  strokeLinecap="round"
  strokeLinejoin="round"
  initial={reduced ? false : { pathLength: 0, opacity: 0.25 }}
  animate={revealed ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.25 }}
  transition={{ duration: reduced ? 0 : 0.72, delay, ease: "easeInOut" }}
/>
      ))}
    </svg>
  );
}
```

The caller's `delay={0.9 + index * 0.62}` keeps drawing and stage reveal synchronized and completes the full sequence within four seconds.

- [ ] **Step 5: Run motion, accessibility, type, and build checks**

Run:

```bash
npx playwright test tests/e2e/editorial-fidelity.spec.ts --grep "process draws once|process is complete immediately" --project=desktop-chromium
npm run typecheck
npm run build
```

Expected: both motion tests pass, TypeScript succeeds, and the static export builds to `out` without server-only API errors.

- [ ] **Step 6: Commit the Motion timeline**

```bash
git add package.json package-lock.json components/motion/process-timeline.tsx components/motion/process-illustrations.tsx tests/e2e/editorial-fidelity.spec.ts
git commit -m "feat: animate the process journey"
```

---

### Task 5: Run responsive visual QA and complete verification

**Files:**
- Modify: `tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-section-desktop-chromium-darwin.png`
- Modify: `tests/e2e/visual.spec.ts-snapshots/contact-section-mobile-chromium-darwin.png`
- Modify only if a verified regression is found: files changed in Tasks 1–4.

**Interfaces:**
- Consumes: completed homepage, desktop width `1440`, Pixel 7 mobile profile, existing deterministic-page helper.
- Produces: reviewed visual baselines and evidence that all static/exported interactions remain healthy.

- [ ] **Step 1: Start the local site and inspect the complete homepage in-browser**

Run:

```bash
npm run dev -- --hostname 127.0.0.1 --port 4173
```

Use the in-app browser to inspect at 1440×900 and Pixel 7 widths. Check: Services appears first; business-card cue is legible but quiet; quote marks are both blue; service rows open, close, and transfer selection; timeline remains one landscape row on desktop and two-by-two on mobile; all six FAQs fit without awkward spacing; three orange arrows align; no horizontal overflow; contact copy and footer lockup match; Calendly still opens the configured external URL.

- [ ] **Step 2: Update visual snapshots**

Stop the development server before any production build or snapshot update that launches its own web server. Then run:

```bash
npm run test:e2e:visual:update
```

Inspect both updated homepage PNGs. Reject and fix any clipped copy, oversized section height, disconnected timeline line, illegible annotation, or mobile overflow before accepting the snapshots.

- [ ] **Step 3: Run the complete verification suite**

Run, in order:

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Expected: every command exits `0`; no Playwright failures, unexpected skips, console errors, broken links, or static-export errors.

- [ ] **Step 4: Review the final diff and commit verified baselines or fixes**

Run:

```bash
git diff --check
git status --short
git diff --stat HEAD~4..HEAD
```

Then commit only the reviewed snapshot updates and any QA fixes:

```bash
git add tests/e2e/visual.spec.ts-snapshots/home-page-desktop-chromium-darwin.png tests/e2e/visual.spec.ts-snapshots/home-page-mobile-chromium-darwin.png tests/e2e/visual.spec.ts-snapshots/contact-section-desktop-chromium-darwin.png tests/e2e/visual.spec.ts-snapshots/contact-section-mobile-chromium-darwin.png
git commit -m "test: update editorial refinement baselines"
```

If no snapshot bytes changed, do not create an empty commit.

---

## Reference Documentation

- Motion for React installation: `https://motion.dev/docs/react-installation`
- Motion component viewport options: `https://motion.dev/docs/react-motion-component`
- Motion `useInView`: `https://motion.dev/motion/use-in-view/`
- Motion path drawing: `https://motion.dev/examples/react-path-drawing`
- Motion/Framer Motion upgrade naming: `https://motion.dev/docs/react-upgrade-guide`
