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

          nextjs-portal {
            display: none !important;
          }

          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        `;
        document.head.appendChild(style);
      },
      { once: true },
    );
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
}

export async function revealPageContent(page: Page) {
  await page.evaluate(async () => {
    const wait = (duration: number) =>
      new Promise((resolve) => window.setTimeout(resolve, duration));
    const step = Math.max(Math.round(window.innerHeight * 0.75), 600);
    const maxScroll = document.documentElement.scrollHeight;

    for (let y = 0; y <= maxScroll; y += step) {
      window.scrollTo(0, y);
      await wait(120);
    }

    window.scrollTo(0, 0);
    await wait(120);
  });
}
