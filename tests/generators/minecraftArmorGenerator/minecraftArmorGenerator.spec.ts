import { expect, test, type Locator, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const armorTexturePath =
  "src/generators/minecraftArmor/textures/iron_layer_1.png";

const outputPage = (page: Page): Locator =>
  page.getByTestId("generator-page-image").first();

const combo = (page: Page, index: number): Locator =>
  page.getByRole("combobox").nth(index);

// Visually-hidden checkboxes are toggled via a scripted click, as a normal
// Playwright click fails the visibility wait.
const toggleCheckbox = (page: Page, name: string) =>
  page.getByLabel(name).evaluate((el) => (el as HTMLInputElement).click());

const optionListsOf = (page: Page): Promise<string[][]> =>
  page
    .getByRole("combobox")
    .all()
    .then((combos) =>
      Promise.all(combos.map((c) => c.locator("option").allTextContents()))
    );

// Base-state combobox order (nothing tinted/trimmed). Enabling a Tint/Trim
// inserts that part's extra selects mid-list and shifts these indices.
const MATERIAL_OPTIONS = {
  helmet: ["None", "Leather", "Chainmail", "Gold", "Copper", "Iron", "Diamond", "Netherite", "Turtle Shell"],
  chestplate: ["None", "Leather", "Chainmail", "Gold", "Copper", "Iron", "Diamond", "Netherite"],
  leggings: ["None", "Leather ", "Chainmail ", "Gold ", "Copper ", "Iron ", "Diamond ", "Netherite "],
  boots: ["None", "Leather", "Chainmail", "Gold", "Copper", "Iron", "Diamond", "Netherite"],
  glint: ["None", "1.20+", "Pre-1.20"],
};

const NAMED_MATERIALS = ["Leather", "Chainmail", "Gold", "Copper", "Iron", "Diamond", "Netherite"];

type PartEnumeration = {
  part: string;
  index: number;
  // Leggings option ids carry a trailing space.
  optionSuffix: string;
  probe: [number, number];
  colors: Record<string, Rgba>;
};

const rgb = (r: number, g: number, b: number): Rgba => ({ r, g, b, a: 255 });
const WHITE = rgb(255, 255, 255);

const ENUMERATIONS: PartEnumeration[] = [
  {
    part: "Helmet",
    index: 0,
    optionSuffix: "",
    probe: [160, 70],
    colors: {
      Leather: rgb(173, 173, 173),
      Chainmail: rgb(189, 189, 189),
      Gold: rgb(245, 184, 28),
      Copper: rgb(207, 100, 64),
      Iron: rgb(190, 190, 190),
      Diamond: rgb(44, 224, 216),
      Netherite: rgb(93, 86, 93),
    },
  },
  {
    part: "Chestplate",
    index: 1,
    optionSuffix: "",
    probe: [260, 410],
    colors: {
      Leather: rgb(173, 173, 173),
      Chainmail: rgb(148, 145, 148),
      Gold: rgb(255, 216, 61),
      Copper: rgb(214, 109, 72),
      Iron: rgb(209, 209, 209),
      Diamond: rgb(74, 237, 217),
      Netherite: rgb(93, 86, 93),
    },
  },
  {
    part: "Leggings",
    index: 2,
    optionSuffix: " ",
    probe: [90, 600],
    colors: {
      Leather: rgb(170, 170, 170),
      Chainmail: rgb(164, 165, 164),
      Gold: rgb(224, 178, 48),
      Copper: rgb(186, 93, 61),
      Iron: rgb(194, 194, 194),
      Diamond: rgb(48, 208, 190),
      Netherite: rgb(55, 53, 55),
    },
  },
  {
    part: "Boots",
    index: 3,
    optionSuffix: "",
    probe: [100, 730],
    colors: {
      Leather: rgb(214, 212, 212),
      Chainmail: rgb(148, 145, 148),
      Gold: rgb(253, 255, 118),
      Copper: rgb(252, 153, 130),
      Iron: rgb(229, 229, 229),
      Diamond: rgb(180, 253, 238),
      Netherite: rgb(93, 86, 93),
    },
  },
];

// Fresh-load default renders the Diamond fallback for every part (each part's
// registered fallback texture is diamond), even though every material combobox
// value is "".
const DIAMOND_DEFAULT: Record<string, Rgba | undefined> = Object.fromEntries(
  ENUMERATIONS.map((e) => [e.part, e.colors.Diamond])
);

test("minecraft armor generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot("minecraft-armor-default-page-1.png");
});

