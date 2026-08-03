import { expect, test, type Page } from "@playwright/test";
import { readPixel } from "../_shared/pixelColor";

// Rendering coverage grows alongside the banner and shield geometry slices.
// The page is split into a top half (Template 1, default Banner) and a
// bottom half (Template 2, default Shield) — every Template 2 pixel probe is
// its Template 1 equivalent shifted down by halfPageHeight (421), the same
// constant the generator itself uses.

const white = { r: 255, g: 255, b: 255, a: 255 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

test("minecraft banner and shield renders a page image", async ({ page }) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});

test("minecraft banner and shield exposes independent Template 1 and Template 2 type/base controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  // Real defaults: Template 1 is Banner, Template 2 is Shield — not a dev
  // convenience, both slots render simultaneously. Shield defaults to bare
  // (no banner attached), matching the real game.
  await expect(page.getByLabel("Template 1 Type")).toHaveValue("Banner");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveValue(
    "banner_base"
  );
  await expect(page.getByLabel("Template 1 Shield Pattern")).toHaveCount(0);
  await expect(page.getByLabel("Template 2 Type")).toHaveValue("Shield");
  await expect(page.getByLabel("Template 2 Banner Base")).toHaveCount(0);
  await expect(page.getByLabel("Template 2 Shield Pattern")).toHaveValue(
    "None"
  );

  await page.getByLabel("Template 2 Type").selectOption("Banner");

  await expect(page.getByLabel("Template 2 Banner Base")).toHaveValue(
    "banner_base"
  );
  await expect(page.getByLabel("Template 2 Shield Pattern")).toHaveCount(0);

  // Each slot's Base selector is independent of the other's.
  await page.getByLabel("Template 2 Banner Base").selectOption("banner_base");
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveValue(
    "banner_base"
  );

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect(page.getByLabel("Template 1 Shield Pattern")).toHaveValue(
    "None"
  );

  await page.getByLabel("Template 1 Shield Pattern").selectOption("Banner");
  await expect(page.getByLabel("Template 1 Shield Pattern")).toHaveValue(
    "Banner"
  );

  // Switching Template 1's Shield Pattern on and Template 2 back to Shield
  // doesn't disturb Template 2's own independent Shield Pattern state.
  await page.getByLabel("Template 2 Type").selectOption("Shield");
  await expect(page.getByLabel("Template 2 Shield Pattern")).toHaveValue(
    "None"
  );
});

test("minecraft banner and shield renders Template 1's banner flag base by default, and hides it when set to None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  // (146, 180) sits on the flag's front face, unaffected by Template 1's
  // yOffset of 0.
  await expect.poll(() => readPixel(pageImage, 146, 180)).not.toEqual(white);
  await expect(page.getByTestId("region-Template1")).toHaveCount(1);

  await page.getByLabel("Template 1 Type").selectOption("None");

  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(white);
  await expect(page.getByTestId("region-Template1")).toHaveCount(0);
  await expect(page.getByLabel("Template 1 Banner Base")).toHaveCount(0);
});

test("minecraft banner and shield renders Template 2's bare shield plate by default, with no clickable region, and hides it when set to None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);

  // (60, 521) and (160, 521) are the plate's front/back faces from the old
  // single-template layout, shifted down by Template 2's 421px yOffset. The
  // bare "no pattern" base texture is still real art, so both are non-white
  // — but there's no banner attached yet, so no clickable region either.
  await expect.poll(() => readPixel(pageImage, 60, 521)).not.toEqual(white);
  await expect.poll(() => readPixel(pageImage, 160, 521)).not.toEqual(white);
  await expect(page.getByTestId("region-Template2")).toHaveCount(0);

  await page.getByLabel("Template 2 Type").selectOption("None");

  await expect.poll(() => readPixel(pageImage, 60, 521)).toEqual(white);
  await expect.poll(() => readPixel(pageImage, 160, 521)).toEqual(white);
  await expect(page.getByLabel("Template 2 Shield Pattern")).toHaveCount(0);
});

