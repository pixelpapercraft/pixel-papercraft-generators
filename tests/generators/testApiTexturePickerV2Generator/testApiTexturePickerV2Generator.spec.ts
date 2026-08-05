import fs from "fs";
import path from "path";
import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// Coverage for makeTextureVersionRegistry + TexturePickerV2 — the
// singleton-free successors to _common/textures/textureVersions.ts's
// findVersion + _common/block/texturePicker.tsx's TexturePicker. Proves the
// registry composition and the picker resolve real selections through to a
// render, for both static versions and a makeCustomTextureVersion() slot.

const swatchCenter: [number, number] = [72, 72];

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

test("exposes the version select defaulting to alpha's frames", async ({
  page,
}) => {
  await page.goto("/generator/test-api-texture-picker-v2");

  const version = page.getByLabel("Version");
  await expect(version).toHaveValue("alpha");
  await expect(version.locator("option")).toHaveText([
    "alpha",
    "beta",
    "custom",
  ]);

  await expect(page.getByTitle("Red")).toBeVisible();
  await expect(page.getByTitle("Green")).toBeVisible();
  await expect(page.getByTitle("Blue")).toHaveCount(0);
  await expect(page.getByTitle("Yellow")).toHaveCount(0);
});

test("selecting a frame from the default version renders it", async ({
  page,
}) => {
  await page.goto("/generator/test-api-texture-picker-v2");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  await page.getByTitle("Red").click();
  await expect
    .poll(async () => readPixel(pageImage, ...swatchCenter))
    .toEqual({ r: 255, g: 0, b: 0, a: 255 });

  await page.getByTitle("Green").click();
  await expect
    .poll(async () => readPixel(pageImage, ...swatchCenter))
    .toEqual({ r: 0, g: 255, b: 0, a: 255 });
});

test("switching versions swaps the picker's frames and renders the new selection", async ({
  page,
}) => {
  await page.goto("/generator/test-api-texture-picker-v2");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  await page.getByLabel("Version").selectOption("beta");
  await expect(page.getByTitle("Red")).toHaveCount(0);
  await expect(page.getByTitle("Green")).toHaveCount(0);
  await expect(page.getByTitle("Blue")).toBeVisible();
  await expect(page.getByTitle("Yellow")).toBeVisible();

  await page.getByTitle("Yellow").click();
  await expect
    .poll(async () => readPixel(pageImage, ...swatchCenter))
    .toEqual({ r: 255, g: 255, b: 0, a: 255 });
});

test("the custom version renders an uploaded texture through the same registry", async ({
  page,
}) => {
  await page.goto("/generator/test-api-texture-picker-v2");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  await page.getByLabel("Version").selectOption("custom");
  await expect(
    page.getByLabel("Select one or more custom texture files")
  ).toBeVisible();

  const swatchPath = path.join(
    process.cwd(),
    "src/generators/testApiTexturePickerV2/fixtures/customSwatch.png"
  );
  await page
    .getByLabel("Select one or more custom texture files")
    .setInputFiles({
      name: "customSwatch.png",
      mimeType: "image/png",
      buffer: fs.readFileSync(swatchPath),
    });

  await expect(page.getByTitle("customSwatch")).toBeVisible();
  await page.getByTitle("customSwatch").click();

  await expect
    .poll(async () => readPixel(pageImage, ...swatchCenter))
    .toEqual({ r: 255, g: 0, b: 255, a: 255 });
});

test("no texture selected renders a blank page", async ({ page }) => {
  await page.goto("/generator/test-api-texture-picker-v2");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  await expect
    .poll(async () => readPixel(pageImage, ...swatchCenter))
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
});
