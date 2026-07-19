"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  ThumbnailDef,
  TextureDef,
  ScriptDef,
  VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { steve, alex } from "@genroot/generators/_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import overlayBeeImage from "./images/OverlayBee.png";

import { getSkinUrl } from "../_common/skins";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

const id = "minecraft-bee-character-v1";

const name = "Minecraft Bee Character";

const video: VideoDef = {
  url: "https://www.youtube.com/embed/vG-mXWu0OlA?rel=0",
};

const history: HistoryDef = [
  "1 May 2022 PaperDoggy - Initial script developed.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [{ id: "OverlayBee", url: overlayBeeImage.src }];

const textures: TextureDef[] = [
  {
    id: "Skin 1",
    url: getSkinUrl("Default", "Wide"),
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Skin 2",
    url: getSkinUrl("Default", "Wide"),
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const drawing = {
    drawHead: (ox: number, oy: number, k: number, texture: string) => {
      generator.drawTexture(texture, steve.base.head.front, [ox, oy, 56, 56]);
      generator.drawTexture(texture, steve.base.head.right, [
        ox - k * 8 - 1,
        oy,
        k * 8,
        56,
      ]);
      generator.drawTexture(texture, steve.base.head.left, [
        ox + 57,
        oy,
        k * 8,
        56,
      ]);
      generator.drawTexture(texture, steve.base.head.top, [
        ox,
        oy - k * 8 - 1,
        56,
        k * 8,
      ]);
      generator.drawTexture(
        texture,
        steve.base.head.bottom,
        [ox, oy + 57, 56, k * 8],
        { flip: "Vertical" }
      );
      generator.drawTexture(texture, steve.overlay.head.front, [
        ox,
        oy,
        56,
        56,
      ]);
      generator.drawTexture(texture, steve.overlay.head.right, [
        ox - k * 8 - 1,
        oy,
        k * 8,
        56,
      ]);
      generator.drawTexture(texture, steve.overlay.head.left, [
        ox + 57,
        oy,
        k * 8,
        56,
      ]);
      generator.drawTexture(texture, steve.overlay.head.top, [
        ox,
        oy - k * 8 - 1,
        56,
        k * 8,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.head.bottom,
        [ox, oy + 57, 56, k * 8],
        { flip: "Vertical" }
      );
    },

    drawBody: (ox: number, oy: number, k: number, texture: string) => {
      generator.drawTexture(texture, steve.base.body.front, [
        ox,
        oy + 57 + k * 8,
        56,
        (10 - k) * 8,
      ]);
      generator.drawTexture(
        texture,
        steve.base.body.right,
        [ox - 1 - k * 8, oy, 56, (10 - k) * 8],
        { rotateLegacy: 90.0 }
      );
      generator.drawTexture(
        texture,
        steve.base.body.left,
        [ox + 57 + k * 8, oy + 56, 56, 8 * (10 - k)],
        { rotateLegacy: -90.0 }
      );
      generator.drawTexture(texture, steve.base.body.bottom, [
        ox + 57 + 81,
        oy,
        56,
        56,
      ]);
      generator.drawTexture(
        texture,
        steve.base.body.back,
        [ox, oy - 81, 56, (10 - k) * 8],
        { rotate: 180.0 }
      );
      generator.drawTexture(texture, steve.overlay.body.front, [
        ox,
        oy + 57 + k * 8,
        56,
        (10 - k) * 8,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.body.right,
        [ox - 1 - k * 8, oy, 56, (10 - k) * 8],
        { rotateLegacy: 90.0 }
      );
      generator.drawTexture(
        texture,
        steve.overlay.body.left,
        [ox + 57 + k * 8, oy + 56, 56, 8 * (10 - k)],
        { rotateLegacy: -90.0 }
      );
      generator.drawTexture(texture, steve.base.body.bottom, [
        ox + 57 + 81,
        oy,
        56,
        56,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.body.back,
        [ox, oy - 81, 56, (10 - k) * 8],
        { rotate: 180.0 }
      );
    },

    drawRightArm: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        steve.base.rightArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftArm: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        steve.base.leftArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.leftArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.leftArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.leftArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawRightArmAlex: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        alex.base.rightArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.base.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.overlay.rightArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.overlay.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftArmAlex: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, alex.base.leftArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      generator.drawTexture(
        texture,
        alex.base.leftArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.overlay.leftArm.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.overlay.leftArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawRightLeg: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        steve.base.rightLeg.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightLeg.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftLeg: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(
        texture,
        steve.base.rightLeg.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightLeg.front,
        [ox, oy, 8, 16],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawPlan: (ox: number, oy: number, k: number, texture: string) => {
      generator.drawTexture(texture, steve.base.head.front, [
        ox,
        oy - 32,
        32,
        32,
      ]);
      generator.drawTexture(texture, steve.base.body.front, [ox, oy, 32, 48]);
      generator.drawTexture(texture, steve.base.rightLeg.front, [
        ox,
        oy + 48,
        16,
        48,
      ]);
      generator.drawTexture(texture, steve.base.leftLeg.front, [
        ox + 16,
        oy + 48,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        steve.base.head.front,
        [ox - 36, oy + 131, 28, 28],
        { pixelate: true }
      );
      generator.drawTexture(texture, steve.base.head.left, [
        ox + 44,
        oy + 131,
        k * 4,
        28,
      ]);
      generator.drawTexture(
        texture,
        steve.base.body.left,
        [ox + 44 + k * 4, oy + 131 + 28, 28, (10 - k) * 4],
        { rotateLegacy: -90.0 }
      );
      generator.drawTexture(
        texture,
        steve.base.body.back,
        [ox + 5, oy + 174, 28, (10 - k) * 4],
        { rotate: -180.0 }
      );
      generator.drawTexture(texture, steve.base.head.top, [
        ox + 5,
        oy + 174 + (10 - k) * 4,
        28,
        k * 4,
      ]);
      generator.drawTexture(
        texture,
        steve.base.rightLeg.front,
        [ox - 33, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.leftLeg.front,
        [ox - 14, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(texture, steve.overlay.head.front, [
        ox,
        oy - 32,
        32,
        32,
      ]);
      generator.drawTexture(texture, steve.overlay.body.front, [
        ox,
        oy,
        32,
        48,
      ]);
      generator.drawTexture(texture, steve.overlay.rightLeg.front, [
        ox,
        oy + 48,
        16,
        48,
      ]);
      generator.drawTexture(texture, steve.overlay.leftLeg.front, [
        ox + 16,
        oy + 48,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.head.front,
        [ox - 36, oy + 131, 28, 28],
        { pixelate: true }
      );
      generator.drawTexture(texture, steve.overlay.head.left, [
        ox + 44,
        oy + 131,
        k * 4,
        28,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.body.left,
        [ox + 44 + k * 4, oy + 131 + 28, 28, (10 - k) * 4],
        { rotateLegacy: -90.0 }
      );
      generator.drawTexture(
        texture,
        steve.overlay.body.back,
        [ox + 5, oy + 174, 28, (10 - k) * 4],
        { rotate: -180.0 }
      );
      generator.drawTexture(texture, steve.overlay.head.top, [
        ox + 5,
        oy + 174 + (10 - k) * 4,
        28,
        k * 4,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.rightLeg.front,
        [ox - 33, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.leftLeg.front,
        [ox - 14, oy + 160, 3, 8],
        { pixelate: true }
      );
    },

    drawPlanArms: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, steve.base.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(texture, steve.base.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        steve.base.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.base.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(texture, steve.overlay.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(texture, steve.overlay.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        steve.overlay.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        steve.overlay.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
    },

    drawPlanArmsAlex: (ox: number, oy: number, texture: string) => {
      generator.drawTexture(texture, alex.base.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(texture, alex.base.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        alex.base.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.base.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(texture, alex.overlay.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(texture, alex.overlay.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      generator.drawTexture(
        texture,
        alex.overlay.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      generator.drawTexture(
        texture,
        alex.overlay.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
    },
  };
  generator.defineMinecraftSkinInput("Skin 1", {
    standardWidth: 64,
    standardHeight: 64,
    options: makeDefaultMinecraftSkinPresetOptions(),
    showModelType: true,
  });

  const isSlimModel1 =
    generator.getMinecraftSkinInputModelType("Skin 1") === "Slim";

  generator.defineRangeInput("Head Size 1", {
    min: 0,
    max: 10,
    step: 1,
    value: 0,
  });

  const headmultiplier1 = generator.getRangeInputValue("Head Size 1");
  generator.defineMinecraftSkinInput("Skin 2", {
    standardWidth: 64,
    standardHeight: 64,
    options: makeDefaultMinecraftSkinPresetOptions(),
    showModelType: true,
  });

  const isSlimModel2 =
    generator.getMinecraftSkinInputModelType("Skin 2") === "Slim";

  generator.defineRangeInput("Head Size 2", {
    min: 0,
    max: 10,
    step: 1,
    value: 0,
  });

  const headmultiplier2 = generator.getRangeInputValue("Head Size 2");

  generator.drawImage("OverlayBee", [0, 0]);

  const ox1 = 108;
  const oy1 = 103;

  drawing.drawHead(ox1, oy1, headmultiplier1, "Skin 1");
  drawing.drawBody(ox1, oy1, headmultiplier1, "Skin 1");

  if (isSlimModel1) {
    drawing.drawRightArmAlex(ox1 + 221, oy1 - 53, "Skin 1");
    drawing.drawLeftArmAlex(ox1 + 245, oy1 - 53, "Skin 1");
  } else {
    drawing.drawRightArm(ox1 + 221, oy1 - 53, "Skin 1");
    drawing.drawLeftArm(ox1 + 245, oy1 - 53, "Skin 1");
  }

  drawing.drawRightLeg(ox1 + 221, oy1 - 20, "Skin 1");
  drawing.drawLeftLeg(ox1 + 245, oy1 - 20, "Skin 1");
  drawing.drawRightLeg(ox1 + 221, oy1 + 12, "Skin 1");
  drawing.drawLeftLeg(ox1 + 245, oy1 + 12, "Skin 1");
  drawing.drawPlan(ox1 + 321, oy1 - 48, headmultiplier1, "Skin 1");

  if (isSlimModel1) {
    drawing.drawPlanArmsAlex(ox1 + 321, oy1 - 48, "Skin 1");
  } else {
    drawing.drawPlanArms(ox1 + 321, oy1 - 48, "Skin 1");
  }

  const ox2 = 108;
  const oy2 = 416;

  drawing.drawHead(ox2, oy2, headmultiplier2, "Skin 2");
  drawing.drawBody(ox2, oy2, headmultiplier2, "Skin 2");

  if (isSlimModel2) {
    drawing.drawRightArmAlex(ox2 + 221, oy2 - 53, "Skin 2");
    drawing.drawLeftArmAlex(ox2 + 245, oy2 - 53, "Skin 2");
  } else {
    drawing.drawRightArm(ox2 + 221, oy2 - 53, "Skin 2");
    drawing.drawLeftArm(ox2 + 245, oy2 - 53, "Skin 2");
  }

  drawing.drawRightLeg(ox2 + 221, oy2 - 20, "Skin 2");
  drawing.drawLeftLeg(ox2 + 245, oy2 - 20, "Skin 2");
  drawing.drawRightLeg(ox2 + 221, oy2 + 12, "Skin 2");
  drawing.drawLeftLeg(ox2 + 245, oy2 + 12, "Skin 2");
  drawing.drawPlan(ox2 + 321, oy2 - 48, headmultiplier2, "Skin 2");

  if (isSlimModel2) {
    drawing.drawPlanArmsAlex(ox2 + 321, oy2 - 48, "Skin 2");
  } else {
    drawing.drawPlanArms(ox2 + 321, oy2 - 48, "Skin 2");
  }

  generator.drawImage("OverlayBee", [0, 0]);
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
