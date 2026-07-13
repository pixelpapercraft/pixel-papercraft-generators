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
// See the generator-api test-coverage plan.

const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const green: Rgba = { r: 0, g: 255, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const yellow: Rgba = { r: 255, g: 255, b: 0, a: 255 };
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

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
