"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import { Dimensions, old } from "../_common/minecraftCharacter";
import thumbnailImage from "./thumbnail/v1-thumbnail-256.jpeg";

import foregroundImage from "./images/Foreground.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import foregroundShouldersImage from "./images/Foreground-Shoulders.png";
import foldsShouldersImage from "./images/Folds-Shoulders.png";

import enchantedGlint from "./textures/enchanted_glint_entity.png";

import steveTexture from "./textures/steve.png";
import alexTexture from "./textures/alex.png";
import debugTexture from "./textures/SkinSteveReference64x64.png";
import helmetTexture from "./textures/diamond_layer_1.png";
import chestplateTexture from "./textures/diamond_layer_1.png";
import leggingsTexture from "./textures/diamond_layer_2.png";
import bootsTexture from "./textures/diamond_layer_1.png";
import helmetOverlayTexture from "./textures/leather_layer_1_overlay.png";
import chestplateOverlayTexture from "./textures/leather_layer_1_overlay.png";
import leggingsOverlayTexture from "./textures/leather_layer_2_overlay.png";
import bootsOverlayTexture from "./textures/leather_layer_1_overlay.png";
import chainmail1Texture from "./textures/chainmail_layer_1.png";
import chainmail2Texture from "./textures/chainmail_layer_2.png";
import diamond2Texture from "./textures/diamond_layer_2.png";
import gold1Texture from "./textures/gold_layer_1.png";
import gold2Texture from "./textures/gold_layer_2.png";
import iron1Texture from "./textures/iron_layer_1.png";
import iron2Texture from "./textures/iron_layer_2.png";
import netherite1Texture from "./textures/netherite_layer_1.png";
import netherite2Texture from "./textures/netherite_layer_2.png";
import leather1Texture from "./textures/leather_layer_1.png";
import leather2Texture from "./textures/leather_layer_2.png";
import leather1OverlayTexture from "./textures/leather_layer_1_overlay.png";
import leather2OverlayTexture from "./textures/leather_layer_2_overlay.png";
import turtleShellTexture from "./textures/turtle_layer_1.png";
import notchTexture from "./textures/Notch.png";
import { Minecraft } from "../_common/minecraft";

const id = "minecraft-armor";
const name = "Minecraft Armor";

const history: HistoryDef = [];

const instructions = `
## How to use the Minecraft Armor Generator?

### Choosing the Armor
* Select from the drop down menu under each armor part which material you want for each piece of armor.
* Alternatively, you can select "Choose file" to provide your own armor texture files.
* If your custom helmet texture has an overlay layer, you can click on the helmet to toggle on and off the overlay layer.
* If a part of the design doesn't look right for your armor texture, you can try clicking on that part in the papercraft template to adjust that part.

### Armor Options
* For each armor part, there are a few options you can select from:
#### Tint Armor
  - Select from the drop down menu what color you want to tint the armor.
  - Select either from the drop down menu or from "Choose file" to choose the overlay that goes over the tinted part of the armor.
#### Trim Armor
  - Select either from the drop down menu or from "Choose file" to choose which trim pattern to apply to the armor.
  - Select either from the drop down menu or select "Choose file" to choose the material that the trim is made out of.
#### Enchant Armor
  - Coming Soon???
`;

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Foreground", url: foregroundImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Labels", url: labelsImage.src },
  { id: "Foreground-Shoulders", url: foregroundShouldersImage.src },
  { id: "Folds-Shoulders", url: foldsShouldersImage.src },
];

