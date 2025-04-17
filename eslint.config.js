import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // JavaScript 기본 룰
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    ignores: ["src/main.original.js"],
  },
  // 브라우저 환경 전역 변수 허용
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  // Prettier 연동: 포맷팅 오류를 ESLint로 잡기
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "warn",
      "prefer-const": "warn",
    },
  },
  // TypeScript 기본 룰
  tseslint.configs.recommended,
  // React 기본 룰
  pluginReact.configs.flat.recommended,
  // Prettier 룰
  prettierConfig,
]);
