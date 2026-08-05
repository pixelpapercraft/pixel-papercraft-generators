import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Coverage for the shared `_common` tint selector V2 (`TintSelector`),
// independent of Banner & Shield - the component is meant to be reused by
// other generators, but had no exercise beyond that generator's throwaway
// wiring until this board existed.
// Generator id: test-api-tint-selector.

const black: Rgba = { r: 0x1d, g: 0x1d, b: 0x21, a: 255 };
const red: Rgba = { r: 0xb0, g: 0x2e, b: 0x26, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const custom: Rgba = { r: 0x33, g: 0x55, b: 0xff, a: 255 };

const renderedTint = (page: Page) =>
  readPixel(page.getByTestId("generator-page-image").nth(0), 50, 50);

const renderedRequiredTint = (page: Page) =>
  readPixel(page.getByTestId("generator-page-image").nth(0), 130, 50);

// Each `TintSelector` instance's label text sits in its own outer wrapper
// div alongside its select/swatch-grid, so scoping to that wrapper is how a
// specific instance's controls are found on a page with more than one.
const tintSelector = (page: Page, label: string) =>
  page.getByText(label, { exact: true }).locator("..");

test.beforeEach(async ({ page }) => {
  await page.goto("/generator/test-api-tint-selector");
});

test("defaults to the first dye swatch", async ({ page }) => {
  await expect.poll(() => renderedTint(page)).toEqual(black);
});

test("clicking a swatch updates the render", async ({ page }) => {
  await tintSelector(page, "Tint")
    .getByRole("button", { name: "Red (#B02E26)" })
    .click();
  await expect.poll(() => renderedTint(page)).toEqual(red);
});

test("switching to Custom Tint and typing a hex updates the render", async ({
  page,
}) => {
  await tintSelector(page, "Tint")
    .getByRole("combobox")
    .selectOption({ label: "Custom Tint" });
  await tintSelector(page, "Tint").getByPlaceholder("RRGGBB").fill("3355FF");
  await expect.poll(() => renderedTint(page)).toEqual(custom);
});

test("switching to None clears the render", async ({ page }) => {
  await tintSelector(page, "Tint")
    .getByRole("combobox")
    .selectOption({ label: "None" });
  await expect.poll(() => renderedTint(page)).toEqual(white);
});

test("Required Tint has no None option", async ({ page }) => {
  const options = await tintSelector(page, "Required Tint")
    .locator("option")
    .allTextContents();
  expect(options).not.toContain("None");
});

test("Required Tint defaults to the first dye swatch and stays selectable via swatches", async ({
  page,
}) => {
  await expect.poll(() => renderedRequiredTint(page)).toEqual(black);

  await tintSelector(page, "Required Tint")
    .getByRole("button", { name: "Red (#B02E26)" })
    .click();
  await expect.poll(() => renderedRequiredTint(page)).toEqual(red);
});
