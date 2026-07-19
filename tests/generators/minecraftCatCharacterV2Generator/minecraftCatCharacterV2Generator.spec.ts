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

const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 243, g: 168, b: 88, a: 255 } },
  { name: "Ari", rgba: { r: 147, g: 63, b: 30, a: 255 } },
  { name: "Efe", rgba: { r: 129, g: 88, b: 137, a: 255 } },
  { name: "Kai", rgba: { r: 251, g: 226, b: 138, a: 255 } },
  { name: "Makena", rgba: { r: 38, g: 18, b: 22, a: 255 } },
  { name: "Noor", rgba: { r: 167, g: 92, b: 67, a: 255 } },
  { name: "Steve", rgba: { r: 51, g: 36, b: 17, a: 255 } },
  { name: "Sunny", rgba: { r: 56, g: 56, b: 56, a: 255 } },
  { name: "Zuri", rgba: { r: 95, g: 62, b: 41, a: 255 } },
  { name: "Default", rgba: { r: 43, g: 30, b: 13, a: 255 } },
];

const layerExpectations: LayerExpectation[] = [
  {
    x: 42,
    y: 74,
    visible: { r: 34, g: 197, b: 94, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 90,
    y: 194,
    visible: { r: 6, g: 182, b: 212, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 370,
    y: 234,
    visible: { r: 132, g: 204, b: 22, a: 255 },
    hidden: { r: 244, g: 63, b: 94, a: 255 },
  },
  {
    x: 282,
    y: 234,
    visible: { r: 249, g: 115, b: 22, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 370,
    y: 322,
    visible: { r: 217, g: 70, b: 239, a: 255 },
    hidden: { r: 20, g: 184, b: 166, a: 255 },
  },
  {
    x: 282,
    y: 338,
    visible: { r: 139, g: 92, b: 246, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
];

const tailExpectations: Rgba[] = [
  { r: 139, g: 92, b: 246, a: 255 },
  { r: 217, g: 70, b: 239, a: 255 },
  { r: 249, g: 115, b: 22, a: 255 },
  { r: 132, g: 204, b: 22, a: 255 },
  { r: 139, g: 92, b: 246, a: 255 },
];

const transparentRgba: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft cat character generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

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
  await expect(regions(page)).toHaveCount(7);
});

test("minecraft cat character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cat-character-default-page-1.png"
  );
});

test("minecraft cat character generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect.poll(() => readPixel(pageImage, 85, 80)).toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(() => readPixel(pageImage, 85, 80))
    .toEqual(transparentRgba);
});

test("minecraft cat character generator renders a custom Slim skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, 286, 250))
    .toEqual({ r: 16, g: 185, b: 129, a: 255 });

  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, 286, 250))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cat-character-custom-slim-page-1.png"
  );
});

test("minecraft cat character generator hides every outer skin layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

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
    "minecraft-cat-character-outer-layers-hidden-page-1.png"
  );
});

test("minecraft cat character generator cycles through all four tail sources", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  const tailRegion = regions(page).nth(6);

  let tailIndex = 0;
  for (const expected of tailExpectations) {
    if (tailIndex > 0) {
      await tailRegion.click();
    }
    await expect.poll(() => readPixel(pageImage, 474, 302)).toEqual(expected);

    if (tailIndex === 2) {
      await renderImageAtNaturalSize(pageImage);
      await expect(pageImage).toHaveScreenshot(
        "minecraft-cat-character-right-arm-tail-page-1.png"
      );
    }
    tailIndex += 1;
  }
});

test("minecraft cat character generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat-character");

  const pageImage = outputPage(page);
  const readFold = () => readPixel(pageImage, 266, 234);
  const readLabel = () => readPixel(pageImage, 142, 46);
  await expect(readFold()).resolves.toEqual({ r: 123, g: 123, b: 123, a: 255 });
  await expect(readLabel()).resolves.toEqual({
    r: 102,
    g: 102,
    b: 102,
    a: 255,
  });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readLabel()).resolves.toEqual({
    r: 102,
    g: 102,
    b: 102,
    a: 255,
  });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(readFold()).resolves.toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cat-character-overlays-off-page-1.png"
  );
});
