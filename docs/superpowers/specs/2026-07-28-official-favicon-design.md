# Official Favicon Design

**Date:** 2026-07-28  
**Status:** Approved design, pending implementation

## Goal

Replace the hand-drawn favicon with the existing official blue Design Hutch logo so the browser tab uses the same brand mark as the site and installable web app.

## Current State

- `app/icon.svg` is a simplified redraw and is discovered automatically by Next.js as the favicon.
- `siteConfig.logo` already points to the official blue asset at `/brand/design-hutch-logo-icon.png`.
- `app/manifest.ts` already uses `siteConfig.logo` for the installable-site icon.

## Approved Design

Remove the file-based `app/icon.svg` override and declare the favicon metadata in `app/layout.tsx` using `siteConfig.logo`.

The official blue PNG will be used for:

- the standard favicon;
- the shortcut icon;
- the Apple touch icon;
- the existing web-app manifest icon.

This keeps a single source of truth and avoids copying or redrawing the logo. Changing the favicon URL from `/icon.svg` to the official PNG path also avoids browsers continuing to reuse the old SVG at the same URL.

## Constraints

- Do not modify the official logo pixels or create a replacement asset.
- Do not change page layout, visible branding, Open Graph artwork, theme colours, or manifest behaviour beyond aligning icon metadata.
- Preserve Next.js static export and Cloudflare Pages compatibility.

## Verification

- Confirm generated page metadata references `/brand/design-hutch-logo-icon.png` and no longer references `/icon.svg`.
- Confirm the official icon responds successfully from the local preview.
- Refresh the local page and verify the browser loads the official blue mark without framework or console errors.
- Run focused favicon/SEO coverage, lint, typecheck, and the production static build.
