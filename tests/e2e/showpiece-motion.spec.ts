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
});
