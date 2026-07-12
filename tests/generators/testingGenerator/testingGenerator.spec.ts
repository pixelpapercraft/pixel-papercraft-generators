import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

test("testing generator matches the visual regression board", async ({
  page,
}) => {
  await page.goto("/generator/testing");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(6);

  // Page 1: reference sheet.
  // Page 2: common render cases grouped together.
  // Page 3: full rotation/flip matrix.
  // Page 4: region overlay.
  // Page 5: range control.
  // Page 6: same-destination density comparison.
  for (let index = 0; index < 6; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "testing-board-page-" + (index + 1) + ".png"
    );
  }
});

test("testing generator scales the region overlay proportionally to the rendered page", async ({
  page,
}) => {
  await page.goto("/generator/testing");

  const outputPages = page.getByTestId("generator-page-image");
  const regionOverlayPage = outputPages.nth(3);
  const pageBox = await regionOverlayPage.boundingBox();
  if (!pageBox) {
    throw new Error("Region Overlay page image was not measurable");
  }

  const region = page.getByTestId("region-TestRegion");
  await expect(region).toBeVisible();

  const regionBox = await region.boundingBox();
  if (!regionBox) {
    throw new Error("TestRegion was not measurable");
  }

  // The region is defined at [16, 16, 256, 256] on a 595x842 A4 page, and
  // regionControls.tsx scales it by (rendered width / 595) plus a 1px page
  // border (see scaleRegion + pageBorderWidth in src/builder/ui/pages). This
  // asserts the actual formula rather than just "position is non-zero", so a
  // regression in the scale math or the border offset is caught.
  const scale = pageBox.width / 595;
  const pageBorderWidth = 1;
  const expectedX = pageBox.x + Math.round(16 * scale) + pageBorderWidth;
  const expectedY = pageBox.y + Math.round(16 * scale) + pageBorderWidth;
  const expectedWidth = Math.round(256 * scale);
  const expectedHeight = Math.round(256 * scale);
  const tolerancePx = 1;

  expect(Math.abs(regionBox.x - expectedX)).toBeLessThanOrEqual(tolerancePx);
  expect(Math.abs(regionBox.y - expectedY)).toBeLessThanOrEqual(tolerancePx);
  expect(Math.abs(regionBox.width - expectedWidth)).toBeLessThanOrEqual(
    tolerancePx
  );
  expect(Math.abs(regionBox.height - expectedHeight)).toBeLessThanOrEqual(
    tolerancePx
  );
});

test("testing generator region overlay position is stable across interactions", async ({
  page,
}) => {
  await page.goto("/generator/testing");

  const regionOverlayPage = page.getByTestId("generator-page-image").nth(3);
  const region = page.getByTestId("region-TestRegion");
  await expect(region).toBeVisible();

  // Measure the region's position relative to its page image, not raw
  // viewport coordinates, so that Playwright auto-scrolling the region into
  // view for the click below doesn't register as a position change.
  const measureOffset = async () => {
    const pageBox = await regionOverlayPage.boundingBox();
    const regionBox = await region.boundingBox();
    if (!pageBox || !regionBox) {
      throw new Error("Region Overlay page or TestRegion was not measurable");
    }
    return {
      x: regionBox.x - pageBox.x,
      y: regionBox.y - pageBox.y,
      width: regionBox.width,
      height: regionBox.height,
    };
  };

  const offsetBefore = await measureOffset();

  // Clicking the region forces the page image to re-render with a new data
  // URL, the same kind of DOM change useElementSizeListener's code comment
  // documents as a past source of drift: re-measuring on that mutation
  // (rather than only on window resize) shifted region control positions by
  // a rounding pixel afterwards. This confirms that redraw doesn't move the
  // overlay.
  await region.click();

  const offsetAfter = await measureOffset();

  expect(offsetAfter.x).toBe(offsetBefore.x);
  expect(offsetAfter.y).toBe(offsetBefore.y);
  expect(offsetAfter.width).toBe(offsetBefore.width);
  expect(offsetAfter.height).toBe(offsetBefore.height);
});

test("testing generator range control drives the rendered output", async ({
  page,
}) => {
  await page.goto("/generator/testing");

  // The default scale is 2, so the texture renders at 128x128.
  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(6);

  const rangePage = outputPages.nth(4);
  await expect(rangePage).toBeVisible();
  await expect(rangePage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(rangePage);

  await expect(rangePage).toHaveScreenshot(
    "testing-range-default-scale-2.png"
  );

  // Change the range to 4 and verify the rendered output changes.
  await page.getByLabel("Scale").fill("4");
  await page.getByLabel("Scale").evaluate((e) => e.dispatchEvent(new Event("change", { bubbles: true })));

  await expect(rangePage).toHaveScreenshot(
    "testing-range-scale-4.png"
  );
});

test("testing generator range control preserves fractional step values", async ({
  page,
}) => {
  await page.goto("/generator/testing");

  const opacityInput = page.getByLabel("Opacity");
  await expect(opacityInput).toBeVisible();

  const opacityRow = page
    .locator("div.mb-4")
    .filter({ has: opacityInput });

  // RangeControl parses the raw DOM input value; a regression back to
  // parseInt would silently truncate this to "0".
  await opacityInput.fill("0.3");
  await opacityInput.evaluate((e) =>
    e.dispatchEvent(new Event("change", { bubbles: true }))
  );

  await expect(opacityRow.locator("span")).toHaveText("0.3");
});

test("testing generator renders uploaded atlas textures", async ({ page }) => {
  await page.goto("/generator/testing");

  const sheetPath = path.join(
    process.cwd(),
    "src/generators/testing/images/testSheet.png"
  );
  const sheetBytes = fs.readFileSync(sheetPath);

  await page
    .getByLabel("Select one or more Textures texture files")
    .setInputFiles([
      {
        name: "atlas-a.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
      {
        name: "atlas-b.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
    ]);

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(7);

  const outputPage = outputPages.nth(6);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot("testing-board-atlas-page-7.png");
});
