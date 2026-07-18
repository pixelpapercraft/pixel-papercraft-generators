import { expect, test, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const textureFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const witherSkinSelect = (page: Page) =>
  page.getByLabel("Wither Skin", { exact: true });

const pageImageUrl = (page: Page) => outputPage(page).getAttribute("src");

test("minecraft wither generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-wither");

  const witherSkin = witherSkinSelect(page);
  await expect(witherSkin).toBeVisible();
  await expect(witherSkin).toHaveValue("");
  await expect(witherSkin.locator("option")).toHaveText([
    "None",
    "Minecraft Wither",
  ]);
  await expect(page.getByLabel("Upload Wither Skin texture file")).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await expect(page.locator("input[type=range]")).toHaveCount(0);
  await expect(page.getByTestId("generator-region")).toHaveCount(0);
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
});

test("minecraft wither generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-wither");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-wither-default-page-1.png"
  );
});

test("minecraft wither generator renders its fallback, preset, and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-wither");

  const witherSkin = witherSkinSelect(page);
  const fallback = await pageImageUrl(page);
  expect(fallback).toMatch(/^data:image\/png/);

  await witherSkin.selectOption("Minecraft Wither");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-wither-default-page-1.png"
  );

  await witherSkin.selectOption("");
  await expect.poll(() => pageImageUrl(page)).not.toBe(fallback);
  const none = await pageImageUrl(page);
  expect(none).toMatch(/^data:image\/png/);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-wither-none-page-1.png");
});

test("minecraft wither generator renders a custom texture", async ({ page }) => {
  await page.goto("/generator/minecraft-wither");

  const fallback = await pageImageUrl(page);
  await page
    .getByLabel("Upload Wither Skin texture file")
    .setInputFiles(textureFixturePath);
  await expect.poll(() => pageImageUrl(page)).not.toBe(fallback);

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-wither-custom-texture-page-1.png"
  );
});
