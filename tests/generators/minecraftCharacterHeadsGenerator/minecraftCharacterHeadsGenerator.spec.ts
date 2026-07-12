import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const skinTexturePath = "src/generators/testing/images/testSheet.png";

test("minecraft character heads generator renders a custom uploaded skin in an extra slot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads");

  await page
    .getByLabel("Upload Skin 2 skin file")
    .setInputFiles(skinTexturePath);

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-character-heads-custom-skin-2-page-1.png"
  );
});

test("minecraft character heads generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/minecraft-character-heads");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "minecraft-character-heads-default-page-" + (index + 1) + ".png"
    );
  }
});
