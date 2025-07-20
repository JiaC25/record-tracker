import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

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
      "quotes" : ["warn", "single"], // Enforce single quotes for strings,
      "@typescript-eslint/no-explicit-any": "off", // Allow explicit 'any' type
      "@/indent": ["warn", 2],
      "semi": ["warn", "never"],
    }
  },
  {
    ignores: ["components/ui/**"] // Ignore components from shadcn/ui
  }
];

export default eslintConfig;
