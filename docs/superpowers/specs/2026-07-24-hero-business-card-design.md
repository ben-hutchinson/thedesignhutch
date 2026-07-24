# Hero Business Card Motion Design

## Goal

Turn the homepage hero logo panel into a lightweight, convincing 3D business card based on the supplied Vistaprint recording. The card must reveal a branded reverse, support automatic and direct manipulation, remain accessible, and preserve the existing Cloudflare Pages static-export deployment.

## Chosen Approach

Use the existing Framer Motion dependency with browser-native CSS 3D transforms. A perspective wrapper contains one rotating card with two absolutely positioned faces. This is preferable to a video, GIF, or WebGL scene because it stays interactive, responsive, sharp, and small while requiring no deployment or server changes.

## Visual Design

### Front

- Keep the existing blue `design-hutch-logo-full.png` artwork.
- Preserve the current rounded border, glow, and responsive landscape ratio.
- Add a restrained edge highlight and changing shadow to suggest card stock without making the panel look heavy.

### Back

- Use the orange reverse shown in the recording, with a subtle tonal gradient and fine surface texture.
- Render “Ben Hutchinson” and “Founder & Developer” at the upper left.
- Render the site contact address from `contactDetails.email` at the lower left so the card remains consistent with the rest of the website.
- Render a simplified white hut mark at the lower right.
- Keep all reverse-side content as live HTML/SVG so it stays crisp and responsive.

## Interaction

- On idle, the card performs a slow 180-degree horizontal turn, pauses on the back, returns to the front, then rests before repeating. A full cycle is approximately eight seconds and avoids constant motion.
- Horizontal pointer dragging or touch swiping directly controls rotation around the Y axis.
- On release, the card snaps to the nearest face.
- Clicking the card, or pressing Enter or Space while it is focused, flips to the opposite face.
- Automatic movement pauses during hover, focus, and direct manipulation, then resumes after interaction.
- The interaction uses pointer-friendly cursor feedback and does not interfere with vertical page scrolling on touch devices.

## Accessibility and Motion Safety

- Expose the interactive card as a keyboard-focusable control with a clear accessible label and current front/back state.
- Keep the visible artwork decorative to avoid duplicate announcements.
- When `prefers-reduced-motion` is enabled, disable the idle animation and instantaneously present controlled front/back changes.
- Preserve a visible focus treatment and a usable tap target across desktop and mobile layouts.

## Component Boundary

- Extract the card into a focused hero motion component responsible for card state, drag handling, keyboard input, reduced-motion behavior, and the two faces.
- Keep `HeroSection` responsible only for hero layout, entry motion, copy, and calls to action.
- Reuse the current content and image paths; do not introduce a new motion library or server-side dependency.

## Deployment and Performance

- The feature runs entirely in the browser and remains compatible with the repository's `output: "export"` Next.js configuration and Cloudflare Pages `out` directory.
- Animate only composited `transform` and shadow/opacity values; do not animate layout dimensions.
- Use the existing optimized image markup and avoid video, canvas, or WebGL payloads.
- The existing Cloudflare Pages Function at `/api/contact` is unchanged.

## Verification

- Add a Playwright interaction test before production code that proves keyboard/tap flipping changes the exposed face state.
- Add a reduced-motion assertion that the card does not advertise or run idle animation when motion is reduced.
- Run the focused test red, implement the smallest passing component, then run lint, typecheck, build, and relevant end-to-end tests.
- Perform rendered QA at desktop and mobile widths, including initial load, front/back state, drag or flip interaction, framework overlay, console health, and screenshot evidence.

## Scope

This change affects only the main hero logo card. It does not redesign the navbar logo, change contact handling, add analytics, or alter the Cloudflare deployment configuration.
