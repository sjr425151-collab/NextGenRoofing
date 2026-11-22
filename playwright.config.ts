import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: 3,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
    env: { ALLOW_DEMO_PRICING: "true", LEAD_SINKS: "file", LEAD_FILE_DIR: "./data/e2e", LEAD_RATE_LIMIT: "1000", NEXT_TELEMETRY_DISABLED: "1" },
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] }, testMatch: /(flows|mobile)\.spec\.ts/ },
  ],
});
