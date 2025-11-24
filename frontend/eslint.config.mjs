import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
    "next/typescript"
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "quotes" : ["warn", "single"],
      "@typescript-eslint/no-explicit-any": "off",
      "@/indent": ["warn", 2],
      "semi": ["warn", "always"],
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    }
  },
  {
    ignores: ["components/ui/**"] // Ignore components from shadcn/ui
  }
];

export default eslintConfig;
