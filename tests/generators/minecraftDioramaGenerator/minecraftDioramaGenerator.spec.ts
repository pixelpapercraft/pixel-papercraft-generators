import { expect, test } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

const grassBlockTopGray: Rgba = { r: 179, g: 179, b: 179, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const black: Rgba = { r: 0, g: 0, b: 0, a: 255 };
// The right-hand taper diagonal's own pixel reads (3, 3, 3) rather than pure
// black — a single sub-pixel-rounding artifact of that diagonal's direction,
// confirmed against the real render rather than assumed (see `drawLine`'s
// crispness-offset behavior, which shifts axis-aligned lines the same way).
const nearBlackDiagonal: Rgba = { r: 3, g: 3, b: 3, a: 255 };
const foldGray: Rgba = { r: 123, g: 123, b: 123, a: 255 };

test("minecraft diorama renders the background and title", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  await expect(page.getByText("Instructions", { exact: true })).toBeVisible();

  const pageImage = page.getByTestId("generator-page-image").first();
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});

test("places a selected block texture on a clicked face", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByTitle("grass block top", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();

  const pageImage = page.getByTestId("generator-page-image").first();
  expect(await readPixel(pageImage, 106, 105)).toEqual(grassBlockTopGray);
});

test("erases the most recently placed texture from a face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const region = page.getByTestId("region-BlockFace0 0");
  await page.getByTitle("grass block top", { exact: true }).click();
  await region.click();
  await page.getByLabel("Erase texture").click();
  await region.click();

  const pageImage = page.getByTestId("generator-page-image").first();
  expect(await readPixel(pageImage, 106, 105)).toEqual(white);
});

test("Quarter Blocks preset produces a finer grid than Full Blocks", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const regions = page.locator('[data-testid^="region-BlockFace"]');
  await expect(regions).toHaveCount(24);

  await page.getByLabel("Block Preset").selectOption("Quarter Blocks");

  await expect(regions).toHaveCount(96);
});

// Cycling a tab in Tabs edit mode renders a distinct tabShape each click —
// closes the gap the `tabShape`-wiring commit left uncovered. Probe points
// derived from `drawTabSouth`'s own inset/tabHeight formulas for this
// board's fixed North0,0 edge region ([42, 41, 128, 32], drawn with
// orientation "South" per `makeEdgeRegions`' North/South swap), then
// confirmed against the real rendered pixels before trusting them — the
// right-hand diagonal's derived coordinate was off by one row from the
// naive formula (a rendering rounding artifact, not a formula error).
test("Tabs edit mode cycles through distinct tabShape renders", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  await page.getByLabel("Edit Mode").selectOption("Tabs");

  const region = page.getByTestId("region-North0 0");
  const pageImage = page.getByTestId("generator-page-image").first();
  const leftDiagonal: [number, number] = [58, 57];
  const rightDiagonal: [number, number] = [160, 50];
  const flatBottom: [number, number] = [106, 72];

  await region.click(); // None -> Full: both corners taper
  expect(await readPixel(pageImage, ...leftDiagonal)).toEqual(black);
  expect(await readPixel(pageImage, ...rightDiagonal)).toEqual(
    nearBlackDiagonal
  );

  await region.click(); // Full -> Left: only the left corner tapers
  expect(await readPixel(pageImage, ...leftDiagonal)).toEqual(black);
  expect(await readPixel(pageImage, ...rightDiagonal)).toEqual(white);

  await region.click(); // Left -> Middle: neither corner tapers
  expect(await readPixel(pageImage, ...leftDiagonal)).toEqual(white);
  expect(await readPixel(pageImage, ...rightDiagonal)).toEqual(white);
  expect(await readPixel(pageImage, ...flatBottom)).toEqual(black);

  await region.click(); // Middle -> Right: only the right corner tapers
  expect(await readPixel(pageImage, ...leftDiagonal)).toEqual(white);
  expect(await readPixel(pageImage, ...rightDiagonal)).toEqual(
    nearBlackDiagonal
  );

  await region.click(); // Right -> None: cycle wraps, no tab renders at all
  expect(await readPixel(pageImage, ...leftDiagonal)).toEqual(white);
  expect(await readPixel(pageImage, ...rightDiagonal)).toEqual(white);
  expect(await readPixel(pageImage, ...flatBottom)).toEqual(white);
});

// Folds edit mode toggles an edge's fold-crease line independently of any
// tab on that same edge. `Show Edit Regions` is switched off first because
// its edit-region outline is drawn on top of this exact boundary line (both
// sit on the North0,0 edge's own top row) and would otherwise obscure it.
// Probe point confirmed against the real dashed render — `drawFoldLine`'s
// [2, 2] dash pattern means not every column on the line is painted.
test("Folds edit mode toggles the fold-crease line", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");
  await page.getByLabel("Edit Mode").selectOption("Folds");
  await page.getByText("Show Edit Regions", { exact: true }).click();

  const region = page.getByTestId("region-North0 0");
  const pageImage = page.getByTestId("generator-page-image").first();
  const dashPixel: [number, number] = [48, 41];

  expect(await readPixel(pageImage, ...dashPixel)).toEqual(white);

  await region.click();
  expect(await readPixel(pageImage, ...dashPixel)).toEqual(foldGray);

  await region.click();
  expect(await readPixel(pageImage, ...dashPixel)).toEqual(white);
});
