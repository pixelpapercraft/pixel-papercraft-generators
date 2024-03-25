"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  ThumbnailDef,
  TextureDef,
  ScriptDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { steve, alex } from "../_common/minecraftCharacter";
import { type Dimensions, Minecraft } from "../_common/minecraft";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import foldsAlexImage from "./images/Folds-Alex.png";
import foldsSteveImage from "./images/Folds-Steve.png";
import foldsM16Image from "./images/Folds-M16.png";
import foregroundAlexImage from "./images/Foreground-Alex.png";
import foregroundSteveImage from "./images/Foreground-Steve.png";
import foregroundM16Image from "./images/Foreground-M16.png";
import labelsImage from "./images/Labels.png";
import skin64x64SteveImage from "./textures/Skin64x64Steve.png";

const id = "minecraft-action-figure";

const name = "Minecraft Action Figure";

const history: HistoryDef = [
  "16 Aug 2020 NinjolasNJM - Initial script finished.",
  "03 Oct 2020 NinjolasNJM - Added Alex support and Hand Notches.",
  "09 Oct 2020 NinjolasNJM - Tweaked pelvis, bottom of body and leg height.",
  "24 Feb 2021 NinjolasNJM - Moved pelvis so that the leg's pivot point is accurate to the game, changed leg height accordingly.",
  "06 Jun 2021 NinjolasNJM - Converted to ReScript generator.",
  "02 Feb 2024 NinjolasNJM - Reworked layout, improved notches and added skin input",
  "22 Mar 2024 NinjolasNJM - Converted to TypeScript Generator.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Folds-Alex", url: foldsAlexImage.src },
  { id: "Folds-Steve", url: foldsSteveImage.src },
  { id: "Folds-M16", url: foldsM16Image.src },
  { id: "Foreground-Alex", url: foregroundAlexImage.src },
  { id: "Foreground-Steve", url: foregroundSteveImage.src },
  { id: "Foreground-M16", url: foregroundM16Image.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skin64x64SteveImage.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);
  // Define user inputs

  generator.defineSelectInput("Skin Model", ["Steve", "Alex"]);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: [],
  });

  // Define user variables

  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);
  generator.defineBooleanInput("Hand Notches", true);
  // Get user variable values
  const isAlexModel = generator.getSelectInputValue("Skin Model") === "Alex";

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");
  const handNotches = generator.getBooleanInputValue("Hand Notches");

  const showHeadOverlay = generator.getBooleanInputValueWithDefault(
    "Show Head Overlay",
    true
  );
  const showBodyOverlay = generator.getBooleanInputValueWithDefault(
    "Show Body Overlay",
    true
  );
  const showLeftArmOverlay = generator.getBooleanInputValueWithDefault(
    "Show Left Arm Overlay",
    true
  );
  const showRightArmOverlay = generator.getBooleanInputValueWithDefault(
    "Show Right Arm Overlay",
    true
  );
  const showLeftLegOverlay = generator.getBooleanInputValueWithDefault(
    "Show Left Leg Overlay",
    true
  );
  const showRightLegOverlay = generator.getBooleanInputValueWithDefault(
    "Show Right Leg Overlay",
    true
  );

  const m16Mode = generator.getBooleanInputValueWithDefault("M16 Mode", false);

  const char = isAlexModel ? alex : steve;

  function drawHead([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid("Skin", char.base.head, [ox, oy], dimensions);
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.head,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawNeck([ox, oy]: [number, number]) {
    generator.drawTexture("Skin", char.base.head.bottom, [ox, oy, 96, 64]); // Neck
    if (showHeadOverlay) {
      generator.drawTexture("Skin", char.overlay.head.bottom, [ox, oy, 96, 64]); // Neck
    }
  }

  function drawBody([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [64, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.body, [ox, oy], dimensions);
    generator.drawTexture("Skin", [0, 20, 4, 4], [ox, oy + 128, 32, 32]); // Right Hip
    generator.drawTexture("Skin", [24, 52, 4, 4], [ox + 96, oy + 128, 32, 32]); // Left Hip

    if (showBodyOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.body,
        [ox, oy],
        dimensions
      );
    }
    if (showRightLegOverlay) {
      generator.drawTexture("Skin", [0, 36, 4, 4], [ox, oy + 128, 32, 32]); // Right Hip
    }
    if (showLeftLegOverlay) {
      generator.drawTexture("Skin", [8, 52, 4, 4], [ox + 96, oy + 128, 32, 32]); // Left Hip
    }
  }

  function drawPelvis([ox, oy]: [number, number]) {
    generator.drawTexture("Skin", char.base.rightLeg.top, [ox, oy, 32, 128]); // Right Pelvis
    generator.drawTexture("Skin", char.base.leftLeg.top, [
      ox + 32,
      oy,
      32,
      128,
    ]); // Left Pelvis

    if (showRightLegOverlay) {
      generator.drawTexture("Skin", char.overlay.rightLeg.top, [
        ox,
        oy,
        32,
        128,
      ]); // Right Pelvis
    }

    if (showLeftLegOverlay) {
      generator.drawTexture("Skin", char.overlay.leftLeg.top, [
        ox + 32,
        oy,
        32,
        128,
      ]); // Left Pelvis
    }
  }

  function drawRightArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.rightArm,
      [ox, oy],
      dimensions
    );
    if (showRightArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightArm,
        [ox, oy],
        dimensions
      );
    }
  }

  function drawRightShoulder([ox, oy]: [number, number]) {
    generator.drawTexture(
      "Skin",
      [char === alex ? 47 : 48, 20, 4, 4],
      [ox, oy + 15, 32, 32]
    ); //Right Shoulder Inside
    generator.drawTexture(
      "Skin",
      [char === alex ? 47 : 48, 20, 4, 4],
      [ox, oy + 49, 32, 32]
    ); //Right Shoulder

    if (showRightArmOverlay) {
      generator.drawTexture(
        "Skin",
        [char === alex ? 47 : 48, 36, 4, 4],
        [ox, oy + 15, 32, 32]
      ); //Right Shoulder Inside
      generator.drawTexture(
        "Skin",
        [char === alex ? 47 : 48, 36, 4, 4],
        [ox, oy + 49, 32, 32]
      ); //Right Shoulder
    }
  }

  function drawLeftArm([ox, oy]: [number, number]) {
    const dimensions: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftArm,
      [ox, oy],
      dimensions,
      { orientation: "East" }
    );

    if (showLeftArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftArm,
        [ox, oy],
        dimensions,
        { orientation: "East" }
      );
    }
  }

  function drawLeftShoulder([ox, oy]: [number, number]) {
    generator.drawTexture("Skin", [32, 52, 4, 4], [ox, oy + 15, 32, 32]); //Left Shoulder Inside
    generator.drawTexture("Skin", [32, 52, 4, 4], [ox, oy + 49, 32, 32]); //Left Shoulder

    if (showLeftArmOverlay) {
      generator.drawTexture("Skin", [48, 52, 4, 4], [ox, oy + 15, 32, 32]); //Left Shoulder Inside
      generator.drawTexture("Skin", [48, 52, 4, 4], [ox, oy + 49, 32, 32]); //Left Shoulder
    }
  }

  function drawRightLeg([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.rightLeg,
      [ox, oy],
      dimensions
    );
    generator.drawTexture("Skin", [12, 20, 4, 4], [ox + 32, oy - 50, 32, 32], {
      rotate: 180,
    });
    generator.drawTexture("Skin", char.base.rightLeg.top, [
      ox + 32,
      oy - 18,
      32,
      50,
    ]);

    // 50 pixels tall top, so that the back texture is in line with where it should be on the back side

    if (showRightLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightLeg,
        [ox, oy],
        dimensions
      );
      generator.drawTexture(
        "Skin",
        [12, 36, 4, 4],
        [ox + 32, oy - 50, 32, 32],
        { rotate: 180 }
      );
      generator.drawTexture("Skin", char.base.rightLeg.top, [
        ox + 32,
        oy - 18,
        32,
        50,
      ]);
      generator.drawTexture("Skin", char.overlay.rightLeg.top, [
        ox + 32,
        oy - 18,
        32,
        50,
      ]);
      // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    }
  }
  function drawLeftLeg([ox, oy]: [number, number]) {
    const dimensions: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftLeg,
      [ox, oy],
      dimensions,
      { orientation: "East" }
    );
    generator.drawTexture("Skin", [28, 52, 4, 4], [ox + 64, oy - 50, 32, 32], {
      rotate: 180,
    });
    generator.drawTexture("Skin", char.base.leftLeg.top, [
      ox + 64,
      oy - 18,
      32,
      50,
    ]);

    // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    if (showLeftLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftLeg,
        [ox, oy],
        dimensions,
        { orientation: "East" }
      );
      generator.drawTexture(
        "Skin",
        [12, 52, 4, 4],
        [ox + 64, oy - 50, 32, 32],
        { rotate: 180 }
      );
      generator.drawTexture("Skin", char.base.leftLeg.top, [
        ox + 64,
        oy - 18,
        32,
        50,
      ]);
      generator.drawTexture("Skin", char.overlay.leftLeg.top, [
        ox + 64,
        oy - 18,
        32,
        50,
      ]);
      // 50 pixels tall top, so that the back texture is in line with where it should be on the back side
    }
  }

  function drawNotch([ox, oy]: [number, number], isLeftSide: boolean) {
    const dir = isLeftSide ? 1 : 0;
    const [x, y, w, h] = [ox + dir, oy, 8, 24];

    const color = "#7b7b7b";
    //Generator.fillRect((x - dir, y, w, h), "#ff0000")
    generator.drawLine([x, y - 1], [x + w - 1, y - 1], { color });
    generator.drawLine([x + w - 10 * dir, y], [x + w - 10 * dir, y + h], {
      color,
      lineDash: [7, 1],
    });
    generator.drawLine([x + w - 1, y + h + 1], [x, y + h + 1], { color });
    //Generator.drawFoldLine((x, y + h), (x, y))
  }

  // The foreground was designed on a 32px grid with an offset of (9, 5) that makes the cells more centered. This function makes finding the [ox, oy] much easier as you only need to count the cells instead of find the actual coordinates.
  function getGridOrigin(x: number, y: number): [number, number] {
    return [9 + 32 * x, 5 + 32 * y];
  }

  // Head
  let [ox, oy] = getGridOrigin(1, 1);

  drawHead([ox, oy]);

  generator.defineRegionInput([ox, oy, 256, 192], () => {
    generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay);
  });

  // Neck

  [ox, oy] = getGridOrigin(13, 3);

  drawNeck([ox, oy]);

  // Body

  [ox, oy] = getGridOrigin(7, 6);

  drawBody([ox, oy]);
  generator.defineRegionInput([ox, oy, 192, 160], () => {
    generator.setBooleanInputValue("Show Body Overlay", !showBodyOverlay);
  });

  // Pelvis

  [ox, oy] = getGridOrigin(8, 17);

  drawPelvis([ox, oy]);

  // Arms

  // Right Arm

  [ox, oy] = getGridOrigin(1, 10);
  ox = isAlexModel ? ox + 8 : ox;

  drawRightArm([ox, oy]);

  generator.defineRegionInput([ox, oy, isAlexModel ? 112 : 128, 160], () => {
    generator.setBooleanInputValue(
      "Show Right Arm Overlay",
      !showRightArmOverlay
    );
  });

  // Right Shoulder

  [ox, oy] = getGridOrigin(7, 12);

  drawRightShoulder([ox, oy]);

  // Left Arm

  [ox, oy] = getGridOrigin(13, 10);
  ox = isAlexModel ? ox + 8 : ox;

  drawLeftArm([ox, oy]);

  generator.defineRegionInput([ox, oy, isAlexModel ? 112 : 128, 166], () => {
    generator.setBooleanInputValue(
      "Show Left Arm Overlay",
      !showLeftArmOverlay
    );
  });

  // Left  Shoulder

  [ox, oy] = getGridOrigin(10, 12);

  drawLeftShoulder([ox, oy]);

  // Right Leg

  [ox, oy] = getGridOrigin(1, 18);

  drawRightLeg([ox, oy]);
  generator.defineRegionInput([ox, oy - 48, 128, 208], () => {
    generator.setBooleanInputValue(
      "Show Right Leg Overlay",
      !showRightLegOverlay
    );
  });

  // Left Leg

  [ox, oy] = getGridOrigin(13, 18);

  drawLeftLeg([ox, oy]);
  generator.defineRegionInput([ox, oy - 48, 128, 208], () => {
    generator.setBooleanInputValue(
      "Show Left Leg Overlay",
      !showLeftLegOverlay
    );
  });

  // Foreground
  if (isAlexModel) {
    generator.drawImage("Foreground-Alex", [0, 0]);
  } else {
    generator.drawImage("Foreground-Steve", [0, 0]);
  }

  // Folds
  if (showFolds) {
    if (isAlexModel) {
      generator.drawImage("Folds-Alex", [0, 0]);
    } else {
      generator.drawImage("Folds-Steve", [0, 0]);
    }
  }

  // M16 Mode

  generator.defineRegionInput([1016, 1016, 64, 64], () => {
    // M + 16 = 1000 + 16 = 1016
    generator.setBooleanInputValue("M16 Mode", !m16Mode);
  });
  if (m16Mode) {
    // draw new body and legs
    [ox, oy] = getGridOrigin(7, 6);
    drawBody([ox, oy]);
    [ox, oy] = getGridOrigin(1, 18);

    drawRightLeg([ox, oy]);
    [ox, oy] = getGridOrigin(13, 18);

    drawLeftLeg([ox, oy]);

    // Draw images
    generator.drawImage("Foreground-M16", [0, 0]);
    if (showFolds) {
      generator.drawImage("Folds-M16", [0, 0]);
    }
  }

  // Hand Notches
  if (handNotches) {
    // Right Hand Notches
    [ox, oy] = getGridOrigin(1, 10);
    ox = isAlexModel ? ox + 4 : ox;
    drawNotch([ox + 44, oy + 104], false); // Front Notch
    drawNotch([ox + (isAlexModel ? 100 : 108), oy + 104], true); // Back Notch

    // Left Hand Notches
    [ox, oy] = getGridOrigin(13, 10);
    ox = isAlexModel ? ox + 4 : ox;
    drawNotch([ox + (isAlexModel ? 68 : 76), oy + 104], true); // Front Notch
    drawNotch([ox + 12, oy + 104], false); // Back Notch
  }

  // Labels
  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }
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
