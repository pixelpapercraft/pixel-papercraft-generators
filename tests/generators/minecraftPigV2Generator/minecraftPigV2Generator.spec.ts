import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const fixture = "src/generators/_common/fixtures/testSheet.png";
const outputPages = (page: Page): Locator =>
  page.getByTestId("generator-page-image");
const regions = (page: Page): Locator =>
  outputPages(page).first().locator("xpath=..").locator("div.absolute");
const toggle = (page: Page, label: string) =>
  page.getByLabel(label).evaluate((element: HTMLElement) => element.click());
const textureOptions: Record<string, string[]> = {
  Pig: [
    "None",
    "Pig (Vanilla)",
    "Pig (Vanilla) (Programmer Art)",
    "Pig (Faithful)",
    "Pig (Space Pig)",
  ],
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
  "Nose Style": ["Flat", "3D"],
  "Head Style": ["Simple", "Advanced", "Advanced (Standard)"],
  "Saddle Style": ["Attached", "Separate"],
  "Helmet Style": ["Attached", "Separate"],
  "Boots Style": ["Attached", "Separate"],
};

async function screenshot(page: Page, name: string): Promise<void> {
  const pages = outputPages(page);
  const count = await pages.count();
  for (let index = 0; index < count; index += 1) {
    const image = pages.nth(index);
    await renderImageAtNaturalSize(image);
    await expect(image).toHaveScreenshot(`${name}-page-${index + 1}.png`);
  }
}

test("minecraft pig exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-v2");
  await expect(page.getByRole("combobox")).toHaveCount(8);
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
    "Show Ultra Mini",
  ]) {
    await expect(page.getByLabel(label)).toBeChecked();
  }
  await expect(page.getByLabel("Transparent Background")).not.toBeChecked();
  for (const label of Object.keys(textureOptions)) {
    await expect(page.getByLabel(`Upload ${label} texture file`)).toBeVisible();
  }
  await expect(outputPages(page)).toHaveCount(1);
  await expect(regions(page)).toHaveCount(1);
});

test("minecraft pig matches the default composition", async ({ page }) => {
  await page.goto("/generator/minecraft-pig-v2");
  await screenshot(page, "minecraft-pig-default");
});

test("minecraft pig accepts every enumerable texture choice and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-v2");
  for (const [label, options] of Object.entries(textureOptions)) {
    const select = page.getByLabel(label, { exact: true });
    const renderedPngs = new Set<string>();
    for (const option of options) {
      const previousPng = await outputPages(page).first().getAttribute("src");
      await select.selectOption({ label: option });
      await expect(select).toHaveValue(option === "None" ? "" : option);
      if (option !== "None") {
        await expect
          .poll(() => outputPages(page).first().getAttribute("src"))
          .not.toBe(previousPng);
      }
      const renderedPng = await outputPages(page).first().getAttribute("src");
      expect(renderedPng).not.toBeNull();
      if (renderedPng) renderedPngs.add(renderedPng);
    }
    expect(renderedPngs.size).toBe(options.length);
  }
});

test("minecraft pig renders advanced 3D composition without presentation overlays", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-v2");
  await page.getByLabel("Nose Style").selectOption({ label: "3D" });
  await page
    .getByLabel("Head Style")
    .selectOption({ label: "Advanced (Standard)" });
  for (const label of [
    "Show Folds",
    "Show Labels",
    "Show Titles",
    "Show Ultra Mini",
  ])
    await toggle(page, label);
  await toggle(page, "Transparent Background");
  await screenshot(page, "minecraft-pig-advanced-overlays-off");
});

test("minecraft pig creates one accessories page for all separate accessories", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-v2");
  for (const label of ["Saddle Style", "Helmet Style", "Boots Style"]) {
    await page.getByLabel(label).selectOption({ label: "Separate" });
  }
  await expect(outputPages(page)).toHaveCount(2);
  await screenshot(page, "minecraft-pig-separate-accessories");
  await page.getByLabel("Saddle Style").selectOption({ label: "Attached" });
  await page.getByLabel("Helmet Style").selectOption({ label: "Attached" });
  await page.getByLabel("Boots Style").selectOption({ label: "Attached" });
  await expect(outputPages(page)).toHaveCount(1);
});

test("minecraft pig renders custom pig saddle and armor uploads", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-pig-v2");
  for (const label of Object.keys(textureOptions)) {
    await page
      .getByLabel(`Upload ${label} texture file`)
      .setInputFiles(fixture);
  }
  await screenshot(page, "minecraft-pig-custom-textures");
});

test("minecraft pig helmet region toggles its overlay", async ({ page }) => {
  await page.goto("/generator/minecraft-pig-v2");
  await expect(regions(page)).toHaveCount(1);
  await regions(page).click();
  await screenshot(page, "minecraft-pig-helmet-overlay-hidden");
});
