import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

type OptionExpectation = {
  name: string;
  rgba: Rgba;
};

// Each skin slot offers the 10 default Minecraft presets plus six mob-head
// textures unique to this generator. Every option paints a distinct, opaque
// colour at the Skin 1 forehead probe (128,100), so a mis-mapped option would
// fail its own poll. Order matches the option list after "None".
const optionExpectations: OptionExpectation[] = [
  { name: "Alex", rgba: { r: 229, g: 141, b: 63, a: 255 } },
  { name: "Ari", rgba: { r: 249, g: 167, b: 134, a: 255 } },
  { name: "Efe", rgba: { r: 171, g: 114, b: 76, a: 255 } },
  { name: "Kai", rgba: { r: 251, g: 237, b: 145, a: 255 } },
  { name: "Makena", rgba: { r: 38, g: 18, b: 22, a: 255 } },
  { name: "Noor", rgba: { r: 185, g: 103, b: 74, a: 255 } },
  { name: "Steve", rgba: { r: 183, g: 131, b: 107, a: 255 } },
  { name: "Sunny", rgba: { r: 47, g: 47, b: 47, a: 255 } },
  { name: "Zuri", rgba: { r: 126, g: 83, b: 55, a: 255 } },
  { name: "Default", rgba: { r: 198, g: 150, b: 128, a: 255 } },
  { name: "Zombie", rgba: { r: 121, g: 156, b: 101, a: 255 } },
  { name: "Enderman", rgba: { r: 22, g: 22, b: 22, a: 255 } },
  { name: "Skeleton", rgba: { r: 188, g: 188, b: 188, a: 255 } },
  { name: "Wither Skeleton", rgba: { r: 52, g: 52, b: 52, a: 255 } },
  { name: "Creeper", rgba: { r: 147, g: 215, b: 140, a: 255 } },
  { name: "Blaze", rgba: { r: 255, g: 255, b: 132, a: 255 } },
];

const whiteRgba: Rgba = { r: 255, g: 255, b: 255, a: 255 };
const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

// Head slot forehead probes. Slot 1 is drawn top-left; slot 2 sits one column to
// the right (+288 in x), so their foreheads share a y and prove the slots drive
// independent halves of the sheet.
const skin1Forehead = { x: 128, y: 100 };
const skin2Forehead = { x: 416, y: 100 };

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const skinSelect = (page: Page, index: number) =>
  page.getByRole("combobox").nth(index);

// Only populated slots define an overlay-toggle region, so the region count is a
// direct read on how many heads are currently drawn.
const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

test("minecraft character heads generator exposes its controls", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const skin1 = skinSelect(page, 0);
  await expect(skin1).toHaveValue("Default");
  await expect(skin1.locator("option")).toHaveText([
    "None",
    ...optionExpectations.map(({ name }) => name),
  ]);

  // Slots 2–8 default to None (the extra-head-slots default fix); only slot 1
  // starts populated, so only one head — and one overlay region — is drawn.
  await expect(page.getByRole("combobox")).toHaveCount(8);
  for (let index = 1; index < 8; index += 1) {
    await expect(skinSelect(page, index)).toHaveValue("");
  }
  for (let index = 1; index <= 8; index += 1) {
    await expect(
      page.getByLabel(`Upload Skin ${index} skin file`)
    ).toBeVisible();
  }
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Action Figure")).not.toBeChecked();
  await expect(regions(page)).toHaveCount(1);
});

test("minecraft character heads generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-heads-default-page-1.png"
  );
});

test("minecraft character heads generator renders every preset and mob texture on Skin 1", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const skin1 = skinSelect(page, 0);
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const option of optionExpectations) {
    await skin1.selectOption(option.name);
    await expect
      .poll(() => readPixel(pageImage, skin1Forehead.x, skin1Forehead.y))
      .toEqual(option.rgba);
  }

  // With no skin selected the head is not drawn at all, leaving the white page.
  await skin1.selectOption("");
  await expect
    .poll(() => readPixel(pageImage, skin1Forehead.x, skin1Forehead.y))
    .toEqual(whiteRgba);
});

test("minecraft character heads generator draws extra head slots independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // Slot 2 starts None (no second head, one region). Selecting a preset there
  // draws a second head and adds its overlay region, without touching slot 1.
  await expect(regions(page)).toHaveCount(1);
  await skinSelect(page, 1).selectOption("Alex");
  await expect
    .poll(() => readPixel(pageImage, skin2Forehead.x, skin2Forehead.y))
    .toEqual({ r: 229, g: 141, b: 63, a: 255 });
  await expect(regions(page)).toHaveCount(2);
  await expect
    .poll(() => readPixel(pageImage, skin1Forehead.x, skin1Forehead.y))
    .toEqual({ r: 198, g: 150, b: 128, a: 255 });

  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-heads-two-heads-page-1.png"
  );
});

test("minecraft character heads generator renders a custom upload and toggles its overlay", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  await page
    .getByLabel("Upload Skin 2 skin file")
    .setInputFiles(skinFixturePath);

  // The fixture's head overlay is a solid green; its base head is yellow. The
  // slot-2 region (regions.nth(1)) toggles just that head's outer layer.
  await expect
    .poll(() => readPixel(pageImage, skin2Forehead.x, skin2Forehead.y))
    .toEqual({ r: 34, g: 197, b: 94, a: 255 });
  await regions(page).nth(1).click();
  await expect
    .poll(() => readPixel(pageImage, skin2Forehead.x, skin2Forehead.y))
    .toEqual({ r: 234, g: 179, b: 8, a: 255 });

  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-heads-custom-skin-2-page-1.png"
  );
});

test("minecraft character heads generator hides fold lines", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  const readFold = () => readPixel(pageImage, 100, 14);
  await expect(readFold()).resolves.toEqual({ r: 123, g: 123, b: 123, a: 255 });

  await page.getByText("Show Folds", { exact: true }).click();
  await expect(page.getByLabel("Show Folds")).not.toBeChecked();
  await expect.poll(readFold).toEqual(whiteRgba);

  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-heads-folds-off-page-1.png"
  );
});

test("minecraft character heads generator draws action figure cut lines", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-character-heads-v1");

  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  // The red action-figure cut lines are off by default; enabling them paints
  // red over the head's lower faces.
  const readCut = () => readPixel(pageImage, 120, 186);
  await expect(readCut()).resolves.toEqual({ r: 35, g: 35, b: 35, a: 255 });

  await page.getByText("Action Figure", { exact: true }).click();
  await expect(page.getByLabel("Action Figure")).toBeChecked();
  await expect.poll(readCut).toEqual({ r: 255, g: 0, b: 0, a: 255 });

  await expect(pageImage).toHaveScreenshot(
    "minecraft-character-heads-action-figure-page-1.png"
  );
});
