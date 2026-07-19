import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// The Golem Character papercraft combines a Minecraft-skin character body
// (like minecraftEndermanCharacterV2) with the golem-shaped flower/damage
// overlays of minecraftGolemV2:
//   - "Skin": MinecraftSkinControl with Wide/Slim model type, no default
//     texture, so "None" renders nothing until a preset or custom skin loads.
//   - "Flower": a select of three flower presets (plus custom upload) with NO
//     default, so it starts "None" and no flower is drawn until one is chosen.
//   - "Damage": a select of three damage-crack presets (plus custom upload)
//     with NO default, so it starts "None" and no cracks are drawn until
//     chosen.
//   - "Show Folds" / "Show Labels" booleans, both default true.
//   - Six clickable overlay regions (helmet, jacket, rightPant, leftPant,
//     rightSleeve, leftSleeve), each toggling a `hide*` boolean.
// The flower pass is unguarded in V1 but silently no-ops without a loaded
// "Flower" texture; V2 makes that explicit with `ctx.hasTexture("Flower")`.
// The damage pass was already guarded in V1 the same way.

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

type NamedRgba = { name: string; rgba: Rgba };

// Head front-face colour of each built-in skin preset, read at the head-face
// probe below.
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

// Head front-face probe: destination rect for the head's front face is
// { x: 103, y: 83, w: 64, h: 80 } (ox=39,oy=19).
const headProbe = { x: 136, y: 124 };

// With no skin loaded and no static "Skin" texture, "None" renders nothing, so
// the head probe reads the white page background.
const noneRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

// One probe per clickable region, in DOM order:
// helmet, jacket, rightPant, leftPant, rightSleeve, leftSleeve.
// Each point sits on that layer's front face; clicking the region hides the
// outer (overlay) layer and reveals the base skin colour beneath. Colours come
// from uploading the shared testSheet fixture.
const layerExpectations: LayerExpectation[] = [
  {
    x: 113,
    y: 95,
    visible: { r: 34, g: 197, b: 94, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 230,
    y: 300,
    visible: { r: 6, g: 182, b: 212, a: 255 },
    hidden: { r: 59, g: 130, b: 246, a: 255 },
  },
  {
    x: 445,
    y: 467,
    visible: { r: 139, g: 92, b: 246, a: 255 },
    hidden: { r: 243, g: 244, b: 246, a: 255 },
  },
  {
    x: 445,
    y: 681,
    visible: { r: 217, g: 70, b: 239, a: 255 },
    hidden: { r: 20, g: 184, b: 166, a: 255 },
  },
  {
    x: 82,
    y: 577,
    visible: { r: 249, g: 115, b: 22, a: 255 },
    hidden: { r: 234, g: 179, b: 8, a: 255 },
  },
  {
    x: 269,
    y: 577,
    visible: { r: 132, g: 204, b: 22, a: 255 },
    hidden: { r: 244, g: 63, b: 94, a: 255 },
  },
];

// A pixel in the flower area (the flower is drawn rotated 90°, so its actual
// painted area is offset from its raw destination rect). With no flower
// ("None") it is the white A4 background; each flower preset paints a
// distinct colour there.
const flowerProbe = { x: 71, y: 222 };
const flowerNone: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const flowerExpectations: NamedRgba[] = [
  { name: "Poppy", rgba: { r: 237, g: 48, b: 44, a: 255 } },
  { name: "Rose", rgba: { r: 145, g: 2, b: 5, a: 255 } },
  { name: "Cyan Flower", rgba: { r: 55, g: 127, b: 155, a: 255 } },
];

// A pixel where every damage preset overlays its darkest crack, so each choice
// (and only a choice, not "None") changes it noticeably.
const damageCrackProbe = { x: 256, y: 214 };
const damageBodyDefault: Rgba = { r: 117, g: 71, b: 47, a: 255 };
const damageCrack: Rgba = { r: 14, g: 0, b: 0, a: 255 };
const damageChoices = ["Low", "Medium", "High"];

// A pixel cracked only by the heavier "High" sheet, proving the presets are
// distinct textures rather than the same one wired three times. Chosen where
// "Low" is fully transparent so the probe reads the bare skin texel (an exact
// integer colour, identical across renderers) rather than a skin+damage alpha
// composite whose rounding differs between local and CI; "High" darkens it.
const damageDistinctProbe = { x: 146, y: 125 };
const damageDistinctBody: Rgba = { r: 82, g: 61, b: 137, a: 255 };
const damageDistinctHigh: Rgba = { r: 14, g: 0, b: 0, a: 255 };

// Fold/label overlays.
const foldProbe = { x: 104, y: 18 };
const foldOn: Rgba = { r: 123, g: 123, b: 123, a: 255 };
const labelProbe = { x: 375, y: 79 };
const labelOn: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const labelOff: Rgba = { r: 0, g: 96, b: 96, a: 255 };
const white: Rgba = { r: 255, g: 255, b: 255, a: 255 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page) => page.getByRole("combobox").first();

const modelTypeSelect = (page: Page) => page.getByRole("combobox").nth(1);

const flowerSelect = (page: Page) => page.getByLabel("Flower", { exact: true });

const damageSelect = (page: Page) => page.getByLabel("Damage", { exact: true });

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft golem character generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

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

  const flower = flowerSelect(page);
  await expect(flower).toHaveValue("");
  await expect(flower.locator("option")).toHaveText([
    "None",
    ...flowerExpectations.map(({ name }) => name),
  ]);

  const damage = damageSelect(page);
  await expect(damage).toHaveValue("");
  await expect(damage.locator("option")).toHaveText(["None", ...damageChoices]);

  await expect(page.getByLabel("Upload Flower texture file")).toBeVisible();
  await expect(page.getByLabel("Upload Damage texture file")).toBeVisible();

  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();

  await expect(page.getByRole("combobox")).toHaveCount(4);
  await expect(regions(page)).toHaveCount(6);
});

