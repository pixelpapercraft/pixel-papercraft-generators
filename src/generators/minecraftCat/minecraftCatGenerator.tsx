"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type HistoryDef,
  type ImageDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type DynamicTextures,
} from "@genroot/builder";
import { TintSelector } from "@genroot/generators/_common/tintSelector/tintSelector";
import { catTintChoiceGroups } from "@genroot/generators/_common/tintSelector/tints";

import thumbnailImage from "./thumbnail/thumbnail-v2-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import ocelotImage from "./textures/ocelot.png";
import allBlackImage from "./textures/all_black.png";
import britishShorthairImage from "./textures/british_shorthair.png";
import calicoImage from "./textures/calico.png";
import jellieImage from "./textures/jellie.png";
import redImage from "./textures/red.png";
import persianImage from "./textures/persian.png";
import ragdollImage from "./textures/ragdoll.png";
import siameseImage from "./textures/siamese.png";
import tabbyImage from "./textures/tabby.png";
import blackImage from "./textures/black.png";
import catCollarImage from "./textures/cat_collar.png";
import whiteImage from "./textures/white.png";

const id = "minecraft-cat";

const name = "Minecraft Cat";

const history: HistoryDef = [
  "Originally created by Micaias32.",
  "15 Mar 2021 Micaias32 - All cats of 1.14.",
  "03 Feb 2022 NinjolasNJM - Converted to new generator builder, with updated backgrounds, folds and labels, as well as improved texture mappping and collar handling.",
  "06 Aug 2022 M16 - Update thumbnail photo.",
  "16 May 2026 NinjolasNJM - Changed to use new tint input.",
  "Jul 2026 lostminer - Layout refresh.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const instructions = `
## How to use the Minecraft Cat Generator?

### Option 1: Use a texture pack or mod Cat skin

* Download your favourite texture pack or mod.
* Find a cat texture file.
* Select this file in the generator.
* Download and print your new Cat papercraft.

## Option 2: Create your own Cat texture file

* Download a sample Cat texture (right click and save):
  ![Car Texture](${whiteImage.src})
* Edit this texture in your favourite graphics program.
* Select this file in the generator.
* Download and print your new Cat papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  // "Cat" texture is the default texture to show when the generator loads
  {
    id: "Cat",
    url: ocelotImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Black",
    url: allBlackImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "British Shorthair",
    url: britishShorthairImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Calico",
    url: calicoImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Jellie",
    url: jellieImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Ocelot",
    url: ocelotImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Orange Tabby",
    url: redImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Persian",
    url: persianImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Ragdoll",
    url: ragdollImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Siamese",
    url: siameseImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Tabby",
    url: tabbyImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Tuxedo",
    url: blackImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "White",
    url: whiteImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Cat Collar",
    url: catCollarImage.src,
    standardWidth: 64,
    standardHeight: 32,
  },
];

const catChoices = [
  "Black",
  "British Shorthair",
  "Calico",
  "Jellie",
  "Ocelot",
  "Orange Tabby",
  "Persian",
  "Ragdoll",
  "Siamese",
  "Tabby",
  "Tuxedo",
  "White",
];

const collarChoices = ["Cat Collar"];

type MinecraftCatProps = {
  collarColor: string;
  showFolds: boolean;
  showLabels: boolean;
};

