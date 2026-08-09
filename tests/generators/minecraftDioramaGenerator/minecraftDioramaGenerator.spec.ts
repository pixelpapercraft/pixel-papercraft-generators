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

// "furnace front" is non-uniform (a dark furnace-mouth patch off-center in a
// lighter frame), so sampling one quadrant proves a crop actually happened
// instead of just re-showing the same (uniform) texture. These 4 colors are
// its own pixel values at Minecraft-texture-unit (2, 2) within each of its 4
// 8x8 quadrants — confirmed against the real rendered output before trusting
// them, same as the tab/fold probes above.
const furnaceTopLeftQuadrant: Rgba = { r: 119, g: 119, b: 119, a: 255 };
const furnaceTopRightQuadrant: Rgba = { r: 133, g: 133, b: 133, a: 255 };
const furnaceBottomLeftQuadrant: Rgba = { r: 168, g: 168, b: 168, a: 255 };
const furnaceBottomRightQuadrant: Rgba = { r: 168, g: 168, b: 168, a: 255 };
// The full (uncropped) texture's own pixel value at unit (14, 14), near its
// bottom-right corner — distinct from `furnaceBottomRightQuadrant` above,
// which is that same corner's color once *cropped* to an 8x8 quadrant (a
// different sub-image, so a different sampled color).
const furnaceUncroppedNearBottomRight: Rgba = {
  r: 157,
  g: 157,
  b: 157,
  a: 255,
};

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

// "+ Add Page"/"- Remove Page" extend the grid downward across additional
// printable sheets rather than growing one page — each new page is its own
// A4 canvas, matching the multi-page pattern other generators (e.g. Mutant
// Character) already use for fixed page counts.
test("Add Page and Remove Page change the printable page count", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const pageImages = page.getByTestId("generator-page-image");
  await expect(pageImages).toHaveCount(1);

  await page.getByText("+ Add Page", { exact: true }).click();
  await expect(pageImages).toHaveCount(2);

  await page.getByText("+ Add Page", { exact: true }).click();
  await expect(pageImages).toHaveCount(3);

  await page.getByText("- Remove Page", { exact: true }).click();
  await expect(pageImages).toHaveCount(2);
});

// There is deliberately no upper bound on page count (unlike the reference's
// fixed "1 / 512" limit) — only a floor of 1, since a diorama needs at least
// one printable sheet.
test("Remove Page never drops the page count below one", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  const pageImages = page.getByTestId("generator-page-image");
  await expect(pageImages).toHaveCount(1);

  await page.getByText("- Remove Page", { exact: true }).click();
  await expect(pageImages).toHaveCount(1);
  await page.getByText("- Remove Page", { exact: true }).click();
  await expect(pageImages).toHaveCount(1);
});

