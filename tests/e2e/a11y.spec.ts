import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { prepareDeterministicPage } from "./utils";

test.describe("marketing accessibility", () => {
  for (const route of [
    "/",
    "/services",
    "/portfolio",
    "/process",
    "/faq",
    "/about",
    "/contact",
  ]) {
    test(`${route} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await prepareDeterministicPage(page);
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page }).analyze();
      const highImpactViolations = results.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );

      expect(
        highImpactViolations,
        highImpactViolations
          .map((violation) => `${violation.id}: ${violation.help}`)
          .join("\n"),
      ).toHaveLength(0);
    });
  }
});
