import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Generator API coverage: image/texture drawing.
// Generator id: test-api-drawing-textures.
// Drawn from a 4x4 fixture with four 2x2 quadrant colours (red TL, green TR,
// blue BL, yellow BR). Pages, in order:
//   0 DrawImage         — drawImage (32) + unknown-id no-op
//   1 DrawTexture       — drawTexture (33) source->dest + pixelation
//   2 TextureUnknown    — drawTexture (33) unknown-id no-op
//   3 TextureRotate180  — drawTexture (33) rotate 180
//   4 TextureRotate90   — drawTexture (33) rotate 90
//   5 TextureFlipH      — drawTexture (33) flip Horizontal
//   6 TextureFlipV      — drawTexture (33) flip Vertical
//   7 DrawTextureLegacy — drawTextureLegacy (34) equivalence
//   8 TextureMultiplyHex   — drawTexture (33) MultiplyHex blend
//   9 TextureMultiplyColor — drawTexture (33) MultiplyColor blend
//  10 TextureReplaceColor  — drawTexture (33) ReplaceColor blend
//  11 TextureReplaceHex    — drawTexture (33) ReplaceHex blend
//  12 TextureTransformMatrix — drawTexture (33) exhaustive rotate x flip matrix
// See the generator-api test-coverage plan.

const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const green: Rgba = { r: 0, g: 255, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const yellow: Rgba = { r: 255, g: 255, b: 0, a: 255 };
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const darkRed: Rgba = { r: 128, g: 0, b: 0, a: 255 };
const darkGreen: Rgba = { r: 0, g: 128, b: 0, a: 255 };
const darkBlue: Rgba = { r: 0, g: 0, b: 128, a: 255 };
const darkYellow: Rgba = { r: 128, g: 128, b: 0, a: 255 };
const mutedRed: Rgba = { r: 64, g: 0, b: 0, a: 255 };
const mutedGreen: Rgba = { r: 0, g: 128, b: 0, a: 255 };
const mutedBlue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const mutedYellow: Rgba = { r: 64, g: 128, b: 0, a: 255 };
const replacementRed: Rgba = { r: 12, g: 34, b: 56, a: 255 };
const replacementBlue: Rgba = { r: 78, g: 90, b: 123, a: 255 };
const replacementGreen: Rgba = { r: 171, g: 205, b: 239, a: 255 };
const replacementYellow: Rgba = { r: 16, g: 32, b: 48, a: 255 };

const pageImage = (page: Page) => page.getByTestId("generator-page-image");

// Quadrant centres of the 64x64 texture destination drawn at [50,50].
const TL = { x: 66, y: 66 };
const TR = { x: 98, y: 66 };
const BL = { x: 66, y: 98 };
const BR = { x: 98, y: 98 };

// Reads the four quadrant centres of a texture page in TL,TR,BL,BR order.
async function readQuadrants(image: ReturnType<typeof pageImage>) {
  return {
    tl: await readPixel(image, TL.x, TL.y),
    tr: await readPixel(image, TR.x, TR.y),
    bl: await readPixel(image, BL.x, BL.y),
    br: await readPixel(image, BR.x, BR.y),
  };
}

// --- drawImage (32) ---------------------------------------------------------

test("drawImage draws the raw image at natural size at the given position", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const image = pageImage(page).nth(0);

  // The 4x4 fixture drawn at [50,50]: each quadrant is 2x2, so a pixel in each
  // quadrant carries that quadrant's colour.
  expect(await readPixel(image, 50, 50)).toEqual(red); // TL
  expect(await readPixel(image, 53, 50)).toEqual(green); // TR
  expect(await readPixel(image, 50, 53)).toEqual(blue); // BL
  expect(await readPixel(image, 53, 53)).toEqual(yellow); // BR
});

test("drawImage with an unknown id is a silent no-op", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-textures");

  const image = pageImage(page).nth(0);

  // The unknown-id draw targeted [100,50]; that area stays transparent. (The
  // real image above still rendered, so the script did not throw.)
  expect(await readPixel(image, 100, 50)).toEqual(transparent);
});

// --- drawTexture (33) -------------------------------------------------------

