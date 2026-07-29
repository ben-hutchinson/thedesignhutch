import { expect, test, type Page } from "@playwright/test";

async function getVisibleYRotation(page: Page) {
  return page.getByTestId("hero-business-card").evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    const cosine = Math.min(1, Math.max(-1, matrix.m11));

    return Math.round((Math.acos(cosine) * 180) / Math.PI);
  });
}

async function createTouchController(page: Page) {
  const session = await page.context().newCDPSession(page);

  return {
    async dispatch(
      type: "touchStart" | "touchMove" | "touchEnd",
      x?: number,
      y?: number,
    ) {
      await session.send("Input.dispatchTouchEvent", {
        type,
        touchPoints:
          type === "touchEnd" || x === undefined || y === undefined
            ? []
            : [{ x, y }],
      });
    },
    async dispose() {
      await session.detach();
    },
  };
}

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

  test("keeps native vertical panning available on touch screens", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "requires touch emulation");

    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });

    await expect
      .poll(() =>
        card.evaluate((element) => getComputedStyle(element).touchAction),
      )
      .toBe("pan-y");
  });

  test("allows a vertical touch gesture on the card to scroll without flipping", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "requires touch emulation");

    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });
    const bounds = await card.boundingBox();

    expect(bounds).not.toBeNull();
    if (!bounds) return;

    const startX = bounds.x + bounds.width / 2;
    const startY = bounds.y + bounds.height / 2;
    const touch = await createTouchController(page);

    await touch.dispatch("touchStart", startX, startY);
    for (let step = 1; step <= 8; step += 1) {
      await touch.dispatch("touchMove", startX, startY - step * 24);
    }
    await touch.dispatch("touchEnd");
    await touch.dispose();

    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeGreaterThan(0);
    await expect(card).toHaveAttribute("data-side", "front");
    await expect(card).toHaveAttribute("aria-pressed", "false");
  });

  test("directly follows a horizontal touch gesture before snapping on release", async ({
    page,
  }, testInfo) => {
    test.skip(!testInfo.project.use.hasTouch, "requires touch emulation");

    const card = page.getByRole("button", {
      name: /Design Hutch card/i,
    });
    const bounds = await card.boundingBox();

    expect(bounds).not.toBeNull();
    if (!bounds) return;

    const startX = bounds.x + bounds.width / 2;
    const startY = bounds.y + bounds.height / 2;
    const touch = await createTouchController(page);

    await touch.dispatch("touchStart", startX, startY);
    await touch.dispatch("touchMove", startX - bounds.width * 0.25, startY);

    await expect.poll(() => getVisibleYRotation(page)).toBeGreaterThan(30);
    await expect.poll(() => getVisibleYRotation(page)).toBeLessThan(60);
    await expect(card).toHaveAttribute("data-side", "front");

    await touch.dispatch("touchMove", startX - bounds.width * 0.65, startY);
    await touch.dispatch("touchEnd");
    await touch.dispose();

    await expect(card).toHaveAttribute("data-side", "back");
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => getVisibleYRotation(page)).toBe(180);
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
    await page.mouse.move(centerX - bounds.width * 0.25, centerY);
    await expect.poll(() => getVisibleYRotation(page)).toBeGreaterThan(30);
    await expect.poll(() => getVisibleYRotation(page)).toBeLessThan(60);
    await page.mouse.move(centerX - bounds.width * 0.65, centerY);
    await page.mouse.up();
    await expect(card).toHaveAttribute("data-side", "back");

    await page.mouse.move(centerX, centerY);
    await page.mouse.down();
    await page.mouse.move(centerX + bounds.width * 0.25, centerY);
    await expect.poll(() => getVisibleYRotation(page)).toBeGreaterThan(120);
    await expect.poll(() => getVisibleYRotation(page)).toBeLessThan(150);
    await page.mouse.move(centerX + bounds.width * 0.65, centerY);
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
