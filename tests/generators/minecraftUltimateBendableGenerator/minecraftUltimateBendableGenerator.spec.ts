import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const skinOptions = [
  "None",
  "Alex",
  "Ari",
  "Efe",
  "Kai",
  "Makena",
  "Noor",
  "Steve",
  "Sunny",
  "Zuri",
  "Default",
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

const waitForImageChange = async (pageImage: Locator, previousSrc: string) => {
  await expect.poll(() => pageImage.getAttribute("src")).not.toBe(previousSrc);
};

const currentSrc = async (pageImage: Locator): Promise<string> => {
  const src = await pageImage.getAttribute("src");
  expect(src).not.toBeNull();
  return src ?? "";
};

test("minecraft ultimate bendable generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  await expect(page.getByRole("combobox")).toHaveCount(2);
  await expect(skinSelect(page)).toHaveValue("Default");
  await expect(skinSelect(page).locator("option")).toHaveText(skinOptions);
  await expect(modelTypeSelect(page)).toHaveValue("Wide");
  await expect(modelTypeSelect(page).locator("option")).toHaveText([
    "Wide",
    "Slim",
  ]);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Color Codes")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft ultimate bendable generator matches the default composition", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-ultimate-bendable-default-page-1.png"
  );
});

test("minecraft ultimate bendable generator renders every skin option distinctly", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  const pageImage = outputPage(page);
  const renderedImages = new Set<string>();
  let previousSrc = await currentSrc(pageImage);

  // Capture the initially selected Default before changing away from it. This
  // avoids treating the picker's intermediate re-render with the prior loaded
  // texture as Default while the preset image is still loading.
  const enumerationOrder = [
    "Default",
    ...skinOptions.filter((option) => option !== "Default"),
  ];
  for (const option of enumerationOrder) {
    await skinSelect(page).selectOption(option === "None" ? "" : option);
    if (option !== "Default") {
      await waitForImageChange(pageImage, previousSrc);
    }
    previousSrc = await currentSrc(pageImage);
    renderedImages.add(previousSrc);
  }

  expect(renderedImages.size).toBe(skinOptions.length);
});

test("minecraft ultimate bendable generator renders a custom Slim skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  const pageImage = outputPage(page);
  let previousSrc = await currentSrc(pageImage);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await waitForImageChange(pageImage, previousSrc);
  previousSrc = await currentSrc(pageImage);
  await modelTypeSelect(page).selectOption("Slim");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-ultimate-bendable-custom-slim-page-1.png"
  );
});

test("minecraft ultimate bendable generator hides presentation layers independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  const pageImage = outputPage(page);
  for (const label of ["Show Folds", "Show Color Codes", "Show Labels"]) {
    const previousSrc = await currentSrc(pageImage);
    await page.getByText(label, { exact: true }).click();
    await expect(page.getByLabel(label)).not.toBeChecked();
    await waitForImageChange(pageImage, previousSrc);
  }
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-ultimate-bendable-presentation-off-page-1.png"
  );
});

test("minecraft ultimate bendable generator toggles all six skin overlays", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-ultimate-bendable-v1");

  const pageImage = outputPage(page);
  let previousSrc = await currentSrc(pageImage);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await waitForImageChange(pageImage, previousSrc);

  for (let regionIndex = 0; regionIndex < 6; regionIndex += 1) {
    previousSrc = await currentSrc(pageImage);
    await regions(page).nth(regionIndex).click();
    await waitForImageChange(pageImage, previousSrc);
  }
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-ultimate-bendable-overlays-off-page-1.png"
  );
});
