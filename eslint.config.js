import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  { ignores: [".DS_Store", "node_modules", "/build", "/.svelte-kit", "/package", ".env", ".env.*", "!.env.example", "pnpm-lock.yaml", "package-lock.json", "yarn.lock"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
