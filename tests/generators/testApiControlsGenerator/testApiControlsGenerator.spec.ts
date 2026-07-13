import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { readPixel, type Rgba } from "../_shared/pixelColor";

const green: Rgba = { r: 0, g: 170, b: 0, a: 255 };
const amber: Rgba = { r: 255, g: 191, b: 0, a: 255 };
const blue: Rgba = { r: 0, g: 0, b: 255, a: 255 };
const purple: Rgba = { r: 128, g: 0, b: 128, a: 255 };
const magenta: Rgba = { r: 255, g: 0, b: 255, a: 255 };
const grey: Rgba = { r: 221, g: 221, b: 221, a: 255 };
const red: Rgba = { r: 255, g: 0, b: 0, a: 255 };
const fixtureGreen: Rgba = { r: 0, g: 255, b: 0, a: 255 };
const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

const pageImage = (page: Page) => page.getByTestId("generator-page-image");
const controlsPage = (page: Page) => pageImage(page).first();

test("defineAndGetBooleanInput registers its checked default and returns it to the script", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  await expect(page.getByLabel("Enabled")).toBeChecked();
  expect(await readPixel(controlsPage(page), 30, 30)).toEqual(green);
});

test("defineAndGetSelectInput registers options and returns the first default", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const material = page.getByLabel("Material");
  await expect(material).toHaveValue("Amber");
  await expect(material.locator("option")).toHaveText(["Amber", "Blue"]);
  expect(await readPixel(controlsPage(page), 70, 30)).toEqual(amber);

  await material.selectOption("Blue");
  expect(await readPixel(controlsPage(page), 70, 30)).toEqual(blue);
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
  expect(await readPixel(controlsPage(page), 124, 30)).toEqual(purple);
  expect(await readPixel(controlsPage(page), 125, 30)).toEqual(transparent);
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

test("defineCustomStringInput forwards its authored onChange callback into a redraw", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  expect(await readPixel(controlsPage(page), 165, 75)).toEqual(transparent);

  await page.getByLabel("Custom note").fill("redraw");

  expect(await readPixel(controlsPage(page), 165, 75)).toEqual(purple);
});

test("defineButtonInput applies its requested colour and runs its callback", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const button = page.getByRole("button", { name: "Advance marker" });
  await expect(button).toHaveClass(/bg-green-600/);
  expect(await readPixel(controlsPage(page), 25, 75)).toEqual(purple);
  expect(await readPixel(controlsPage(page), 45, 75)).toEqual(transparent);

  await button.click();

  await expect
    .poll(async () => readPixel(controlsPage(page), 25, 75))
    .toEqual(transparent);
  await expect
    .poll(async () => readPixel(controlsPage(page), 45, 75))
    .toEqual(purple);
});

test("defineRegionInput scales its overlay proportionally to the rendered page", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const regionPage = pageImage(page).nth(3);
  const imageBox = await regionPage.boundingBox();
  if (!imageBox) {
    throw new Error("Region page image was not measurable");
  }

  const region = page.getByTestId("region-ControlRegion");
  await expect(region).toBeVisible();
  const regionBox = await region.boundingBox();
  if (!regionBox) {
    throw new Error("ControlRegion was not measurable");
  }

  const scale = imageBox.width / 595;
  const pageBorderWidth = 1;
  const tolerancePx = 1;
  expect(Math.abs(regionBox.x - (imageBox.x + Math.round(16 * scale) + pageBorderWidth))).toBeLessThanOrEqual(tolerancePx);
  expect(Math.abs(regionBox.y - (imageBox.y + Math.round(16 * scale) + pageBorderWidth))).toBeLessThanOrEqual(tolerancePx);
  expect(Math.abs(regionBox.width - Math.round(256 * scale))).toBeLessThanOrEqual(tolerancePx);
  expect(Math.abs(regionBox.height - Math.round(256 * scale))).toBeLessThanOrEqual(tolerancePx);
});

