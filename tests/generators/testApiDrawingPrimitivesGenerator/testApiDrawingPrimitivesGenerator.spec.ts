import { expect, test, type Page } from "@playwright/test";
import { readPixel, readPixelRow, type Rgba } from "../_shared/pixelColor";

// Generator API coverage: asset-free drawing primitives.
// Generator id: test-api-drawing-primitives.
// One page per method (see the generator script). Pages, in order:
//   0 Background     — fillBackgroundColorWithWhite (29)
//   1 FillRectangle  — fillRectangle (30)
//   2 DrawRectangle  — drawRectangle (31)
//   3 DrawLine       — drawLine (35)
//   4 FoldLine       — drawFoldLine (36)
//   5 DrawTab        — drawTab (37), all four orientations
//   6 DrawTabNoFold  — drawTab (37) with showFoldLine = false
//   7 DrawText       — drawText (38)
// Each test reads back exact pixels to pin one primitive's contract.
// See the generator-api test-coverage plan.

const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const black: Rgba = { r: 0, g: 0, b: 0, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };
// drawFoldLine's fixed colour, #7b7b7b.
const foldGrey: Rgba = { r: 123, g: 123, b: 123, a: 255 };
// An untouched canvas pixel (pages here paint no background unless the test's
// own method fills one), for "nothing painted here" assertions.
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

const pageImage = (page: Page) => page.getByTestId("generator-page-image");

// --- fillBackgroundColorWithWhite (29) -------------------------------------

test("fillBackgroundColorWithWhite turns untouched pixels white", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const background = pageImage(page).nth(0);

  // A pixel the script never drew on is white after the background fill, not
  // the default transparent.
  expect(await readPixel(background, 100, 100)).toEqual(white);
});

test("fillBackgroundColorWithWhite preserves content drawn before it", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const background = pageImage(page).nth(0);

  // The red mark was drawn BEFORE the fill; compositing existing content over
  // white keeps it, rather than painting white on top.
  expect(await readPixel(background, 30, 30)).toEqual(red);
});

// --- fillRectangle (30) -----------------------------------------------------

test("fillRectangle fills its interior with the given colour", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const fillRect = pageImage(page).nth(1);

  // Rectangle [10,10,40,40] fills cols 10..49, rows 10..49 solid blue.
  expect(await readPixel(fillRect, 30, 30)).toEqual(blue);
});

test("fillRectangle paints nothing outside its bounds", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const fillRect = pageImage(page).nth(1);

  // Just past the bottom edge (row 55, below rows 10..49) is untouched.
  expect(await readPixel(fillRect, 30, 55)).toEqual(transparent);
});

// --- drawRectangle (31) -----------------------------------------------------

test("drawRectangle strokes all four borders in default black", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const drawRect = pageImage(page).nth(2);

  // Rectangle [10,10,40,40]. drawRectangle draws four lines and drawLine's
  // 0.5px normal offset points a different way per line depending on its
  // direction, so the edges land at: top row 10, right col 50, bottom row 49
  // (offset up, drawn R->L), left col 9 (offset left, drawn bottom->top).
  // Sample the midpoint of each edge.
  expect(await readPixel(drawRect, 30, 10)).toEqual(black); // top
  expect(await readPixel(drawRect, 50, 30)).toEqual(black); // right
  expect(await readPixel(drawRect, 30, 49)).toEqual(black); // bottom
  expect(await readPixel(drawRect, 9, 30)).toEqual(black); // left
});

test("drawRectangle leaves its interior empty (outline, not fill)", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const drawRect = pageImage(page).nth(2);

  // The centre is untouched — this is what distinguishes drawRectangle from
  // fillRectangle.
  expect(await readPixel(drawRect, 30, 30)).toEqual(transparent);
});

// --- drawLine (35) ----------------------------------------------------------

test("drawLine draws opaque black horizontal and vertical lines by default", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const drawLinePage = pageImage(page).nth(3);

  // H line [10,20]->[60,20] lands on row 20; V line [80,10]->[80,60] on col 80.
  // drawLine's 0.5px normal offset makes H/V lines fully opaque and on-pixel.
  expect(await readPixel(drawLinePage, 30, 20)).toEqual(black);
  expect(await readPixel(drawLinePage, 80, 30)).toEqual(black);
});

test("drawLine keeps a default line one pixel wide", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const drawLinePage = pageImage(page).nth(3);

  // The default width-1 H line on row 20 must not bleed onto the rows either
  // side of it.
  expect(await readPixel(drawLinePage, 30, 19)).toEqual(transparent);
  expect(await readPixel(drawLinePage, 30, 21)).toEqual(transparent);
});

