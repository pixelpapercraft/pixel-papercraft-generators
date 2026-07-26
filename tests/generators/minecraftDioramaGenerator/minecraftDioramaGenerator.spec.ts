import { expect, test, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const pageImageUrl = (page: Page) => outputPage(page).getAttribute("src");

test("minecraft diorama generator exposes the V2 grid-editor controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await expect(page.getByLabel("Version")).toBeVisible();
  await expect(page.getByLabel("Block Preset")).toHaveValue("Full Blocks");
  await expect(page.getByLabel("Diorama Size")).toHaveValue("800");
  await expect(page.getByLabel("Edit Mode")).toHaveValue("Blocks");
  await expect(page.getByLabel("Show Edit Regions")).toBeChecked();
  await expect(page.getByRole("button", { name: "Add Page" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Remove Page" })).toBeVisible();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
});

test("minecraft diorama generator renders the default V2 grid", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-diorama-default-page-1.png"
  );
});

test("minecraft diorama generator places a selected block texture on a clicked face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  const before = await pageImageUrl(page);
  await page.getByTitle("lever").click();
  await page.getByTestId("region-face:0:0").click();
  await expect.poll(() => pageImageUrl(page)).not.toBe(before);

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-diorama-placed-texture-page-1.png"
  );
});

test("minecraft diorama generator preserves its grid while adding and removing pages", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByRole("button", { name: "Add Page" }).click();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(2);

  await page.getByRole("button", { name: "Remove Page" }).click();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
});
