import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const fixture = "src/generators/_common/fixtures/testSheet.png";

const outputPages = (page: Page): Locator =>
  page.getByTestId("generator-page-image");

const regions = (page: Page): Locator =>
  outputPages(page).first().locator("xpath=..").locator("div.absolute");

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

// Six clickable overlay-hide regions in DOM (definition) order:
// helmet, jacket, leftSleeve, rightSleeve, leftPant, rightPant.
const regionCount = 6;

const route = "/generator/minecraft-villager-character-v2";

async function screenshot(page: Page, name: string): Promise<void> {
  const image = outputPages(page).first();
  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot(`${name}-page-1.png`);
}

test("minecraft villager character exposes its complete control contract", async ({
  page,
}) => {
  await page.goto(route);
  await expect(page.getByRole("combobox")).toHaveCount(2);
  await expect(page.getByRole("combobox").first().locator("option")).toHaveText(
    skinOptions
  );
  await expect(page.getByRole("combobox").first()).toHaveValue("Default");
  await expect(page.getByRole("combobox").nth(1).locator("option")).toHaveText([
    "Wide",
    "Slim",
  ]);
  await expect(page.getByRole("combobox").nth(1)).toHaveValue("Wide");
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(outputPages(page)).toHaveCount(1);
  await expect(regions(page)).toHaveCount(regionCount);
});

test("minecraft villager character matches the default composition", async ({
  page,
}) => {
  await page.goto(route);
  await screenshot(page, "minecraft-villager-character-default");
});

test("minecraft villager character accepts every skin choice and explicit None", async ({
  page,
}) => {
  test.slow();
  await page.goto(route);
  const rendered = new Set<string>();
  for (const option of skinOptions) {
    const previous = await outputPages(page).first().getAttribute("src");
    await page.getByRole("combobox").first().selectOption({ label: option });
    await expect
      .poll(() => outputPages(page).first().getAttribute("src"))
      .not.toBe(previous);
    const src = await outputPages(page).first().getAttribute("src");
    expect(src).not.toBeNull();
    if (src) rendered.add(src);
  }
  expect(rendered.size).toBe(skinOptions.length);
});

test("minecraft villager character renders a custom slim skin", async ({
  page,
}) => {
  await page.goto(route);
  const beforeUpload = await outputPages(page).first().getAttribute("src");
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  await expect
    .poll(() => outputPages(page).first().getAttribute("src"))
    .not.toBe(beforeUpload);
  const beforeSlim = await outputPages(page).first().getAttribute("src");
  await page.getByRole("combobox").nth(1).selectOption("Slim");
  await expect
    .poll(() => outputPages(page).first().getAttribute("src"))
    .not.toBe(beforeSlim);
  await screenshot(page, "minecraft-villager-character-custom-slim");
});

test("minecraft villager character hides every outer skin layer independently", async ({
  page,
}) => {
  test.slow();
  await page.goto(route);
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  // With the testSheet skin uploaded every overlay face is a distinct colour,
  // so hiding each region in turn must change the whole-image data URL.
  for (let index = 0; index < regionCount; index += 1) {
    const previous = await outputPages(page).first().getAttribute("src");
    await regions(page).nth(index).click();
    await expect
      .poll(() => outputPages(page).first().getAttribute("src"))
      .not.toBe(previous);
  }
  await screenshot(page, "minecraft-villager-character-outer-layers-hidden");
});

test("minecraft villager character hides folds and labels independently", async ({
  page,
}) => {
  await page.goto(route);
  const beforeFolds = await outputPages(page).first().getAttribute("src");
  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect
    .poll(() => outputPages(page).first().getAttribute("src"))
    .not.toBe(beforeFolds);
  const beforeLabels = await outputPages(page).first().getAttribute("src");
  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect
    .poll(() => outputPages(page).first().getAttribute("src"))
    .not.toBe(beforeLabels);
  await screenshot(page, "minecraft-villager-character-overlays-off");
});
