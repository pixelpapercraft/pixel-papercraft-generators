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
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpg";

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
import coastTexture from "./textures/trims/models/armor/coast.png";
import coastLeggingsTexture from "./textures/trims/models/armor/coast_leggings.png";
import duneTexture from "./textures/trims/models/armor/dune.png";
import duneLeggingsTexture from "./textures/trims/models/armor/dune_leggings.png";
import eyeTexture from "./textures/trims/models/armor/eye.png";
import eyeLeggingsTexture from "./textures/trims/models/armor/eye_leggings.png";
import hostTexture from "./textures/trims/models/armor/host.png";
import hostLeggingsTexture from "./textures/trims/models/armor/host_leggings.png";
import raiserTexture from "./textures/trims/models/armor/raiser.png";
import raiserLeggingsTexture from "./textures/trims/models/armor/raiser_leggings.png";
import ribTexture from "./textures/trims/models/armor/rib.png";
import ribLeggingsTexture from "./textures/trims/models/armor/rib_leggings.png";
import sentryTexture from "./textures/trims/models/armor/sentry.png";
import sentryLeggingsTexture from "./textures/trims/models/armor/sentry_leggings.png";
import shaperTexture from "./textures/trims/models/armor/shaper.png";
import shaperLeggingsTexture from "./textures/trims/models/armor/shaper_leggings.png";
import silenceTexture from "./textures/trims/models/armor/silence.png";
import silenceLeggingsTexture from "./textures/trims/models/armor/silence_leggings.png";
import snoutTexture from "./textures/trims/models/armor/snout.png";
import snoutLeggingsTexture from "./textures/trims/models/armor/snout_leggings.png";
import spireTexture from "./textures/trims/models/armor/spire.png";
import spireLeggingsTexture from "./textures/trims/models/armor/spire_leggings.png";
import tideTexture from "./textures/trims/models/armor/tide.png";
import tideLeggingsTexture from "./textures/trims/models/armor/tide_leggings.png";
import vexTexture from "./textures/trims/models/armor/vex.png";
import vexLeggingsTexture from "./textures/trims/models/armor/vex_leggings.png";
import wardTexture from "./textures/trims/models/armor/ward.png";
import wardLeggingsTexture from "./textures/trims/models/armor/ward_leggings.png";
import wayfinderTexture from "./textures/trims/models/armor/wayfinder.png";
import wayfinderLeggingsTexture from "./textures/trims/models/armor/wayfinder_leggings.png";
import wildTexture from "./textures/trims/models/armor/wild.png";
import wildLeggingsTexture from "./textures/trims/models/armor/wild_leggings.png";
import amethystTexture from "./textures/trims/color_palettes/amethyst.png";
import copperTexture from "./textures/trims/color_palettes/copper.png";
import diamondDarkerTexture from "./textures/trims/color_palettes/diamond_darker.png";
import diamondTexture from "./textures/trims/color_palettes/diamond.png";
import emeraldTexture from "./textures/trims/color_palettes/emerald.png";
import goldDarkerTexture from "./textures/trims/color_palettes/gold_darker.png";
import goldTexture from "./textures/trims/color_palettes/gold.png";
import ironDarkerTexture from "./textures/trims/color_palettes/iron_darker.png";
import ironTexture from "./textures/trims/color_palettes/iron.png";
import lapisTexture from "./textures/trims/color_palettes/lapis.png";
import netheriteDarkerTexture from "./textures/trims/color_palettes/netherite_darker.png";
import netheriteTexture from "./textures/trims/color_palettes/netherite.png";
import quartzTexture from "./textures/trims/color_palettes/quartz.png";
import redstoneTexture from "./textures/trims/color_palettes/redstone.png";
import trimPaletteTexture from "./textures/trims/color_palettes/trim_palette.png";

