import type { projects as portfolioProjects } from "../../content/portfolio";

// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node executes this TypeScript test as CommonJS.
const assert: typeof import("node:assert/strict") = require("node:assert/strict");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node executes this TypeScript test as CommonJS.
const test: typeof import("node:test") = require("node:test");
// eslint-disable-next-line @typescript-eslint/no-require-imports -- Node executes this TypeScript test as CommonJS.
const { projects } = require("../../content/portfolio.ts") as {
  projects: typeof portfolioProjects;
};

test("every portfolio project contains a complete featured proof", () => {
  assert.ok(projects.length > 0);
  assert.deepEqual(
    projects.map((project) => ({
      id: project.id,
      eyebrow: project.eyebrow,
      headline: project.proofHeadline,
      metricCount: project.proofMetrics.length,
      quoteLines: project.featuredQuoteLines.length,
      desktop: project.proofImages.desktop.src,
      mobile: project.proofImages.mobile.src,
    })),
    [
      {
        id: "double-double-good",
        eyebrow: "Independent music emporium · Stafford",
        headline:
          "A clearer, faster website for a much-loved independent record shop.",
        metricCount: 3,
        quoteLines: 2,
        desktop: "/portfolio/doubledoublegood/desktop-home.webp",
        mobile: "/portfolio/doubledoublegood/mobile-home.webp",
      },
    ],
  );
});
