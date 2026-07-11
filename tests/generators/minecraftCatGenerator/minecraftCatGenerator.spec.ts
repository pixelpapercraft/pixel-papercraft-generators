import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

test("minecraft cat generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/minecraft-cat");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "minecraft-cat-default-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft cat generator renders a tinted collar", async ({ page }) => {
  await page.goto("/generator/minecraft-cat");

  await page.getByLabel("Collar", { exact: true }).selectOption({
    label: "Cat Collar",
  });
  await page.getByTitle("Blue (#3C44AA)").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-cat-blue-collar-page-1.png"
  );
});
