// Sources:
// - https://minecraft.wiki/w/Block_colors
// - https://minecraft.wiki/w/Effect_colors#Potion_colors

export type TintChoice = {
  id: string;
  label: string;
  color: string;
};

export type TintChoiceGroup = {
  id: string;
  label: string;
  options: TintChoice[];
};

function makeTintChoiceGroup(
  id: string,
  label: string,
  options: Array<Omit<TintChoice, "id">>
): TintChoiceGroup {
  return {
    id,
    label,
    options: options.map((option, index) => ({
      id: `${id}-${index}`,
      ...option,
    })),
  };
}

export const leatherTintGroup = makeTintChoiceGroup("leather", "Leather", [
  { label: "Leather", color: "#A06540" },
]);

export const dyeTintGroup = makeTintChoiceGroup("dye", "Dyes", [
  { label: "Black", color: "#1D1D21" },
  { label: "Red", color: "#B02E26" },
  { label: "Green", color: "#5E7C16" },
  { label: "Brown", color: "#835432" },
  { label: "Blue", color: "#3C44AA" },
  { label: "Purple", color: "#8932B8" },
  { label: "Cyan", color: "#169C9C" },
  { label: "Light Gray", color: "#9D9D97" },
  { label: "Gray", color: "#474F52" },
  { label: "Pink", color: "#F38BAA" },
  { label: "Lime", color: "#80C71F" },
  { label: "Yellow", color: "#FED83D" },
  { label: "Light Blue", color: "#3AB3DA" },
  { label: "Magenta", color: "#C74EBD" },
  { label: "Orange", color: "#F9801D" },
  { label: "White", color: "#F9FFFE" },
]);

export const grassTintGroup = makeTintChoiceGroup("grass", "Grass", [
  { label: "Badlands", color: "#90814D" },
  { label: "Cherry Grove", color: "#B6DB61" },
  { label: "Desert / Savanna / Nether", color: "#BFB755" },
  { label: "Stony Peaks", color: "#9ABE4B" },
  { label: "Jungle / Bamboo Jungle", color: "#59C93C" },
  { label: "Sparse Jungle", color: "#64C73F" },
  { label: "Mushroom Fields", color: "#55C93F" },
  { label: "Swamp / Mangrove Swamp", color: "#6A7039" },
  { label: "Swamp / Mangrove Swamp (cold)", color: "#4C763C" },
  { label: "Plains / Beach / Dripstone / Deep Dark", color: "#91BD59" },
  { label: "Forest / Flower Forest", color: "#79C05A" },
  { label: "Dark Forest", color: "#507A32" },
  { label: "Pale Garden", color: "#878D76" },
  { label: "Birch Forest", color: "#88BB67" },
  { label: "Ocean / River / End / Lush Caves", color: "#8EB971" },
  { label: "Meadow", color: "#83BB6D" },
  { label: "Old Growth Pine Taiga", color: "#86B87F" },
  { label: "Taiga / Old Growth Spruce Taiga", color: "#86B783" },
  { label: "Windswept Hills / Stony Shore", color: "#8AB689" },
  { label: "Snowy Beach", color: "#83B593" },
  { label: "Snowy / Frozen / Grove / Peaks", color: "#80B497" },
]);

export const foliageTintGroup = makeTintChoiceGroup("foliage", "Foliage", [
  { label: "Badlands", color: "#9E814D" },
  { label: "Cherry Grove", color: "#B6DB61" },
  { label: "Desert / Savanna / Nether", color: "#AEA42A" },
  { label: "Stony Peaks", color: "#82AC1E" },
  { label: "Jungle / Bamboo Jungle", color: "#30BB0B" },
  { label: "Sparse Jungle", color: "#3EB80F" },
  { label: "Mushroom Fields", color: "#2BBB0F" },
  { label: "Swamp", color: "#6A7039" },
  { label: "Mangrove Swamp", color: "#8DB127" },
  { label: "Plains / Beach / Dripstone / Deep Dark", color: "#77AB2F" },
  { label: "Forest / Flower Forest / Dark Forest", color: "#59AE30" },
  { label: "Pale Garden", color: "#878D76" },
  { label: "Birch Forest", color: "#6BA941" },
  { label: "Birch Leaves (constant)", color: "#80A755" },
  { label: "Spruce Leaves (constant)", color: "#619961" },
  { label: "Ocean / River / End / Lush Caves", color: "#71A74D" },
  { label: "Meadow", color: "#63A948" },
  { label: "Old Growth Pine Taiga", color: "#68A55F" },
  { label: "Taiga / Old Growth Spruce Taiga", color: "#68A464" },
  { label: "Windswept Hills / Stony Shore", color: "#6DA36B" },
  { label: "Snowy Beach", color: "#64A278" },
  { label: "Snowy / Frozen / Grove / Peaks", color: "#60A17B" },
]);

