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
import { Dimensions, steveLegacy } from "../_common/minecraftCharacter";
import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpg";

import foregroundImage from "./images/Foreground.png";
import foldsImage from "./images/Folds.png";
import labelsImage from "./images/Labels.png";
import foregroundShouldersImage from "./images/Foreground-Shoulders.png";
import foldsShouldersImage from "./images/Folds-Shoulders.png";

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
import copper1Texture from "./textures/copper_layer_1.png";
import copper2Texture from "./textures/copper_layer_2.png";
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
import boltTexture from "./textures/trims/entity/humanoid/bolt.png";
import boltLeggingsTexture from "./textures/trims/entity/humanoid_leggings/bolt.png";
import coastTexture from "./textures/trims/entity/humanoid/coast.png";
import coastLeggingsTexture from "./textures/trims/entity/humanoid_leggings/coast.png";
import duneTexture from "./textures/trims/entity/humanoid/dune.png";
import duneLeggingsTexture from "./textures/trims/entity/humanoid_leggings/dune.png";
import eyeTexture from "./textures/trims/entity/humanoid/eye.png";
import eyeLeggingsTexture from "./textures/trims/entity/humanoid_leggings/eye.png";
import flowTexture from "./textures/trims/entity/humanoid/flow.png";
import flowLeggingsTexture from "./textures/trims/entity/humanoid_leggings/flow.png";
import hostTexture from "./textures/trims/entity/humanoid/host.png";
import hostLeggingsTexture from "./textures/trims/entity/humanoid_leggings/host.png";
import raiserTexture from "./textures/trims/entity/humanoid/raiser.png";
import raiserLeggingsTexture from "./textures/trims/entity/humanoid_leggings/raiser.png";
import ribTexture from "./textures/trims/entity/humanoid/rib.png";
import ribLeggingsTexture from "./textures/trims/entity/humanoid_leggings/rib.png";
import sentryTexture from "./textures/trims/entity/humanoid/sentry.png";
import sentryLeggingsTexture from "./textures/trims/entity/humanoid_leggings/sentry.png";
import shaperTexture from "./textures/trims/entity/humanoid/shaper.png";
import shaperLeggingsTexture from "./textures/trims/entity/humanoid_leggings/shaper.png";
import silenceTexture from "./textures/trims/entity/humanoid/silence.png";
import silenceLeggingsTexture from "./textures/trims/entity/humanoid_leggings/silence.png";
import snoutTexture from "./textures/trims/entity/humanoid/snout.png";
import snoutLeggingsTexture from "./textures/trims/entity/humanoid_leggings/snout.png";
import spireTexture from "./textures/trims/entity/humanoid/spire.png";
import spireLeggingsTexture from "./textures/trims/entity/humanoid_leggings/spire.png";
import tideTexture from "./textures/trims/entity/humanoid/tide.png";
import tideLeggingsTexture from "./textures/trims/entity/humanoid_leggings/tide.png";
import vexTexture from "./textures/trims/entity/humanoid/vex.png";
import vexLeggingsTexture from "./textures/trims/entity/humanoid_leggings/vex.png";
import wardTexture from "./textures/trims/entity/humanoid/ward.png";
import wardLeggingsTexture from "./textures/trims/entity/humanoid_leggings/ward.png";
import wayfinderTexture from "./textures/trims/entity/humanoid/wayfinder.png";
import wayfinderLeggingsTexture from "./textures/trims/entity/humanoid_leggings/wayfinder.png";
import wildTexture from "./textures/trims/entity/humanoid/wild.png";
import wildLeggingsTexture from "./textures/trims/entity/humanoid_leggings/wild.png";
import amethystTexture from "./textures/trims/color_palettes/amethyst.png";
import copperTexture from "./textures/trims/color_palettes/copper.png";
import copperDarkerTexture from "./textures/trims/color_palettes/copper_darker.png";
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
import resinTexture from "./textures/trims/color_palettes/resin.png";
import trimPaletteTexture from "./textures/trims/color_palettes/trim_palette.png";

