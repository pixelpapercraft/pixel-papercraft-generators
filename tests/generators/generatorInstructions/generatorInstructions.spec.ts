import fs from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

function findInstructionGeneratorIds(directory: string): string[] {
  const generatorIds: string[] = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      generatorIds.push(...findInstructionGeneratorIds(entryPath));
      continue;
    }

    if (!entry.name.endsWith("Generator.tsx")) {
      continue;
    }

    const source = fs.readFileSync(entryPath, "utf8");
    if (!source.includes("<GeneratorUI.Instructions")) {
      continue;
    }

    const generatorId = source.match(/^const id = "([^"]+)";$/m)?.[1];

    if (!generatorId) {
      throw new Error(`Could not find the generator id in ${entryPath}`);
    }

    generatorIds.push(generatorId);
  }

  return generatorIds.sort();
}

const generatorIds = findInstructionGeneratorIds(
  path.join(process.cwd(), "src/generators")
);

for (const generatorId of generatorIds) {
  test(`${generatorId} uses the collapsed sidebar instructions pattern`, async ({
    page,
  }) => {
    await page.goto(`/generator/${generatorId}`);

    const sidebar = page.getByTestId("generator-sidebar");
    const instructions = sidebar.locator(":scope > .mb-8 > details");

    await expect(sidebar).toBeVisible();
    await expect(instructions).toHaveCount(1);
    await expect(instructions.locator(":scope > summary")).toContainText(
      "Instructions"
    );
    await expect(instructions).toHaveJSProperty("open", false);
    await expect(sidebar.locator(":scope > .bg-gray-100 details")).toHaveCount(
      0
    );
  });
}
