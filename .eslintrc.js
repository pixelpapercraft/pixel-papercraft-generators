/* eslint-env node */
module.exports = {
  extends: [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  // The generator/framework boundary used to be a `no-restricted-imports`
  // override here. It now lives in `npm run check:imports`
  // (`scripts/check-imports.mjs`), which resolves each specifier to a real
  // path and rules on the file reached rather than on the text used to reach
  // it. That covers three things this rule structurally could not: `tests/`
  // (which `next lint` never lints), relative specifiers, and deep paths into
  // the barrel's own directory. See that script's header for the detail, and
  // `scripts/check-imports.boundary.test.mjs` for the test that keeps it from
  // going vacuous the way this rule once did.
};