test("minecraft golem character generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPageLocator = outputPages.nth(index);

    await expect(outputPageLocator).toBeVisible();
    await expect(outputPageLocator).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPageLocator);

    await expect(outputPageLocator).toHaveScreenshot(
      "minecraft-golem-character-default-page-" + (index + 1) + ".png"
    );
  }
});

test("minecraft golem character generator renders every skin preset and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const skin = skinSelect(page);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const preset of presetExpectations) {
    await skin.selectOption(preset.name);
    await expect
      .poll(() => readPixel(pageImage, headProbe.x, headProbe.y))
      .toEqual(preset.rgba);
  }

  await skin.selectOption("");
  await expect
    .poll(() => readPixel(pageImage, headProbe.x, headProbe.y))
    .toEqual(noneRgba);
});

test("minecraft golem character generator renders a custom Slim skin", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);
  await expect
    .poll(() => readPixel(pageImage, 110, 542))
    .toEqual({ r: 16, g: 185, b: 129, a: 255 });

  await modelTypeSelect(page).selectOption("Slim");
  await expect
    .poll(() => readPixel(pageImage, 110, 542))
    .toEqual({ r: 249, g: 115, b: 22, a: 255 });

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-character-custom-slim-page-1.png"
  );
});

test("minecraft golem character generator hides every outer skin layer independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

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

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-character-outer-layers-hidden-page-1.png"
  );
});

test("minecraft golem character generator renders every flower choice and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  await expect(
    readPixel(pageImage, flowerProbe.x, flowerProbe.y)
  ).resolves.toEqual(flowerNone);

  for (const flower of flowerExpectations) {
    await flowerSelect(page).selectOption({ label: flower.name });
    await expect
      .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
      .toEqual(flower.rgba);
  }

  await flowerSelect(page).selectOption("");
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerNone);
});

test("minecraft golem character generator renders a golem character with a chosen flower", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  await flowerSelect(page).selectOption({ label: "Poppy" });
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerExpectations[0]?.rgba);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-character-poppy-flower-page-1.png"
  );
});

test("minecraft golem character generator renders every damage choice and explicit None", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  // Poll rather than read once: the crack probe sits on the async-loading skin,
  // so on a slow load the initial body colour settles in after mount.
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageBodyDefault);

  for (const choice of damageChoices) {
    await damageSelect(page).selectOption({ label: choice });
    await expect
      .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
      .toEqual(damageCrack);
  }

  await damageSelect(page).selectOption("");
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageBodyDefault);
});

test("minecraft golem character generator distinguishes light from heavy damage", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  const probe = () =>
    readPixel(pageImage, damageDistinctProbe.x, damageDistinctProbe.y);

  await damageSelect(page).selectOption({ label: "Low" });
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageCrack);
  // Poll rather than read once: this probe is on the head, drawn from the
  // async-loading skin, so a late skin repaint can trail the crack-probe poll.
  await expect.poll(probe).toEqual(damageDistinctBody);

  await damageSelect(page).selectOption({ label: "High" });
  await expect.poll(probe).toEqual(damageDistinctHigh);
});

test("minecraft golem character generator renders a golem character with flower and damage", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
  await flowerSelect(page).selectOption({ label: "Cyan Flower" });
  await damageSelect(page).selectOption({ label: "Medium" });
  await expect
    .poll(() => readPixel(pageImage, flowerProbe.x, flowerProbe.y))
    .toEqual(flowerExpectations[2]?.rgba);
  await expect
    .poll(() => readPixel(pageImage, damageCrackProbe.x, damageCrackProbe.y))
    .toEqual(damageCrack);

  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-golem-character-flower-and-damage-page-1.png"
  );
});

test("minecraft golem character generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-golem-character-v1");

  const pageImage = outputPage(page);
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
    "minecraft-golem-character-overlays-off-page-1.png"
  );
});
