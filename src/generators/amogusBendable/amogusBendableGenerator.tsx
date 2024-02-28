"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  VideoDef,
  InstructionsDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import thumbnailImage from "./thumbnail/thumbnail.jpeg";
import amogusImage from "./instructions/amogus-100.png";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import skinImage from "./textures/Skin.png";
import colorsImage from "./textures/Colors.png";

const id = "amogus-bendable";

const name = "Amogus Bendable";

const history: HistoryDef = ["Jan 2022 PaperDogChannel - First release."];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const video: VideoDef = {
  url: "https://www.youtube.com/embed/0v8_l7J4qWg?rel=0",
};

const instructions: InstructionsDef = `
"Amogus" is a corrupted version of the Among Us game name. In January 2021,
the word gained popularity as a catchphrase used in ironic memes, often used
to replace dialogue in various cartoons. Additionally, Amogus refers to a even
more simplified like drawing of a crewmate from Among Us used in these type of memes.
![Amogus](${amogusImage.src})
`;

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
  {
    id: "Colors",
    url: colorsImage.src,
    standardWidth: 16,
    standardHeight: 2,
  },
];

const script: ScriptDef = (generator: Generator) => {
  generator.defineSelectInput("Color", [
    "Red",
    "Black",
    "White",
    "Rose",
    "Blue",
    "Cyan",
    "Yellow",
    "Pink",
    "Purple",
    "Orange",
    "Banana",
    "Coral",
    "Lime",
    "Green",
    "Gray",
    "Maroon",
    "Brown",
    "Tan",
  ]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  generator.drawImage("Background", [0, 0]);

  const red = generator.getSelectInputValue("Color") === "Red";
  const black = generator.getSelectInputValue("Color") === "Black";
  const white = generator.getSelectInputValue("Color") === "White";
  const rose = generator.getSelectInputValue("Color") === "Rose";
  const blue = generator.getSelectInputValue("Color") === "Blue";
  const cyan = generator.getSelectInputValue("Color") === "Cyan";
  const yellow = generator.getSelectInputValue("Color") === "Yellow";
  const pink = generator.getSelectInputValue("Color") === "Pink";
  const purple = generator.getSelectInputValue("Color") === "Purple";
  const orange = generator.getSelectInputValue("Color") === "Orange";
  const banana = generator.getSelectInputValue("Color") === "Banana";
  const coral = generator.getSelectInputValue("Color") === "Coral";
  const lime = generator.getSelectInputValue("Color") === "Lime";
  const green = generator.getSelectInputValue("Color") === "Green";
  const gray = generator.getSelectInputValue("Color") === "Gray";
  const maroon = generator.getSelectInputValue("Color") === "Maroon";
  const brown = generator.getSelectInputValue("Color") === "Brown";
  const tancolour = generator.getSelectInputValue("Color") === "Tan";

  // Drawing

  if (red) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 0, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (black) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 1, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (rose) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 2, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (blue) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 3, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (cyan) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 4, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (yellow) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 5, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (pink) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 6, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (purple) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 7, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (orange) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 8, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (banana) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 9, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (coral) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 10, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (lime) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 11, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (green) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 12, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (gray) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 13, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (maroon) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 14, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (brown) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 15, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (tancolour) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 0, y: 1, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  if (white) {
    generator.drawTextureLegacy(
      "Colors",
      { x: 1, y: 1, w: 1, h: 1 },
      { x: 0, y: 0, w: 600, h: 660 }
    );
  }

  generator.drawTextureLegacy(
    "Skin",
    { x: 8, y: 8, w: 8, h: 8 },
    { x: 47, y: 229, w: 87 - 47, h: 253 - 229 }
  );

  generator.drawTextureLegacy(
    "Skin",
    { x: 8 + 32, y: 8, w: 8, h: 8 },
    { x: 47, y: 229, w: 87 - 47, h: 253 - 229 }
  );

  generator.drawImage("Folds", [0, 0]);
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video,
  instructions,
  images,
  textures,
  script,
};
