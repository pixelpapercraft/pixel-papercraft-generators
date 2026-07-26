# TODO

## Active Tasks

- Work through the generators-only security upgrade plan one package change at a time.
  - Plan: `docs/plans/2026-04-18-generators-only-security-upgrades.md`
  - Order: `jimp` and its transitive chain

## Follow-up Tasks

- Resolve the remaining `jimp@1.6.0` -> `file-type@16.5.4` vulnerability path.

  - Context: the `jimp` v0 -> v1 migration is complete, but `npm audit` still reports `file-type` through the current upstream `jimp` release.
  - Options to evaluate:
    - wait for an upstream `jimp` release that moves off the vulnerable `file-type` line
    - test a scoped `overrides.file-type` approach with targeted texture-generation verification
    - replace `jimp` in `src/tools/makeTextures/` if the upstream path remains blocked

- Evaluate a separate `tailwindcss` upgrade track.
  - Current repo state: `tailwindcss@3.4.15`
  - Latest upstream checked: `tailwindcss@4.1.12`
  - Why this matters: the removed `diff` advisory was not from Tailwind itself, but from Tailwind's transitive config-loader path on the v3 line:
    - `tailwindcss@3.4.15` -> `postcss-load-config@4.0.2` -> optional peer `ts-node` -> `diff`
  - What we changed for the narrow security fix:
    - replaced the repo's direct `ts-node` usage with `tsx` for `npm run makeTextures`
    - added an `overrides.postcss-load-config` entry so Tailwind resolves `postcss-load-config@6.0.1`
    - confirmed the installed path changed to `tailwindcss` -> `postcss-load-config@6.0.1` -> optional peer `tsx`
    - confirmed `npm audit` no longer reports `diff`
  - Why this is separate work:
    - Tailwind v4 is a major upgrade with setup and configuration changes, not a small dependency bump
    - the `diff` problem is already resolved without needing a Tailwind migration
  - Suggested starting point next time:
    - create a dedicated plan file for `tailwindcss` v3 -> v4
    - review Tailwind v4 upgrade notes and required PostCSS/config changes
    - verify compatibility with:
      - `postcss.config.js`
      - `tailwind.config.ts`
      - `@tailwindcss/typography`
      - Next.js build and styling output
