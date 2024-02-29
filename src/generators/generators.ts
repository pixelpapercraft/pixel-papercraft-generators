import { type GeneratorDef } from "@/builder/modules/generatorDef";
import * as ExampleGenerator from "@/generators/example/exampleGenerator";
import * as AmogusBendableGenerator from "@/generators/amogusBendable/amogusBendableGenerator";
import * as DalekModDalekGenerator from "@/generators/dalekModDalek/dalekModDalekGenerator";
import * as MinecraftActionFigureGenerator from "@/generators/minecraftActionFigure/minecraftActionFigureGenerator";
import * as MinecraftAllayCharacterGenerator from "@/generators/minecraftAllayCharacter/minecraftAllayCharacterGenerator";
import * as MinecraftAxolotlCharacterGenerator from "@/generators/minecraftAxolotlCharacter/minecraftAxolotlCharacterGenerator";
import * as MinecraftBeeCharacterGenerator from "@/generators/minecraftBeeCharacter/minecraftBeeCharacterGenerator";
import * as MinecraftCapeAndElytraGenerator from "@/generators/minecraftCapeAndElytra/minecraftCapeAndElytraGenerator";
import * as MinecraftCatGenerator from "@/generators/minecraftCat/minecraftCatGenerator";
import * as MinecraftCharacterGenerator from "@/generators/minecraftCharacter/minecraftCharacterGenerator";
import * as MinecraftCharacterHeadsGenerator from "@/generators/minecraftCharacterHeads/minecraftCharacterHeadsGenerator";
import * as MinecraftCharacterMiniGenerator from "@/generators/minecraftCharacterMini/minecraftCharacterMiniGenerator";
import * as MinecraftCowCharacterGenerator from "@/generators/minecraftCowCharacter/minecraftCowCharacterGenerator";
import * as MinecraftCreeperGenerator from "@/generators/minecraftCreeper/minecraftCreeperGenerator";
import * as MinecraftCreeperCharacterGenerator from "@/generators/minecraftCreeperCharacter/minecraftCreeperCharacterGenerator";
import * as MinecraftEndermanGenerator from "@/generators/minecraftEnderman/minecraftEndermanGenerator";
import * as MinecraftEndermanCharacterGenerator from "@/generators/minecraftEndermanCharacter/minecraftEndermanCharacterGenerator";
import * as MinecraftGolemGenerator from "@/generators/minecraftGolem/minecraftGolemGenerator";
import * as MinecraftGolemCharacterGenerator from "@/generators/minecraftGolemCharacter/minecraftGolemCharacterGenerator";
import * as MinecraftHorseGenerator from "@/generators/minecraftHorse/minecraftHorseGenerator";

const isDevEnvironment: boolean = process.env.NODE_ENV === "development";

export const character: GeneratorDef[] = [
  MinecraftCharacterGenerator.generator,
  MinecraftActionFigureGenerator.generator,
  // MinecraftUltimateBendableGenerator.generator,
  MinecraftCharacterMiniGenerator.generator,
];

export const mobCharacter: GeneratorDef[] = [
  MinecraftCreeperCharacterGenerator.generator,
  // MinecraftCatCharacterGenerator.generator,
  MinecraftCowCharacterGenerator.generator,
  MinecraftEndermanCharacterGenerator.generator,
  MinecraftGolemCharacterGenerator.generator,
  // MinecraftPigCharacterGenerator.generator,
  // MinecraftSquidCharacterGenerator.generator,
  // MinecraftVillagerCharacterGenerator.generator,
  // MinecraftWolfCharacterGenerator.generator,
  MinecraftAxolotlCharacterGenerator.generator,
  MinecraftAllayCharacterGenerator.generator,
  MinecraftBeeCharacterGenerator.generator,
];

export const mob: GeneratorDef[] = [
  MinecraftCreeperGenerator.generator,
  MinecraftEndermanGenerator.generator,
  MinecraftGolemGenerator.generator,
  MinecraftHorseGenerator.generator,
  // MinecraftPigGenerator.generator,
  MinecraftCatGenerator.generator,
  // MinecraftVillagerGenerator.generator,
];

// Blocks, Items and Accessories
export const utility: GeneratorDef[] = [
  // MinecraftBlockGenerator.generator,
  // MinecraftItemGenerator.generator,
  MinecraftCapeAndElytraGenerator.generator,
  MinecraftCharacterHeadsGenerator.generator,
];

export const mod: GeneratorDef[] = [
  // MinecraftMutantCharacterGenerator.generator,
  DalekModDalekGenerator.generator,
];

export const other: GeneratorDef[] = [AmogusBendableGenerator.generator];

// Incomplete and in development
export const dev: GeneratorDef[] = isDevEnvironment
  ? [
      //  MinecraftWitherGenerator.generator
    ]
  : [];

export const test: GeneratorDef[] = isDevEnvironment
  ? [
      ExampleGenerator.generator,
      // TestingGenerator.generator
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
