import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  oxc: {
    jsx: {
      runtime: "automatic",
    },
  },
  test: {
    // `scripts/` holds the repo gates themselves; `check-imports.mjs` carries
    // a boundary check whose only failure mode is going vacuous, so its test
    // needs to run in CI alongside the rest.
    include: ["src/**/*.{test,spec}.{ts,tsx}", "scripts/**/*.test.mjs"],
  },
  resolve: {
    alias: {
      "@genroot": path.resolve(rootDir, "src"),
    },
  },
});
