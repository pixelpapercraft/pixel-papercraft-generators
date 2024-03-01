import { type GeneratorDef } from "@/builder/modules/generatorDef";
import { generator as exampleGenerator } from "@/generators/example/exampleGenerator";
import { generator as amogusBendableGenerator } from "@/generators/amogusBendable/amogusBendableGenerator";
import { generator as dalekModDalekGenerator } from "@/generators/dalekModDalek/dalekModDalekGenerator";
import { generator as minecraftActionFigureGenerator } from "@/generators/minecraftActionFigure/minecraftActionFigureGenerator";
import { generator as minecraftAllayCharacterGenerator } from "@/generators/minecraftAllayCharacter/minecraftAllayCharacterGenerator";
import { generator as minecraftAxolotlCharacterGenerator } from "@/generators/minecraftAxolotlCharacter/minecraftAxolotlCharacterGenerator";
import { generator as minecraftBeeCharacterGenerator } from "@/generators/minecraftBeeCharacter/minecraftBeeCharacterGenerator";
import { generator as minecraftCapeAndElytraGenerator } from "@/generators/minecraftCapeAndElytra/minecraftCapeAndElytraGenerator";
import { generator as minecraftCatGenerator } from "@/generators/minecraftCat/minecraftCatGenerator";
import { generator as minecraftCatCharacterGenerator } from "@/generators/minecraftCatCharacter/minecraftCatCharacterGenerator";
import { generator as minecraftCharacterGenerator } from "@/generators/minecraftCharacter/minecraftCharacterGenerator";
import { generator as minecraftCharacterHeadsGenerator } from "@/generators/minecraftCharacterHeads/minecraftCharacterHeadsGenerator";
import { generator as minecraftCharacterMiniGenerator } from "@/generators/minecraftCharacterMini/minecraftCharacterMiniGenerator";
import { generator as minecraftCowCharacterGenerator } from "@/generators/minecraftCowCharacter/minecraftCowCharacterGenerator";
import { generator as minecraftCreeperGenerator } from "@/generators/minecraftCreeper/minecraftCreeperGenerator";
import { generator as minecraftCreeperCharacterGenerator } from "@/generators/minecraftCreeperCharacter/minecraftCreeperCharacterGenerator";
import { generator as minecraftEndermanGenerator } from "@/generators/minecraftEnderman/minecraftEndermanGenerator";
import { generator as minecraftEndermanCharacterGenerator } from "@/generators/minecraftEndermanCharacter/minecraftEndermanCharacterGenerator";
import { generator as minecraftGolemGenerator } from "@/generators/minecraftGolem/minecraftGolemGenerator";
import { generator as minecraftGolemCharacterGenerator } from "@/generators/minecraftGolemCharacter/minecraftGolemCharacterGenerator";
import { generator as minecraftHorseGenerator } from "@/generators/minecraftHorse/minecraftHorseGenerator";
import { generator as minecraftMutantCharacterGenerator } from "@/generators/minecraftMutantCharacter/minecraftMutantCharacterGenerator";
import { generator as minecraftPigGenerator } from "@/generators/minecraftPig/minecraftPigGenerator";
import { generator as minecraftPigCharacterGenerator } from "@/generators/minecraftPigCharacter/minecraftPigCharacterGenerator";
import { generator as minecraftSquidCharacterGenerator } from "@/generators/minecraftSquidCharacter/minecraftSquidCharacterGenerator";
import { generator as minecraftUltimateBendableGenerator } from "@/generators/minecraftUltimateBendable/minecraftUltimateBendableGenerator";
import { generator as minecraftVillagerGenerator } from "@/generators/minecraftVillager/minecraftVillagerGenerator";
import { generator as minecraftVillagerCharacterGenerator } from "@/generators/minecraftVillagerCharacter/minecraftVillagerCharacterGenerator";
import { generator as minecraftWitherGenerator } from "@/generators/minecraftWither/minecraftWitherGenerator";
import { generator as minecraftWolfCharacterGenerator } from "@/generators/minecraftWolfCharacter/minecraftWolfCharacterGenerator";

const isDevEnvironment: boolean = process.env.NODE_ENV === "development";

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
  // minecraftBlockGenerator,
  // minecraftItemGenerator,
  minecraftCapeAndElytraGenerator,
  minecraftCharacterHeadsGenerator,
];

export const mod: GeneratorDef[] = [
  minecraftMutantCharacterGenerator,
  dalekModDalekGenerator,
];

export const other: GeneratorDef[] = [amogusBendableGenerator];

// Incomplete and in development
export const dev: GeneratorDef[] = isDevEnvironment
  ? [minecraftWitherGenerator]
  : [];

export const test: GeneratorDef[] = isDevEnvironment
  ? [
      exampleGenerator,
      // testingGenerator
    ]
  : [];

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

export type GeneratorGroup = {
  label: string;
  generators: GeneratorDef[];
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
