"use client";

import type {
  GeneratorDef,
  InstructionsDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import skinImage from "./textures/Skin.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";

const id = "example";

const name = "Example";

const instructions: InstructionsDef = `
An example generator to demonstrate how to write a generator script.
`;

const history: HistoryDef = [];

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Folds", url: foldsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skinImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  // Helper Function to draw heads
  const drawHead = (name: string, x: number, y: number) => {
    // Head Base
    generator.drawTexture(name, [0, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    generator.drawTexture(name, [8, 8, 8, 8], [x, y, 64, 64]); // Face
    generator.drawTexture(name, [16, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    generator.drawTexture(name, [24, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    generator.drawTexture(name, [8, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    generator.drawTexture(name, [16, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom

    // Head Overlay
    generator.drawTexture(name, [32, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    generator.drawTexture(name, [40, 8, 8, 8], [x, y, 64, 64]); // Face
    generator.drawTexture(name, [48, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    generator.drawTexture(name, [56, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    generator.drawTexture(name, [40, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    generator.drawTexture(name, [48, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: "Vertical",
    }); // Bottom
  };

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  generator.defineBooleanInput("Show Folds", true);

  const showFolds = generator.getBooleanInputValue("Show Folds");

  generator.drawImage("Background", [0, 0]);

  drawHead("Skin", 185, 117);

  if (showFolds) {
    generator.drawImage("Folds", [0, 0]);
  }
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail: null,
  video: null,
  instructions,
  history,
  images,
  textures,
  script,
};
