import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft creeper generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-v2");

  // Skin has no enumerable presets, so the loaded-texture control presents only
  // its custom upload rather than an empty select.
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await expect(page.getByLabel("Upload Skin texture file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByLabel("Action Figure")).not.toBeChecked();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
  await expect(regions(page)).toHaveCount(0);
});

test("minecraft creeper generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-v2");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-default-page-1.png"
  );
});

test("minecraft creeper generator renders a custom texture across the model", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-v2");

  const pageImage = outputPage(page);
  await page
    .getByLabel("Upload Skin texture file")
    .setInputFiles(skinFixturePath);

  // These independent head and body probes pin how the intentionally synthetic
  // fixture is sampled and composed into the page.
  await expect
    .poll(() => readPixel(pageImage, 250, 200))
    .toEqual({ r: 243, g: 244, b: 246, a: 255 });
  await expect
    .poll(() => readPixel(pageImage, 260, 420))
    .toEqual({ r: 20, g: 184, b: 166, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-custom-texture-page-1.png"
  );
});

test("minecraft creeper generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-v2");

  const pageImage = outputPage(page);
  const foldProbe = () => readPixel(pageImage, 229, 109);
  const labelProbe = () => readPixel(pageImage, 332, 132);

  const foldOn = await foldProbe();
  const labelOn = await labelProbe();

  await page.getByText("Show Folds", { exact: true }).click();
  await expect.poll(foldProbe).not.toEqual(foldOn);
  await expect(labelProbe()).resolves.toEqual(labelOn);

  const foldOff = await foldProbe();
  await page.getByText("Show Labels", { exact: true }).click();
  await expect.poll(labelProbe).not.toEqual(labelOn);
  await expect(foldProbe()).resolves.toEqual(foldOff);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-overlays-off-page-1.png"
  );
});

test("minecraft creeper generator composes action-figure foreground, folds, and labels", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-v2");

  const pageImage = outputPage(page);
  const actionNeckProbe = () => readPixel(pageImage, 60, 280);
  const withoutActionFigure = await actionNeckProbe();
  await page.getByText("Action Figure", { exact: true }).click();

  await expect
    .poll(actionNeckProbe)
    .not.toEqual(withoutActionFigure);
  await expect
    .poll(() => readPixel(pageImage, 45, 253))
    .toEqual({ r: 123, g: 123, b: 123, a: 255 });
  await expect
    .poll(() => readPixel(pageImage, 53, 226))
    .toEqual({ r: 0, g: 0, b: 0, a: 255 });
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-action-figure-page-1.png"
  );
});
