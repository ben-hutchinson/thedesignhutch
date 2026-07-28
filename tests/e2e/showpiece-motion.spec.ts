import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("selective showpiece motion", () => {
  test("portfolio proof assembles once when it enters view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page, { reducedMotion: "no-preference" });
    await page.goto("/");

    const carousel = page.getByTestId("portfolio-carousel");
    const root = carousel.getByTestId("portfolio-proof-motion");
    const desktopProof = carousel.getByTestId("portfolio-desktop-proof");
    const mobileProof = carousel.getByTestId("portfolio-mobile-proof");

    await expect
      .poll(() =>
        page.evaluate(
          () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      )
      .toBe(false);
    await expect(root).toHaveAttribute("data-motion-state", "hidden");
    await expect(desktopProof).toHaveCSS("opacity", "0");
    await expect(mobileProof).toHaveCSS("opacity", "0");

    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(desktopProof).toHaveCSS("opacity", "1");
    await expect(mobileProof).toHaveCSS("opacity", "1");
    await expect(carousel.getByTestId("portfolio-metric")).toHaveCount(3);
    await expect(
      carousel.locator(
        "[data-testid='portfolio-proof-motion'] dl > [data-testid='portfolio-metric'] > dt",
      ),
    ).toHaveCount(3);
    await expect(
      carousel.locator(
        "[data-testid='portfolio-proof-motion'] dl > [data-testid='portfolio-metric'] > dd",
      ),
    ).toHaveCount(3);
    await expect(carousel.getByTestId("portfolio-testimonial")).toHaveCSS(
      "opacity",
      "1",
    );

    await page.locator("#hero").scrollIntoViewIfNeeded();
    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
  });

  test("portfolio proof is complete for reduced-motion visitors", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");

    const carousel = page.getByTestId("portfolio-carousel");
    const root = carousel.getByTestId("portfolio-proof-motion");
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(carousel.getByTestId("portfolio-desktop-proof")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(carousel.getByTestId("portfolio-mobile-proof")).toHaveCSS(
      "opacity",
      "1",
    );
  });

  test("founder portrait develops and commitment arrows draw once", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page, { reducedMotion: "no-preference" });
    await page.goto("/");

    const root = page.getByTestId("founder-reveal-motion");
    const portrait = page.getByTestId("founder-portrait-motion");
    const arrows = page.getByTestId("about-commitment-arrow");
    const arrowPath = arrows.first().locator("path");

    await expect
      .poll(() =>
        page.evaluate(
          () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        ),
      )
      .toBe(false);
    await expect(root).toHaveAttribute("data-motion-state", "hidden");
    await expect(portrait).toHaveCSS("opacity", "0");
    await expect(portrait).toHaveCSS("clip-path", "inset(0% 0% 100%)");
    await expect(arrows).toHaveCount(3);
    await expect(arrows.first()).toHaveCSS("opacity", "0");
    await expect(arrowPath).toHaveAttribute("stroke-dasharray", "0 1");

    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(portrait).toHaveCSS("opacity", "1");
    await expect(portrait).toHaveCSS("clip-path", "inset(0%)");
    await expect(arrows.first()).toHaveCSS("opacity", "1");
    await expect(arrows.last()).toHaveCSS("opacity", "1");
    await expect(arrowPath).toHaveAttribute("stroke-dasharray", "1 1");
    await expect(page.getByTestId("founder-annotation-motion")).toHaveCSS(
      "opacity",
      "1",
    );

    await page.locator("#hero").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect
      .poll(() =>
        root.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return bounds.bottom <= 0 || bounds.top >= window.innerHeight;
        }),
      )
      .toBe(true);
    await page.waitForTimeout(200);
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
  });

  test("founder composition is complete for reduced-motion visitors", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");

    await expect(page.getByTestId("founder-reveal-motion")).toHaveAttribute(
      "data-motion-state",
      "visible",
    );
    await expect(page.getByTestId("founder-portrait-motion")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.getByTestId("about-commitment-arrow").first()).toHaveCSS(
      "opacity",
      "1",
    );
  });

  test("mobile founder portrait waits for the portrait to enter view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await prepareDeterministicPage(page, { reducedMotion: "no-preference" });
    await page.goto("/");

    const root = page.getByTestId("founder-reveal-motion");
    const portrait = page.getByTestId("founder-portrait-motion");

    await root.evaluate((element) =>
      element.scrollIntoView({ block: "start", behavior: "instant" }),
    );
    await expect(
      page.getByText("The person designing and building your website"),
    ).toBeInViewport();
    expect(
      await portrait.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0),
        );
        return visibleHeight / bounds.height;
      }),
    ).toBeLessThan(0.1);
    await expect(root).toHaveAttribute("data-motion-state", "hidden");
    await expect(portrait).toHaveCSS("opacity", "0");

    await portrait.evaluate((element) =>
      element.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await expect
      .poll(() =>
        portrait.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const visibleHeight = Math.max(
            0,
            Math.min(bounds.bottom, window.innerHeight) -
              Math.max(bounds.top, 0),
          );
          return visibleHeight / bounds.height;
        }),
      )
      .toBeGreaterThan(0.27);
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(portrait).toHaveCSS("opacity", "1");
    await expect(portrait).toHaveCSS("clip-path", "inset(0%)");
  });

  test("showpiece motion does not change responsive page geometry", async ({
    page,
  }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");

    const hasHorizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );

    expect(hasHorizontalOverflow).toBe(false);
    await expect(
      page
        .getByTestId("portfolio-carousel")
        .getByTestId("portfolio-proof-motion"),
    ).toBeAttached();
    await expect(page.getByTestId("founder-reveal-motion")).toBeAttached();
  });
});

test.describe("static showpiece fallback", () => {
  test.use({ javaScriptEnabled: false });

  test("proof, process, and founder content stay visible without hydration", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page
        .getByTestId("portfolio-carousel")
        .getByAltText("Double Double Good website desktop homepage screenshot"),
    ).toBeVisible();
    await expect(
      page
        .getByTestId("portfolio-carousel")
        .getByAltText("Double Double Good website mobile homepage screenshot"),
    ).toBeVisible();
    await expect(
      page.getByAltText("Ben Hutchinson, founder of The Design Hutch"),
    ).toBeVisible();
    await expect(
      page.getByText("It felt like my website", { exact: false }),
    ).toBeVisible();
    const stages = page.getByTestId("process-timeline").getByRole("listitem");
    await expect(stages).toHaveCount(4);
    await expect(stages.first()).toHaveCSS("opacity", "1");
    await expect(stages.last()).toHaveCSS("opacity", "1");
  });
});
