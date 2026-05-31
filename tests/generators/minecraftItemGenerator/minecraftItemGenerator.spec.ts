import fs from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

async function selectItemByTitle(page: Page, search: string, title: string) {
  await page.getByPlaceholder("Search...").fill(search);
  await page.locator(`button[title="${title}"]`).first().click();
}

async function setItemSize(
  page: Page,
  size: "Small (200%)" | "Medium (400%)" | "Large (700%)" | "Extra Large (1400%)" | "Custom"
) {
  await page.getByLabel("Item Size").selectOption({ label: size });

  if (size === "Custom") {
    const customScale = page.getByLabel("Custom Scale (%)");
    await expect(customScale).toHaveAttribute("min", "100");
    await expect(customScale).toHaveAttribute("max", "1600");
    await expect(customScale).toHaveAttribute("step", "100");
    await customScale.press("ArrowRight");
    await expect(page.getByText("500")).toBeVisible();
  }
}

function getPreviewTile(page: Page) {
  return page.getByTestId("texture-picker-preview").locator("div").nth(1);
}

test("minecraft item generator matches the default screenshots", async ({ page }) => {
  await page.goto("/generator/minecraft-item");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "minecraft-item-default-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft item generator keeps instructions collapsed in the left column", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  const sidebar = page.getByTestId("generator-sidebar");
  await expect(sidebar).toBeVisible();
  await expect(sidebar).toHaveScreenshot(
    "minecraft-item-instructions-sidebar.png"
  );
});

test("minecraft item generator renders custom atlas textures", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

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
  await page.getByLabel("Add Item").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-custom-atlas-page-1.png"
  );
});

test("minecraft item generator supports rotated and flipped textures", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await expect(page.getByLabel("Rotate texture")).toBeVisible();
  await expect(page.getByLabel("Flip texture horizontal")).toBeVisible();
  await expect(page.getByLabel("Flip texture vertical")).toBeVisible();
  await expect(page.getByLabel("Erase texture")).toHaveCount(0);
  await expect(page.getByLabel("Add Item")).toBeVisible();
  await expect(page.getByLabel("Overlay Item")).toBeVisible();
  await expect(page.getByLabel("Remove Item")).toBeVisible();
  await expect(page.getByLabel("Clear")).toBeVisible();

  await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");
  await page.getByPlaceholder("Search...").fill("sword");
  await page.locator('button[title*="diamond sword"]').first().click();
  await page.getByLabel("Rotate texture").click();
  await page.getByLabel("Flip texture horizontal").click();
  await page.getByLabel("Add Item").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-rotated-and-flipped-page-1.png"
  );
});

test("minecraft item generator resets rotation when a new texture is selected", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");
  await selectItemByTitle(page, "sword", "diamond sword");
  await page.getByLabel("Rotate texture").click();

  await expect(getPreviewTile(page)).toHaveAttribute(
    "style",
    /transform:\s*rotate\(90deg\)/
  );

  await page.getByLabel("Add Item").click();
  await selectItemByTitle(page, "bow", "bow");

  await expect(getPreviewTile(page)).toHaveAttribute(
    "style",
    /transform:\s*rotate\(0deg\)/
  );
});

test("minecraft item generator resets flip when a new texture is selected", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");
  await selectItemByTitle(page, "sword", "diamond sword");
  await page.getByLabel("Flip texture horizontal").click();

  await expect(getPreviewTile(page)).toHaveAttribute(
    "style",
    /scaleX\(-1\)/
  );

  await page.getByLabel("Add Item").click();
  await selectItemByTitle(page, "bow", "bow");

  await expect(getPreviewTile(page)).toHaveAttribute(
    "style",
    /transform:\s*rotate\(0deg\)/
  );
  await expect(getPreviewTile(page)).not.toHaveAttribute(
    "style",
    /scaleX\(-1\)/
  );
});

