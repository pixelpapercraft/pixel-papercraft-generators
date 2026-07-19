import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

type PresentationToggleExpectation = {
  label: string;
  x: number;
  y: number;
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

const presentationToggleExpectations: PresentationToggleExpectation[] = [
  {
    label: "Show Folds",
    x: 106,
    y: 36,
    rgba: { r: 255, g: 255, b: 255, a: 255 },
  },
  {
    label: "Show Labels",
    x: 209,
    y: 61,
    rgba: { r: 255, g: 255, b: 255, a: 255 },
  },
  {
    label: "Hand Notches",
    x: 85,
    y: 428,
    rgba: { r: 170, g: 125, b: 102, a: 255 },
  },
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft action figure generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const skin = skinSelect(page);
  const modelType = modelTypeSelect(page);
  await expect(skin).toHaveValue("Default");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(modelType).toHaveValue("Wide");
  await expect(modelType.locator("option")).toHaveText(["Wide", "Slim"]);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByLabel("Hand Notches")).toBeChecked();
  await expect(regions(page)).toHaveCount(7);
});

test("minecraft action figure generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-action-figure-default-page-1.png"
  );
});

test("minecraft action figure generator renders every skin selection at the head probe", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(async () => readPixel(pageImage, 105, 101))
      .toEqual(preset.rgba);
  }
});

test("minecraft action figure generator composes a slim Alex layout", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const pageImage = outputPage(page);
  await skinSelect(page).selectOption("Alex");
  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(async () => readPixel(pageImage, 105, 101))
    .toEqual({ r: 229, g: 141, b: 63, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-action-figure-alex-slim-page-1.png"
  );
});

for (const toggle of presentationToggleExpectations) {
  test(`minecraft action figure generator hides ${toggle.label}`, async ({
    page,
  }) => {
    await page.goto("/generator/minecraft-action-figure-v1");

    const pageImage = outputPage(page);
    await expect(readPixel(pageImage, toggle.x, toggle.y)).resolves.toEqual({
      r: 123,
      g: 123,
      b: 123,
      a: 255,
    });
    await page.getByText(toggle.label, { exact: true }).click();
    await expect(page.getByLabel(toggle.label)).not.toBeChecked();
    await expect
      .poll(async () => readPixel(pageImage, toggle.x, toggle.y))
      .toEqual(toggle.rgba);
  });
}

test("minecraft action figure generator hides its presentation overlays", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const pageImage = outputPage(page);
  for (const toggle of presentationToggleExpectations) {
    await page.getByText(toggle.label, { exact: true }).click();
  }
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-action-figure-presentation-off-page-1.png"
  );
});

test("minecraft action figure generator renders a custom skin upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(async () => readPixel(pageImage, 105, 101))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-action-figure-custom-skin-page-1.png"
  );
});

test("minecraft action figure generator enters M16 mode from its canvas region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-action-figure-v1");

  const pageImage = outputPage(page);
  const defaultSrc = await pageImage.getAttribute("src");
  await regions(page).nth(6).click();
  await expect.poll(() => pageImage.getAttribute("src")).not.toBe(defaultSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-action-figure-m16-page-1.png"
  );
});
