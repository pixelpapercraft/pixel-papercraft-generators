// https://minecraft.fandom.com/wiki/Tint

export type Tint = {
  id: string;
  biome: string;
  color: string;
};

const grassTints: Tint[] = [
  { id: "grass-0", biome: "Badlands", color: "#90814D" },
  { id: "grass-1", biome: "Desert", color: "#BFB755" },
  { id: "grass-2", biome: "Jungle", color: "#59C93C" },
  { id: "grass-3", biome: "Jungle Edge", color: "#64C73F" },
  { id: "grass-4", biome: "Forest", color: "#79C05A" },
  { id: "grass-5", biome: "Birch Forest", color: "#88BB67" },
  { id: "grass-6", biome: "Dark Forest", color: "#507A32" },
  { id: "grass-7", biome: "Swamp", color: "#6A7039" },
  { id: "grass-8", biome: "Swamp (Cold)", color: "#4C763C" },
  { id: "grass-9", biome: "Plains", color: "#91BD59" },
  { id: "grass-10", biome: "Ocean", color: "#8EB971" },
  { id: "grass-11", biome: "Mushroom Fields", color: "#55C93F" },
  { id: "grass-12", biome: "Mountains", color: "#8AB689" },
  { id: "grass-13", biome: "Snowy Beach", color: "#83B593" },
  { id: "grass-14", biome: "Giant Tree Taiga", color: "#86B87F" },
  { id: "grass-15", biome: "Taiga", color: "#86B783" },
  { id: "grass-16", biome: "Snowy Tundra", color: "#80B497" },
];

const foliageTints: Tint[] = [
  { id: "foliage-0", biome: "Badlands", color: "#9E814D" },
  { id: "foliage-1", biome: "Desert", color: "#AEA42A" },
  { id: "foliage-2", biome: "Jungle", color: "#30BB0B" },
  { id: "foliage-3", biome: "Jungle Edge", color: "#3EB80F" },
  { id: "foliage-4", biome: "Forest", color: "#59AE30" },
  { id: "foliage-5", biome: "Birch Forest", color: "#6BA941" },
  { id: "foliage-6", biome: "Swamp", color: "#6A7039" },
  { id: "foliage-7", biome: "Plains", color: "#77AB2F" },
  { id: "foliage-8", biome: "Ocean", color: "#71A74D" },
  { id: "foliage-9", biome: "Mushroom Fields", color: "#2BBB0F" },
  { id: "foliage-10", biome: "Mountains", color: "#6DA36B" },
  { id: "foliage-11", biome: "Snowy Beach", color: "#64A278" },
  { id: "foliage-12", biome: "Giant Tree Taiga", color: "#68A55F" },
  { id: "foliage-13", biome: "Taiga", color: "#68A464" },
  { id: "foliage-14", biome: "Snowy Tundra", color: "#60A17B" },
];

const waterTints: Tint[] = [
  { id: "water-0", biome: "Most biomes", color: "#3F76E4" },
  { id: "water-1", biome: "Cold Ocean", color: "#3D57D6" },
  { id: "water-2", biome: "Frozen Ocean", color: "#3938C9" },
  { id: "water-3", biome: "Lukewarm Ocean", color: "#45ADF2" },
  { id: "water-4", biome: "Swamp", color: "#617B64" },
  { id: "water-5", biome: "Warm Ocean", color: "#43D5EE" },
];

type TintGroups = {
  grass: Array<Tint>;
  foliage: Array<Tint>;
  water: Array<Tint>;
};

export const tints: Tint[] = [...grassTints, ...foliageTints, ...waterTints];

export const tintGroups: TintGroups = {
  grass: grassTints,
  foliage: foliageTints,
  water: waterTints,
};
