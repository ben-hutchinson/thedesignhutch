# Official Favicon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the inaccurate hand-drawn favicon with the existing official blue Design Hutch logo everywhere browser and installable-site icon metadata is emitted.

**Architecture:** Keep `/brand/design-hutch-logo-icon.png` as the single icon asset through `siteConfig.logo`. Remove the higher-priority file-based `app/icon.svg` override and explicitly declare standard, shortcut, and Apple icons in the root Next.js metadata; retain the manifest's existing reference to the same source.

**Tech Stack:** Next.js 15 App Router metadata, TypeScript, Playwright, Cloudflare Pages static export

## Global Constraints

- Do not modify the official logo pixels or create a replacement asset.
- Do not change page layout, visible branding, Open Graph artwork, theme colours, or manifest behaviour beyond aligning icon metadata.
- Preserve Next.js static export and Cloudflare Pages compatibility.
- Use `/brand/design-hutch-logo-icon.png` through `siteConfig.logo` as the single source of truth.
- Generated page metadata must not reference `/icon.svg`.

---

### Task 1: Replace the favicon override with the official logo

**Files:**

- Delete: `app/icon.svg`
- Modify: `app/layout.tsx:11-46`
- Modify: `tests/e2e/seo.spec.ts:220-255`

**Interfaces:**

- Consumes: `siteConfig.logo: string`, currently `/brand/design-hutch-logo-icon.png`
- Produces: `metadata.icons` entries for `icon`, `shortcut`, and `apple`, all resolving to the official PNG
- Preserves: `app/manifest.ts` icon entry `{ src: siteConfig.logo, sizes: "338x293", type: "image/png", purpose: "any" }`

- [ ] **Step 1: Add a failing browser-metadata regression test**

Add this focused test to `tests/e2e/seo.spec.ts` after the internal-links test and before the JSON-LD test:

```ts
test("uses the official blue logo for browser and app icons", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const officialLogoPath = "/brand/design-hutch-logo-icon.png";
  const officialLogoUrl = new URL(officialLogoPath, siteUrl).href;
  const iconHrefs = await page
    .locator(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
    )
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLLinkElement).href),
    );

  expect(iconHrefs).toEqual([
    officialLogoUrl,
    officialLogoUrl,
    officialLogoUrl,
  ]);
  expect(iconHrefs.some((href) => href.endsWith("/icon.svg"))).toBe(false);

  const iconResponse = await getWithTransportRetry(request, officialLogoPath);
  expect(iconResponse.ok()).toBe(true);
  expect(iconResponse.headers()["content-type"]).toContain("image/png");

  const manifestResponse = await getWithTransportRetry(
    request,
    "/manifest.webmanifest",
  );
  expect(manifestResponse.ok()).toBe(true);

  const manifest = await manifestResponse.json();
  expect(manifest.icons).toContainEqual({
    src: officialLogoPath,
    sizes: "338x293",
    type: "image/png",
    purpose: "any",
  });
});
```

- [ ] **Step 2: Run the focused test and prove the current favicon is wrong**

Stop any manually owned server on port `4173` so Playwright starts the current worktree cleanly, then run:

```bash
npx playwright test tests/e2e/seo.spec.ts --project=desktop-chromium --grep "uses the official blue logo for browser and app icons"
```

Expected: FAIL because the document still emits `/icon.svg` and does not emit all three official-logo icon relations.

- [ ] **Step 3: Declare the official icon metadata**

Add `icons` immediately after `manifest` in `app/layout.tsx`:

```ts
  icons: {
    icon: [
      {
        url: siteConfig.logo,
        type: "image/png",
        sizes: "338x293",
      },
    ],
    shortcut: [siteConfig.logo],
    apple: [
      {
        url: siteConfig.logo,
        type: "image/png",
        sizes: "338x293",
      },
    ],
  },
```

Delete `app/icon.svg` so Next.js file-based metadata cannot override the explicit official-logo entries.

- [ ] **Step 4: Run the focused regression test and prove the metadata is corrected**

```bash
npx playwright test tests/e2e/seo.spec.ts --project=desktop-chromium --grep "uses the official blue logo for browser and app icons"
```

Expected: PASS; all browser icon links and the manifest reference `/brand/design-hutch-logo-icon.png`, the PNG responds successfully, and `/icon.svg` is absent.

- [ ] **Step 5: Verify the rendered favicon through the in-app Browser**

Start or reuse the preview at `http://127.0.0.1:4173/`. Use the Browser skill and perform this exact flow:

1. Navigate to `http://127.0.0.1:4173/?favicon=official` so the document URL is fresh.
2. Confirm the page title is `The Design Hutch | Premium Websites for Local Businesses`.
3. Inspect the document and confirm the standard, shortcut, and Apple icon links resolve to `/brand/design-hutch-logo-icon.png`.
4. Request `/brand/design-hutch-logo-icon.png` and confirm HTTP 200 with an `image/png` content type.
5. Confirm the DOM contains the normal homepage rather than a framework error overlay.
6. Confirm there are no relevant console errors or warnings after reload.
7. Capture one first-viewport screenshot outside the repository for evidence; no layout difference is expected.

- [ ] **Step 6: Run formatting and focused quality checks**

Run each command sequentially:

```bash
npx prettier --check app/layout.tsx tests/e2e/seo.spec.ts docs/superpowers/specs/2026-07-28-official-favicon-design.md docs/superpowers/plans/2026-07-28-official-favicon.md
git diff --check
npm run lint
npm run typecheck
npx playwright test tests/e2e/seo.spec.ts
```

Expected: all commands exit `0`; SEO coverage passes on desktop and mobile projects.

- [ ] **Step 7: Verify the production static export**

Stop the manual preview before building, then run:

```bash
npm run build
```

Expected: exit `0`, all 15 static pages are generated, and the export completes without dynamic-runtime requirements.

Inspect the exported homepage and confirm the stale icon is absent:

```bash
rg -n "design-hutch-logo-icon|icon\.svg" out/index.html
```

Expected: matches for `design-hutch-logo-icon.png` and no match for `icon.svg`.

- [ ] **Step 8: Run the full browser regression suite**

```bash
npm run test:e2e
```

Expected: all executed tests pass; viewport-specific tests may remain intentionally skipped.

- [ ] **Step 9: Restore the local preview and commit**

Restore `http://127.0.0.1:4173/`, verify it responds, then stage only the favicon implementation and test files:

```bash
git add app/icon.svg app/layout.tsx tests/e2e/seo.spec.ts
git commit -m "fix: use official logo for favicon"
```

Expected: one implementation commit with the SVG deletion, explicit metadata, and regression coverage. Keep the branch and isolated worktree available for the existing integration handoff.