const render = (
  ctx: RenderContext,
  { collarColor, showFolds, showLabels }: MinecraftCatProps
): void => {
  // Draw Cat

  const drawCat = (texture: string, tint: string) => {
    // Head

    ctx.drawTexture(texture, [0, 5, 20, 4], [40, 73, 160, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // all sides
    ctx.drawTexture(texture, [5, 0, 5, 5], [80, 33, 40, 40], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // Top
    ctx.drawTexture(texture, [10, 0, 5, 5], [80, 105, 40, 40], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // Bottom

    // Body

    ctx.drawTexture(texture, [20, 6, 6, 16], [40, 241, 48, 128], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // left
    ctx.drawTexture(texture, [26, 6, 4, 16], [88, 241, 32, 128], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // front
    ctx.drawTexture(texture, [30, 6, 6, 16], [120, 241, 48, 128], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // right
    ctx.drawTexture(texture, [36, 6, 4, 16], [168, 241, 32, 128], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // back
    ctx.drawTexture(texture, [26, 0, 4, 6], [88, 193, 32, 48], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [30, 0, 4, 6], [88, 369, 32, 48], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom
    // Back Left Leg
    ctx.drawTexture(texture, [8, 17, 8, 4], [251, 336, 64, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // leg1
    ctx.drawTexture(texture, [10, 13, 2, 2], [267, 320, 16, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [10, 13, 2, 2], [267, 368, 16, 16], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom
    // Back Right Leg
    ctx.drawTexture(texture, [8, 17, 8, 4], [340, 336, 64, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // leg1
    ctx.drawTexture(texture, [10, 13, 2, 2], [356, 320, 16, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [10, 13, 2, 2], [356, 368, 16, 16], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom

    // Front Left Leg

    ctx.drawTexture(texture, [40, 8, 8, 4], [251, 248, 64, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // leg (all sides)
    ctx.drawTexture(texture, [42, 0, 2, 2], [267, 232, 16, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [44, 0, 2, 2], [267, 280, 16, 16], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom
    // Front Right Leg
    ctx.drawTexture(texture, [40, 8, 8, 4], [340, 248, 64, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // leg (all sides)
    ctx.drawTexture(texture, [42, 0, 2, 2], [356, 232, 16, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [44, 0, 2, 2], [356, 280, 16, 16], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom

    // Tail

    // top

    ctx.drawTexture(texture, [2, 16, 1, 8], [469, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // right
    ctx.drawTexture(texture, [3, 16, 1, 8], [477, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // back
    ctx.drawTexture(texture, [0, 16, 1, 8], [485, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // left
    ctx.drawTexture(texture, [1, 16, 1, 8], [493, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // front
    ctx.drawTexture(texture, [2, 15, 1, 1], [477, 358, 8, 8], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom

    // bottom

    ctx.drawTexture(texture, [6, 16, 1, 8], [541, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // right
    ctx.drawTexture(texture, [7, 16, 1, 8], [549, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // back
    ctx.drawTexture(texture, [4, 16, 1, 8], [557, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // left
    ctx.drawTexture(texture, [5, 16, 1, 8], [565, 294, 8, 64], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // front
    ctx.drawTexture(texture, [6, 15, 1, 1], [549, 358, 8, 8], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom

    // Nose

    ctx.drawTexture(texture, [2, 26, 3, 2], [256, 80, 24, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // front
    ctx.drawTexture(texture, [2, 25, 3, 1], [256, 72, 24, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // top
    ctx.drawTexture(texture, [5, 26, 1, 2], [280, 80, 8, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // right
    ctx.drawTexture(texture, [1, 26, 1, 2], [248, 80, 8, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); // left
    ctx.drawTexture(texture, [5, 25, 3, 1], [256, 96, 24, 8], {
      flip: "Vertical",
      blend: { kind: "MultiplyHex", hex: tint },
    }); // bottom

    // Ears

    // left

    ctx.drawTexture(texture, [6, 12, 2, 1], [253, 161, 16, 8], {
      rotateLegacy: 90.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //left
    ctx.drawTexture(texture, [8, 12, 1, 1], [253, 177, 8, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); //front
    ctx.drawTexture(texture, [9, 12, 2, 1], [261, 177, 16, 8], {
      rotateLegacy: -90.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //right
    ctx.drawTexture(texture, [11, 12, 1, 1], [261, 161, 8, 8], {
      rotateLegacy: 180.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //back
    ctx.drawTexture(texture, [8, 10, 1, 2], [253, 161, 8, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); //top
    ctx.drawTexture(texture, [9, 10, 1, 2], [269, 161, 8, 16], {
      flip: "Horizontal",
      blend: { kind: "MultiplyHex", hex: tint },
    }); //bottom
    // right
    ctx.drawTexture(texture, [0, 12, 2, 1], [176, 161, 16, 8], {
      rotateLegacy: 90.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //left
    ctx.drawTexture(texture, [2, 12, 1, 1], [176, 177, 8, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); //front
    ctx.drawTexture(texture, [3, 12, 2, 1], [184, 177, 16, 8], {
      rotateLegacy: -90.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //right
    ctx.drawTexture(texture, [5, 12, 1, 1], [184, 161, 8, 8], {
      rotateLegacy: 180.0,
      blend: { kind: "MultiplyHex", hex: tint },
    }); //back
    ctx.drawTexture(texture, [2, 10, 1, 2], [176, 161, 8, 16], {
      blend: { kind: "MultiplyHex", hex: tint },
    }); //top
    ctx.drawTexture(texture, [3, 10, 1, 2], [192, 161, 8, 16], {
      flip: "Horizontal",
      blend: { kind: "MultiplyHex", hex: tint },
    }); //bottom
  };

  drawCat("Cat", "None"); // draw cat
  drawCat("Collar", collarColor); // draw collar

  // Background

  ctx.drawImage("Background", [0, 0]);

  //Fold Lines

  if (showFolds) {
    ctx.drawImage("Folds", [0, 0]);
  }

  // Labels

  if (showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftCatGenerator: Generator<MinecraftCatProps> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [collarColor, setCollarColor] = React.useState("#B02E26");
  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);
  const [catTexture, setCatTexture] = React.useState<Texture | null>(null);
  const [collarTexture, setCollarTexture] = React.useState<Texture | null>(
    null
  );
  const props: MinecraftCatProps = { collarColor, showFolds, showLabels };
  const dynamicTextures: DynamicTextures = {
    Cat: catTexture,
    Collar: collarTexture,
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="mb-8">
            <GeneratorUI.Instructions markdown={instructions} />
          </div>

          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              label="Cat"
              definitions={textures}
              choices={catChoices}
              standardWidth={64}
              standardHeight={32}
              initialTextureId="Cat"
              onChange={setCatTexture}
            />
            <GeneratorUI.LoadedTextureControl
              label="Collar"
              definitions={textures}
              choices={collarChoices}
              standardWidth={64}
              standardHeight={32}
              onChange={setCollarTexture}
            />
            <TintSelector
              value={collarColor}
              onChange={(hex) => setCollarColor(hex ?? "#B02E26")}
              label="Collar Color"
              choiceGroups={catTintChoiceGroups}
              includeNoTint={false}
            />
            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />
            <GeneratorUI.BooleanControl
              label="Show Labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftCatGenerator}
            props={props}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>
      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
