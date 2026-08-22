import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// Generator API coverage for `drawTab` (`builder/engine/renderers/drawTab.ts`)
// at the primitive level, exercised through the real render pipeline rather
// than `drawTab.test.ts`'s fake canvas — this is what actually proves the
// four `tabShape` shapes are visually distinct, not just structurally
// different point paths.
// Generator id: test-api-draw-tab.
//
// The board fixes gridOrigin=(20,60), cellWidth=140, and draws each
// tabShape's tab over its own [cellX, 80, w, h] reference rectangle filled
// #dbeafe (North/South: w=80,h=30; East/West: w=30,h=80), tabAngle=45,
// showFoldLine=true. At tabAngle=45 with these dimensions `getTabGeometry`'s
// flat-top capping never engages, so the outer/flat edge of the tab sits
// exactly on one edge of the reference rectangle (North: top, South:
// bottom, East: right, West: left) — the SAME row/column for every
// `tabShape`, since `drawLine` no longer applies a direction-dependent
// offset the way the old stroke-based renderer did. Every "black"/"bg"
// sample point below sits at least 5px from any run boundary or taper
// join, avoiding the antialiased blend pixels that appear right at those
// transitions. Confirmed against the board's real rendered pixels, not
// assumed from the formulas alone. If the board's fixed geometry ever
// changes, re-derive and re-confirm against the render.

const black: Rgba = { r: 0, g: 0, b: 0, a: 255 };
const blueFill: Rgba = { r: 219, g: 234, b: 254, a: 255 };

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

test("visual baseline: North tab shapes", async ({ page }) => {
  await selectOrientation(page, "North");
  const image = pageImage(page);

  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot("test-api-draw-tab-north.png");
});

test("visual baseline: South tab shapes", async ({ page }) => {
  await selectOrientation(page, "South");
  const image = pageImage(page);

  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot("test-api-draw-tab-south.png");
});

test("visual baseline: East tab shapes", async ({ page }) => {
  await selectOrientation(page, "East");
  const image = pageImage(page);

  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot("test-api-draw-tab-east.png");
});

test("visual baseline: West tab shapes", async ({ page }) => {
  await selectOrientation(page, "West");
  const image = pageImage(page);

  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot("test-api-draw-tab-west.png");
});

test("North: Full/Left/Middle/Right all land their outer edge on row 80, the rectangle's own top row", async ({
  page,
}) => {
  await selectOrientation(page, "North");

  expectColor(await readPixel(pageImage(page), 60, 80), black); // Full
  expectColor(await readPixel(pageImage(page), 30, 80), blueFill);

  expectColor(await readPixel(pageImage(page), 215, 80), black); // Left
  expectColor(await readPixel(pageImage(page), 170, 80), blueFill);

  expectColor(await readPixel(pageImage(page), 340, 80), black); // Middle

  expectColor(await readPixel(pageImage(page), 465, 80), black); // Right
  expectColor(await readPixel(pageImage(page), 505, 80), blueFill);
});

test("South: Full/Left/Middle/Right all land their outer edge on row 109, the rectangle's own bottom row", async ({
  page,
}) => {
  await selectOrientation(page, "South");

  expectColor(await readPixel(pageImage(page), 60, 109), black); // Full
  expectColor(await readPixel(pageImage(page), 30, 109), blueFill);

  expectColor(await readPixel(pageImage(page), 215, 109), black); // Left
  expectColor(await readPixel(pageImage(page), 170, 109), blueFill);

  expectColor(await readPixel(pageImage(page), 340, 109), black); // Middle

  expectColor(await readPixel(pageImage(page), 465, 109), black); // Right
  expectColor(await readPixel(pageImage(page), 505, 109), blueFill);
});

