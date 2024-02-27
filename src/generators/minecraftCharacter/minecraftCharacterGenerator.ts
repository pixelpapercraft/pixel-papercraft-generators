"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
  InstructionsDef,
} from "@/builder/modules/generatorDef";
import { type Generator } from "@/builder/modules/generator";

import { steve, alex } from "../common/minecraftCharacter";
import { type Dimensions, Minecraft } from "../common/minecraft";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";

import alexFoldsImage from "./images/AlexFolds.png";
import alexTabsImage from "./images/AlexTabs.png";
import backgroundImage from "./images/Background.png";
import labelsImage from "./images/Labels.png";
import steveFoldsImage from "./images/SteveFolds.png";
import steveTabsImage from "./images/SteveTabs.png";

import skinAlex64 from "./textures/SkinAlex64x64.png";
// import skinAlexReference64 from "./textures/SkinAlexReference64x64.png";
import skinSteve64 from "./textures/SkinSteve64x64.png";
// import skinSteveDiamondArmor256 from "./textures/SkinSteveDiamondArmor256x256.png";
// import skinSteveDiamondArmor64 from "./textures/SkinSteveDiamondArmor64x64.png";
// import skinSteveReference64 from "./textures/SkinSteveReference64x64.png";

const id = "minecraft-character";

const name = "Minecraft Character";

const history: HistoryDef = [
  "01 Feb 2015 gootube2000 - First release.",
  "05 Feb 2015 gootube2000 - Fixed orientation of the hands, feet and under the head.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "20 Feb 2015 lostminer - Make background non-transparent.",
  "02 Oct 2020 NinjolasNJM - Combined Steve and Alex Generators into one.",
  "27 May 2021 lostminer - Convert to ReScript generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "27 May 2022 NinjolasNJM - Made folds drawn using drawFolds, and parts drawn using drawCuboid, and added title",
  "12 Jun 2022 NinjolasNJM - Updated to use new Minecraft module",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const instructions: InstructionsDef = `
## How to use the Minecraft Character Generator?

1. Select your Minecraft skin file.
2. Choose the your Minecraft skin file model type.
3. Download and print your character papercraft.
`;

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "SteveTabs", url: steveTabsImage.src },
  { id: "SteveFolds", url: steveFoldsImage.src },
  { id: "AlexTabs", url: alexTabsImage.src },
  { id: "AlexFolds", url: alexFoldsImage.src },
  { id: "Labels", url: labelsImage.src },
];

