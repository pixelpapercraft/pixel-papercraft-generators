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
import overlayAllayImage from "./images/OverlayAllay.png";
import skin1Image from "./textures/Skin1.png";
import skin2Image from "./textures/Skin2.png";

const id = "minecraft-allay-character";

const name = "Minecraft Allay Character";

const history: HistoryDef = [
  "1 May 2022 PaperDoggy - Initial script developed.",
];

const video: VideoDef = {
  url: "https://www.youtube.com/embed/vG-mXWu0OlA?rel=0",
};

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [{ id: "Overlay", url: overlayAllayImage.src }];

const textures: TextureDef[] = [
  {
    id: "Skin1",
    url: skin1Image.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Skin2",
    url: skin2Image.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const drawHead = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, steve.base.head.front, [ox, oy, 50, 50]);
    generator.drawTexture(texture, steve.base.head.right, [
      ox - 51,
      oy,
      50,
      50,
    ]);
    generator.drawTexture(texture, steve.base.head.left, [ox + 51, oy, 50, 50]);
    generator.drawTexture(texture, steve.base.head.back, [
      ox + 51 * 2,
      oy,
      50,
      50,
    ]);
    generator.drawTexture(texture, steve.base.head.top, [ox, oy - 51, 50, 50]);
    generator.drawTexture(
      texture,
      steve.base.head.bottom,
      [ox, oy + 51, 50, 50],
      { flip: "Vertical" }
    );
    generator.drawTexture(texture, steve.overlay.head.front, [ox, oy, 50, 50]);
    generator.drawTexture(texture, steve.overlay.head.right, [
      ox - 51,
      oy,
      50,
      50,
    ]);
    generator.drawTexture(texture, steve.overlay.head.left, [
      ox + 51,
      oy,
      50,
      50,
    ]);
    generator.drawTexture(texture, steve.overlay.head.back, [
      ox + 51 * 2,
      oy,
      50,
      50,
    ]);
    generator.drawTexture(texture, steve.overlay.head.top, [
      ox,
      oy - 51,
      50,
      50,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.head.bottom,
      [ox, oy + 51, 50, 50],
      { flip: "Vertical" }
    );
  };

  const drawBody = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, steve.base.body.front, [ox, oy, 30, 30]);
    generator.drawTexture(texture, steve.base.body.right, [
      ox - 21,
      oy,
      20,
      30,
    ]);
    generator.drawTexture(texture, steve.base.body.left, [ox + 31, oy, 20, 30]);
    generator.drawTexture(texture, steve.base.body.back, [
      ox + 31 + 21,
      oy,
      30,
      30,
    ]);
    generator.drawTexture(texture, steve.base.body.top, [ox, oy - 21, 30, 20]);
    generator.drawTexture(
      texture,
      steve.base.body.front,
      [ox - 21 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.right,
      [ox - 21 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.left,
      [ox - 21 - 21 - 31 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.back,
      [ox - 21 - 21 - 31 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.top,
      [ox - 21 - 21 - 31, oy - 21, 30, 20],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.overlay.body.front, [ox, oy, 30, 30]);
    generator.drawTexture(texture, steve.overlay.body.right, [
      ox - 21,
      oy,
      20,
      30,
    ]);
    generator.drawTexture(texture, steve.overlay.body.left, [
      ox + 31,
      oy,
      20,
      30,
    ]);
    generator.drawTexture(texture, steve.overlay.body.back, [
      ox + 31 + 21,
      oy,
      30,
      30,
    ]);
    generator.drawTexture(texture, steve.overlay.body.top, [
      ox,
      oy - 21,
      30,
      20,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.body.front,
      [ox - 21 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.right,
      [ox - 21 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.left,
      [ox - 21 - 21 - 31 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.back,
      [ox - 21 - 21 - 31 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.top,
      [ox - 21 - 21 - 31, oy - 21, 30, 20],
      { flip: "Horizontal" }
    );
  };

  const drawRightArm = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, steve.base.rightArm.front, [ox, oy, 10, 40]);
    generator.drawTexture(texture, steve.base.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.base.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.base.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.base.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      steve.base.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.overlay.rightArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLeftArm = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, steve.base.leftArm.front, [ox, oy, 10, 40]);
    generator.drawTexture(texture, steve.base.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.base.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.base.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.base.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      steve.base.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.overlay.leftArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, steve.overlay.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawRightArmAlex = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, alex.base.rightArm.front, [ox, oy, 10, 40]);
    generator.drawTexture(texture, alex.base.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.base.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.base.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.base.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      alex.base.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, alex.overlay.rightArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      alex.overlay.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLeftArmAlex = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, alex.base.leftArm.front, [ox, oy, 10, 40]);
    generator.drawTexture(texture, alex.base.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.base.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.base.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.base.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      alex.base.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, alex.overlay.leftArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    generator.drawTexture(texture, alex.overlay.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    generator.drawTexture(
      texture,
      alex.overlay.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLegs = (ox: number, oy: number, texture: string) => {
    generator.drawTexture(texture, steve.base.body.front, [ox, oy, 30, 25]);
    generator.drawTexture(texture, steve.base.body.right, [
      ox - 21,
      oy,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.base.body.left, [ox + 31, oy, 20, 25]);
    generator.drawTexture(texture, steve.base.body.back, [
      ox + 31 + 21,
      oy,
      30,
      25,
    ]);
    generator.drawTexture(
      texture,
      steve.base.body.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.left,
      [ox + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.body.back,
      [ox + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.base.rightLeg.front, [
      ox,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.base.rightLeg.right, [
      ox - 21,
      oy + 25,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.base.rightLeg.back, [
      ox + 31 + 21 + 15,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.base.leftLeg.front, [
      ox + 15,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.base.leftLeg.left, [
      ox + 31,
      oy + 25,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.base.leftLeg.back, [
      ox + 31 + 21,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(
      texture,
      steve.base.rightLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.rightLeg.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.rightLeg.back,
      [ox + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.leftLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.leftLeg.left,
      [ox + 31 + 21 + 31 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.base.leftLeg.back,
      [ox + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.overlay.body.front, [ox, oy, 30, 25]);
    generator.drawTexture(texture, steve.overlay.body.right, [
      ox - 21,
      oy,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.body.left, [
      ox + 31,
      oy,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.body.back, [
      ox + 31 + 21,
      oy,
      30,
      25,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.body.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.left,
      [ox + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.body.back,
      [ox + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(texture, steve.overlay.rightLeg.front, [
      ox,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.rightLeg.right, [
      ox - 21,
      oy + 25,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.rightLeg.back, [
      ox + 31 + 21 + 15,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.leftLeg.front, [
      ox + 15,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.leftLeg.left, [
      ox + 31,
      oy + 25,
      20,
      25,
    ]);
    generator.drawTexture(texture, steve.overlay.leftLeg.back, [
      ox + 31 + 21,
      oy + 25,
      15,
      25,
    ]);
    generator.drawTexture(
      texture,
      steve.overlay.rightLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.rightLeg.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.rightLeg.back,
      [ox + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.leftLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.leftLeg.left,
      [ox + 31 + 21 + 31 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    generator.drawTexture(
      texture,
      steve.overlay.leftLeg.back,
      [ox + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
  };

  generator.defineSelectInput("Character 1 skin model type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin1", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
    enableMinecraftSkinInput: true,
  });

  const alexModel1 =
    generator.getSelectInputValue("Character 1 skin model type") === "Alex";

  generator.defineSelectInput("Character 2 skin model type", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin2", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
    enableMinecraftSkinInput: true,
  });

  const alexModel2 =
    generator.getSelectInputValue("Character 2 skin model type") === "Alex";

  // Skin 1

  drawHead(62, 63, "Skin1");
  drawBody(422, 84, "Skin1");

  if (alexModel1) {
    drawRightArmAlex(186, 198, "Skin1");
    drawLeftArmAlex(48, 198, "Skin1");
  } else {
    drawRightArm(186, 198, "Skin1");
    drawLeftArm(48, 198, "Skin1");
  }

  drawLegs(279, 197, "Skin1");

  // Skin 2

  drawHead(62, 424, "Skin2");
  drawBody(422, 445, "Skin2");

  if (alexModel2) {
    drawRightArmAlex(186, 198 + 361, "Skin2");
    drawLeftArmAlex(48, 198 + 361, "Skin2");
  } else {
    drawRightArm(186, 198 + 361, "Skin2");
    drawLeftArm(48, 198 + 361, "Skin2");
  }

  drawLegs(278, 559, "Skin2");

  generator.drawImage("Overlay", [0, 0]);
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
