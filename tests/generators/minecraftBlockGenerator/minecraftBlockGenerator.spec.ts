import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

test("minecraft block generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "minecraft-block-default-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft block generator matches the rotated and flipped screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("lever");
  await page.getByTitle("lever").click();
  await page.getByLabel("Rotate texture").click();
  await page.getByLabel("Flip texture vertical").click();
  await page.getByTestId("region-BlockFaceTop1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-rotated-and-flipped-page-1.png"
  );
});

test("minecraft block generator matches the rotated and horizontally flipped screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("observer");
  await page.getByTitle("observer front").click();
  await page.getByLabel("Rotate texture").click();
  await page.getByLabel("Flip texture horizontal").click();
  await page.getByTestId("region-BlockFaceTop1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-rotated-and-horizontal-flipped-page-1.png"
  );
});

test("minecraft block generator places rotated and horizontally flipped amethyst cluster on the left face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("amethyst cluster");
  await page.getByTitle("amethyst cluster").click();
  await page.getByLabel("Rotate texture").click();
  await page.getByLabel("Flip texture horizontal").click();
  await page.getByTestId("region-BlockFaceLeft1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-amethyst-cluster-rotated-and-horizontal-flipped-left-face-page-1.png"
  );
});

test("minecraft block generator places rotated and horizontally flipped amethyst cluster on the right face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("amethyst cluster");
  await page.getByTitle("amethyst cluster").click();
  await page.getByLabel("Rotate texture").click();
  await page.getByLabel("Flip texture horizontal").click();
  await page.getByTestId("region-BlockFaceRight1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-amethyst-cluster-rotated-and-horizontal-flipped-right-face-page-1.png"
  );
});

test("minecraft block generator renders the shelf block", async ({ page }) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("bee nest top");
  await page.getByRole("button", { name: "bee nest top", exact: true }).click();
  await page.getByLabel("Block 1 Type").selectOption({ label: "Shelf" });
  await page.getByTestId("region-ShelfFace1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-shelf-bee-nest-top-page-1.png"
  );
});

test("minecraft block generator shows the selected tint in the preview", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("lever");
  await page.getByTitle("lever").click();
  await page
    .getByLabel("Tint")
    .selectOption({ label: "Plains / Beach / Dripstone / Deep Dark" });

  const preview = page.getByTestId("texture-picker-preview");
  await expect(preview).toBeVisible();

  await expect(preview).toHaveScreenshot("minecraft-block-tinted-preview.png");
});

test("minecraft block generator shows the before and after tinting on the page", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("grass_block_top");
  await page.getByTitle("grass block top").click();
  await page.getByTestId("region-BlockFaceTop1").click();

  await page
    .getByLabel("Tint")
    .selectOption({ label: "Plains / Beach / Dripstone / Deep Dark" });
  await page.getByTestId("region-BlockFaceFront1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-tinted-before-and-after-page-1.png"
  );
});

test("minecraft block generator renders custom atlas textures", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  const sheetPath = path.join(
    process.cwd(),
    "src/generators/testing/images/testSheet.png"
  );
  const sheetBytes = fs.readFileSync(sheetPath);

  await page.getByLabel("Version").selectOption("custom");
  await page
    .getByLabel("Select one or more custom texture files")
    .setInputFiles([
      {
        name: "atlas-a.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
      {
        name: "atlas-b.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
    ]);

  await expect(page.getByTitle("atlas-a")).toBeVisible();
  await expect(page.getByTitle("atlas-b")).toBeVisible();

  await page.getByTitle("atlas-a").click();
  await page.getByTestId("region-BlockFaceTop1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-custom-atlas-page-1.png"
  );
});

test("minecraft block generator clears the selected texture when switching to custom", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  await page.getByPlaceholder("Search...").fill("lever");
  await page.getByTitle("lever").click();
  await page.getByLabel("Version").selectOption("custom");

  await expect(page.getByTestId("texture-picker-preview")).toHaveCount(0);

  await page.getByTestId("region-BlockFaceTop1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-custom-switch-clears-selected-texture-page-1.png"
  );
});

test("minecraft block generator clears the custom selection when the version changes", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-block");

  const sheetPath = path.join(
    process.cwd(),
    "src/generators/testing/images/testSheet.png"
  );
  const sheetBytes = fs.readFileSync(sheetPath);

  await page.getByLabel("Version").selectOption("custom");
  await page
    .getByLabel("Select one or more custom texture files")
    .setInputFiles([
      {
        name: "atlas-a.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
      {
        name: "atlas-b.png",
        mimeType: "image/png",
        buffer: sheetBytes,
      },
    ]);

  await page.getByTitle("atlas-a").click();
  await page.getByLabel("Version").selectOption("minecraft-1.7.10-items");
  await page.getByTestId("region-BlockFaceTop1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-block-version-switch-clears-custom-selection-page-1.png"
  );
});
