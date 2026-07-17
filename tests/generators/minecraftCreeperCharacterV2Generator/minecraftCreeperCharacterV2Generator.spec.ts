import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// Minecraft Creeper Character is a skin-driven character: a Minecraft skin
// picker (presets + a fixed "Default (Slim)" option, no model-type toggle since
// `showModelType` is false), three booleans (Show Folds, Show Labels, Action
// Figure), and six clickable overlay regions that hide the helmet, jacket, and
// the four foot pants. The head/body/four-feet geometry is drawn with the
// character `steve` cuboid faces.

type PresetExpectation = { name: string; rgba: Rgba };

const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 239, g: 218, b: 191, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 223, g: 150, b: 88, a: 255 } },
  { name: "Makena", rgba: { r: 68, g: 53, b: 40, a: 255 } },
  { name: "Noor", rgba: { r: 185, g: 103, b: 74, a: 255 } },
  { name: "Steve", rgba: { r: 155, g: 99, b: 73, a: 255 } },
  { name: "Sunny", rgba: { r: 216, g: 132, b: 75, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 187, g: 137, b: 114, a: 255 } },
  { name: "Default (Slim)", rgba: { r: 242, g: 222, b: 195, a: 255 } },
];

// Each clickable region toggles one outer overlay layer. With the test-sheet
// skin uploaded, the overlay ("visible") and the base beneath it ("hidden")
// have distinct solid colours, so a single pixel proves the toggle. Listed in
// the DOM region order: helmet, jacket, front-right pant, front-left pant,
// back-right pant, back-left pant.
type LayerExpectation = { x: number; y: number; visible: Rgba; hidden: Rgba };

const layerExpectations: LayerExpectation[] = [
  { x: 260, y: 206, visible: { r: 34, g: 197, b: 94, a: 255 }, hidden: { r: 234, g: 179, b: 8, a: 255 } },
  { x: 260, y: 420, visible: { r: 6, g: 182, b: 212, a: 255 }, hidden: { r: 59, g: 130, b: 246, a: 255 } },
  { x: 142, y: 527, visible: { r: 139, g: 92, b: 246, a: 255 }, hidden: { r: 243, g: 244, b: 246, a: 255 } },
  { x: 201, y: 645, visible: { r: 217, g: 70, b: 239, a: 255 }, hidden: { r: 20, g: 184, b: 166, a: 255 } },
  { x: 490, y: 527, visible: { r: 139, g: 92, b: 246, a: 255 }, hidden: { r: 243, g: 244, b: 246, a: 255 } },
  { x: 479, y: 645, visible: { r: 217, g: 70, b: 239, a: 255 }, hidden: { r: 20, g: 184, b: 166, a: 255 } },
];

const whiteRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft creeper character generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const skin = skinSelect(page);
  await expect(skin).toHaveValue("Default");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  // `showModelType` is false, so there is no model-type combobox — only the
  // skin picker's single select.
  await expect(page.getByRole("combobox")).toHaveCount(1);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByLabel("Action Figure")).not.toBeChecked();
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft creeper character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-character-default-page-1.png"
  );
});

test("minecraft creeper character generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect.poll(() => readPixel(pageImage, 260, 206)).toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect.poll(() => readPixel(pageImage, 260, 206)).toEqual(whiteRgba);
});

test("minecraft creeper character generator renders a custom uploaded skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, 260, 206))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-character-custom-page-1.png"
  );
});

test("minecraft creeper character generator hides every outer skin layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  let regionIndex = 0;
  for (const layer of layerExpectations) {
    await expect
      .poll(() => readPixel(pageImage, layer.x, layer.y))
      .toEqual(layer.visible);
    await regions(page).nth(regionIndex).click();
    await expect
      .poll(() => readPixel(pageImage, layer.x, layer.y))
      .toEqual(layer.hidden);
    regionIndex += 1;
  }

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-character-outer-layers-hidden-page-1.png"
  );
});

test("minecraft creeper character generator composes the Action Figure layout", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const pageImage = outputPage(page);
  const readNeck = () => readPixel(pageImage, 76, 254);

  // No action-figure neck/foreground before the toggle: plain white background.
  await expect(readNeck()).resolves.toEqual(whiteRgba);

  await page.getByText("Action Figure", { exact: true }).click();
  await expect(page.getByLabel("Action Figure")).toBeChecked();
  await expect.poll(readNeck).toEqual({ r: 117, g: 71, b: 47, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-character-action-figure-page-1.png"
  );
});

test("minecraft creeper character generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-creeper-character-v2");

  const pageImage = outputPage(page);
  const readFold = () => readPixel(pageImage, 292, 150);
  const readLabel = () => readPixel(pageImage, 332, 132);

  await expect(readFold()).resolves.toEqual({ r: 128, g: 128, b: 128, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual(whiteRgba);
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual(whiteRgba);
  await expect(readFold()).resolves.toEqual(whiteRgba);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-creeper-character-overlays-off-page-1.png"
  );
});