test("defineRegionInput keeps its position stable and runs its click callback", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const regionPage = pageImage(page).nth(3);
  const region = page.getByTestId("region-ControlRegion");
  await expect(region).toBeVisible();

  const measureOffset = async () => {
    const imageBox = await regionPage.boundingBox();
    const regionBox = await region.boundingBox();
    if (!imageBox || !regionBox) {
      throw new Error("Region page or ControlRegion was not measurable");
    }
    return {
      x: regionBox.x - imageBox.x,
      y: regionBox.y - imageBox.y,
      width: regionBox.width,
      height: regionBox.height,
    };
  };

  const offsetBefore = await measureOffset();
  expect(await readPixel(regionPage, 35, 35)).toEqual(magenta);
  expect(await readPixel(regionPage, 55, 35)).toEqual(grey);

  await region.click();

  const offsetAfter = await measureOffset();
  expect(offsetAfter).toEqual(offsetBefore);
  await expect
    .poll(async () => readPixel(regionPage, 35, 35))
    .toEqual(grey);
  await expect
    .poll(async () => readPixel(regionPage, 55, 35))
    .toEqual(magenta);
});

const quadrantsFixture = () =>
  fs.readFileSync(
    path.join(
      process.cwd(),
      "src/generators/testApiDrawingTextures/fixtures/quadrants.png"
    )
  );

test("defineTextureInput accepts an accessible local upload and exposes it to the script", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const upload = page.getByLabel("Upload Uploaded Texture texture file");
  await expect(upload).toHaveAttribute(
    "accept",
    "image/png,image/jpeg,.png,.jpg,.jpeg"
  );
  await upload.setInputFiles({
    name: "quadrants.png",
    mimeType: "image/png",
    buffer: quadrantsFixture(),
  });

  const uploadsPage = pageImage(page).nth(1);
  expect(await readPixel(uploadsPage, 25, 25)).toEqual(red);
  expect(await readPixel(uploadsPage, 55, 25)).toEqual(fixtureGreen);
});

test("defineAtlasInput accepts multiple uploads and exposes its packed texture to the script", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const upload = page.getByLabel(
    "Select one or more Uploaded Atlas texture files"
  );
  await expect(upload).toHaveAttribute("multiple", "");
  await upload.setInputFiles([
    {
      name: "quadrants-a.png",
      mimeType: "image/png",
      buffer: quadrantsFixture(),
    },
    {
      name: "quadrants-b.png",
      mimeType: "image/png",
      buffer: quadrantsFixture(),
    },
  ]);

  const uploadsPage = pageImage(page).nth(1);
  expect(await readPixel(uploadsPage, 85, 25)).toEqual(red);
  expect(await readPixel(uploadsPage, 115, 25)).toEqual(fixtureGreen);
});

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const skinPage = (page: Page) => pageImage(page).nth(2);

const skinPicker = (page: Page) =>
  page.locator("select").filter({ has: page.locator('option[value="Fixture"]') });

test("defineMinecraftSkinInput exposes its picker, preset, and model-type selection", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  const picker = skinPicker(page);
  await expect(picker).toHaveValue("Fixture");
  await expect(picker.locator("option")).toHaveText(["None", "Fixture skin"]);

  const modelType = page.locator("select").filter({
    has: page.locator('option[value="Slim"]'),
  });
  await expect(modelType).toHaveValue("Wide");
  await modelType.selectOption("Slim");
  await expect(modelType).toHaveValue("Slim");
  await expect
    .poll(async () => readPixel(skinPage(page), 24, 24))
    .not.toEqual(transparent);
});

test("defineMinecraftSkinInput converts a deterministic local 64x64 skin upload", async ({
  page,
}) => {
  await page.goto("/generator/test-api-controls");

  await skinPicker(page).selectOption("");
  expect(await readPixel(skinPage(page), 24, 24)).toEqual(transparent);

  await page
    .getByLabel("Upload Minecraft skin skin file")
    .setInputFiles(skinFixturePath);

  await expect
    .poll(async () => readPixel(skinPage(page), 24, 24))
    .not.toEqual(transparent);
});

test("defineMinecraftSkinInput fetches and converts a routed username skin", async ({
  page,
}) => {
  const skinData = fs.readFileSync(skinFixturePath).toString("base64");
  let usernameRequestWasMade = false;
  await page.route("https://api.ashcon.app/mojang/v2/user/FixtureUser", (route) => {
    usernameRequestWasMade = true;
    return route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ textures: { skin: { data: skinData } } }),
    });
  });
  await page.goto("/generator/test-api-controls");

  await skinPicker(page).selectOption("");
  expect(await readPixel(skinPage(page), 24, 24)).toEqual(transparent);

  await page.getByPlaceholder("Enter username").fill("FixtureUser");
  await page.getByRole("button", { name: "Fetch skin" }).click();

  expect(usernameRequestWasMade).toBe(true);
  await expect
    .poll(async () => readPixel(skinPage(page), 24, 24))
    .not.toEqual(transparent);
});