test("minecraft armor generator exposes its full control surface", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  // Five comboboxes, in order, with their option lists and empty initial values.
  const optionLists = await optionListsOf(page);
  expect(optionLists).toEqual([
    MATERIAL_OPTIONS.helmet,
    MATERIAL_OPTIONS.chestplate,
    MATERIAL_OPTIONS.leggings,
    MATERIAL_OPTIONS.boots,
    MATERIAL_OPTIONS.glint,
  ]);
  for (let i = 0; i < 5; i += 1) {
    await expect(combo(page, i)).toHaveValue("");
  }

  // Page-wide overlay toggles default on; every tint/trim toggle defaults off.
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  for (const part of ["Helmet", "Chestplate", "Leggings", "Boots"]) {
    await expect(page.getByLabel(`Tint ${part}`)).not.toBeChecked();
    await expect(page.getByLabel(`Trim ${part}`)).not.toBeChecked();
  }

  // Glint ranges and their defaults.
  await expect(page.getByLabel("Glint Opacity")).toHaveValue("255");
  await expect(page.getByLabel("Glint X Offset")).toHaveValue("0");
  await expect(page.getByLabel("Glint Y Offset")).toHaveValue("0");

  // Every part plus the glint texture exposes an upload.
  for (const name of ["Helmet", "Chestplate", "Leggings", "Boots", "Enchanted Glint"]) {
    await expect(page.getByLabel(`Upload ${name} texture file`)).toBeVisible();
  }
});

test("minecraft armor generator reveals tint and trim controls on demand", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await expect(page.getByRole("combobox")).toHaveCount(5);

  // Tinting a part reveals its colour + overlay selects.
  await toggleCheckbox(page, "Tint Chestplate");
  await expect(page.getByRole("combobox")).toHaveCount(7);
  const colorSelect = page.getByLabel("Chestplate Color");
  await expect(colorSelect).toBeVisible();
  const colorOptions = await colorSelect.locator("option").allTextContents();
  expect(colorOptions).toContain("Custom tint");
  expect(colorOptions).toContain("Blue");
  expect(await optionListsOf(page)).toContainEqual(["None", "Leather Overlay"]);

  // Trimming a part reveals its template + trim-material selects.
  await toggleCheckbox(page, "Tint Chestplate"); // back to 5
  await toggleCheckbox(page, "Trim Chestplate");
  await expect(page.getByRole("combobox")).toHaveCount(7);
  const revealed = await optionListsOf(page);
  expect(revealed).toContainEqual([
    "None", "Bolt", "Coast", "Dune", "Eye", "Flow", "Host", "Raiser", "Rib",
    "Sentry", "Shaper", "Silence", "Snout", "Spire", "Tide", "Vex", "Ward",
    "Wayfinder", "Wild",
  ]);
  expect(revealed).toContainEqual([
    "None", "Amethyst  ", "Copper  ", "Copper Darker  ", "Diamond  ",
    "Diamond Darker  ", "Emerald  ", "Gold  ", "Gold Darker  ", "Iron  ",
    "Iron Darker  ", "Lapis  ", "Netherite  ", "Netherite Darker  ",
    "Quartz  ", "Redstone  ", "Resin  ",
  ]);
});

for (const enumeration of ENUMERATIONS) {
  test(`minecraft armor generator paints every ${enumeration.part} material at its probe`, async ({
    page,
  }) => {
    await page.goto("/generator/minecraft-armor");
    const pageImage = outputPage(page);
    await renderImageAtNaturalSize(pageImage);

    const [x, y] = enumeration.probe;
    for (const material of NAMED_MATERIALS) {
      await combo(page, enumeration.index).selectOption(
        material + enumeration.optionSuffix
      );
      await expect
        .poll(() => readPixel(pageImage, x, y))
        .toEqual(enumeration.colors[material]);
    }

    // Explicit None clears the part to the white page (distinct from the
    // fresh-load diamond fallback).
    await combo(page, enumeration.index).selectOption("");
    await expect.poll(() => readPixel(pageImage, x, y)).toEqual(WHITE);
  });
}

