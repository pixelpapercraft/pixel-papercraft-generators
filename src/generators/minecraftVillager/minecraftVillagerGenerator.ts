"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  VideoDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail-v2-256.jpeg";
import villagerImage from "./images/Villager.png";
import zombieVillagerImage from "./images/ZombieVillager.png";
import farmerHatImage from "./images/farmerhat.png";
import shepherdHatImage from "./images/shepherdhat.png";
import fishermanHatImage from "./images/fishermanhat.png";
import desertImage from "./textures/desert.png";
import plainsImage from "./textures/plains.png";
import taigaImage from "./textures/taiga.png";
import snowImage from "./textures/snow.png";
import savannaImage from "./textures/savanna.png";
import jungleImage from "./textures/jungle.png";
import swampImage from "./textures/swamp.png";
import desertZombieImage from "./textures/desertzombie.png";
import plainsZombieImage from "./textures/plainszombie.png";
import taigaZombieImage from "./textures/taigazombie.png";
import snowZombieImage from "./textures/snowzombie.png";
import savannaZombieImage from "./textures/savannazombie.png";
import jungleZombieImage from "./textures/junglezombie.png";
import swampZombieImage from "./textures/swampzombie.png";
import armorerImage from "./textures/armorer.png";
import butcherImage from "./textures/butcher.png";
import cartographerImage from "./textures/cartographer.png";
import clericImage from "./textures/cleric.png";
import farmerImage from "./textures/farmer.png";
import fishermanImage from "./textures/fisherman.png";
import fletcherImage from "./textures/fletcher.png";
import leatherworkerImage from "./textures/leatherworker.png";
import librarianImage from "./textures/librarian.png";
import masonImage from "./textures/mason.png";
import nitwitImage from "./textures/nitwit.png";
import shepherdImage from "./textures/shepherd.png";
import toolsmithImage from "./textures/toolsmith.png";
import weaponsmithImage from "./textures/weaponsmith.png";
import zombieArmorerImage from "./textures/zombiearmorer.png";
import zombieButcherImage from "./textures/zombiebutcher.png";
import zombieCartographerImage from "./textures/zombiecartographer.png";
import zombieClericImage from "./textures/zombiecleric.png";
import zombieFarmerImage from "./textures/zombiefarmer.png";
import zombieFishermanImage from "./textures/zombiefisherman.png";
import zombieFletcherImage from "./textures/zombiefletcher.png";
import zombieLeatherworkerImage from "./textures/zombieleatherworker.png";
import zombieLibrarianImage from "./textures/zombielibrarian.png";
import zombieMasonImage from "./textures/zombiemason.png";
import zombieNitwitImage from "./textures/zombienitwit.png";
import zombieShepherdImage from "./textures/zombieshepherd.png";
import zombieToolsmithImage from "./textures/zombietoolsmith.png";
import zombieWeaponsmithImage from "./textures/zombieweaponsmith.png";

const id = "minecraft-villager";

const name = "Minecraft Villager";

const history: HistoryDef = [
  "19 May 2022 PaperDoggy - Initial script developed.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const video: VideoDef = {
  url: "https://www.youtube.com/embed/jcO0fe-pj9k?rel=0",
};

