import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.TNC_PLAYWRIGHT_BASE_URL ?? "http://localhost:3100";
const productionMode = process.env.TNC_PLAYWRIGHT_MODE === "production";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: "line",
  use: {
    baseURL,
    trace: "retain-on-failure",
    ...devices["Pixel 7"],
  },
  webServer: {
    command: productionMode
      ? "pnpm exec next start -p 3100"
      : "pnpm exec next dev -p 3100",
    url: baseURL,
    reuseExistingServer: !productionMode,
    timeout: 120_000,
  },
});
