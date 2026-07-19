import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  cape: Rgba;
  wing: Rgba;
};

const presetExpectations: PresetExpectation[] = [
  {
    name: "Migrator Cape",
    cape: { r: 32, g: 33, b: 43, a: 255 },
    wing: { r: 43, g: 45, b: 59, a: 255 },
  },
  {
    name: "Vanilla Cape",
    cape: { r: 102, g: 166, b: 60, a: 255 },
    wing: { r: 81, g: 122, b: 55, a: 255 },
  },
  {
    name: "Cherry Blossom Cape",
    cape: { r: 255, g: 148, b: 214, a: 255 },
    wing: { r: 251, g: 108, b: 196, a: 255 },
  },
  {
    name: "Minecon 2011 Cape",
    cape: { r: 145, g: 6, b: 4, a: 255 },
    wing: { r: 205, g: 9, b: 5, a: 255 },
  },
  {
    name: "Minecon 2012 Cape",
    cape: { r: 1, g: 71, b: 137, a: 255 },
    wing: { r: 1, g: 109, b: 205, a: 255 },
  },
  {
    name: "Minecon 2013 Cape",
    cape: { r: 49, g: 112, b: 68, a: 255 },
    wing: { r: 66, g: 152, b: 91, a: 255 },
  },
  {
    name: "Minecon 2015 Cape",
    cape: { r: 57, g: 91, b: 86, a: 255 },
    wing: { r: 85, g: 119, b: 114, a: 255 },
  },
  {
    name: "Minecon 2016 Cape",
    cape: { r: 52, g: 52, b: 52, a: 255 },
    wing: { r: 76, g: 76, b: 76, a: 255 },
  },
  {
    name: "Founder's Cape",
    cape: { r: 218, g: 139, b: 26, a: 255 },
    wing: { r: 255, g: 174, b: 44, a: 255 },
  },
  {
    name: "Mojang Cape",
    cape: { r: 216, g: 32, b: 45, a: 255 },
    wing: { r: 173, g: 27, b: 38, a: 255 },
  },
  {
    name: "Elytra",
    cape: { r: 0, g: 0, b: 0, a: 0 },
    wing: { r: 66, g: 76, b: 88, a: 255 },
  },
];

const transparentRgba: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const overlayRgba: Rgba = { r: 123, g: 123, b: 123, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const capeSelect = (page: Page) => page.getByLabel("Cape", { exact: true });

const readCape = (page: Page) => readPixel(outputPage(page), 86, 120);
const readWing = (page: Page) => readPixel(outputPage(page), 85, 340);

test("minecraft cape and elytra generator exposes its texture and overlay controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  const cape = capeSelect(page);
  await expect(cape).toBeVisible();
  await expect(cape).toHaveValue("");
  await expect(cape.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(page.getByLabel("Upload Cape texture file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
});

test("minecraft cape and elytra generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cape-and-elytra-default-page-1.png"
  );
});

test("minecraft cape and elytra generator renders its fallback, every preset, and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  const cape = capeSelect(page);
  const migrator = presetExpectations[0];
  if (!migrator) {
    throw new Error("Missing Migrator Cape expectation");
  }
  await expect(readCape(page)).resolves.toEqual(migrator.cape);
  await expect(readWing(page)).resolves.toEqual(migrator.wing);

  for (const preset of presetExpectations) {
    await cape.selectOption(preset.name);
    await expect.poll(() => readCape(page)).toEqual(preset.cape);
    await expect.poll(() => readWing(page)).toEqual(preset.wing);
  }

  await cape.selectOption("");
  await expect.poll(() => readCape(page)).toEqual(transparentRgba);
  await expect.poll(() => readWing(page)).toEqual(transparentRgba);
});

test("minecraft cape and elytra generator composes the Elytra texture", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  await capeSelect(page).selectOption("Elytra");
  await expect
    .poll(() => readWing(page))
    .toEqual({
      r: 66,
      g: 76,
      b: 88,
      a: 255,
    });
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cape-and-elytra-elytra-page-1.png"
  );
});

test("minecraft cape and elytra generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  const pageImage = outputPage(page);
  const foldProbe = () => readPixel(pageImage, 83, 115);
  const labelProbe = () => readPixel(pageImage, 140, 65);
  await expect(foldProbe()).resolves.toEqual(overlayRgba);
  await expect(labelProbe()).resolves.toEqual(overlayRgba);

  await page.getByText("Show Folds", { exact: true }).click();
  await expect.poll(foldProbe).toEqual({ r: 87, g: 65, b: 16, a: 255 });
  await expect(labelProbe()).resolves.toEqual(overlayRgba);

  await page.getByText("Show Labels", { exact: true }).click();
  await expect.poll(labelProbe).toEqual({ r: 255, g: 255, b: 255, a: 255 });
  await expect(foldProbe()).resolves.toEqual({
    r: 87,
    g: 65,
    b: 16,
    a: 255,
  });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cape-and-elytra-overlays-off-page-1.png"
  );
});

test("minecraft cape and elytra generator renders a custom texture across the cape and wings", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cape-and-elytra-v1");

  await page
    .getByLabel("Upload Cape texture file")
    .setInputFiles(skinFixturePath);
  await expect
    .poll(() => readCape(page))
    .toEqual({ r: 239, g: 68, b: 68, a: 255 });
  await expect
    .poll(() => readWing(page))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cape-and-elytra-custom-texture-page-1.png"
  );
});
