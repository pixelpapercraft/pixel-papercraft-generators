import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import { readPixel, type Rgba } from "../_shared/pixelColor";

// Coverage for the shared `_common` Minecraft skin control's username fetch
// path. Ported from the retired V1 `test-api-controls` board, where this was
// the only test anywhere exercising the fetch/convert route — skin upload and
// preset selection are covered by the individual generator specs, so those
// tests were deliberately not carried over.
// Generator id: test-api-skin-control.

const transparent: Rgba = { r: 0, g: 0, b: 0, a: 0 };

const skinFixturePath = "src/generators/_common/fixtures/testSheet.png";

const skinPage = (page: Page) =>
  page.getByTestId("generator-page-image").nth(0);

const skinPicker = (page: Page) =>
  page
    .locator("select")
    .filter({ has: page.locator('option[value="Fixture"]') });

test("the skin control fetches and converts a routed username skin", async ({
  page,
}) => {
  const skinData = fs.readFileSync(skinFixturePath).toString("base64");
  let usernameRequestWasMade = false;
  await page.route(
    "https://api.ashcon.app/mojang/v2/user/FixtureUser",
    (route) => {
      usernameRequestWasMade = true;
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ textures: { skin: { data: skinData } } }),
      });
    }
  );
  await page.goto("/generator/test-api-skin-control");

  // Clear the default preset first, so the pixel that appears at the end can
  // only have come from the fetch — not from the preset that loads on mount.
  await skinPicker(page).selectOption("");
  // Clearing the picker re-renders asynchronously, so poll until the skin is gone.
  await expect
    .poll(async () => readPixel(skinPage(page), 24, 24))
    .toEqual(transparent);

  await page.getByPlaceholder("Enter username").fill("FixtureUser");
  await page.getByRole("button", { name: "Fetch skin" }).click();

  expect(usernameRequestWasMade).toBe(true);
  await expect
    .poll(async () => readPixel(skinPage(page), 24, 24))
    .not.toEqual(transparent);
});