const textures: TextureDef[] = [
  { id: "Steve", url: steveTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Alex", url: alexTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Debug", url: debugTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Helmet", url: helmetTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Chestplate", url: chestplateTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Leggings", url: leggingsTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Boots", url: bootsTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Helmet Overlay", url: helmetOverlayTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Chestplate Overlay", url: chestplateOverlayTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Leggings Overlay", url: leggingsOverlayTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Boots Overlay", url: bootsOverlayTexture.src, standardWidth: 64, standardHeight: 64 },
  { id: "Chainmail", url: chainmail1Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Chainmail ", url: chainmail2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Diamond", url: helmetTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Diamond ", url: diamond2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Gold", url: gold1Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Gold ", url: gold2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Iron", url: iron1Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Iron ", url: iron2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Netherite", url: netherite1Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Netherite ", url: netherite2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leather", url: leather1Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leather ", url: leather2Texture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leather Overlay", url: leather1OverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leather Overlay ", url: leather2OverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Turtle Shell", url: turtleShellTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Notch", url: notchTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Enchanted Glint", url: enchantedGlint.src, standardWidth: 128, standardHeight: 128 },
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);

  const char = old;

  // Chestplate inputs
  generator.defineTextureInput("Chestplate", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Leather", "Chainmail", "Gold", "Iron", "Diamond", "Netherite"],
  });
  generator.defineBooleanInput("Tint Chestplate", false);
  const tintChestplate = generator.getBooleanInputValue("Tint Chestplate");
  if (tintChestplate) {
    generator.defineSelectInput("Chestplate Color", [
      "Leather", "Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan",
      "Light Gray", "Gray", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White",
    ]);
    generator.defineTextureInput("Chestplate Overlay", {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Leather Overlay"],
    });
  }

  // Leggings inputs
  generator.defineTextureInput("Leggings", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Leather ", "Chainmail ", "Gold ", "Iron ", "Diamond ", "Netherite "],
  });
  generator.defineBooleanInput("Tint Leggings", false);
  const tintLeggings = generator.getBooleanInputValue("Tint Leggings");
  if (tintLeggings) {
    generator.defineSelectInput("Leggings Color", [
      "Leather", "Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan",
      "Light Gray", "Gray", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White",
    ]);
    generator.defineTextureInput("Leggings Overlay", {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Leather Overlay "],
    });
  }

  // Boots inputs
  generator.defineTextureInput("Boots", {
    standardWidth: 64,
    standardHeight: 64,
    choices: ["Leather", "Chainmail", "Gold", "Iron", "Diamond", "Netherite"],
  });
  generator.defineBooleanInput("Tint Boots", false);
  const tintBoots = generator.getBooleanInputValue("Tint Boots");
  if (tintBoots) {
    generator.defineSelectInput("Boots Color", [
      "Leather", "Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan",
      "Light Gray", "Gray", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White",
    ]);
    generator.defineTextureInput("Boots Overlay", {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Leather Overlay"],
    });
  }

  function rgbaToHex([r, g, b, a]: [number, number, number, number]): string {
    const toHex = (value: number) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(a)}`;
  }
  
  function getTexturePixelColor(id: string, x: number, y: number): string {
    const color = generator.getTexturePixelColor(id, x, y);
    return color ? rgbaToHex(color) : "Unknown";
  }
  
  function getPalette(id: string, length: number): string[] {
    return Array.from({ length }, (_, i) => getTexturePixelColor(id, i, 0));
  }
  
  const baseColors = getPalette("Trim Palette  ", 8);
  
  function shoulderAlpha(textureId: string): number {
    const color = generator.getTexturePixelColor(textureId, 51, 24);
    const a = color ? color[3] : 33;
    console.log(`${textureId}: ${a}`);
    return a;
  }

  function drawHelmetHead(
    textureId: string,
    showHeadOverlay: boolean,
    tint: string
  ) {
    const ox = 41;
    const oy = 21;
    const dimensions: Dimensions = [80, 80, 80];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
    }
  }
  
  function drawHelmetLiner(
    textureId: string,
    showHeadOverlay: boolean,
    tint: string
  ) {
    const ox = 329;
    const oy = 37;
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint }, rotate: 90 });
    generator.drawTexture(textureId, [0, 16, 8, 2], [ox + 100, oy + 28, 64, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    generator.drawTexture(textureId, [16, 16, 8, 2], [ox + 100, oy + 156, 64, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint }, rotate: 90 });
      generator.drawTexture(textureId, [32, 16, 8, 2], [ox + 100, oy + 28, 64, 8], {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 90,
      });
      generator.drawTexture(textureId, [48, 16, 8, 2], [ox + 100, oy + 156, 64, 8], {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 90,
      });
    }
  }
  
  function drawChestplateBody(textureId: string, tint: string) {
    const ox = 185;
    const oy = 309;
    const dimensions: Dimensions = [64, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.body, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, char.base.body.back, [ox + 48, oy - 96, 64, 96], {
      rotate: 180,
      blend: { kind: "MultiplyHex", hex: tint },
    });
    generator.drawTexture(textureId, [33, 48, 6, 16], [ox + 112, oy - 96, 48, 64], {
      rotate: 180,
      blend: { kind: "MultiplyHex", hex: tint },
    });
    generator.drawTexture(textureId, [20, 44, 8, 2], [ox + 48, oy, 64, 48], { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [20, 42, 8, 2], [ox + 48, oy, 64, 48], { blend: { kind: "MultiplyHex", hex: tint } });
  }
  
  function drawRightShoulder(textureId: string, tint: string) {
    const ox = -27;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];
   /* if (shoulderAlpha(textureId) === 0) {
      generator.drawTexture(textureId, char.base.rightArm.left, [ox + 100, oy + 92, 48, 96], {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 270,
      });
    } */
    minecraftGenerator.drawCuboid(textureId, char.base.rightArm, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    generator.drawTexture(textureId, char.base.rightArm.back, [ox + 192, oy + 88, 40, 96], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 270,
    });
    generator.drawTexture(textureId, char.base.rightArm.back, [ox + 192, oy + 48, 40, 96], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 270,
    });
  }
  
  function drawLeftShoulder(textureId: string, tint: string) {
    const ox = 445;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];
    /* if (shoulderAlpha(textureId) === 0) {
      generator.drawTexture(textureId, char.base.leftArm.left, [ox + 28, oy + 92, 48, 96], {
        blend: { kind: "MultiplyHex", hex: tint },
        flip: "Horizontal",
        rotate: 90,
      });
    } */
    minecraftGenerator.drawCuboid(textureId, char.base.leftArm, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
      rotate: 270,
    });
    generator.drawTexture(textureId, char.base.leftArm.back, [ox - 56, oy + 88, 40, 96], {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
      rotate: 90,
    });
    generator.drawTexture(textureId, char.base.leftArm.back, [ox - 56, oy + 48, 40, 96], {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
      rotate: 90,
    });
  }
  
  function drawLeggingsBody(textureId: string, tint: string) {
    const ox = 193;
    const oy = 385;
    const dimensions: Dimensions = [64, 104, 40];
    generator.drawTexture(textureId, [0, 40, 4, 24], [ox, oy + 135, 40, 104], { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [0, 40, 4, 24], [ox + 104, oy + 135, 40, 104], {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
    });
    minecraftGenerator.drawCuboid(textureId, char.base.body, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
  }
  
  function drawRightLegging(textureId: string, tint: string) {
    const ox = 49;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [16, 40, 4, 24], [ox, oy - 55, 40, 104], { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [0, 40, 4, 8], [ox + 72, oy + 20, 40, 34], { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [16, 40, 4, 24], [ox + 72, oy - 75, 40, 104], { blend: { kind: "MultiplyHex", hex: tint } });
  }
  
  function drawLeftLegging(textureId: string, tint: string) {
    const ox = 401;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
    });
    generator.drawTexture(textureId, [28, 40, 4, 24], [ox + 104, oy - 55, 40, 104], { blend: { kind: "MultiplyHex", hex: tint } });
    generator.drawTexture(textureId, [0, 40, 4, 8], [ox + 32, oy + 20, 40, 34], {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
    });
    generator.drawTexture(textureId, [28, 40, 4, 24], [ox + 32, oy - 75, 40, 104], {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
    });
  }
  
  function drawRightBoot(textureId: string, tint: string) {
    const ox = 35;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [ox, oy], dimensions, { blend: { kind: "MultiplyHex", hex: tint } });
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [169, 613], [32, 96, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 270,
      center: "Back",
    });
  }
  
  function drawLeftBoot(textureId: string, tint: string) {
    const ox = 383;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
      flip: "Horizontal",
    });
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [297, 613], [32, 96, 32], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
      center: "Back",
      flip: "Horizontal",
    });
  }
  
  function drawFolds() {
    generator.drawImage("Folds", [0, 0]);
    // Later replace with drawLineFold functions
  }

  function drawHelmetHead(textureId: string, showHeadOverlay: boolean, tint: string) {
    const ox = 41;
    const oy = 21;
    const dimensions: Dimensions = [80, 80, 80];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
    });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, {
        blend: { kind: "MultiplyHex", hex: tint },
      });
    }
  }
  
  function drawHelmetLiner(textureId: string, showHeadOverlay: boolean, tint: string) {
    const ox = 329;
    const oy = 37;
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    generator.drawTexture(textureId, [0, 16, 8, 2], [ox + 100, oy + 28, 64, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    generator.drawTexture(textureId, [16, 16, 8, 2], [ox + 100, oy + 156, 64, 8], {
      blend: { kind: "MultiplyHex", hex: tint },
      rotate: 90,
    });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 90,
      });
      generator.drawTexture(textureId, [32, 16, 8, 2], [ox + 100, oy + 28, 64, 8], {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 90,
      });
      generator.drawTexture(textureId, [48, 16, 8, 2], [ox + 100, oy + 156, 64, 8], {
        blend: { kind: "MultiplyHex", hex: tint },
        rotate: 90,
      });
    }
  }
  
  function drawHelmet(showHeadOverlay: boolean) {
    generator.defineTextureInput("Helmet", {
      standardWidth: 64,
      standardHeight: 64,
      choices: ["Leather", "Chainmail", "Gold", "Iron", "Diamond", "Netherite", "Turtle Shell"],
    });
    generator.defineBooleanInput("Tint Helmet", false);
    const tintHelmet = generator.getBooleanInputValue("Tint Helmet");
    if (tintHelmet) {
      generator.defineSelectInput("Helmet Color", [
        "Leather", "Black", "Red", "Green", "Brown", "Blue", "Purple", "Cyan",
        "Light Gray", "Gray", "Pink", "Lime", "Yellow", "Light Blue", "Magenta", "Orange", "White",
      ]);
      generator.defineTextureInput("Helmet Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
    }
    generator.defineBooleanInput("Show Head Overlay", true);
    const tint = tintHelmet ? getTint("Helmet Color") : "None";
  
    drawHelmetHead("Helmet", showHeadOverlay, tint);
    drawHelmetLiner("Helmet", showHeadOverlay, tint);
  
    if (tintHelmet) {
      generator.defineTextureInput("Helmet Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawHelmetHead("Helmet Overlay", showHeadOverlay, "None");
      drawHelmetLiner("Helmet Overlay", showHeadOverlay, "None");
    }
  
    generator.defineRegionInput([41, 21, 320, 160], () => {
      generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay);
    });
  }
  
  function drawChestplate() {
    generator.defineTextureInput("Chestplate", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials,
    });
  
    const tintChestplate = generator.defineAndGetBooleanInput("Tint Chestplate", false);
    const tint = tintChestplate ? getTint("Chestplate Color") : "FFFFFF";
  
    drawChestplateBody("Chestplate", { kind: "MultiplyHex", hex: tint });
    drawLeftShoulder("Chestplate", { kind: "MultiplyHex", hex: tint });
    drawRightShoulder("Chestplate", { kind: "MultiplyHex", hex: tint });
  
    if (tintChestplate) {
      generator.defineTextureInput("Chestplate Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawChestplateBody("Chestplate Overlay", { kind: "None" });
      drawLeftShoulder("Chestplate Overlay", { kind: "None" });
      drawRightShoulder("Chestplate Overlay", { kind: "None" });
    }
  }
  
  function drawLeggings() {
    generator.defineTextureInput("Leggings", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials2,
    });
  
    const tintLeggings = generator.defineAndGetBooleanInput("Tint Leggings", false);
    const tint = tintLeggings ? getTint("Leggings Color") : "FFFFFF";
  
    drawLeggingsBody("Leggings", { kind: "MultiplyHex", hex: tint });
    drawRightLegging("Leggings", { kind: "MultiplyHex", hex: tint });
    drawLeftLegging("Leggings", { kind: "MultiplyHex", hex: tint });
  
    if (tintLeggings) {
      generator.defineTextureInput("Leggings Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay "],
      });
      drawLeggingsBody("Leggings Overlay", { kind: "None" });
      drawRightLegging("Leggings Overlay", { kind: "None" });
      drawLeftLegging("Leggings Overlay", { kind: "None" });
    }
  }
  
  function drawBoots() {
    generator.defineTextureInput("Boots", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials,
    });
  
    const tintBoots = generator.defineAndGetBooleanInput("Tint Boots", false);
    const tint = tintBoots ? getTint("Boots Color") : "FFFFFF";
  
    drawLeftBoot("Boots", tint);
    drawRightBoot("Boots", tint);
  
    if (tintBoots) {
      generator.defineTextureInput("Boots Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawLeftBoot("Boots Overlay", "FFFFFF");
      drawRightBoot("Boots Overlay", "FFFFFF");
    }
  }
  
  // function drawHelmetTrim(showHeadOverlay: boolean) {
  //   generator.defineTextureInput("Helmet Trim", {
  //     standardWidth: 64,
  //     standardHeight: 64,
  //     choices: trimTemplates,
  //   });
  //   generator.defineTextureInput("Helmet Trim Material", {
  //     standardWidth: 8,
  //     standardHeight: 1,
  //     choices: trimMaterials,
  //   });
  //   const colors = getPalette("Helmet Trim Material", 8);
  //   drawHelmetHead("Helmet Trim", showHeadOverlay, { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawHelmetLiner("Helmet Trim", showHeadOverlay, { kind: "ReplaceHex", from: baseColors, to: colors });
  // }
  
  // function drawChestplateTrim() {
  //   generator.defineTextureInput("Chestplate Trim", {
  //     standardWidth: 64,
  //     standardHeight: 64,
  //     choices: trimTemplates,
  //   });
  //   generator.defineTextureInput("Chestplate Trim Material", {
  //     standardWidth: 8,
  //     standardHeight: 1,
  //     choices: trimMaterials,
  //   });
  //   const colors = getPalette("Chestplate Trim Material", 8);
  //   drawChestplateBody("Chestplate Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawLeftShoulder("Chestplate Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawRightShoulder("Chestplate Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  // }
  
  // function drawLeggingsTrim() {
  //   generator.defineTextureInput("Leggings Trim", {
  //     standardWidth: 64,
  //     standardHeight: 64,
  //     choices: trimTemplates2,
  //   });
  //   generator.defineTextureInput("Leggings Trim Material", {
  //     standardWidth: 8,
  //     standardHeight: 1,
  //     choices: trimMaterials,
  //   });
  //   const colors = getPalette("Leggings Trim Material", 8);
  //   drawLeggingsBody("Leggings Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawRightLegging("Leggings Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawLeftLegging("Leggings Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  // }
  
  // function drawBootsTrim() {
  //   generator.defineTextureInput("Boots Trim", {
  //     standardWidth: 64,
  //     standardHeight: 64,
  //     choices: trimTemplates,
  //   });
  //   generator.defineTextureInput("Boots Trim Material", {
  //     standardWidth: 8,
  //     standardHeight: 1,
  //     choices: trimMaterials,
  //   });
  //   const colors = getPalette("Boots Trim Material", 8);
  //   drawLeftBoot("Boots Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  //   drawRightBoot("Boots Trim", { kind: "ReplaceHex", from: baseColors, to: colors });
  // }

  // Define user inputs
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");


  // Draw
  // drawHelmetHead(...)
  // drawHelmetLiner(...)
  // drawChestplateBody(...)
  // drawRightShoulder(...)
  // drawLeftShoulder(...)
  // drawLeggingsBody(...)
  // drawRightLegging(...)
  // drawLeftLegging(...)
  // drawRightBoot(...)
  // drawLeftBoot(...)
  // drawHelmetTrim(...)
  // drawChestplateTrim(...)
  // drawLeggingsTrim(...)
  // drawBootsTrim(...)

  // Draw Folds

  // Foreground
  generator.drawImage("Foreground", [0, 0])

  // Folds

  if (showFolds) {
    drawFolds()
  }

  // Shoulder Curve
  /* if (
    shoulderAlpha("Chestplate") == 0 &&
      (shoulderAlpha("Chestplate Trim") == 33 ||
      !trimChestplate ||
      shoulderAlpha("Chestplate Trim") == 0)
  ) {
    generator.drawImage("Foreground-Shoulders", [0, 0])
    if (showFolds) {
      generator.drawImage("Folds-Shoulders", [0, 0])
    }
  } */

  // (Chestplate.isEmpty() && (trim.isEmpty() || !trim.exists()))

  // Labels

  if (showLabels) {
    generator.drawImage("Labels", [0, 0])
  }

  generator.fillBackgroundColorWithWhite()
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video: null,
  instructions,
  images,
  textures,
  script,
};
