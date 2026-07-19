import { expect, test, type Page } from "@playwright/test";
import { readPixel, type Rgba } from "../_shared/pixelColor";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

// This spec is a deliberate near-verbatim copy of
// amogusBendableGenerator.spec.ts (the v1 amogus-bendable). The ONLY change is
// the route (`/generator/amogus-bendable` → `/generator/amogus-bendable-v2`).
// amogus-bendable-v2 was rebuilt to be behaviourally identical to v1 — same
// 18-option Color select, same reused MinecraftSkinControl picker — so the
// entire v1 assertion set (DOM contract, per-color pixel probes, composition
// snapshots, and custom-upload coverage) is expected to pass unchanged. It is
// the regression oracle for the v1→v2 migration.

type ColorExpectation = {
  name: string;
  rgba: Rgba;
};

const colorExpectations: ColorExpectation[] = [
  { name: "Red", rgba: { r: 255, g: 0, b: 0, a: 255 } },
  { name: "Black", rgba: { r: 38, g: 35, b: 35, a: 255 } },
  { name: "White", rgba: { r: 255, g: 255, b: 255, a: 255 } },
  { name: "Rose", rgba: { r: 254, g: 146, b: 236, a: 255 } },
  { name: "Blue", rgba: { r: 0, g: 73, b: 255, a: 255 } },
  { name: "Cyan", rgba: { r: 0, g: 225, b: 255, a: 255 } },
  { name: "Yellow", rgba: { r: 255, g: 250, b: 0, a: 255 } },
  { name: "Pink", rgba: { r: 255, g: 0, b: 250, a: 255 } },
  { name: "Purple", rgba: { r: 184, g: 0, b: 255, a: 255 } },
  { name: "Orange", rgba: { r: 255, g: 136, b: 0, a: 255 } },
  { name: "Banana", rgba: { r: 255, g: 228, b: 139, a: 255 } },
  { name: "Coral", rgba: { r: 255, g: 170, b: 139, a: 255 } },
  { name: "Lime", rgba: { r: 115, g: 255, b: 62, a: 255 } },
  { name: "Green", rgba: { r: 38, g: 136, b: 0, a: 255 } },
  { name: "Gray", rgba: { r: 119, g: 119, b: 119, a: 255 } },
  { name: "Maroon", rgba: { r: 76, g: 0, b: 0, a: 255 } },
  { name: "Brown", rgba: { r: 143, g: 27, b: 27, a: 255 } },
  { name: "Tan", rgba: { r: 201, g: 171, b: 171, a: 255 } },
];

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

test("amogus bendable generator exposes its color and skin controls", async ({
  page,
}) => {
  await page.goto("/generator/amogus-bendable-v2");

  const color = page.getByLabel("Color");
  await expect(color).toBeVisible();
  await expect(color).toHaveValue("Red");
  await expect(color.locator("option")).toHaveText(
    colorExpectations.map(({ name }) => name)
  );
  await expect(page.getByLabel("Upload Skin skin file")).toBeVisible();
});

test("amogus bendable generator matches the default screenshot", async ({
  page,
}) => {
  await page.goto("/generator/amogus-bendable-v2");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);

    await expect(outputPage).toHaveScreenshot(
      "amogus-bendable-default-page-" + (index + 1) + ".png"
    );
  }
});

test("amogus bendable generator renders every color option at the body probe", async ({
  page,
}) => {
  await page.goto("/generator/amogus-bendable-v2");

  const color = page.getByLabel("Color");
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);

  for (const colorExpectation of colorExpectations) {
    await color.selectOption(colorExpectation.name);
    await expect
      .poll(async () => readPixel(pageImage, 100, 100))
      .toEqual(colorExpectation.rgba);
  }
});

for (const colorName of ["Cyan", "Green"]) {
  test(`amogus bendable generator composes ${colorName} beneath the skin and folds`, async ({
    page,
  }) => {
    await page.goto("/generator/amogus-bendable-v2");

    const color = page.getByLabel("Color");
    const pageImage = outputPage(page);
    await color.selectOption(colorName);
    await renderImageAtNaturalSize(pageImage);

    await expect(pageImage).toHaveScreenshot(
      `amogus-bendable-${colorName.toLowerCase()}-page-1.png`
    );
  });
}

test("amogus bendable generator renders a custom skin upload in its visor", async ({
  page,
}) => {
  await page.goto("/generator/amogus-bendable-v2");

  const pageImage = outputPage(page);
  const defaultVisorPixel = await readPixel(pageImage, 60, 240);
  await page.getByLabel("Upload Skin skin file").setInputFiles(skinFixturePath);

  await expect
    .poll(async () => readPixel(pageImage, 60, 240))
    .not.toEqual(defaultVisorPixel);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "amogus-bendable-custom-skin-page-1.png"
  );
});
