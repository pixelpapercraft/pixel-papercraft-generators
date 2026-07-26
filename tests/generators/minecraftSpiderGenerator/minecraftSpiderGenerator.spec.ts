import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const textureFixturePath = "src/generators/_common/fixtures/testSheet.png";

const outputPage = (page: Page): Locator =>
  page.getByTestId("generator-page-image").first();

const pageImageUrl = (page: Page): Promise<string | null> =>
  outputPage(page).getAttribute("src");

const toggleCheckbox = (page: Page, name: string): Promise<void> =>
  page.getByLabel(name).evaluate((element: HTMLElement) => element.click());

async function screenshot(page: Page, name: string): Promise<void> {
  const pageImage = outputPage(page);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(`${name}-page-1.png`);
}

test("minecraft spider generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-spider");

  await expect(page.getByRole("combobox")).toHaveCount(1);
  const spider = page.getByLabel("Spider", { exact: true });
  await expect(spider.locator("option")).toHaveText([
    "None",
    "Spider",
    "Cave Spider",
  ]);
  await expect(spider).toHaveValue("");
  await expect(page.getByLabel("Upload Spider texture file")).toBeVisible();
  await expect(
    page.getByLabel("Upload Spider Eyes texture file")
  ).toBeVisible();
  await expect(page.getByLabel("Show Folds")).toBeChecked();
  await expect(page.getByLabel("Show Labels")).toBeChecked();
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
});

test("minecraft spider generator matches the default composition", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-spider");

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await screenshot(page, "minecraft-spider-default");
});

test("minecraft spider generator renders the Cave Spider preset", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-spider");

  const before = await pageImageUrl(page);
  await page.getByLabel("Spider", { exact: true }).selectOption("Cave Spider");
  await expect.poll(() => pageImageUrl(page)).not.toBe(before);
  await screenshot(page, "minecraft-spider-cave-spider");
});

test("minecraft spider generator renders independent custom body and eye textures", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-spider");

  const beforeBodyUpload = await pageImageUrl(page);
  await page
    .getByLabel("Upload Spider texture file")
    .setInputFiles(textureFixturePath);
  await expect.poll(() => pageImageUrl(page)).not.toBe(beforeBodyUpload);

  const beforeEyesUpload = await pageImageUrl(page);
  await page
    .getByLabel("Upload Spider Eyes texture file")
    .setInputFiles(textureFixturePath);
  await expect.poll(() => pageImageUrl(page)).not.toBe(beforeEyesUpload);
  await screenshot(page, "minecraft-spider-custom-textures");
});

test("minecraft spider generator hides folds and labels independently", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-spider");

  const beforeFolds = await pageImageUrl(page);
  await toggleCheckbox(page, "Show Folds");
  await expect.poll(() => pageImageUrl(page)).not.toBe(beforeFolds);

  const beforeLabels = await pageImageUrl(page);
  await toggleCheckbox(page, "Show Labels");
  await expect.poll(() => pageImageUrl(page)).not.toBe(beforeLabels);
  await screenshot(page, "minecraft-spider-overlays-off");
});