const images: ImageDef[] = [
  { id: "Villager", url: villagerImage.src },
  { id: "ZombieVillager", url: zombieVillagerImage.src },
  { id: "FarmerHat", url: farmerHatImage.src },
  { id: "ShepherdHat", url: shepherdHatImage.src },
  { id: "FishermanHat", url: fishermanHatImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Desert",
    url: desertImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Plains",
    url: plainsImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Taiga",
    url: taigaImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Snow",
    url: snowImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Savanna",
    url: savannaImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Jungle",
    url: jungleImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Swamp",
    url: swampImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "DesertZombie",
    url: desertZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "PlainsZombie",
    url: plainsZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "TaigaZombie",
    url: taigaZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "SnowZombie",
    url: snowZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "SavannaZombie",
    url: savannaZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "JungleZombie",
    url: jungleZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "SwampZombie",
    url: swampZombieImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Armorer",
    url: armorerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Butcher",
    url: butcherImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Cartographer",
    url: cartographerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Cleric",
    url: clericImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Farmer",
    url: farmerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Fisherman",
    url: fishermanImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Fletcher",
    url: fletcherImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Leatherworker",
    url: leatherworkerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Librarian",
    url: librarianImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Mason",
    url: masonImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Nitwit",
    url: nitwitImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Shepherd",
    url: shepherdImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Toolsmith",
    url: toolsmithImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Weaponsmith",
    url: weaponsmithImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieArmorer",
    url: zombieArmorerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieButcher",
    url: zombieButcherImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieCartographer",
    url: zombieCartographerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieCleric",
    url: zombieClericImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieFarmer",
    url: zombieFarmerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieFisherman",
    url: zombieFishermanImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieFletcher",
    url: zombieFletcherImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieLeatherworker",
    url: zombieLeatherworkerImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieLibrarian",
    url: zombieLibrarianImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieMason",
    url: zombieMasonImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieNitwit",
    url: zombieNitwitImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieShepherd",
    url: zombieShepherdImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieToolsmith",
    url: zombieToolsmithImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "ZombieWeaponsmith",
    url: zombieWeaponsmithImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const drawing = {
    drawHatOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [8, 0, 8, 8], [ox, oy - 65, 64, 64]);
      generator.drawTexture(texture, [8, 8, 8, 10], [ox, oy, 64, 80]);
      generator.drawTexture(texture, [0, 8, 8, 10], [ox - 65, oy, 64, 80]);
      generator.drawTexture(texture, [16, 8, 8, 10], [ox + 65, oy, 64, 80]);
      generator.drawTexture(texture, [24, 8, 8, 10], [ox + 130, oy, 64, 80]);
      generator.drawTexture(texture, [8 + 32, 0, 8, 8], [ox, oy - 65, 64, 64]);
      generator.drawTexture(texture, [8 + 32, 8, 8, 10], [ox, oy, 64, 80]);
      generator.drawTexture(texture, [0 + 32, 8, 8, 10], [ox - 65, oy, 64, 80]);
      generator.drawTexture(
        texture,
        [16 + 32, 8, 8, 10],
        [ox + 65, oy, 64, 80]
      );
      generator.drawTexture(
        texture,
        [24 + 32, 8, 8, 10],
        [ox + 130, oy, 64, 80]
      );
    },

    drawClothes: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [6, 38, 8, 6], [ox, oy - 53, 68, 52]);
      generator.drawTexture(texture, [6, 44, 8, 22], [ox, oy, 68, 176]);
      generator.drawTexture(texture, [0, 44, 6, 22], [ox - 53, oy, 52, 176]);
      generator.drawTexture(texture, [14, 44, 6, 22], [ox + 69, oy, 52, 176]);
      generator.drawTexture(
        texture,
        [20, 44, 8, 22],
        [ox + 69 + 53, oy, 68, 176]
      );
    },

    drawBodyOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [22, 26 - 6, 8, 6], [ox, oy - 49, 64, 48]);
      generator.drawTexture(
        texture,
        [22 + 8, 26 - 6, 8, 6],
        [ox, oy + 97, 64, 48],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, [22, 26, 8, 12], [ox, oy, 64, 96]);
      generator.drawTexture(
        texture,
        [22 - 6, 26, 6, 12],
        [ox - 49, oy, 48, 96]
      );
      generator.drawTexture(
        texture,
        [22 + 8, 26, 6, 12],
        [ox + 65, oy, 48, 96]
      );
      generator.drawTexture(
        texture,
        [22 + 14, 26, 8, 12],
        [ox + 65 + 49, oy, 64, 96]
      );
    },

    drawLeftLegOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [4, 26 - 4, 4, 4], [ox, oy - 33, 32, 32]);
      generator.drawTexture(
        texture,
        [4 + 4, 26 - 4, 4, 4],
        [ox, oy + 97, 32, 32],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, [4, 26, 4, 12], [ox, oy, 32, 96]);
      generator.drawTexture(texture, [4 - 4, 26, 4, 12], [ox - 33, oy, 32, 96]);
      generator.drawTexture(texture, [4 + 4, 26, 4, 12], [ox + 33, oy, 32, 96]);
      generator.drawTexture(
        texture,
        [4 + 8, 26, 4, 12],
        [ox + 33 + 33, oy, 32, 96]
      );
    },

    drawRightLegOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [4, 26 - 4, 4, 4], [ox, oy - 33, 32, 32], {
        flip: "Horizontal",
      });
      generator.drawTexture(
        texture,
        [4 + 4, 26 - 4, 4, 4],
        [ox, oy + 97, 32, 32],
        { rotate: 180.0 }
      );
      generator.drawTexture(texture, [4, 26, 4, 12], [ox, oy, 32, 96], {
        flip: "Horizontal",
      });
      generator.drawTexture(
        texture,
        [4 + 4, 26, 4, 12],
        [ox - 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [4 - 4, 26, 4, 12],
        [ox + 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [4 + 8, 26, 4, 12],
        [ox - 33 - 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
    },

    drawLeftArmOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [48, 26 - 4, 4, 4], [ox, oy - 33, 32, 32]);
      generator.drawTexture(
        texture,
        [48 + 4, 26 - 4, 4, 4],
        [ox, oy + 65, 32, 32],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, [48, 26, 4, 8], [ox, oy, 32, 64]);
      generator.drawTexture(texture, [48 - 4, 26, 4, 8], [ox - 33, oy, 32, 64]);
      generator.drawTexture(texture, [48 + 4, 26, 4, 8], [ox + 33, oy, 32, 64]);
      generator.drawTexture(
        texture,
        [48 + 8, 26, 4, 8],
        [ox + 33 + 33, oy, 32, 64]
      );
    },

    drawRightArmOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        [48, 26 - 4, 4, 4],
        [ox, oy - 33, 32, 32],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 + 4, 26 - 4, 4, 4],
        [ox, oy + 65, 32, 32],
        { rotate: 180.0 }
      );
      generator.drawTexture(texture, [48, 26, 4, 8], [ox, oy, 32, 64], {
        flip: "Horizontal",
      });
      generator.drawTexture(
        texture,
        [48 + 4, 26, 4, 8],
        [ox - 33, oy, 32, 64],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 - 4, 26, 4, 8],
        [ox + 33, oy, 32, 64],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 + 8, 26, 4, 8],
        [ox - 33 - 33, oy, 32, 64],
        { flip: "Horizontal" }
      );
    },

    drawMiddleArmOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [44, 42 - 4, 8, 4], [ox, oy - 33, 64, 32]);
      generator.drawTexture(
        texture,
        [44 + 8, 42 - 4, 8, 4],
        [ox, oy + 33, 64, 32],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, [44, 42, 8, 4], [ox, oy, 64, 32]);
      generator.drawTexture(texture, [44 - 4, 42, 4, 4], [ox - 33, oy, 32, 32]);
      generator.drawTexture(texture, [44 + 8, 42, 4, 4], [ox + 65, oy, 32, 32]);
      generator.drawTexture(
        texture,
        [44 + 12, 42, 8, 4],
        [ox + 33 + 65, oy, 64, 32]
      );
    },

    drawZombieLeftArmOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, [48, 26 - 4, 4, 4], [ox, oy - 33, 32, 32]);
      generator.drawTexture(
        texture,
        [48 + 4, 26 - 4, 4, 4],
        [ox, oy + 97, 32, 32],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, [48, 26, 4, 12], [ox, oy, 32, 96]);
      generator.drawTexture(
        texture,
        [48 - 4, 26, 4, 12],
        [ox - 33, oy, 32, 96]
      );
      generator.drawTexture(
        texture,
        [48 + 4, 26, 4, 12],
        [ox + 33, oy, 32, 96]
      );
      generator.drawTexture(
        texture,
        [48 + 8, 26, 4, 12],
        [ox + 33 + 33, oy, 32, 96]
      );
    },

    drawZombieRightArmOverlay: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        [48, 26 - 4, 4, 4],
        [ox, oy - 33, 32, 32],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 + 4, 26 - 4, 4, 4],
        [ox, oy + 97, 32, 32],
        { rotate: 180.0 }
      );
      generator.drawTexture(texture, [48, 26, 4, 12], [ox, oy, 32, 96], {
        flip: "Horizontal",
      });
      generator.drawTexture(
        texture,
        [48 + 4, 26, 4, 12],
        [ox - 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 - 4, 26, 4, 12],
        [ox + 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
      generator.drawTexture(
        texture,
        [48 + 8, 26, 4, 12],
        [ox - 33 - 33, oy, 32, 96],
        { flip: "Horizontal" }
      );
    },
  };

  generator.defineSelectInput("Type", ["Normal", "Zombie"]);

  generator.defineSelectInput("Biome", [
    "Plains",
    "Desert",
    "Jungle",
    "Savanna",
    "Snow",
    "Swamp",
    "Taiga",
  ]);

  generator.defineSelectInput("Profession", [
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
  ]);

  const villagertype = generator.getSelectInputValue("Type") === "Normal";
  const zombietype = generator.getSelectInputValue("Type") === "Zombie";
  const professionArmorer =
    generator.getSelectInputValue("Profession") === "Armorer";
  const professionButcher =
    generator.getSelectInputValue("Profession") === "Butcher";
  const professionCartographer =
    generator.getSelectInputValue("Profession") === "Cartographer";
  const professionCleric =
    generator.getSelectInputValue("Profession") === "Cleric";
  const professionFarmer =
    generator.getSelectInputValue("Profession") === "Farmer";
  const professionFisherman =
    generator.getSelectInputValue("Profession") === "Fisherman";
  const professionFletcher =
    generator.getSelectInputValue("Profession") === "Fletcher";
  const professionLeatherworker =
    generator.getSelectInputValue("Profession") === "Leatherworker";
  const professionLibrarian =
    generator.getSelectInputValue("Profession") === "Librarian";
  const professionMason =
    generator.getSelectInputValue("Profession") === "Mason";
  const professionNitwit =
    generator.getSelectInputValue("Profession") === "Nitwit";
  const professionShepherd =
    generator.getSelectInputValue("Profession") === "Shepherd";
  const professionToolsmith =
    generator.getSelectInputValue("Profession") === "Toolsmith";
  const professionWeaponsmith =
    generator.getSelectInputValue("Profession") === "Weaponsmith";
  const plains = generator.getSelectInputValue("Biome") === "Plains";
  const desert = generator.getSelectInputValue("Biome") === "Desert";
  const jungle = generator.getSelectInputValue("Biome") === "Jungle";
  const savanna = generator.getSelectInputValue("Biome") === "Savanna";
  const snow = generator.getSelectInputValue("Biome") === "Snow";
  const swamp = generator.getSelectInputValue("Biome") === "Swamp";
  const taiga = generator.getSelectInputValue("Biome") === "Taiga";

  if (villagertype) {
    generator.drawImage("Villager", [0, 0]);
    //Biome Overlay
    if (
      !(
        professionButcher ||
        professionFarmer ||
        professionFisherman ||
        professionFletcher ||
        professionLibrarian ||
        professionShepherd
      )
    ) {
      if (plains) {
        drawing.drawHatOverlay(82, 83, "Plains");
      }
      if (desert) {
        drawing.drawHatOverlay(82, 83, "Desert");
      }
      if (jungle) {
        drawing.drawHatOverlay(82, 83, "Jungle");
      }
      if (savanna) {
        drawing.drawHatOverlay(82, 83, "Savanna");
      }
      if (snow) {
        drawing.drawHatOverlay(82, 83, "Snow");
      }
      if (swamp) {
        drawing.drawHatOverlay(82, 83, "Swamp");
      }
      if (taiga) {
        drawing.drawHatOverlay(82, 83, "Taiga");
      }
    }
    if (plains) {
      drawing.drawClothes(330, 550, "Plains");
      drawing.drawBodyOverlay(361, 216, "Plains");
      drawing.drawLeftLegOverlay(62, 290, "Plains");
      drawing.drawRightLegOverlay(267, 370, "Plains");
      drawing.drawLeftArmOverlay(56, 476, "Plains");
      drawing.drawRightArmOverlay(517, 379, "Plains");
      drawing.drawMiddleArmOverlay(46, 643, "Plains");
    }
    if (desert) {
      drawing.drawClothes(330, 550, "Desert");
      drawing.drawBodyOverlay(361, 216, "Desert");
      drawing.drawLeftLegOverlay(62, 290, "Desert");
      drawing.drawRightLegOverlay(267, 370, "Desert");
      drawing.drawLeftArmOverlay(56, 476, "Desert");
      drawing.drawRightArmOverlay(517, 379, "Desert");
      drawing.drawMiddleArmOverlay(46, 643, "Desert");
    }
    if (jungle) {
      drawing.drawClothes(330, 550, "Jungle");
      drawing.drawBodyOverlay(361, 216, "Jungle");
      drawing.drawLeftLegOverlay(62, 290, "Jungle");
      drawing.drawRightLegOverlay(267, 370, "Jungle");
      drawing.drawLeftArmOverlay(56, 476, "Jungle");
      drawing.drawRightArmOverlay(517, 379, "Jungle");
      drawing.drawMiddleArmOverlay(46, 643, "Jungle");
    }
    if (savanna) {
      drawing.drawClothes(330, 550, "Savanna");
      drawing.drawBodyOverlay(361, 216, "Savanna");
      drawing.drawLeftLegOverlay(62, 290, "Savanna");
      drawing.drawRightLegOverlay(267, 370, "Savanna");
      drawing.drawLeftArmOverlay(56, 476, "Savanna");
      drawing.drawRightArmOverlay(517, 379, "Savanna");
      drawing.drawMiddleArmOverlay(46, 643, "Savanna");
    }
    if (snow) {
      drawing.drawClothes(330, 550, "Snow");
      drawing.drawBodyOverlay(361, 216, "Snow");
      drawing.drawLeftLegOverlay(62, 290, "Snow");
      drawing.drawRightLegOverlay(267, 370, "Snow");
      drawing.drawLeftArmOverlay(56, 476, "Snow");
      drawing.drawRightArmOverlay(517, 379, "Snow");
      drawing.drawMiddleArmOverlay(46, 643, "Snow");
    }
    if (swamp) {
      drawing.drawClothes(330, 550, "Swamp");
      drawing.drawBodyOverlay(361, 216, "Swamp");
      drawing.drawLeftLegOverlay(62, 290, "Swamp");
      drawing.drawRightLegOverlay(267, 370, "Swamp");
      drawing.drawLeftArmOverlay(56, 476, "Swamp");
      drawing.drawRightArmOverlay(517, 379, "Swamp");
      drawing.drawMiddleArmOverlay(46, 643, "Swamp");
    }
    if (taiga) {
      drawing.drawClothes(330, 550, "Taiga");
      drawing.drawBodyOverlay(361, 216, "Taiga");
      drawing.drawLeftLegOverlay(62, 290, "Taiga");
      drawing.drawRightLegOverlay(267, 370, "Taiga");
      drawing.drawLeftArmOverlay(56, 476, "Taiga");
      drawing.drawRightArmOverlay(517, 379, "Taiga");
      drawing.drawMiddleArmOverlay(46, 643, "Taiga");
    }
    //Profession Overlay
    if (professionArmorer) {
      drawing.drawHatOverlay(82, 83, "Armorer");
      drawing.drawClothes(330, 550, "Armorer");
      drawing.drawLeftArmOverlay(56, 476, "Armorer");
      drawing.drawRightArmOverlay(517, 379, "Armorer");
      drawing.drawMiddleArmOverlay(46, 643, "Armorer");
    }
    if (professionButcher) {
      drawing.drawHatOverlay(82, 83, "Buther");
      drawing.drawClothes(330, 550, "Butcher");
      drawing.drawLeftArmOverlay(56, 476, "Butcher");
      drawing.drawRightArmOverlay(517, 379, "Butcher");
      drawing.drawMiddleArmOverlay(46, 643, "Butcher");
    }
    if (professionCartographer) {
      drawing.drawHatOverlay(82, 83, "Cartographer");
      drawing.drawClothes(330, 550, "Cartographer");
      drawing.drawLeftArmOverlay(56, 476, "Cartographer");
      drawing.drawRightArmOverlay(517, 379, "Cartographer");
      drawing.drawMiddleArmOverlay(46, 643, "Cartographer");
    }
    if (professionCleric) {
      drawing.drawHatOverlay(82, 83, "Cleric");
      drawing.drawClothes(330, 550, "Cleric");
      drawing.drawLeftArmOverlay(56, 476, "Cleric");
      drawing.drawRightArmOverlay(517, 379, "Cleric");
      drawing.drawMiddleArmOverlay(46, 643, "Cleric");
    }
    if (professionFarmer) {
      drawing.drawHatOverlay(82, 83, "Farmer");
      drawing.drawClothes(330, 550, "Farmer");
      drawing.drawLeftArmOverlay(56, 476, "Farmer");
      drawing.drawRightArmOverlay(517, 379, "Farmer");
      drawing.drawMiddleArmOverlay(46, 643, "Farmer");
      generator.drawImage("FarmerHat", [316, 12]);
    }
    if (professionFisherman) {
      drawing.drawHatOverlay(82, 83, "Fisherman");
      drawing.drawClothes(330, 550, "Fisherman");
      drawing.drawLeftLegOverlay(62, 290, "Fisherman");
      drawing.drawRightLegOverlay(267, 370, "Fisherman");
      drawing.drawLeftArmOverlay(56, 476, "Fisherman");
      drawing.drawRightArmOverlay(517, 379, "Fisherman");
      drawing.drawMiddleArmOverlay(46, 643, "Fisherman");
      generator.drawImage("FishermanHat", [316, 12]);
    }
    if (professionFletcher) {
      drawing.drawHatOverlay(82, 83, "Fletcher");
      drawing.drawClothes(330, 550, "Fletcher");
      drawing.drawLeftArmOverlay(56, 476, "Fletcher");
      drawing.drawRightArmOverlay(517, 379, "Fletcher");
      drawing.drawMiddleArmOverlay(46, 643, "Fletcher");
    }
    if (professionLeatherworker) {
      drawing.drawHatOverlay(82, 83, "Leatherworker");
      drawing.drawClothes(330, 550, "Leatherworker");
      drawing.drawLeftArmOverlay(56, 476, "Leatherworker");
      drawing.drawRightArmOverlay(517, 379, "Leatherworker");
      drawing.drawMiddleArmOverlay(46, 643, "Leatherworker");
    }
    if (professionLibrarian) {
      drawing.drawHatOverlay(82, 83, "Librarian");
      drawing.drawClothes(330, 550, "Librarian");
      drawing.drawLeftArmOverlay(56, 476, "Librarian");
      drawing.drawRightArmOverlay(517, 379, "Librarian");
      drawing.drawMiddleArmOverlay(46, 643, "Library");
    }
    if (professionMason) {
      drawing.drawHatOverlay(82, 83, "Mason");
      drawing.drawClothes(330, 550, "Mason");
      drawing.drawLeftArmOverlay(56, 476, "Mason");
      drawing.drawRightArmOverlay(517, 379, "Mason");
      drawing.drawMiddleArmOverlay(46, 643, "Mason");
    }
    if (professionNitwit) {
      drawing.drawHatOverlay(82, 83, "Nitwit");
      drawing.drawClothes(330, 550, "Nitwit");
      drawing.drawLeftArmOverlay(56, 476, "Nitwit");
      drawing.drawRightArmOverlay(517, 379, "Nitwit");
      drawing.drawMiddleArmOverlay(46, 643, "Nitwit");
    }
    if (professionShepherd) {
      drawing.drawHatOverlay(82, 83, "Shepherd");
      drawing.drawClothes(330, 550, "Shepherd");
      drawing.drawLeftArmOverlay(56, 476, "Shepherd");
      drawing.drawRightArmOverlay(517, 379, "Shepherd");
      drawing.drawMiddleArmOverlay(46, 643, "Shepherd");
      generator.drawImage("ShepherdHat", [316, 12]);
    }
    if (professionToolsmith) {
      drawing.drawHatOverlay(82, 83, "Toolsmith");
      drawing.drawClothes(330, 550, "Toolsmith");
      drawing.drawLeftArmOverlay(56, 476, "Toolsmith");
      drawing.drawRightArmOverlay(517, 379, "Toolsmith");
      drawing.drawMiddleArmOverlay(46, 643, "Toolsmith");
    }
    if (professionWeaponsmith) {
      drawing.drawHatOverlay(82, 83, "Weaponsmith");
      drawing.drawClothes(330, 550, "Weaponsmith");
      drawing.drawLeftArmOverlay(56, 476, "Weaponsmith");
      drawing.drawRightArmOverlay(517, 379, "Weaponsmith");
      drawing.drawMiddleArmOverlay(46, 643, "Weaponsmith");
    }
  }
  if (zombietype) {
    generator.drawImage("ZombieVillager", [0, 0]);
    //Biome Overlay
    if (
      !(
        professionButcher ||
        professionFarmer ||
        professionFisherman ||
        professionFletcher ||
        professionLibrarian ||
        professionShepherd
      )
    ) {
      if (plains) {
        drawing.drawHatOverlay(82, 83, "PlainsZombie");
      }
      if (desert) {
        drawing.drawHatOverlay(82, 83, "DesertZombie");
      }
      if (jungle) {
        drawing.drawHatOverlay(82, 83, "JungleZombie");
      }
      if (savanna) {
        drawing.drawHatOverlay(82, 83, "SavannaZombie");
      }
      if (snow) {
        drawing.drawHatOverlay(82, 83, "SnowZombie");
      }
      if (swamp) {
        drawing.drawHatOverlay(82, 83, "SwampZombie");
      }
      if (taiga) {
        drawing.drawHatOverlay(82, 83, "TaigaZombie");
      }
    }
    if (plains) {
      drawing.drawClothes(330, 550, "PlainsZombie");
      drawing.drawBodyOverlay(361, 216, "PlainsZombie");
      drawing.drawLeftLegOverlay(62, 290, "PlainsZombie");
      drawing.drawRightLegOverlay(267, 370, "PlainsZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "PlainsZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "PlainsZombie");
    }
    if (desert) {
      drawing.drawClothes(330, 550, "DesertZombie");
      drawing.drawBodyOverlay(361, 216, "DesertZombie");
      drawing.drawLeftLegOverlay(62, 290, "DesertZombie");
      drawing.drawRightLegOverlay(267, 370, "DesertZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "DesertZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "DesertZombie");
    }
    if (jungle) {
      drawing.drawClothes(330, 550, "JungleZombie");
      drawing.drawBodyOverlay(361, 216, "JungleZombie");
      drawing.drawLeftLegOverlay(62, 290, "JungleZombie");
      drawing.drawRightLegOverlay(267, 370, "JungleZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "JungleZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "JungleZombie");
    }
    if (savanna) {
      drawing.drawClothes(330, 550, "SavannaZombie");
      drawing.drawBodyOverlay(361, 216, "SavannaZombie");
      drawing.drawLeftLegOverlay(62, 290, "SavannaZombie");
      drawing.drawRightLegOverlay(267, 370, "SavannaZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "SavannaZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "SavannaZombie");
    }
    if (snow) {
      drawing.drawClothes(330, 550, "SnowZombie");
      drawing.drawBodyOverlay(361, 216, "SnowZombie");
      drawing.drawLeftLegOverlay(62, 290, "SnowZombie");
      drawing.drawRightLegOverlay(267, 370, "SnowZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "SnowZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "SnowZombie");
    }
    if (swamp) {
      drawing.drawClothes(330, 550, "SwampZombie");
      drawing.drawBodyOverlay(361, 216, "SwampZombie");
      drawing.drawLeftLegOverlay(62, 290, "SwampZombie");
      drawing.drawRightLegOverlay(267, 370, "SwampZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "SwampZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "SwampZombie");
    }
    if (taiga) {
      drawing.drawClothes(330, 550, "TaigaZombie");
      drawing.drawBodyOverlay(361, 216, "TaigaZombie");
      drawing.drawLeftLegOverlay(62, 290, "TaigaZombie");
      drawing.drawRightLegOverlay(267, 370, "TaigaZombie");
      drawing.drawZombieLeftArmOverlay(56, 476, "TaigaZombie");
      drawing.drawZombieRightArmOverlay(517, 379, "TaigaZombie");
    }
    //Profession Overlay
    if (professionArmorer) {
      drawing.drawHatOverlay(82, 83, "ZombieArmorer");
      drawing.drawClothes(330, 550, "ZombieArmorer");
      drawing.drawLeftArmOverlay(56, 476, "ZombieArmorer");
      drawing.drawRightArmOverlay(517, 379, "ZombieArmorer");
    }
    if (professionButcher) {
      drawing.drawHatOverlay(82, 83, "ZombieButher");
      drawing.drawClothes(330, 550, "ZombieButcher");
      drawing.drawLeftArmOverlay(56, 476, "ZombieButcher");
      drawing.drawRightArmOverlay(517, 379, "ZombieButcher");
    }
    if (professionCartographer) {
      drawing.drawHatOverlay(82, 83, "ZombieCartographer");
      drawing.drawClothes(330, 550, "ZombieCartographer");
      drawing.drawLeftArmOverlay(56, 476, "ZombieCartographer");
      drawing.drawRightArmOverlay(517, 379, "ZombieCartographer");
    }
    if (professionCleric) {
      drawing.drawHatOverlay(82, 83, "ZombieCleric");
      drawing.drawClothes(330, 550, "ZombieCleric");
      drawing.drawLeftArmOverlay(56, 476, "ZombieCleric");
      drawing.drawRightArmOverlay(517, 379, "ZombieCleric");
    }
    if (professionFarmer) {
      drawing.drawHatOverlay(82, 83, "ZombieFarmer");
      drawing.drawClothes(330, 550, "ZombieFarmer");
      drawing.drawLeftArmOverlay(56, 476, "ZombieFarmer");
      drawing.drawRightArmOverlay(517, 379, "ZombieFarmer");
      generator.drawImage("FarmerHat", [316, 12]);
    }
    if (professionFisherman) {
      drawing.drawHatOverlay(82, 83, "ZombieFisherman");
      drawing.drawClothes(330, 550, "ZombieFisherman");
      drawing.drawLeftLegOverlay(62, 290, "ZombieFisherman");
      drawing.drawRightLegOverlay(267, 370, "ZombieFisherman");
      drawing.drawLeftArmOverlay(56, 476, "ZombieFisherman");
      drawing.drawRightArmOverlay(517, 379, "ZombieFisherman");
      generator.drawImage("FishermanHat", [316, 12]);
    }
    if (professionFletcher) {
      drawing.drawHatOverlay(82, 83, "ZombieFletcher");
      drawing.drawClothes(330, 550, "ZombieFletcher");
      drawing.drawLeftArmOverlay(56, 476, "ZombieFletcher");
      drawing.drawRightArmOverlay(517, 379, "ZombieFletcher");
    }
    if (professionLeatherworker) {
      drawing.drawHatOverlay(82, 83, "ZombieLeatherworker");
      drawing.drawClothes(330, 550, "ZombieLeatherworker");
      drawing.drawLeftArmOverlay(56, 476, "ZombieLeatherworker");
      drawing.drawRightArmOverlay(517, 379, "ZombieLeatherworker");
    }
    if (professionLibrarian) {
      drawing.drawHatOverlay(82, 83, "ZombieLibrarian");
      drawing.drawClothes(330, 550, "ZombieLibrarian");
      drawing.drawLeftArmOverlay(56, 476, "ZombieLibrarian");
      drawing.drawRightArmOverlay(517, 379, "ZombieLibrarian");
    }
    if (professionMason) {
      drawing.drawHatOverlay(82, 83, "ZombieMason");
      drawing.drawClothes(330, 550, "ZombieMason");
      drawing.drawLeftArmOverlay(56, 476, "ZombieMason");
      drawing.drawRightArmOverlay(517, 379, "ZombieMason");
    }
    if (professionNitwit) {
      drawing.drawHatOverlay(82, 83, "ZombieNitwit");
      drawing.drawClothes(330, 550, "ZombieNitwit");
      drawing.drawLeftArmOverlay(56, 476, "ZombieNitwit");
      drawing.drawRightArmOverlay(517, 379, "ZombieNitwit");
    }
    if (professionShepherd) {
      drawing.drawHatOverlay(82, 83, "ZombieShepherd");
      drawing.drawClothes(330, 550, "ZombieShepherd");
      drawing.drawLeftArmOverlay(56, 476, "ZombieShepherd");
      drawing.drawRightArmOverlay(517, 379, "ZombieShepherd");
      generator.drawImage("ShepherdHat", [316, 12]);
    }
    if (professionToolsmith) {
      drawing.drawHatOverlay(82, 83, "ZombieToolsmith");
      drawing.drawClothes(330, 550, "ZombieToolsmith");
      drawing.drawLeftArmOverlay(56, 476, "ZombieToolsmith");
      drawing.drawRightArmOverlay(517, 379, "ZombieToolsmith");
    }
    if (professionWeaponsmith) {
      drawing.drawHatOverlay(82, 83, "ZombieWeaponsmith");
      drawing.drawClothes(330, 550, "ZombieWeaponsmith");
      drawing.drawLeftArmOverlay(56, 476, "ZombieWeaponsmith");
      drawing.drawRightArmOverlay(517, 379, "ZombieWeaponsmith");
    }
  }
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail,
  video,
  instructions: null,
  images,
  textures,
  script,
  history,
};
