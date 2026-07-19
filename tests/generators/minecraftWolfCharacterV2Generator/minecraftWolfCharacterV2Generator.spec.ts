import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const fixture = "src/generators/_common/fixtures/testSheet.png";
const route = "/generator/minecraft-wolf-character";
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

const outputPages = (page: Page): Locator =>
  page.getByTestId("generator-page-image");

const regions = (page: Page): Locator =>
  outputPages(page).first().locator("xpath=..").locator("div.absolute");

async function imageSource(page: Page): Promise<string | null> {
  return outputPages(page).first().getAttribute("src");
}

async function expectImageChange(page: Page, previous: string | null) {
  await expect.poll(() => imageSource(page)).not.toBe(previous);
}

async function screenshot(page: Page, name: string): Promise<void> {
  const image = outputPages(page).first();
  await renderImageAtNaturalSize(image);
  await expect(image).toHaveScreenshot(`${name}-page-1.png`);
}

test("minecraft wolf character exposes its complete control contract", async ({
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
  await expect(page.getByLabel("Show Red Eyes")).not.toBeChecked();
  await expect(outputPages(page)).toHaveCount(1);
  await expect(regions(page)).toHaveCount(7);
});

test("minecraft wolf character matches the default composition", async ({
  page,
}) => {
  await page.goto(route);
  await screenshot(page, "minecraft-wolf-character-default");
});

test("minecraft wolf character accepts every skin choice and explicit None", async ({
  page,
}) => {
  test.slow();
  await page.goto(route);
  const rendered = new Set<string>();
  for (const option of skinOptions) {
    const previous = await imageSource(page);
    await page.getByRole("combobox").first().selectOption({ label: option });
    await expectImageChange(page, previous);
    const source = await imageSource(page);
    expect(source).not.toBeNull();
    if (source) rendered.add(source);
  }
  expect(rendered.size).toBe(skinOptions.length);
});

test("minecraft wolf character renders a custom slim skin", async ({
  page,
}) => {
  await page.goto(route);
  const beforeUpload = await imageSource(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  await expectImageChange(page, beforeUpload);
  const beforeSlim = await imageSource(page);
  await page.getByRole("combobox").nth(1).selectOption("Slim");
  await expectImageChange(page, beforeSlim);
  await screenshot(page, "minecraft-wolf-character-custom-slim");
});

test("minecraft wolf character hides every outer skin layer independently", async ({
  page,
}) => {
  test.slow();
  for (let index = 0; index < 6; index += 1) {
    await page.goto(route);
    await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
    const previous = await imageSource(page);
    await regions(page).nth(index).click();
    await expectImageChange(page, previous);
  }

  await page.goto(route);
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  for (let index = 0; index < 6; index += 1) {
    await regions(page).nth(index).click();
  }
  await screenshot(page, "minecraft-wolf-character-outer-layers-hidden");
});

test("minecraft wolf character cycles through every tail type and returns", async ({
  page,
}) => {
  await page.goto(route);
  const beforeUpload = await imageSource(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  await expectImageChange(page, beforeUpload);
  const initial = await imageSource(page);
  expect(initial).not.toBeNull();
  const sources = new Set<string>();
  if (initial) sources.add(initial);

  for (let click = 0; click < 3; click += 1) {
    const previous = await imageSource(page);
    await regions(page).nth(6).click();
    await expectImageChange(page, previous);
    const source = await imageSource(page);
    if (source) sources.add(source);
  }
  expect(sources.size).toBe(4);
  await screenshot(page, "minecraft-wolf-character-tail-type-4");

  await regions(page).nth(6).click();
  await expect.poll(() => imageSource(page)).toBe(initial);
});

test("minecraft wolf character toggles folds, labels, and red eyes independently", async ({
  page,
}) => {
  await page.goto(route);
  for (const label of ["Show Folds", "Show Labels", "Show Red Eyes"]) {
    const previous = await imageSource(page);
    await page.getByText(label, { exact: true }).click();
    await expectImageChange(page, previous);
  }
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect(page.getByLabel("Show Red Eyes")).toBeChecked();
  await screenshot(page, "minecraft-wolf-character-overlays-and-red-eyes");
});