// Face ids already encode a row offset per page (`layout.ts`'s `rowOffset`),
// so a second page's grid is independently addressable and clickable from
// the first's rather than sharing region ids.
test("a second page's grid is independently clickable from the first", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  await page.getByText("+ Add Page", { exact: true }).click();

  await page.getByTitle("grass block top", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 6").click();

  const firstPageImage = page.getByTestId("generator-page-image").nth(0);
  const secondPageImage = page.getByTestId("generator-page-image").nth(1);

  expect(await readPixel(firstPageImage, 106, 105)).toEqual(white);
  expect(await readPixel(secondPageImage, 106, 105)).toEqual(grassBlockTopGray);
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

// Source edit mode crops a face's texture to a sub-region of its 16x16 grid
// instead of always showing the whole thing. The crop is set via 4 range
// sliders (`.fill()` works directly on a `type="range"` input in Playwright),
// then clicking a face applies it. Sampling Minecraft-texture-unit (2, 2)
// within the crop keeps the probe away from any quadrant boundary, matching
// the `getFaceSource`/`clampSourceRegion` unit tests' own reasoning.
test("Source edit mode crops a face to the selected source region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  // Baseline: the uncropped face shows its top-left quadrant color here.
  expect(await readPixel(pageImage, 58, 57)).toEqual(furnaceTopLeftQuadrant);

  await page.getByLabel("Edit Mode").selectOption("Source");
  await page.getByLabel("Source X").fill("0");
  await page.getByLabel("Source Y").fill("8");
  await page.getByLabel("Source Width").fill("8");
  await page.getByLabel("Source Height").fill("8");
  await page.getByTestId("region-BlockFace0 0").click();

  // Cropped to the bottom-left quadrant [0, 8, 8, 8] and magnified to fill
  // the same 128x128 cell, unit (2, 2) of the crop is source unit (2, 10).
  expect(await readPixel(pageImage, 42 + 2 * 16, 41 + 2 * 16)).toEqual(
    furnaceBottomLeftQuadrant
  );
});

// The band above a column / left of a row bulk-applies the current source
// crop to every face in it, rather than requiring one click per face.
test("Source edit mode's row header applies the crop to every face in that row", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  await page.getByTestId("region-BlockFace1 0").click();

  await page.getByLabel("Edit Mode").selectOption("Source");
  await page.getByLabel("Source X").fill("0");
  await page.getByLabel("Source Y").fill("0");
  await page.getByLabel("Source Width").fill("8");
  await page.getByLabel("Source Height").fill("8");
  await page.getByTestId("region-SourceRow0").click();

  // Cropped to the top-left quadrant [0, 0, 8, 8], unit (2, 2) of the crop is
  // also source unit (2, 2) — both faces should now show the same quadrant.
  expect(await readPixel(pageImage, 42 + 2 * 16, 41 + 2 * 16)).toEqual(
    furnaceTopLeftQuadrant
  );
  expect(await readPixel(pageImage, 170 + 2 * 16, 41 + 2 * 16)).toEqual(
    furnaceTopLeftQuadrant
  );
});

// A column header bulk-applies across the *whole document*, not just the
// current page — a column is one continuous vertical strip of the world
// grid, so it only needs to render (and be clicked) once, on the first page.
test("Source edit mode's column header applies the crop across every page", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  await page.getByText("+ Add Page", { exact: true }).click();
  const firstPageImage = page.getByTestId("generator-page-image").nth(0);
  const secondPageImage = page.getByTestId("generator-page-image").nth(1);

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  // Full Blocks fits 6 rows per page, so the second page's local row 0 is
  // world row 6.
  await page.getByTestId("region-BlockFace0 6").click();

  await page.getByLabel("Edit Mode").selectOption("Source");
  await page.getByLabel("Source X").fill("0");
  await page.getByLabel("Source Y").fill("8");
  await page.getByLabel("Source Width").fill("8");
  await page.getByLabel("Source Height").fill("8");

  const columnHeader = page.getByTestId("region-SourceColumn0");
  await expect(columnHeader).toHaveCount(1);
  await columnHeader.click();

  const probe: [number, number] = [42 + 2 * 16, 41 + 2 * 16];
  expect(await readPixel(firstPageImage, ...probe)).toEqual(
    furnaceBottomLeftQuadrant
  );
  expect(await readPixel(secondPageImage, ...probe)).toEqual(
    furnaceBottomLeftQuadrant
  );
});

// Regression coverage for the `todo.md` "Quarter Blocks doesn't crop yet"
// gap: with no explicit source set, each of the 4 adjacent quarter cells
// should default to its own 8x8 quadrant of the texture (by column/row
// parity) at full pixel density — not all 4 repeating the same whole texture
// shrunk into a smaller cell.
test("Quarter Blocks preset defaults each face to its own quadrant of the texture", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByLabel("Block Preset").selectOption("Quarter Blocks");
  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  await page.getByTestId("region-BlockFace1 0").click();
  await page.getByTestId("region-BlockFace0 1").click();
  await page.getByTestId("region-BlockFace1 1").click();

  // Each 64x64 quarter cell renders its own quadrant at the same 8px/unit
  // density as a Full Blocks cell (128 / 16 = 64 / 8), so unit (2, 2) within
  // each cell reads the same color the uncropped Full Blocks probes above do.
  expect(await readPixel(pageImage, 58, 57)).toEqual(furnaceTopLeftQuadrant);
  expect(await readPixel(pageImage, 122, 57)).toEqual(furnaceTopRightQuadrant);
  expect(await readPixel(pageImage, 58, 121)).toEqual(
    furnaceBottomLeftQuadrant
  );
  expect(await readPixel(pageImage, 122, 121)).toEqual(
    furnaceBottomRightQuadrant
  );
});

