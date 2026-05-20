import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("conversion improvements", () => {
  test("hero and portfolio render specific proof-led conversion copy", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: "Modern websites that help local businesses look trusted and win enquiries.",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "I work directly with South Manchester and Cheshire businesses to audit outdated sites, redesign the customer journey, launch the new website, and support it after go-live.",
      ),
    ).toBeVisible();

    for (const chip of [
      "Free website review",
      "Design + build to launch",
      "Maintenance after launch",
    ]) {
      await expect(page.getByText(chip, { exact: true })).toBeVisible();
    }

    await page.locator("#portfolio").scrollIntoViewIfNeeded();
    await expect(
      page.getByAltText(
        "Double Double Good website desktop homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show next portfolio screenshot" }),
    ).toHaveCount(0);
    await expect(
      page.getByText("The challenge", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("The solution", { exact: true })).toBeVisible();
    await expect(page.getByText("Outcomes", { exact: true })).toBeVisible();
    await expect(
      page.getByText("Client feedback", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Timeline", { exact: true })).toBeVisible();
    await expect(
      page.getByText(
        "The business needed migrating from a legacy PHP Wordpress site to a modernised, enticing website that customers could reliably check before visiting.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Reduced monthly infra spend from legacy PHP website by 50%",
      ),
    ).toBeVisible();
    await expect(page.getByText("Design consultation")).toBeVisible();
    await expect(page.getByText("April")).toHaveCount(2);
    await expect(page.getByText("Development work")).toBeVisible();
    await expect(page.getByText("Deployment")).toBeVisible();
    await expect(page.getByText("May")).toBeVisible();
    await expect(
      page.getByText(
        "Ben at The Design Hutch was fantastic. Initially came with a few design ideas which we refined and decided on. He then took it away and redesigned the website, checking in on key decisions along the way. It felt like my website was in good hands. Finally, we came together for an exciting release of the new website.",
      ),
    ).toBeVisible();
  });

  test("desktop hero keeps the primary CTA in the first viewport", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Desktop viewport check only.");

    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const heroPrimaryCta = page
      .locator("main section")
      .first()
      .getByRole("link", { name: "Book Free Consultation" });
    const box = await heroPrimaryCta.boundingBox();

    expect(box).not.toBeNull();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(880);
  });

  test("about anchor brings the founder photo into view", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 911 });
    await prepareDeterministicPage(page);
    await page.goto("/#about");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: "Founder-led delivery with direct accountability.",
      }),
    ).toBeVisible();
    await expect(
      page.getByAltText("Ben Hutchinson, founder of The Design Hutch"),
    ).toBeInViewport({ ratio: 0.4 });
    for (const commitment of [
      "Clear, practical advice without technical jargon.",
      "Design and build quality focused on real business outcomes.",
      "Personal accountability and support beyond launch.",
      "Collaborative decisions at each key milestone.",
      "Transparent updates from first call to release.",
    ]) {
      await expect(page.getByText(commitment)).toBeInViewport();
    }
  });

  test("contact form includes current website and submits it to Formspree", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);

    let submittedPayload: string | null = null;
    await page.route("https://formspree.io/f/mojbeved", async (route) => {
      submittedPayload = route.request().postData();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("heading", { name: "Book a free website consultation" }),
    ).toBeVisible();
    await expect(page.getByText("Current-site review")).toBeVisible();
    await expect(page.getByLabel("Current website (optional)")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open Calendly Popup" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Open Booking Popup" }),
    ).toBeVisible();

    await page.getByLabel("Name").fill("Alex Taylor");
    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByLabel("Business").fill("Taylor Studio");
    await page
      .getByLabel("Current website (optional)")
      .fill("https://example.com");
    await page
      .getByLabel("Enquiry")
      .fill("We need to replace an outdated website and improve enquiries.");
    await page
      .locator("form")
      .getByRole("button", { name: "Send Enquiry" })
      .click();

    await expect(
      page.getByText(
        "Thanks, your enquiry is in. I'll reply within 1 business day.",
      ),
    ).toBeVisible();
    expect(submittedPayload).toContain("name=Alex+Taylor");
    expect(submittedPayload).toContain("email=alex%40example.com");
    expect(submittedPayload).toContain("business=Taylor+Studio");
    expect(submittedPayload).toContain(
      "currentWebsite=https%3A%2F%2Fexample.com",
    );
  });

  test("desktop layout uses a wider container", async ({ isMobile, page }) => {
    test.skip(isMobile, "Desktop container width check only.");

    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const portfolioBox = await page.locator("#portfolio > div").boundingBox();

    expect(portfolioBox).not.toBeNull();
    expect(portfolioBox?.width ?? 0).toBeGreaterThanOrEqual(1240);
  });

  test("contact validation still shows inline errors", async ({ page }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#contact").scrollIntoViewIfNeeded();

    await page
      .locator("form")
      .getByRole("button", { name: "Send Enquiry" })
      .click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
  });

  test("mobile sticky CTA hides when the contact section is in view", async ({
    isMobile,
    page,
  }) => {
    test.skip(!isMobile, "Mobile sticky CTA is mobile-only.");

    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const stickyCta = page.getByTestId("mobile-sticky-cta");
    await expect(stickyCta).toBeVisible();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(stickyCta).toBeHidden();
  });

  test("closed FAQ answers are absent from the accessibility tree", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#faq").scrollIntoViewIfNeeded();

    await expect(
      page.getByRole("region", { name: "How much does a website cost?" }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("region", { name: "How long does a project take?" }),
    ).toHaveCount(0);

    await page
      .getByRole("button", { name: "How long does a project take?" })
      .click();

    await expect(
      page.getByRole("region", { name: "How much does a website cost?" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("region", { name: "How long does a project take?" }),
    ).toHaveCount(1);
  });
});
