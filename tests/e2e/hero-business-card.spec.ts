import { expect, test } from "@playwright/test";

test.describe("hero business card", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("flips between its front and back with the keyboard", async ({
    page,
  }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch business card/i,
    });

    await expect(card).toHaveAttribute("data-side", "front");
    await card.focus();
    await card.press("Enter");
    await expect(card).toHaveAttribute("data-side", "back");
    await expect(card).toHaveAttribute("aria-pressed", "true");

    await card.press("Space");
    await expect(card).toHaveAttribute("data-side", "front");
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("disables idle rotation when reduced motion is requested", async ({
    page,
  }) => {
    expect(
      await page.evaluate(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ),
    ).toBe(true);

    const card = page.getByRole("button", {
      name: /Design Hutch business card/i,
    });

    await expect(card).toHaveAttribute("data-auto-rotate", "false");
    await expect(card).toHaveAttribute("data-side", "front");
  });
});
