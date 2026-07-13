import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";

const green: Rgba = { r: 0, g: 170, b: 0, a: 255 };
const amber: Rgba = { r: 255, g: 191, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const purple: Rgba = { r: 128, g: 0, b: 128, a: 255 };
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

const pageImage = (page: Page) => page.getByTestId("generator-page-image");

test("defineAndGetBooleanInput registers its checked default and returns it to the script", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  await expect(page.getByLabel("Enabled")).toBeChecked();
  expect(await readPixel(pageImage(page), 30, 30)).toEqual(green);
});

test("defineAndGetSelectInput registers options and returns the first default", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const material = page.getByLabel("Material");
  await expect(material).toHaveValue("Amber");
  await expect(material.locator("option")).toHaveText(["Amber", "Blue"]);
  expect(await readPixel(pageImage(page), 70, 30)).toEqual(amber);

  await material.selectOption("Blue");
  expect(await readPixel(pageImage(page), 70, 30)).toEqual(blue);
});

test("defineAndGetRangeInput exposes its exact metadata and returned fractional default", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const scale = page.getByLabel("Scale");
  await expect(scale).toHaveAttribute("min", "1");
  await expect(scale).toHaveAttribute("max", "4");
  await expect(scale).toHaveAttribute("step", "0.5");
  await expect(scale).toHaveValue("2.5");

  // The default return value gives this marker a 25px width (x = 100..124).
  expect(await readPixel(pageImage(page), 124, 30)).toEqual(purple);
  expect(await readPixel(pageImage(page), 125, 30)).toEqual(transparent);
});

test("defineBooleanInput and defineSelectInput render their supplied controls", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  await expect(page.getByLabel("Visible")).not.toBeChecked();
  const shape = page.getByLabel("Shape");
  await expect(shape).toHaveValue("Square");
  await expect(shape.locator("option")).toHaveText(["Square", "Circle"]);
});

test("defineRangeInput keeps fractional changes and shows the current value", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const opacity = page.getByLabel("Opacity");
  await expect(opacity).toHaveAttribute("min", "0");
  await expect(opacity).toHaveAttribute("max", "1");
  await expect(opacity).toHaveAttribute("step", "0.1");
  await expect(opacity).toHaveValue("0.5");

  await opacity.fill("0.3");
  await opacity.evaluate((input) =>
    input.dispatchEvent(new Event("change", { bubbles: true }))
  );

  const opacityRow = page.locator("div.mb-4").filter({ has: opacity });
  await expect(opacityRow.locator("span")).toHaveText("0.3");
});

test("defineText and defineCustomStringInput render their authored content", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  await expect(
    page.getByText("Control definition reference text.", { exact: true })
  ).toBeVisible();
  await expect(page.getByLabel("Custom note")).toHaveAttribute("type", "text");
});

test("defineButtonInput applies its requested colour and runs its callback", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const button = page.getByRole("button", { name: "Advance marker" });
  await expect(button).toHaveClass(/bg-green-600/);
  expect(await readPixel(pageImage(page), 25, 75)).toEqual(purple);
  expect(await readPixel(pageImage(page), 45, 75)).toEqual(transparent);

  await button.click();

  expect(await readPixel(pageImage(page), 25, 75)).toEqual(transparent);
  expect(await readPixel(pageImage(page), 45, 75)).toEqual(purple);
});