// Destination edit mode resizes a column's width and/or a row's height
// instead of every cell sharing one fixed size. Clicking a face resizes
// *both* its column and row at once — unlike Source's per-face crop, width/
// height are never per-face, only per-column/per-row, since adjacent cells
// must stay edge-to-edge in the printed grid.
test("Destination edit mode resizes both a face's column and row when clicked", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();

  await page.getByLabel("Edit Mode").selectOption("Destination");
  await page.getByLabel("Destination Width").fill("24");
  await page.getByLabel("Destination Height").fill("24");
  await page.getByTestId("region-BlockFace0 0").click();

  // Resized to 24 units (192px) each way, 12px/unit instead of the default
  // 8px/unit — unit (2, 2) of the texture now lands at grid-origin + 2*12.
  expect(await readPixel(pageImage, 42 + 2 * 12, 41 + 2 * 12)).toEqual(
    furnaceTopLeftQuadrant
  );
});

// The band above a column resizes only that column's width, leaving every
// row's height (including the clicked column's own faces) at its default.
test("Destination edit mode's column header resizes only that column's width", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  await page.getByTestId("region-BlockFace0 1").click();

  await page.getByLabel("Edit Mode").selectOption("Destination");
  await page.getByLabel("Destination Width").fill("24");
  await page.getByLabel("Destination Height").fill("24");
  await page.getByTestId("region-DestinationColumn0").click();

  // Column 0 is now 192px wide (12px/unit) but every row stays the default
  // 128px tall (8px/unit) — face (0,1) starts right after row 0's unchanged
  // 128px height.
  expect(await readPixel(pageImage, 42 + 2 * 12, 41 + 2 * 8)).toEqual(
    furnaceTopLeftQuadrant
  );
  expect(await readPixel(pageImage, 42 + 2 * 12, 41 + 128 + 2 * 8)).toEqual(
    furnaceTopLeftQuadrant
  );
});

// The band left of a row resizes only that row's height, leaving every
// column's width at its default — and, unlike a column header, that applies
// to the whole row regardless of which face was ever clicked.
test("Destination edit mode's row header resizes only that row's height", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace1 0").click();

  await page.getByLabel("Edit Mode").selectOption("Destination");
  await page.getByLabel("Destination Width").fill("24");
  await page.getByLabel("Destination Height").fill("24");
  await page.getByTestId("region-DestinationRow0").click();

  // Row 0 is now 192px tall (12px/unit) for every column, but column 1 stays
  // the default 128px wide (8px/unit) since only the row was targeted.
  // Sampling deep into what would be row 1 under the old 128px height (here,
  // still inside the resized row 0) proves the resize is real, not just a
  // coincidentally-matching top-left-quadrant color.
  expect(await readPixel(pageImage, 42 + 128 + 14 * 8, 41 + 14 * 12)).toEqual(
    furnaceUncroppedNearBottomRight
  );
});

