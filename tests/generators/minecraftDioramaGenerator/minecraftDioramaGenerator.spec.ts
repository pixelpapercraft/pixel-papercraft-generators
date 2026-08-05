import { expect, test } from "@playwright/test";

// Skeleton coverage only: proves the generator is reachable and renders a
// page before any real content lands. Expand as features are added.

test("minecraft diorama skeleton renders a blank page", async ({ page }) => {
  await page.goto("/generator/minecraft-diorama");

  await expect(page.getByText("Instructions", { exact: true })).toBeVisible();

  const pageImage = page.getByTestId("generator-page-image").first();
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
});
