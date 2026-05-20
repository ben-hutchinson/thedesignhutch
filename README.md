# The Design Hutch Marketing Site

Premium, founder-led marketing website built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zod validation

## Run locally

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## E2E automation

```bash
npm run test:e2e:visual:update
npm run test:e2e:visual
npm run test:e2e:a11y
```

## Structure

- Marketing page route: `app/(marketing)/page.tsx`
- Architecture notes: `docs/ARCHITECTURE.md`

## Contact form integration

The contact form validates submissions with Zod in the browser, then posts
directly to Formspree.

Anti-spam and reliability hardening included:

- Honeypot field (`website`) to absorb basic bot traffic

The current Formspree endpoint is configured in `content/site.ts`.

## SEO and analytics

- JSON-LD structured data: `Organization`, `LocalBusiness`, `FAQPage`
- Web app manifest route: `app/manifest.ts`
- Funnel analytics tracking:
  - CTA click event mapping (`cta_id`, `cta_source`, `cta_destination`)
  - Scroll depth milestones (25/50/75/100)
  - Section visibility events
- Optional GA via `NEXT_PUBLIC_GA_ID` (events also push to `window.dataLayer`)

## Deployment

Deploy to Cloudflare Pages:

1. Import this repository into Cloudflare Pages.
2. Use `npm run build` as the build command.
3. Use `out` as the output directory.
4. Connect `www.thedesignhutch.com` as the custom domain.
