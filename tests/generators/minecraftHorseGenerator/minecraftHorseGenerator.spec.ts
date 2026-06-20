import { expect, test } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

test("minecraft horse generator exposes the horse texture selector by label", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  await expect(page.getByLabel("Horse", { exact: true })).toBeVisible();
});

test("minecraft horse generator exposes a typeable armor tint input", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  await page
    .getByLabel("Tint Armor")
    .evaluate((element) => (element as HTMLInputElement).click());
  await page.getByLabel("Armor Color").selectOption({ label: "Custom tint" });

  const tintInput = page.getByPlaceholder("RRGGBB");
  await expect(tintInput).toBeVisible();
  await tintInput.fill("123abc");
  await expect(tintInput).toHaveValue("123abc");
});

test("minecraft horse generator renders tinted enchanted armor", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-horse");

  await page
    .getByLabel("Tint Armor")
    .evaluate((element) => (element as HTMLInputElement).click());
  await page.getByLabel("Armor Color").selectOption({ label: "Blue" });

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  const outputPage = outputPages.nth(0);
  await expect(outputPage).toBeVisible();
  await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(outputPage);
  const box = await outputPage.boundingBox();
  if (!box) {
    throw new Error("Horse output page was not measurable");
  }
  await page.mouse.click(box.x + 100, box.y + 500);

  await expect(outputPage).toHaveScreenshot(
    "minecraft-horse-tinted-enchanted-armor-page-1.png"
  );
});

test("minecraft horse generator matches the default screenshot", async ({ page }) => {
  await page.goto("/generator/minecraft-horse");

  const outputPages = page.getByTestId("generator-page-image");
  await expect(outputPages).toHaveCount(1);

  for (let index = 0; index < 1; index += 1) {
    const outputPage = outputPages.nth(index);

    await expect(outputPage).toBeVisible();
    await expect(outputPage).toHaveAttribute("src", /data:image\/png/);
    await renderImageAtNaturalSize(outputPage);
    await expect(outputPage).toHaveScreenshot(
      "minecraft-horse-default-page-" + (index + 1) + ".png"
    );
  }
});
