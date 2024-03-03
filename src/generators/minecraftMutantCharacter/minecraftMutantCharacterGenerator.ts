"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import page1Image from "./images/Page1.png";
import page2Image from "./images/Page2.png";
import page3Image from "./images/Page3.png";
import page4Image from "./images/Page4.png";
import hole1Image from "./images/Hole1.png";
import hole2Image from "./images/Hole2.png";
import hole3Image from "./images/Hole3.png";
import skinTexture from "./textures/Skin.png";

const id = "minecraft-mutant-character";

const name = "Mutant Character";

const history: HistoryDef = ["Created by PaperDogChannel."];

const video: VideoDef = {
  url: "https://www.youtube.com/embed/DVzumgRinjY?rel=0",
};

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Page1", url: page1Image.src },
  { id: "Page2", url: page2Image.src },
  { id: "Page3", url: page3Image.src },
  { id: "Page4", url: page4Image.src },
  { id: "Hole1", url: hole1Image.src },
  { id: "Hole2", url: hole2Image.src },
  { id: "Hole3", url: hole3Image.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skinTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  generator.defineSelectInput("Skin style", ["Steve", "Alex"]);

  const alexModel = generator.getSelectInputValue("Skin style") === "Alex";

  generator.usePage("Page 1");
  generator.drawImage("Page1", [0, 0]);

  // Head

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 8, w: 8, h: 8 },
    { x: 260, y: 88, w: 84, h: 84 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 2, y: 88, w: 84, h: 84 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 8, w: 8, h: 8 },
    { x: 88, y: 88, w: 84, h: 84 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 8, w: 8, h: 8 },
    { x: 174, y: 88, w: 84, h: 84 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 2, y: 2, w: 84, h: 84 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 2, y: 174, w: 84, h: 84 },
    { flip: "Vertical" }
  ); // Bottom
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 8, w: 8, h: 8 },
    { x: 260, y: 88, w: 84, h: 84 }
  ); // Right
  generator.drawTextureLegacy(
    "Skin",
    { x: 40, y: 8, w: 8, h: 8 },
    { x: 2, y: 88, w: 84, h: 84 }
  ); // Face
  generator.drawTextureLegacy(
    "Skin",
    { x: 48, y: 8, w: 8, h: 8 },
    { x: 88, y: 88, w: 84, h: 84 }
  ); // Left
  generator.drawTextureLegacy(
    "Skin",
    { x: 56, y: 8, w: 8, h: 8 },
    { x: 174, y: 88, w: 84, h: 84 }
  ); // Back
  generator.drawTextureLegacy(
    "Skin",
    { x: 40, y: 0, w: 8, h: 8 },
    { x: 2, y: 2, w: 84, h: 84 }
  ); // Top
  generator.drawTextureLegacy(
    "Skin",
    { x: 48, y: 0, w: 8, h: 8 },
    { x: 2, y: 174, w: 84, h: 84 },
    { flip: "Vertical" }
  ); // Bottom

  if (alexModel) {
    // Right Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 3, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 20, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 20, w: 3, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 36, w: 3, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 36, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 36, w: 3, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 3, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );

    // Left Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 3, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 52, w: 3, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 52, w: 3, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 55, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 59, y: 52, w: 3, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 3, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
  } else {
    // Right Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 20, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 20, w: 4, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 20, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 20, w: 4, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 36, w: 4, h: 6 },
      { x: 200, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 36, w: 4, h: 6 },
      { x: 2, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 36, w: 4, h: 6 },
      { x: 68, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 36, w: 4, h: 6 },
      { x: 134, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 2, y: 264, w: 64, h: 64 }
    );

    // Left Arm

    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 52, w: 4, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 52, w: 4, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 52, w: 4, h: 6 },
      { x: 200 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 52, w: 4, h: 6 },
      { x: 2 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 52, w: 4, h: 6 },
      { x: 68 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 60, y: 52, w: 4, h: 6 },
      { x: 134 + 224 + 64, y: 330, w: 64, h: 168 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 48, w: 4, h: 4 },
      { x: 2 + 224 + 64, y: 264, w: 64, h: 64 }
    );
  }

  // Legs

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 20, w: 4, h: 6 },
    { x: 204, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 20, w: 4, h: 6 },
    { x: 6, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 20, w: 4, h: 6 },
    { x: 72, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 20, w: 4, h: 6 },
    { x: 138, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 6, y: 529, w: 64, h: 65 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 36, w: 4, h: 6 },
    { x: 204, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 36, w: 4, h: 6 },
    { x: 6, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 36, w: 4, h: 6 },
    { x: 72, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 36, w: 4, h: 6 },
    { x: 138, y: 596, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 32, w: 4, h: 4 },
    { x: 6, y: 529, w: 64, h: 65 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 52, w: 4, h: 6 },
    { x: 204 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 52, w: 4, h: 6 },
    { x: 6 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 52, w: 4, h: 6 },
    { x: 72 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 52, w: 4, h: 6 },
    { x: 138 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 6 + 283, y: 527, w: 64, h: 65 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 52, w: 4, h: 6 },
    { x: 204 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 52, w: 4, h: 6 },
    { x: 6 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 52, w: 4, h: 6 },
    { x: 72 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 52, w: 4, h: 6 },
    { x: 138 + 283, y: 594, w: 64, h: 116 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 48, w: 4, h: 4 },
    { x: 6 + 283, y: 527, w: 64, h: 65 }
  );

  generator.usePage("Page 2");

  generator.drawImage("Page2", [0, 0]);

  if (alexModel) {
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 26, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 26, w: 3, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 26, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 26, w: 3, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 3, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 16, w: 3, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 42, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 42, w: 3, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 42, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 51, y: 42, w: 3, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 3, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 47, y: 32, w: 3, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 58, w: 3, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 43, y: 58, w: 3, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 39, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 58, w: 3, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 55, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 59, y: 58, w: 3, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 55, y: 48, w: 3, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
  } else {
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 26, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 26, w: 4, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 26, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 26, w: 4, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 16, w: 4, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 16, w: 4, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 42, w: 4, h: 6 },
      { x: 190, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 42, w: 4, h: 6 },
      { x: 2, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 42, w: 4, h: 6 },
      { x: 65, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 42, w: 4, h: 6 },
      { x: 127, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 32, w: 4, h: 4 },
      { x: 2, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 32, w: 4, h: 4 },
      { x: 2, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 32, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 58, w: 4, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 44, y: 58, w: 4, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 36, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 40, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 48, y: 58, w: 4, h: 6 },
      { x: 190 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 58, w: 4, h: 6 },
      { x: 2 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 58, w: 4, h: 6 },
      { x: 65 + 267, y: 65, w: 60, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 60, y: 58, w: 4, h: 6 },
      { x: 127 + 267, y: 65, w: 61, h: 160 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 52, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 2, w: 61, h: 61 }
    );
    generator.drawTextureLegacy(
      "Skin",
      { x: 56, y: 48, w: 4, h: 4 },
      { x: 2 + 267, y: 227, w: 61, h: 61 }
    );
  }

  // Legs

  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 26, w: 4, h: 6 },
    { x: 191, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 26, w: 4, h: 6 },
    { x: 3, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 26, w: 4, h: 6 },
    { x: 66, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 26, w: 4, h: 6 },
    { x: 128, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 16, w: 4, h: 4 },
    { x: 3, y: 295, w: 61, h: 62 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 16, w: 4, h: 4 },
    { x: 3, y: 295 + 62 + 4 + 110, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 42, w: 4, h: 6 },
    { x: 191, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 42, w: 4, h: 6 },
    { x: 3, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 42, w: 4, h: 6 },
    { x: 66, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 42, w: 4, h: 6 },
    { x: 128, y: 359, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 32, w: 4, h: 4 },
    { x: 3, y: 295, w: 61, h: 62 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 32, w: 4, h: 4 },
    { x: 3, y: 295 + 62 + 4 + 110, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 58, w: 4, h: 6 },
    { x: 459, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 58, w: 4, h: 6 },
    { x: 270, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 58, w: 4, h: 6 },
    { x: 333, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 58, w: 4, h: 6 },
    { x: 396, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 48, w: 4, h: 4 },
    { x: 270, y: 293, w: 61, h: 62 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 24, y: 48, w: 4, h: 4 },
    { x: 270, y: 469, w: 61, h: 62 },
    { flip: "Vertical" }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 0, y: 58, w: 4, h: 6 },
    { x: 459, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 58, w: 4, h: 6 },
    { x: 270, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 58, w: 4, h: 6 },
    { x: 333, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 12, y: 58, w: 4, h: 6 },
    { x: 396, y: 357, w: 61, h: 110 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 4, y: 48, w: 4, h: 4 },
    { x: 270, y: 293, w: 61, h: 62 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 48, w: 4, h: 4 },
    { x: 270, y: 469, w: 61, h: 62 },
    { flip: "Vertical" }
  );

  generator.usePage("Page 3");

  generator.drawImage("Page3", [0, 0]);

  // Torso11

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 20, w: 4, h: 7 },
    { x: 131, y: 4, w: 168, h: 126 },
    { rotateLegacy: 90.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 20, w: 8, h: 7 },
    { x: 133, y: 174, w: 252, h: 126 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 20, w: 4, h: 7 },
    { x: 387, y: 172, w: 168, h: 126 },
    { rotateLegacy: 270.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 20, w: 8, h: 7 },
    { x: 385, y: 598, w: 252, h: 126 },
    { rotateLegacy: 180.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 16, w: 8, h: 4 },
    { x: 133, y: 4, w: 252, h: 168 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 26, w: 8, h: 1 },
    { x: 133, y: 302, w: 252, h: 168 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 36, w: 4, h: 7 },
    { x: 131, y: 4, w: 168, h: 126 },
    { rotateLegacy: 90.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 36, w: 8, h: 7 },
    { x: 133, y: 174, w: 252, h: 126 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 36, w: 4, h: 7 },
    { x: 387, y: 172, w: 168, h: 126 },
    { rotateLegacy: 270.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 36, w: 8, h: 7 },
    { x: 385, y: 598, w: 252, h: 126 },
    { rotateLegacy: 180.0 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 32, w: 8, h: 4 },
    { x: 133, y: 4, w: 252, h: 168 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 42, w: 8, h: 1 },
    { x: 133, y: 302, w: 252, h: 168 }
  );

  generator.drawImage("Hole1", [216, 32]);

  generator.drawImage("Hole2", [182, 320]);

  generator.usePage("Page 4");

  generator.drawImage("Page4", [0, 0]);

  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 27, w: 4, h: 5 },
    { x: 434, y: 134, w: 128, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 27, w: 8, h: 5 },
    { x: 3, y: 134, w: 150, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 27, w: 4, h: 5 },
    { x: 154, y: 134, w: 128, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 27, w: 8, h: 5 },
    { x: 283, y: 134, w: 150, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 16, w: 8, h: 4 },
    { x: 3, y: 306, w: 150, h: 128 },
    { flip: "Vertical" }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 26, w: 8, h: 1 },
    { x: 3, y: 306 - 128 - 171 - 2, w: 150, h: 128 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 16, y: 41, w: 4, h: 5 },
    { x: 434, y: 134, w: 128, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 41, w: 8, h: 5 },
    { x: 3, y: 134, w: 150, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 41, w: 4, h: 5 },
    { x: 154, y: 134, w: 128, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 32, y: 41, w: 8, h: 5 },
    { x: 283, y: 134, w: 150, h: 171 }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 28, y: 39, w: 8, h: 9 },
    { x: 3, y: 306, w: 150, h: 128 },
    { flip: "Vertical" }
  );
  generator.drawTextureLegacy(
    "Skin",
    { x: 20, y: 42, w: 8, h: 1 },
    { x: 3, y: 306 - 128 - 171 - 2, w: 150, h: 128 }
  );

  generator.drawImage("Hole3", [3, 339]);

  generator.drawImage("Hole3", [87, 339]);
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video,
  instructions: null,
  images,
  textures,
  script,
};
