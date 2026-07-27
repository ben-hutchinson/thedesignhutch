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

    const servicesTop = await page
      .locator("#services")
      .evaluate((section) => section.getBoundingClientRect().top);
    expect(servicesTop).toBeGreaterThan(880);
    expect(servicesTop).toBeLessThan(1045);
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

  test("process explains four practical stages in a compact responsive grid", async ({
    isMobile,
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const timeline = page.getByTestId("process-timeline");
    await expect(timeline.getByRole("listitem")).toHaveCount(4);
    for (const outcome of [
      "A clear brief and agreed priorities",
      "A direction you approve before build",
      "A tested site ready for real customers",
      "A reliable site that keeps improving",
    ]) {
      await expect(timeline.getByText(outcome, { exact: true })).toBeVisible();
    }

    const columns = await timeline.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    );
    expect(columns).toBe(isMobile ? 2 : 4);
    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
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

  test("review corrections are present across the editorial homepage", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    await expect(
      page.locator("#services [data-section-number]"),
    ).toHaveText("01");
    await expect(
      page.locator("#portfolio [data-section-number]"),
    ).toHaveText("02");

    const portfolio = page.locator("#portfolio");
    const quoteMarks = portfolio.locator("[data-portfolio-quote-mark]");
    await expect(quoteMarks).toHaveCount(2);
    await expect(quoteMarks.nth(0)).toHaveClass(/text-accent-blue/);
    await expect(quoteMarks.nth(1)).toHaveClass(/text-accent-blue/);
    await expect(
      portfolio.getByRole("link", { name: "Read the case study" }),
    ).toHaveCount(0);
    await expect(
      portfolio.getByText("Editorial digital workshop", { exact: true }),
    ).toHaveCount(0);

    const faq = page.locator("#faq");
    await expect(faq.getByRole("button")).toHaveCount(6);
    await expect(
      faq.getByRole("button", {
        name: "Can you help with hosting and domains?",
      }),
    ).toBeVisible();
    await expect(
      faq.getByRole("button", {
        name: "Is this better than a DIY website builder?",
      }),
    ).toBeVisible();

    await expect(page.getByTestId("about-commitment-arrow")).toHaveCount(3);
    await expect(
      page.getByText("I reply to you personally as soon as I can.", {
        exact: true,
      }),
    ).toBeVisible();

    const footerWordmark = page
      .locator("footer")
      .getByText("The Design Hutch", { exact: true });
    await expect(footerWordmark).toHaveClass(/font-body/);
    await expect(footerWordmark).toHaveClass(/font-medium/);
  });
});
