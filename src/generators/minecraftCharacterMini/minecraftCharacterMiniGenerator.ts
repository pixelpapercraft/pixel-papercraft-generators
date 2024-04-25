"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { type Layer, steve, alex } from "../_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import skinOverlayImage from "./images/skin-overlay.png";
import skinBackgroundImage from "./images/skin-background.png";
import steveSkin from "./textures/SkinSteve64x64.png";
import alexSkin from "./textures/SkinAlex64x64.png";

const id = "minecraft-character-mini";

const name = "Minecraft Character Mini";

const history: HistoryDef = [
  "13 Sep 2015 Sandvich - First release using the generator builder.",
  "17 Sep 2020 NinjolasNJM - Added support for Alex skins and fixed bottom of legs.",
  "11 Feb 2022 LostMiner - Refactor. Add pixelate option.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  {
    id: "Skin Overlay",
    url: skinOverlayImage.src,
  },
  {
    id: "Skin Background",
    url: skinBackgroundImage.src,
  },
];

const textures: TextureDef[] = [
  // Default texture for "Mini 1"
  {
    id: "Mini 1",
    url: steveSkin.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  // Steve texture choice
  {
    id: "Steve",
    url: steveSkin.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  // Alex texture choice
  {
    id: "Alex",
    url: alexSkin.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const drawHead = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number
  ) => {
    generator.drawTexture(textureId, layer.head.right, [ox, oy, 64, 64]);
    generator.drawTexture(textureId, layer.head.front, [ox + 64, oy, 64, 64]);
    generator.drawTexture(textureId, layer.head.left, [ox + 128, oy, 64, 64]);
    generator.drawTexture(textureId, layer.head.back, [ox + 192, oy, 64, 64]);
    generator.drawTexture(textureId, layer.head.top, [
      ox + 64,
      oy - 64,
      64,
      64,
    ]);
  };

  const drawHeadFlaps = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number
  ) => {
    generator.drawTexture(textureId, layer.head.right, [ox, oy, 64, 64], {
      rotate: 90.0,
    });
    generator.drawTexture(textureId, layer.head.left, [ox + 128, oy, 64, 64], {
      rotate: -90.0,
    });
  };

  const drawBody = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    generator.drawTexture(
      textureId,
      layer.body.right,
      [ox, oy, 64, bodyHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.body.front,
      [ox + 64, oy, 64, bodyHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.body.left,
      [ox + 128, oy, 64, bodyHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.body.back,
      [ox + 192, oy, 64, bodyHeight],
      { pixelate }
    );
  };

  const drawRightArm = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    pixelate: boolean
  ) => {
    generator.drawTexture(textureId, layer.rightArm.left, [ox, oy, 32, 48], {
      rotate: 90.0,
      pixelate,
    });
    generator.drawTexture(
      textureId,
      layer.rightArm.right,
      [ox, oy + 32, 32, 48],
      { rotate: 90.0, pixelate }
    );
  };

  const drawLeftArm = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    pixelate: boolean
  ) => {
    generator.drawTexture(textureId, layer.leftArm.right, [ox, oy, 32, 48], {
      rotate: -90.0,
      pixelate,
    });
    generator.drawTexture(
      textureId,
      layer.leftArm.left,
      [ox, oy + 32, 32, 48],
      { rotate: -90.0, pixelate }
    );
  };

  const drawRightLeg = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    const legHeight = 64 - bodyHeight;
    generator.drawTexture(
      textureId,
      layer.rightLeg.front,
      [ox + 64, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.rightLeg.right,
      [ox, oy + bodyHeight, 64, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.rightLeg.back,
      [ox + 224, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.rightLeg.bottom,
      [ox + 64, oy + 64, 32, 64],
      { flip: "Vertical", pixelate }
    );
  };

  const drawLeftLeg = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    const legHeight = 64 - bodyHeight;
    generator.drawTexture(
      textureId,
      layer.leftLeg.front,
      [ox + 96, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.leftLeg.left,
      [ox + 128, oy + bodyHeight, 64, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.leftLeg.back,
      [ox + 192, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    generator.drawTexture(
      textureId,
      layer.leftLeg.bottom,
      [ox + 96, oy + 64, 32, 64],
      { flip: "Vertical", pixelate }
    );
  };

  const drawMini = (textureId: string, x: number, y: number) => {
    generator.defineTextureInput(textureId, {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Steve", "Alex"],
      enableMinecraftSkinInput: true,
    });

    if (generator.hasTexture(textureId)) {
      const modelTypeName = textureId + " Model Type";

      generator.defineSelectInput(modelTypeName, ["Steve", "Alex"]);

      const modelType = generator.getSelectInputValue(modelTypeName);

      const showHeadOverlay = generator.defineAndGetBooleanInput(
        textureId + " Head Overlay",
        true
      );

      const showBodyOverlay = generator.defineAndGetBooleanInput(
        textureId + " Body Overlay",
        true
      );

      const showArmOverlay = generator.defineAndGetBooleanInput(
        textureId + " Arm Overlay",
        true
      );

      const showLegOverlay = generator.defineAndGetBooleanInput(
        textureId + " Leg Overlay",
        true
      );

      const bodyHeight = generator.defineAndGetRangeInput(
        textureId + " Body Height",
        { min: 0, max: 64, value: 32, step: 1 }
      );

      const textureStyle = generator.defineAndGetSelectInput(
        textureId + " Texture Style",
        ["Simple", "Detailed"]
      );

      const isAlexModel = modelType === "Alex";
      const pixelate = textureStyle === "Simple";

      // Skin Background

      generator.drawImage("Skin Background", [x, y]);

      let ox: number;
      let oy: number;

      // Head

      ox = x + 49;
      oy = y + 90;

      drawHead(textureId, steve.base, ox, oy);

      if (showHeadOverlay) {
        drawHead(textureId, steve.overlay, ox, oy);
      }

      // Head Flaps

      ox = x + 49;
      oy = y + 26;

      drawHeadFlaps(textureId, steve.base, ox, oy);

      if (showHeadOverlay) {
        drawHeadFlaps(textureId, steve.overlay, ox, oy);
      }

      // Body

      ox = x + 49;
      oy = y + 154;

      drawBody(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showBodyOverlay) {
        drawBody(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }

      // Arms

      const armTexture = isAlexModel ? alex : steve;

      // Right Arm

      ox = x + 9;
      oy = y + 2;

      drawRightArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showArmOverlay) {
        drawRightArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }

      // Left Arm

      ox = x + 249;
      oy = y + 2;

      drawLeftArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showArmOverlay) {
        drawLeftArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }

      // Legs

      ox = x + 49;
      oy = y + 154;

      // Right Leg

      drawRightLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showLegOverlay) {
        drawRightLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }

      // Left Leg

      drawLeftLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showLegOverlay) {
        drawLeftLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }

      // Draw the fold and cut lines

      generator.drawImage("Skin Overlay", [x, y]);
    }
  };

  drawMini("Mini 1", 151, 108);
  drawMini("Mini 2", 151, 453);
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
