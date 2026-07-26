import { expect, test } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Generator API coverage: page management (`usePage` / `getCurrentPage`).
// Generator id: test-api-page-management.
// The generator's script draws colour markers across the page lifecycle; these
// tests read back exact pixels to pin each behaviour. Expected page sequence:
// ["Page" (auto), "Alpha", "Beta"]. See the generator-api test-coverage plan.

const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const green: Rgba = { r: 0, g: 255, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const magenta: Rgba = { r: 255, g: 0, b: 255, a: 255 };
const cyan: Rgba = { r: 0, g: 255, b: 255, a: 255 };
// An untouched canvas pixel (this generator paints no background), for
// draw-isolation "nothing leaked here" assertions.
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

// Marker centres (see the generator script's rectangles). Every marker sits in
// y = 10..50, so any coordinate below that is untouched on every page.
const markLeft = { x: 30, y: 30 };
const markRight = { x: 80, y: 30 };
const emptyProbe = { x: 30, y: 120 };

test("getCurrentPage lazily creates one default page and accumulates draws drawn before any usePage", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-management");

  const pages = page.getByTestId("generator-page-image");
  const defaultPage = pages.nth(0);
  await expect(defaultPage).toHaveAttribute("src", /data:image\/png/);

  // Both marks drawn before any usePage are present on the single auto-created
  // page: proves lazy creation AND that getCurrentPage returned the same page
  // for the second draw (accumulation, not a fresh canvas).
  expect(await readPixel(defaultPage, markLeft.x, markLeft.y)).toEqual(red);
  expect(await readPixel(defaultPage, markRight.x, markRight.y)).toEqual(green);
});

test("usePage creates one page per new id, with no duplicate for a re-selected id", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-management");

  // "Page" (auto) + "Alpha" + "Beta" = 3. usePage("Alpha") is called twice but
  // must not add a fourth page.
  await expect(page.getByTestId("generator-page-image")).toHaveCount(3);
});

test("usePage appends new pages in first-use order", async ({ page }) => {
  await page.goto("/generator/test-api-page-management");

  const pages = page.getByTestId("generator-page-image");

  // page[1] is Alpha (first usePage), page[2] is Beta (second usePage).
  expect(await readPixel(pages.nth(1), markLeft.x, markLeft.y)).toEqual(blue);
  expect(await readPixel(pages.nth(2), markLeft.x, markLeft.y)).toEqual(
    magenta
  );
});

test("usePage re-selecting an existing page accumulates onto it rather than clearing", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-management");

  const alphaPage = page.getByTestId("generator-page-image").nth(1);

  // Alpha carries both its first mark (blue, drawn before Beta) and the mark
  // drawn after re-selecting it (cyan): the canvas was kept, not reset.
  expect(await readPixel(alphaPage, markLeft.x, markLeft.y)).toEqual(blue);
  expect(await readPixel(alphaPage, markRight.x, markRight.y)).toEqual(cyan);
});

test("usePage isolates draws to the current page — nothing leaks across pages", async ({
  page,
}) => {
  await page.goto("/generator/test-api-page-management");

  const pages = page.getByTestId("generator-page-image");

  // Beta only ever had its single magenta mark (at markLeft). The cyan drawn
  // after re-selecting Alpha, and the green drawn on the default page, must NOT
  // appear on Beta — a draw lands only on the page current at the time.
  expect(await readPixel(pages.nth(2), markRight.x, markRight.y)).toEqual(
    transparent
  );
  expect(await readPixel(pages.nth(2), markLeft.x, markLeft.y)).toEqual(
    magenta
  );

  // A coordinate below every marker is untouched on all three pages: no stray
  // content anywhere the script didn't explicitly draw.
  expect(await readPixel(pages.nth(0), emptyProbe.x, emptyProbe.y)).toEqual(
    transparent
  );
  expect(await readPixel(pages.nth(1), emptyProbe.x, emptyProbe.y)).toEqual(
    transparent
  );
  expect(await readPixel(pages.nth(2), emptyProbe.x, emptyProbe.y)).toEqual(
    transparent
  );
});
