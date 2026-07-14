import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type NamedRgba = { name: string; rgba: Rgba };

// The Cat texture input samples the selected breed sheet across the whole net.
// (120,88) is an interior pixel of the head "all sides" strip; it is clear of
// the Folds and Labels overlays and reads a distinct solid colour for every
// breed, so it uniquely identifies each preset.
const breedProbe = { x: 120, y: 88 };
const breedExpectations: NamedRgba[] = [
  { name: "Black", rgba: { r: 22, g: 21, b: 36, a: 255 } },
  { name: "British Shorthair", rgba: { r: 188, g: 188, b: 188, a: 255 } },
  { name: "Calico", rgba: { r: 219, g: 156, b: 62, a: 255 } },
  { name: "Jellie", rgba: { r: 116, g: 116, b: 116, a: 255 } },
  { name: "Ocelot", rgba: { r: 241, g: 179, b: 99, a: 255 } },
  { name: "Orange Tabby", rgba: { r: 234, g: 169, b: 57, a: 255 } },
  { name: "Persian", rgba: { r: 255, g: 234, b: 203, a: 255 } },
  { name: "Ragdoll", rgba: { r: 137, g: 116, b: 105, a: 255 } },
  { name: "Siamese", rgba: { r: 85, g: 76, b: 59, a: 255 } },
  { name: "Tabby", rgba: { r: 135, g: 101, b: 74, a: 255 } },
  { name: "Tuxedo", rgba: { r: 28, g: 24, b: 39, a: 255 } },
  { name: "White", rgba: { r: 253, g: 249, b: 251, a: 255 } },
];

// The Collar texture is drawn (opaque) over the neck band and tinted with the
// Collar Color dye via a MultiplyHex blend. (88,218) sits on that band and is
// clear of the Folds/Labels overlays, so it reads each dye's tinted colour.
const collarProbe = { x: 88, y: 218 };
const tintExpectations: NamedRgba[] = [
  { name: "Black", rgba: { r: 21, g: 21, b: 24, a: 255 } },
  { name: "Red", rgba: { r: 128, g: 33, b: 27, a: 255 } },
  { name: "Green", rgba: { r: 68, g: 90, b: 16, a: 255 } },
  { name: "Brown", rgba: { r: 95, g: 61, b: 36, a: 255 } },
  { name: "Blue", rgba: { r: 43, g: 49, b: 124, a: 255 } },
  { name: "Purple", rgba: { r: 99, g: 36, b: 134, a: 255 } },
  { name: "Cyan", rgba: { r: 16, g: 113, b: 113, a: 255 } },
  { name: "Light Gray", rgba: { r: 114, g: 114, b: 110, a: 255 } },
  { name: "Gray", rgba: { r: 51, g: 57, b: 59, a: 255 } },
  { name: "Pink", rgba: { r: 177, g: 101, b: 124, a: 255 } },
  { name: "Lime", rgba: { r: 93, g: 145, b: 22, a: 255 } },
  { name: "Yellow", rgba: { r: 185, g: 157, b: 44, a: 255 } },
  { name: "Light Blue", rgba: { r: 42, g: 130, b: 159, a: 255 } },
  { name: "Magenta", rgba: { r: 145, g: 56, b: 137, a: 255 } },
  { name: "Orange", rgba: { r: 181, g: 93, b: 21, a: 255 } },
  { name: "White", rgba: { r: 181, g: 186, b: 185, a: 255 } },
];

const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const output = (page: Page) =>
  page.getByTestId("generator-page-image").first();
const catSelect = (page: Page) => page.getByLabel("Cat", { exact: true });
const collarSelect = (page: Page) => page.getByLabel("Collar", { exact: true });
const tintSelect = (page: Page) => page.getByLabel("Collar Color");

