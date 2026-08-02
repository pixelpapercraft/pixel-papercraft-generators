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

test("minecraft banner and shield stamps and erases a pattern on the flag click region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-BannerFlag");
  const beforeColor = await readPixel(pageImage, 146, 180);

  // Re-stamps the "base" pattern with the picker's default tint (dye Black),
  // clearly distinguishable from the near-white default base layer.
  await page.getByTitle("base").click();
  await region.click();
  await expect
    .poll(() => readPixel(pageImage, 146, 180))
    .not.toEqual(beforeColor);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(beforeColor);
});

test("minecraft banner and shield renders fold guides on top of a stamped pattern", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-BannerFlag");

  // Stamps the "base" pattern with the picker's default near-black tint,
  // which repaints the flag's full texture and would previously paint over
  // any fold guide that fell on the fabric rather than blank page background.
  await page.getByTitle("base").click();
  await region.click();

  // (151, 143) sits on the front face's top fold-guide dash; (153, 143), one
  // dash-gap over, confirms the stamped pattern actually reached this row.
  const foldDash = { r: 123, g: 123, b: 123, a: 255 };
  await expect.poll(() => readPixel(pageImage, 151, 143)).toEqual(foldDash);
  await expect.poll(() => readPixel(pageImage, 153, 143)).not.toEqual(foldDash);

  await page.getByText("Show Folds", { exact: true }).click();
  await expect.poll(() => readPixel(pageImage, 151, 143)).not.toEqual(foldDash);
});

test("minecraft banner and shield keeps the default base layer through repeated erase clicks", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-BannerFlag");
  const defaultColor = await readPixel(pageImage, 146, 180);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await region.click();
  await region.click();

  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(defaultColor);
});
