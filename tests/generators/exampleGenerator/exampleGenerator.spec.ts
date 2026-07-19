import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 229, g: 141, b: 63, a: 255 } },
  { name: "Ari", rgba: { r: 128, g: 48, b: 18, a: 255 } },
  { name: "Efe", rgba: { r: 134, g: 92, b: 142, a: 255 } },
  { name: "Kai", rgba: { r: 251, g: 237, b: 145, a: 255 } },
  { name: "Makena", rgba: { r: 38, g: 18, b: 22, a: 255 } },
  { name: "Noor", rgba: { r: 46, g: 24, b: 14, a: 255 } },
  { name: "Steve", rgba: { r: 51, g: 36, b: 17, a: 255 } },
  { name: "Sunny", rgba: { r: 47, g: 47, b: 47, a: 255 } },
  { name: "Zuri", rgba: { r: 14, g: 4, b: 1, a: 255 } },
  { name: "Default", rgba: { r: 47, g: 32, b: 13, a: 255 } },
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox");

test("example generator exposes its skin and folds controls", async ({
  page,
}) => {
  await page.goto("/generator/example");

  const skin = skinSelect(page);
  await expect(skin).toBeVisible();
  await expect(skin).toHaveValue("Default");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
});

test("example generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/example");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("example-default-page-1.png");
});

test("example generator renders every skin selection at the face probe", async ({
  page,
}) => {
  await page.goto("/generator/example");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(async () => readPixel(pageImage, 189, 121))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(async () => readPixel(pageImage, 189, 121))
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
});

test("example generator composes an Alex skin across the head net", async ({
  page,
}) => {
  await page.goto("/generator/example");

  const pageImage = outputPage(page);
  await skinSelect(page).selectOption("Alex");
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("example-alex-page-1.png");
});

test("example generator matches the folds-off screenshot", async ({ page }) => {
  await page.goto("/generator/example");

  const pageImage = outputPage(page);
  const showFolds = page.getByLabel("Show Folds");

  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await expect(showFolds).toBeChecked();
  await page.getByText("Show Folds", { exact: true }).click();
  await expect(showFolds).not.toBeChecked();
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot("example-default-folds-off.png");
});

test("example generator renders a custom skin upload across the head net", async ({
  page,
}) => {
  await page.goto("/generator/example");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  await expect
    .poll(async () => readPixel(pageImage, 189, 121))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("example-custom-skin-page-1.png");
});