const textures: TextureDef[] = [
  {
    id: "Skin",
    url: skinSteve64.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Steve",
    url: skinSteve64.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Alex",
    url: skinAlex64.src,
    standardWidth: 64,
    standardHeight: 64,
  },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);

  generator.defineTextureInput("Skin", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Steve", "Alex"],
  });

  generator.defineSelectInput("Skin Model", ["Steve", "Alex"]);

  generator.defineBooleanInput("Show Folds", true);

  generator.defineBooleanInput("Show Labels", true);

  generator.defineText(
    "Click in the papercraft template to turn on and off the overlay for each part."
  );

  // Draw

  const isAlexModel = generator.getSelectInputValue("Skin Model") === "Alex";

  const showFolds = generator.getBooleanInputValue("Show Folds");

  const showLabels = generator.getBooleanInputValue("Show Labels");

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

  //   let drawBody = ((ox, oy): Generator_Builder.position) => {
  //     let scale = (64, 96, 32)
  //     Minecraft.drawCuboid("Skin", char.base.body, (ox, oy), scale, ())
  //     if showBodyOverlay {
  //       Minecraft.drawCuboid("Skin", char.overlay.body, (ox, oy), scale, ())
  //     }
  //   }

  function drawBody([ox, oy]: [number, number]) {
    const scale: Dimensions = [64, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.body, [ox, oy], scale);
    if (showBodyOverlay) {
      minecraftGenerator.drawCuboid("Skin", char.overlay.body, [ox, oy], scale);
    }
  }

  //   let drawRightArm = ((ox, oy): Generator_Builder.position) => {
  //     let scale = char == alex ? (24, 96, 32) : (32, 96, 32)
  //     Minecraft.drawCuboid("Skin", char.base.rightArm, (ox, oy), scale, ())
  //     if showRightArmOverlay {
  //       Minecraft.drawCuboid("Skin", char.overlay.rightArm, (ox, oy), scale, ())
  //     }
  //   }

  function drawRightArm([ox, oy]: [number, number]) {
    const scale: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.rightArm, [ox, oy], scale);
    if (showRightArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightArm,
        [ox, oy],
        scale
      );
    }
  }

  //   let drawLeftArm = ((ox, oy): Generator_Builder.position) => {
  //     let scale = char == alex ? (24, 96, 32) : (32, 96, 32)
  //     Minecraft.drawCuboid("Skin", char.base.leftArm, (ox, oy), scale, ~direction=#West, ())
  //     if showLeftArmOverlay {
  //       Minecraft.drawCuboid("Skin", char.overlay.leftArm, (ox, oy), scale, ~direction=#West, ())
  //     }
  //   }

  function drawLeftArm([ox, oy]: [number, number]) {
    const scale: Dimensions = char === alex ? [24, 96, 32] : [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftArm,
      [ox, oy],
      scale,
      "West"
    );
    if (showLeftArmOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftArm,
        [ox, oy],
        scale,
        "West"
      );
    }
  }

  //   let drawRightLeg = ((ox, oy): Generator_Builder.position) => {
  //     let scale = (32, 96, 32)
  //     Minecraft.drawCuboid("Skin", char.base.rightLeg, (ox, oy), scale, ())
  //     if showRightLegOverlay {
  //       Minecraft.drawCuboid("Skin", char.overlay.rightLeg, (ox, oy), scale, ())
  //     }
  //     /* if showFolds {
  //       Generator.drawFoldLineCuboid((ox, oy), scale, ())
  //     } */
  //   }

  function drawRightLeg([ox, oy]: [number, number]) {
    const scale: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid("Skin", char.base.rightLeg, [ox, oy], scale);
    if (showRightLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.rightLeg,
        [ox, oy],
        scale
      );
    }
  }

  //   let drawLeftLeg = ((ox, oy): Generator_Builder.position) => {
  //     let scale = (32, 96, 32)
  //     Minecraft.drawCuboid("Skin", char.base.leftLeg, (ox, oy), scale, ~direction=#West, ())
  //     if showLeftLegOverlay {
  //       Minecraft.drawCuboid("Skin", char.overlay.leftLeg, (ox, oy), scale, ~direction=#West, ())
  //     }
  //     /* if showFolds {
  //       Generator.drawFoldLineCuboid((ox, oy), scale, ~direction=#West, ())
  //     } */
  //   }

  function drawLeftLeg([ox, oy]: [number, number]) {
    const scale: Dimensions = [32, 96, 32];
    minecraftGenerator.drawCuboid(
      "Skin",
      char.base.leftLeg,
      [ox, oy],
      scale,
      "West"
    );
    if (showLeftLegOverlay) {
      minecraftGenerator.drawCuboid(
        "Skin",
        char.overlay.leftLeg,
        [ox, oy],
        scale,
        "West"
      );
    }
  }

  //   let drawFolds = () => {
  //     if isAlexModel {
  //       Generator.drawImage("AlexFolds", (0, 0))
  //     } else {
  //       Generator.drawImage("SteveFolds", (0, 0))
  //     }
  //     // Later replace with drawLineFold functions
  //   }

  function drawFolds() {
    if (isAlexModel) {
      generator.drawImage("AlexFolds", [0, 0]);
    } else {
      generator.drawImage("SteveFolds", [0, 0]);
    }
    // Later replace with drawLineFold functions
  }

  //   // Background
  //   Generator.drawImage("Background", (0, 0))

  generator.drawImage("Background", [0, 0]);

  //   if isAlexModel {
  //     Generator.drawImage("AlexTabs", (0, 0))
  //   } else {
  //     Generator.drawImage("SteveTabs", (0, 0))
  //   }

  if (isAlexModel) {
    generator.drawImage("AlexTabs", [0, 0]);
  } else {
    generator.drawImage("SteveTabs", [0, 0]);
  }

  //   // Head
  //   let (ox, oy) = (74, 25)
  const [oxHead, oyHead] = [74, 25];

  //   drawHead((ox, oy))
  drawHead([oxHead, oyHead]);

  //   Generator.defineRegionInput((ox, oy, 256, 192), () => {
  //     Generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay)
  //   })

  generator.defineRegionInput([oxHead, oyHead, 256, 192], () => {
    generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay);
  });

  //   // Body
  //   let (ox, oy) = (268, 201)
  const [oxBody, oyBody] = [268, 201];

  //   drawBody((ox, oy))
  drawBody([oxBody, oyBody]);

  //   Generator.defineRegionInput((ox, oy, 192, 160), () => {
  //     Generator.setBooleanInputValue("Show Body Overlay", !showBodyOverlay)
  //   })

  generator.defineRegionInput([oxBody, oyBody, 192, 160], () => {
    generator.setBooleanInputValue("Show Body Overlay", !showBodyOverlay);
  });

  //   // Arms
  //   // Right Arm
  //   let (ox, oy) = (isAlexModel ? 107 : 99, 373)
  const [oxRightArm, oyRightArm] = isAlexModel ? [107, 373] : [99, 373];

  //   drawRightArm((ox, oy))
  drawRightArm([oxRightArm, oyRightArm]);

  //   Generator.defineRegionInput((ox, oy, isAlexModel ? 112 : 128, 160), () => {
  //     Generator.setBooleanInputValue("Show Right Arm Overlay", !showRightArmOverlay)
  //   })

  generator.defineRegionInput(
    [oxRightArm, oyRightArm, isAlexModel ? 112 : 128, 160],
    () => {
      generator.setBooleanInputValue(
        "Show Right Arm Overlay",
        !showRightArmOverlay
      );
    }
  );

  //   // Left Arm
  //   let (ox, oy) = (isAlexModel ? 391 : 383, 373)

  const [oxLeftArm, oyLeftArm] = isAlexModel ? [391, 373] : [383, 373];

  //   drawLeftArm((ox, oy))

  drawLeftArm([oxLeftArm, oyLeftArm]);

  //   Generator.defineRegionInput((ox, oy, isAlexModel ? 112 : 128, 166), () => {
  //     Generator.setBooleanInputValue("Show Left Arm Overlay", !showLeftArmOverlay)
  //   })

  generator.defineRegionInput(
    [oxLeftArm, oyLeftArm, isAlexModel ? 112 : 128, 166],
    () => {
      generator.setBooleanInputValue(
        "Show Left Arm Overlay",
        !showLeftArmOverlay
      );
    }
  );

  //   // Right Leg
  //   let (ox, oy) = (99, 587)

  const [oxRightLeg, oyRightLeg] = [99, 587];

  //   drawRightLeg((ox, oy))

  drawRightLeg([oxRightLeg, oyRightLeg]);

  //   Generator.defineRegionInput((ox, oy, 128, 160), () => {
  //     Generator.setBooleanInputValue("Show Right Leg Overlay", !showRightLegOverlay)
  //   })

  generator.defineRegionInput([oxRightLeg, oyRightLeg, 128, 160], () => {
    generator.setBooleanInputValue(
      "Show Right Leg Overlay",
      !showRightLegOverlay
    );
  });

  //   // Left Leg
  //   let (ox, oy) = (383, 587)

  const [oxLeftLeg, oyLeftLeg] = [383, 587];

  //   drawLeftLeg((ox, oy))

  drawLeftLeg([oxLeftLeg, oyLeftLeg]);

  //   Generator.defineRegionInput((ox, oy, 128, 160), () => {
  //     Generator.setBooleanInputValue("Show Left Leg Overlay", !showLeftLegOverlay)
  //   })

  generator.defineRegionInput([oxLeftLeg, oyLeftLeg, 128, 160], () => {
    generator.setBooleanInputValue(
      "Show Left Leg Overlay",
      !showLeftLegOverlay
    );
  });

  //   // Folds
  //   if showFolds {
  //     drawFolds()
  //   }

  if (showFolds) {
    drawFolds();
  }

  //   // Labels
  //   if showLabels {
  //     Generator.drawImage("Labels", (0, 0))
  //   }

  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }
};

// let generator: Generator.generatorDef = {
//   id: id,
//   name: name,
//   history: history,
//   thumbnail: Some(thumbnail),
//   video: None,
//   instructions: Some(<Generator.Markdown> {instructions} </Generator.Markdown>),
//   images: images,
//   textures: textures,
//   script: script,
// }

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
