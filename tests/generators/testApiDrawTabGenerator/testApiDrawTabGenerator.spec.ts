import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Generator API coverage for `drawTab` (`builder/engine/renderers/drawTab.ts`)
// at the primitive level, exercised through the real render pipeline rather
// than `drawTab.test.ts`'s fake canvas — this is what actually proves the
// four `tabType` shapes are visually distinct, not just structurally
// different point paths.
// Generator id: test-api-draw-tab.
//
// The board fixes gridOrigin=(20,60), cellWidth=140, and draws each
// tabType's tab over its own [cellX, 80, w, h] reference rectangle filled
// #dbeafe (North/South: w=80,h=30; East/West: w=30,h=80), tabAngle=45,
// showFoldLine=true. At tabAngle=45 with these dimensions `inset` isn't
// width-capped, so the outer/flat edge of the tab sits exactly on one edge
// of the reference rectangle (North: top, South: bottom, East: right,
// West: left) — but exactly which pixel row/column it lands on, and
// whether the background just outside the flat run reads as the rectangle's
// blue fill or the page's white, depends on `drawLine`'s crispness offset
// (shifts a line by one row/column depending on which direction it's drawn)
// and on whether that offset row/column falls inside or outside the
// rectangle's own bounds. Both were confirmed against the board's real
// rendered pixels, not assumed from the formulas alone — this repo has been
// burned by exactly that gap before (see `todo.md`'s `cuboidTabs.ts`
// Playwright-coverage entry). Every "black"/"bg" sample point below sits at
// least 5px from any run boundary or taper join, avoiding the antialiased
// blend pixels that appear right at those transitions. If the board's fixed
// geometry ever changes, re-derive and re-confirm against the render.

const black: Rgba = { r: 0, g: 0, b: 0, a: 255 };
const blueFill: Rgba = { r: 219, g: 234, b: 254, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };

const pageImage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

function expectColor(actual: Rgba, expected: Rgba) {
  expect(actual).toEqual(expected);
}

async function selectOrientation(
  page: Page,
  orientation: "North" | "South" | "East" | "West"
) {
  await page.goto("/generator/test-api-draw-tab");
  await page.getByLabel("Orientation").selectOption(orientation);
}

test("North: Regular/Left/Middle/Right render distinct outer-edge spans", async ({
  page,
}) => {
  await selectOrientation(page, "North");

  // Regular: row 80 (the rectangle's own top row, inside its blue fill).
  expectColor(await readPixel(pageImage(page), 60, 80), black);
  expectColor(await readPixel(pageImage(page), 30, 80), blueFill);

  // Left/Middle/Right: row 79 (one row above the rectangle, outside its
  // fill — `drawLine`'s crispness offset for a leftward line).
  expectColor(await readPixel(pageImage(page), 215, 79), black);
  expectColor(await readPixel(pageImage(page), 170, 79), white);

  expectColor(await readPixel(pageImage(page), 340, 79), black);

  expectColor(await readPixel(pageImage(page), 465, 79), black);
  expectColor(await readPixel(pageImage(page), 505, 79), white);
});

test("South: Regular/Left/Middle/Right render distinct outer-edge spans", async ({
  page,
}) => {
  await selectOrientation(page, "South");

  // Regular/Left/Middle: row 109 (the rectangle's own bottom row, inside).
  expectColor(await readPixel(pageImage(page), 60, 109), black);
  expectColor(await readPixel(pageImage(page), 30, 109), blueFill);

  expectColor(await readPixel(pageImage(page), 215, 109), black);
  expectColor(await readPixel(pageImage(page), 170, 109), blueFill);

  expectColor(await readPixel(pageImage(page), 340, 109), black);

  // Right: row 110 (one row below the rectangle, outside its fill —
  // `drawLine`'s crispness offset for a rightward line here differs from
  // Regular/Left/Middle's leftward flat segment).
  expectColor(await readPixel(pageImage(page), 465, 110), black);
  expectColor(await readPixel(pageImage(page), 505, 110), white);
});

test("East: Regular/Left/Middle/Right render distinct outer-edge spans", async ({
  page,
}) => {
  await selectOrientation(page, "East");

  // All four land on the same column (cellX+29, inside the rectangle's
  // fill) — East's flat segment is drawn upward for every tabType.
  expectColor(await readPixel(pageImage(page), 49, 120), black);
  expectColor(await readPixel(pageImage(page), 49, 90), blueFill);

  expectColor(await readPixel(pageImage(page), 189, 135), black);
  expectColor(await readPixel(pageImage(page), 189, 95), blueFill);

  expectColor(await readPixel(pageImage(page), 329, 120), black);

  expectColor(await readPixel(pageImage(page), 469, 105), black);
  expectColor(await readPixel(pageImage(page), 469, 145), blueFill);
});

test("West: Regular/Left/Middle/Right render distinct outer-edge spans", async ({
  page,
}) => {
  await selectOrientation(page, "West");

  // Regular/Right: column cellX (inside the rectangle's fill).
  expectColor(await readPixel(pageImage(page), 20, 120), black);
  expectColor(await readPixel(pageImage(page), 20, 90), blueFill);

  // Left/Middle: column cellX-1 (one column left of the rectangle, outside
  // its fill entirely).
  expectColor(await readPixel(pageImage(page), 159, 135), black);
  expectColor(await readPixel(pageImage(page), 159, 95), white);

  expectColor(await readPixel(pageImage(page), 299, 120), black);

  expectColor(await readPixel(pageImage(page), 440, 105), black);
  expectColor(await readPixel(pageImage(page), 440, 145), blueFill);
});
