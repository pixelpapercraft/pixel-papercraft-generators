import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

test("minecraft banner and shield generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-banner-and-shield-default-page-1.png"
  );
});

test("minecraft banner and shield generator applies a tinted pattern to the banner flag", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByPlaceholder("Search...").fill("creeper");
  await page.getByTitle("creeper").click();
  await page.getByTitle("Red (#B02E26)").click();
  await page.getByTestId("region-PatternFace1").click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-banner-and-shield-creeper-pattern-page-1.png"
  );
});

test("minecraft banner and shield generator switches template 1 to a shield and toggles the glint", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption({ label: "Shield" });

  const glintRegion = page.locator(
    "div.border-4.border-transparent:not([data-testid])"
  );
  await expect(glintRegion).toHaveCount(1);
  await glintRegion.click();

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-banner-and-shield-shield-glint-page-1.png"
  );
});
