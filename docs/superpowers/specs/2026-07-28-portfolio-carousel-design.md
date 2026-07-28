# Portfolio Carousel Design

**Date:** 28 July 2026  
**Branch:** `codex/editorial-digital-workshop`  
**Status:** Approved direction; awaiting written-spec review

## Objective

Turn the existing single-project Portfolio proof assembly into a data-driven carousel that becomes active when a second project is added. The current one-project presentation must remain visually unchanged, while future projects should require content and image data only—not new component code.

The carousel should preserve the editorial proof-board composition, build trust by keeping controls predictable, and replay the existing slide-in sequence for every selected project.

## Considered Approaches

### 1. Manual carousel only

Previous/next controls, project counter, keyboard navigation, and swipe gestures. This is the calmest and most accessible option, but it does not satisfy the desired rotating showcase without visitor input.

### 2. Continuous autoplay carousel

Advance projects on a fixed timer and loop indefinitely. This supplies visible movement, but it can interrupt reading, weaken trust, and creates accessibility obligations without giving the visitor enough control.

### 3. Controlled autoplay carousel — selected

Combine an eight-second rotation with explicit previous, next, pause, and play controls. Autoplay pauses while the carousel is hovered or contains focus. A manual previous/next/swipe action stops autoplay until the visitor explicitly presses play. Reduced-motion visitors start with autoplay disabled.

This approach provides the requested rotation while allowing visitors to read proof at their own pace.

## Content Model

Each `Project` entry will contain every value needed by the visible proof composition:

- Stable project identifier.
- Title, location/category eyebrow, and proof headline.
- Live-site URL and accessible link label.
- Three concise proof metrics.
- Short featured quotation and attribution.
- Featured desktop and mobile screenshots with alt text.
- Existing longer-form challenge, solution, service, outcome, and timeline content may remain available for future case-study use.

Display copy and image selection must no longer be hard-coded in the section component. Adding a valid second project object will automatically enable carousel controls and rotation.

## Component Architecture

### Server-rendered section shell

`PortfolioSection` will keep the numbered heading, editorial paper treatment, and project data import. It will pass the serializable project collection to a focused client carousel component. The first project remains present in the server-rendered output so the static Cloudflare Pages build and no-JavaScript fallback retain meaningful content.

### Client carousel controller

`PortfolioCarousel` will own only interactive carousel state:

- Active project index.
- Navigation direction.
- Whether autoplay is running.
- Temporary pause state caused by hover, focus, document visibility, or an off-screen carousel.
- Pointer-swipe start and end positions.

State transitions will use functional updates. The timer will exist only when there is more than one project, autoplay is enabled, the document is visible, and the carousel is both in view and not temporarily paused.

### Project proof slide

The existing `PortfolioProofMotion` composition will become a reusable slide renderer. Each slide is keyed by its stable project identifier and wrapped in `AnimatePresence` so a project change replays the composition:

1. The outgoing proof moves a short distance opposite the navigation direction and fades.
2. The incoming desktop proof slides in first.
3. The mobile proof follows with the existing restrained spring.
4. Metrics and testimonial reveal in sequence.

Only the currently active slide remains exposed to assistive technology and keyboard navigation.

## Controls and Interaction

Controls appear only when at least two projects exist. The one-project site therefore remains visually identical to the approved design.

For multiple projects, the control row will include:

- Previous and next buttons with explicit accessible names.
- A `01 / 03`-style project counter.
- A pause/play button that reports its current action.
- A polite live-region announcement after user-initiated changes, such as “Project 2 of 3: Example project”. Automatic changes will not repeatedly interrupt screen readers.

Keyboard focus stays on the control the visitor used. Left and right arrow keys work when focus is within the carousel. Touch and pointer swipes use a deliberate horizontal threshold so ordinary vertical scrolling does not accidentally change projects.

Navigation loops from the last project to the first and from the first to the last.

## Autoplay Rules

- Interval: eight seconds after the active slide has settled.
- Enabled only for two or more projects.
- Paused on hover, while any carousel element contains focus, while the carousel is outside the viewport, and while the browser tab is hidden.
- Previous, next, or swipe interaction switches autoplay off until the visitor presses play.
- The play/pause control provides a permanent visitor-controlled stop mechanism.
- Reduced-motion preference disables autoplay initially.
- No timer is created during server rendering or for a single project.

## Motion and Reduced Motion

Normal motion uses direction-aware horizontal movement of approximately 36–48px for the whole proof, followed by the existing desktop, mobile, metric, and testimonial assembly. Transitions animate only transforms and opacity and must not alter section height or cause horizontal overflow.

With `prefers-reduced-motion: reduce`:

- Autoplay starts disabled.
- Manual project changes remain available.
- Content changes immediately without travel, spring, stagger, or delayed opacity.
- The selected project remains fully visible throughout.

The initial project still runs the existing one-time in-view assembly for visitors without reduced motion.

## Responsive Behaviour

- Desktop retains the two-column proof layout and overlapping device screenshots.
- Controls sit beneath the proof composition and align with the editorial grid.
- Mobile controls remain large enough for touch, and the project counter does not force wrapping.
- Swipe support is additive; visible buttons remain the primary controls.
- The carousel clips its transition layer locally without clipping shadows in the settled state.

## Static Export and Performance

- No new dependency is required; reuse `motion/react`.
- The homepage and `/portfolio` route remain statically exportable to Cloudflare Pages.
- Only the carousel controller and motion wrapper are client-side.
- Images continue using `next/image` and responsive `sizes` values.
- Inactive project images are not marked `priority`; the first project’s primary desktop proof keeps priority loading.
- Timers and visibility listeners are installed once and cleaned up on unmount.

## Testing and Acceptance Criteria

### Data and state tests

- Single-project collections never enable controls or autoplay.
- Next, previous, and wrap-around index calculations are correct.
- A manual change disables autoplay.
- Reduced motion initializes with autoplay disabled.

Synthetic project fixtures will test multi-project state without publishing invented client work.

### Browser tests

- With the current single project, the proof remains visible and no carousel controls appear.
- The first in-view proof assembly still reaches its final state.
- The no-JavaScript fallback retains the first project’s proof, link, metrics, and testimonial.
- Reduced-motion mode renders a complete proof immediately.
- Desktop and mobile layouts have no horizontal overflow.
- Accessibility scans pass and interactive controls have meaningful names and focus states.

### Manual multi-project harness check

During implementation, a temporary uncommitted fixture may be used locally to validate autoplay, previous/next navigation, pause/play, swipe, direction-aware motion, and project announcements. Invented portfolio content will not be shipped.

## Out of Scope

- Publishing a second portfolio project without real client content and approved assets.
- Case-study modals or new detail pages.
- Thumbnail navigation.
- Dragging the proof images independently.
- Changing the existing Portfolio typography, palette, numbering, or section order.
- Adding another carousel dependency.
