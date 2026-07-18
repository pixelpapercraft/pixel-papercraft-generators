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
const tentacleCases = [
  { index: 0, defaultType: 5, targetType: 1 },
  { index: 1, defaultType: 7, targetType: 2 },
  { index: 2, defaultType: 3, targetType: 3 },
  { index: 3, defaultType: 3, targetType: 4 },
  { index: 4, defaultType: 3, targetType: 5 },
  { index: 5, defaultType: 1, targetType: 6 },
  { index: 6, defaultType: 1, targetType: 7 },
  { index: 7, defaultType: 1, targetType: 8 },
];

async function screenshot(page: Page, name: string): Promise<void> {
  const image = outputPages(page).first();
  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot(`${name}-page-1.png`);
}

test("minecraft squid character exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-squid-character-v2");
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
  await expect(outputPages(page)).toHaveCount(1);
  await expect(regions(page)).toHaveCount(10);
});

test("minecraft squid character matches the default composition", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-squid-character-v2");
  await screenshot(page, "minecraft-squid-character-default");
});

test("minecraft squid character accepts every skin choice and explicit None", async ({
  page,
}) => {
  test.slow();
  await page.goto("/generator/minecraft-squid-character-v2");
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

test("minecraft squid character renders a custom slim skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-squid-character-v2");
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
  await screenshot(page, "minecraft-squid-character-custom-slim");
});

test("minecraft squid character toggles folds", async ({ page }) => {
  await page.goto("/generator/minecraft-squid-character-v2");
  await page
    .getByLabel("Show Folds")
    .evaluate((element: HTMLElement) => element.click());
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await screenshot(page, "minecraft-squid-character-folds-off");
});

test("minecraft squid character toggles both overlay regions", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-squid-character-v2");
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  await regions(page).nth(0).click();
  await regions(page).nth(1).click();
  await screenshot(page, "minecraft-squid-character-overlays-off");
});

test("minecraft squid character cycles all eight tentacle regions through all types", async ({
  page,
}) => {
  test.slow();
  for (const { index, defaultType, targetType } of tentacleCases) {
    await page.goto("/generator/minecraft-squid-character-v2");
    await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
    const clicks = ((targetType - defaultType + 7) % 8) + 1;
    for (let click = 0; click < clicks; click += 1)
      await regions(page)
        .nth(index + 2)
        .click();
    await screenshot(
      page,
      `minecraft-squid-character-tentacle-${index + 1}-type-${targetType}`
    );
  }
});
