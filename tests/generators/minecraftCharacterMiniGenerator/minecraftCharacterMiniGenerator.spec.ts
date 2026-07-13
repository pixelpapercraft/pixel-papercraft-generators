import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const skinTexturePath = "src/generators/_common/fixtures/testSheet.png";

test("minecraft character mini generator renders a custom uploaded skin in the second slot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-mini");

  await page
    .getByLabel("Upload Mini 2 skin file")
    .setInputFiles(skinTexturePath);

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-character-mini-custom-skin-2-page-1.png"
  );
});

test("minecraft character mini generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/minecraft-character-mini");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "minecraft-character-mini-default-page-" + (index + 1) + ".png"
    );
  }
});
