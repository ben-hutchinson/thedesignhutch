import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("conversion improvements", () => {
  test("homepage tells the trust story in the approved editorial order", async ({
    isMobile,
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
        isMobile
          ? "Founder-led web design for South Manchester and Cheshire businesses."
          : "I work directly with South Manchester and Cheshire businesses to audit outdated sites, redesign the customer journey, launch the new website, and support it after go-live.",
      ),
    ).toBeVisible();

    const hero = page.locator("main section").first();
    await expect(
      hero.getByRole("link", { name: "Book a free consultation" }),
    ).toHaveAttribute("href", "/contact");
    await expect(
      hero.getByRole("link", { name: "View recent work" }),
    ).toHaveAttribute("href", "#portfolio");
    for (const trustPoint of [
      "South Manchester",
      "Cheshire",
      "Founder-led",
    ]) {
      await expect(hero.getByTestId("hero-trust-line")).toContainText(trustPoint);
    }

    const orderedSections = [
      "hero",
      "services",
      "portfolio",
      "process",
      "faq",
      "about",
      "contact",
    ];
    const offsets = await Promise.all(
      orderedSections.map((id) =>
        page
          .locator(`#${id}`)
          .evaluate((node) => (node as HTMLElement).offsetTop),
      ),
    );
    expect(offsets).toEqual([...offsets].sort((a, b) => a - b));
    await expect(page.locator("#site-overview")).toHaveCount(0);
  });

  test("mobile hero prioritises the proposition and CTAs over the workshop card", async ({
    isMobile,
    page,
  }) => {
    test.skip(!isMobile, "Mobile reading-order check only.");

    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const headingBox = await page.locator("#hero h1").boundingBox();
    const ctaBox = await page
      .locator("#hero")
      .getByRole("link", { name: "Book a free consultation" })
      .boundingBox();
    const cardBox = await page.getByTestId("hero-business-card").boundingBox();

    expect(headingBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    expect(cardBox).not.toBeNull();
    expect((headingBox?.y ?? 0) + (headingBox?.height ?? 0)).toBeLessThan(
      cardBox?.y ?? 0,
    );
    expect((ctaBox?.y ?? 0) + (ctaBox?.height ?? 0)).toBeLessThan(
      cardBox?.y ?? 0,
    );
  });

  test("services are all scannable without carousel controls", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const services = page.locator("#services");
    for (const name of [
      "Brochure websites",
      "E-commerce stores",
      "Booking systems",
      "Hosting help",
      "Automation & AI",
    ]) {
      await expect(services.getByRole("heading", { name })).toBeAttached();
    }
    await expect(
      services.getByRole("button", { name: /service/i }),
    ).toHaveCount(0);
  });

  test("portfolio route renders the approved concise project proof", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/portfolio");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByAltText(
        "Double Double Good website desktop homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Show next portfolio screenshot" }),
    ).toHaveCount(0);
    await expect(page.getByText("50%", { exact: true })).toBeVisible();
    await expect(page.getByText("Responsive", { exact: true })).toBeVisible();
    await expect(page.getByText("Direct", { exact: true })).toBeVisible();
    await expect(
      page.getByText("It felt like my website", { exact: false }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "View the live website" }),
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
      .getByRole("link", { name: "Book a free consultation" });
    const box = await heroPrimaryCta.boundingBox();

    expect(box).not.toBeNull();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(880);
  });

  test("about route brings the founder photo into view", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 911 });
    await prepareDeterministicPage(page);
    await page.goto("/about");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: "The person designing and building your website",
      }),
    ).toBeVisible();
    await expect(
      page.getByAltText("Ben Hutchinson, founder of The Design Hutch"),
    ).toBeInViewport({ ratio: 0.4 });
    for (const commitment of [
      "Clear advice without technical jargon",
      "Collaborative decisions at each key milestone",
      "Support after launch",
    ]) {
      await expect(page.getByText(commitment)).toBeInViewport();
    }
  });

  test("contact form stays short and does not eagerly load Calendly", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);

    let submittedPayload: string | null = null;
    await page.route("**/api/contact", async (route) => {
      submittedPayload = route.request().postData();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: "Let’s make your website easier to trust",
      }),
    ).toBeVisible();
    await expect(page.getByText("Current-site review")).toBeVisible();
    await expect(page.getByLabel("Current website (optional)")).toHaveCount(0);
    await expect(page.getByLabel("Phone (optional)")).toHaveCount(0);
    await expect(
      page
        .locator("#contact")
        .getByRole("link", { name: "Book a free consultation" }),
    ).toBeVisible();
    await expect(page.locator('script[src*="calendly"]')).toHaveCount(0);
    await expect(page.locator('link[href*="calendly"]')).toHaveCount(0);

    await page.getByLabel("Name").fill("Alex Taylor");
    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByLabel("Business").fill("Taylor Studio");
    await page
      .getByLabel("What should your website improve?")
      .fill("We need to replace an outdated website and improve enquiries.");
    await page
      .locator("form")
      .getByRole("button", { name: "Send my enquiry" })
      .click();

    await expect(
      page.getByText(
        "Thanks, your enquiry is in. I'll reply personally as soon as I can.",
      ),
    ).toBeVisible();
    expect(submittedPayload).toContain("name=Alex+Taylor");
    expect(submittedPayload).toContain("email=alex%40example.com");
    expect(submittedPayload).toContain("business=Taylor+Studio");
    expect(submittedPayload).toContain("currentWebsite=");
    expect(submittedPayload).toContain("phone=");
  });

  test("contact honeypot submissions look successful without posting", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);

    let apiCalled = false;
    await page.route("**/api/contact", async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ ok: false }),
      });
    });

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Name").fill("Alex Taylor");
    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByLabel("Business").fill("Taylor Studio");
    await page
      .locator('input[name="website"]')
      .fill("https://spam.example", { force: true });
    await page
      .getByLabel("What should your website improve?")
      .fill("We need to replace an outdated website and improve enquiries.");
    await page
      .locator("form")
      .getByRole("button", { name: "Send my enquiry" })
      .click();

    await expect(
      page.getByText(
        "Thanks, your enquiry is in. I'll reply personally as soon as I can.",
      ),
    ).toBeVisible();
    expect(apiCalled).toBe(false);
  });

  test("contact API failures show a generic fallback message", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);

    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          message: "Unable to send right now. Please use email instead.",
        }),
      });
    });

    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await page.getByLabel("Name").fill("Alex Taylor");
    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByLabel("Business").fill("Taylor Studio");
    await page
      .getByLabel("What should your website improve?")
      .fill("We need to replace an outdated website and improve enquiries.");
    await page
      .locator("form")
      .getByRole("button", { name: "Send my enquiry" })
      .click();

    await expect(
      page.getByText("Unable to send right now. Please use email instead."),
    ).toBeVisible();
  });

  test("portfolio route uses a wider desktop container", async ({
    isMobile,
    page,
  }) => {
    test.skip(isMobile, "Desktop container width check only.");

    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/portfolio");
    await page.waitForLoadState("networkidle");

    const portfolioBox = await page.locator("#portfolio > div").boundingBox();

    expect(portfolioBox).not.toBeNull();
    expect(portfolioBox?.width ?? 0).toBeGreaterThanOrEqual(1240);
  });

  test("contact validation still shows inline errors", async ({ page }) => {
    await prepareDeterministicPage(page);
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    await page
      .locator("form")
      .getByRole("button", { name: "Send my enquiry" })
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
    await expect(stickyCta).toBeHidden();

    await page.locator("#services").scrollIntoViewIfNeeded();
    await expect(stickyCta).toBeVisible();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(stickyCta).toBeHidden();
  });

  test("closed FAQ answers are absent from the accessibility tree", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/faq");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("region", { name: "How much does a website cost?" }),
    ).toHaveCount(0);
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
