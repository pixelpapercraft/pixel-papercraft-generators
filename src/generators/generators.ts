import {
  type GeneratorDef,
  type ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type GeneratorDefV2 } from "@genroot/builder/v2/generatorV2";
import { generator as exampleGenerator } from "@genroot/generators/example/exampleGenerator";
import { generator as exampleGeneratorDefV2 } from "@genroot/generators/exampleV2/exampleV2Generator";
import { generator as minecraftCharacterGeneratorDefV2 } from "@genroot/generators/minecraftCharacterV2/minecraftCharacterV2Generator";
import { generator as minecraftItemGeneratorDefV2 } from "@genroot/generators/minecraftItemV2/minecraftItemV2Generator";
import { generator as amogusBendableGeneratorDefV2 } from "@genroot/generators/amogusBendableV2/amogusBendableV2Generator";
import { generator as dalekModDalekGeneratorDefV2 } from "@genroot/generators/dalekModDalekV2/dalekModDalekV2Generator";
import { generator as minecraftActionFigureGeneratorDefV2 } from "@genroot/generators/minecraftActionFigureV2/minecraftActionFigureV2Generator";
import { generator as minecraftAllayCharacterGeneratorDefV2 } from "@genroot/generators/minecraftAllayCharacterV2/minecraftAllayCharacterV2Generator";
import { generator as minecraftArmorGeneratorDefV2 } from "@genroot/generators/minecraftArmorV2/minecraftArmorV2Generator";
import { generator as minecraftAxolotlCharacterGeneratorDefV2 } from "@genroot/generators/minecraftAxolotlCharacterV2/minecraftAxolotlCharacterV2Generator";
import { generator as minecraftBeeCharacterGeneratorDefV2 } from "@genroot/generators/minecraftBeeCharacterV2/minecraftBeeCharacterV2Generator";
import { generator as minecraftBlockGeneratorDefV2 } from "@genroot/generators/minecraftBlockV2/minecraftBlockV2Generator";
import { generator as minecraftCapeAndElytraGeneratorDefV2 } from "@genroot/generators/minecraftCapeAndElytraV2/minecraftCapeAndElytraV2Generator";
import { generator as minecraftCatGeneratorDefV2 } from "@genroot/generators/minecraftCatV2/minecraftCatV2Generator";
import { generator as minecraftCatCharacterGeneratorDefV2 } from "@genroot/generators/minecraftCatCharacterV2/minecraftCatCharacterV2Generator";
import { generator as minecraftCharacterHeadsGeneratorDefV2 } from "@genroot/generators/minecraftCharacterHeadsV2/minecraftCharacterHeadsV2Generator";
import { generator as minecraftCowCharacterGeneratorDefV2 } from "@genroot/generators/minecraftCowCharacterV2/minecraftCowCharacterV2Generator";
import { generator as minecraftCharacterMiniGeneratorDefV2 } from "@genroot/generators/minecraftCharacterMiniV2/minecraftCharacterMiniV2Generator";
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

// A registered generator tagged with which model it belongs to, so a caller
// can pick the matching renderer (v1 `<Generator>` vs a v2 def's own
// `Component`) with the compiler enforcing the pairing. During the v1→v2
// migration a group can hold a mix of both; once every generator is v2 and the
// v1 versions are deleted, this collapses back to a plain `GeneratorDefV2[]`.
export type AnyGenerator =
  | { kind: "v1"; def: GeneratorDef }
  | { kind: "v2"; def: GeneratorDefV2 };

const v1 = (def: GeneratorDef): AnyGenerator => ({ kind: "v1", def });
const v2 = (def: GeneratorDefV2): AnyGenerator => ({ kind: "v2", def });

export const character: AnyGenerator[] = [
  v1(minecraftCharacterGenerator),
  v1(minecraftActionFigureGenerator),
  v1(minecraftUltimateBendableGenerator),
  v1(minecraftCharacterMiniGenerator),
];

export const mobCharacter: AnyGenerator[] = [
  v1(minecraftCreeperCharacterGenerator),
  v1(minecraftCatCharacterGenerator),
  v1(minecraftCowCharacterGenerator),
  v1(minecraftEndermanCharacterGenerator),
  v1(minecraftGolemCharacterGenerator),
  v1(minecraftPigCharacterGenerator),
  v1(minecraftSquidCharacterGenerator),
  v1(minecraftVillagerCharacterGenerator),
  v1(minecraftWolfCharacterGenerator),
  v1(minecraftAxolotlCharacterGenerator),
  v1(minecraftAllayCharacterGenerator),
  v1(minecraftBeeCharacterGenerator),
];

