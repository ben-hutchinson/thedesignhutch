# DesignHutch Technical SEO Audit

**Audit date:** 9 July 2026

**Production target:** `https://thedesignhutch.com`

**Production canonical observed:** `https://www.thedesignhutch.com`
**Status:** Route architecture resolved locally; deployment checks remain

## Executive summary

The production site is crawlable, all eight sitemap routes return `200`, broken
internal links were not found, malformed URLs return `404`, metadata titles and
descriptions are unique, and lab accessibility/SEO scores are strong.

Production currently exposes eight indexable routes and selects `www` as
canonical. The checked-out branch now preserves the same eight-route structure,
publishes each route in the sitemap, and selects the apex domain. The route-loss
risk is resolved locally; the canonical-host decision and Cloudflare redirect
still need to be completed before production deployment.

The remaining launch priorities are:

1. Select one canonical host and redirect the other host with a permanent
   redirect.
2. Verify the Pages Function, security headers, and host redirect in Cloudflare.
3. Deploy and confirm the local H1 and page-specific social metadata fixes on
   every secondary route.
4. Re-run the crawl, accessibility, and performance checks against production.

The current branch now includes an eight-route automated SEO regression suite,
single-H1 page structure, page-specific social metadata, and route-appropriate
JSON-LD. Those changes are not yet reflected on the production deployment.

## Scope and evidence

### Evidence collected

- Production crawl of `/`, `/services`, `/portfolio`, `/process`, `/faq`,
  `/about`, `/contact`, and `/privacy`.
- HTTP checks for apex, `www`, HTTP-to-HTTPS, `robots.txt`, `sitemap.xml`,
  malformed URLs, social image, project link, and Calendly link.
- Emitted DOM inspection for metadata, headings, images, links, identifiers,
  language, and JSON-LD.
- Three cold Lighthouse runs per production route on mobile and desktop.
- Axe scans of all production routes on mobile and desktop, including moderate
  findings.
- Keyboard focus, landmarks, mobile menu, and reduced-motion spot checks.
- Current-branch static export inspection and Playwright regression tests.

### Limitations

- Search Console was not authenticated in the audit browser, so URL Inspection,
  coverage, query, and sitemap reports could not be exported.
- No Google Analytics or Tag Manager script and no `dataLayer` were present on
  production. Analytics conversion data was therefore unavailable.
- The PageSpeed Insights API returned quota exhaustion. The performance results
  below are Lighthouse lab data, not CrUX field data.
- Google's Rich Results Test displayed “Something went wrong — Log in and try
  again.” JSON-LD was instead parsed from the live DOM and checked for required
  identities and visible-content consistency. Rich-result eligibility remains
  a manual post-login check.
- Raw Lighthouse reports remain under `/tmp/designhutch-lh-*.json` and are not
  committed.

## Production crawl baseline

### Host and endpoint behavior

| Check                             | Result                                      | Assessment                            |
| --------------------------------- | ------------------------------------------- | ------------------------------------- |
| `https://thedesignhutch.com/`     | `200`                                       | Duplicate host remains accessible     |
| `https://www.thedesignhutch.com/` | `200`                                       | Canonical host selected by production |
| `http://thedesignhutch.com/`      | `301` to apex HTTPS                         | HTTPS redirect works                  |
| `/robots.txt`                     | `200`, allows all, references `www` sitemap | Valid                                 |
| `/sitemap.xml`                    | `200`, eight `www` URLs                     | Valid for current production          |
| Unknown path                      | `404`                                       | Correct                               |
| Portfolio project                 | `200` after redirect                        | Valid                                 |
| Calendly booking URL              | `200`                                       | Valid                                 |
| `/og-image.svg`                   | `200 image/svg+xml`, 2,112 bytes            | Validate on social platforms          |

Production responses included `X-Content-Type-Options` and
`Referrer-Policy`, but did not include the HSTS, CSP, frame, or permissions
headers defined in the current branch's `public/_headers`.

### Route coverage

