import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["components/ui/**"],
  },
  ...nextVitals,
  ...nextTs,
  ...ts.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "quotes": ["warn", "single"],
      "jsx-quotes": ["warn", "prefer-double"],
      "semi": ["warn", "always"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
]);