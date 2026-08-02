import { expect, test, type Page } from "@playwright/test";
import {
  readPixelColumn,
  readPixelRow,
  type Rgba,
} from "../_shared/pixelColor";

// Generator API coverage for `_common/cuboidFolds.ts` (drawCuboidFolds),
// exercised through the real render pipeline rather than the fake
// `RenderContext` `cuboidFolds.test.ts` uses — this catches anything that
// only shows up once pixels are actually rasterized (as the fractional-pixel
// blur bug on the real Banner & Shield net did), which a geometry-only unit
// test cannot.
// Generator id: test-api-cuboid-folds.
//
// The board fixes position = (100, 100) and dimensions (w, h, d) = (90, 60,
// 30). Expected coordinates below were derived from `drawCuboidFolds`'s own
// formulas, then confirmed against the board's real rendered pixels (not
// assumed) — `drawLine`'s crispness offset (`renderers/drawLine.ts`) paints a
// leftward horizontal or upward vertical 1px line one row/column earlier than
// its nominal endpoint, so `drawRectangleFolds`'s bottom edge renders at
// `y + h` (not `y + h + 1`, its nominal second endpoint) and its left edge at
// `x - 1` (not `x`); the top/right edges and every orientation's single
// "extra" seam line are all rightward/downward, so they render at their
// nominal coordinates with no shift. If the board's fixed position/dimensions
// ever change, re-derive and re-confirm these against the render, not just
// the formulas.

const foldGrey: Rgba = { r: 123, g: 123, b: 123, a: 255 };

const pageImage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

// A fold line is dashed fixed-grey #7b7b7b (`lineDash: [2,2]`). The board
// fills a white background first (matching the real generator), so a dash
// gap reads back as white/texture colour, not transparent — unlike the
// asset-free drawFoldLine primitive board, whose pages stay uncleared. So the
// contract checked here is "some grey dash pixels AND some non-grey pixels"
// rather than transparency, which is what actually distinguishes a dashed
// line from a solid one against an opaque background.
function isFoldGrey(p: Rgba): boolean {
  return (
    p.r === foldGrey.r &&
    p.g === foldGrey.g &&
    p.b === foldGrey.b &&
    p.a === 255
  );
}

function expectDashedFoldRun(pixels: Rgba[]) {
  const hasGreyDash = pixels.some(isFoldGrey);
  const hasGap = pixels.some((p) => !isFoldGrey(p));
  expect(hasGreyDash).toBe(true);
  expect(hasGap).toBe(true);
}

async function expectHorizontalFoldLine(
  page: Page,
  x: number,
  y: number,
  width: number
) {
  await expect
    .poll(async () => {
      const run = await readPixelRow(pageImage(page), x, y, width);
      return run.some(isFoldGrey);
    })
    .toBe(true);
  expectDashedFoldRun(await readPixelRow(pageImage(page), x, y, width));
}

async function expectVerticalFoldLine(
  page: Page,
  x: number,
  y: number,
  height: number
) {
  await expect
    .poll(async () => {
      const run = await readPixelColumn(pageImage(page), x, y, height);
      return run.some(isFoldGrey);
    })
    .toBe(true);
  expectDashedFoldRun(await readPixelColumn(pageImage(page), x, y, height));
}

async function selectOrientationAndCenter(
  page: Page,
  orientation: "West" | "East" | "North" | "South",
  center: "Front" | "Back" | "Top" | "Bottom" | "Left" | "Right" = "Front"
) {
  await page.goto("/generator/test-api-cuboid-folds");
  await page.getByLabel("Orientation").selectOption(orientation);
  await page.getByLabel("Center").selectOption(center);
}

// --- West (default orientation, default center) -----------------------------

test("West: border folds trace both rectangle groups and the back/left seam", async ({
  page,
}) => {
  await selectOrientationAndCenter(page, "West");

  // R1 = [130, 100, 90, 120] (the top face's border).
  await expectHorizontalFoldLine(page, 130, 99, 91);
  await expectVerticalFoldLine(page, 220, 100, 121);
  await expectHorizontalFoldLine(page, 130, 220, 91);
  await expectVerticalFoldLine(page, 129, 100, 121);

  // R2 = [100, 130, 240, 60] (the front/right/back/left band's border).
  await expectHorizontalFoldLine(page, 100, 129, 241);
  await expectVerticalFoldLine(page, 340, 130, 61);
  await expectHorizontalFoldLine(page, 100, 190, 241);
  await expectVerticalFoldLine(page, 99, 130, 61);

  // Extra seam line: back/left panel boundary.
  await expectVerticalFoldLine(page, 249, 130, 61);
});

