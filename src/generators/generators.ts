import { type GeneratorDefV2, type ThumbnailDef } from "@genroot/builder";
import { generator as exampleGeneratorDef } from "@genroot/generators/example/exampleGenerator";
import { generator as minecraftCharacterGeneratorDef } from "@genroot/generators/minecraftCharacter/minecraftCharacterGenerator";
import { generator as minecraftItemGeneratorDef } from "@genroot/generators/minecraftItem/minecraftItemGenerator";
import { generator as amogusBendableGeneratorDef } from "@genroot/generators/amogusBendable/amogusBendableGenerator";
import { generator as dalekModDalekGeneratorDef } from "@genroot/generators/dalekModDalek/dalekModDalekGenerator";
import { generator as minecraftActionFigureGeneratorDef } from "@genroot/generators/minecraftActionFigure/minecraftActionFigureGenerator";
import { generator as minecraftAllayCharacterGeneratorDef } from "@genroot/generators/minecraftAllayCharacter/minecraftAllayCharacterGenerator";
import { generator as minecraftArmorGeneratorDef } from "@genroot/generators/minecraftArmor/minecraftArmorGenerator";
import { generator as minecraftAxolotlCharacterGeneratorDef } from "@genroot/generators/minecraftAxolotlCharacter/minecraftAxolotlCharacterGenerator";
import { generator as minecraftBeeCharacterGeneratorDef } from "@genroot/generators/minecraftBeeCharacter/minecraftBeeCharacterGenerator";
import { generator as minecraftBlockGeneratorDef } from "@genroot/generators/minecraftBlock/minecraftBlockGenerator";
import { generator as minecraftCapeAndElytraGeneratorDef } from "@genroot/generators/minecraftCapeAndElytra/minecraftCapeAndElytraGenerator";
import { generator as minecraftCatGeneratorDef } from "@genroot/generators/minecraftCat/minecraftCatGenerator";
import { generator as minecraftCatCharacterGeneratorDef } from "@genroot/generators/minecraftCatCharacter/minecraftCatCharacterGenerator";
import { generator as minecraftCharacterHeadsGeneratorDef } from "@genroot/generators/minecraftCharacterHeads/minecraftCharacterHeadsGenerator";
import { generator as minecraftCowCharacterGeneratorDef } from "@genroot/generators/minecraftCowCharacter/minecraftCowCharacterGenerator";
import { generator as minecraftCharacterMiniGeneratorDef } from "@genroot/generators/minecraftCharacterMini/minecraftCharacterMiniGenerator";
import { generator as minecraftCreeperGeneratorDef } from "@genroot/generators/minecraftCreeper/minecraftCreeperGenerator";
import { generator as minecraftCreeperCharacterGeneratorDef } from "@genroot/generators/minecraftCreeperCharacter/minecraftCreeperCharacterGenerator";
import { generator as minecraftEndermanGeneratorDef } from "@genroot/generators/minecraftEnderman/minecraftEndermanGenerator";
import { generator as minecraftEndermanCharacterGeneratorDef } from "@genroot/generators/minecraftEndermanCharacter/minecraftEndermanCharacterGenerator";
import { generator as minecraftGolemGeneratorDef } from "@genroot/generators/minecraftGolem/minecraftGolemGenerator";
import { generator as minecraftGolemCharacterGeneratorDef } from "@genroot/generators/minecraftGolemCharacter/minecraftGolemCharacterGenerator";
import { generator as minecraftHorseGeneratorDef } from "@genroot/generators/minecraftHorse/minecraftHorseGenerator";
import { generator as minecraftMutantCharacterGeneratorDef } from "@genroot/generators/minecraftMutantCharacter/minecraftMutantCharacterGenerator";
import { generator as minecraftPigGeneratorDef } from "@genroot/generators/minecraftPig/minecraftPigGenerator";
import { generator as minecraftPigCharacterGeneratorDef } from "@genroot/generators/minecraftPigCharacter/minecraftPigCharacterGenerator";
import { generator as minecraftSquidCharacterGeneratorDef } from "@genroot/generators/minecraftSquidCharacter/minecraftSquidCharacterGenerator";
import { generator as minecraftSpiderGeneratorDef } from "@genroot/generators/minecraftSpider/minecraftSpiderGenerator";
import { generator as minecraftBannerAndShieldGeneratorDef } from "@genroot/generators/minecraftBannerAndShield/minecraftBannerAndShieldGenerator";
import { generator as minecraftUltimateBendableGeneratorDef } from "@genroot/generators/minecraftUltimateBendable/minecraftUltimateBendableGenerator";
import { generator as minecraftVillagerGeneratorDef } from "@genroot/generators/minecraftVillager/minecraftVillagerGenerator";
import { generator as minecraftVillagerCharacterGeneratorDef } from "@genroot/generators/minecraftVillagerCharacter/minecraftVillagerCharacterGenerator";
import { generator as minecraftWitherGeneratorDef } from "@genroot/generators/minecraftWither/minecraftWitherGenerator";
import { generator as minecraftWolfCharacterGeneratorDef } from "@genroot/generators/minecraftWolfCharacter/minecraftWolfCharacterGenerator";
import { generator as testApiPageManagementGenerator } from "@genroot/generators/testApiPageManagement/testApiPageManagementGenerator";
import { generator as testApiDrawingPrimitivesGenerator } from "@genroot/generators/testApiDrawingPrimitives/testApiDrawingPrimitivesGenerator";
import { generator as testApiDrawingTexturesGenerator } from "@genroot/generators/testApiDrawingTextures/testApiDrawingTexturesGenerator";
import { generator as testApiPixelQueriesGenerator } from "@genroot/generators/testApiPixelQueries/testApiPixelQueriesGenerator";
import { generator as testApiSkinControlGenerator } from "@genroot/generators/testApiSkinControl/testApiSkinControlGenerator";
import { generator as testApiTintSelectorGenerator } from "@genroot/generators/testApiTintSelector/testApiTintSelectorGenerator";
import { generator as testApiCuboidTabsGenerator } from "@genroot/generators/testApiCuboidTabs/testApiCuboidTabsGenerator";
import { generator as testApiCuboidFoldsGenerator } from "@genroot/generators/testApiCuboidFolds/testApiCuboidFoldsGenerator";
import { generator as testApiTexturePickerV2Generator } from "@genroot/generators/testApiTexturePickerV2/testApiTexturePickerV2Generator";

