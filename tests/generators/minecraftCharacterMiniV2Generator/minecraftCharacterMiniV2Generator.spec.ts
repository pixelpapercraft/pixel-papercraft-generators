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

// Every default preset paints a distinct, opaque colour at Mini 1's face probe.
const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 235, g: 152, b: 63, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 164, g: 104, b: 64, a: 255 } },
  { name: "Kai", rgba: { r: 251, g: 237, b: 145, a: 255 } },
  { name: "Makena", rgba: { r: 56, g: 40, b: 27, a: 255 } },
  { name: "Noor", rgba: { r: 205, g: 121, b: 91, a: 255 } },
  { name: "Steve", rgba: { r: 179, g: 121, b: 94, a: 255 } },
  { name: "Sunny", rgba: { r: 73, g: 73, b: 73, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 189, g: 142, b: 114, a: 255 } },
];

// A populated mini defines regions in this order. The coloured fixture gives
// every outer/base pair a distinct value, so each region proves its own wiring.
const layerExpectations: LayerExpectation[] = [
  {
    x: 298,
    y: 134,
    visible: { r: 243, g: 244, b: 246, a: 255 },
    hidden: { r: 239, g: 68, b: 68, a: 255 },
  },
  {
    x: 170,
    y: 262,
    visible: { r: 6, g: 182, b: 212, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 122,
    y: 118,
    visible: { r: 16, g: 185, b: 129, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
  {
    x: 362,
    y: 118,
    visible: { r: 132, g: 204, b: 22, a: 255 },
    hidden: { r: 244, g: 63, b: 94, a: 255 },
  },
  {
    x: 170,
    y: 294,
    visible: { r: 139, g: 92, b: 246, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
  {
    x: 266,
    y: 294,
    visible: { r: 217, g: 70, b: 239, a: 255 },
    hidden: { r: 20, g: 184, b: 166, a: 255 },
  },
];

const whiteRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const comboboxes = (page: Page) => page.getByRole("combobox");

const mini2SkinSelect = (page: Page) =>
  page
    .getByText("Mini 2", { exact: true })
    .locator("xpath=following-sibling::div[1]")
    .getByRole("combobox")
    .first();

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft character mini generator exposes its initial controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const selects = comboboxes(page);
  await expect(selects).toHaveCount(5);
  const skinOptions = ["None", ...presetExpectations.map(({ name }) => name)];

  await expect(selects.nth(0)).toHaveValue("Default");
  await expect(selects.nth(3)).toHaveValue("");
  for (const skinIndex of [0, 3]) {
    await expect(selects.nth(skinIndex).locator("option")).toHaveText(
      skinOptions
    );
  }

  for (const modelIndex of [1, 4]) {
    await expect(selects.nth(modelIndex)).toHaveValue("Wide");
    await expect(selects.nth(modelIndex).locator("option")).toHaveText([
      "Wide",
      "Slim",
    ]);
  }

  await expect(page.getByLabel("Upload Mini 1 skin file")).toBeVisible();
  await expect(page.getByLabel("Upload Mini 2 skin file")).toBeVisible();
  await expect(page.getByLabel("Show Mini 1 Folds")).toBeChecked();

  const bodyHeight = page.getByLabel("Mini 1 Body Height");
  await expect(bodyHeight).toHaveAttribute("min", "0");
  await expect(bodyHeight).toHaveAttribute("max", "64");
  await expect(bodyHeight).toHaveAttribute("step", "1");
  await expect(bodyHeight).toHaveValue("32");

  const textureStyle = page.getByRole("combobox", {
    name: "Mini 1 Texture Style",
  });
  await expect(textureStyle).toHaveValue("Simple");
  await expect(textureStyle.locator("option")).toHaveText([
    "Simple",
    "Detailed",
  ]);

  // Mini 2 is genuinely empty: its drawing controls and six regions do not
  // exist until a skin is selected.
  await expect(page.getByLabel("Show Mini 2 Folds")).toHaveCount(0);
  await expect(page.getByLabel("Mini 2 Body Height")).toHaveCount(0);
  await expect(
    page.getByRole("combobox", { name: "Mini 2 Texture Style" })
  ).toHaveCount(0);
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft character mini generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-mini-default-page-1.png"
  );
});

test("minecraft character mini generator renders every Mini 1 preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const skin = comboboxes(page).nth(0);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(() => readPixel(pageImage, 250, 214))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect.poll(() => readPixel(pageImage, 250, 214)).toEqual(whiteRgba);
});

test("minecraft character mini generator populates Mini 2 independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  await mini2SkinSelect(page).selectOption("Alex");

  await expect
    .poll(() => readPixel(pageImage, 250, 559))
    .toEqual({ r: 235, g: 152, b: 63, a: 255 });
  await expect(readPixel(pageImage, 250, 214)).resolves.toEqual({
    r: 189,
    g: 142,
    b: 114,
    a: 255,
  });
  await expect(page.getByLabel("Show Mini 2 Folds")).toBeChecked();
  await expect(page.getByLabel("Mini 2 Body Height")).toHaveValue("32");
  await expect(
    page.getByRole("combobox", { name: "Mini 2 Texture Style" })
  ).toHaveValue("Simple");
  await expect(regions(page)).toHaveCount(12);
});