test("minecraft item generator supports custom item scales", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByPlaceholder("Search...").fill("sword");
  await page.getByTitle("diamond sword").click();

  const sizeOptions = [
    "Small (200%)",
    "Medium (400%)",
    "Large (700%)",
    "Extra Large (1400%)",
    "Custom",
  ] as const;

  for (const sizeOption of sizeOptions) {
    await page.getByLabel("Item Size").selectOption({ label: sizeOption });

    if (sizeOption === "Custom") {
      const customScale = page.getByLabel("Custom Scale (%)");
      await expect(customScale).toHaveAttribute("min", "100");
      await expect(customScale).toHaveAttribute("max", "1600");
      await expect(customScale).toHaveAttribute("step", "100");
      await customScale.press("ArrowRight");
      await expect(page.getByText("500")).toBeVisible();
    }

    await page.getByLabel("Add Item").click();
  }

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-custom-scale-page-1.png"
  );
});

test("minecraft item generator overlays onto the last item without reflowing it", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");
  await selectItemByTitle(page, "sword", "diamond sword");
  await setItemSize(page, "Small (200%)");
  await page.getByLabel("Add Item").click();

  await setItemSize(page, "Custom");
  await selectItemByTitle(page, "bow", "bow");
  await expect(page.getByTestId("texture-picker-preview")).toContainText("bow");
  await page.getByLabel("Overlay Item").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-overlay-last-item-no-reflow-page-1.png"
  );
});

test("minecraft item generator overlays across size and texture transform combinations", async ({
  page,
}) => {
  const overlayCases = [
    {
      name: "extra-large-base-no-transform",
      snapshot: "minecraft-item-overlay-extra-large-base-no-transform-page-1.png",
      baseSize: "Extra Large (1400%)" as const,
      overlaySearch: "bow",
      overlayTitle: "bow",
      overlayActions: [] as const,
    },
    {
      name: "medium-base-rotated-horizontal",
      snapshot: "minecraft-item-overlay-medium-base-rotated-horizontal-page-1.png",
      baseSize: "Medium (400%)" as const,
      overlaySearch: "bow",
      overlayTitle: "bow",
      overlayActions: ["rotate", "flip-horizontal"] as const,
    },
    {
      name: "custom-base-rotated-vertical",
      snapshot: "minecraft-item-overlay-custom-base-rotated-vertical-page-1.png",
      baseSize: "Custom" as const,
      overlaySearch: "bow",
      overlayTitle: "bow",
      overlayActions: ["rotate", "flip-vertical"] as const,
    },
  ] as const;

  for (const overlayCase of overlayCases) {
    await page.goto("/generator/minecraft-item");
    await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");

    await selectItemByTitle(page, "sword", "diamond sword");
    await setItemSize(page, overlayCase.baseSize);
    await page.getByLabel("Add Item").click();

    await selectItemByTitle(page, overlayCase.overlaySearch, overlayCase.overlayTitle);
    for (const action of overlayCase.overlayActions) {
      if (action === "rotate") {
        await page.getByLabel("Rotate texture").click();
      } else if (action === "flip-horizontal") {
        await page.getByLabel("Flip texture horizontal").click();
      } else {
        await page.getByLabel("Flip texture vertical").click();
      }
    }

    await expect(page.getByTestId("texture-picker-preview")).toContainText(
      overlayCase.overlayTitle
    );
    await page.getByLabel("Overlay Item").click();

    const outputPages = page.getByTestId("generator-page-image");
    await expect(outputPages).toHaveCount(1);

    const outputPage = outputPages.nth(0);
    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(overlayCase.snapshot);
  }
});

test("minecraft item generator toggles enchantment from the item region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByLabel("Version").selectOption("minecraft-26.1.2-items");
  await selectItemByTitle(page, "sword", "diamond sword");
  await page.getByLabel("Add Item").click();

  const itemRegion = page.getByTestId("region-Item 1");
  await expect(itemRegion).toBeVisible();
  await itemRegion.click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-enchanted-toggle-page-1.png"
  );
});

test("minecraft item generator clears the selected texture when switching to custom", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

  await page.getByPlaceholder("Search...").fill("sword");
  await page.getByTitle("diamond sword").click();

  await expect(page.getByTestId("texture-picker-preview")).toBeVisible();

  await page.getByLabel("Version").selectOption("custom");

  await expect(page.getByTestId("texture-picker-preview")).toHaveCount(0);

  await page.getByLabel("Add Item").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-default-page-1.png"
  );
});

test("minecraft item generator clears the custom selection when the version changes", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-item");

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
  await page.getByLabel("Add Item").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-item-version-switch-clears-custom-selection-page-1.png"
  );
});
