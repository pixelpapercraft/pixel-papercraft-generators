import {
  type GeneratorDef,
  type ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { generator as exampleGenerator } from "@genroot/generators/example/exampleGenerator";
import {
  exampleGeneratorV2,
  ExampleGeneratorV2UI,
} from "@genroot/generators/exampleV2/exampleV2Generator";
import { generator as amogusBendableGenerator } from "@genroot/generators/amogusBendable/amogusBendableGenerator";
import { generator as dalekModDalekGenerator } from "@genroot/generators/dalekModDalek/dalekModDalekGenerator";
import { generator as minecraftActionFigureGenerator } from "@genroot/generators/minecraftActionFigure/minecraftActionFigureGenerator";
import { generator as minecraftAllayCharacterGenerator } from "@genroot/generators/minecraftAllayCharacter/minecraftAllayCharacterGenerator";
import { generator as minecraftAxolotlCharacterGenerator } from "@genroot/generators/minecraftAxolotlCharacter/minecraftAxolotlCharacterGenerator";
import { generator as minecraftBeeCharacterGenerator } from "@genroot/generators/minecraftBeeCharacter/minecraftBeeCharacterGenerator";
import { generator as minecraftBlockGenerator } from "@genroot/generators/minecraftBlock/minecraftBlockGenerator";
import { generator as minecraftCapeAndElytraGenerator } from "@genroot/generators/minecraftCapeAndElytra/minecraftCapeAndElytraGenerator";
import { generator as minecraftCatGenerator } from "@genroot/generators/minecraftCat/minecraftCatGenerator";
import { generator as minecraftCatCharacterGenerator } from "@genroot/generators/minecraftCatCharacter/minecraftCatCharacterGenerator";
import { generator as minecraftCharacterGenerator } from "@genroot/generators/minecraftCharacter/minecraftCharacterGenerator";
import { generator as minecraftCharacterHeadsGenerator } from "@genroot/generators/minecraftCharacterHeads/minecraftCharacterHeadsGenerator";
import { generator as minecraftCharacterMiniGenerator } from "@genroot/generators/minecraftCharacterMini/minecraftCharacterMiniGenerator";
import { generator as minecraftCowCharacterGenerator } from "@genroot/generators/minecraftCowCharacter/minecraftCowCharacterGenerator";
import { generator as minecraftCreeperGenerator } from "@genroot/generators/minecraftCreeper/minecraftCreeperGenerator";
import { generator as minecraftCreeperCharacterGenerator } from "@genroot/generators/minecraftCreeperCharacter/minecraftCreeperCharacterGenerator";
import { generator as minecraftEndermanGenerator } from "@genroot/generators/minecraftEnderman/minecraftEndermanGenerator";
import { generator as minecraftEndermanCharacterGenerator } from "@genroot/generators/minecraftEndermanCharacter/minecraftEndermanCharacterGenerator";
import { generator as minecraftGolemGenerator } from "@genroot/generators/minecraftGolem/minecraftGolemGenerator";
import { generator as minecraftGolemCharacterGenerator } from "@genroot/generators/minecraftGolemCharacter/minecraftGolemCharacterGenerator";
import { generator as minecraftHorseGenerator } from "@genroot/generators/minecraftHorse/minecraftHorseGenerator";
import { generator as minecraftItemGenerator } from "@genroot/generators/minecraftItem/minecraftItemGenerator";
import { generator as minecraftMutantCharacterGenerator } from "@genroot/generators/minecraftMutantCharacter/minecraftMutantCharacterGenerator";
import { generator as minecraftPigGenerator } from "@genroot/generators/minecraftPig/minecraftPigGenerator";
import { generator as minecraftPigCharacterGenerator } from "@genroot/generators/minecraftPigCharacter/minecraftPigCharacterGenerator";
import { generator as minecraftSquidCharacterGenerator } from "@genroot/generators/minecraftSquidCharacter/minecraftSquidCharacterGenerator";
import { generator as minecraftUltimateBendableGenerator } from "@genroot/generators/minecraftUltimateBendable/minecraftUltimateBendableGenerator";
import { generator as minecraftVillagerGenerator } from "@genroot/generators/minecraftVillager/minecraftVillagerGenerator";
import { generator as minecraftVillagerCharacterGenerator } from "@genroot/generators/minecraftVillagerCharacter/minecraftVillagerCharacterGenerator";
import { generator as minecraftWitherGenerator } from "@genroot/generators/minecraftWither/minecraftWitherGenerator";
import { generator as minecraftWolfCharacterGenerator } from "@genroot/generators/minecraftWolfCharacter/minecraftWolfCharacterGenerator";
import { generator as minecraftArmorGenerator } from "@genroot/generators/minecraftArmor/minecraftArmorGenerator";
import { generator as testApiPageManagementGenerator } from "@genroot/generators/testApiPageManagement/testApiPageManagementGenerator";
import { generator as testApiDrawingPrimitivesGenerator } from "@genroot/generators/testApiDrawingPrimitives/testApiDrawingPrimitivesGenerator";
import { generator as testApiDrawingTexturesGenerator } from "@genroot/generators/testApiDrawingTextures/testApiDrawingTexturesGenerator";
import { generator as testApiControlsGenerator } from "@genroot/generators/testApiControls/testApiControlsGenerator";
import { generator as testApiPixelQueriesGenerator } from "@genroot/generators/testApiPixelQueries/testApiPixelQueriesGenerator";

const isProductionEnvironment: boolean = process.env.NODE_ENV === "production";
const isDevelopmentEnvironment: boolean =
  process.env.NODE_ENV === "development";

// Display metadata + the UI component for a v2 generator, rather than the
// full `GeneratorV2<Props>` (avoids a generics-variance snag here and
// single-sources id/name from the generator definition itself).
export type GeneratorDefV2 = {
  id: string;
  name: string;
  thumbnail: ThumbnailDef | null;
  Component: () => JSX.Element;
};

const exampleGeneratorDefV2: GeneratorDefV2 = {
  id: exampleGeneratorV2.id,
  name: exampleGeneratorV2.name,
  thumbnail: null,
  Component: ExampleGeneratorV2UI,
};

// Same visibility rule as the v1 `test` array below.
export const testV2: GeneratorDefV2[] = isProductionEnvironment
  ? []
  : [exampleGeneratorDefV2];

export function findGeneratorV2ById(
  generatorId: string
): GeneratorDefV2 | null {
  return (
    testV2.find((generatorDefV2) => generatorDefV2.id === generatorId) ?? null
  );
}

export const character: GeneratorDef[] = [
  minecraftCharacterGenerator,
  minecraftActionFigureGenerator,
  minecraftUltimateBendableGenerator,
  minecraftCharacterMiniGenerator,
];

export const mobCharacter: GeneratorDef[] = [
  minecraftCreeperCharacterGenerator,
  minecraftCatCharacterGenerator,
  minecraftCowCharacterGenerator,
  minecraftEndermanCharacterGenerator,
  minecraftGolemCharacterGenerator,
  minecraftPigCharacterGenerator,
  minecraftSquidCharacterGenerator,
  minecraftVillagerCharacterGenerator,
  minecraftWolfCharacterGenerator,
  minecraftAxolotlCharacterGenerator,
  minecraftAllayCharacterGenerator,
  minecraftBeeCharacterGenerator,
];

export const mob: GeneratorDef[] = [
  minecraftCreeperGenerator,
  minecraftEndermanGenerator,
  minecraftGolemGenerator,
  minecraftHorseGenerator,
  minecraftPigGenerator,
  minecraftCatGenerator,
  minecraftVillagerGenerator,
];

// Blocks, Items and Accessories
export const utility: GeneratorDef[] = [
  minecraftBlockGenerator,
  minecraftItemGenerator,
  minecraftArmorGenerator,
  minecraftCapeAndElytraGenerator,
  minecraftCharacterHeadsGenerator,
];

export const mod: GeneratorDef[] = [
  minecraftMutantCharacterGenerator,
  dalekModDalekGenerator,
];

export const other: GeneratorDef[] = [amogusBendableGenerator];

// Incomplete and in development
export const dev: GeneratorDef[] = isDevelopmentEnvironment
  ? [minecraftWitherGenerator]
  : [];

// Generator API coverage boards (one per API method group) are the Testing
// entries. They replace the former, broad visual-regression board with
// purpose-scoped coverage named "Test API: <Group>" and id "test-api-*".
export const testApiCoverage: GeneratorDef[] = [
  testApiPageManagementGenerator,
  testApiDrawingPrimitivesGenerator,
  testApiDrawingTexturesGenerator,
  testApiControlsGenerator,
  testApiPixelQueriesGenerator,
];

export const test: GeneratorDef[] = isProductionEnvironment
  ? []
  : [exampleGenerator, ...testApiCoverage];

function concatArrays<GeneratorDef>(arrays: Array<Array<GeneratorDef>>) {
  return arrays.reduce((acc, val) => acc.concat(val), []);
}

export const generators = concatArrays([
  character,
  mobCharacter,
  mob,
  utility,
  mod,
  other,
  dev,
  test,
]);

export function findGeneratorById(generatorId: string): GeneratorDef | null {
  return generators.find((generator) => generator.id === generatorId) ?? null;
}

// Shared listing shape for anything the generator list can display and link
// to — both `GeneratorDef` (v1) and `GeneratorDefV2` (v2) satisfy
// this structurally.
export type GeneratorLink = {
  id: string;
  name: string;
  thumbnail: ThumbnailDef | null;
};

export type GeneratorGroup = {
  label: string;
  generators: GeneratorLink[];
};

export const generatorGroups: GeneratorGroup[] = [
  { label: "Characters", generators: character },
  { label: "Mob Characters", generators: mobCharacter },
  { label: "Mobs", generators: mob },
  { label: "Blocks, Items and Accessories", generators: utility },
  { label: "Mods", generators: mod },
  { label: "Other", generators: other },
  { label: "Development", generators: dev },
  {
    label: "Testing",
    generators: isProductionEnvironment
      ? []
      : [exampleGenerator, exampleGeneratorDefV2, ...testApiCoverage],
  },
];