export const mob: AnyGenerator[] = [
  v1(minecraftCreeperGenerator),
  v1(minecraftEndermanGenerator),
  v1(minecraftGolemGenerator),
  v1(minecraftHorseGenerator),
  v1(minecraftPigGenerator),
  v1(minecraftCatGenerator),
  v1(minecraftVillagerGenerator),
];

// Blocks, Items and Accessories
export const utility: AnyGenerator[] = [
  v1(minecraftBlockGenerator),
  v1(minecraftItemGenerator),
  v1(minecraftArmorGenerator),
  v1(minecraftCapeAndElytraGenerator),
  v1(minecraftCharacterHeadsGenerator),
];

export const mod: AnyGenerator[] = [
  v1(minecraftMutantCharacterGenerator),
  v1(dalekModDalekGenerator),
];

export const other: AnyGenerator[] = [v1(amogusBendableGenerator)];

// Incomplete / in-development generators, plus every generator's in-progress
// v2 version during the migration. Hidden in production, visible everywhere
// else (local dev server, Playwright's dev server, and unit tests) so the v2
// versions can be reached by URL and exercised by the reused v1 test suites.
export const dev: AnyGenerator[] = isProductionEnvironment
  ? []
  : [
      v1(minecraftWitherGenerator),
      v2(exampleGeneratorDefV2),
      v2(minecraftCharacterGeneratorDefV2),
      v2(minecraftItemGeneratorDefV2),
      v2(amogusBendableGeneratorDefV2),
      v2(dalekModDalekGeneratorDefV2),
      v2(minecraftActionFigureGeneratorDefV2),
      v2(minecraftAllayCharacterGeneratorDefV2),
      v2(minecraftArmorGeneratorDefV2),
      v2(minecraftAxolotlCharacterGeneratorDefV2),
      v2(minecraftBeeCharacterGeneratorDefV2),
      v2(minecraftBlockGeneratorDefV2),
      v2(minecraftCapeAndElytraGeneratorDefV2),
      v2(minecraftCatGeneratorDefV2),
      v2(minecraftCatCharacterGeneratorDefV2),
      v2(minecraftCharacterHeadsGeneratorDefV2),
      v2(minecraftCharacterMiniGeneratorDefV2),
      v2(minecraftCowCharacterGeneratorDefV2),
    ];

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

export const test: AnyGenerator[] = isProductionEnvironment
  ? []
  : [v1(exampleGenerator), ...testApiCoverage.map(v1)];

function concatArrays<T>(arrays: Array<Array<T>>) {
  return arrays.reduce((acc, val) => acc.concat(val), []);
}

export const generators: AnyGenerator[] = concatArrays([
  character,
  mobCharacter,
  mob,
  utility,
  mod,
  other,
  dev,
  test,
]);

// One finder over the flat list, tagging each result by model. Ids never
// collide across v1/v2 (v2 versions carry a `-v2` suffix until the v1 versions
// are deleted), so a plain first-match lookup is unambiguous.
export function findAnyGeneratorById(generatorId: string): AnyGenerator | null {
  return generators.find((entry) => entry.def.id === generatorId) ?? null;
}

// Shared listing shape for anything the generator list can display and link
// to — both `GeneratorDef` (v1) and `GeneratorDefV2` (v2) satisfy this
// structurally.
export type GeneratorLink = {
  id: string;
  name: string;
  thumbnail: ThumbnailDef | null;
};

export type GeneratorGroup = {
  label: string;
  generators: GeneratorLink[];
};

const links = (entries: AnyGenerator[]): GeneratorLink[] =>
  entries.map((entry) => entry.def);

export const generatorGroups: GeneratorGroup[] = [
  { label: "Characters", generators: links(character) },
  { label: "Mob Characters", generators: links(mobCharacter) },
  { label: "Mobs", generators: links(mob) },
  { label: "Blocks, Items and Accessories", generators: links(utility) },
  { label: "Mods", generators: links(mod) },
  { label: "Other", generators: links(other) },
  { label: "Development", generators: links(dev) },
  { label: "Testing", generators: links(test) },
];
