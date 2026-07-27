import { expect, test } from "@playwright/test";

test.describe("hero business card", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByTestId("hero-card-flip-cue")).toContainText("Flip");
  });

  test("flips between its front and back with the keyboard", async ({
    page,
  }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
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

  test("flips between its front and back when clicked", async ({ page }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });

    await card.click();
    await expect(card).toHaveAttribute("data-side", "back");
    await expect(card).toHaveAttribute("aria-pressed", "true");

    await card.click();
    await expect(card).toHaveAttribute("data-side", "front");
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("tracks a horizontal drag and snaps to the nearest face", async ({
    page,
  }) => {
    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });
    const bounds = await card.boundingBox();

    expect(bounds).not.toBeNull();
    if (!bounds) {
      return;
    }

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    for (let step = 1; step <= 8; step += 1) {
      await page.mouse.move(centerX - step * 40, centerY);
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await expect(card).toHaveAttribute("data-side", "back");

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    for (let step = 1; step <= 8; step += 1) {
      await page.mouse.move(centerX + step * 40, centerY);
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await expect(card).toHaveAttribute("data-side", "front");
  });

  test("does not auto-turn while idle", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload();
    await page.waitForLoadState("networkidle");

    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });
    await expect(card).toHaveAttribute("data-auto-rotate", "false");
    await page.waitForTimeout(4_250);
    await expect(card).toHaveAttribute("data-side", "front");
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
      name: /Design Hutch card/i,
    });

    await expect(card).toHaveAttribute("data-auto-rotate", "false");
    await expect(card).toHaveAttribute("data-side", "front");
    await page.waitForTimeout(4_250);
    await expect(card).toHaveAttribute("data-side", "front");
  });
});
