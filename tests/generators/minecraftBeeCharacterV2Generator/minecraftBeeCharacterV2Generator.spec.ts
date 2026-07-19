import { expect, test, type Locator, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 235, g: 208, b: 176, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 223, g: 150, b: 88, a: 255 } },
  { name: "Makena", rgba: { r: 68, g: 53, b: 40, a: 255 } },
  { name: "Noor", rgba: { r: 185, g: 103, b: 74, a: 255 } },
  { name: "Steve", rgba: { r: 179, g: 121, b: 94, a: 255 } },
  { name: "Sunny", rgba: { r: 34, g: 34, b: 34, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 173, g: 128, b: 109, a: 255 } },
];

const clearedRgba: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const beeLayerRgba: Rgba = { r: 0, g: 91, b: 91, a: 255 };
const expandedHeadRgba: Rgba = { r: 40, g: 27, b: 10, a: 255 };
const slimArmRgba: Rgba = { r: 141, g: 191, b: 139, a: 255 };

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const comboboxes = (page: Page) => page.getByRole("combobox");

const readSkin1Face = (image: Locator) => readPixel(image, 135, 130);
const readSkin2Face = (image: Locator) => readPixel(image, 135, 443);

test("minecraft bee character generator exposes both character controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const selects = comboboxes(page);
  await expect(selects).toHaveCount(4);
  const skinOptions = ["None", ...presetExpectations.map(({ name }) => name)];

  for (const skinIndex of [0, 2]) {
    await expect(selects.nth(skinIndex)).toHaveValue("Default");
    await expect(selects.nth(skinIndex).locator("option")).toHaveText(
      skinOptions
    );
  }

  for (const modelIndex of [1, 3]) {
    await expect(selects.nth(modelIndex)).toHaveValue("Wide");
    await expect(selects.nth(modelIndex).locator("option")).toHaveText([
      "Wide",
      "Slim",
    ]);
  }

  await expect(page.getByLabel("Upload Skin 1 skin file")).toBeVisible();
  await expect(page.getByLabel("Upload Skin 2 skin file")).toBeVisible();

  for (const label of ["Head Size 1", "Head Size 2"]) {
    const range = page.getByLabel(label);
    await expect(range).toHaveAttribute("min", "0");
    await expect(range).toHaveAttribute("max", "10");
    await expect(range).toHaveAttribute("step", "1");
    await expect(range).toHaveValue("0");
  }
});

test("minecraft bee character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-bee-character-default-page-1.png"
  );
});

test("minecraft bee character generator renders every Skin 1 preset", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const skin = comboboxes(page).nth(0);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect.poll(() => readSkin1Face(pageImage)).toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect.poll(() => readSkin1Face(pageImage)).toEqual(clearedRgba);
});

test("minecraft bee character generator renders every Skin 2 preset independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const skin1 = comboboxes(page).nth(0);
  const skin2 = comboboxes(page).nth(2);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin2.selectOption(preset.name);
    await expect.poll(() => readSkin2Face(pageImage)).toEqual(preset.rgba);
  }

  await skin2.selectOption("");
  await expect.poll(() => readSkin2Face(pageImage)).toEqual(clearedRgba);

  await skin1.selectOption("Kai");
  await skin2.selectOption("Alex");
  await expect
    .poll(() => readSkin1Face(pageImage))
    .toEqual({ r: 223, g: 150, b: 88, a: 255 });
  await expect
    .poll(() => readSkin2Face(pageImage))
    .toEqual({ r: 235, g: 208, b: 176, a: 255 });
});

test("minecraft bee character generator renders both Slim arm branches", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const pageImage = outputPage(page);
  await comboboxes(page).nth(1).selectOption("Slim");
  await expect.poll(() => readPixel(pageImage, 342, 50)).toEqual(slimArmRgba);
  await expect(readPixel(pageImage, 342, 363)).resolves.toEqual({
    r: 0,
    g: 175,
    b: 175,
    a: 255,
  });

  await comboboxes(page).nth(3).selectOption("Slim");
  await expect.poll(() => readPixel(pageImage, 342, 363)).toEqual(slimArmRgba);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-bee-character-both-slim-page-1.png"
  );
});

test("minecraft bee character generator expands both heads independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const pageImage = outputPage(page);
  await expect(readPixel(pageImage, 200, 130)).resolves.toEqual(beeLayerRgba);
  await expect(readPixel(pageImage, 200, 443)).resolves.toEqual(beeLayerRgba);

  const headSize1 = page.getByLabel("Head Size 1");
  await headSize1.press("End");
  await expect(headSize1).toHaveValue("10");
  await expect
    .poll(() => readPixel(pageImage, 200, 130))
    .toEqual(expandedHeadRgba);
  await expect(readPixel(pageImage, 200, 443)).resolves.toEqual(beeLayerRgba);

  const headSize2 = page.getByLabel("Head Size 2");
  await headSize2.press("End");
  await expect(headSize2).toHaveValue("10");
  await expect
    .poll(() => readPixel(pageImage, 200, 443))
    .toEqual(expandedHeadRgba);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-bee-character-heads-max-page-1.png"
  );
});

test("minecraft bee character generator renders a custom Skin 1 upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-bee-character");

  const pageImage = outputPage(page);
  await page
    .getByLabel("Upload Skin 1 skin file")
    .setInputFiles(skinFixturePath);
  await expect
    .poll(() => readSkin1Face(pageImage))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-bee-character-custom-skin-page-1.png"
  );
});
