import { expect, test, type Locator, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const coatFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page): Locator =>
  page.getByTestId("generator-page-image").first();

const combo = (page: Page, index: number): Locator =>
  page.getByRole("combobox").nth(index);

// Click the visible label rather than the visually-hidden checkbox. This waits
// for a real browser interaction, including React hydration, before changing
// the controlled value.
const toggleCheckbox = (page: Page, name: string) =>
  page.getByText(name, { exact: true }).click();

const rgb = (r: number, g: number, b: number): Rgba => ({ r, g, b, a: 255 });
const TRANSPARENT: Rgba = { r: 0, g: 0, b: 0, a: 0 };
const WHITE = rgb(255, 255, 255);

// Base comboboxes, in source order (the glint control is defined before the
// texture inputs, so it is combobox 0).
const GLINT_OPTIONS = ["None", "1.20+", "Pre-1.20"];
const COAT_OPTIONS = [
  "None",
  "Black Horse",
  "Brown Horse",
  "Chestnut Horse",
  "Creamy Horse",
  "Dark Brown Horse",
  "Gray Horse",
  "White Horse",
  "Skeleton Horse",
  "Zombie Horse",
  "Donkey",
  "Mule",
];
const MARKINGS_OPTIONS = [
  "None",
  "Black Dots",
  "White",
  "White Dots",
  "White Field",
];
const ARMOR_OPTIONS = [
  "None",
  "Leather",
  "Gold",
  "Copper",
  "Iron",
  "Diamond",
  "Netherite",
];

// Coat probe (200,600): all 11 coats are solid and distinct here; explicit None
// clears the coat to transparent.
const COAT_PROBE: [number, number] = [200, 600];
const COAT_COLORS: Record<string, Rgba> = {
  "Black Horse": rgb(36, 38, 46),
  "Brown Horse": rgb(83, 37, 14),
  "Chestnut Horse": rgb(139, 71, 27),
  "Creamy Horse": rgb(148, 103, 52),
  "Dark Brown Horse": rgb(48, 26, 16),
  "Gray Horse": rgb(96, 96, 96),
  "White Horse": rgb(219, 219, 219),
  "Skeleton Horse": rgb(188, 188, 188),
  "Zombie Horse": rgb(60, 85, 42),
  Donkey: rgb(139, 120, 103),
  Mule: rgb(80, 44, 26),
};

// Armor probe (80,540), over the default white-horse coat: all 6 materials are
// solid and distinct; explicit None reveals the coat beneath.
const ARMOR_PROBE: [number, number] = [80, 540];
const ARMOR_COLORS: Record<string, Rgba> = {
  Leather: rgb(199, 199, 199),
  Gold: rgb(255, 240, 90),
  Copper: rgb(231, 124, 86),
  Iron: rgb(98, 98, 98),
  Diamond: rgb(67, 228, 208),
  Netherite: rgb(93, 86, 93),
};
const ARMOR_NONE_COAT = rgb(180, 180, 180);

// Markings are sparse overlays covering different regions, so no single probe
// distinguishes all four — each is enumerated at its own probe over a Gray coat.
type MarkingProbe = {
  marking: string;
  probe: [number, number];
  base: Rgba;
  value: Rgba;
};
const MARKING_PROBES: MarkingProbe[] = [
  {
    marking: "Black Dots",
    probe: [120, 580],
    base: rgb(96, 96, 96),
    value: rgb(0, 0, 0),
  },
  {
    marking: "White Dots",
    probe: [150, 500],
    base: rgb(80, 80, 80),
    value: rgb(225, 225, 225),
  },
  {
    marking: "White Field",
    probe: [120, 540],
    base: rgb(66, 66, 66),
    value: rgb(255, 255, 255),
  },
  {
    marking: "White",
    probe: [100, 52],
    base: rgb(96, 96, 96),
    value: rgb(246, 246, 246),
  },
];

test("minecraft horse generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-horse-default-page-1.png"
  );
});

test("minecraft horse generator exposes its full control surface", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  // Gate on all four base selects having mounted before reading them.
  await expect(page.getByRole("combobox")).toHaveCount(4);

  // Comboboxes in source order: glint, coat, markings, armor.
  expect(await combo(page, 0).locator("option").allTextContents()).toEqual(
    GLINT_OPTIONS
  );
  expect(
    await page
      .getByLabel("Horse", { exact: true })
      .locator("option")
      .allTextContents()
  ).toEqual(COAT_OPTIONS);
  expect(
    await page
      .getByLabel("Markings", { exact: true })
      .locator("option")
      .allTextContents()
  ).toEqual(MARKINGS_OPTIONS);
  expect(
    await page
      .getByLabel("Armor", { exact: true })
      .locator("option")
      .allTextContents()
  ).toEqual(ARMOR_OPTIONS);
  for (let i = 0; i < 4; i += 1) {
    await expect(combo(page, i)).toHaveValue("");
  }

  // Tint defaults off; the two page-wide overlays default on.
  await expect(page.getByLabel("Tint Armor")).not.toBeChecked();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();

  // Each texture input plus the glint texture exposes an upload.
  for (const name of ["Horse", "Markings", "Armor", "Enchanted Glint"]) {
    await expect(page.getByLabel(`Upload ${name} texture file`)).toBeVisible();
  }
});

