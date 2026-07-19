import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type PresetExpectation = {
  name: string;
  rgba: Rgba;
};

// Front-face colour of each built-in skin preset at the Page 1 head Face probe
// (45, 131). The point sits inside a single opaque skin texel with a uniform 3x3
// neighbourhood and no semi-transparent overlay on top, so the read is an exact
// integer colour that matches across renderers (see the pixel-probe stability
// note). Every preset resolves to a distinct colour, so a mis-selected skin
// fails its own row.
const presetExpectations: PresetExpectation[] = [
  { name: "Alex", rgba: { r: 239, g: 218, b: 191, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 223, g: 150, b: 88, a: 255 } },
  { name: "Makena", rgba: { r: 68, g: 53, b: 40, a: 255 } },
  { name: "Noor", rgba: { r: 185, g: 103, b: 74, a: 255 } },
  { name: "Steve", rgba: { r: 155, g: 99, b: 73, a: 255 } },
  { name: "Sunny", rgba: { r: 216, g: 132, b: 75, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 187, g: 137, b: 114, a: 255 } },
];

// The head-face probe used by the preset enumeration above.
const faceProbe = { x: 45, y: 131 };

// A Page 1 right-arm probe (69, 331). With the opaque testSheet fixture uploaded
// it reads a solid colour in both model types, and the Wide->Slim arm-net shift
// moves a different source face under the probe — the branch's only pixel tell.
const armProbe = { x: 69, y: 331 };
const armWideRgba: Rgba = { r: 16, g: 185, b: 129, a: 255 };
const armSlimRgba: Rgba = { r: 249, g: 115, b: 22, a: 255 };

// With no skin selected and no static "Skin" texture backing it, "None" renders
// nothing, so the head probe reads the white page background.
const whiteRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPages = (page: Page) => page.getByTestId("generator-page-image");

const outputPage = (page: Page) => outputPages(page).first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

// The generator defines no clickable regions, so the output has no region
// overlay divs.
const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft mutant character v2 generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-mutant-character");

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
  await expect(page.getByRole("combobox")).toHaveCount(2);
  await expect(regions(page)).toHaveCount(0);
  await expect(outputPages(page)).toHaveCount(4);
});

test("minecraft mutant character v2 generator matches the default screenshots", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-mutant-character");

  const pages = outputPages(page);
  await expect(pages).toHaveCount(4);

  for (let index = 0; index < 4; index += 1) {
    const pageImage = pages.nth(index);

    await expect(pageImage).toBeVisible();
    await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(pageImage);

    await expect(pageImage).toHaveScreenshot(
      "minecraft-mutant-character-v2-default-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft mutant character v2 generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-mutant-character");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(() => readPixel(pageImage, faceProbe.x, faceProbe.y))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(() => readPixel(pageImage, faceProbe.x, faceProbe.y))
    .toEqual(whiteRgba);
});

test("minecraft mutant character v2 generator renders a custom skin upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-mutant-character");

  const pages = outputPages(page);
  const pageImage = pages.first();
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, armProbe.x, armProbe.y))
    .toEqual(armWideRgba);

  for (let index = 0; index < 4; index += 1) {
    const output = pages.nth(index);
    await renderImageAtNaturalSize(output);
    await expect(output).toHaveScreenshot(
      "minecraft-mutant-character-v2-custom-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft mutant character v2 generator renders the Slim model geometry", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-mutant-character");

  const pages = outputPages(page);
  const pageImage = pages.first();
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  await expect
    .poll(() => readPixel(pageImage, armProbe.x, armProbe.y))
    .toEqual(armWideRgba);

  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, armProbe.x, armProbe.y))
    .toEqual(armSlimRgba);

  // Only Pages 1 and 2 branch on the model type, so those are the meaningful
  // Slim compositions.
  for (let index = 0; index < 2; index += 1) {
    const output = pages.nth(index);
    await renderImageAtNaturalSize(output);
    await expect(output).toHaveScreenshot(
      "minecraft-mutant-character-v2-slim-page-" + (index + 1) + ".png"
    );
  }
});
