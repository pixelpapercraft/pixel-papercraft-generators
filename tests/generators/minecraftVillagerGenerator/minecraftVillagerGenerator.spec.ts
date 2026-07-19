import { expect, test, type Locator, type Page } from "@playwright/test";
import { renderImageAtNaturalSize } from "../_shared/screenshot";

const types = ["Normal", "Zombie"];

const biomes = [
  "Plains",
  "Desert",
  "Jungle",
  "Savanna",
  "Snow",
  "Swamp",
  "Taiga",
];

const professions = [
  "None",
  "Armorer",
  "Butcher",
  "Cartographer",
  "Cleric",
  "Farmer",
  "Fisherman",
  "Fletcher",
  "Leatherworker",
  "Librarian",
  "Mason",
  "Nitwit",
  "Shepherd",
  "Toolsmith",
  "Weaponsmith",
];

const outputPage = (page: Page) =>
  page.getByTestId("generator-page-image").first();

const typeSelect = (page: Page) => page.getByRole("combobox").nth(0);
const biomeSelect = (page: Page) => page.getByRole("combobox").nth(1);
const professionSelect = (page: Page) => page.getByRole("combobox").nth(2);

const regions = (page: Page) =>
  outputPage(page).locator("xpath=..").locator("div.absolute");

const waitForImageChange = async (pageImage: Locator, previousSrc: string) => {
  await expect.poll(() => pageImage.getAttribute("src")).not.toBe(previousSrc);
};

const currentSrc = async (pageImage: Locator): Promise<string> => {
  const src = await pageImage.getAttribute("src");
  expect(src).not.toBeNull();
  return src ?? "";
};

const ROUTE = "/generator/minecraft-villager-v1";

test("minecraft villager generator exposes its complete control contract", async ({
  page,
}) => {
  await page.goto(ROUTE);

  await expect(page.getByRole("combobox")).toHaveCount(3);
  await expect(typeSelect(page)).toHaveValue("Normal");
  await expect(typeSelect(page).locator("option")).toHaveText(types);
  await expect(biomeSelect(page)).toHaveValue("Plains");
  await expect(biomeSelect(page).locator("option")).toHaveText(biomes);
  await expect(professionSelect(page)).toHaveValue("None");
  await expect(professionSelect(page).locator("option")).toHaveText(
    professions
  );
  await expect(page.getByTestId("generator-page-image")).toHaveCount(1);
  await expect(regions(page)).toHaveCount(0);
  await expect(page.getByLabel(/Upload/)).toHaveCount(0);
});

test("minecraft villager generator matches the default composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toBeVisible();
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-default-page-1.png"
  );
});

test("minecraft villager generator renders every biome distinctly", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const rendered = new Set<string>();
  let previousSrc = await currentSrc(pageImage);
  const order = ["Plains", ...biomes.filter((biome) => biome !== "Plains")];
  for (const biome of order) {
    await biomeSelect(page).selectOption(biome);
    if (biome !== "Plains") {
      await waitForImageChange(pageImage, previousSrc);
    }
    previousSrc = await currentSrc(pageImage);
    rendered.add(previousSrc);
  }
  expect(rendered.size).toBe(biomes.length);
});

test("minecraft villager generator renders both villager types distinctly", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const rendered = new Set<string>();
  let previousSrc = await currentSrc(pageImage);
  const order = ["Normal", "Zombie"];
  for (const type of order) {
    await typeSelect(page).selectOption(type);
    if (type !== "Normal") {
      await waitForImageChange(pageImage, previousSrc);
    }
    previousSrc = await currentSrc(pageImage);
    rendered.add(previousSrc);
  }
  expect(rendered.size).toBe(types.length);
});

test("minecraft villager generator renders every profession distinctly", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const rendered = new Set<string>();
  let previousSrc = await currentSrc(pageImage);
  const order = [
    "None",
    ...professions.filter((profession) => profession !== "None"),
  ];
  for (const profession of order) {
    await professionSelect(page).selectOption(profession);
    if (profession !== "None") {
      await waitForImageChange(pageImage, previousSrc);
    }
    previousSrc = await currentSrc(pageImage);
    rendered.add(previousSrc);
  }
  expect(rendered.size).toBe(professions.length);
});

test("minecraft villager generator matches the zombie composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const previousSrc = await currentSrc(pageImage);
  await typeSelect(page).selectOption("Zombie");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-zombie-plains-page-1.png"
  );
});

test("minecraft villager generator matches a savanna biome composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const previousSrc = await currentSrc(pageImage);
  await biomeSelect(page).selectOption("Savanna");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-normal-savanna-page-1.png"
  );
});

test("minecraft villager generator matches the farmer profession composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const previousSrc = await currentSrc(pageImage);
  await professionSelect(page).selectOption("Farmer");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-normal-farmer-page-1.png"
  );
});

test("minecraft villager generator matches the butcher profession composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const previousSrc = await currentSrc(pageImage);
  await professionSelect(page).selectOption("Butcher");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-normal-butcher-page-1.png"
  );
});

test("minecraft villager generator matches the librarian profession composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  const previousSrc = await currentSrc(pageImage);
  await professionSelect(page).selectOption("Librarian");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-normal-librarian-page-1.png"
  );
});

test("minecraft villager generator matches a combined zombie desert butcher composition", async ({
  page,
}) => {
  await page.goto(ROUTE);

  const pageImage = outputPage(page);
  await expect(pageImage).toHaveAttribute("src", /data:image\/png/);
  let previousSrc = await currentSrc(pageImage);
  await typeSelect(page).selectOption("Zombie");
  await waitForImageChange(pageImage, previousSrc);
  previousSrc = await currentSrc(pageImage);
  await biomeSelect(page).selectOption("Desert");
  await waitForImageChange(pageImage, previousSrc);
  previousSrc = await currentSrc(pageImage);
  await professionSelect(page).selectOption("Butcher");
  await waitForImageChange(pageImage, previousSrc);
  await renderImageAtNaturalSize(pageImage);
  await expect(pageImage).toHaveScreenshot(
    "minecraft-villager-zombie-desert-butcher-page-1.png"
  );
});
