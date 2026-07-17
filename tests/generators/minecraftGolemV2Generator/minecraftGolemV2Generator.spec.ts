import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// The Iron Golem papercraft has three texture inputs and two boolean toggles,
// and no clickable regions:
//   - "Golem": custom upload only (choices: []), defaulting to the bundled iron
//     golem sheet; drives the whole body net.
//   - "Flower": a select of three flower presets (plus custom upload) with NO
//     default, so it starts "None" and no flower is drawn until one is chosen.
//   - "Damage": a select of three damage-crack presets (plus custom upload) with
//     NO default, so it starts "None" and no cracks are drawn until chosen.
//   - "Show Folds" / "Show Labels" booleans, both default true.
// The flower and damage passes are guarded by generator.hasTexture(...), so the
// absence of a selection must leave those areas untouched.

type NamedRgba = { name: string; rgba: Rgba };

const fixture = "src/generators/_common/fixtures/testSheet.png";

// A body pixel on the golem's face. Default (iron golem) reads a tan/grey; a
// custom uploaded sheet repaints it to the fixture's colour.
const bodyProbe = { x: 135, y: 123 };
const bodyDefault: Rgba = { r: 207, g: 177, b: 152, a: 255 };
const bodyFixture: Rgba = { r: 239, g: 68, b: 68, a: 255 };

// A pixel in the flower area. With no flower ("None") it is the white A4
// background; each flower preset paints a distinct colour there.
const flowerProbe = { x: 90, y: 286 };
const flowerNone: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const flowerExpectations: NamedRgba[] = [
  { name: "Poppy Flower", rgba: { r: 237, g: 48, b: 44, a: 255 } },
  { name: "Rose Flower", rgba: { r: 247, g: 7, b: 15, a: 255 } },
  { name: "Cyan Flower", rgba: { r: 61, g: 185, b: 231, a: 255 } },
];

// A pixel where every damage preset overlays its darkest crack, so each choice
// (and only a choice, not "None") turns it near-black.
const damageCrackProbe = { x: 208, y: 280 };
const damageBody: Rgba = { r: 115, g: 109, b: 98, a: 255 };
const damageCrack: Rgba = { r: 14, g: 0, b: 0, a: 255 };
const damageChoices = ["Low Damage", "Medium Damage", "High Damage"];

// A pixel cracked only by the heavier "High Damage" sheet: "Low Damage" leaves
// it as body colour, "High Damage" darkens it — proving the presets are
// distinct textures rather than the same one wired three times.
const damageDistinctProbe = { x: 296, y: 342 };
const damageDistinctBody: Rgba = { r: 185, g: 153, b: 131, a: 255 };
const damageDistinctHigh: Rgba = { r: 73, g: 61, b: 14, a: 255 };

// Fold/label overlays. Both draw over the white background at these probes.
const foldProbe = { x: 104, y: 18 };
const foldOn: Rgba = { r: 123, g: 123, b: 123, a: 255 };
const labelProbe = { x: 375, y: 79 };
const labelOn: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const labelOff: Rgba = { r: 156, g: 156, b: 156, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };

const output = (page: Page) =>
  page.getByTestId("generator-page-image").first();
const regions = (page: Page) =>
  output(page).locator("xpath=..").locator("div.absolute");
const flowerSelect = (page: Page) => page.getByLabel("Flower", { exact: true });
const damageSelect = (page: Page) => page.getByLabel("Damage", { exact: true });

test("minecraft golem generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  // Only Flower and Damage have enumerable presets; the "Golem" input has
  // choices:[] so it shows a custom upload rather than a select.
  await expect(page.getByRole("combobox")).toHaveCount(2);

  const flower = flowerSelect(page);
  await expect(flower).toHaveValue("");
  await expect(flower.locator("option")).toHaveText([
    "None",
    ...flowerExpectations.map(({ name }) => name),
  ]);

  const damage = damageSelect(page);
  await expect(damage).toHaveValue("");
  await expect(damage.locator("option")).toHaveText(["None", ...damageChoices]);

  await expect(page.getByLabel("Upload Golem texture file")).toBeVisible();
  await expect(page.getByLabel("Upload Flower texture file")).toBeVisible();
  await expect(page.getByLabel("Upload Damage texture file")).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();

  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
  await expect(regions(page)).toHaveCount(0);
});

test("minecraft golem generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-golem-default-page-1.png");
});

test("minecraft golem generator renders a custom golem body texture", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  await expect(readPixel(pageImage, bodyProbe.x, bodyProbe.y)).resolves.toEqual(
    bodyDefault
  );

  await page.getByLabel("Upload Golem texture file").setInputFiles(fixture);
  await expect
    .poll(() => readPixel(pageImage, bodyProbe.x, bodyProbe.y))
    .toEqual(bodyFixture);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-custom-golem-page-1.png"
  );
});

test("minecraft golem generator renders every flower choice and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  // No flower is drawn until one is selected.
  await expect(
    readPixel(pageImage, flowerProbe.x, flowerProbe.y)
  ).resolves.toEqual(flowerNone);

  for (const flower of flowerExpectations) {
    await flowerSelect(page).selectOption({ label: flower.name });
    await expect
      .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
      .toEqual(flower.rgba);
  }

  // Returning to None clears the flower again.
  await flowerSelect(page).selectOption("");
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerNone);
});

test("minecraft golem generator renders a golem with a chosen flower", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  await flowerSelect(page).selectOption({ label: "Poppy Flower" });
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerExpectations[0]?.rgba);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-poppy-flower-page-1.png"
  );
});

test("minecraft golem generator renders every damage choice and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  // No cracks are drawn until a damage sheet is selected.
  await expect(
    readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y)
  ).resolves.toEqual(damageBody);

  for (const choice of damageChoices) {
    await damageSelect(page).selectOption({ label: choice });
    await expect
      .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
      .toEqual(damageCrack);
  }

  await damageSelect(page).selectOption("");
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageBody);
});

test("minecraft golem generator distinguishes light from heavy damage", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  const probe = () =>
    readPixel(pageImage, damageDistinctProbe.x, damageDistinctProbe.y);

  // "Low Damage" leaves this pixel as body colour...
  await damageSelect(page).selectOption({ label: "Low Damage" });
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageCrack);
  await expect(probe()).resolves.toEqual(damageDistinctBody);

  // ...while "High Damage" cracks it.
  await damageSelect(page).selectOption({ label: "High Damage" });
  await expect.poll(probe).toEqual(damageDistinctHigh);
});

test("minecraft golem generator renders a golem with flower and damage", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  await flowerSelect(page).selectOption({ label: "Cyan Flower" });
  await damageSelect(page).selectOption({ label: "Medium Damage" });
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerExpectations[2]?.rgba);
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageCrack);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-flower-and-damage-page-1.png"
  );
});

test("minecraft golem generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-v2");

  const pageImage = output(page);
  const readFold = () => readPixel(pageImage, foldProbe.x, foldProbe.y);
  const readLabel = () => readPixel(pageImage, labelProbe.x, labelProbe.y);

  await expect(readFold()).resolves.toEqual(foldOn);
  await expect(readLabel()).resolves.toEqual(labelOn);

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual(white);
  await expect(readLabel()).resolves.toEqual(labelOn);

  await page.getByText("Show Labels", { exact: true }).click();
  await expect(page.getByLabel("Show Labels")).not.toBeChecked();
  await expect.poll(readLabel).toEqual(labelOff);
  await expect(readFold()).resolves.toEqual(white);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-overlays-off-page-1.png"
  );
});
