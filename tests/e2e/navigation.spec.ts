import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("primary navigation", () => {
  test.skip(({ isMobile }) => isMobile, "Primary navigation is desktop-only.");

  test("updates the active underline as sections enter view", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    for (const sectionId of [
      "services",
      "portfolio",
      "process",
      "faq",
      "about",
      "contact",
    ]) {
      await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
      await page.evaluate((id) => {
        const section = document.getElementById(id);
        if (!section) {
          return;
        }

        window.scrollTo({
          top: section.offsetTop - 96,
          behavior: "instant",
        });
        window.dispatchEvent(new Event("scroll"));
      }, sectionId);

      await expect(
        page.locator(`nav[aria-label="Primary"] a[href="#${sectionId}"]`),
      ).toHaveClass(/after:scale-x-100/);
    }
  });
});