import { Minecraft } from "../_common/minecraft";
import { Blend } from "@genroot/builder/modules/renderers/drawTexture";
import { Color } from "@genroot/builder/modules/canvasWithContext";

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
  { id: "Helmet", url: helmetTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Chestplate", url: chestplateTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leggings", url: leggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Boots", url: bootsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Helmet Overlay", url: helmetOverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Chestplate Overlay", url: chestplateOverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leggings Overlay", url: leggingsOverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Boots Overlay", url: bootsOverlayTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Helmet Trim", url: silenceTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Chestplate Trim", url: silenceTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Leggings Trim", url: silenceLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Boots Trim", url: silenceTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Helmet Trim Material", url: netheriteTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Chestplate Trim Material", url: netheriteTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Leggings Trim Material", url: netheriteTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Boots Trim Material", url: netheriteTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Chainmail", url: chainmail1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Chainmail ", url: chainmail2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Diamond", url: helmetTexture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Diamond ", url: diamond2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Gold", url: gold1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Gold ", url: gold2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Iron", url: iron1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Iron ", url: iron2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Netherite", url: netherite1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Netherite ", url: netherite2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Leather", url: leather1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Leather ", url: leather2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Leather Overlay", url: leather1OverlayTexture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Leather Overlay ", url: leather2OverlayTexture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Turtle Shell", url: turtleShellTexture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Notch", url: notchTexture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Enchanted Glint", url: enchantedGlint.src, standardWidth: 128, standardHeight: 128 },
  { id: "Coast", url: coastTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Coast ", url: coastLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Dune", url: duneTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Dune ", url: duneLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Eye", url: eyeTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Eye ", url: eyeLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Host", url: hostTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Host ", url: hostLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Raiser", url: raiserTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Raiser ", url: raiserLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Rib", url: ribTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Rib ", url: ribLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Sentry", url: sentryTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Sentry ", url: sentryLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Shaper", url: shaperTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Shaper ", url: shaperLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Silence", url: silenceTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Silence ", url: silenceLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Snout", url: snoutTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Snout ", url: snoutLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Spire", url: spireTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Spire ", url: spireLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Tide", url: tideTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Tide ", url: tideLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Vex", url: vexTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Vex ", url: vexLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Ward", url: wardTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Ward ", url: wardLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Wayfinder", url: wayfinderTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Wayfinder ", url: wayfinderLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Wild", url: wildTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Wild ", url: wildLeggingsTexture.src, standardWidth: 64, standardHeight: 32 },
  { id: "Amethyst  ", url: amethystTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Copper  ", url: copperTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Diamond  ", url: diamondTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Diamond Darker  ", url: diamondDarkerTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Emerald  ", url: emeraldTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Gold  ", url: goldTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Gold Darker  ", url: goldDarkerTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Iron  ", url: ironTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Iron Darker  ", url: ironDarkerTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Lapis  ", url: lapisTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Netherite  ", url: netheriteTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Netherite Darker  ", url: netheriteDarkerTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Quartz  ", url: quartzTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Redstone  ", url: redstoneTexture.src, standardWidth: 8, standardHeight: 1 },
  { id: "Trim Palette  ", url: trimPaletteTexture.src, standardWidth: 8, standardHeight: 1 },

];

const materials = ["Leather", "Chainmail", "Gold", "Iron", "Diamond", "Netherite"];
const materials2 = ["Leather ", "Chainmail ", "Gold ", "Iron ", "Diamond ", "Netherite "];
const trimMaterials = ["Amethyst  ", "Copper  ", "Diamond  ", "Diamond Darker  ", "Emerald  ", "Gold  ", "Gold Darker  ", "Iron  ", "Iron Darker  ", "Lapis  ", "Netherite  ", "Netherite Darker  ", "Quartz  ", "Redstone  "];
const trimTemplates = ["Coast", "Dune", "Eye", "Host", "Raiser", "Rib", "Sentry", "Shaper", "Silence", "Snout", "Spire", "Tide", "Vex", "Ward", "Wayfinder", "Wild"];
const trimTemplates2 = ["Coast ", "Dune ", "Eye ", "Host ", "Raiser ", "Rib ", "Sentry ", "Shaper ", "Silence ", "Snout ", "Spire ", "Tide ", "Vex ", "Ward ", "Wayfinder ", "Wild "];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);

  const char = old;

  function getTint(colorId: string): Blend {
    generator.defineSelectInput(colorId, [
      "Leather",
      "Black",
      "Red",
      "Green",
      "Brown",
      "Blue",
      "Purple",
      "Cyan",
      "Light Gray",
      "Gray",
      "Pink",
      "Lime",
      "Yellow",
      "Light Blue",
      "Magenta",
      "Orange",
      "White",
    ],)

    const hex = (() => {
      switch (generator.getSelectInputValue(colorId)) {
        case "Leather":
          return "A06540";
        case "Black":
          return "1D1D21";
        case "Red":
          return "B02E26";
        case "Green":
          return "5E7C16";
        case "Brown":
          return "835432";
        case "Blue":
          return "3C44AA";
        case "Purple":
          return "8932B8";
        case "Cyan":
          return "169C9C";
        case "Light Gray":
          return "9D9D97";
        case "Gray":
          return "474F52";
        case "Pink":
          return "F38BAA";
        case "Lime":
          return "80C71F";
        case "Yellow":
          return "FED83D";
        case "Light Blue":
          return "3AB3DA";
        case "Magenta":
          return "C74EBD";
        case "Orange":
          return "F9801D";
        case "White":
          return "F9FFFE";
        default:
          return "A06540";
      }
    })();

    return { kind: "MultiplyHex", hex: hex };
  }
  
  function getPalette(id: string, length: number): Color[] {
    return Array.from({ length }, (_, i) => {
      const color = generator.getTexturePixelColor(id, [i, 0]);
      return color ?? { r: 0, g: 0, b: 0, a: 255 };
    });
  }
  
  const baseColors = getPalette("Trim Palette  ", 8);
  
  function shoulderAlpha(textureId: string): number {
    const color = generator.getTexturePixelColor(textureId, [51, 24]);
    const a = color ? color.a : 33;
    console.log(`${textureId}: ${a}`);
    return a;
  } 

  function drawHelmetHead(
    textureId: string,
    showHeadOverlay: boolean,
    tint: Blend
  ) {
    const ox = 41;
    const oy = 21;
    const dimensions: Dimensions = [80, 80, 80];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, { blend: tint });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, { blend: tint });
    }
  }
  
  function drawHelmetLiner(
    textureId: string,
    showHeadOverlay: boolean,
    tint: Blend
  ) {
    const ox = 329;
    const oy = 37;
    const dimensions: Dimensions = [64, 64, 64];
    minecraftGenerator.drawCuboid(textureId, char.base.head, [ox, oy], dimensions, { blend: tint, rotate: 90 });
    generator.drawTexture(textureId, [0, 8, 8, 1], [ox + 100, oy + 28, 64, 8], {
      blend: tint,
      rotate: 90,
    });
    generator.drawTexture(textureId, [16, 8, 8, 1], [ox + 100, oy + 156, 64, 8], {
      blend: tint,
      rotate: 90,
    });
    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(textureId, char.overlay.head, [ox, oy], dimensions, { blend: tint, rotate: 90 });
      generator.drawTexture(textureId, [32, 8, 8, 1], [ox + 100, oy + 28, 64, 8], {
        blend: tint,
        rotate: 90,
      });
      generator.drawTexture(textureId, [48, 8, 8, 1], [ox + 100, oy + 156, 64, 8], {
        blend: tint,
        rotate: 90,
      });
    }
  }
  
  function drawChestplateBody(textureId: string, tint: Blend) {
    const ox = 185;
    const oy = 309;
    const dimensions: Dimensions = [64, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.body, [ox, oy], dimensions, { blend: tint });
    generator.drawTexture(textureId, char.base.body.back, [ox + 48, oy - 96, 64, 96], {
      rotate: 180,
      blend: tint,
    }); // Back texture that goes around over the head
    generator.drawTexture(textureId, [33, 24, 6, 8], [ox + 112, oy - 96, 48, 64], {
      rotate: 180,
      blend: tint,
    }); // Tab that goes inside the back face
    generator.drawTexture(textureId, [20, 22, 8, 1], [ox + 48, oy, 64, 48], { blend: tint });
    generator.drawTexture(textureId, [20, 21, 8, 1], [ox + 48, oy, 64, 48], { blend: tint });
  }

  /*shoulder logic:
  if chestplate has empty shoulder:
    draw added back layer.
    draw shoulder background & folds.
    draw usual shoulder- over any part of the background that doesn't need to be covered.
  if chestplate trim has empty shoulder:
    draw ????

    when there is a thing where there is a need for the exptra part but the normal body covers up some of the foreground. then it needs to do so. This can happen by making it so that the foreground is drawn in between the first and the second thingy. But is this alright for the silence trim?
  
  
  */

  
  function drawRightShoulder(textureId: string, tint: Blend, shoulderOverlay: boolean) {
    const ox = -27;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];
   if (shoulderAlpha(textureId) === 0 && shoulderOverlay) {
      generator.drawTexture(textureId, char.base.rightArm.left, [ox + 100, oy + 92, 48, 96], {
        blend: tint,
        rotate: 270,
      });
    } 
    minecraftGenerator.drawCuboid(textureId, char.base.rightArm, [ox, oy], dimensions, {
      blend: tint,
      rotate: 90,
    });
    generator.drawTexture(textureId, char.base.rightArm.back, [ox + 192, oy + 88, 40, 96], {
      blend: tint,
      rotate: 270,
    });
    generator.drawTexture(textureId, char.base.rightArm.back, [ox + 192, oy + 48, 40, 96], {
      blend: tint,
      rotate: 270,
    });
  }
  
  function drawLeftShoulder(textureId: string, tint: Blend, shoulderOverlay: boolean) {
    const ox = 445;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];
    if (shoulderAlpha(textureId) === 0 && shoulderOverlay) {
      generator.drawTexture(textureId, char.base.leftArm.left, [ox + 28, oy + 92, 48, 96], {
        blend: tint,
        flip: "Horizontal",
        rotate: 90,
      });
    } 
    minecraftGenerator.drawCuboid(textureId, char.base.leftArm, [ox, oy], dimensions, {
      blend: tint,
      flip: "Horizontal",
      rotate: 270,
    });
    generator.drawTexture(textureId, char.base.leftArm.back, [ox - 56, oy + 88, 40, 96], {
      blend: tint,
      flip: "Horizontal",
      rotate: 90,
    });
    generator.drawTexture(textureId, char.base.leftArm.back, [ox - 56, oy + 48, 40, 96], {
      blend: tint,
      flip: "Horizontal",
      rotate: 90,
    });
  }
  
  function drawLeggingsBody(textureId: string, tint: Blend) {
    const ox = 193;
    const oy = 385;
    const dimensions: Dimensions = [64, 104, 40];
    generator.drawTexture(textureId, [0, 20, 4, 12], [ox, oy + 135, 40, 104], { blend: tint });
    generator.drawTexture(textureId, [0, 20, 4, 12], [ox + 104, oy + 135, 40, 104], {
      blend: tint,
      flip: "Horizontal",
    });
    minecraftGenerator.drawCuboid(textureId, char.base.body, [ox, oy], dimensions, { blend: tint });
  }
  
  function drawRightLegging(textureId: string, tint: Blend) {
    const ox = 49;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [ox, oy], dimensions, { blend: tint });
    generator.drawTexture(textureId, [16, 20, 4, 12], [ox, oy - 55, 40, 104], { blend: tint });
    generator.drawTexture(textureId, [0, 20, 4, 4], [ox + 72, oy + 20, 40, 34], { blend: tint });
    generator.drawTexture(textureId, [16, 20, 4, 12], [ox + 72, oy - 75, 40, 104], { blend: tint });
  }
  
  function drawLeftLegging(textureId: string, tint: Blend) {
    const ox = 401;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [ox, oy], dimensions, {
      blend: tint,
      flip: "Horizontal",
    });
    generator.drawTexture(textureId, [28, 20, 4, 12], [ox + 104, oy - 55, 40, 104], { blend: tint });
    generator.drawTexture(textureId, [0, 20, 4, 4], [ox + 32, oy + 20, 40, 34], {
      blend: tint,
      flip: "Horizontal",
    });
    generator.drawTexture(textureId, [28, 20, 4, 12], [ox + 32, oy - 75, 40, 104], {
      blend: tint,
      flip: "Horizontal",
    });
  }
  
  function drawRightBoot(textureId: string, tint: Blend) {
    const ox = 35;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [ox, oy], dimensions, { blend: tint });
    minecraftGenerator.drawCuboid(textureId, char.base.rightLeg, [169, 613], [32, 96, 32], {
      blend: tint,
      rotate: 270,
      center: "Back",
    });
  }
  
  function drawLeftBoot(textureId: string, tint: Blend) {
    const ox = 383;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [ox, oy], dimensions, {
      blend: tint,
      flip: "Horizontal",
    });
    minecraftGenerator.drawCuboid(textureId, char.base.leftLeg, [297, 613], [32, 96, 32], {
      blend: tint,
      rotate: 90,
      center: "Back",
      flip: "Horizontal",
    });
  }
  
  function drawFolds() {
    generator.drawImage("Folds", [0, 0]);
    // Later replace with drawLineFold functions
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
    const tint: Blend = tintHelmet ? getTint("Helmet Color") : {kind: "None"};
  
    drawHelmetHead("Helmet", showHeadOverlay, tint);
    drawHelmetLiner("Helmet", showHeadOverlay, tint);
  
    if (tintHelmet) {
      generator.defineTextureInput("Helmet Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawHelmetHead("Helmet Overlay", showHeadOverlay, {kind: "None"});
      drawHelmetLiner("Helmet Overlay", showHeadOverlay, {kind: "None"});
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
    const tint: Blend = tintChestplate ? getTint("Chestplate Color") : {kind: "None"};
  
    drawChestplateBody("Chestplate", tint);
    drawLeftShoulder("Chestplate", tint, true);
    drawRightShoulder("Chestplate", tint, true);
  
    if (tintChestplate) {
      generator.defineTextureInput("Chestplate Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawChestplateBody("Chestplate Overlay", { kind: "None" });
      drawLeftShoulder("Chestplate Overlay", { kind: "None" }, true);
      drawRightShoulder("Chestplate Overlay", { kind: "None" }, true);
    }
  }
  
  function drawLeggings() {
    generator.defineTextureInput("Leggings", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials2,
    });
  
    const tintLeggings = generator.defineAndGetBooleanInput("Tint Leggings", false);
    const tint: Blend = tintLeggings ? getTint("Leggings Color") : {kind: "None"};
  
    drawLeggingsBody("Leggings", tint);
    drawRightLegging("Leggings", tint);
    drawLeftLegging("Leggings", tint);
  
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
    const tint: Blend = tintBoots ? getTint("Boots Color") : {kind: "None"};
  
    drawLeftBoot("Boots", tint);
    drawRightBoot("Boots", tint);
  
    if (tintBoots) {
      generator.defineTextureInput("Boots Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawLeftBoot("Boots Overlay", {kind: "None"});
      drawRightBoot("Boots Overlay", {kind: "None"});
    }
  }
  // Draw Trims
  function drawHelmetTrim(showHeadOverlay: boolean) {
    generator.defineTextureInput("Helmet Trim", {
      standardWidth: 64,
      standardHeight: 64,
      choices: trimTemplates,
    });
    generator.defineTextureInput("Helmet Trim Material", {
      standardWidth: 8,
      standardHeight: 1,
      choices: trimMaterials,
    });
    const colors = getPalette("Helmet Trim Material", 8);
    drawHelmetHead("Helmet Trim", showHeadOverlay, { kind: "ReplaceColor", color1: baseColors, color2: colors });
    drawHelmetLiner("Helmet Trim", showHeadOverlay, { kind: "ReplaceColor", color1: baseColors, color2: colors });
  }
  
  function drawChestplateTrim() {
    generator.defineTextureInput("Chestplate Trim", {
      standardWidth: 64,
      standardHeight: 64,
      choices: trimTemplates,
    });
    generator.defineTextureInput("Chestplate Trim Material", {
      standardWidth: 8,
      standardHeight: 1,
      choices: trimMaterials,
    });
    const colors = getPalette("Chestplate Trim Material", 8);
    drawChestplateBody("Chestplate Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
    drawLeftShoulder("Chestplate Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors }, true); // shoulderOverlay functionality disabled for now
    drawRightShoulder("Chestplate Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors }, true);
  }
  
  function drawLeggingsTrim() {
    generator.defineTextureInput("Leggings Trim", {
      standardWidth: 64,
      standardHeight: 64,
      choices: trimTemplates2,
    });
    generator.defineTextureInput("Leggings Trim Material", {
      standardWidth: 8,
      standardHeight: 1,
      choices: trimMaterials,
    });
    const colors = getPalette("Leggings Trim Material", 8);
    drawLeggingsBody("Leggings Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
    drawRightLegging("Leggings Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
    drawLeftLegging("Leggings Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
  }
  
  function drawBootsTrim() {
    generator.defineTextureInput("Boots Trim", {
      standardWidth: 64,
      standardHeight: 64,
      choices: trimTemplates,
    });
    generator.defineTextureInput("Boots Trim Material", {
      standardWidth: 8,
      standardHeight: 1,
      choices: trimMaterials,
    });
    const colors = getPalette("Boots Trim Material", 8);
    drawLeftBoot("Boots Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
    drawRightBoot("Boots Trim", { kind: "ReplaceColor", color1: baseColors, color2: colors });
  }

  // Draw Enchantment Glints
  function drawHelmetGlint(showHeadOverlay: boolean) {

      drawHelmetHead("Enchanted Glint", showHeadOverlay, {kind: "None"});
      drawHelmetLiner("Enchanted Glint", showHeadOverlay, {kind: "None"});

  }
  
  function drawChestplateGlint() {
  

      drawChestplateBody("Enchanted Glint", { kind: "None" });
      drawLeftShoulder("Enchanted Glint", { kind: "None" }, true);
      drawRightShoulder("Enchanted Glint", { kind: "None" }, true);
 
  }
  
  function drawLeggingsGlint() {

      drawLeggingsBody("Enchanted Glint", { kind: "None" });
      drawRightLegging("Enchanted Glint", { kind: "None" });
      drawLeftLegging("Enchanted Glint", { kind: "None" });

  }
  
  function drawBootsGlint() {

      drawLeftBoot("Enchanted Glint", {kind: "None"});
      drawRightBoot("Enchanted Glint", {kind: "None"});

  }

  // Define user inputs
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  const showHeadOverlay = generator.getBooleanInputValueWithDefault("Show Head Overlay", true);


  // Draw
  // Helmet
  drawHelmet(showHeadOverlay)
  const trimHelmet = generator.defineAndGetBooleanInput("Trim Helmet", false)
  if (trimHelmet) {
   drawHelmetTrim(showHeadOverlay)
  }
  const enchantHelmet = generator.defineAndGetBooleanInput("Enchant Helmet", false)
  if (enchantHelmet) {
    drawHelmetGlint(showHeadOverlay)
  }

  // Chestplate
  drawChestplate()
  const trimChestplate = generator.defineAndGetBooleanInput("Trim Chestplate", false)
  if (trimChestplate) {
    drawChestplateTrim()
  }
  const enchantChestplate = generator.defineAndGetBooleanInput("Enchant Chestplate", false)
  if (enchantChestplate) {
    drawChestplateGlint()
  }

  // Leggings
  drawLeggings()
  const trimLeggings = generator.defineAndGetBooleanInput("Trim Leggings", false)
  if (trimLeggings) {
    drawLeggingsTrim()
  }
  const enchantLeggings = generator.defineAndGetBooleanInput("Enchant Leggings", false)
  if (enchantLeggings) {
    drawLeggingsGlint()
  }

  // Boots
  drawBoots()
  const trimBoots = generator.defineAndGetBooleanInput("Trim Boots", false)
  if (trimBoots) {
    drawBootsTrim()
  }
  const enchantBoots = generator.defineAndGetBooleanInput("Enchant Boots", false)
  if (enchantBoots) {
    drawBootsGlint()
  }

  if (enchantHelmet || enchantChestplate || enchantLeggings || enchantBoots) {
    generator.defineTextureInput("Enchanted Glint", {
      standardWidth: 128,
      standardHeight: 128,
      choices: [],
    });
  }

  // Foreground
  generator.drawImage("Foreground", [0, 0])

  // Folds

  if (showFolds) {
    drawFolds()
  }

  // Shoulder Curve
   if (
    shoulderAlpha("Chestplate") == 0 &&
      (
      !trimChestplate ||
      shoulderAlpha("Chestplate Trim") == 0)
  ) if (shoulderAlpha("Chestplate") == 0) {
    generator.drawImage("Foreground-Shoulders", [0, 0])
    if (showFolds) {
      generator.drawImage("Folds-Shoulders", [0, 0])
    }
  } 

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
