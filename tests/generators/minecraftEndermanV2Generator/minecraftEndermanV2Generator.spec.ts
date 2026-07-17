import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// Minecraft Enderman has two independent texture inputs — the body skin
// ("Enderman") and a glowing-eyes overlay ("Enderman Eyes"), each a custom
// upload with no enumerable presets — plus Show Folds / Show Labels booleans and
// no clickable regions. The eyes texture is drawn over the same geometry as the
// body, on top, so by default only its eye pixels are opaque.

const fixture = "src/generators/_common/fixtures/testSheet.png";

// Default colours (no upload): the enderman body is near-black; the eyes overlay
// paints a purple stripe across the face.
const bodyDefault: Rgba = { r: 22, g: 22, b: 22, a: 255 };
const eyeDefault: Rgba = { r: 224, g: 121, b: 250, a: 255 };
// The test-sheet fixture sampled through the body face.
const bodyFixture: Rgba = { r: 244, g: 63, b: 94, a: 255 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

const bodyProbe = (page: Page) => readPixel(outputPage(page), 332, 281);
const eyeProbe = (page: Page) => readPixel(outputPage(page), 138, 123);

test("minecraft enderman generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-v2");

  // Neither texture input has enumerable presets, so each shows only its custom
  // upload rather than a select.
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByLabel("Upload Enderman texture file")).toBeVisible();
  await expect(
    page.getByLabel("Upload Enderman Eyes texture file")
  ).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
  await expect(regions(page)).toHaveCount(0);
});

test("minecraft enderman generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-v2");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-default-page-1.png"
  );
});

test("minecraft enderman generator renders a custom body texture under the eyes overlay", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-v2");

  const pageImage = outputPage(page);
  await expect(bodyProbe(page)).resolves.toEqual(bodyDefault);
  await expect(eyeProbe(page)).resolves.toEqual(eyeDefault);

  await page.getByLabel("Upload Enderman texture file").setInputFiles(fixture);

  // The body takes the uploaded texture; the untouched eyes overlay still paints
  // its purple stripe on top.
  await expect.poll(() => bodyProbe(page)).toEqual(bodyFixture);
  await expect(eyeProbe(page)).resolves.toEqual(eyeDefault);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-custom-body-page-1.png"
  );
});

test("minecraft enderman generator renders a custom eyes overlay texture", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-v2");

  const pageImage = outputPage(page);
  await expect(eyeProbe(page)).resolves.toEqual(eyeDefault);

  await page
    .getByLabel("Upload Enderman Eyes texture file")
    .setInputFiles(fixture);

  // The eyes overlay is now the opaque fixture, so it repaints the eye stripe
  // (no longer the default purple) and covers the body face beneath it.
  await expect.poll(() => eyeProbe(page)).not.toEqual(eyeDefault);
  await expect.poll(() => bodyProbe(page)).toEqual(bodyFixture);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-custom-eyes-page-1.png"
  );
});

test("minecraft enderman generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-v2");

  const pageImage = outputPage(page);
  const readFold = () => readPixel(pageImage, 139, 24);
  const readLabel = () => readPixel(pageImage, 404, 183);

  await expect(readFold()).resolves.toEqual({ r: 179, g: 179, b: 179, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readFold()).resolves.toEqual({ r: 255, g: 255, b: 255, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-overlays-off-page-1.png"
  );
});
