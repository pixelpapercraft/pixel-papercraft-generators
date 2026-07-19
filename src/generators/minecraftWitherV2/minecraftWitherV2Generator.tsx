"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type Texture,
  type TextureDef,
} from "@genroot/builder/v2";

import witherTexture from "./instructions/wither.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";

const id = "minecraft-wither-v2";

const name = "Minecraft Wither";

const history: HistoryDef = ["01 Aug 2021 Hannibanni - Created."];

const instructions: InstructionsDef = `
## TODO

* Add a thumbnail image.
* Make background the A4 page tempate with Pixel Papercraft footer.

## How to use the Wither generator

### Option 1: Use an existing Wither skin

* Select one of the Wither skins from the generator.
* Download and print your Wither papercraft.

### Option 2: Create your own texture

* Download a sample Wither texture (right click and save):
  ![Wither Texture](${witherTexture.src})
* Edit this texture in your favourite graphics program.
* Select this file in the generator.
* Download and print your Wither papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
];

const witherSkinId = "Wither Skin";

const textures: TextureDef[] = [
  {
    id: "Minecraft Wither",
    url: witherTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: witherSkinId,
    url: witherTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const choices = ["Minecraft Wither"];

const render = (ctx: RenderContext): void => {
  // Draw the Background image

  ctx.drawImage("Background", [0, 0]);
  // Main Head

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 110, y: 90, w: 64, h: 64 }
  ); //Front Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 174, y: 90, w: 64, h: 64 }
  ); //Right Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 238, y: 90, w: 64, h: 64 }
  ); //Back Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 46, y: 90, w: 64, h: 64 }
  ); //Left Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 110, y: 26, w: 64, h: 64 }
  ); //Top Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 110, y: 154, w: 64, h: 64 }
  ); //Down Head

  // Side Head Left

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 38, y: 6, w: 6, h: 6 },
    { x: 477, y: 76, w: 48, h: 48 }
  ); //Front Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 6, w: 6, h: 4 },
    { x: 525, y: 76, w: 48, h: 32 }
  ); //Right Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 10, w: 3, h: 2 },
    { x: 525, y: 108, w: 32, h: 16 }
  ); //Right Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 32, y: 6, w: 6, h: 6 },
    { x: 429, y: 76, w: 48, h: 48 }
  ); //Left Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 50, y: 6, w: 6, h: 4 },
    { x: 381, y: 76, w: 48, h: 32 }
  ); //Back Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 53, y: 10, w: 3, h: 2 },
    { x: 397, y: 108, w: 32, h: 16 }
  ); //Back Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 38, y: 0, w: 6, h: 6 },
    { x: 477, y: 28, w: 48, h: 48 }
  ); //Top Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 0, w: 6, h: 4 },
    { x: 477, y: 124, w: 48, h: 32 }
  ); //Down Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 4, w: 3, h: 2 },
    { x: 477, y: 156, w: 24, h: 16 }
  ); //Down Head 2

  //Side Head Right

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 38, y: 0, w: 6, h: 6 },
    { x: 431, y: 333, w: 48, h: 48 }
  ); //Top Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 6, w: 6, h: 4 },
    { x: 527, y: 381, w: 32, h: 48 }
  ); //Right Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 10, w: 3, h: 2 },
    { x: 559, y: 381, w: 16, h: 32 }
  ); //Right Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 38, y: 6, w: 6, h: 6 },
    { x: 431, y: 381, w: 48, h: 48 }
  ); //Front Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 50, y: 6, w: 6, h: 4 },
    { x: 399, y: 381, w: 32, h: 48 }
  ); //Left Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 38, y: 0, w: 6, h: 6 },
    { x: 477, y: 28, w: 48, h: 48 }
  ); //Down Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 0, w: 6, h: 4 },
    { x: 477, y: 124, w: 48, h: 32 }
  ); //Left Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 4, w: 4, h: 6 },
    { x: 383, y: 381, w: 16, h: 32 }
  ); //Back Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 4, w: 4, h: 6 },
    { x: 383, y: 381, w: 16, h: 32 }
  ); //Back Head 2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 6, w: 6, h: 6 },
    { x: 479, y: 381, w: 48, h: 48 }
  ); // Left Head
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 47, y: 4, w: 3, h: 2 },
    { x: 455, y: 461, w: 24, h: 16 }
  ); //Down Head2
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 44, y: 0, w: 6, h: 4 },
    { x: 431, y: 429, w: 48, h: 32 }
  ); //Down Head 1
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 32, y: 6, w: 6, h: 4 },
    { x: 383, y: 381, w: 48, h: 32 }
  );
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 34, y: 10, w: 4, h: 2 },
    { x: 399, y: 413, w: 32, h: 16 }
  );
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 50, y: 6, w: 6, h: 4 },
    { x: 527, y: 381, w: 48, h: 32 }
  );
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 50, y: 10, w: 3, h: 2 },
    { x: 527, y: 413, w: 32, h: 16 }
  );

  // Body

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 3, y: 25, w: 3, h: 10 },
    { x: 397, y: 177, w: 24, h: 80 },
    { rotateLegacy: 90.0 }
  ); //Front Body
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 0, y: 25, w: 3, h: 10 },
    { x: 397, y: 153, w: 24, h: 80 },
    { rotateLegacy: 90.0 }
  ); //Left Body
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 6, y: 25, w: 3, h: 10 },
    { x: 397, y: 201, w: 24, h: 80 },
    { rotateLegacy: 90.0 }
  ); //Right Body
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 9, y: 25, w: 3, h: 10 },
    { x: 397, y: 225, w: 24, h: 80 },
    { rotateLegacy: 90.0 }
  ); //Back Body
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 3, y: 22, w: 3, h: 3 },
    { x: 293, y: 177, w: 24, h: 24 }
  ); //Down Body
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 3, y: 22, w: 3, h: 3 },
    { x: 397, y: 177, w: 24, h: 24 }
  ); //Top Body

  // Sides Left

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 160, y: 359, w: 32, h: 16 }
  ); //Frnot Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 160, y: 375, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 22, w: 4, h: 2 },
    { x: 160, y: 343, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 240, y: 375, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 144, y: 359, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 192, y: 359, w: 16, h: 16 }
  ); //Right Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 160, y: 424, w: 32, h: 16 }
  ); //Frnot Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 160, y: 440, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 22, w: 4, h: 2 },
    { x: 160, y: 408, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 240, y: 440, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 144, y: 424, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 192, y: 424, w: 16, h: 16 }
  ); //Right Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 160, y: 493, w: 32, h: 16 }
  ); //Frnot Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 160, y: 509, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 22, w: 4, h: 2 },
    { x: 160, y: 478, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 240, y: 509, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 144, y: 493, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 24, y: 24, w: 2, h: 2 },
    { x: 192, y: 493, w: 16, h: 16 }
  ); //Right Side
  //Sides Rigt
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 358, w: 32, h: 16 }
  ); //Front Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 319, y: 373, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 342, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 303, y: 374, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 303, y: 358, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 351, y: 358, w: 16, h: 16 }
  ); //Right Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 426, w: 32, h: 16 }
  ); //Front Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 319, y: 441, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 410, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 303, y: 442, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 303, y: 426, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 351, y: 426, w: 16, h: 16 }
  ); //Right Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 497, w: 32, h: 16 }
  ); //Front Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 37, y: 22, w: 4, h: 2 },
    { x: 319, y: 512, w: 32, h: 16 }
  ); //Down Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 319, y: 481, w: 32, h: 16 }
  ); //Top Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 4, h: 2 },
    { x: 303, y: 513, w: 32, h: 16 },
    { rotateLegacy: 180.0 }
  ); //Back Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 303, y: 497, w: 16, h: 16 }
  ); //Left Side
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 24, w: 2, h: 2 },
    { x: 351, y: 497, w: 16, h: 16 }
  ); //Right Side

  // Neck

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 3, y: 19, w: 20, h: 3 },
    { x: 46, y: 277, w: 160, h: 24 }
  ); //Front Neck
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 3, y: 16, w: 20, h: 3 },
    { x: 46, y: 253, w: 160, h: 24 }
  ); //Top Neck
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 23, y: 16, w: 20, h: 3 },
    { x: 46, y: 301, w: 160, h: 24 }
  ); //Down Neck
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 26, y: 19, w: 20, h: 3 },
    { x: 230, y: 277, w: 160, h: 24 }
  ); //Back Neck
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 0, y: 19, w: 3, h: 3 },
    { x: 206, y: 277, w: 24, h: 24 }
  ); //Right Neck
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 23, y: 19, w: 3, h: 3 },
    { x: 22, y: 277, w: 24, h: 24 }
  ); //Left Neck

  // Tail

  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 15, y: 25, w: 3, h: 6 },
    { x: 49, y: 393, w: 24, h: 47 }
  ); //Front Tail
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 21, y: 25, w: 3, h: 6 },
    { x: 97, y: 404, w: 24, h: 36 }
  ); //Back Tail
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 18, y: 25, w: 3, h: 6 },
    { x: 25, y: 391, w: 24, h: 49 }
  ); //Left Tail
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 18, y: 25, w: 3, h: 6 },
    { x: 73, y: 391, w: 24, h: 49 }
  ); //Right Tail
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 18, y: 25, w: 3, h: 6 },
    { x: 49, y: 368, w: 24, h: 25 }
  ); //Top Tail
  ctx.drawTextureLegacy(
    witherSkinId,
    { x: 18, y: 25, w: 3, h: 6 },
    { x: 49, y: 440, w: 24, h: 24 }
  ); //Down Tail

  ctx.drawImage("Folds", [0, 0]);
};

const generatorV2: GeneratorV2<Record<string, never>> = {
  id,
  name,
  images,
  textures: [],
  render,
};

function Component(): JSX.Element {
  const [witherSkin, setWitherSkin] = React.useState<Texture | null>(null);
  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (witherSkin) {
      map.set(witherSkinId, witherSkin);
    }
    return map;
  }, [witherSkin]);

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={null} />
      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.LoadedTextureControl
              id={witherSkinId}
              definitions={textures}
              choices={choices}
              standardWidth={64}
              standardHeight={64}
              initialTextureId={witherSkinId}
              onChange={setWitherSkin}
            />
          </div>
          <GeneratorUI.Instructions markdown={instructions} />
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={generatorV2}
            props={{}}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>
      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail: null,
  Component,
};
