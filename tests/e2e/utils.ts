import type { Page } from "@playwright/test";

export async function prepareDeterministicPage(page: Page) {
  await page.addInitScript(() => {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        const style = document.createElement("style");
        style.innerHTML = `
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        `;
        document.head.appendChild(style);
      },
      { once: true },
    );
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
}
