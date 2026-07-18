import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const fixture = "src/generators/_common/fixtures/testSheet.png";
const outputPages = (page: Page): Locator =>
  page.getByTestId("generator-page-image");
const regions = (page: Page): Locator =>
  outputPages(page).first().locator("xpath=..").locator("div.absolute");
const toggle = (page: Page, label: string) =>
  page.getByLabel(label).evaluate((element: HTMLElement) => element.click());
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
const textureOptions: Record<string, string[]> = {
  Saddle: [
    "None",
    "Saddle (Vanilla)",
    "Saddle (Vanilla) (Programmer Art)",
    "Saddle (Faithful)",
    "Saddle (Space Pig)",
  ],
  "Armor (Layer 1)": [
    "None",
    "Diamond Armor (Vanilla)",
    "Gold Armor (Vanilla)",
    "Chainmail Armor (Vanilla)",
    "Iron Armor (Vanilla)",
    "Diamond Armor (Faithful)",
    "Gold Armor (Faithful)",
    "Chainmail Armor (Faithful)",
    "Iron Armor (Faithful)",
    "Armor (Space Pig)",
  ],
};
const styleOptions: Record<string, string[]> = {
  "Head Style": ["Simple", "Advanced", "Advanced (Standard)"],
  "Saddle Style": ["Attached", "Separate"],
  "Helmet Style": ["Attached", "Separate"],
  "Boots Style": ["Attached", "Separate"],
};

async function screenshot(page: Page, name: string): Promise<void> {
  for (let index = 0; index < (await outputPages(page).count()); index += 1) {
    const image = outputPages(page).nth(index);
    await renderImageAtNaturalSize(image);
    await expect(image).toHaveScreenshot(`${name}-page-${index + 1}.png`);
  }
}

test("minecraft pig character exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-character-v2");
  await expect(page.getByRole("combobox")).toHaveCount(8);
  await expect(page.getByRole("combobox").first().locator("option")).toHaveText(
    skinOptions
  );
  await expect(page.getByRole("combobox").nth(1).locator("option")).toHaveText([
    "Wide",
    "Slim",
  ]);
  for (const [label, options] of Object.entries({
    ...textureOptions,
    ...styleOptions,
  })) {
    await expect(
      page.getByLabel(label, { exact: true }).locator("option")
    ).toHaveText(options);
  }
  for (const label of [
    "Show Folds",
    "Show Labels",
    "Show Titles",
    "Separate Snout",
    "Show Ultra Mini",
  ])
    await expect(page.getByLabel(label)).toBeChecked();
  await expect(page.getByLabel("Transparent Background")).not.toBeChecked();
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  for (const label of Object.keys(textureOptions))
    await expect(page.getByLabel(`Upload ${label} texture file`)).toBeVisible();
  await expect(outputPages(page)).toHaveCount(1);
  await expect(regions(page)).toHaveCount(7);
});

test("minecraft pig character matches the default composition", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-character-v2");
  await screenshot(page, "minecraft-pig-character-default");
});

test("minecraft pig character accepts every enumerable texture choice and explicit None", async ({
  page,
}) => {
  test.slow();
  await page.goto("/generator/minecraft-pig-character-v2");
  const renderedSkins = new Set<string>();
  for (const option of skinOptions) {
    const select = page.getByRole("combobox").first();
    const previous = await outputPages(page).first().getAttribute("src");
    await select.selectOption({ label: option });
    await expect
      .poll(() => outputPages(page).first().getAttribute("src"))
      .not.toBe(previous);
    const src = await outputPages(page).first().getAttribute("src");
    expect(src).not.toBeNull();
    if (src) renderedSkins.add(src);
  }
  expect(renderedSkins.size).toBe(skinOptions.length);
  for (const [label, options] of Object.entries(textureOptions)) {
    const select = page.getByLabel(label, { exact: true });
    const rendered = new Set<string>();
    for (const option of options) {
      const previous = await outputPages(page).first().getAttribute("src");
      await select.selectOption({ label: option });
      await expect(select).toHaveValue(option === "None" ? "" : option);
      const intentionallySameAsPrevious =
        label === "Saddle" && option === "Saddle (Vanilla) (Programmer Art)";
      if (option !== "None" && !intentionallySameAsPrevious) {
        await expect
          .poll(() => outputPages(page).first().getAttribute("src"))
          .not.toBe(previous);
      }
      const src = await outputPages(page).first().getAttribute("src");
      expect(src).not.toBeNull();
      if (src) rendered.add(src);
    }
    // V1 intentionally maps both Vanilla saddle labels to pig_saddle2.png.
    const expectedUniqueRenders =
      label === "Saddle" ? options.length - 1 : options.length;
    expect(rendered.size).toBe(expectedUniqueRenders);
  }
});

test("minecraft pig character renders custom textures and slim geometry", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-character-v2");
  await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
  await page.getByRole("combobox").nth(1).selectOption("Slim");
  for (const label of Object.keys(textureOptions))
    await page
      .getByLabel(`Upload ${label} texture file`)
      .setInputFiles(fixture);
  await screenshot(page, "minecraft-pig-character-custom-slim");
});

test("minecraft pig character exercises styles and presentation controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-character-v2");
  await page.getByLabel("Head Style").selectOption("Advanced (Standard)");
  for (const [label, options] of Object.entries(styleOptions)) {
    for (const option of options)
      await page.getByLabel(label).selectOption(option);
  }
  for (const label of ["Saddle Style", "Helmet Style", "Boots Style"])
    await page.getByLabel(label).selectOption("Attached");
  for (const label of [
    "Show Folds",
    "Show Labels",
    "Show Titles",
    "Separate Snout",
    "Show Ultra Mini",
  ])
    await toggle(page, label);
  await toggle(page, "Transparent Background");
  await screenshot(page, "minecraft-pig-character-advanced-overlays-off");
});

test("minecraft pig character toggles all seven regions", async ({ page }) => {
  test.slow();
  for (let index = 0; index < 7; index += 1) {
    // V1 rebuilds its controls after a region click and drops custom-upload
    // state, so exercise every region independently from the same composition.
    await page.goto("/generator/minecraft-pig-character-v2");
    const beforeSkin = await outputPages(page).first().getAttribute("src");
    await page.getByLabel("Upload Skin skin file").setInputFiles(fixture);
    await expect
      .poll(() => outputPages(page).first().getAttribute("src"))
      .not.toBe(beforeSkin);
    const beforeArmor = await outputPages(page).first().getAttribute("src");
    await page
      .getByLabel("Armor (Layer 1)", { exact: true })
      .selectOption("Diamond Armor (Vanilla)");
    await expect
      .poll(() => outputPages(page).first().getAttribute("src"))
      .not.toBe(beforeArmor);
    await expect(regions(page)).toHaveCount(7);
    await regions(page).nth(index).click();
    await screenshot(page, `minecraft-pig-character-region-${index + 1}`);
  }
});

test("minecraft pig character creates one conditional accessories page", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-character-v2");
  for (const label of ["Saddle Style", "Helmet Style", "Boots Style"])
    await page.getByLabel(label).selectOption("Separate");
  await expect(outputPages(page)).toHaveCount(2);
  await expect(regions(page).first()).toBeVisible();
  await screenshot(page, "minecraft-pig-character-separate-accessories");
  for (const label of ["Saddle Style", "Helmet Style", "Boots Style"])
    await page.getByLabel(label).selectOption("Attached");
  await expect(outputPages(page)).toHaveCount(1);
});