// Transform edit mode rotates/flips an already-placed face's texture, on top
// of any rotation/flip already baked into the texture at placement time (see
// `applyFaceTransform`'s unit coverage for the exact composition math).
// `furnace_front` is fine-grained/non-uniform, so an exact post-rotation RGB
// isn't a stable thing to hardcode (a real rotation shifts which sub-pixel
// texel lands on a given screen pixel, and this codebase has already hit
// CI-only ±1-pixel drift from probes like that — see
// `project_generator-pixel-probe-stability`). Instead this proves the
// transform took visible effect (the probe pixel changes) and, more
// strongly, that resetting back to the identity transform (Rot0/None)
// restores the *exact* original pixel — a stable, non-fragile round-trip
// check confirmed against the real render before trusting it.
test("Transform edit mode rotates and flips a face's texture, reversibly", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();
  const probe: [number, number] = [58, 57];

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  const baseline = await readPixel(pageImage, ...probe);

  await page.getByLabel("Edit Mode").selectOption("Transform");
  await page.getByLabel("Face Rotation").selectOption("Rot90");
  await page.getByTestId("region-BlockFace0 0").click();
  expect(await readPixel(pageImage, ...probe)).not.toEqual(baseline);

  await page.getByLabel("Face Rotation").selectOption("Rot0");
  await page.getByTestId("region-BlockFace0 0").click();
  expect(await readPixel(pageImage, ...probe)).toEqual(baseline);

  await page.getByLabel("Face Flip").selectOption("Horizontal");
  await page.getByTestId("region-BlockFace0 0").click();
  expect(await readPixel(pageImage, ...probe)).not.toEqual(baseline);

  await page.getByLabel("Face Flip").selectOption("None");
  await page.getByTestId("region-BlockFace0 0").click();
  expect(await readPixel(pageImage, ...probe)).toEqual(baseline);
});

// The band above a column bulk-applies the current rotation/flip to every
// face in that column, mirroring Source/Destination's own column bands.
test("Transform edit mode's column header applies the transform to every face in that column", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();
  const topProbe: [number, number] = [58, 57];
  const bottomProbe: [number, number] = [58, 185];

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  await page.getByTestId("region-BlockFace0 1").click();
  const topBaseline = await readPixel(pageImage, ...topProbe);
  const bottomBaseline = await readPixel(pageImage, ...bottomProbe);

  await page.getByLabel("Edit Mode").selectOption("Transform");
  await page.getByLabel("Face Rotation").selectOption("Rot90");
  await page.getByTestId("region-TransformColumn0").click();

  const topAfter = await readPixel(pageImage, ...topProbe);
  const bottomAfter = await readPixel(pageImage, ...bottomProbe);
  expect(topAfter).not.toEqual(topBaseline);
  expect(bottomAfter).not.toEqual(bottomBaseline);
  // Both faces in the column received the identical transform.
  expect(topAfter).toEqual(bottomAfter);
});

// Multi-page's row accounting can no longer assume a constant rows-per-page
// once a row is resized — page 1 fits fewer rows than usual, so page 2 must
// start at a later world row than a naive pageIndex * rowsPerPage would give.
test("multi-page accounts for a resized row when placing later pages", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Destination");
  await page.getByLabel("Destination Height").fill("24");
  await page.getByTestId("region-DestinationRow0").click();
  await page.getByText("+ Add Page", { exact: true }).click();

  await page.getByLabel("Edit Mode").selectOption("Blocks");
  await page.getByTitle("furnace front", { exact: true }).click();
  // Row 0 at 192px leaves room for only 4 more default 128px rows in the
  // 768px page (192 + 4*128 = 704; a 6th row would need 832), so page 1
  // holds rows 0-4 (5 rows) and world row 5 is page 2's own first row.
  await page.getByTestId("region-BlockFace0 5").click();

  const firstPageImage = page.getByTestId("generator-page-image").nth(0);
  const secondPageImage = page.getByTestId("generator-page-image").nth(1);

  expect(await readPixel(firstPageImage, 58, 761)).toEqual(white);
  expect(await readPixel(secondPageImage, 58, 57)).toEqual(
    furnaceTopLeftQuadrant
  );
});

