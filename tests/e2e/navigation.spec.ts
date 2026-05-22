import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("primary navigation", () => {
  const routeLinks = [
    {
      href: "/services",
      label: "Services",
      heading: "Premium services designed for local-business growth.",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      heading: "Proof that the work reaches launch.",
    },
    {
      href: "/process",
      label: "Process",
      heading: "Simple, transparent steps from first call to launch.",
    },
    {
      href: "/faq",
      label: "FAQ",
      heading: "Answers that remove hesitation before you enquire.",
    },
    {
      href: "/about",
      label: "About",
      heading: "Founder-led delivery with direct accountability.",
    },
    {
      href: "/contact",
      label: "Contact",
      heading: "Book a free website consultation",
    },
  ] as const;

  test("desktop nav links route to static pages and mark the active page", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Primary navigation is desktop-only.");

    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    for (const route of routeLinks) {
      await page
        .locator("nav[aria-label='Primary']")
        .getByRole("link", { name: route.label })
        .click();

      await expect(page).toHaveURL(new RegExp(`${route.href}$`));
      await expect(
        page.getByRole("heading", { name: route.heading }),
      ).toBeVisible();
      await expect(
        page.locator(`nav[aria-label="Primary"] a[href="${route.href}"]`),
      ).toHaveClass(/after:scale-x-100/);
    }
  });

  test("mobile menu routes to pages and closes after selection", async ({
    isMobile,
    page,
  }) => {
    test.skip(!isMobile, "Mobile navigation is mobile-only.");

    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("nav[aria-label='Mobile']")).toBeVisible();

    await page
      .locator("nav[aria-label='Mobile']")
      .getByRole("link", { name: "Services" })
      .click();

    await expect(page).toHaveURL(/\/services$/);
    await expect(page.locator("nav[aria-label='Mobile']")).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        name: "Premium services designed for local-business growth.",
      }),
    ).toBeVisible();
  });
});
