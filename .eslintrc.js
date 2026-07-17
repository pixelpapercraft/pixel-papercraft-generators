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
  overrides: [
    {
      // V2 generators have exactly one builder-facing surface:
      // `@genroot/builder/v2`, which exports GeneratorRenderer, GeneratorUI
      // and the shared types. `builder/ui` and `builder/modules` are v1's and
      // are being retired as generators migrate, so nothing under a *V2
      // directory may name them — including type-only imports, which is how
      // most of them leaked in the first place.
      //
      // Minecraft-specific controls are not in the V2 surface by design: they
      // are generator content, and live under `src/generators/_common/`.
      files: ["src/generators/*V2/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: [
                  "@genroot/builder/ui",
                  "@genroot/builder/ui/*",
                  "@genroot/builder/modules",
                  "@genroot/builder/modules/*",
                ],
                message:
                  "V2 generators import only from @genroot/builder/v2 (GeneratorRenderer, GeneratorUI, and the V2 types). builder/ui and builder/modules are v1's and are being retired. Minecraft-specific controls live in src/generators/_common/.",
              },
            ],
          },
        ],
      },
    },
  ],
};
