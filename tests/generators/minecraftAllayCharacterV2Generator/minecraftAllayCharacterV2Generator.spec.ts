import { expect, test, type Locator, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// This generator has two independent Minecraft-skin inputs (Skin 1 renders the
// top half of the page, Skin 2 the bottom half), and each exposes a model-type
// (Wide/Slim) selector. The skin headings are plain <div>s and the <select>s
// carry no accessible name, so the page has four unlabelled comboboxes in
// source order: 0 = Skin 1 preset, 1 = Skin 1 model type, 2 = Skin 2 preset,
// 3 = Skin 2 model type.
type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

// Captured from a first run at the face probe; every preset is distinct there.
// Hardcoded (not derived from the production skins) so a mis-mapped preset or
// source region fails the assertion.
const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 235, g: 152, b: 63, a: 255 } },
  { name: "Ari", rgba: { r: 241, g: 147, b: 110, a: 255 } },
  { name: "Efe", rgba: { r: 129, g: 88, b: 137, a: 255 } },
  { name: "Kai", rgba: { r: 251, g: 237, b: 145, a: 255 } },
  { name: "Makena", rgba: { r: 31, g: 10, b: 14, a: 255 } },
  { name: "Noor", rgba: { r: 167, g: 92, b: 67, a: 255 } },
  { name: "Steve", rgba: { r: 63, g: 42, b: 21, a: 255 } },
  { name: "Sunny", rgba: { r: 56, g: 56, b: 56, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 51, g: 36, b: 17, a: 255 } },
];

// A skin set to None draws no face, and the Overlay is transparent over the
// face panels, so the probe reads fully transparent.
const clearedRgba: Rgba = { r: 0, g: 0, b: 0, a: 0 };

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

// Interior point of the Skin 1 front-face panel (62,63)-(112,113); clear of the
// eyes and the Overlay fold lines. The Skin 2 panel is the same offset 361px
// lower, so its probe is (skin1FaceX, skin1FaceY + 361).
const skin1FaceX = 85;
const skin1FaceY = 70;
const skin2FaceOffsetY = 361;

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const combos = (page: Page) => page.getByRole("combobox");

const readSkin1Face = (image: Locator) =>
  readPixel(image, skin1FaceX, skin1FaceY);
const readSkin2Face = (image: Locator) =>
  readPixel(image, skin1FaceX, skin1FaceY + skin2FaceOffsetY);

test("minecraft allay character exposes both skin inputs and their model-type controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const combobox = combos(page);
  await expect(combobox).toHaveCount(4);

  const presetOptions = ["None", ...presetExpectations.map(({ name }) => name)];

  // Skin 1 preset + model type
  await expect(combobox.nth(0)).toHaveValue("Default");
  await expect(combobox.nth(0).locator("option")).toHaveText(presetOptions);
  await expect(combobox.nth(1)).toHaveValue("Wide");
  await expect(combobox.nth(1).locator("option")).toHaveText(["Wide", "Slim"]);

  // Skin 2 preset + model type
  await expect(combobox.nth(2)).toHaveValue("Default");
  await expect(combobox.nth(2).locator("option")).toHaveText(presetOptions);
  await expect(combobox.nth(3)).toHaveValue("Wide");
  await expect(combobox.nth(3).locator("option")).toHaveText(["Wide", "Slim"]);

  await expect(page.getByLabel("Upload Skin 1 skin file")).toBeVisible();
  await expect(page.getByLabel("Upload Skin 2 skin file")).toBeVisible();
});

test("minecraft allay character matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-allay-character-default-page-1.png"
  );
});

test("minecraft allay character renders every Skin 1 preset at the face probe", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const skin1 = combos(page).nth(0);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin1.selectOption(preset.name);
    await expect
      .poll(async () => readSkin1Face(pageImage))
      .toEqual(preset.rgba);
  }

  await skin1.selectOption("");
  await expect.poll(async () => readSkin1Face(pageImage)).toEqual(clearedRgba);
});

test("minecraft allay character renders every Skin 2 preset independently of Skin 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const skin2 = combos(page).nth(2);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin2.selectOption(preset.name);
    await expect
      .poll(async () => readSkin2Face(pageImage))
      .toEqual(preset.rgba);
  }

  await skin2.selectOption("");
  await expect.poll(async () => readSkin2Face(pageImage)).toEqual(clearedRgba);

  // The two inputs are independent: driving each to a distinct preset leaves the
  // other half unchanged.
  const skin1 = combos(page).nth(0);
  const kai = { r: 251, g: 237, b: 145, a: 255 };
  const alex = { r: 235, g: 152, b: 63, a: 255 };
  await skin1.selectOption("Kai");
  await skin2.selectOption("Alex");
  await expect.poll(async () => readSkin1Face(pageImage)).toEqual(kai);
  await expect.poll(async () => readSkin2Face(pageImage)).toEqual(alex);
});

test("minecraft allay character composes an Alex skin across both halves", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const pageImage = outputPage(page);
  await combos(page).nth(0).selectOption("Alex");
  await combos(page).nth(2).selectOption("Alex");
  // Wait for both faces to repaint before snapshotting the whole page.
  const alex = { r: 235, g: 152, b: 63, a: 255 };
  await expect.poll(async () => readSkin1Face(pageImage)).toEqual(alex);
  await expect.poll(async () => readSkin2Face(pageImage)).toEqual(alex);
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-allay-character-alex-page-1.png"
  );
});

test("minecraft allay character composes Skin 1 with the Slim model type", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const pageImage = outputPage(page);
  const skin1ModelType = combos(page).nth(1);

  await expect(skin1ModelType).toHaveValue("Wide");
  await skin1ModelType.selectOption("Slim");
  await expect(skin1ModelType).toHaveValue("Slim");
  // The Slim sheet reloads asynchronously. The Default preset's Slim art differs
  // from its Wide art even at the face, so polling the face to the Slim value
  // both waits for the reload to settle before snapshotting and confirms the
  // model-type control swapped the sheet (in addition to the Alex arm geometry
  // the snapshot guards).
  await expect
    .poll(async () => readSkin1Face(pageImage))
    .toEqual({ r: 230, g: 154, b: 69, a: 255 });
  // Slim also swaps the arms to the narrower Alex geometry (drawRightArmAlex/
  // drawLeftArmAlex). That geometry draws into the same destination rects as the
  // Wide arms and only differs in the sampled source region, so it is too small
  // a change for the composition snapshot's tolerance to catch. This probe on
  // Skin 1's left arm net reads a distinct colour under Alex geometry (Wide
  // geometry reads { 126, 179, 123 } here), guarding the isSlim arm branch.
  await expect
    .poll(async () => readPixel(pageImage, 53, 205))
    .toEqual({ r: 141, g: 191, b: 139, a: 255 });
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-allay-character-slim-page-1.png"
  );
});

test("minecraft allay character renders a custom Skin 1 upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-allay-character-v2");

  const pageImage = outputPage(page);
  await page
    .getByLabel("Upload Skin 1 skin file")
    .setInputFiles(skinFixturePath);

  await expect
    .poll(async () => readSkin1Face(pageImage))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-allay-character-custom-skin-page-1.png"
  );
});
