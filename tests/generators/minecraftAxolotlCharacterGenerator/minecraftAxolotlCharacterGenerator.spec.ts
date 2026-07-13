import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type OptionExpectation = {
  name: string;
  rgba: Rgba;
};

const skinExpectations: OptionExpectation[] = [
  { name: "Alex", rgba: { r: 229, g: 141, b: 63, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 223, g: 150, b: 88, a: 255 } },
  { name: "Makena", rgba: { r: 68, g: 53, b: 40, a: 255 } },
  { name: "Noor", rgba: { r: 169, g: 86, b: 58, a: 255 } },
  { name: "Steve", rgba: { r: 179, g: 121, b: 94, a: 255 } },
  { name: "Sunny", rgba: { r: 56, g: 56, b: 56, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 170, g: 125, b: 102, a: 255 } },
];

const headFinExpectations: OptionExpectation[] = [
  { name: "Blue", rgba: { r: 180, g: 91, b: 76, a: 255 } },
  { name: "Cyan", rgba: { r: 223, g: 114, b: 167, a: 255 } },
  { name: "Pink", rgba: { r: 242, g: 112, b: 147, a: 255 } },
  { name: "Gold", rgba: { r: 230, g: 140, b: 0, a: 255 } },
  { name: "Brown", rgba: { r: 80, g: 63, b: 48, a: 255 } },
  { name: "", rgba: { r: 47, g: 31, b: 15, a: 255 } },
];

const tailFinExpectations: OptionExpectation[] = [
  { name: "Blue", rgba: { r: 105, g: 86, b: 227, a: 255 } },
  { name: "Cyan", rgba: { r: 227, g: 114, b: 166, a: 255 } },
  { name: "Pink", rgba: { r: 226, g: 97, b: 150, a: 255 } },
  { name: "Gold", rgba: { r: 223, g: 115, b: 0, a: 255 } },
  { name: "Brown", rgba: { r: 113, g: 85, b: 77, a: 255 } },
  { name: "", rgba: { r: 0, g: 175, b: 175, a: 255 } },
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const comboboxes = (page: Page) => page.getByRole("combobox");

test("minecraft axolotl character generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const selects = comboboxes(page);
  await expect(selects).toHaveCount(4);
  await expect(selects.nth(0)).toHaveValue("Default");
  await expect(selects.nth(0).locator("option")).toHaveText([
    "None",
    ...skinExpectations.map(({ name }) => name),
  ]);
  await expect(selects.nth(1)).toHaveValue("Wide");
  await expect(selects.nth(1).locator("option")).toHaveText(["Wide", "Slim"]);

  const finOptions = ["None", "Blue", "Cyan", "Pink", "Gold", "Brown"];
  await expect(
    page.getByLabel("Head Fins Texture", { exact: true })
  ).toHaveValue("");
  await expect(
    page.getByLabel("Head Fins Texture", { exact: true }).locator("option")
  ).toHaveText(finOptions);
  await expect(
    page.getByLabel("Tail Fins Texture", { exact: true })
  ).toHaveValue("");
  await expect(
    page.getByLabel("Tail Fins Texture", { exact: true }).locator("option")
  ).toHaveText(finOptions);

  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
  await expect(
    page.getByLabel("Upload Head Fins Texture texture file")
  ).toBeVisible();
  await expect(
    page.getByLabel("Upload Tail Fins Texture texture file")
  ).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByLabel("Show Overlay")).toBeChecked();

  const face = page.getByLabel("Axolotl Face");
  await expect(face).toHaveAttribute("min", "0");
  await expect(face).toHaveAttribute("max", "5");
  await expect(face).toHaveAttribute("step", "1");
  await expect(face).toHaveValue("0");
});

test("minecraft axolotl character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-axolotl-character-default-page-1.png"
  );
});

test("minecraft axolotl character generator renders every skin preset at the face probe", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const skin = comboboxes(page).nth(0);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of skinExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(async () => readPixel(pageImage, 250, 230))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(async () => readPixel(pageImage, 250, 230))
    .toEqual({ r: 0, g: 0, b: 0, a: 0 });
});

test("minecraft axolotl character generator renders every head-fin choice", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const fins = page.getByLabel("Head Fins Texture", { exact: true });
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const option of headFinExpectations) {
    await fins.selectOption(option.name);
    await expect
      .poll(async () => readPixel(pageImage, 255, 15))
      .toEqual(option.rgba);
  }
});

test("minecraft axolotl character generator renders every tail-fin choice", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const fins = page.getByLabel("Tail Fins Texture", { exact: true });
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const option of tailFinExpectations) {
    await fins.selectOption(option.name);
    await expect
      .poll(async () => readPixel(pageImage, 260, 580))
      .toEqual(option.rgba);
  }
});

test("minecraft axolotl character generator composes the Slim model geometry", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await comboboxes(page).nth(1).selectOption("Slim");
  await expect
    .poll(async () => readPixel(pageImage, 250, 230))
    .toEqual({ r: 221, g: 148, b: 57, a: 255 });
  await expect
    .poll(async () => readPixel(pageImage, 418, 487))
    .toEqual({ r: 239, g: 219, b: 192, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-axolotl-character-slim-page-1.png"
  );
});

test("minecraft axolotl character generator stretches its face", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  const face = page.getByLabel("Axolotl Face");
  await expect(readPixel(pageImage, 195, 230)).resolves.toEqual({
    r: 40,
    g: 26,
    b: 13,
    a: 255,
  });
  await face.press("End");
  await expect(face).toHaveValue("5");
  await expect
    .poll(async () => readPixel(pageImage, 195, 230))
    .toEqual({ r: 170, g: 125, b: 102, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-axolotl-character-stretched-face-page-1.png"
  );
});

test("minecraft axolotl character generator hides its folds", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await expect(readPixel(pageImage, 409, 547)).resolves.toEqual({
    r: 127,
    g: 127,
    b: 127,
    a: 255,
  });
  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect
    .poll(async () => readPixel(pageImage, 409, 547))
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
});

test("minecraft axolotl character generator hides its labels", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await expect(readPixel(pageImage, 127, 55)).resolves.toEqual({
    r: 254,
    g: 81,
    b: 1,
    a: 255,
  });
  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect
    .poll(async () => readPixel(pageImage, 127, 55))
    .toEqual({ r: 255, g: 255, b: 255, a: 255 });
});

test("minecraft axolotl character generator hides the skin overlay", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await comboboxes(page).nth(0).selectOption("Ari");
  await expect
    .poll(async () => readPixel(pageImage, 282, 398))
    .toEqual({ r: 128, g: 48, b: 18, a: 255 });
  await page.getByText("Show Overlay", { exact: true }).click();
  await expect(page.getByLabel("Show Overlay")).not.toBeChecked();
  await expect
    .poll(async () => readPixel(pageImage, 282, 398))
    .toEqual({ r: 251, g: 168, b: 87, a: 255 });
});

test("minecraft axolotl character generator renders a custom skin upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-axolotl-character");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(async () => readPixel(pageImage, 250, 230))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-axolotl-character-custom-skin-page-1.png"
  );
});
