import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "reports/**", "coverage/**", "node_modules/**", "playwright-report/**", "test-results/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: { ...globals.browser, __VERSAO__: "readonly", __SHA__: "readonly" } },
  },
  {
    files: ["scripts/**/*.mjs", "tests/**/*.js", "*.config.js"],
    languageOptions: { globals: { ...globals.node } },
  },
];
