import { expect, test } from "@playwright/test";

const migratedGenerators = [
  { route: "minecraft-character", name: "Minecraft Character" },
  { route: "minecraft-item", name: "Minecraft Item" },
];

for (const generator of migratedGenerators) {
  test(`${generator.name} v2 shows its thumbnail as hero media`, async ({
    page,
  }) => {
    await page.goto(`/generator/${generator.route}`);

    const heroThumbnail = page.locator('img[src*="v2-thumbnail-256"]');
    await expect(heroThumbnail).toBeVisible();
  });
}