| Route        | Status | Canonical            | Title/description | H1      | Social metadata   | JSON-LD                         | Links | Axe                                   |
| ------------ | -----: | -------------------- | ----------------- | ------- | ----------------- | ------------------------------- | ----- | ------------------------------------- |
| `/`          |  `200` | `www` self-canonical | Unique            | Pass    | Homepage values   | `Organization`, `LocalBusiness` | Pass  | Pass desktop; mobile landmark warning |
| `/services`  |  `200` | `www/services`       | Unique            | Missing | Inherits homepage | None                            | Pass  | Missing H1; mobile landmark warning   |
| `/portfolio` |  `200` | `www/portfolio`      | Unique            | Missing | Inherits homepage | None                            | Pass  | Missing H1; mobile landmark warning   |
| `/process`   |  `200` | `www/process`        | Unique            | Missing | Inherits homepage | None                            | Pass  | Missing H1; mobile landmark warning   |
| `/faq`       |  `200` | `www/faq`            | Unique            | Missing | Inherits homepage | `FAQPage`                       | Pass  | Missing H1; mobile landmark warning   |
| `/about`     |  `200` | `www/about`          | Unique            | Missing | Inherits homepage | None                            | Pass  | Missing H1; mobile landmark warning   |
| `/contact`   |  `200` | `www/contact`        | Unique            | Missing | Inherits homepage | None                            | Pass  | Missing H1                            |
| `/privacy`   |  `200` | `www/privacy`        | Unique            | Pass    | Inherits homepage | None                            | Pass  | Pass                                  |

All production pages declare `lang="en"`, contain no accidental `noindex`,
and are linked from the primary navigation or footer. No orphan sitemap route
was found.

## Performance and image baseline

Lighthouse values are medians of three cold runs. Parentheses show the observed
range. LCP is lab LCP and must not be presented as Core Web Vitals field data.

| Route        |  Device | Performance | Accessibility | SEO | Best practices |                LCP |   CLS |  TBT |
| ------------ | ------: | ----------: | ------------: | --: | -------------: | -----------------: | ----: | ---: |
| `/`          |  Mobile |  91 (88–95) |           100 | 100 |            100 | 3.06s (2.89–3.18s) | 0.000 | 14ms |
| `/`          | Desktop |         100 |           100 | 100 |            100 | 0.60s (0.59–0.67s) | 0.006 |  0ms |
| `/services`  |  Mobile |  94 (93–94) |           100 | 100 |            100 | 3.03s (2.58–3.04s) | 0.000 |  8ms |
| `/services`  | Desktop |         100 |           100 | 100 |            100 | 0.59s (0.59–0.65s) | 0.000 |  0ms |
| `/portfolio` |  Mobile |  87 (87–94) |           100 | 100 |            100 | 3.27s (2.58–3.32s) | 0.000 | 11ms |
| `/portfolio` | Desktop | 99 (99–100) |           100 | 100 |            100 | 0.90s (0.78–0.90s) | 0.000 |  0ms |
| `/process`   |  Mobile |  90 (89–96) |           100 | 100 |            100 | 3.24s (2.76–3.78s) | 0.027 |  9ms |
| `/process`   | Desktop |         100 |           100 | 100 |            100 | 0.60s (0.59–0.66s) | 0.002 |  0ms |
| `/faq`       |  Mobile |  93 (92–94) |           100 | 100 |            100 | 3.09s (3.03–3.25s) | 0.000 | 15ms |
| `/faq`       | Desktop |         100 |           100 | 100 |            100 | 0.78s (0.77–0.80s) | 0.000 |  0ms |
| `/about`     |  Mobile |  89 (83–92) |           100 | 100 |            100 | 3.34s (3.33–4.67s) | 0.000 |  7ms |
| `/about`     | Desktop |         100 |           100 | 100 |            100 | 0.80s (0.77–0.82s) | 0.000 |  0ms |
| `/contact`   |  Mobile |  88 (87–89) |           100 | 100 |             77 | 3.34s (3.26–3.85s) | 0.000 | 20ms |
| `/contact`   | Desktop | 99 (99–100) |           100 | 100 |             77 | 0.91s (0.76–0.99s) | 0.000 |  0ms |
| `/privacy`   |  Mobile |  93 (91–97) |           100 | 100 |            100 | 2.88s (2.13–2.90s) | 0.000 | 10ms |
| `/privacy`   | Desktop |         100 |           100 | 100 |            100 | 0.39s (0.38–0.56s) | 0.000 |  0ms |

