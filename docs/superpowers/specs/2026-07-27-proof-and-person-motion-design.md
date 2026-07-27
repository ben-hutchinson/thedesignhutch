# Proof + Person Motion Design

**Date:** 27 July 2026
**Branch:** `codex/editorial-digital-workshop`
**Status:** Approved direction; awaiting written-spec review

## Objective

Add two selective Motion-powered showpieces that make the site feel more crafted while strengthening the two most important trust signals: evidence of good work and direct access to the person delivering it.

The finished site should have four intentional motion moments:

1. The interactive hero business card.
2. The drawn Process timeline.
3. The Portfolio proof assembly.
4. The About founder reveal.

Other sections remain calm so these moments retain impact.

## Design Principles

- Motion must clarify hierarchy or direct attention, not decorate every element.
- Each sequence runs once when its section first enters the viewport.
- Content is fully readable before and after animation; motion never gates access.
- Reduced-motion visitors receive the complete final composition immediately.
- Static export and Cloudflare Pages compatibility must remain unchanged.
- The existing editorial palette, typography, paper textures, and layout remain unchanged.

## Portfolio: Proof Assembly

### Trigger

Start once when approximately 30% of the Portfolio composition enters the viewport.

### Sequence

1. The desktop website screenshot rises 28–36px into its final position while rotating from approximately `-1.5deg` to `0deg`. Its shadow develops at the same time, creating the feeling of a printed proof being placed on the page.
2. The mobile screenshot follows after a short delay, sliding 36–48px from the right and settling over the desktop proof with a subtle spring. The spring must not overshoot enough to feel playful or elastic.
3. The three proof metrics reveal in reading order with a short stagger. Their rules draw horizontally rather than the values counting upward.
4. The blue quotation marks and testimonial fade and lift together. Both quotation marks retain the existing colour and spacing.

### Timing

- Total sequence: approximately 1.3–1.5 seconds.
- Desktop proof: 550–650ms.
- Mobile proof: begins 180–250ms after the desktop proof.
- Metrics: 80–120ms stagger.
- Testimonial: final 250–350ms reveal.

### Responsive Behaviour

- Desktop preserves the overlapping desktop/mobile proof composition.
- Mobile uses shorter travel distances and no rotation greater than `1deg` to avoid clipping or visual instability.
- The sequence must not change section height or create horizontal overflow.

## About: Founder Reveal

### Trigger

Start once when approximately 25–30% of the About section enters the viewport.

### Sequence

1. The founder photograph reveals from top to bottom through a soft mask or clipping wipe. The effect should resemble a photographic print developing, not a generic opacity fade.
2. The photograph settles with a very small opacity and scale correction (`0.985` to `1`) to avoid a flat reveal.
3. The three orange commitment arrows draw in sequentially from top to bottom. Their accompanying text remains stationary and readable.
4. The orange “One person all the way” annotation fades and moves a few pixels into position after the final arrow completes.

### Timing

- Photograph reveal: 700–850ms.
- Arrow drawings: 90–140ms stagger after the photograph is substantially visible.
- Annotation: final 250–350ms reveal.
- Total sequence: approximately 1.4–1.6 seconds.

### Responsive Behaviour

- On desktop, the photograph and left-column content may reveal in parallel, but the arrows retain their top-to-bottom sequence.
- On mobile, the text appears normally before the image enters view; the image wipe runs when the image itself approaches the viewport.
- The portrait wrapper preserves the section height and image semantics while waiting for its visual trigger.

## Component Design

Create two focused client-side motion wrappers rather than converting entire editorial sections into client components:

- `PortfolioProofMotion` owns the in-view trigger and animation variants for the screenshots, metrics, and testimonial.
- `FounderRevealMotion` owns the portrait mask, arrow drawing sequence, and annotation reveal.

Both wrappers use `motion/react`, `useInView({ once: true })`, and `useReducedMotion()`. Static section copy and layout remain server-rendered wherever possible.

Animation variants and timings should live with their owning wrapper. Shared abstraction is unnecessary unless identical behaviour emerges during implementation.

## Accessibility and Fallbacks

- `prefers-reduced-motion: reduce` renders every element in its final state without delays, clipping, transforms, or path drawing.
- Motion wrappers render their final state in the server output, then prepare an off-screen sequence only after hydration and only if the section has not entered view.
- The DOM reading order does not change.
- Decorative masks and paths use `aria-hidden`.
- Links, blockquotes, images, headings, and metrics retain their current semantics.
- If hydration is delayed or JavaScript fails, the server-rendered final composition remains visible.
- Focus behaviour is unaffected by motion.

## Performance Boundaries

- Animate only `transform`, `opacity`, clip/mask progress, and SVG path length where practical.
- Do not animate layout properties such as width, height, margin, or top/left positioning.
- Do not add image assets or third-party dependencies.
- Reuse the existing optimized Next.js images and current `motion` dependency.
- No continuous scroll-linked animation, parallax loop, autoplay loop, or background timer.
- The homepage remains statically exportable for Cloudflare Pages.

## Testing and Acceptance Criteria

### Automated

- Portfolio sequence begins from its initial state before entering view and reaches its final state after entering view.
- Founder sequence follows the same one-time trigger behaviour.
- Reduced-motion mode renders both compositions complete immediately.
- Existing portfolio links, testimonial semantics, founder image, About commitments, and three orange arrows remain present.
- Desktop and mobile pages have no horizontal overflow.
- Full visual-regression baselines are reviewed and intentionally updated.
- Lint, TypeScript, production static export, accessibility tests, and the complete browser suite pass.

### Visual

- Portfolio reads as a proof composition being assembled, not generic cards fading in.
- Desktop and mobile screenshots settle cleanly without clipping or layout shift.
- About reads as a photographic reveal followed by hand-drawn guidance.
- The four showpieces feel related through restrained easing and one-time playback.
- No other section competes for attention through new large-scale motion.

## Out of Scope

- Page transitions.
- Animated headline typography.
- Navigation progress indicators.
- Count-up statistics.
- Parallax scrolling.
- Service illustration animation.
- Contact checklist animation.
- Changes to copy, section order, colours, typography, Calendly, or form behaviour.
