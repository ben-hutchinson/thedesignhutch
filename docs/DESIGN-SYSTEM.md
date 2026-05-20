# Design System

DesignHutch uses a token-driven dark theme aligned with `DESIGN.md`.

## Color tokens

- Base: `#050505`, `#111111`, `#1A1A1A`
- Text: `#FFFFFF`, `#BDBDBD`
- Accent: `#3B82F6` (primary), `#F97316` (secondary)

## Typography

- Heading: `Space Grotesk`
- Body: `Manrope`

## CSS component utilities

- `.container-shell`: horizontal layout wrapper
- `.section-shell`: section vertical rhythm
- `.surface-card`: shared premium card surface
- `.cta-focus`: consistent keyboard focus treatment

## Token sources

- Runtime constants: `lib/theme.ts`
- Tailwind primitives: `tailwind.config.ts`
- Global CSS variables/utilities: `app/globals.css`
