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

- Delete the orphaned duplicate `customTextureVersion`/`textureVersions` pair
  at the top level of `_common/` — **only if it's still there**; it's expected
  to be removed as part of the Banner & Shield `makeCustomTextureVersion()`
  factory work (see the migration plan in the vault), so check that first.

  - Files: `src/generators/_common/customTextureVersion.ts` +
    `.test.ts`, and `src/generators/_common/textureVersions.ts` + `.test.ts`.
  - Context: confirmed 2026-07-26 to have **zero production importers** —
    only their own test files reference them. Left behind when PR #31's
    rebuild (`2687f0e`) added the real, live sibling at
    `src/generators/_common/textures/customTextureVersion.ts` (the one
    `minecraftBlock`/`minecraftItem`/`minecraftDiorama` actually import) without
    deleting the original top-level singleton it superseded.
  - Before deleting, re-confirm with a fresh grep for real importers (not just
    the two known test files) in case something changed since.

- Investigate a proper long-term Playwright screenshot tolerance solution.
  - Context: `playwright.config.ts`'s `threshold`/`maxDiffPixelRatio` now split
    on `process.env.CI` — 0 locally (macOS dev matches the macOS-captured
    baselines exactly), the existing 0.2/0.03 in CI (absorbs macOS-vs-Linux
    Chromium rendering drift, see the file's own comment for the two measured
    noise flavours). This was a quick fix, not a designed solution.
  - Why it matters: at the old blanket 0.2/0.03 tolerance, a real ~1%
    pixel-diff regression (a 1px fold-line border-offset bug found while
    porting `_common/cuboidFolds.ts` on a separate branch) passed silently
    for a full session before being caught by manual inspection, not by CI.
    The tolerance was wide enough to hide a real defect.
  - Also found and fixed while investigating: switching local runs to zero
    tolerance surfaced 39 stale screenshot baselines across 16 generators
    (Armor, Block, Cat Character, Character, Character Heads, Character Mini,
    Creeper Character, Enderman Character, Golem Character, Horse, Item, Pig,
    Pig Character, Squid Character, Ultimate Bendable, Villager Character,
    Wolf Character) — all deterministic, all traced to the same root cause: a
    CSS `hover:border-blue-500` highlight on the region overlay div a test
    clicks right before its final screenshot (Playwright's virtual cursor
    stays on it), whose on-page position depends on `containerWidth` from
    `useElementWidthListener`. That hook's `window.resize`-listener
    implementation was replaced by a `ResizeObserver` on the image element
    (landed in the V1-removal squash-merge, 2026-07-26) to fix a real bug —
    the old approach could measure width before the page image finished
    decoding/laying out — but none of these baselines were regenerated
    against the fix before now. Confirmed via diff images (thin border
    outline only, nothing else differs) and via git blame (every affected
    baseline predates or was carried unregenerated through that commit).
    Regenerated all 39 in this PR.
  - Options to evaluate:
    - keep the CI/local split, but audit whether 0 locally is safe long-term
      (e.g. could local macOS/Chromium point-updates reintroduce Δ1 noise the
      old blanket tolerance was absorbing for _local_ runs too, not just CI)
    - regenerate all baselines on Linux (e.g. matching Playwright Docker
      image) so CI and local dev share one rendering environment and a single
      strict tolerance works everywhere, per the alternative already noted in
      `playwright.config.ts`'s comment
    - consider whether tests should move the mouse away (or otherwise reset
      hover state) before a final screenshot, so a region's hover style is
      never incidentally part of what's being asserted on — would prevent
      this specific staleness pattern from recurring for unrelated reasons