test("minecraft horse generator reveals the armor tint controls on demand", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  await expect(page.getByRole("combobox")).toHaveCount(4);

  // Enabling Tint Armor inserts the Armor Overlay + Armor Color selects.
  await toggleCheckbox(page, "Tint Armor");
  await expect(page.getByRole("combobox")).toHaveCount(6);

  expect(
    await page
      .getByLabel("Armor Overlay", { exact: true })
      .locator("option")
      .allTextContents()
  ).toEqual(["None", "Leather Overlay"]);

  const colorSelect = page.getByLabel("Armor Color");
  await expect(colorSelect).toBeVisible();
  const colorOptions = await colorSelect.locator("option").allTextContents();
  expect(colorOptions).toContain("Custom tint");
  expect(colorOptions).toContain("Blue");

  // Custom tint reveals a typeable hex field.
  await colorSelect.selectOption({ label: "Custom tint" });
  const tintInput = page.getByPlaceholder("Enter hex color");
  await expect(tintInput).toBeVisible();
  await tintInput.fill("123abc");
  await expect(tintInput).toHaveValue("123abc");
});

test("minecraft horse generator paints every coat at its probe", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  const [x, y] = COAT_PROBE;
  const coatSelect = page.getByLabel("Horse", { exact: true });
  for (const coat of COAT_OPTIONS.slice(1)) {
    await coatSelect.selectOption(coat);
    await expect
      .poll(() => readPixel(pageImage, x, y))
      .toEqual(COAT_COLORS[coat]);
  }

  // Explicit None clears the coat to transparent (distinct from the fresh-load
  // white-horse fallback).
  await coatSelect.selectOption("");
  await expect.poll(() => readPixel(pageImage, x, y)).toEqual(TRANSPARENT);
});

test("minecraft horse generator paints every armor material at its probe", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  const [x, y] = ARMOR_PROBE;
  const armorSelect = page.getByLabel("Armor", { exact: true });
  for (const material of ARMOR_OPTIONS.slice(1)) {
    await armorSelect.selectOption(material);
    await expect
      .poll(() => readPixel(pageImage, x, y))
      .toEqual(ARMOR_COLORS[material]);
  }

  // Explicit None reveals the default white-horse coat beneath.
  await armorSelect.selectOption("");
  await expect.poll(() => readPixel(pageImage, x, y)).toEqual(ARMOR_NONE_COAT);
});

test("minecraft horse generator paints each marking over the coat", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  await page.getByLabel("Horse", { exact: true }).selectOption("Gray Horse");
  const markingSelect = page.getByLabel("Markings", { exact: true });

  for (const { marking, probe, base, value } of MARKING_PROBES) {
    const [x, y] = probe;
    // Bare coat first (markings None), then the marking paints its region.
    await markingSelect.selectOption("");
    await expect.poll(() => readPixel(pageImage, x, y)).toEqual(base);
    await markingSelect.selectOption(marking);
    await expect.poll(() => readPixel(pageImage, x, y)).toEqual(value);
  }

  // Composition snapshot of one representative marking over the coat.
  const whiteField = MARKING_PROBES[2];
  if (!whiteField) {
    throw new Error("White Field marking probe missing");
  }
  await markingSelect.selectOption(whiteField.marking);
  await expect
    .poll(() => readPixel(pageImage, whiteField.probe[0], whiteField.probe[1]))
    .toEqual(whiteField.value);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-horse-markings-white-field-page-1.png"
  );
});

test("minecraft horse generator toggles the folds and labels overlays", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // A fold-line pixel and a label pixel are painted by default.
  await expect
    .poll(() => readPixel(pageImage, 320, 50))
    .toEqual(rgb(123, 123, 123));
  await expect.poll(() => readPixel(pageImage, 140, 420)).toEqual(rgb(0, 0, 0));

  // Turning each overlay off clears its pixel to the white page.
  await toggleCheckbox(page, "Show Folds");
  await expect.poll(() => readPixel(pageImage, 320, 50)).toEqual(WHITE);

  await toggleCheckbox(page, "Show Labels");
  await expect.poll(() => readPixel(pageImage, 140, 420)).toEqual(WHITE);
});

test("minecraft horse generator switches to the donkey / mule model", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // A horse-ear pixel is painted before the toggle.
  await expect
    .poll(() => readPixel(pageImage, 340, 300))
    .toEqual(rgb(150, 150, 150));

  // The ear region [256,249,124,72] toggles the mule model; the image is at
  // natural size, so the region centre maps 1:1 to a page click.
  const box = await pageImage.boundingBox();
  if (!box) {
    throw new Error("Horse output page was not measurable");
  }
  await page.mouse.click(box.x + 318, box.y + 285);

  // The horse ear disappears (mule ears are longer and drawn elsewhere).
  await expect.poll(() => readPixel(pageImage, 340, 300)).toEqual(TRANSPARENT);

  // Move off the region so the hover highlight box clears for a clean snapshot.
  await page.mouse.move(box.x - 20, box.y - 20);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-horse-mule-model-page-1.png"
  );
});

test("minecraft horse generator renders tinted enchanted armor", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  await toggleCheckbox(page, "Tint Armor");
  await page.getByLabel("Armor Color").selectOption({ label: "Blue" });

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);

  const box = await pageImage.boundingBox();
  if (!box) {
    throw new Error("Horse output page was not measurable");
  }
  // Click the body region [40,452,320,336] to enchant the armor.
  await page.mouse.click(box.x + 100, box.y + 500);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-horse-tinted-enchanted-armor-page-1.png"
  );
});

test("minecraft horse generator renders a custom coat upload", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");
  const pageImage = outputPage(page);

  await page
    .getByLabel("Upload Horse texture file")
    .setInputFiles(coatFixturePath);
  await renderImageAtNaturalSize(pageImage);

  // The uploaded fixture colours the coat at the coat probe.
  await expect
    .poll(() => readPixel(pageImage, 200, 600))
    .toEqual(rgb(217, 70, 239));
  await expect(pageImage).toHaveScreenshot(
    "minecraft-horse-custom-coat-upload-page-1.png"
  );
});