Every route reported approximately 46–47 KB of unused JavaScript, with an
estimated 150–430 ms mobile saving. TBT remained low, so this is secondary to
LCP and URL architecture.

The checked-out Next.js configuration uses `images.unoptimized: true`.
Production image transfer sizes include:

| Asset                        |     Bytes |
| ---------------------------- | --------: |
| Full logo PNG                | 1,049,020 |
| Portfolio desktop screenshot | 1,229,611 |
| Founder headshot             |   240,649 |
| Logo icon PNG                |   129,805 |

## Prioritised findings

| ID      | Priority | Category                   | URL/component                                                       | Evidence                                                                                         | Impact                                                                                  | Confidence                     | Effort | Recommended fix                                                                                                             | Acceptance test                                                                                                         | Owner                    | Status                                    |
| ------- | -------- | -------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------- |
| SEO-001 | P0       | Deployment architecture    | Current branch vs production                                        | Branch export and sitemap now preserve all eight production routes                               | Route-loss risk is removed from the pending deployment                                  | High                           | L      | Retain the merged multi-page architecture and verify the exported route set before deployment                               | All eight URLs build successfully and the sitemap contains the same canonical destinations                              | Engineering              | Resolved locally; deployment pending      |
| SEO-002 | P1       | Canonicalisation           | Apex and `www`                                                      | Both HTTPS hosts return `200`; production selects `www`; branch selects apex                     | Duplicate hosts consume crawl signals and conflicting deployments may switch canonicals | High                           | S      | Select one host, align `siteConfig`, sitemap, robots, JSON-LD, Search Console, and redirect the other host                  | Non-canonical HTTPS host returns one-hop `301`/`308`; every canonical and sitemap URL uses the selected host            | Engineering / Cloudflare | Open                                      |
| SEO-003 | P1       | Headings/accessibility     | `/services`, `/portfolio`, `/process`, `/faq`, `/about`, `/contact` | Each page starts with H2; axe `page-has-heading-one`                                             | Weakens page topic hierarchy and screen-reader navigation                               | High                           | S      | Render each page's primary section title as its single H1                                                                   | Exactly one descriptive H1 per indexable page; no skipped heading level; axe finding absent                             | Engineering              | Open on production                        |
| SEO-004 | P1       | Social metadata            | All secondary production pages                                      | `og:title`, `og:description`, `og:url`, Twitter title/description all resolve to homepage values | Shared pages produce inaccurate previews and URLs                                       | High                           | S      | Add page-specific Open Graph and Twitter metadata                                                                           | Social title/description match page; `og:url` equals canonical; preview tools show correct card                         | Engineering              | `/privacy` fixed locally; production open |
| SEO-005 | P2       | Mobile performance         | All production routes                                               | Median mobile lab LCP 2.88–3.34s; desktop 0.39–0.91s                                             | Mobile first view is slower than the 2.5s “good” target                                 | Medium until field data exists | M      | Compress/preload the actual LCP asset, reduce image bytes, and remeasure before broader JS work                             | Three-run mobile median LCP ≤2.5s on representative routes; confirm 75th-percentile field LCP in PSI/GSC when available | Engineering              | Open                                      |
| SEO-006 | P2       | Images                     | Shared logo, portfolio, founder assets                              | PNGs reach 1.05–1.23 MB; Next image optimisation disabled                                        | Adds transfer time and can delay LCP                                                    | High                           | M      | Produce WebP/AVIF variants, right-size by breakpoint, preserve dimensions, and verify preload only for the LCP image        | No above-fold image exceeds its agreed byte budget; responsive sources load at rendered size; no CLS regression         | Engineering / Design     | Open                                      |
| SEO-007 | P2       | Measurement                | Production analytics and GSC                                        | No GA/Tag Manager script or `dataLayer`; GSC not authenticated                                   | Findings cannot be ranked by queries, landing-page conversions, or field CWV            | High                           | S      | Verify Search Console ownership and deploy consent-compliant analytics/conversion events if intended                        | GSC shows verified property and sitemap; analytics records page views plus form, Calendly, and email conversion events  | Site owner               | Open                                      |
| SEO-008 | P2       | Accessibility landmarks    | Mobile shared shell                                                 | Axe `region` warning on home and five secondary pages                                            | Some mobile content sits outside semantic landmarks                                     | High                           | S      | Move the offending shared/mobile element into a landmark or label its region appropriately                                  | Axe reports no `region` violation at Pixel 7 viewport on all routes                                                     | Engineering              | Open                                      |
| SEO-009 | P2       | Third parties              | `/contact`                                                          | Lighthouse Best Practices 77; Calendly sets `__cf_bm` and logs cookie issues                     | Third-party behavior affects privacy posture and diagnostics                            | High                           | M      | Load Calendly on interaction or use an external booking link until consent/need is established                              | Contact has no unexpected third-party cookie before user interaction; privacy text matches behavior                     | Engineering / Site owner | Open                                      |
| SEO-010 | P2       | Response headers           | Cloudflare deployment                                               | Production omits HSTS/CSP/frame/permissions headers present in `public/_headers`                 | Deployment is not applying the intended security policy                                 | High                           | M      | Confirm Cloudflare Pages header-file handling and deploy the intended headers without breaking Calendly/Turnstile/analytics | Production response contains the reviewed header set; contact and booking flows still work                              | Engineering / Cloudflare | Open                                      |
| SEO-011 | P3       | Sitemap freshness          | `/sitemap.xml`, `app/sitemap.ts`                                    | Production uses the same 22 May timestamp for every URL; branch uses build time for every URL    | `lastmod` does not describe actual content changes                                      | High                           | S      | Use real content modification dates or omit `lastmod` until tracked                                                         | Unchanged pages retain stable dates; modified pages update independently                                                | Engineering              | Open                                      |
| SEO-012 | P3       | Motion/accessibility       | Homepage hero                                                       | Four finite 0.01–720 ms animations were still running with reduced motion                        | Reduced-motion behavior is incomplete but not an SEO blocker                            | Medium                         | S      | Skip hero entry animation when `useReducedMotion()` is true                                                                 | `document.getAnimations()` shows no meaningful hero motion in reduced mode                                              | Engineering              | Open                                      |
| SEO-013 | P3       | Social image compatibility | `/og-image.svg`                                                     | Valid 1,200×630 SVG is served                                                                    | Some social crawlers are less reliable with SVG previews                                | Medium                         | S      | Publish a 1,200×630 PNG/JPEG fallback and validate on LinkedIn/Facebook/X tools                                             | All selected platform validators render the intended image                                                              | Design / Engineering     | Open                                      |

## Automated regression coverage

`tests/e2e/seo.spec.ts` and `npm run test:e2e:seo` cover all eight indexable
routes on desktop Chromium and Pixel 7:

- Unique titles and descriptions.
- Absolute self-canonicals and absence of accidental `noindex`.
- Page-specific Open Graph/Twitter metadata.
- One H1 and logical heading progression.
- Internal routes and fragment targets.
- Image alt attributes and image responses.
- Parseable `Organization`, `LocalBusiness`, and `FAQPage` JSON-LD.
- Sitemap membership and robots-to-sitemap consistency.

## Recommended execution order

1. Resolve SEO-002 and verify the Cloudflare deployment configuration.
2. Deploy, rerun the regression suite against production, validate structured
   data while signed in, and submit the final sitemap in Search Console.
3. Enable first-party measurement, then use real landing-page and field-CWV
   data to order SEO-005 through SEO-010.
4. Recheck Search Console after 7 days and compare index coverage, canonicals,
   impressions, CTR, and conversions after 28 days.

The audit is not considered closed while the canonical-host decision remains
open or while the live production route set cannot pass the same metadata and
heading rules as the checked-out branch.
