import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("approved editorial workshop fidelity", () => {
  test("desktop hero matches the approved first-viewport composition", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Desktop concept check only.");
    await page.setViewportSize({ width: 1505, height: 1045 });
    await prepareDeterministicPage(page);
    await page.goto("/");

    await expect(
      page
        .locator("header")
        .getByRole("link", { name: "Book a free consultation" }),
    ).toBeVisible();
    await expect(
      page
        .locator("#hero")
        .getByRole("link", { name: "Book a free consultation" }),
    ).toBeVisible();
    await expect(
      page.getByText("Independent digital workshop", { exact: true }),
    ).toHaveCount(0);

    const portfolioTop = await page
      .locator("#portfolio")
      .evaluate((section) => section.getBoundingClientRect().top);
    expect(portfolioTop).toBeGreaterThan(880);
    expect(portfolioTop).toBeLessThan(1045);
  });

  test("the supplied official logo is used throughout the page", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const officialMarks = page.locator('img[data-brand-mark="official"]');
    await expect(officialMarks).toHaveCount(5);
    await expect(officialMarks.first()).toHaveAttribute(
      "src",
      "/brand/design-hutch-logo-mark-transparent.png",
    );
  });

  test("portfolio preserves the approved concise proof spread", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const portfolio = page.locator("#portfolio");
    await expect(
      portfolio.getByText("The challenge", { exact: true }),
    ).toHaveCount(0);
    await expect(
      portfolio.getByText("The solution", { exact: true }),
    ).toHaveCount(0);
    await expect(portfolio.getByText("Timeline", { exact: true })).toHaveCount(
      0,
    );
    await expect(
      portfolio.getByText("It felt like my website", { exact: false }),
    ).toBeVisible();
  });

  test("process and contact copy follow the approved mock-ups", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const process = page.locator("#process");
    for (const name of [
      "Consultation",
      "Design direction",
      "Build & launch",
      "Ongoing support",
    ]) {
      await expect(
        process.getByRole("heading", { name, exact: true }),
      ).toBeVisible();
    }

    const form = page.locator("#contact form");
    await expect(
      form.getByRole("link", { name: "Book a free consultation", exact: true }),
    ).toBeVisible();
  });

  test("FAQ starts as the compact closed disclosure band shown in the concept", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const faq = page.locator("#faq");
    await expect(faq.getByRole("region")).toHaveCount(0);
    const costQuestion = faq.getByRole("button", {
      name: "How much does a website cost?",
      exact: true,
    });
    await costQuestion.click();
    await expect(faq.getByRole("region")).toHaveCount(1);
  });
});
