"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  ThumbnailDef,
  ScriptDef,
  TextureDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";
import { encodeSelectedTexture } from "@/builder/ui/texturePicker/selectedTexture";
import { textureDefs, textureVersionIds } from "./textureVersions";
import { TexturePicker } from "./texturePicker";
import { currentBlockTextureId } from "./constants";
import { drawBlock } from "./shapes/block";
import { drawSlab } from "./shapes/slab";
import { drawStair } from "./shapes/stair";
import { drawFence } from "./shapes/fence";
import { drawDoor } from "./shapes/door";
import { drawTrapdoor } from "./shapes/trapdoor";
import { drawSnow } from "./shapes/snow";
import { drawCake } from "./shapes/cake";

import thumnbailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import titleImage from "./images/Title.png";
import foldsBlockImage from "./images/Folds-Block.png";
import tabsBlockImage from "./images/Tabs-Block.png";
import foldsSlabImage from "./images/Folds-Slab.png";
import tabsSlabImage from "./images/Tabs-Slab.png";
import foldsStairImage from "./images/Folds-Stair.png";
import tabsStairImage from "./images/Tabs-Stair.png";
import foldsFenceImage from "./images/Folds-Fence.png";
import tabsFenceImage from "./images/Tabs-Fence.png";
import foldsDoorImage from "./images/Folds-Door.png";
import tabsDoorImage from "./images/Tabs-Door.png";
import foldsTrapdoorImage from "./images/Folds-Trapdoor.png";
import tabsTrapdoorImage from "./images/Tabs-Trapdoor.png";
import foldsSnowTopImage from "./images/Folds-Snow-Top.png";
import foldsSnowBottomImage from "./images/Folds-Snow-Bottom.png";
import tabsSnowTopImage from "./images/Tabs-Snow-Top.png";
import tabsSnowMiddleImage from "./images/Tabs-Snow-Middle.png";
import tabsSnowBottomImage from "./images/Tabs-Snow-Bottom.png";
import foldsCakeLeftImage from "./images/Folds-Cake-Left.png";
import foldsCakeMiddleImage from "./images/Folds-Cake-Middle.png";
import foldsCakeRightImage from "./images/Folds-Cake-Right.png";
import tabsCakeLeftImage from "./images/Tabs-Cake-Left.png";
import tabsCakeMiddleImage from "./images/Tabs-Cake-Middle.png";
import tabsCakeCornerImage from "./images/Tabs-Cake-Corner.png";
import tabsCakeRightImage from "./images/Tabs-Cake-Right.png";

const id = "minecraft-block";

const name = "Minecraft Block";

const history: HistoryDef = [
  "Dec 2021 lostminer - Block generator rewrite.",
  "Dec 2021 NinjolasNJM - Add Stairs, Fence, Door, Trapdoor and Snow.",
  "Jan 2022 NinjolasNJM - Add Cake Block type.",
];

const thumbnail: ThumbnailDef = {
  url: thumnbailImage.src,
};

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Title", url: titleImage.src },
  { id: "Folds-Block", url: foldsBlockImage.src },
  { id: "Tabs-Block", url: tabsBlockImage.src },
  { id: "Folds-Slab", url: foldsSlabImage.src },
  { id: "Tabs-Slab", url: tabsSlabImage.src },
  { id: "Folds-Stair", url: foldsStairImage.src },
  { id: "Tabs-Stair", url: tabsStairImage.src },
  { id: "Folds-Fence", url: foldsFenceImage.src },
  { id: "Tabs-Fence", url: tabsFenceImage.src },
  { id: "Folds-Door", url: foldsDoorImage.src },
  { id: "Tabs-Door", url: tabsDoorImage.src },
  { id: "Folds-Trapdoor", url: foldsTrapdoorImage.src },
  { id: "Tabs-Trapdoor", url: tabsTrapdoorImage.src },
  { id: "Folds-Snow-Top", url: foldsSnowTopImage.src },
  { id: "Folds-Snow-Bottom", url: foldsSnowBottomImage.src },
  { id: "Tabs-Snow-Top", url: tabsSnowTopImage.src },
  { id: "Tabs-Snow-Middle", url: tabsSnowMiddleImage.src },
  { id: "Tabs-Snow-Bottom", url: tabsSnowBottomImage.src },
  { id: "Folds-Cake-Left", url: foldsCakeLeftImage.src },
  { id: "Folds-Cake-Middle", url: foldsCakeMiddleImage.src },
  { id: "Folds-Cake-Right", url: foldsCakeRightImage.src },
  { id: "Tabs-Cake-Left", url: tabsCakeLeftImage.src },
  { id: "Tabs-Cake-Middle", url: tabsCakeMiddleImage.src },
  { id: "Tabs-Cake-Corner", url: tabsCakeCornerImage.src },
  { id: "Tabs-Cake-Right", url: tabsCakeRightImage.src },
];

const textures: TextureDef[] = textureDefs;

const script: ScriptDef = (generator: Generator) => {
  generator.defineSelectInput("Version", textureVersionIds);

  const versionId = generator.getSelectInputValue("Version");

  generator.defineCustomStringInput(currentBlockTextureId, (onChange) => {
    if (!versionId) {
      return null;
    }
    return (
      <TexturePicker
        versionId={versionId}
        onSelect={(selectedTexture) => {
          onChange(encodeSelectedTexture(selectedTexture));
        }}
      />
    );
  });

  generator.defineSelectInput("Number of Blocks", ["1", "2"]);

  const numberOfBlocksInput = generator.getSelectInputValue("Number of Blocks");

  const numberOfBlocks = numberOfBlocksInput
    ? parseInt(numberOfBlocksInput, 10)
    : 1;

  generator.defineBooleanInput("Show Folds", true);

  const showFolds = generator.getBooleanInputValue("Show Folds") ?? false;

  generator.drawImage("Background", [0, 0]);

  for (let i = 1; i <= numberOfBlocks; i++) {
    const blockId = i.toString();

    const typeName = `Block ${blockId} Type`;

    generator.defineSelectInput(typeName, [
      "Block",
      "Slab",
      "Stair",
      "Fence",
      "Door",
      "Trapdoor",
      "Snow Layers",
      "Cake",
    ]);

    const blockType = generator.getSelectInputValue(typeName);

    const ox = 57;
    const oy = 16 + 400 * (i - 1);

    switch (blockType) {
      case "Block": {
        drawBlock(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Slab": {
        drawSlab(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Stair": {
        drawStair(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Fence": {
        drawFence(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Door": {
        drawDoor(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Trapdoor": {
        drawTrapdoor(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Snow Layers": {
        drawSnow(generator, blockId, ox, oy, showFolds);
        break;
      }
      case "Cake": {
        drawCake(generator, blockId, ox, oy, showFolds);
        break;
      }
    }
  }

  generator.defineButtonInput("Clear", () => {
    const currentTextureChoice = generator.getStringInputValue(
      currentBlockTextureId
    );

    generator.clearAllVariables();

    if (currentTextureChoice) {
      generator.setStringInputValue(
        currentBlockTextureId,
        currentTextureChoice
      );
    }
  });

  generator.drawImage("Title", [0, 0]);
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video: null,
  instructions: null,
  images,
  textures,
  script,
};