test("minecraft banner and shield's Shield Pattern toggle attaches a banner to Template 2's plate, with the pattern stack kept in memory across toggles", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  // (60, 521) sits on the plate's front face, shifted down by Template 2's
  // 421px yOffset (same probe as the "renders Template 2's bare shield
  // plate" test).
  const bareColor = await readPixel(pageImage, 60, 521);
  await expect(page.getByTestId("region-Template2")).toHaveCount(0);

  // Selecting "Banner" attaches one: the seeded default white layer becomes
  // visible and the plate becomes clickable.
  await page.getByLabel("Template 2 Shield Pattern").selectOption("Banner");
  const bannerColor = await readPixel(pageImage, 60, 521);
  expect(bannerColor).not.toEqual(bareColor);
  await expect(page.getByTestId("region-Template2")).toHaveCount(1);

  // Stamp a distinct pattern onto it.
  await page.getByTitle("base").click();
  await page.getByTestId("region-Template2").click();
  const stampedColor = await readPixel(pageImage, 60, 521);
  expect(stampedColor).not.toEqual(bannerColor);

  // Selecting "No Pattern" again goes back to bare — same pixels as before,
  // no clickable region — without discarding the stamped pattern stack.
  await page.getByLabel("Template 2 Shield Pattern").selectOption("None");
  await expect.poll(() => readPixel(pageImage, 60, 521)).toEqual(bareColor);
  await expect(page.getByTestId("region-Template2")).toHaveCount(0);

  // Selecting "Banner" again restores the exact stamped state, proving it
  // was kept in memory rather than reset back to the seeded default.
  await page.getByLabel("Template 2 Shield Pattern").selectOption("Banner");
  await expect.poll(() => readPixel(pageImage, 60, 521)).toEqual(stampedColor);
});

test("minecraft banner and shield stamps and erases a pattern on the Template 1 region, independently of Template 2", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-Template1");
  const beforeColor = await readPixel(pageImage, 146, 180);
  const template2Color = await readPixel(pageImage, 90, 521);

  // Re-stamps the "base" pattern with the picker's default tint (dye Black),
  // clearly distinguishable from the near-white default base layer.
  await page.getByTitle("base").click();
  await region.click();
  await expect
    .poll(() => readPixel(pageImage, 146, 180))
    .not.toEqual(beforeColor);
  // Template 2's shield is untouched by stamping Template 1's region.
  await expect
    .poll(() => readPixel(pageImage, 90, 521))
    .toEqual(template2Color);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(beforeColor);
});

test("minecraft banner and shield renders fold guides on top of a stamped pattern on Template 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-Template1");

  // Stamps the "base" pattern with the picker's default near-black tint,
  // which repaints the flag's full texture and would previously paint over
  // any fold guide that fell on the fabric rather than blank page background.
  await page.getByTitle("base").click();
  await region.click();

  // (50, 45) sits on the front face's top fold-guide dash; (52, 45), one
  // dash-gap over, confirms the stamped pattern actually reached this row.
  const foldDash = { r: 123, g: 123, b: 123, a: 255 };
  await expect.poll(() => readPixel(pageImage, 50, 45)).toEqual(foldDash);
  await expect.poll(() => readPixel(pageImage, 52, 45)).not.toEqual(foldDash);

  await page.getByText("Show Folds", { exact: true }).click();
  await expect.poll(() => readPixel(pageImage, 50, 45)).not.toEqual(foldDash);
});

test("minecraft banner and shield keeps the default base layer on Template 1 through repeated erase clicks", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-Template1");
  const defaultColor = await readPixel(pageImage, 146, 180);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await region.click();
  await region.click();

  await expect.poll(() => readPixel(pageImage, 146, 180)).toEqual(defaultColor);
});

test("minecraft banner and shield stamps and erases a pattern on the Template 2 region, independently of Template 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  // Template 2 defaults to a bare shield with no clickable region — attach
  // a banner first.
  await page.getByLabel("Template 2 Shield Pattern").selectOption("Banner");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-Template2");
  const beforeColor = await readPixel(pageImage, 90, 521);
  const template1Color = await readPixel(pageImage, 146, 180);

  // Re-stamps the "base" pattern with the picker's default tint (dye Black),
  // clearly distinguishable from the plate's default light-gray base layer.
  await page.getByTitle("base").click();
  await region.click();
  await expect
    .poll(() => readPixel(pageImage, 90, 521))
    .not.toEqual(beforeColor);
  // Template 1's banner is untouched by stamping Template 2's region.
  await expect
    .poll(() => readPixel(pageImage, 146, 180))
    .toEqual(template1Color);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await expect.poll(() => readPixel(pageImage, 90, 521)).toEqual(beforeColor);
});

