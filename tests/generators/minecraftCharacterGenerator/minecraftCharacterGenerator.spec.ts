import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// This spec is a deliberate near-verbatim copy of
// minecraftCharacterGenerator.spec.ts (the v1 generator). The ONLY change is
// the route (`/generator/minecraft-character` ->
// `/generator/minecraft-character-v2`). minecraft-character-v2 was ported to
// be behaviourally identical to v1 — same reused MinecraftSkinControl picker
// (with model type), same Show Folds/Show Labels toggles, same six overlay
// regions, same Minecraft.drawCuboid render — so the entire v1 assertion set
// is expected to pass unchanged against v1's own baselines.

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

type LayerExpectation = {
  x: number;
  y: number;
  visible: Rgba;
  hidden: Rgba;
};

// Every skin preset shows a distinct, opaque colour at the head-face probe.
const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 239, g: 218, b: 191, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 223, g: 150, b: 88, a: 255 } },
  { name: "Makena", rgba: { r: 68, g: 53, b: 40, a: 255 } },
  { name: "Noor", rgba: { r: 185, g: 103, b: 74, a: 255 } },
  { name: "Steve", rgba: { r: 170, g: 114, b: 89, a: 255 } },
  { name: "Sunny", rgba: { r: 47, g: 47, b: 47, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 156, g: 114, b: 92, a: 255 } },
];

// Each of the six overlay regions toggles one body part's outer layer. With the
// coloured fixture every part has a distinct outer (visible) and base (hidden)
// colour, so a mis-wired region would fail to flip its own probe. Order matches
// the region-definition order: Head, Body, Right Arm, Left Arm, Right Leg, Left Leg.
const layerExpectations: LayerExpectation[] = [
  {
    x: 98,
    y: 91,
    visible: { r: 34, g: 197, b: 94, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 316,
    y: 201,
    visible: { r: 6, g: 182, b: 212, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 147,
    y: 373,
    visible: { r: 249, g: 115, b: 22, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 461,
    y: 373,
    visible: { r: 132, g: 204, b: 22, a: 255 },
    hidden: { r: 244, g: 63, b: 94, a: 255 },
  },
  {
    x: 147,
    y: 587,
    visible: { r: 139, g: 92, b: 246, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
  {
    x: 461,
    y: 587,
    visible: { r: 217, g: 70, b: 239, a: 255 },
    hidden: { r: 20, g: 184, b: 166, a: 255 },
  },
];

const whiteRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft character generator exposes its controls", async ({ page }) => {
  await page.goto("/generator/minecraft-character");

  const skin = skinSelect(page);
  await expect(skin).toHaveValue("Default");
  await expect(skin.locator("option")).toHaveText([
    "None",
    ...presetExpectations.map(({ name }) => name),
  ]);
  await expect(modelTypeSelect(page)).toHaveValue("Wide");
  await expect(modelTypeSelect(page).locator("option")).toHaveText([
    "Wide",
    "Slim",
  ]);
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-default-page-1.png"
  );
});

test("minecraft character generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(() => readPixel(pageImage, 170, 120))
      .toEqual(preset.rgba);
  }

  // With no skin selected the opaque Background shows through at the head face.
  await skin.selectOption("");
  await expect.poll(() => readPixel(pageImage, 170, 120)).toEqual(whiteRgba);
});

test("minecraft character generator renders a custom skin upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, 400, 237))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-custom-page-1.png"
  );
});

test("minecraft character generator renders the Slim model geometry", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  // (169,413) lands on the Wide right-arm front face; narrowing to Slim shifts
  // the arm net so a different source face lands here — the branch's only tell.
  await expect
    .poll(() => readPixel(pageImage, 169, 413))
    .toEqual({ r: 16, g: 185, b: 129, a: 255 });

  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, 169, 413))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-slim-page-1.png"
  );
});

test("minecraft character generator hides every outer skin layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  let regionIndex = 0;
  for (const layer of layerExpectations) {
    await expect
      .poll(() => readPixel(pageImage, layer.x, layer.y))
      .toEqual(layer.visible);
    await regions(page).nth(regionIndex).click();
    await expect
      .poll(() => readPixel(pageImage, layer.x, layer.y))
      .toEqual(layer.hidden);
    regionIndex += 1;
  }

  const box = await pageImage.boundingBox();
  if (!box) {
    throw new Error("Character output page was not measurable");
  }
  // Move off the final region so its hover outline is absent from the baseline.
  await page.mouse.move(box.x - 20, box.y - 20);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-outer-layers-hidden-page-1.png"
  );
});

test("minecraft character generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character");

  const pageImage = outputPage(page);
  const readFold = () => readPixel(pageImage, 137, 34);
  const readLabel = () => readPixel(pageImage, 119, 196);
  await expect(readFold()).resolves.toEqual({ r: 191, g: 191, b: 191, a: 255 });
  await expect(readLabel()).resolves.toEqual({
    r: 127,
    g: 127,
    b: 127,
    a: 255,
  });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual(whiteRgba);
  await expect(readLabel()).resolves.toEqual({
    r: 127,
    g: 127,
    b: 127,
    a: 255,
  });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual(whiteRgba);
  await expect(readFold()).resolves.toEqual(whiteRgba);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-overlays-off-page-1.png"
  );
});
