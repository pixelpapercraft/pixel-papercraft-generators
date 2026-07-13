import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

const green: Rgba = { r: 0, g: 170, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 170, a: 255 };
const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const pageMarker: Rgba = { r: 18, g: 52, b: 86, a: 255 };

const pageImage = (page: Page) => page.getByTestId("generator-page-image");

test("hasTexture and getTexture distinguish available and missing textures", async ({
  page,
}) => {
  await page.goto("/generator/test-api-pixel-queries");

  const image = pageImage(page).nth(0);

  expect(await readPixel(image, 25, 25)).toEqual(green);
  expect(await readPixel(image, 45, 25)).toEqual(green);
  expect(await readPixel(image, 65, 25)).toEqual(blue);
  expect(await readPixel(image, 85, 25)).toEqual(blue);
});

test("getImagePixelColor returns fixture pixels and null for an unknown image", async ({
  page,
}) => {
  await page.goto("/generator/test-api-pixel-queries");

  const image = pageImage(page).nth(1);

  expect(await readPixel(image, 25, 25)).toEqual(red);
  expect(await readPixel(image, 45, 25)).toEqual(blue);
});

test("getTexturePixelColor returns fixture pixels and null for an unknown texture", async ({
  page,
}) => {
  await page.goto("/generator/test-api-pixel-queries");

  const image = pageImage(page).nth(2);

  expect(await readPixel(image, 25, 25)).toEqual(green);
  expect(await readPixel(image, 45, 25)).toEqual(blue);
});

test("getPagePixelColor and getCurrentPagePixelColor read the rendered page", async ({
  page,
}) => {
  await page.goto("/generator/test-api-pixel-queries");

  const image = pageImage(page).nth(3);

  expect(await readPixel(image, 25, 25)).toEqual(pageMarker);
  expect(await readPixel(image, 45, 25)).toEqual(green);
  expect(await readPixel(image, 65, 25)).toEqual(blue);
  expect(await readPixel(image, 85, 25)).toEqual(green);
});