test("minecraft banner and shield keeps the default base layer on Template 2 through repeated erase clicks, same as Template 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 2 Shield Pattern").selectOption("Banner");

  const pageImage = outputPage(page);
  const region = page.getByTestId("region-Template2");
  const defaultColor = await readPixel(pageImage, 90, 521);

  await page.getByLabel("Erase texture").click();
  await region.click();
  await region.click();
  await region.click();

  await expect.poll(() => readPixel(pageImage, 90, 521)).toEqual(defaultColor);
});

test("minecraft banner and shield does not stamp a pattern onto Template 2's shield handle or inner lining", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 2 Shield Pattern").selectOption("Banner");

  const pageImage = outputPage(page);
  // (320, 521) sits on the handle; (310, 629) sits on the inner lining's
  // first cell — the old single-template coordinates shifted down by
  // Template 2's 421px yOffset. Both stay identical before/after stamping —
  // every pattern's texture tile is blank at these parts' crop coordinates,
  // see shield.ts's drawShieldPattern.
  const handleColor = await readPixel(pageImage, 320, 521);
  const liningColor = await readPixel(pageImage, 310, 629);

  await page.getByTitle("base").click();
  await page.getByTestId("region-Template2").click();

  await expect.poll(() => readPixel(pageImage, 320, 521)).toEqual(handleColor);
  await expect.poll(() => readPixel(pageImage, 310, 629)).toEqual(liningColor);
});

test("minecraft banner and shield applies a glint overlay across Template 2's bare shield plate, handle, and inner lining", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  const pageImage = outputPage(page);
  const plateColor = await readPixel(pageImage, 60, 521);
  const handleColor = await readPixel(pageImage, 320, 521);
  const liningColor = await readPixel(pageImage, 310, 629);

  await page.getByText("Glint", { exact: true }).click();

  await expect
    .poll(() => readPixel(pageImage, 60, 521))
    .not.toEqual(plateColor);
  await expect
    .poll(() => readPixel(pageImage, 320, 521))
    .not.toEqual(handleColor);
  await expect
    .poll(() => readPixel(pageImage, 310, 629))
    .not.toEqual(liningColor);

  await page.getByText("Glint", { exact: true }).click();

  await expect.poll(() => readPixel(pageImage, 60, 521)).toEqual(plateColor);
  await expect.poll(() => readPixel(pageImage, 320, 521)).toEqual(handleColor);
  await expect.poll(() => readPixel(pageImage, 310, 629)).toEqual(liningColor);
});

test("minecraft banner and shield's glint texture selector reflects the actual selection", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByText("Glint", { exact: true }).click();

  const glintSelect = page.getByLabel("Enchanted Glint", { exact: true });
  await expect(glintSelect).toHaveValue("1.20+");

  await glintSelect.selectOption("Pre-1.20");
  await expect(glintSelect).toHaveValue("Pre-1.20");
});

test("minecraft banner and shield only shows the Glint controls while a template is Shield", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  // Visible by default (Template 2 defaults to Shield).
  await expect(page.getByText("Glint", { exact: true })).toHaveCount(1);

  await page.getByLabel("Template 2 Type").selectOption("Banner");

  // Neither slot is Shield now (Template 1 defaults to Banner too).
  await expect(page.getByText("Glint", { exact: true })).toHaveCount(0);

  await page.getByLabel("Template 1 Type").selectOption("Shield");

  await expect(page.getByText("Glint", { exact: true })).toHaveCount(1);
});

test("minecraft banner and shield supports the same type in both slots independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-banner-and-shield");

  await page.getByLabel("Template 2 Type").selectOption("Banner");

  const pageImage = outputPage(page);

  // Template 2's own Banner Base selector, independent of Template 1's.
  await page.getByLabel("Template 2 Banner Base").selectOption({ index: 0 });
  await expect(page.getByLabel("Template 2 Banner Base")).toHaveValue(
    "banner_base"
  );

  // Template 2's flag front face, shifted down by 421px — renders
  // independently alongside Template 1's own banner.
  await expect
    .poll(() => readPixel(pageImage, 146, 180 + 421))
    .not.toEqual(white);
  await expect.poll(() => readPixel(pageImage, 146, 180)).not.toEqual(white);

  // Stamping Template 2's region doesn't affect Template 1's, even though
  // both are the same content type.
  const template1Color = await readPixel(pageImage, 146, 180);
  await page.getByTitle("base").click();
  await page.getByTestId("region-Template2").click();
  await expect
    .poll(() => readPixel(pageImage, 146, 180))
    .toEqual(template1Color);
});
