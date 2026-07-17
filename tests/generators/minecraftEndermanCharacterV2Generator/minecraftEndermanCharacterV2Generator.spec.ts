import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

type LayerExpectation = {
  x: number;
  y: number;
  visible: Rgba;
  hidden: Rgba;
};

// Head front-face colour of each built-in skin preset at (170, 121).
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
];

// One probe per clickable region, in DOM order:
// helmet, jacket, rightPant, leftPant, rightSleeve, leftSleeve.
// Each point sits on that layer's front face; clicking the region hides the
// outer (overlay) layer and reveals the base skin colour beneath. Colours come
// from uploading the shared testSheet fixture.
const layerExpectations: LayerExpectation[] = [
  {
    x: 170,
    y: 121,
    visible: { r: 34, g: 197, b: 94, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 332,
    y: 281,
    visible: { r: 6, g: 182, b: 212, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 300,
    y: 519,
    visible: { r: 139, g: 92, b: 246, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
  {
    x: 393,
    y: 519,
    visible: { r: 217, g: 70, b: 239, a: 255 },
    hidden: { r: 20, g: 184, b: 166, a: 255 },
  },
  {
    x: 120,
    y: 519,
    visible: { r: 249, g: 115, b: 22, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 214,
    y: 519,
    visible: { r: 132, g: 204, b: 22, a: 255 },
    hidden: { r: 244, g: 63, b: 94, a: 255 },
  },
];

// With no skin loaded and no static "Skin" texture, "None" renders nothing, so
// the head probe reads the white page background.
const noneRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft enderman character generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

  const skin = skinSelect(page);
  await expect(skin).toHaveValue("Default");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(modelTypeSelect(page)).toHaveValue("Wide");
  await expect(modelTypeSelect(page).locator("option")).toHaveText([
    "Wide",
    "Slim",
  ]);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByRole("combobox")).toHaveCount(2);
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft enderman character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-character-default-page-1.png"
  );
});

test("minecraft enderman character generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(() => readPixel(pageImage, 170, 121))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(() => readPixel(pageImage, 170, 121))
    .toEqual(noneRgba);
});

test("minecraft enderman character generator renders a custom Slim skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, 128, 519))
    .toEqual({ r: 16, g: 185, b: 129, a: 255 });

  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, 128, 519))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-character-custom-slim-page-1.png"
  );
});

test("minecraft enderman character generator hides every outer skin layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

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
    "minecraft-enderman-character-outer-layers-hidden-page-1.png"
  );
});

test("minecraft enderman character generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-enderman-character-v2");

  const pageImage = outputPage(page);
  const readFold = () => readPixel(pageImage, 267, 250);
  const readLabel = () => readPixel(pageImage, 82, 188);
  await expect(readFold()).resolves.toEqual({ r: 179, g: 179, b: 179, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect
    .poll(readFold)
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 0, g: 0, b: 0, a: 255 });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect
    .poll(readLabel)
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readFold()).resolves.toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-enderman-character-overlays-off-page-1.png"
  );
});
