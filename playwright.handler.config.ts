import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/handlers",
  fullyParallel: false,
  workers: 1,
});
