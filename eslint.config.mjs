import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"

export default tseslint.config(
  {
    // preview/ is a self-contained dev-only Vite app with its own
    // package.json, tsconfig, and lint concerns (it isn't part of the
    // published component source); exclude it here rather than fold its
    // build output and dependencies into the component library's lint run.
    ignores: ["**/node_modules/**", "preview/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Design-system rule (CONTRIBUTING.md): named exports only.
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportDefaultDeclaration",
          message: "Use a named export instead of a default export (see CONTRIBUTING.md).",
        },
      ],

      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/ban-ts-comment": "error",
      "no-unused-vars": "off",
    },
  },
  {
    // Build-tool config files: a default export is the contract these
    // tools expect, not a design-system violation.
    files: ["**/*.config.{ts,mts,cts}"],
    rules: {
      "no-restricted-syntax": "off",
    },
  }
)