// Tabs/Folds edge regions have two independent dimensions: their thickness
// (a tab/fold's own protrusion depth) and their span (how far they stretch
// along the face's boundary). Resizing a face in Destination mode must grow
// the span — a taller row needs a taller East/West edge to stay clickable
// along its whole height — but must NOT also grow the thickness, which
// should stay the preset default regardless of face size. Found via manual
// testing: a Destination-mode resize was doubling both. Uses relative
// bounding-box comparisons rather than hardcoded pixel values, since exact
// on-screen coordinates depend on viewport/DPI scaling.
test("Destination-mode resize grows Tabs/Folds edge span but not their thickness", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  await page.getByLabel("Edit Mode").selectOption("Tabs");

  const northBefore = await page.getByTestId("region-North0 0").boundingBox();
  const westBefore = await page.getByTestId("region-West0 0").boundingBox();
  if (!northBefore || !westBefore) {
    throw new Error("Edge regions were not measurable before resize");
  }

  await page.getByLabel("Edit Mode").selectOption("Destination");
  await page.getByLabel("Destination Width").fill("32");
  await page.getByLabel("Destination Height").fill("32");
  await page.getByTestId("region-DestinationColumn0").click();
  await page.getByTestId("region-DestinationRow0").click();

  await page.getByLabel("Edit Mode").selectOption("Tabs");
  const northAfter = await page.getByTestId("region-North0 0").boundingBox();
  const westAfter = await page.getByTestId("region-West0 0").boundingBox();
  if (!northAfter || !westAfter) {
    throw new Error("Edge regions were not measurable after resize");
  }

  // North's span (width, tracking column 0's new width) roughly doubles;
  // its thickness (height) stays within a couple of pixels of its old size
  // (a small tolerance for sub-pixel viewport scaling, not the ~doubling a
  // regression would produce).
  expect(northAfter.width).toBeGreaterThan(northBefore.width * 1.8);
  expect(Math.abs(northAfter.height - northBefore.height)).toBeLessThan(3);

  // West's span (height, tracking row 0's new height) roughly doubles; its
  // thickness (width) stays put, same tolerance.
  expect(westAfter.height).toBeGreaterThan(westBefore.height * 1.8);
  expect(Math.abs(westAfter.width - westBefore.width)).toBeLessThan(3);
});

// Splitting quarters the face's *source crop*, not the texture — each of
// the 4 new parts keeps the same texture but shows a different quadrant of
// it, reconstructing the original uncropped face exactly (rather than
// blanking anything out). Default split (8/8, an even half/half) produces
// parts at the exact same size/position as a Quarter Blocks cell at this
// origin, so this reuses the Quarter Blocks defaulting test's own probe
// coordinates and expected colors.
test("Split edit mode splits a face into 4 independently-editable, correctly-cropped parts", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();

  await page.getByLabel("Edit Mode").selectOption("Split");
  await page.getByTestId("region-BlockFace0 0").click();

  await expect(page.getByTestId("region-BlockFace0 0")).toHaveCount(0);
  await expect(page.getByTestId("region-BlockFace0 0A")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace0 0D")).toHaveCount(1);

  expect(await readPixel(pageImage, 58, 57)).toEqual(furnaceTopLeftQuadrant);
  expect(await readPixel(pageImage, 122, 57)).toEqual(furnaceTopRightQuadrant);
  expect(await readPixel(pageImage, 58, 121)).toEqual(
    furnaceBottomLeftQuadrant
  );
  expect(await readPixel(pageImage, 122, 121)).toEqual(
    furnaceBottomRightQuadrant
  );
});

// Clicking an already-split face again, with the sliders still at its
// existing split size, unsplits it — taking part A's (top-left's) texture
// and source as the merged face's own, un-quartering that source crop back
// to full scale (`unquarterSource`, the inverse of the quartering `splitFace`
// applies) so an untouched split+unsplit round-trips to the exact original
// crop instead of stretching A's small quadrant across the whole face.
test("Split mode unsplits a face back to one region, restoring the original crop exactly", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");
  const pageImage = page.getByTestId("generator-page-image").first();
  const probe: [number, number] = [42 + 2 * 16, 41 + 2 * 16];

  await page.getByTitle("furnace front", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();
  const baseline = await readPixel(pageImage, ...probe);

  await page.getByLabel("Edit Mode").selectOption("Split");
  await page.getByTestId("region-BlockFace0 0").click(); // split
  // Splitting quarters the source using the same fractions as the visual
  // split, so it doesn't change what's shown yet.
  expect(await readPixel(pageImage, ...probe)).toEqual(baseline);

  await page.getByTestId("region-BlockFace0 0A").click(); // same size -> unsplit

  await expect(page.getByTestId("region-BlockFace0 0")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace0 0A")).toHaveCount(0);
  expect(await readPixel(pageImage, ...probe)).toEqual(baseline);
});

// Clicking an already-split face with the sliders set to a *different* size
// resizes the split boundary instead of unsplitting — part content is left
// untouched, only the boundary between parts moves.
test("Split mode resizes an existing split's boundary without unsplitting", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  await page.getByTestId("region-BlockFace0 0").click(); // split at default 8/8

  const partABefore = await page
    .getByTestId("region-BlockFace0 0A")
    .boundingBox();
  if (!partABefore) {
    throw new Error("Part A region was not measurable before resize");
  }

  await page.getByLabel("Split Width").fill("4");
  await page.getByTestId("region-BlockFace0 0A").click(); // differing size -> resize

  await expect(page.getByTestId("region-BlockFace0 0A")).toHaveCount(1);
  const partAAfter = await page
    .getByTestId("region-BlockFace0 0A")
    .boundingBox();
  if (!partAAfter) {
    throw new Error("Part A region was not measurable after resize");
  }
  // Part A narrowed from 8/16 to 4/16 of the cell's width.
  expect(partAAfter.width).toBeLessThan(partABefore.width * 0.7);
});

