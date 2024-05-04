"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import {
  Position,
  Rectangle,
  type Generator,
} from "@genroot/builder/modules/generator";
import {
  type Layer,
  steve,
  alex,
  Dimensions,
} from "../_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import foregroundImage from "./images/Foreground.png";
import titleImage from "./images/Title.png";
import steveSkin from "./textures/SkinSteve64x64.png";
import alexSkin from "./textures/SkinAlex64x64.png";

const id = "minecraft-character-mini";

const name = "Minecraft Character Mini";

const history: HistoryDef = [
  "13 Sep 2015 Sandvich - First release using the generator builder.",
  "17 Sep 2020 NinjolasNJM - Added support for Alex skins and fixed bottom of legs.",
  "11 Feb 2022 LostMiner - Refactor. Add pixelate option.",
  "03 Jun 2022 NinjolasNJM - Overhauled the foreground, added a title and an opaque background, a folds toggle, and overlay region inputs",
  "02 Feb 2024 NinjolasNJM - added skin input",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  {
    id: "Foreground",
    url: foregroundImage.src,
  },
  {
    id: "Title",
    url: titleImage.src,
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

  function drawFoldLineRectangle(rectangle: Rectangle) {
    const [x, y, w, h] = rectangle;

    generator.drawFoldLine([x, y - 1], [x + w, y - 1]);
    generator.drawFoldLine([x + w, y], [x + w, y + h]);
    generator.drawFoldLine([x + w, y + h + 1], [x, y + h + 1]);
    generator.drawFoldLine([x, y + h], [x, y]);
  }

  function drawFoldLineCuboid(
    position: Position,
    dimensions: Dimensions,
    leftSide: boolean = false
  ): void {
    const [x, y] = position;
    const [w, h, l] = dimensions;

    if (!leftSide) {
      drawFoldLineRectangle([x + l, y, w, l * 2 + h]);
      drawFoldLineRectangle([x, y + l, l * 2 + w * 2, h]);
      generator.drawFoldLine(
        [x + l * 2 + w - 1, y + l],
        [x + l * 2 + w - 1, y + l + h]
      );
    } else {
      drawFoldLineRectangle([x + l + w, y, w, l * 2 + h]);
      drawFoldLineRectangle([x, y + l, l * 2 + w * 2, h]);
      generator.drawFoldLine([x + w, y + l], [x + w, y + l + h]);
    }
  }

  function drawFolds([x, y]: Position): void {
    generator.fillRectangle([x + 49, y + 90, 64, 64], "#ffffff80");
    generator.fillRectangle([x + 177, y + 90, 64, 64], "#ffffff80");

    drawFoldLineCuboid([x + 49, y + 26], [64, 128, 64]);
    generator.drawFoldLine([x + 49, y + 25], [x + 241, y + 25]);

    drawFoldLineRectangle([x + 1, y + 10, 48, 64]);
    generator.drawFoldLine([x + 1, y + 41], [x + 49, y + 41]);
    generator.drawFoldLine([x + 48, y + 74], [x + 48, y + 90]);
    generator.drawLine([x + 49, y + 26], [x + 49, y + 42], {
      color: "#ff0000",
    });

    drawFoldLineRectangle([x + 241, y + 10, 48, 64]);
    generator.drawFoldLine([x + 241, y + 41], [x + 290, y + 41]);
    generator.drawFoldLine([x + 241, y + 74], [x + 241, y + 90]);
    generator.drawLine([x + 240, y + 26], [x + 240, y + 42], {
      color: "#ff0000",
    });

    generator.drawLine([x + 49, y + 89], [x + 113, y + 89], {
      color: "#ff0000",
    });
    generator.drawLine([x + 177, y + 89], [x + 241, y + 89], {
      color: "#ff0000",
    });
  }

  const drawMini = (textureId: string, x: number, y: number) => {
    generator.defineTextureInput(textureId, {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Steve", "Alex"],
      enableMinecraftSkinInput: true,
    });

    if (generator.hasTexture(textureId)) {
      const modelTypeName = textureId + " Model";

      generator.defineSelectInput(modelTypeName, ["Steve", "Alex"]);

      const modelType = generator.getSelectInputValue(modelTypeName);

      const showFolds = generator.defineAndGetBooleanInput(
        "Show " + textureId + " Folds",
        true
      );

      const showHeadOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Head Overlay",
        true
      );
      const showBodyOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Body Overlay",
        true
      );
      const showLeftArmOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Left Arm Overlay",
        true
      );
      const showRightArmOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Right Arm Overlay",
        true
      );
      const showLeftLegOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Left Leg Overlay",
        true
      );
      const showRightLegOverlay = generator.getBooleanInputValueWithDefault(
        textureId + " Right Leg Overlay",
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
      let ox: number;
      let oy: number;

      // Head

      ox = x + 49;
      oy = y + 90;

      drawHead(textureId, steve.base, ox, oy);

      if (showHeadOverlay) {
        drawHead(textureId, steve.overlay, ox, oy);
      }
      generator.defineRegionInput([ox, oy - 64, 192, 128], () => {
        generator.setBooleanInputValue(
          textureId + " Head Overlay",
          !showHeadOverlay
        );
      });

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
      generator.defineRegionInput([ox, oy, 256, bodyHeight], () => {
        generator.setBooleanInputValue(
          textureId + " Body Overlay",
          !showBodyOverlay
        );
      });

      // Arms

      const armTexture = isAlexModel ? alex : steve;

      // Right Arm

      ox = x + 9;
      oy = y + 2;

      drawRightArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showRightArmOverlay) {
        drawRightArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }
      generator.defineRegionInput([ox - 8, oy + 8, 48, 64], () => {
        generator.setBooleanInputValue(
          textureId + " Right Arm Overlay",
          !showRightArmOverlay
        );
      });

      // Left Arm

      ox = x + 249;
      oy = y + 2;

      drawLeftArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showLeftArmOverlay) {
        drawLeftArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }
      generator.defineRegionInput([ox - 8, oy + 8, 48, 64], () => {
        generator.setBooleanInputValue(
          textureId + " Left Arm Overlay",
          !showLeftArmOverlay
        );
      });

      // Legs

      ox = x + 49;
      oy = y + 154;

      // Right Leg

      drawRightLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showRightLegOverlay) {
        drawRightLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }
      generator.defineRegionInput(
        [ox, oy + bodyHeight, 96, 128 - bodyHeight],
        () => {
          generator.setBooleanInputValue(
            textureId + " Right Leg Overlay",
            !showRightLegOverlay
          );
        }
      );

      // Left Leg

      drawLeftLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showLeftLegOverlay) {
        drawLeftLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }
      generator.defineRegionInput(
        [ox + 96, oy + bodyHeight, 160, 128 - bodyHeight],
        () => {
          generator.setBooleanInputValue(
            textureId + " Left Leg Overlay",
            !showLeftLegOverlay
          );
        }
      );

      // Draw the fold and cut lines
      generator.drawImage("Foreground", [x, y]);
      if (showFolds) {
        drawFolds([x, y]);
      }
    }
  };

  drawMini("Mini 1", 121, 108);
  drawMini("Mini 2", 121, 453);

  generator.drawImage("Title", [0, 0]);
  generator.fillBackgroundColorWithWhite();
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
