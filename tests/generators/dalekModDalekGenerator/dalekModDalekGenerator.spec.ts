import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  page1: Rgba;
  page2: Rgba;
};

const presetExpectations: PresetExpectation[] = [
  {
    name: "60's Dalek",
    page1: { r: 195, g: 195, b: 195, a: 255 },
    page2: { r: 0, g: 162, b: 232, a: 255 },
  },
  {
    name: "80's Dalek",
    page1: { r: 0, g: 0, b: 0, a: 255 },
    page2: { r: 0, g: 0, b: 0, a: 255 },
  },
  {
    name: "Red Dalek",
    page1: { r: 48, g: 48, b: 48, a: 255 },
    page2: { r: 93, g: 0, b: 20, a: 255 },
  },
  {
    name: "Yellow Dalek",
    page1: { r: 48, g: 48, b: 48, a: 255 },
    page2: { r: 255, g: 186, b: 0, a: 255 },
  },
  {
    name: "Gold Dalek",
    page1: { r: 234, g: 205, b: 124, a: 255 },
    page2: { r: 16, g: 29, b: 37, a: 255 },
  },
  {
    name: "Gold Entity Dalek",
    page1: { r: 162, g: 136, b: 32, a: 255 },
    page2: { r: 162, g: 136, b: 32, a: 255 },
  },
  {
    name: "Black Entity Dalek",
    page1: { r: 31, g: 31, b: 31, a: 255 },
    page2: { r: 196, g: 165, b: 40, a: 255 },
  },
  {
    name: "Blue Entity Dalek",
    page1: { r: 127, g: 127, b: 127, a: 255 },
    page2: { r: 124, g: 168, b: 184, a: 255 },
  },
  {
    name: "Red Entity Dalek",
    page1: { r: 187, g: 15, b: 23, a: 255 },
    page2: { r: 46, g: 46, b: 46, a: 255 },
  },
  {
    name: "Ender Dalek",
    page1: { r: 3, g: 0, b: 19, a: 255 },
    page2: { r: 31, g: 24, b: 95, a: 255 },
  },
  {
    name: "Classic Supreme Dalek",
    page1: { r: 47, g: 52, b: 60, a: 255 },
    page2: { r: 255, g: 186, b: 4, a: 255 },
  },
  {
    name: "Imperial Dalek",
    page1: { r: 240, g: 241, b: 236, a: 255 },
    page2: { r: 136, g: 99, b: 57, a: 255 },
  },
  {
    name: "Invasion Dalek",
    page1: { r: 127, g: 127, b: 127, a: 255 },
    page2: { r: 0, g: 162, b: 232, a: 255 },
  },
  {
    name: "Ironside Dalek",
    page1: { r: 33, g: 105, b: 16, a: 255 },
    page2: { r: 32, g: 107, b: 18, a: 255 },
  },
  {
    name: "Marine Dalek",
    page1: { r: 80, g: 153, b: 165, a: 255 },
    page2: { r: 196, g: 165, b: 40, a: 255 },
  },
  {
    name: "Pilot Dalek",
    page1: { r: 48, g: 48, b: 48, a: 255 },
    page2: { r: 45, g: 0, b: 27, a: 255 },
  },
  {
    name: "Renegade Dalek",
    page1: { r: 3, g: 2, b: 0, a: 255 },
    page2: { r: 24, g: 28, b: 27, a: 255 },
  },
  {
    name: "Scientist Dalek",
    page1: { r: 48, g: 48, b: 48, a: 255 },
    page2: { r: 217, g: 94, b: 22, a: 255 },
  },
  {
    name: "Stone Dalek",
    page1: { r: 65, g: 56, b: 47, a: 255 },
    page2: { r: 57, g: 55, b: 43, a: 255 },
  },
  {
    name: "Strategist Dalek",
    page1: { r: 27, g: 20, b: 100, a: 255 },
    page2: { r: 48, g: 48, b: 48, a: 255 },
  },
  {
    name: "Suicide Dalek",
    page1: { r: 195, g: 195, b: 195, a: 255 },
    page2: { r: 77, g: 78, b: 83, a: 255 },
  },
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page, index: number) =>
  page.getByTestId("generator-page-image").nth(index);

test("dalek generator exposes its skin and color controls", async ({
  page,
}) => {
  await page.goto("/generator/dalek");

  const skin = page.getByLabel("Skin", { exact: true });
  await expect(skin).toBeVisible();
  await expect(skin).toHaveValue("");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(page.getByLabel("Upload Skin texture file")).toBeVisible();
  await expect(page.getByLabel("Show Colors")).not.toBeChecked();
});

test("dalek generator matches the default screenshots", async ({ page }) => {
  await page.goto("/generator/dalek");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(2);

  for (let index = 0; index < 2; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "dalek-default-page-" + (index + 1) + ".png"
    );
  }
});

test("dalek generator renders every skin preset at its discriminating probes", async ({
  page,
}) => {
  await page.goto("/generator/dalek");

  const skin = page.getByLabel("Skin", { exact: true });
  const page1 = outputPage(page, 0);
  const page2 = outputPage(page, 1);
  await renderImageAtNaturalSize(page1);
  await renderImageAtNaturalSize(page2);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(async () => readPixel(page1, 15, 493))
      .toEqual(preset.page1);
    await expect
      .poll(async () => readPixel(page2, 315, 126))
      .toEqual(preset.page2);
  }
});

test("dalek generator composes a Red Dalek texture across both pages", async ({
  page,
}) => {
  await page.goto("/generator/dalek");

  await page.getByLabel("Skin", { exact: true }).selectOption("Red Dalek");

  for (let index = 0; index < 2; index += 1) {
    const pageImage = outputPage(page, index);
    await renderImageAtNaturalSize(pageImage);
    await expect(pageImage).toHaveScreenshot(
      "dalek-red-dalek-page-" + (index + 1) + ".png"
    );
  }
});

test("dalek generator shows color-code overlays on both pages", async ({
  page,
}) => {
  await page.goto("/generator/dalek");

  const showColors = page.getByLabel("Show Colors");
  const page1 = outputPage(page, 0);
  const page2 = outputPage(page, 1);
  await page.getByText("Show Colors", { exact: true }).click();

  await expect
    .poll(async () => readPixel(page1, 150, 75))
    .toEqual({ r: 255, g: 0, b: 0, a: 255 });
  await expect
    .poll(async () => readPixel(page2, 180, 56))
    .toEqual({ r: 0, g: 0, b: 255, a: 255 });

  for (let index = 0; index < 2; index += 1) {
    const pageImage = outputPage(page, index);
    await renderImageAtNaturalSize(pageImage);
    await expect(pageImage).toHaveScreenshot(
      "dalek-show-colors-page-" + (index + 1) + ".png"
    );
  }
});

test("dalek generator renders a custom skin upload across both pages", async ({
  page,
}) => {
  await page.goto("/generator/dalek");

  const page1 = outputPage(page, 0);
  const defaultPixel = await readPixel(page1, 15, 493);
  await page
    .getByLabel("Upload Skin texture file")
    .setInputFiles(skinFixturePath);

  await expect
    .poll(async () => readPixel(page1, 15, 493))
    .not.toEqual(defaultPixel);

  for (let index = 0; index < 2; index += 1) {
    const pageImage = outputPage(page, index);
    await renderImageAtNaturalSize(pageImage);
    await expect(pageImage).toHaveScreenshot(
      "dalek-custom-skin-page-" + (index + 1) + ".png"
    );
  }
});
