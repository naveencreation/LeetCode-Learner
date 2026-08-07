import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local temp/plugin clone content not part of app source:
    ".tmp-awesome-copilot/**",
    // Legacy static prototype scripts not part of the Next.js app runtime:
    "public/inorder-prototype/**",
    // One-off local script file:
    "fix.js",
  ]),
]);

export default eslintConfig;