import { Minecraft } from "../_common/minecraft";
import { Blend } from "@genroot/builder/modules/renderers/drawTexture";
import { Color } from "@genroot/builder/modules/canvasWithContext";
import {
  defineGlintControlInputs,
  entityGlintTextureDefs,
  getGlintControls,
} from "../_common/plugins/glint";
import { defineTintInput } from "../_common/tintSelector/tintSelector";
import { armorTintChoiceGroups } from "../_common/tintSelector/tints";

const id = "minecraft-armor";
const name = "Minecraft Armor";

const history: HistoryDef = [
  "Jan 2026 NinjolasNJM - Initial script.",
  "May 2026 NinjolasNJM - Changed to use new glint and tint input.",
];

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
  - Select either from the drop down menu or from "Choose file" to choose the enchanted glint texture.
  - Adjust the sliders to choose the opacity, x and y offsets of the enchanted glint texture.
  - Click in the papercraft template to turn on and off the enchanted glint for each part.
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
  {
    id: "Helmet",
    url: helmetTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chestplate",
    url: chestplateTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Leggings",
    url: leggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Boots", url: bootsTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Helmet Overlay",
    url: helmetOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chestplate Overlay",
    url: chestplateOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Leggings Overlay",
    url: leggingsOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Boots Overlay",
    url: bootsOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Helmet Trim",
    url: silenceTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Chestplate Trim",
    url: silenceTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Leggings Trim",
    url: silenceLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Boots Trim",
    url: silenceTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Helmet Trim Material",
    url: goldTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Chestplate Trim Material",
    url: goldTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Leggings Trim Material",
    url: goldTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Boots Trim Material",
    url: goldTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Chainmail",
    url: chainmail1Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Chainmail ",
    url: chainmail2Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Diamond",
    url: helmetTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Diamond ",
    url: diamond2Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  { id: "Gold", url: gold1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Gold ", url: gold2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  {
    id: "Copper",
    url: copper1Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Copper ",
    url: copper2Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  { id: "Iron", url: iron1Texture.src, standardWidth: 64, standardHeight: 32 }, //
  { id: "Iron ", url: iron2Texture.src, standardWidth: 64, standardHeight: 32 }, //
  {
    id: "Netherite",
    url: netherite1Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Netherite ",
    url: netherite2Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Leather",
    url: leather1Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Leather ",
    url: leather2Texture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Leather Overlay",
    url: leather1OverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Leather Overlay ",
    url: leather2OverlayTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  {
    id: "Turtle Shell",
    url: turtleShellTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  }, //
  { id: "Notch", url: notchTexture.src, standardWidth: 64, standardHeight: 32 }, //
  ...entityGlintTextureDefs,
  { id: "Bolt", url: boltTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Bolt ",
    url: boltLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Coast", url: coastTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Coast ",
    url: coastLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Dune", url: duneTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Dune ",
    url: duneLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Eye", url: eyeTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Eye ",
    url: eyeLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Flow", url: flowTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Flow ",
    url: flowLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Host", url: hostTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Host ",
    url: hostLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Raiser",
    url: raiserTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Raiser ",
    url: raiserLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Rib", url: ribTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Rib ",
    url: ribLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Sentry",
    url: sentryTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Sentry ",
    url: sentryLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Shaper",
    url: shaperTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Shaper ",
    url: shaperLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Silence",
    url: silenceTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Silence ",
    url: silenceLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Snout", url: snoutTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Snout ",
    url: snoutLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Spire", url: spireTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Spire ",
    url: spireLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Tide", url: tideTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Tide ",
    url: tideLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Vex", url: vexTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Vex ",
    url: vexLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Ward", url: wardTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Ward ",
    url: wardLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Wayfinder",
    url: wayfinderTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Wayfinder ",
    url: wayfinderLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  { id: "Wild", url: wildTexture.src, standardWidth: 64, standardHeight: 32 },
  {
    id: "Wild ",
    url: wildLeggingsTexture.src,
    standardWidth: 64,
    standardHeight: 32,
  },
  {
    id: "Amethyst  ",
    url: amethystTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Copper  ",
    url: copperTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Copper Darker  ",
    url: copperDarkerTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Diamond  ",
    url: diamondTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Diamond Darker  ",
    url: diamondDarkerTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Emerald  ",
    url: emeraldTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  { id: "Gold  ", url: goldTexture.src, standardWidth: 8, standardHeight: 1 },
  {
    id: "Gold Darker  ",
    url: goldDarkerTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  { id: "Iron  ", url: ironTexture.src, standardWidth: 8, standardHeight: 1 },
  {
    id: "Iron Darker  ",
    url: ironDarkerTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  { id: "Lapis  ", url: lapisTexture.src, standardWidth: 8, standardHeight: 1 },
  {
    id: "Netherite  ",
    url: netheriteTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Netherite Darker  ",
    url: netheriteDarkerTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Quartz  ",
    url: quartzTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Redstone  ",
    url: redstoneTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Resin  ",
    url: resinTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
  {
    id: "Trim Palette  ",
    url: trimPaletteTexture.src,
    standardWidth: 8,
    standardHeight: 1,
  },
];

const materials = [
  "Leather",
  "Chainmail",
  "Gold",
  "Copper",
  "Iron",
  "Diamond",
  "Netherite",
];
const materials2 = [
  "Leather ",
  "Chainmail ",
  "Gold ",
  "Copper ",
  "Iron ",
  "Diamond ",
  "Netherite ",
];
const trimMaterials = [
  "Amethyst  ",
  "Copper  ",
  "Copper Darker  ",
  "Diamond  ",
  "Diamond Darker  ",
  "Emerald  ",
  "Gold  ",
  "Gold Darker  ",
  "Iron  ",
  "Iron Darker  ",
  "Lapis  ",
  "Netherite  ",
  "Netherite Darker  ",
  "Quartz  ",
  "Redstone  ",
  "Resin  ",
];
const trimTemplates = [
  "Bolt",
  "Coast",
  "Dune",
  "Eye",
  "Flow",
  "Host",
  "Raiser",
  "Rib",
  "Sentry",
  "Shaper",
  "Silence",
  "Snout",
  "Spire",
  "Tide",
  "Vex",
  "Ward",
  "Wayfinder",
  "Wild",
];
const trimTemplates2 = [
  "Bolt ",
  "Coast ",
  "Dune ",
  "Eye ",
  "Flow ",
  "Host ",
  "Raiser ",
  "Rib ",
  "Sentry ",
  "Shaper ",
  "Silence ",
  "Snout ",
  "Spire ",
  "Tide ",
  "Vex ",
  "Ward ",
  "Wayfinder ",
  "Wild ",
];

const script: ScriptDef = (generator: Generator) => {
  const minecraftGenerator = new Minecraft(generator);
  const glint = getGlintControls(generator);

  function getTint(colorId: string): Blend {
    const hex =
      defineTintInput(generator, colorId, {
        defaultValue: "#A06540",
        choiceGroups: armorTintChoiceGroups,
        includeNoTint: false,
      }) ?? "#A06540";

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
    return a;
  }

  function drawHelmetHead(
    textureId: string,
    showHeadOverlay: boolean,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 41;
    const oy = 21;
    const dimensions: Dimensions = [80, 80, 80];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.head,
      [ox, oy],
      dimensions,
      { blend, plugin }
    );

    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(
        textureId,
        steveLegacy.overlay.head,
        [ox, oy],
        dimensions,
        { blend, plugin }
      );
    }
  }

  function drawHelmetLiner(
    textureId: string,
    showHeadOverlay: boolean,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 329;
    const oy = 37;
    const dimensions: Dimensions = [64, 64, 64];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.head,
      [ox, oy],
      dimensions,
      { blend, rotate: 90, plugin }
    );

    generator.drawTexture(textureId, [0, 8, 8, 1], [ox + 100, oy + 28, 64, 8], {
      blend,
      rotate: 90,
      plugin,
    });

    generator.drawTexture(
      textureId,
      [16, 8, 8, 1],
      [ox + 100, oy + 156, 64, 8],
      {
        blend: blend,
        rotate: 90,
        plugin,
      }
    );

    if (showHeadOverlay) {
      minecraftGenerator.drawCuboid(
        textureId,
        steveLegacy.overlay.head,
        [ox, oy],
        dimensions,
        { blend, rotate: 90 }
      );

      generator.drawTexture(
        textureId,
        [32, 8, 8, 1],
        [ox + 100, oy + 28, 64, 8],
        {
          blend,
          rotate: 90,
          plugin,
        }
      );

      generator.drawTexture(
        textureId,
        [48, 8, 8, 1],
        [ox + 100, oy + 156, 64, 8],
        {
          blend: blend,
          rotate: 90,
          plugin,
        }
      );
    }
  }

  function drawChestplateBody(
    textureId: string,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 185;
    const oy = 309;
    const dimensions: Dimensions = [64, 96, 48];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.body,
      [ox, oy],
      dimensions,
      { blend, plugin }
    );
    generator.drawTexture(
      textureId,
      steveLegacy.base.body.back,
      [ox + 48, oy - 96, 64, 96],
      {
        rotate: 180,
        blend: blend,
        plugin,
      }
    ); // Back texture that goes around over the head
    generator.drawTexture(
      textureId,
      [33, 24, 6, 8],
      [ox + 112, oy - 96, 48, 64],
      {
        rotate: 180,
        blend: blend,
        plugin,
      }
    ); // Tab that goes inside the back face
    generator.drawTexture(textureId, [20, 22, 8, 1], [ox + 48, oy, 64, 48], {
      blend: blend,
      plugin,
    });
    generator.drawTexture(textureId, [20, 21, 8, 1], [ox + 48, oy, 64, 48], {
      blend: blend,
      plugin,
    });
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

  function drawRightShoulder(
    textureId: string,
    blend: Blend,
    shoulderOverlay: boolean,
    enchanted: boolean
  ) {
    const ox = -27;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];

    const plugin = glint.getPlugin(enchanted);

    if (shoulderAlpha(textureId) === 0 && shoulderOverlay) {
      generator.drawTexture(
        textureId,
        steveLegacy.base.rightArm.left,
        [ox + 100, oy + 92, 48, 96],
        {
          blend: blend,
          rotate: 270,
          plugin,
        }
      );
    }
    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.rightArm,
      [ox, oy],
      dimensions,
      {
        blend: blend,
        rotate: 90,
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      steveLegacy.base.rightArm.back,
      [ox + 192, oy + 88, 40, 96],
      {
        blend: blend,
        rotate: 270,
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      steveLegacy.base.rightArm.back,
      [ox + 192, oy + 48, 40, 96],
      {
        blend: blend,
        rotate: 270,
        plugin,
      }
    );
  }

  function drawLeftShoulder(
    textureId: string,
    blend: Blend,
    shoulderOverlay: boolean,
    enchanted: boolean
  ) {
    const ox = 445;
    const oy = 233;
    const dimensions: Dimensions = [40, 96, 48];

    const plugin = glint.getPlugin(enchanted);

    if (shoulderAlpha(textureId) === 0 && shoulderOverlay) {
      generator.drawTexture(
        textureId,
        steveLegacy.base.leftArm.left,
        [ox + 28, oy + 92, 48, 96],
        {
          blend: blend,
          flip: "Horizontal",
          rotate: 90,
          plugin,
        }
      );
    }
    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.leftArm,
      [ox, oy],
      dimensions,
      {
        blend: blend,
        flip: "Horizontal",
        rotate: 270,
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      steveLegacy.base.leftArm.back,
      [ox - 56, oy + 88, 40, 96],
      {
        blend: blend,
        flip: "Horizontal",
        rotate: 90,
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      steveLegacy.base.leftArm.back,
      [ox - 56, oy + 48, 40, 96],
      {
        blend: blend,
        flip: "Horizontal",
        rotate: 90,
        plugin,
      }
    );
  }

  function drawLeggingsBody(
    textureId: string,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 193;
    const oy = 385;
    const dimensions: Dimensions = [64, 104, 40];

    const plugin = glint.getPlugin(enchanted);

    generator.drawTexture(textureId, [0, 20, 4, 12], [ox, oy + 135, 40, 104], {
      blend,
      plugin,
    });
    generator.drawTexture(
      textureId,
      [0, 20, 4, 12],
      [ox + 104, oy + 135, 40, 104],
      {
        blend,
        flip: "Horizontal",
        plugin,
      }
    );
    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.body,
      [ox, oy],
      dimensions,
      { blend, plugin }
    );
  }

  function drawRightLegging(
    textureId: string,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 49;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.rightLeg,
      [ox, oy],
      dimensions,
      { blend, plugin }
    );
    generator.drawTexture(textureId, [16, 20, 4, 12], [ox, oy - 55, 40, 104], {
      blend,
      plugin,
    });
    generator.drawTexture(
      textureId,
      [0, 20, 4, 4],
      [ox + 72, oy + 20, 40, 34],
      { blend, plugin }
    );
    generator.drawTexture(
      textureId,
      [16, 20, 4, 12],
      [ox + 72, oy - 75, 40, 104],
      { blend, plugin }
    );
  }

  function drawLeftLegging(
    textureId: string,
    blend: Blend,
    enchanted: boolean
  ) {
    const ox = 401;
    const oy = 541;
    const dimensions: Dimensions = [32, 104, 40];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.leftLeg,
      [ox, oy],
      dimensions,
      {
        blend: blend,
        flip: "Horizontal",
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      [28, 20, 4, 12],
      [ox + 104, oy - 55, 40, 104],
      { blend, plugin }
    );
    generator.drawTexture(
      textureId,
      [0, 20, 4, 4],
      [ox + 32, oy + 20, 40, 34],
      {
        blend: blend,
        flip: "Horizontal",
        plugin,
      }
    );
    generator.drawTexture(
      textureId,
      [28, 20, 4, 12],
      [ox + 32, oy - 75, 40, 104],
      {
        blend: blend,
        flip: "Horizontal",
        plugin,
      }
    );
  }

  function drawRightBoot(textureId: string, tint: Blend, enchanted: boolean) {
    const ox = 35;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.rightLeg,
      [ox, oy],
      dimensions,
      { blend: tint, plugin }
    );
    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.rightLeg,
      [169, 613],
      [32, 96, 32],
      {
        blend: tint,
        rotate: 270,
        center: "Back",
        plugin,
      }
    );
  }

  function drawLeftBoot(textureId: string, blend: Blend, enchanted: boolean) {
    const ox = 383;
    const oy = 597;
    const dimensions: Dimensions = [40, 96, 48];

    const plugin = glint.getPlugin(enchanted);

    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.leftLeg,
      [ox, oy],
      dimensions,
      {
        blend: blend,
        flip: "Horizontal",
        plugin,
      }
    );
    minecraftGenerator.drawCuboid(
      textureId,
      steveLegacy.base.leftLeg,
      [297, 613],
      [32, 96, 32],
      {
        blend: blend,
        rotate: 90,
        center: "Back",
        flip: "Horizontal",
        plugin,
      }
    );
  }

  function drawFolds() {
    generator.drawImage("Folds", [0, 0]);
    // Later replace with drawLineFold functions
  }

  function drawHelmet(showHeadOverlay: boolean, enchantHelmet: boolean) {
    generator.defineTextureInput("Helmet", {
      standardWidth: 64,
      standardHeight: 64,
      choices: [
        "Leather",
        "Chainmail",
        "Gold",
        "Copper",
        "Iron",
        "Diamond",
        "Netherite",
        "Turtle Shell",
      ],
    });
    generator.defineBooleanInput("Tint Helmet", false);
    const tintHelmet = generator.getBooleanInputValue("Tint Helmet");

    const blend: Blend = tintHelmet
      ? getTint("Helmet Color")
      : { kind: "None" };

    drawHelmetHead("Helmet", showHeadOverlay, blend, enchantHelmet);
    drawHelmetLiner("Helmet", showHeadOverlay, blend, enchantHelmet);

    if (tintHelmet) {
      generator.defineTextureInput("Helmet Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawHelmetHead(
        "Helmet Overlay",
        showHeadOverlay,
        { kind: "None" },
        enchantHelmet
      );
      drawHelmetLiner(
        "Helmet Overlay",
        showHeadOverlay,
        { kind: "None" },
        enchantHelmet
      );
    }

    generator.defineRegionInput([41, 21, 320, 160], () => {
      generator.setBooleanInputValue("Enchant Helmet", !enchantHelmet);
    });
    generator.defineRegionInput([121, 21, 80, 80], () => {
      generator.setBooleanInputValue("Show Head Overlay", !showHeadOverlay);
    });
  }

  function drawChestplate(enchantChestplate: boolean) {
    generator.defineTextureInput("Chestplate", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials,
    });

    const tintChestplate = generator.defineAndGetBooleanInput(
      "Tint Chestplate",
      false
    );
    const tint: Blend = tintChestplate
      ? getTint("Chestplate Color")
      : { kind: "None" };

    drawChestplateBody("Chestplate", tint, enchantChestplate);
    drawLeftShoulder("Chestplate", tint, true, enchantChestplate);
    drawRightShoulder("Chestplate", tint, true, enchantChestplate);

    if (tintChestplate) {
      generator.defineTextureInput("Chestplate Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawChestplateBody(
        "Chestplate Overlay",
        { kind: "None" },
        enchantChestplate
      );
      drawLeftShoulder(
        "Chestplate Overlay",
        { kind: "None" },
        true,
        enchantChestplate
      );
      drawRightShoulder(
        "Chestplate Overlay",
        { kind: "None" },
        true,
        enchantChestplate
      );
    }
    generator.defineRegionInput([185, 213, 224, 240], () => {
      generator.setBooleanInputValue("Enchant Chestplate", !enchantChestplate);
    });
    generator.defineRegionInput([33, 261, 160, 176], () => {
      generator.setBooleanInputValue("Enchant Chestplate", !enchantChestplate);
    });
    generator.defineRegionInput([401, 261, 160, 176], () => {
      generator.setBooleanInputValue("Enchant Chestplate", !enchantChestplate);
    });
  }

  function drawLeggings(enchantLeggings: boolean) {
    generator.defineTextureInput("Leggings", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials2,
    });

    const tintLeggings = generator.defineAndGetBooleanInput(
      "Tint Leggings",
      false
    );
    const tint: Blend = tintLeggings
      ? getTint("Leggings Color")
      : { kind: "None" };

    drawLeggingsBody("Leggings", tint, enchantLeggings);
    drawRightLegging("Leggings", tint, enchantLeggings);
    drawLeftLegging("Leggings", tint, enchantLeggings);

    if (tintLeggings) {
      generator.defineTextureInput("Leggings Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay "],
      });
      drawLeggingsBody("Leggings Overlay", { kind: "None" }, enchantLeggings);
      drawRightLegging("Leggings Overlay", { kind: "None" }, enchantLeggings);
      drawLeftLegging("Leggings Overlay", { kind: "None" }, enchantLeggings);
    }
    generator.defineRegionInput([193, 485, 208, 57], () => {
      generator.setBooleanInputValue("Enchant Leggings", !enchantLeggings);
    });
    generator.defineRegionInput([49, 568, 144, 91], () => {
      generator.setBooleanInputValue("Enchant Leggings", !enchantLeggings);
    });
    generator.defineRegionInput([401, 568, 144, 91], () => {
      generator.setBooleanInputValue("Enchant Leggings", !enchantLeggings);
    });
  }

  function drawBoots(enchantBoots: boolean) {
    generator.defineTextureInput("Boots", {
      standardWidth: 64,
      standardHeight: 64,
      choices: materials,
    });

    const tintBoots = generator.defineAndGetBooleanInput("Tint Boots", false);
    const tint: Blend = tintBoots ? getTint("Boots Color") : { kind: "None" };

    drawLeftBoot("Boots", tint, enchantBoots);
    drawRightBoot("Boots", tint, enchantBoots);

    if (tintBoots) {
      generator.defineTextureInput("Boots Overlay", {
        standardWidth: 64,
        standardHeight: 64,
        choices: ["Leather Overlay"],
      });
      drawLeftBoot("Boots Overlay", { kind: "None" }, enchantBoots);
      drawRightBoot("Boots Overlay", { kind: "None" }, enchantBoots);
    }

    generator.defineRegionInput([35, 693, 176, 96], () => {
      generator.setBooleanInputValue("Enchant Boots", !enchantBoots);
    });
    generator.defineRegionInput([383, 693, 176, 96], () => {
      generator.setBooleanInputValue("Enchant Boots", !enchantBoots);
    });
  }
  // Draw Trims
  function drawHelmetTrim(showHeadOverlay: boolean, enchantHelmet: boolean) {
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
    drawHelmetHead(
      "Helmet Trim",
      showHeadOverlay,
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantHelmet
    );
    drawHelmetLiner(
      "Helmet Trim",
      showHeadOverlay,
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantHelmet
    );
  }

  function drawChestplateTrim(enchantChestplate: boolean) {
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
    drawChestplateBody(
      "Chestplate Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantChestplate
    );
    drawLeftShoulder(
      "Chestplate Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      true,
      enchantChestplate
    ); // shoulderOverlay functionality disabled for now
    drawRightShoulder(
      "Chestplate Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      true,
      enchantChestplate
    );
  }

  function drawLeggingsTrim(enchantLeggings: boolean) {
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
    drawLeggingsBody(
      "Leggings Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantLeggings
    );
    drawRightLegging(
      "Leggings Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantLeggings
    );
    drawLeftLegging(
      "Leggings Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantLeggings
    );
  }

  function drawBootsTrim(enchantBoots: boolean) {
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
    drawLeftBoot(
      "Boots Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantBoots
    );
    drawRightBoot(
      "Boots Trim",
      { kind: "ReplaceColor", color1: baseColors, color2: colors },
      enchantBoots
    );
  }

  // Define user inputs
  generator.defineBooleanInput("Show Folds", true);
  generator.defineBooleanInput("Show Labels", true);

  // Get user variable values

  const showFolds = generator.getBooleanInputValue("Show Folds");
  const showLabels = generator.getBooleanInputValue("Show Labels");

  const showHeadOverlay = generator.getBooleanInputValueWithDefault(
    "Show Head Overlay",
    true
  );

  // Draw
  // Helmet
  const enchantHelmet = generator.getBooleanInputValueWithDefault(
    "Enchant Helmet",
    false
  );
  drawHelmet(showHeadOverlay, enchantHelmet);
  const trimHelmet = generator.defineAndGetBooleanInput("Trim Helmet", false);
  if (trimHelmet) {
    drawHelmetTrim(showHeadOverlay, enchantHelmet);
  }

  // Chestplate
  const enchantChestplate = generator.getBooleanInputValueWithDefault(
    "Enchant Chestplate",
    false
  );
  drawChestplate(enchantChestplate);
  const trimChestplate = generator.defineAndGetBooleanInput(
    "Trim Chestplate",
    false
  );
  if (trimChestplate) {
    drawChestplateTrim(enchantChestplate);
  }

  // Leggings
  const enchantLeggings = generator.getBooleanInputValueWithDefault(
    "Enchant Leggings",
    false
  );
  drawLeggings(enchantLeggings);
  const trimLeggings = generator.defineAndGetBooleanInput(
    "Trim Leggings",
    false
  );
  if (trimLeggings) {
    drawLeggingsTrim(enchantLeggings);
  }

  // Boots
  const enchantBoots = generator.getBooleanInputValueWithDefault(
    "Enchant Boots",
    false
  );
  drawBoots(enchantBoots);
  const trimBoots = generator.defineAndGetBooleanInput("Trim Boots", false);
  if (trimBoots) {
    drawBootsTrim(enchantBoots);
  }

  // Foreground
  generator.drawImage("Foreground", [0, 0]);

  // Folds

  if (showFolds) {
    drawFolds();
  }

  // Shoulder Curve
  if (
    shoulderAlpha("Chestplate") == 0 &&
    (!trimChestplate || shoulderAlpha("Chestplate Trim") == 0)
  )
    if (shoulderAlpha("Chestplate") == 0) {
      generator.drawImage("Foreground-Shoulders", [0, 0]);
      if (showFolds) {
        generator.drawImage("Folds-Shoulders", [0, 0]);
      }
    }

  // (Chestplate.isEmpty() && (trim.isEmpty() || !trim.exists()))

  // Labels

  if (showLabels) {
    generator.drawImage("Labels", [0, 0]);
  }

  defineGlintControlInputs(generator);

  generator.fillBackgroundColorWithWhite();
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