export const dryFoliageTintGroup = makeTintChoiceGroup(
  "dry-foliage",
  "Dry Foliage",
  [
    { label: "Badlands", color: "#9E814D" },
    { label: "Cherry Grove / Meadow", color: "#A17148" },
    { label: "Desert / Savanna / Nether", color: "#A38046" },
    { label: "Stony Peaks", color: "#927957" },
    { label: "Jungle / Bamboo Jungle / Sparse Jungle", color: "#A36346" },
    { label: "Mushroom Fields", color: "#A36246" },
    { label: "Dark Forest / Swamp / Mangrove Swamp", color: "#7B5334" },
    { label: "Plains / Beach / Dripstone / Deep Dark", color: "#A37546" },
    { label: "Forest / Flower Forest", color: "#A36D46" },
    { label: "Pale Garden", color: "#A0A69C" },
    { label: "Birch Forest", color: "#A37246" },
    { label: "Ocean / River / End / Lush Caves", color: "#A17448" },
    { label: "Old Growth Pine Taiga", color: "#9C754D" },
    { label: "Taiga / Old Growth Spruce Taiga", color: "#9A764F" },
    { label: "Windswept Hills / Stony Shore", color: "#977752" },
    { label: "Snowy Beach", color: "#917958" },
    { label: "Snowy / Frozen / Grove / Peaks", color: "#8F7A5A" },
  ]
);

export const waterTintGroup = makeTintChoiceGroup("water", "Water", [
  { label: "Default / Most Biomes", color: "#3F76E4" },
  { label: "Cold Ocean / Snowy Taiga / Snowy Beach", color: "#3D57D6" },
  { label: "Frozen Ocean / Frozen River", color: "#3938C9" },
  { label: "Lukewarm Ocean", color: "#45ADF2" },
  { label: "Swamp", color: "#617B64" },
  { label: "Warm Ocean", color: "#43D5EE" },
  { label: "Meadow", color: "#0E4ECF" },
  { label: "Mangrove Swamp", color: "#3A7A6A" },
  { label: "Cherry Grove", color: "#5DB7EF" },
  { label: "Pale Garden", color: "#76889D" },
  { label: "Lily Pad (constant)", color: "#208030" },
]);

export const redstoneTintGroup = makeTintChoiceGroup("redstone", "Redstone", [
  { label: "Power 0", color: "#4B0000" },
  { label: "Power 1", color: "#6F0000" },
  { label: "Power 2", color: "#790000" },
  { label: "Power 3", color: "#820000" },
  { label: "Power 4", color: "#8C0000" },
  { label: "Power 5", color: "#970000" },
  { label: "Power 6", color: "#A10000" },
  { label: "Power 7", color: "#AB0000" },
  { label: "Power 8", color: "#B50000" },
  { label: "Power 9", color: "#BF0000" },
  { label: "Power 10", color: "#CA0000" },
  { label: "Power 11", color: "#D30000" },
  { label: "Power 12", color: "#DD0000" },
  { label: "Power 13", color: "#E70600" },
  { label: "Power 14", color: "#F11B00" },
  { label: "Power 15", color: "#FC3100" },
]);

export const stemTintGroup = makeTintChoiceGroup("stem", "Stem", [
  { label: "Age 0", color: "#00FF00" },
  { label: "Age 1", color: "#20F704" },
  { label: "Age 2", color: "#40EF08" },
  { label: "Age 3", color: "#60E70C" },
  { label: "Age 4", color: "#80DF10" },
  { label: "Age 5", color: "#A0D714" },
  { label: "Age 6", color: "#C0CF18" },
  { label: "Age 7 / Attached Stem (constant)", color: "#E0C71C" },
]);

export const potionTintGroup = makeTintChoiceGroup("potion", "Potions", [
  { label: "No Effects / Water / Awkward", color: "#385DC6" },
  { label: "Speed / Swiftness", color: "#33EBFF" },
  { label: "Slowness", color: "#8BAFE0" },
  { label: "Strength", color: "#FFC700" },
  { label: "Instant Health / Healing", color: "#F82423" },
  { label: "Instant Damage / Harming", color: "#A9656A" },
  { label: "Jump Boost / Leaping", color: "#FDFF84" },
  { label: "Regeneration", color: "#CD5CAB" },
  { label: "Fire Resistance", color: "#FF9900" },
  { label: "Water Breathing", color: "#98DAC0" },
  { label: "Invisibility", color: "#F6F6F6" },
  { label: "Night Vision", color: "#C2FF66" },
  { label: "Weakness", color: "#484D48" },
  { label: "Poison", color: "#87A363" },
  { label: "Wither / Decay", color: "#736156" },
  { label: "Luck", color: "#59C106" },
  { label: "Slow Falling", color: "#F3CFB9" },
  { label: "Infested", color: "#8C9B8C" },
  { label: "Oozing", color: "#99FFA3" },
  { label: "Weaving", color: "#78695A" },
  { label: "Wind Charged", color: "#BDC9FF" },
]);

export const blockTintChoiceGroups: TintChoiceGroup[] = [
  grassTintGroup,
  foliageTintGroup,
  dryFoliageTintGroup,
  waterTintGroup,
  redstoneTintGroup,
  stemTintGroup,
];

export const itemTintChoiceGroups: TintChoiceGroup[] = [
  dyeTintGroup,
  leatherTintGroup,
  potionTintGroup,
  ...blockTintChoiceGroups,
];

export const armorTintChoiceGroups: TintChoiceGroup[] = [
  leatherTintGroup,
  dyeTintGroup,
];

export const catTintChoiceGroups: TintChoiceGroup[] = [dyeTintGroup];

export const defaultTintChoiceGroups: TintChoiceGroup[] = blockTintChoiceGroups;
