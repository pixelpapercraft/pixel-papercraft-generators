import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";

// Skeleton-only coverage: this generator has no real content yet (see the
// component rebuild plan), so these tests only prove the scaffold itself
// works — the control panel renders and is wired to the render pass — not
// any banner/shield behavior. Expect this file to be replaced as each real
// component (texture picker, tint picker, rendering) lands.

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