test("minecraft armor generator drives only the selected part's region", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // Fresh load: every part shows the diamond fallback.
  for (const { part, probe } of ENUMERATIONS) {
    await expect
      .poll(() => readPixel(pageImage, probe[0], probe[1]))
      .toEqual(DIAMOND_DEFAULT[part]);
  }

  // Repaint only the helmet.
  await combo(page, 0).selectOption("Gold");
  await expect
    .poll(() => readPixel(pageImage, 160, 70))
    .toEqual(rgb(245, 184, 28));

  // The other three parts stay at their diamond defaults.
  for (const { part, probe } of ENUMERATIONS.filter((e) => e.part !== "Helmet")) {
    expect(await readPixel(pageImage, probe[0], probe[1])).toEqual(
      DIAMOND_DEFAULT[part]
    );
  }
});

test("minecraft armor generator exposes a typeable helmet tint input", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await toggleCheckbox(page, "Tint Helmet");
  await page.getByLabel("Helmet Color").selectOption({ label: "Custom tint" });

  const tintInput = page.getByPlaceholder("Enter hex color");
  await expect(tintInput).toBeVisible();
  await tintInput.fill("123abc");
  await expect(tintInput).toHaveValue("123abc");
});

test("minecraft armor generator tints a part's pixels", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // Chest starts at the diamond fallback.
  await expect.poll(() => readPixel(pageImage, 260, 410)).toEqual(rgb(74, 237, 217));

  await toggleCheckbox(page, "Tint Chestplate");
  await page.getByLabel("Chestplate Color").selectOption({ label: "Blue" });

  await expect.poll(() => readPixel(pageImage, 260, 410)).toEqual(rgb(17, 63, 144));
});

test("minecraft armor generator toggles the folds and labels overlays", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // A fold-line pixel and a label pixel are painted grey by default.
  await expect.poll(() => readPixel(pageImage, 130, 100)).toEqual(rgb(123, 123, 123));
  await expect.poll(() => readPixel(pageImage, 280, 60)).toEqual(rgb(123, 123, 123));

  // Turning folds off reveals the diamond armour beneath the fold line.
  await toggleCheckbox(page, "Show Folds");
  await expect.poll(() => readPixel(pageImage, 130, 100)).toEqual(rgb(48, 208, 190));

  // Turning labels off clears the label pixel to the white page.
  await toggleCheckbox(page, "Show Labels");
  await expect.poll(() => readPixel(pageImage, 280, 60)).toEqual(WHITE);
});

test("minecraft armor generator renders tinted enchanted armor", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await toggleCheckbox(page, "Tint Helmet");
  await page.getByLabel("Helmet Color").selectOption({ label: "Blue" });

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  const box = await pageImage.boundingBox();
  if (!box) {
    throw new Error("Armor output page was not measurable");
  }
  await page.mouse.click(box.x + 100, box.y + 80);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-armor-tinted-enchanted-helmet-page-1.png"
  );
});

test("minecraft armor generator renders a trimmed chestplate", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await toggleCheckbox(page, "Trim Chestplate");
  // Wait for the revealed trim selects to render before targeting them by index.
  await expect(page.getByRole("combobox")).toHaveCount(7);
  await combo(page, 2).selectOption("Silence"); // Chestplate Trim template
  await combo(page, 3).selectOption("Gold  "); // Chestplate Trim Material

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-armor-trim-chestplate-page-1.png");
});

test("minecraft armor generator composes four different materials", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await combo(page, 0).selectOption("Gold"); // Helmet
  await combo(page, 1).selectOption("Netherite"); // Chestplate
  await combo(page, 2).selectOption("Copper "); // Leggings
  await combo(page, 3).selectOption("Iron"); // Boots

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot("minecraft-armor-mixed-materials-page-1.png");
});

test("minecraft armor generator renders a custom 64x32 helmet texture", async ({ page }) => {
  await page.goto("/generator/minecraft-armor");

  await page.getByLabel("Upload Helmet texture file").setInputFiles(armorTexturePath);

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-armor-custom-64x32-helmet-page-1.png"
  );
});