test("drawLine width option thickens the stroke onto neighbouring pixels", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const drawLinePage = pageImage(page).nth(3);

  // The width-3 H line [10,80]->[60,80] covers rows 79..81, so pixels off the
  // 1px centre line (rows 79 and 81) are now painted — unlike the default line.
  expect(await readPixel(drawLinePage, 30, 79)).toEqual(black);
  expect(await readPixel(drawLinePage, 30, 81)).toEqual(black);
});

// --- drawFoldLine (36) ------------------------------------------------------

test("drawFoldLine draws a dashed grey line — grey dashes with transparent gaps", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const foldLine = pageImage(page).nth(4);

  // Scan the whole fold-line run on row 30 (cols 10..90). A fold line is dashed
  // fixed-grey #7b7b7b, so the run must contain BOTH fully-opaque grey pixels
  // (dashes) AND fully-transparent pixels (gaps) — that is what makes it a fold
  // line rather than a solid drawLine.
  const run = await readPixelRow(foldLine, 10, 30, 80);

  const hasGreyDash = run.some(
    (p) =>
      p.r === foldGrey.r &&
      p.g === foldGrey.g &&
      p.b === foldGrey.b &&
      p.a === 255
  );
  const hasGap = run.some((p) => p.a === 0);

  expect(hasGreyDash).toBe(true);
  expect(hasGap).toBe(true);
});

// --- drawTab (37) -----------------------------------------------------------

test("drawTab draws a straight tab edge for each orientation (N/S/E/W)", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const tab = pageImage(page).nth(5);

  // Each orientation has one fully-opaque straight edge (the others antialias
  // as diagonals). Exact row/col reflects drawLine's direction-dependent 0.5px
  // offset — see the generator script for the geometry.
  expect(await readPixel(tab, 70, 50)).toEqual(black); // North: top edge, row 50
  expect(await readPixel(tab, 70, 109)).toEqual(black); // South: bottom edge, row 109
  expect(await readPixel(tab, 159, 70)).toEqual(black); // East: right edge, col 159
  expect(await readPixel(tab, 200, 70)).toEqual(black); // West: left edge, col 200
});

test("drawTab draws a grey fold line across the base by default", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const tab = pageImage(page).nth(5);

  // The North tab's base fold line runs along row 59 (drawn R->L, so offset up
  // from the rectangle's bottom at 60). As a fold line it is dashed grey, so the
  // run has both grey dashes and transparent gaps. Scan cols 55..85, where only
  // the fold line (not the diagonal edges) is present.
  const run = await readPixelRow(tab, 55, 59, 30);
  const hasGreyDash = run.some(
    (p) =>
      p.r === foldGrey.r &&
      p.g === foldGrey.g &&
      p.b === foldGrey.b &&
      p.a === 255
  );
  const hasGap = run.some((p) => p.a === 0);

  expect(hasGreyDash).toBe(true);
  expect(hasGap).toBe(true);
});

test("drawTab with showFoldLine false omits the base fold line but keeps the tab edges", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const tab = pageImage(page).nth(6);

  // The tab itself is still drawn: its top edge is on row 50.
  expect(await readPixel(tab, 70, 50)).toEqual(black);

  // But the base fold line (which would be on row 59) is gone — no grey
  // anywhere along it.
  const run = await readPixelRow(tab, 55, 59, 30);
  const hasGrey = run.some(
    (p) => p.r === foldGrey.r && p.g === foldGrey.g && p.b === foldGrey.b
  );
  expect(hasGrey).toBe(false);
});

// --- drawText (38) ----------------------------------------------------------

// Counts "inked" pixels in a run: dark and substantially opaque. drawText is
// antialiased and font-dependent, so we assert coverage (how much ink lands in
// a band) rather than exact pixels.
const inkedCount = (run: Rgba[]) =>
  run.filter((p) => p.r < 128 && p.g < 128 && p.b < 128 && p.a > 128).length;

test("drawText renders glyphs above the baseline and nothing below it", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-primitives");

  const text = pageImage(page).nth(7);

  // "TEST" at size 80 with baseline y = 120 spans cols ~50..250. Glyphs extend
  // upward from the baseline, so a band above it (row 95) is well inked.
  const aboveBaseline = await readPixelRow(text, 50, 95, 200);
  expect(inkedCount(aboveBaseline)).toBeGreaterThan(20);

  // Below the baseline (row 145) nothing is drawn — the glyphs sit above it.
  const belowBaseline = await readPixelRow(text, 50, 145, 200);
  expect(inkedCount(belowBaseline)).toBe(0);
});