test("drawTexture maps the source region onto the destination region", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(1));

  expect(q.tl).toEqual(red);
  expect(q.tr).toEqual(green);
  expect(q.bl).toEqual(blue);
  expect(q.br).toEqual(yellow);
});

test("drawTexture scales up by pixelation — solid blocks with a sharp boundary", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const image = pageImage(page).nth(1);

  // Each source pixel becomes a solid 16x16 block: two pixels within the same
  // block share the colour (no gradient).
  expect(await readPixel(image, 66, 66)).toEqual(red);
  expect(await readPixel(image, 70, 70)).toEqual(red);

  // The boundary between the two top-left source pixels (red at src x=1) and
  // the top-right ones (green at src x=2) is sharp: dest col 81 is still red,
  // col 82 is already green, with no blended pixel between.
  expect(await readPixel(image, 81, 66)).toEqual(red);
  expect(await readPixel(image, 82, 66)).toEqual(green);
});

test("drawTexture with an unknown id is a silent no-op", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(2));

  // Nothing drawn — the whole destination stays transparent.
  expect(q.tl).toEqual(transparent);
  expect(q.tr).toEqual(transparent);
  expect(q.bl).toEqual(transparent);
  expect(q.br).toEqual(transparent);
});

test("drawTexture rotate 180 swaps opposite quadrants", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(3));

  // red<->yellow, green<->blue.
  expect(q.tl).toEqual(yellow);
  expect(q.tr).toEqual(blue);
  expect(q.bl).toEqual(green);
  expect(q.br).toEqual(red);
});

test("drawTexture rotate 90 rotates quadrants clockwise", async ({ page }) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(4));

  // 90° clockwise: TL->TR, TR->BR, BR->BL, BL->TL.
  expect(q.tl).toEqual(blue);
  expect(q.tr).toEqual(red);
  expect(q.br).toEqual(green);
  expect(q.bl).toEqual(yellow);
});

test("drawTexture flip Horizontal mirrors quadrants left-to-right", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(5));

  expect(q.tl).toEqual(green);
  expect(q.tr).toEqual(red);
  expect(q.bl).toEqual(yellow);
  expect(q.br).toEqual(blue);
});

test("drawTexture flip Vertical mirrors quadrants top-to-bottom", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(6));

  expect(q.tl).toEqual(blue);
  expect(q.tr).toEqual(yellow);
  expect(q.bl).toEqual(red);
  expect(q.br).toEqual(green);
});

// --- drawTextureLegacy (34) -------------------------------------------------

test("drawTextureLegacy produces the same pixels as the tuple drawTexture", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  // Same source/dest as the DrawTexture page, expressed as {x,y,w,h} objects.
  const q = await readQuadrants(pageImage(page).nth(7));

  expect(q.tl).toEqual(red);
  expect(q.tr).toEqual(green);
  expect(q.bl).toEqual(blue);
  expect(q.br).toEqual(yellow);
});

// --- drawTexture blends (33) -----------------------------------------------

test("drawTexture MultiplyHex multiplies every source colour by the hex colour", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(8));

  expect(q.tl).toEqual(darkRed);
  expect(q.tr).toEqual(darkGreen);
  expect(q.bl).toEqual(darkBlue);
  expect(q.br).toEqual(darkYellow);
});

test("drawTexture MultiplyColor multiplies every source colour by the Color", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(9));

  expect(q.tl).toEqual(mutedRed);
  expect(q.tr).toEqual(mutedGreen);
  expect(q.bl).toEqual(mutedBlue);
  expect(q.br).toEqual(mutedYellow);
});

test("drawTexture ReplaceColor replaces exact palette matches and preserves others", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(10));

  expect(q.tl).toEqual(replacementRed);
  expect(q.tr).toEqual(green);
  expect(q.bl).toEqual(replacementBlue);
  expect(q.br).toEqual(yellow);
});

test("drawTexture ReplaceHex replaces exact hex-palette matches and preserves others", async ({
  page,
}) => {
  await page.goto("/generator/test-api-drawing-textures");

  const q = await readQuadrants(pageImage(page).nth(11));

  expect(q.tl).toEqual(red);
  expect(q.tr).toEqual(replacementGreen);
  expect(q.bl).toEqual(blue);
  expect(q.br).toEqual(replacementYellow);
});

