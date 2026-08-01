import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";

// Rendering coverage grows alongside the banner and shield geometry slices.

const white = { r: 255, g: 255, b: 255, a: 255 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

test("minecraft banner and shield renders a page image", async ({ page }) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});

test("minecraft banner and shield exposes the Template 1 banner controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await expect(page.getByLabel("Template 1 Type")).toHaveValue("Banner");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveValue(
    "banner_base"
  );

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect(page.getByLabel("Template 1 Type")).toHaveValue("Shield");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveCount(0);
});

test("minecraft banner and shield renders Template 1's banner flag base", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  // The front face spans roughly [142, 262] horizontally. (146, 180) sits
  // inside it, where the texture is dark, unlike the white page background.
  await expect.poll(() => readPixel(pageImage, 146, 180)).not.toEqual(white);

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(white);
});
