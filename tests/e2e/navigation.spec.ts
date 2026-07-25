import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("primary navigation", () => {
  const routeLinks = [
    {
      href: "/services",
      label: "Services",
      heading: "What I can build",
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      heading: "Recent work",
    },
    {
      href: "/process",
      label: "Process",
      heading: "From first conversation to a supported launch",
    },
    {
      href: "/faq",
      label: "FAQ",
      heading: "Questions before we start",
    },
    {
      href: "/about",
      label: "About",
      heading: "The person designing and building your website",
    },
    {
      href: "/contact",
      label: "Contact",
      heading: "Let’s make your website easier to trust",
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
      ).toHaveClass(/border-accent-blue/);
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
        name: "What I can build",
      }),
    ).toBeVisible();
  });
});
