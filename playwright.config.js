import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30000,
  retries: BASE_URL ? 2 : 0,
  reporter: [["list"], ["junit", { outputFile: "reports/e2e-junit.xml" }]],
  use: { baseURL: BASE_URL || "http://127.0.0.1:4173/", headless: true },
  webServer: BASE_URL
    ? undefined
    : { command: "node scripts/serve.mjs dist 4173", url: "http://127.0.0.1:4173/", reuseExistingServer: true },
});
