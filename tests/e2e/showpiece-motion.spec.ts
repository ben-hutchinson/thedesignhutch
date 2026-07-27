import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("selective showpiece motion", () => {
  test("portfolio proof assembles once when it enters view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const root = page.getByTestId("portfolio-proof-motion");
    const desktopProof = page.getByTestId("portfolio-desktop-proof");
    const mobileProof = page.getByTestId("portfolio-mobile-proof");

    await expect(root).toHaveAttribute("data-motion-state", "hidden");
    await expect(desktopProof).toHaveCSS("opacity", "0");
    await expect(mobileProof).toHaveCSS("opacity", "0");

    await root.scrollIntoViewIfNeeded();
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(desktopProof).toHaveCSS("opacity", "1");
    await expect(mobileProof).toHaveCSS("opacity", "1");
    await expect(page.getByTestId("portfolio-metric")).toHaveCount(3);
    await expect(page.getByTestId("portfolio-testimonial")).toHaveCSS(
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

    const root = page.getByTestId("portfolio-proof-motion");
    await expect(root).toHaveAttribute("data-motion-state", "visible");
    await expect(page.getByTestId("portfolio-desktop-proof")).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(page.getByTestId("portfolio-mobile-proof")).toHaveCSS(
      "opacity",
      "1",
    );
  });

  test("founder portrait develops and commitment arrows draw once", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const root = page.getByTestId("founder-reveal-motion");
    const portrait = page.getByTestId("founder-portrait-motion");
    const arrows = page.getByTestId("about-commitment-arrow");
    const arrowPath = arrows.first().locator("path");

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
    await expect(page.getByTestId("portfolio-proof-motion")).toBeAttached();
    await expect(page.getByTestId("founder-reveal-motion")).toBeAttached();
  });
});

test.describe("static showpiece fallback", () => {
  test.use({ javaScriptEnabled: false });

  test("proof and founder content stay visible without hydration", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByAltText(
        "Double Double Good website desktop homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByAltText(
        "Double Double Good website mobile homepage screenshot",
      ),
    ).toBeVisible();
    await expect(
      page.getByAltText("Ben Hutchinson, founder of The Design Hutch"),
    ).toBeVisible();
    await expect(
      page.getByText("It felt like my website", { exact: false }),
    ).toBeVisible();
  });
});
