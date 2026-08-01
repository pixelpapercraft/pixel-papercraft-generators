import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";

// The rendering is still a scaffold, so these tests cover only the controls
// that have been introduced so far. Rendering coverage grows alongside the
// banner and shield geometry slices.

const white = { r: 255, g: 255, b: 255, a: 255 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

test("minecraft banner and shield skeleton exposes its placeholder control panel", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await expect(page.getByLabel("Show Placeholder Border")).toBeChecked();

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});

test("minecraft banner and shield skeleton's placeholder border toggle drives the render", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  // (300, 20) sits on the placeholder rectangle's top edge.
  await expect.poll(() => readPixel(pageImage, 300, 20)).not.toEqual(white);

  await page.getByText("Show Placeholder Border", { exact: true }).click();
  await expect(page.getByLabel("Show Placeholder Border")).not.toBeChecked();
  await expect.poll(() => readPixel(pageImage, 300, 20)).toEqual(white);
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

  // The front face begins at the reference layout's [121, 123] after the
  // 1/3 A4 scale. Its left edge is dark, unlike the white page background.
  await expect.poll(() => readPixel(pageImage, 122, 150)).not.toEqual(white);

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect.poll(() => readPixel(pageImage, 122, 150)).toEqual(white);
});
