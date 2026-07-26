import { defineConfig } from "@playwright/test";

/**
 * Cross-platform screenshot tolerance.
 *
 * The committed snapshot baselines are generated on macOS, but CI renders them
 * on Linux (ubuntu-latest). The snapshot path template has no {platform} token,
 * so a single baseline file has to satisfy both operating systems. With a strict
 * `threshold: 0` this fails, because macOS and Linux Chromium do not produce
 * byte-identical output — their Skia/canvas pipelines round sub-pixel colour
 * values differently.
 *
 * We measured the drift against the images CI actually rendered on Linux, and it
 * comes in two distinct flavours:
 *
 *   1. Large canvas page renders (the character generators, ~595x842). Hundreds
 *      to thousands of pixels differ, but every one is off by exactly 1 out of
 *      255 — the maximum delta seen anywhere is 1 — and the alpha channel is
 *      byte-identical, so geometry and compositing are pixel-perfect. Pure
 *      anti-aliasing/colour rounding. Example: the axolotl page differed on 244
 *      of 501,190 pixels (0.05%), all Δ1, scattered across 61 rows.
 *
 *   2. Small upscaled texture previews (the block tinted/rotated previews,
 *      148x168). Mostly identical, but a few dozen edge pixels differ by a lot —
 *      up to ~136 out of 255 — because scaling hard-edged pixel art lands its
 *      anti-aliased edges slightly differently across platforms. Example: the
 *      block previews differ on ~363 pixels, ~148 of which are large enough to
 *      still count under a 0.2 threshold (~0.6% of the image).
 *
 * For contrast, a genuinely different render (e.g. one generator's page compared
 * against another's) differs on 15-45% of pixels with per-pixel deltas up to the
 * full 255 — orders of magnitude beyond either flavour of noise above.
 *
 * Both knobs below are therefore load-bearing, each covering one flavour:
 * `threshold` absorbs flavour 1 outright, and `maxDiffPixelRatio` catches
 * flavour 2's handful of large-delta edge pixels. Real regressions still fail
 * comfortably under both. If you ever need pixel-exact matching back, the
 * alternative is to regenerate the baselines on Linux (e.g. via the matching
 * Playwright Docker image) so local dev and CI share one rendering environment.
 *
 * Local runs are pixel-exact (threshold/ratio 0) rather than reusing the CI
 * tolerance: local dev and the baselines are both macOS, so there's no
 * cross-platform noise to absorb, and a strict local comparison catches real
 * regressions (e.g. a 1px geometry shift) immediately instead of letting them
 * hide under a 3%-of-image allowance. See todo.md for the follow-up on
 * whether this split is the right long-term shape.
 */
const IS_CI = Boolean(process.env.CI);
const SCREENSHOT_THRESHOLD = IS_CI ? 0.2 : 0; // per-pixel YIQ tolerance, 0..1; 0.2 (Playwright's default) absorbs the Δ1 rounding of flavour 1 on CI's Linux renderer
const SCREENSHOT_MAX_DIFF_PIXEL_RATIO = IS_CI ? 0.03 : 0; // image fraction over threshold allowed, 0..1; 3% clears flavour 2's ~0.6% edge drift on CI, well under a real regression (>=15%)

export default defineConfig({
  testDir: "./tests/generators",
  testMatch: "**/*.spec.ts",
  updateSnapshots: "none",
  reporter: [["list"], ["html", { open: "on-failure" }]],
  expect: {
    toHaveScreenshot: {
      threshold: SCREENSHOT_THRESHOLD,
      maxDiffPixelRatio: SCREENSHOT_MAX_DIFF_PIXEL_RATIO,
      pathTemplate: "{testDir}/{testFileDir}/snapshots/{arg}{ext}",
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        baseURL: "http://127.0.0.1:3001",
        viewport: { width: 1600, height: 1400 },
      },
    },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1",
    reuseExistingServer: true,
    timeout: 120000,
    url: "http://127.0.0.1:3001",
  },
});