test("minecraft cat generator exposes its controls", async ({ page }) => {
  await page.goto("/generator/minecraft-cat");

  await expect(page.getByRole("combobox")).toHaveCount(3);

  const cat = catSelect(page);
  await expect(cat).toHaveValue("");
  await expect(cat.locator("option")).toHaveText([
    "None",
    ...breedExpectations.map(({ name }) => name),
  ]);

  const collar = collarSelect(page);
  await expect(collar).toHaveValue("");
  await expect(collar.locator("option")).toHaveText(["None", "Cat Collar"]);

  const tint = tintSelect(page);
  await expect(tint.locator("option:checked")).toHaveText("Red");
  await expect(tint.locator("option")).toHaveText([
    "Custom tint",
    ...tintExpectations.map(({ name }) => name),
  ]);

  await expect(page.getByLabel("Upload Cat texture file")).toBeVisible();
  await expect(page.getByLabel("Upload Collar texture file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
});

test("minecraft cat generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-cat-default-page-1.png");
});

test("minecraft cat generator renders every breed and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  await renderImageAtNaturalSize(pageImage);

  for (const breed of breedExpectations) {
    await catSelect(page).selectOption({ label: breed.name });
    await expect
      .poll(() => readPixel(pageImage, breedProbe.x, breedProbe.y))
      .toEqual(breed.rgba);
  }

  await catSelect(page).selectOption("");
  await expect
    .poll(() => readPixel(pageImage, breedProbe.x, breedProbe.y))
    .toEqual(transparent);
});

test("minecraft cat generator renders a distinctive breed composition", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  await catSelect(page).selectOption({ label: "Calico" });
  await expect
    .poll(() => readPixel(pageImage, breedProbe.x, breedProbe.y))
    .toEqual({ r: 219, g: 156, b: 62, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-cat-calico-page-1.png");
});

test("minecraft cat generator tints the collar with every dye", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  await renderImageAtNaturalSize(pageImage);
  await collarSelect(page).selectOption({ label: "Cat Collar" });

  for (const dye of tintExpectations) {
    await tintSelect(page).selectOption({ label: dye.name });
    await expect
      .poll(() => readPixel(pageImage, collarProbe.x, collarProbe.y))
      .toEqual(dye.rgba);
  }

  // Custom tint: typing the Blue dye's own hex must reproduce the Blue result,
  // proving the free-text hex path feeds the same MultiplyHex blend.
  await tintSelect(page).selectOption({ label: "Custom tint" });
  await page.getByPlaceholder("Enter hex color").fill("3C44AA");
  await expect
    .poll(() => readPixel(pageImage, collarProbe.x, collarProbe.y))
    .toEqual({ r: 43, g: 49, b: 124, a: 255 });
});

test("minecraft cat generator renders a tinted collar", async ({ page }) => {
  await page.goto("/generator/minecraft-cat");

  await collarSelect(page).selectOption({ label: "Cat Collar" });
  await tintSelect(page).selectOption({ label: "Blue" });

  const pageImage = output(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await expect
    .poll(() => readPixel(pageImage, collarProbe.x, collarProbe.y))
    .toEqual({ r: 43, g: 49, b: 124, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-cat-blue-collar-page-1.png");
});

test("minecraft cat generator renders a custom cat texture", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  await page
    .getByLabel("Upload Cat texture file")
    .setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, breedProbe.x, breedProbe.y))
    .toEqual({ r: 234, g: 179, b: 8, a: 255 });
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cat-custom-upload-page-1.png"
  );
});

test("minecraft cat generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-cat");

  const pageImage = output(page);
  const readFold = () => readPixel(pageImage, 82, 32);
  const readLabel = () => readPixel(pageImage, 142, 46);
  await expect(readFold()).resolves.toEqual({ r: 123, g: 123, b: 123, a: 255 });
  await expect(readLabel()).resolves.toEqual({ r: 102, g: 102, b: 102, a: 255 });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual(white);
  await expect(readLabel()).resolves.toEqual({ r: 102, g: 102, b: 102, a: 255 });

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual(white);
  await expect(readFold()).resolves.toEqual(white);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-cat-overlays-off-page-1.png"
  );
});
