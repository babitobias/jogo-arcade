import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.js", "tests/integration/**/*.test.js"],
    coverage: {
      provider: "v8",
      include: ["src/core/**/*.js"],
      reporter: ["text", "lcov"],
      reportsDirectory: "reports/coverage",
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
