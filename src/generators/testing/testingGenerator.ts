"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  InstructionsDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { type Atlas } from "@genroot/builder/modules/textureData";

import thumbnailImage from "./images/thumbnail.png";
import testSheetImage from "./images/testSheet.png";

const id = "testing";

const name = "Testing";

const history: HistoryDef = [
  "16 May 2026 Codex - Added a visual regression board for shared rendering cases.",
  "17 May 2026 Codex - Added an atlas input case for multi-texture uploads.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const instructions: InstructionsDef = `
This generator is a visual regression board.

Use it to pin shared rendering behavior whenever a change has an obvious screenshot consequence.
`;

const textures: TextureDef[] = [
  {
    id: "TestSheet",
    url: testSheetImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const images: ImageDef[] = [];

const script: ScriptDef = (generator: Generator) => {
  generator.usePage("Reference Sheet");
  generator.drawTexture("TestSheet", [0, 0, 64, 64], [16, 16, 256, 256]);

  generator.usePage("Render Cases");
  // Group the common render cases together so the page count stays small.
  generator.drawTexture("TestSheet", [0, 0, 16, 16], [48, 64, 128, 128]);
  generator.drawTexture("TestSheet", [16, 0, 32, 32], [240, 64, 128, 128]);
  generator.drawTexture("TestSheet", [16, 0, 32, 32], [432, 64, 128, 128], {
    rotate: 90,
  });

  generator.usePage("Rotation Flip Matrix");
  // Exercise the full orientation space on the same source tile.
  const tileSize = 96;
  const gap = 48;
  const pitch = tileSize + gap;
  const rotations = [0, 90, 180, 270];
  const flips = ["None", "Horizontal", "Vertical"] as const;
  rotations.forEach((rotate, row) => {
    flips.forEach((flip, col) => {
      const x = 32 + col * pitch;
      const y = 32 + row * pitch;
      generator.drawTexture(
        "TestSheet",
        [0, 0, 16, 16],
        [x, y, tileSize, tileSize],
        {
          rotate,
          flip,
        }
      );
    });
  });

  generator.usePage("Density Comparison");
  // Render both sources to the same destination size so density is the only difference.
  generator.drawTexture("TestSheet", [0, 0, 16, 16], [48, 64, 128, 128]);
  generator.drawTexture("TestSheet", [16, 0, 32, 32], [176, 64, 128, 128]);

  generator.defineAtlasInput("Textures", {
    standardWidth: 16,
    standardHeight: 16,
    choices: [],
    label: "Textures",
  });

  const atlasJson = generator.getStringInputValue("Textures Frames");
  const atlas: Atlas | null = atlasJson ? JSON.parse(atlasJson) : null;

  if (generator.hasTexture("Textures") && atlas) {
    // Pack multiple uploads into one atlas and render the resulting frames.
    generator.usePage("Atlas Input");
    let drawY = 32;
    atlas.frames.forEach((tile) => {
      const [srcX, srcY, width, height] = tile.rectangle;
      generator.drawTexture(
        "Textures",
        [srcX, srcY, width, height],
        [32, drawY, width * 2, height * 2]
      );
      drawY += height * 2 + 12;
    });
  }
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail,
  video: null,
  instructions,
  history,
  images,
  textures,
  script,
};
