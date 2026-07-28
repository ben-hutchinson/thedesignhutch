import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const siteUrl = "https://thedesignhutch.com";
const indexableRoutes = [
  { path: "/", canonical: siteUrl, socialTitle: "The Design Hutch" },
  {
    path: "/services",
    canonical: `${siteUrl}/services`,
    socialTitle: "Services | The Design Hutch",
  },
  {
    path: "/portfolio",
    canonical: `${siteUrl}/portfolio`,
    socialTitle: "Portfolio | The Design Hutch",
  },
  {
    path: "/process",
    canonical: `${siteUrl}/process`,
    socialTitle: "Process | The Design Hutch",
  },
  {
    path: "/faq",
    canonical: `${siteUrl}/faq`,
    socialTitle: "FAQ | The Design Hutch",
  },
  {
    path: "/about",
    canonical: `${siteUrl}/about`,
    socialTitle: "About | The Design Hutch",
  },
  {
    path: "/contact",
    canonical: `${siteUrl}/contact`,
    socialTitle: "Contact | The Design Hutch",
  },
  {
    path: "/privacy",
    canonical: `${siteUrl}/privacy`,
    socialTitle: "Privacy Policy | The Design Hutch",
  },
] as const;

async function metaContent(page: Page, selector: string) {
  const meta = page.locator(selector);
  return (await meta.count()) === 0 ? null : meta.getAttribute("content");
}

async function getWithTransportRetry(request: APIRequestContext, url: string) {
  try {
    return await request.get(url);
  } catch {
    return request.get(url);
  }
}

for (const route of indexableRoutes) {
  test.describe(`technical SEO: ${route.path}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route.path);
    });

    test("emits complete, self-referential metadata", async ({ page }) => {
      const title = await page.title();
      const description = await metaContent(page, 'meta[name="description"]');
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");

      expect(title.trim().length).toBeGreaterThan(20);
      expect(description?.trim().length).toBeGreaterThan(50);
      expect(canonical).toBe(route.canonical);
      await expect(page.locator("title")).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);

      expect(await metaContent(page, 'meta[property="og:title"]')).toBe(
        route.socialTitle,
      );
      expect(await metaContent(page, 'meta[property="og:description"]')).toBe(
        description,
      );
      expect(await metaContent(page, 'meta[property="og:url"]')).toBe(
        route.canonical,
      );
      expect(await metaContent(page, 'meta[property="og:image"]')).toMatch(
        /^https:\/\//,
      );
      expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe(
        "summary_large_image",
      );
      expect(await metaContent(page, 'meta[name="twitter:title"]')).toBe(
        route.socialTitle,
      );
      expect(await metaContent(page, 'meta[name="twitter:description"]')).toBe(
        description,
      );

      const robots = await metaContent(page, 'meta[name="robots"]');
      expect((robots ?? "").toLowerCase()).not.toContain("noindex");
    });

    test("has a single H1 and a logical heading hierarchy", async ({
      page,
    }) => {
      await expect(page.locator("h1")).toHaveCount(1);

      const levels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((headings) =>
          headings.map((heading) => Number(heading.tagName.slice(1))),
        );

      expect(levels[0]).toBe(1);
      for (let index = 1; index < levels.length; index += 1) {
        expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
      }
    });

    test("gives every image an alt attribute and serves its source", async ({
      page,
      request,
    }) => {
      const images = await page.locator("img").evaluateAll((elements) =>
        elements.map((image) => ({
          alt: image.getAttribute("alt"),
          src: image.getAttribute("src") ?? "",
        })),
      );

      for (const image of images) {
        expect(image.alt).not.toBeNull();
        expect(image.src).toBeTruthy();

        const response = await getWithTransportRetry(request, image.src);
        expect(response.ok(), image.src).toBe(true);
        expect(response.headers()["content-type"]).toMatch(/^image\//);
      }
    });
  });
}

test("uses a unique page title for every indexable route", async ({ page }) => {
  test.setTimeout(90_000);
  const titles = [];

  for (const route of indexableRoutes) {
    await page.goto(route.path);
    titles.push(await page.title());
  }

  expect(new Set(titles).size).toBe(indexableRoutes.length);
});

test("serves valid internal links and fragment targets", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  for (const route of indexableRoutes) {
    await page.goto(route.path);

    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")).filter(Boolean),
      );

    for (const href of new Set(hrefs)) {
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
        continue;
      }

      const url = new URL(href, siteUrl);
      if (url.origin !== siteUrl) {
        continue;
      }

      if (url.hash && url.pathname === route.path) {
        const id = decodeURIComponent(url.hash.slice(1));
        expect(
          await page.evaluate(
            (fragmentId) => Boolean(document.getElementById(fragmentId)),
            id,
          ),
          `${route.path}${url.hash}`,
        ).toBe(true);
        continue;
      }

      const response = await getWithTransportRetry(
        request,
        `${url.pathname}${url.search}`,
      );
      expect(response.ok(), href).toBe(true);
    }
  }
});

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

test("emits parseable JSON-LD on the relevant routes", async ({ page }) => {
  await page.goto("/");

  const businessBlocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const businessDocuments = businessBlocks.map((block) => JSON.parse(block));
  const businessTypes = businessDocuments.map((document) => document["@type"]);

  expect(businessTypes).toEqual(
    expect.arrayContaining(["Organization", "LocalBusiness"]),
  );

  for (const type of ["Organization", "LocalBusiness"]) {
    const document = businessDocuments.find((value) => value["@type"] === type);
    expect(document?.url).toBe(siteUrl);
    expect(document?.["@id"]).toMatch(
      new RegExp(`^${siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/#`),
    );
  }

  await page.goto("/faq");
  const faqBlocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const faqDocuments = faqBlocks.map((block) => JSON.parse(block));
  const faqPage = faqDocuments.find(
    (document) => document["@type"] === "FAQPage",
  );

  expect(faqPage?.mainEntity.length).toBeGreaterThan(0);
});

test("keeps sitemap, robots, and canonical routes consistent", async ({
  request,
}) => {
  const sitemapResponse = await getWithTransportRetry(request, "/sitemap.xml");
  const robotsResponse = await getWithTransportRetry(request, "/robots.txt");

  expect(sitemapResponse.ok()).toBe(true);
  expect(robotsResponse.ok()).toBe(true);
  expect(sitemapResponse.headers()["content-type"]).toContain("xml");
  expect(robotsResponse.headers()["content-type"]).toContain("text/plain");

  const sitemap = await sitemapResponse.text();
  const robots = await robotsResponse.text();

  for (const route of indexableRoutes) {
    expect(sitemap).toContain(`<loc>${route.canonical}</loc>`);
  }

  expect(robots).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
});
