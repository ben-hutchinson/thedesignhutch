import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("marketing visual regression", () => {
  test("home page full snapshot", async ({ page }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
    });
  });

  test("contact section snapshot", async ({ page }) => {
    await prepareDeterministicPage(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const contactSection = page.locator("#contact");
    await contactSection.scrollIntoViewIfNeeded();

    await expect(contactSection).toHaveScreenshot("contact-section.png");
  });
});