// --- East --------------------------------------------------------------------

test("East: border folds trace both rectangle groups and the back/right seam", async ({
  page,
}) => {
  await selectOrientationAndCenter(page, "East");

  // R1 = [220, 100, 90, 120] (the top face's border).
  await expectHorizontalFoldLine(page, 220, 99, 91);
  await expectVerticalFoldLine(page, 310, 100, 121);
  await expectHorizontalFoldLine(page, 220, 220, 91);
  await expectVerticalFoldLine(page, 219, 100, 121);

  // R2 = [100, 130, 240, 60] (the front/left/back/right band's border).
  await expectHorizontalFoldLine(page, 100, 129, 241);
  await expectVerticalFoldLine(page, 340, 130, 61);
  await expectHorizontalFoldLine(page, 100, 190, 241);
  await expectVerticalFoldLine(page, 99, 130, 61);

  // Extra seam line: back/right panel boundary.
  await expectVerticalFoldLine(page, 190, 130, 61);
});

// --- North -------------------------------------------------------------------

test("North: border folds trace both rectangle groups and the bottom-face seam", async ({
  page,
}) => {
  await selectOrientationAndCenter(page, "North");

  // R1 = [130, 100, 90, 180] (top+back stack's border).
  await expectHorizontalFoldLine(page, 130, 99, 91);
  await expectVerticalFoldLine(page, 220, 100, 181);
  await expectHorizontalFoldLine(page, 130, 280, 91);
  await expectVerticalFoldLine(page, 129, 100, 181);

  // R2 = [100, 130, 150, 60] (the front/left/right band's border).
  await expectHorizontalFoldLine(page, 100, 129, 151);
  await expectVerticalFoldLine(page, 250, 130, 61);
  await expectHorizontalFoldLine(page, 100, 190, 151);
  await expectVerticalFoldLine(page, 99, 130, 61);

  // Extra seam line: bottom face's front boundary.
  await expectHorizontalFoldLine(page, 130, 219, 91);
});

// --- South -------------------------------------------------------------------

test("South: border folds trace both rectangle groups and the bottom-face seam", async ({
  page,
}) => {
  await selectOrientationAndCenter(page, "South");

  // R1 = [130, 100, 90, 180] (top+back stack's border) — same as North's.
  await expectHorizontalFoldLine(page, 130, 99, 91);
  await expectVerticalFoldLine(page, 220, 100, 181);
  await expectHorizontalFoldLine(page, 130, 280, 91);
  await expectVerticalFoldLine(page, 129, 100, 181);

  // R2 = [100, 190, 150, 60] (the front/left/right band's border, shifted
  // down relative to North's since South's seam is above the band).
  await expectHorizontalFoldLine(page, 100, 189, 151);
  await expectVerticalFoldLine(page, 250, 190, 61);
  await expectHorizontalFoldLine(page, 100, 250, 151);
  await expectVerticalFoldLine(page, 99, 190, 61);

  // Extra seam line: bottom face's back boundary.
  await expectHorizontalFoldLine(page, 130, 160, 91);
});

// --- Center adjustment (the banner crossbar's real North+Bottom config) -----

test("North + Bottom center: the h/d dimension swap shifts every fold line", async ({
  page,
}) => {
  await selectOrientationAndCenter(page, "North", "Bottom");

  // Center=Bottom swaps h and d before the North formulas run
  // (w'=90, h'=30, d'=60), moving every line versus plain North above.

  // R1 = [160, 100, 90, 180].
  await expectHorizontalFoldLine(page, 160, 99, 91);
  await expectVerticalFoldLine(page, 250, 100, 181);
  await expectHorizontalFoldLine(page, 160, 280, 91);
  await expectVerticalFoldLine(page, 159, 100, 181);

  // R2 = [100, 160, 210, 30].
  await expectHorizontalFoldLine(page, 100, 159, 211);
  await expectVerticalFoldLine(page, 310, 160, 31);
  await expectHorizontalFoldLine(page, 100, 190, 211);
  await expectVerticalFoldLine(page, 99, 160, 31);

  // Extra seam line, shifted from plain North's y=219 to y=249.
  await expectHorizontalFoldLine(page, 160, 249, 91);
});
