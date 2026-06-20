import { expect, test, type Locator, type Page } from "@playwright/test";
import sharp from "sharp";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

async function makeWideTexture(): Promise<Buffer> {
  const blueHalf = await sharp({
    create: {
      width: 16,
      height: 16,
      channels: 4,
      background: { r: 0, g: 0, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: 32,
      height: 16,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: blueHalf, left: 16, top: 0 }])
    .png()
    .toBuffer();
}

async function makeQuadrantTexture(): Promise<Buffer> {
  const makePatch = (background: {
    r: number;
    g: number;
    b: number;
    alpha: number;
  }) =>
    sharp({
      create: {
        width: 8,
        height: 8,
        channels: 4,
        background,
      },
    })
      .png()
      .toBuffer();

  return sharp({
    create: {
      width: 16,
      height: 16,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([
      {
        input: await makePatch({ r: 0, g: 255, b: 0, alpha: 1 }),
        left: 8,
        top: 0,
      },
      {
        input: await makePatch({ r: 0, g: 0, b: 255, alpha: 1 }),
        left: 0,
        top: 8,
      },
      {
        input: await makePatch({ r: 255, g: 255, b: 0, alpha: 1 }),
        left: 8,
        top: 8,
      },
    ])
    .png()
    .toBuffer();
}

async function setRangeValue(page: Page, label: string, value: number) {
  await page.getByLabel(label).evaluate((element, nextValue) => {
    const input = element as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;

    valueSetter?.call(input, String(nextValue));
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

async function readPixel(
  image: Locator,
  x: number,
  y: number
): Promise<number[] | null> {
  const src = await image.getAttribute("src");
  const base64 = src?.split(",")[1];
  if (!base64) {
    return null;
  }

  const pixels = await sharp(Buffer.from(base64, "base64"))
    .ensureAlpha()
    .raw()
    .extract({ left: x, top: y, width: 1, height: 1 })
    .toBuffer();

  return Array.from(pixels);
}

test("minecraft diorama generator can draw the right half of a custom 32x16 source frame", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Version").selectOption("custom");
  await page
    .getByLabel("Select one or more custom texture files")
    .setInputFiles({
      name: "wide.png",
      mimeType: "image/png",
      buffer: await makeWideTexture(),
    });

  await expect(page.getByTitle("wide")).toBeVisible();
  await page.getByTitle("wide").click();

  const outputPage = page.getByTestId("generator-page-image").first();
  await expect(outputPage).toBeVisible();
  await renderImageAtNaturalSize(outputPage);
  const box = await outputPage.boundingBox();
  if (!box) {
    throw new Error("Diorama output page was not measurable");
  }

  await page.mouse.click(box.x + 80, box.y + 80);
  await page.getByLabel("Edit Mode", { exact: true }).selectOption("Source");

  await expect(page.getByLabel("Source X")).toHaveAttribute("max", "16");
  await setRangeValue(page, "Source X", 8);
  await setRangeValue(page, "Source Width", 8);
  await page.mouse.click(box.x + 80, box.y + 80);

  await expect
    .poll(() => readPixel(outputPage, 100, 100))
    .toEqual([0, 0, 255, 255]);
});

test("minecraft diorama split keeps a textured face visually continuous", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await page.getByLabel("Version").selectOption("custom");
  await page
    .getByLabel("Select one or more custom texture files")
    .setInputFiles({
      name: "quadrants.png",
      mimeType: "image/png",
      buffer: await makeQuadrantTexture(),
    });

  await expect(page.getByTitle("quadrants")).toBeVisible();
  await page.getByTitle("quadrants").click();

  const outputPage = page.getByTestId("generator-page-image").first();
  await expect(outputPage).toBeVisible();
  await renderImageAtNaturalSize(outputPage);
  const box = await outputPage.boundingBox();
  if (!box) {
    throw new Error("Diorama output page was not measurable");
  }

  await page.mouse.click(box.x + 80, box.y + 80);
  await page.getByLabel("Edit Mode", { exact: true }).selectOption("Split");
  await page.mouse.click(box.x + 80, box.y + 80);

  await expect
    .poll(() => readPixel(outputPage, 58, 57))
    .toEqual([255, 0, 0, 255]);
  await expect
    .poll(() => readPixel(outputPage, 138, 57))
    .toEqual([0, 255, 0, 255]);
  await expect
    .poll(() => readPixel(outputPage, 58, 137))
    .toEqual([0, 0, 255, 255]);
  await expect
    .poll(() => readPixel(outputPage, 138, 137))
    .toEqual([255, 255, 0, 255]);
});