const isProductionEnvironment: boolean = process.env.NODE_ENV === "production";

export const character: GeneratorDefV2[] = [
  minecraftCharacterGeneratorDef,
  minecraftActionFigureGeneratorDef,
  minecraftUltimateBendableGeneratorDef,
  minecraftCharacterMiniGeneratorDef,
];

export const mobCharacter: GeneratorDefV2[] = [
  minecraftAxolotlCharacterGeneratorDef,
  minecraftAllayCharacterGeneratorDef,
  minecraftBeeCharacterGeneratorDef,
  minecraftCatCharacterGeneratorDef,
  minecraftCowCharacterGeneratorDef,
  minecraftCreeperCharacterGeneratorDef,
  minecraftEndermanCharacterGeneratorDef,
  minecraftGolemCharacterGeneratorDef,
  minecraftPigCharacterGeneratorDef,
  minecraftSquidCharacterGeneratorDef,
  minecraftVillagerCharacterGeneratorDef,
  minecraftWolfCharacterGeneratorDef,
];

export const mob: GeneratorDefV2[] = [
  minecraftCreeperGeneratorDef,
  minecraftEndermanGeneratorDef,
  minecraftGolemGeneratorDef,
  minecraftHorseGeneratorDef,
  minecraftPigGeneratorDef,
  minecraftCatGeneratorDef,
  minecraftVillagerGeneratorDef,
];

// Blocks, Items and Accessories
export const utility: GeneratorDefV2[] = [
  minecraftBlockGeneratorDef,
  minecraftItemGeneratorDef,
  minecraftArmorGeneratorDef,
  minecraftCapeAndElytraGeneratorDef,
  minecraftCharacterHeadsGeneratorDef,
];

export const mod: GeneratorDefV2[] = [
  minecraftMutantCharacterGeneratorDef,
  dalekModDalekGeneratorDef,
];

export const other: GeneratorDefV2[] = [amogusBendableGeneratorDef];

// Incomplete / in-development generators, plus every generator's in-progress
// v2 version during the migration. Hidden in production, visible everywhere
// else (local dev server, Playwright's dev server, and unit tests) so the v2
// versions can be reached by URL and exercised by the reused v1 test suites.
export const dev: GeneratorDefV2[] = isProductionEnvironment
  ? []
  : [
      minecraftWitherGeneratorDef,
      minecraftSpiderGeneratorDef,
      minecraftBannerAndShieldGeneratorDef,
    ];

// Generator API coverage boards (one per API method group) are the Testing
// entries. They replace the former, broad visual-regression board with
// purpose-scoped coverage named "Test API: <Group>" and id "test-api-*".
//
// All v2 as of the removal plan's phase A2; each board kept its `test-api-*`
// id across the port, so no spec URLs changed and nothing was re-baselined.
// The v1 Controls board was retired rather than ported: its subject was the
// `define*Input` mechanism, which v2 does not have. Its one piece of unique
// coverage — the Minecraft skin username fetch/convert path — moved to the
// Skin Control board below.
export const testApiCoverage: GeneratorDefV2[] = [
  testApiPageManagementGenerator,
  testApiDrawingPrimitivesGenerator,
  testApiDrawingTexturesGenerator,
  testApiPixelQueriesGenerator,
  testApiSkinControlGenerator,
  testApiTintSelectorGenerator,
  testApiCuboidTabsGenerator,
  testApiCuboidFoldsGenerator,
  testApiTexturePickerV2Generator,
];

export const test: GeneratorDefV2[] = isProductionEnvironment
  ? []
  : [exampleGeneratorDef, ...testApiCoverage];

function concatArrays<T>(arrays: Array<Array<T>>) {
  return arrays.reduce((acc, val) => acc.concat(val), []);
}

export const generators: GeneratorDefV2[] = concatArrays([
  character,
  mobCharacter,
  mob,
  utility,
  mod,
  other,
  dev,
  test,
]);

// One finder over the flat list. Every generator is a `GeneratorDefV2` now, so
// ids are unique with no collision handling needed.
export function findAnyGeneratorById(
  generatorId: string
): GeneratorDefV2 | null {
  return generators.find((entry) => entry.id === generatorId) ?? null;
}

// Shared listing shape for anything the generator list can display and link
// to — `GeneratorDefV2` satisfies it structurally, so the group arrays are
// usable as-is.
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
  { label: "Testing", generators: test },
];
