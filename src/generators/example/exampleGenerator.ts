"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  Generator,
} from "@/builder/modules/types";

import skin from "./textures/Skin.png";
import background from "./images/Background.png";
import folds from "./images/Folds.png";

const id = "example";

const name = "Example";

const history: HistoryDef = [];

const images: ImageDef[] = [
  { id: "Background", url: background.src },
  { id: "Folds", url: folds.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skin.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

// let script = () => {
//   Generator.defineTextureInput("Skin", {standardWidth: 64, standardHeight: 64, choices: []})
//   Generator.defineBooleanInput("Show Folds", true)
//   let showFolds = Generator.getBooleanInputValue("Show Folds")
//   Generator.drawImage("Background", (0, 0))
//   drawHead("Skin", 185, 117)
//   if showFolds {
//     Generator.drawImage("Folds", (0, 0))
//   }

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
      flip: { kind: "Vertical" },
    }); // Bottom

    // Head Overlay
    generator.drawTexture(name, [32, 8, 8, 8], [x - 64, y + 0, 64, 64]); // Right
    generator.drawTexture(name, [40, 8, 8, 8], [x, y, 64, 64]); // Face
    generator.drawTexture(name, [48, 8, 8, 8], [x + 64, y + 0, 64, 64]); // Left
    generator.drawTexture(name, [56, 8, 8, 8], [x + 128, y + 0, 64, 64]); // Back
    generator.drawTexture(name, [40, 0, 8, 8], [x + 0, y - 64, 64, 64]); // Top
    generator.drawTexture(name, [48, 0, 8, 8], [x + 0, y + 64, 64, 64], {
      flip: { kind: "Vertical" },
    }); // Bottom
  };

  generator.drawImage("Background", [0, 0]);

  drawHead("Skin", 185, 117);

  generator.drawImage("Folds", [0, 0]);
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  images,
  textures,
  script,
};