// The band above a column / left of a row / in the page corner bulk-toggle
// split state across a whole column, row, or page — mirroring Source/
// Destination/Transform's own column/row bands, plus a third page-scoped
// tier unique to Split.
test("Split mode's column header splits every face in that column, leaving other columns untouched", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  const columnHeader = page.getByTestId("region-SplitColumn0");
  await expect(columnHeader).toHaveCount(1);
  await columnHeader.click();

  await expect(page.getByTestId("region-BlockFace0 0A")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace0 1A")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace1 0")).toHaveCount(1);
});

test("Split mode's row header splits every face in that row, leaving other rows untouched", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  const rowHeader = page.getByTestId("region-SplitRow0");
  await expect(rowHeader).toHaveCount(1);
  await rowHeader.click();

  await expect(page.getByTestId("region-BlockFace0 0A")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace1 0A")).toHaveCount(1);
  await expect(page.getByTestId("region-BlockFace0 1")).toHaveCount(1);
});

test("Split mode's page header splits every face on the current page", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  const pageHeader = page.getByTestId("region-SplitPage0");
  await expect(pageHeader).toHaveCount(1);
  await pageHeader.click();

  const splitPartRegions = page.locator(
    '[data-testid^="region-BlockFace"][data-testid$="A"]'
  );
  // 4 columns x 6 rows fit on one Full Blocks page.
  await expect(splitPartRegions).toHaveCount(24);
});

// A split face's own outer edges divide into 2 parts each (per
// `outerEdgeParts`' North/South/West/East -> A+B/C+D/A+C/B+D mapping) —
// this holds for a page's *boundary* flap too, not just the interior edges
// `makeEdgeRegions` covers, since a face at row 0 sits at the page's own
// North boundary.
test("a split face at the page's top boundary renders 2 North boundary tab regions instead of 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  await page.getByTestId("region-BlockFace0 0").click();

  await page.getByLabel("Edit Mode").selectOption("Tabs");
  await expect(page.getByTestId("region-North0 -1")).toHaveCount(0);
  await expect(page.getByTestId("region-North0 -1A")).toHaveCount(1);
  await expect(page.getByTestId("region-North0 -1B")).toHaveCount(1);
});

// A split face's parts each get a Tabs-mode click region on all 4 of their
// own sides, including the 2 they share with a sibling part — matching the
// reference's own behavior (which our own app initially diverged from and
// then matched back after testing showed the divergence, not the
// reference, was the odd one out: a full ring of tabs on a part's own 4
// sides folds inward to an X centered on that part, plausibly a deliberate
// way to frame a cut-out hole rather than a rendering bug).
test("a split face's parts each get Tabs-mode click regions on all 4 of their own sides", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Edit Mode").selectOption("Split");
  await page.getByTestId("region-BlockFace0 0").click();

  await page.getByLabel("Edit Mode").selectOption("Tabs");
  for (const direction of ["North", "South", "East", "West"]) {
    await expect(page.getByTestId(`region-${direction}0 0A`)).toHaveCount(1);
  }
});