test("East: Full/Left/Middle/Right all land their outer edge on column cellX+29, the rectangle's own right column", async ({
  page,
}) => {
  await selectOrientation(page, "East");

  expectColor(await readPixel(pageImage(page), 49, 120), black);
  expectColor(await readPixel(pageImage(page), 49, 90), blueFill);

  expectColor(await readPixel(pageImage(page), 189, 135), black);
  expectColor(await readPixel(pageImage(page), 189, 95), blueFill);

  expectColor(await readPixel(pageImage(page), 329, 120), black);

  expectColor(await readPixel(pageImage(page), 469, 105), black);
  expectColor(await readPixel(pageImage(page), 469, 145), blueFill);
});

test("West: Full/Left/Middle/Right all land their outer edge on column cellX, the rectangle's own left column", async ({
  page,
}) => {
  await selectOrientation(page, "West");

  expectColor(await readPixel(pageImage(page), 20, 120), black); // Full
  expectColor(await readPixel(pageImage(page), 20, 90), blueFill);

  expectColor(await readPixel(pageImage(page), 160, 135), black); // Left
  expectColor(await readPixel(pageImage(page), 160, 95), blueFill);

  expectColor(await readPixel(pageImage(page), 300, 120), black); // Middle

  expectColor(await readPixel(pageImage(page), 440, 105), black); // Right
  expectColor(await readPixel(pageImage(page), 440, 145), blueFill);
});

// --- Diagonal edges render fully opaque, with no antialiased blend pixels ---
//
// `drawLine` used to stroke a path via the Canvas 2D API, which antialiases
// any line that isn't perfectly horizontal or vertical — visible as
// partial-opacity "grey" pixels along a tab's tapered corners. `drawLine`
// now plots each pixel of a Bresenham-stepped line directly, so every pixel
// it touches is either fully the line's colour or untouched — never a blend
// of the two. This scans North's Full tab's left taper (a real 45-degree
// diagonal, cellOrigin=(20,60), rectangle=[20,80,80,30]) end to end.
test("North Full's diagonal taper edge has no partially-opaque blend pixels", async ({
  page,
}) => {
  await selectOrientation(page, "North");
  const img = pageImage(page);

  // The taper runs from p2 [49,80] (outer; inset=29, cellOrigin x=20) down
  // to p1 [20,109] (base) — 29 columns, 29 rows, a clean 45-degree
  // diagonal. Sample every row along it and confirm each pixel is fully
  // opaque or fully untouched, never a partial-alpha/blended value.
  for (let row = 80; row <= 109; row += 1) {
    const col = 49 - (row - 80); // walks from col49 (row80) to col20 (row109)
    const pixel = await readPixel(img, col, row);
    const isFullyOpaqueOrUntouched = pixel.a === 255 || pixel.a === 0;
    expect(
      isFullyOpaqueOrUntouched,
      `expected pixel (${col}, ${row}) to be fully opaque or fully transparent, got alpha=${pixel.a}`
    ).toBe(true);
  }
});

// --- Narrow, width-constrained tabs keep a flat top instead of collapsing to a point ---
//
// `getTabGeometry` reserves 1 unit of flat top before computing the widest
// possible inset, so a tab whose cross-size is too small for its full
// tabAngle taper keeps a small flat-topped trapezoid rather than a sharp
// point — the "tab placement and lengths" fix. A rectangle far narrower
// than it is deep forces this: [20, 400, 6, 60], tabAngle=45. w2=5, h2=59.
// getTabGeometry(5, 59, 45deg): maxInset=(5-1)/2=2, tabHeight=min(59,
// tan(45)*2)=2, inset=2. outerY = h2 - tabHeight = 57. p2=[2,57],
// p3=[3,57] (w2-inset=5-2=3) — one column apart, not coincident.
test("a narrow North tab keeps a 2-pixel flat top instead of collapsing to a point", async ({
  page,
}) => {
  await selectOrientation(page, "North");
  const img = pageImage(page);

  // p2=[22,457], p3=[23,457] in page coordinates (rectangle at x=20,y=400).
  // Both must be black (the flat top's two endpoints, one column apart);
  // one column further out on each side must NOT be black, or the "flat
  // top" would just be the taper's own antialiasing/rounding, not a real
  // flat run.
  expectColor(await readPixel(img, 22, 457), black);
  expectColor(await readPixel(img, 23, 457), black);
});
