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

  // Defaults to Shield, a dev convenience while shield work is in progress
  // (see AGENTS.md status) — flip to Banner explicitly to exercise its
  // controls rather than assuming the default.
  await expect(page.getByLabel("Template 1 Type")).toHaveValue("Shield");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveCount(0);

  await page.getByLabel("Template 1 Type").selectOption("Banner");

  await expect(page.getByLabel("Template 1 Type")).toHaveValue("Banner");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveValue(
    "banner_base"
  );
});

test("minecraft banner and shield renders Template 1's banner flag base", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  await page.getByLabel("Template 1 Type").selectOption("Banner");

  // The front face spans roughly [142, 262] horizontally, [144, 384]
  // vertically. (146, 300) sits inside it, where the texture is dark, unlike
  // the white page background, and outside the shield plate's own footprint
  // (up to y=232), so it stays a clean probe when Shield is selected too.
  await expect.poll(() => readPixel(pageImage, 146, 300)).not.toEqual(white);

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect.poll(() => readPixel(pageImage, 146, 300)).toEqual(white);
});

test("minecraft banner and shield renders Template 1's shield plate base", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  // The plate's front face spans roughly [46, 118] horizontally, [46, 178]
  // vertically. (60, 100) sits inside it, where the base texture is a light
  // gray, unlike the white page background. (160, 100) sits on the plate's
  // back face (wood-brown), confirming the net's second face also renders.
  await expect.poll(() => readPixel(pageImage, 60, 100)).not.toEqual(white);
  await expect.poll(() => readPixel(pageImage, 160, 100)).not.toEqual(white);

  await page.getByLabel("Template 1 Type").selectOption("Banner");

  await expect.poll(() => readPixel(pageImage, 60, 100)).toEqual(white);
  await expect.poll(() => readPixel(pageImage, 160, 100)).toEqual(white);
});

test("minecraft banner and shield stamps and erases a pattern on the flag click region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption("Banner");

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

  await page.getByLabel("Template 1 Type").selectOption("Banner");

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

  await page.getByLabel("Template 1 Type").selectOption("Banner");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-BannerFlag");
  const defaultColor = await readPixel(pageImage, 146, 180);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await region.click();
  await region.click();

  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(defaultColor);
});

test("minecraft banner and shield stamps and erases a pattern on the shield plate click region", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-ShieldPlate");
  const beforeColor = await readPixel(pageImage, 90, 100);

  // Re-stamps the "base" pattern with the picker's default tint (dye Black),
  // clearly distinguishable from the plate's default light-gray base layer.
  await page.getByTitle("base").click();
  await region.click();
  await expect
    .poll(() => readPixel(pageImage, 90, 100))
    .not.toEqual(beforeColor);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await expect.poll(() => readPixel(pageImage, 90, 100)).toEqual(beforeColor);
});

test("minecraft banner and shield keeps the default base layer on the shield plate through repeated erase clicks", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-ShieldPlate");
  const defaultColor = await readPixel(pageImage, 90, 100);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await region.click();
  await region.click();

  await expect.poll(() => readPixel(pageImage, 90, 100)).toEqual(defaultColor);
});

test("minecraft banner and shield does not stamp a pattern onto the shield handle or inner lining", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  const pageImage = outputPage(page);
  // (320, 100) sits on the handle; (310, 208) sits on the inner lining's
  // first cell. Both stay identical before/after stamping, unlike the
  // reference generator's own architecture (a shared pattern stack across
  // plate/handle/lining), because every pattern's texture tile is blank at
  // these parts' crop coordinates — see shield.ts's drawShieldPattern.
  const handleColor = await readPixel(pageImage, 320, 100);
  const liningColor = await readPixel(pageImage, 310, 208);

  await page.getByTitle("base").click();
  await page.getByTestId("region-ShieldPlate").click();

  await expect.poll(() => readPixel(pageImage, 320, 100)).toEqual(handleColor);
  await expect.poll(() => readPixel(pageImage, 310, 208)).toEqual(liningColor);
});

test("minecraft banner and shield applies a glint overlay across the shield plate, handle, and inner lining", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  const pageImage = outputPage(page);
  // Same three probe points as the "does not stamp a pattern" test above:
  // plate (60, 100), handle (320, 100), inner lining (310, 208) — glint is a
  // whole-shield overlay, so unlike pattern stamping it must reach all three.
  const plateColor = await readPixel(pageImage, 60, 100);
  const handleColor = await readPixel(pageImage, 320, 100);
  const liningColor = await readPixel(pageImage, 310, 208);

  await page.getByText("Glint", { exact: true }).click();

  await expect
    .poll(() => readPixel(pageImage, 60, 100))
    .not.toEqual(plateColor);
  await expect
    .poll(() => readPixel(pageImage, 320, 100))
    .not.toEqual(handleColor);
  await expect
    .poll(() => readPixel(pageImage, 310, 208))
    .not.toEqual(liningColor);

  await page.getByText("Glint", { exact: true }).click();

  await expect.poll(() => readPixel(pageImage, 60, 100)).toEqual(plateColor);
  await expect.poll(() => readPixel(pageImage, 320, 100)).toEqual(handleColor);
  await expect.poll(() => readPixel(pageImage, 310, 208)).toEqual(liningColor);
});

test("minecraft banner and shield hides the Glint controls for the banner template", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  // Glint is Shield-only — real Minecraft banners can't be enchanted.
  await expect(page.getByText("Glint", { exact: true })).toHaveCount(1);

  await page.getByLabel("Template 1 Type").selectOption("Banner");

  await expect(page.getByText("Glint", { exact: true })).toHaveCount(0);
});