// --- rotate/flip combination matrix (page 12) -------------------------------
// Exhaustive verification of every drawTexture rotate x flip combination. The
// generator draws a 7x3 grid on page 12 (rows = rotate state, cols = flip); this
// re-derives the same cell positions and asserts the expected quadrant colours.
// The rotation/flip order and the layout constants must stay in lock-step with
// testApiDrawingTexturesGenerator.ts. See the rotate/flip combination matrix spec.

type Quad = { tl: Rgba; tr: Rgba; bl: Rgba; br: Rgba };

const matrixBase: Quad = { tl: red, tr: green, bl: blue, br: yellow };

function applyFlip(
  q: Quad,
  flip: "Horizontal" | "Vertical" | undefined
): Quad {
  if (flip === "Horizontal") return { tl: q.tr, tr: q.tl, bl: q.br, br: q.bl };
  if (flip === "Vertical") return { tl: q.bl, tr: q.br, bl: q.tl, br: q.tr };
  return q;
}

// Clockwise, matching the canvas rotate direction (verified against the
// standalone rotate 90/180 tests above).
function applyRotate(q: Quad, degrees: number): Quad {
  switch (degrees) {
    case 90:
      return { tl: q.bl, tr: q.tl, br: q.tr, bl: q.br };
    case 180:
      return { tl: q.br, tr: q.bl, bl: q.tr, br: q.tl };
    case 270:
      return { tl: q.tr, tr: q.br, br: q.bl, bl: q.tl };
    default:
      return q;
  }
}

// The renderer composes flip first, then rotate, so expected = rotate(flip(base)).
function expectedQuadrants(
  degrees: number,
  flip: "Horizontal" | "Vertical" | undefined
): Quad {
  return applyRotate(applyFlip(matrixBase, flip), degrees);
}

// Rotation rows, in the exact order the generator draws them. Corner and Center
// of the same angle share expected colours (they differ only in placement, which
// the generator's dest-origin offset compensates), so both use `degrees`.
const matrixRotationRows: { label: string; degrees: number }[] = [
  { label: "None", degrees: 0 },
  { label: "Center 90", degrees: 90 },
  { label: "Center 180", degrees: 180 },
  { label: "Center 270", degrees: 270 },
  { label: "Corner 90", degrees: 90 },
  { label: "Corner 180", degrees: 180 },
  { label: "Corner 270", degrees: 270 },
];

const matrixFlipCols: {
  label: string;
  flip: "Horizontal" | "Vertical" | undefined;
}[] = [
  { label: "None", flip: undefined },
  { label: "Horizontal", flip: "Horizontal" },
  { label: "Vertical", flip: "Vertical" },
];

// Layout constants — must match the generator.
const MATRIX_S = 40;
const MATRIX_GAP = 20;
const MATRIX_ORIGIN_X = 40;
const MATRIX_ORIGIN_Y = 40;
const MATRIX_PAGE = 12;

async function readCellQuadrants(
  image: ReturnType<typeof pageImage>,
  cx: number,
  cy: number
): Promise<Quad> {
  const q = MATRIX_S / 4;
  return {
    tl: await readPixel(image, cx + q, cy + q),
    tr: await readPixel(image, cx + 3 * q, cy + q),
    bl: await readPixel(image, cx + q, cy + 3 * q),
    br: await readPixel(image, cx + 3 * q, cy + 3 * q),
  };
}

matrixRotationRows.forEach((rotation, row) => {
  matrixFlipCols.forEach((flipCol, col) => {
    test(`drawTexture matrix: rotate ${rotation.label} + flip ${flipCol.label} lands the expected quadrants`, async ({
      page,
    }) => {
      await page.goto("/generator/test-api-drawing-textures");

      const cx = MATRIX_ORIGIN_X + col * (MATRIX_S + MATRIX_GAP);
      const cy = MATRIX_ORIGIN_Y + row * (MATRIX_S + MATRIX_GAP);

      const actual = await readCellQuadrants(
        pageImage(page).nth(MATRIX_PAGE),
        cx,
        cy
      );

      expect(actual).toEqual(
        expectedQuadrants(rotation.degrees, flipCol.flip)
      );
    });
  });
});