test("minecraft character mini generator renders a custom Mini 2 upload with Slim arms", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  await page
    .getByLabel("Upload Mini 2 skin file")
    .setInputFiles(skinFixturePath);

  await expect
    .poll(() => readPixel(pageImage, 122, 463))
    .toEqual({ r: 16, g: 185, b: 129, a: 255 });
  await comboboxes(page).nth(4).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, 122, 463))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-mini-custom-skin-2-page-1.png"
  );
});

test("minecraft character mini generator applies body height and texture style", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  const textureStyle = page.getByRole("combobox", {
    name: "Mini 1 Texture Style",
  });

  await expect(readPixel(pageImage, 250, 262)).resolves.toEqual({
    r: 0,
    g: 158,
    b: 158,
    a: 255,
  });
  await textureStyle.selectOption("Detailed");
  await expect
    .poll(() => readPixel(pageImage, 250, 262))
    .toEqual({ r: 129, g: 83, b: 57, a: 255 });
  await textureStyle.selectOption("Simple");

  const bodyHeight = page.getByLabel("Mini 1 Body Height");
  await expect(readPixel(pageImage, 250, 310)).resolves.toEqual({
    r: 70,
    g: 58,
    b: 165,
    a: 255,
  });
  await bodyHeight.press("End");
  await expect(bodyHeight).toHaveValue("64");
  await expect
    .poll(() => readPixel(pageImage, 250, 310))
    .toEqual({ r: 0, g: 153, b: 153, a: 255 });
  await textureStyle.selectOption("Detailed");
  await expect
    .poll(() => readPixel(pageImage, 250, 267))
    .toEqual({ r: 0, g: 158, b: 158, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-mini-body-max-detailed-page-1.png"
  );
});

test("minecraft character mini generator hides every Mini 1 outer layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  await page
    .getByLabel("Upload Mini 1 skin file")
    .setInputFiles(skinFixturePath);
  await expect(regions(page)).toHaveCount(6);

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
    "minecraft-character-mini-outer-layers-hidden-page-1.png"
  );
});

test("minecraft character mini generator hides each mini's folds independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  const pageImage = outputPage(page);
  await mini2SkinSelect(page).selectOption("Alex");
  const readMini1Fold = () => readPixel(pageImage, 123, 117);
  const readMini2Fold = () => readPixel(pageImage, 123, 462);
  const foldRgba: Rgba = { r: 123, g: 123, b: 123, a: 255 };

  await expect(readMini1Fold()).resolves.toEqual(foldRgba);
  await expect(readMini2Fold()).resolves.toEqual(foldRgba);

  await page.getByText("Show Mini 2 Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Mini 2 Folds")).not.toBeChecked();
  await expect.poll(readMini2Fold).toEqual(whiteRgba);
  await expect(readMini1Fold()).resolves.toEqual(foldRgba);

  await page.getByText("Show Mini 1 Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Mini 1 Folds")).not.toBeChecked();
  await expect.poll(readMini1Fold).toEqual(whiteRgba);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-mini-folds-off-page-1.png"
  );
});
