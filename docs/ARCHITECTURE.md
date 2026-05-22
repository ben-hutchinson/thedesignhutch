# Architecture

DesignHutch is structured as a static multi-page marketing app with modular sections and data-first content files. The homepage keeps the hero and compact route overview; focused static pages hold the full detail for each nav item, with the contact form living on `/contact`.

## Folder map

- `app/`: Next.js routes and platform concerns.
- `app/(marketing)/`: public marketing route group for `/`, `/services`, `/portfolio`, `/process`, `/faq`, `/about`, and `/contact`.
- Contact form submissions post directly to Formspree.
- `components/layout/`: shell, navbar, footer, wrappers.
- `components/sections/`: page-level sections in render order.
- `components/ui/`: reusable primitives.
- `components/motion/`: shared animation helpers.
- `content/`: editable copy/data models per section.
- `lib/`: utilities, validation, constants, analytics hooks.
- `public/`: static assets (OG image, icon).

## Build rules

- Keep section copy in `content/*` unless tightly coupled to UI state.
- Keep page composition in `app/(marketing)/*/page.tsx`; avoid bloated section files.
- Keep Cloudflare Pages compatibility by preserving `output: "export"` and avoiding runtime-only routes, middleware, or server actions.
- Add new reusable primitives under `components/ui/` before duplicating markup.
- Keep route handlers thin and validated with `zod` schemas from `lib/validation.ts`.
