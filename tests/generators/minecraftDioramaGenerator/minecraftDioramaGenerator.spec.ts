import { expect, test } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

const grassBlockTopGray: Rgba = { r: 179, g: 179, b: 179, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };

test("minecraft diorama renders the background and title", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  await expect(page.getByText("Instructions", { exact: true })).toBeVisible();

  const pageImage = page.getByTestId("generator-page-image").first();
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});

test("places a selected block texture on a clicked face", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByTitle("grass block top", { exact: true }).click();
  await page.getByTestId("region-BlockFace0 0").click();

  const pageImage = page.getByTestId("generator-page-image").first();
  expect(await readPixel(pageImage, 106, 105)).toEqual(grassBlockTopGray);
});

test("erases the most recently placed texture from a face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const region = page.getByTestId("region-BlockFace0 0");
  await page.getByTitle("grass block top", { exact: true }).click();
  await region.click();
  await page.getByLabel("Erase texture").click();
  await region.click();

  const pageImage = page.getByTestId("generator-page-image").first();
  expect(await readPixel(pageImage, 106, 105)).toEqual(white);
});

test("Quarter Blocks preset produces a finer grid than Full Blocks", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const regions = page.locator('[data-testid^="region-BlockFace"]');
  await expect(regions).toHaveCount(24);

  await page.getByLabel("Block Preset").selectOption("Quarter Blocks");

  await expect(regions).toHaveCount(96);
});
