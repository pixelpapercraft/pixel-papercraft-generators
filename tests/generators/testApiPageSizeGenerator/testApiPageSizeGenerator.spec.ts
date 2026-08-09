import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Generator API coverage for `usePage`'s optional `size` parameter
// (`builder/engine/modelPage.ts`), added to support Diorama's landscape
// mode. Generator id: test-api-page-size.
//
// Renders two pages: "Portrait" (usePage with no size arg, proving the
// default still resolves to A4) and "Landscape" (usePage with
// swapPageSize(A4.px), proving an explicit size is honored). The Landscape
// page's two clickable regions sit at canvas x=700 — past 595, the old fixed
// portrait width. Before this change, `RegionControls`' click-region scale
// factor always divided by the fixed portrait width regardless of the real
// page, so on this landscape page it would compute scale = 842/595 ≈ 1.415
// instead of the correct 1.0 (the 1600x1400 Playwright viewport is wide
// enough that neither page is ever CSS-shrunk below its native size) —
// placing the overlay divs off to the right of the rendered image entirely,
// so a click at the real, correct position would hit nothing.

const defaultColor: Rgba = { r: 156, g: 163, b: 175, a: 255 };
const clickedColor: Rgba = { r: 34, g: 197, b: 94, a: 255 };

const pageImage = (page: Page, index: number) =>
  page.getByTestId("generator-page-image").nth(index);

const regionACenter = { x: 750, y: 110 };
const regionBCenter = { x: 750, y: 270 };

async function clickLandscapeRegion(
  page: Page,
  center: { x: number; y: number }
) {
  const image = pageImage(page, 1);
  // The Landscape page block renders below the Portrait block and can sit
  // partly outside the viewport — `boundingBox()` still reports its real
  // page position, but `page.mouse.click` (unlike a locator's own `.click()`)
  // doesn't auto-scroll, so a click below the fold silently hits nothing.
  await image.scrollIntoViewIfNeeded();
  const box = await image.boundingBox();
  if (!box) {
    throw new Error("Landscape page image has no bounding box");
  }
  // Native size is 842x595 (asserted separately) — scale the canvas-space
  // target through the image's real rendered box so this test still holds if
  // the viewport ever shrinks the image.
  const nativeWidth = 842;
  const nativeHeight = 595;
  await page.mouse.click(
    box.x + (center.x / nativeWidth) * box.width,
    box.y + (center.y / nativeHeight) * box.height
  );
}

test("Portrait keeps the default A4 size, Landscape uses its own swapped size", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-size");

  const [portraitSize, landscapeSize] = await Promise.all([
    pageImage(page, 0).evaluate((img: HTMLImageElement) => [
      img.naturalWidth,
      img.naturalHeight,
    ]),
    pageImage(page, 1).evaluate((img: HTMLImageElement) => [
      img.naturalWidth,
      img.naturalHeight,
    ]),
  ]);

  expect(portraitSize).toEqual([595, 842]);
  expect(landscapeSize).toEqual([842, 595]);
});

test("clicking a landscape region toggles only that region", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-size");

  const landscape = pageImage(page, 1);

  expect(await readPixel(landscape, regionACenter.x, regionACenter.y)).toEqual(
    defaultColor
  );
  expect(await readPixel(landscape, regionBCenter.x, regionBCenter.y)).toEqual(
    defaultColor
  );

  await clickLandscapeRegion(page, regionACenter);

  expect(await readPixel(landscape, regionACenter.x, regionACenter.y)).toEqual(
    clickedColor
  );
  expect(await readPixel(landscape, regionBCenter.x, regionBCenter.y)).toEqual(
    defaultColor
  );

  await clickLandscapeRegion(page, regionBCenter);

  expect(await readPixel(landscape, regionACenter.x, regionACenter.y)).toEqual(
    clickedColor
  );
  expect(await readPixel(landscape, regionBCenter.x, regionBCenter.y)).toEqual(
    clickedColor
  );
});
