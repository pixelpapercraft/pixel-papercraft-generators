import { expect, test } from "@playwright/test";

// Skeleton coverage only: proves the generator is reachable and renders a
// page with the migrated background/title art. Expand as features are added.

test("minecraft diorama skeleton renders the background and title", async ({
  page,
}) => {
  await page.goto("/generator/minecraft-diorama");

  await expect(page.getByText("Instructions", { exact: true })).toBeVisible();

  const pageImage = page.getByTestId("generator-page-image").first();
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});
