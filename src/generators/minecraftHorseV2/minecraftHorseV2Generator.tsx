"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type Blend,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type TexturePlugin,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import { TintSelector } from "../_common/tintSelector/tintSelector";
import { armorTintChoiceGroups } from "../_common/tintSelector/tints";
import { type Dimensions, Minecraft } from "../_common/minecraft";
import { horse } from "../_common/minecraftEntity";
import {
  type GlintPluginOptions,
  entityGlintTextureDefs,
  makeGlintPlugin,
} from "../_common/plugins/glint";

import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpeg";
import foregroundHorseImage from "./images/Foreground-Horse.png";
import foregroundMuleImage from "./images/Foreground-Mule.png";
import foldsHorseImage from "./images/Folds-Horse.png";
import foldsMuleImage from "./images/Folds-Mule.png";
import labelsImage from "./images/Labels.png";
import horseBlackTexture from "./textures/horse_black.png";
import horseBrownTexture from "./textures/horse_brown.png";
import horseChestnutTexture from "./textures/horse_chestnut.png";
import horseCreamyTexture from "./textures/horse_creamy.png";
import horseDarkbrownTexture from "./textures/horse_darkbrown.png";
import horseGrayTexture from "./textures/horse_gray.png";
import horseWhiteTexture from "./textures/horse_white.png";
import horseSkeletonTexture from "./textures/horse_skeleton.png";
import horseZombieTexture from "./textures/horse_zombie.png";
import donkeyTexture from "./textures/donkey.png";
import muleTexture from "./textures/mule.png";
import horseMarkingsBlackDotsTexture from "./textures/horse_markings_blackdots.png";
import horseMarkingsWhiteTexture from "./textures/horse_markings_white.png";
import horseMarkingsWhiteDotsTexture from "./textures/horse_markings_whitedots.png";
import horseMarkingsWhiteFieldTexture from "./textures/horse_markings_whitefield.png";
import leatherTexture from "./textures/leather.png";
import leatherOverlayTexture from "./textures/leather_overlay.png";
import goldTexture from "./textures/gold.png";
import copperTexture from "./textures/copper.png";
import ironTexture from "./textures/iron.png";
import diamondTexture from "./textures/diamond.png";
import netheriteTexture from "./textures/netherite.png";

const id = "minecraft-horse-v2";

const name = "Minecraft Horse";

const history: HistoryDef = [
  "11 Jul 2021 NinjolasNJM - Initial script finished.",
  "16 May 2026 NinjolasNJM - Changed to use new glint and tint input.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Foreground-Horse", url: foregroundHorseImage.src },
  { id: "Foreground-Mule", url: foregroundMuleImage.src },
  { id: "Folds-Horse", url: foldsHorseImage.src },
  { id: "Folds-Mule", url: foldsMuleImage.src },
  { id: "Labels", url: labelsImage.src },
];

// All texture definitions, used as `definitions` for every LoadedTextureControl
// below (matching minecraftArmorV2's pattern). Entries whose id matches a
// control id ("Enchanted Glint", "Horse", "Markings", "Armor", "Armor
// Overlay") are supplied dynamically at render time through
// `dynamicTextures`, so they are filtered out of the generator's own static
// `textures` (see `staticTextures` below); the rest (the named coat/material
// presets) stay static and only feed the pickers' choice lists.
const textures: TextureDef[] = [
  {
    id: "Horse",
    url: horseWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Black Horse",
    url: horseBlackTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Brown Horse",
    url: horseBrownTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Chestnut Horse",
    url: horseChestnutTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Creamy Horse",
    url: horseCreamyTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Dark Brown Horse",
    url: horseDarkbrownTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gray Horse",
    url: horseGrayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Horse",
    url: horseWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Skeleton Horse",
    url: horseSkeletonTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Zombie Horse",
    url: horseZombieTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Donkey",
    url: donkeyTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Mule",
    url: muleTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Black Dots",
    url: horseMarkingsBlackDotsTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White",
    url: horseMarkingsWhiteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Dots",
    url: horseMarkingsWhiteDotsTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "White Field",
    url: horseMarkingsWhiteFieldTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Leather",
    url: leatherTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Leather Overlay",
    url: leatherOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Armor Overlay",
    url: leatherOverlayTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Gold",
    url: goldTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Copper",
    url: copperTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Iron",
    url: ironTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Diamond",
    url: diamondTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  {
    id: "Netherite",
    url: netheriteTexture.src,
    standardWidth: 64,
    standardHeight: 64,
  },
  ...entityGlintTextureDefs,
];

const horseChoices = [
  "Black Horse",
  "Brown Horse",
  "Chestnut Horse",
  "Creamy Horse",
  "Dark Brown Horse",
  "Gray Horse",
  "White Horse",
  "Skeleton Horse",
  "Zombie Horse",
  "Donkey",
  "Mule",
];
const markingsChoices = ["Black Dots", "White", "White Dots", "White Field"];
const armorChoices = [
  "Leather",
  "Gold",
  "Copper",
  "Iron",
  "Diamond",
  "Netherite",
];

// Control ids that are fed dynamically through `dynamicTextures` rather than
// baked statically into the generator; the named coat/marking/material
// presets stay static and only populate the pickers' choice lists.
const dynamicTextureIds = new Set([
  "Enchanted Glint",
  "Horse",
  "Markings",
  "Armor",
  "Armor Overlay",
]);
const staticTextures = textures.filter(
  (textureDef) => !dynamicTextureIds.has(textureDef.id)
);

type MinecraftHorseProps = {
  muleModel: boolean;
  showFolds: boolean;
  showLabels: boolean;
  enchantArmor: boolean;
  tintArmor: boolean;
  armorColor: string;
  glintOpacity: number;
  glintXOffset: number;
  glintYOffset: number;
};

// Ported 1:1 from `minecraftHorseGenerator.ts`'s `script` render body: the
// same `drawCuboid` calls, offsets, dimensions and options. Values that used
// to come from `generator.get*InputValue` now come from author-owned
// `props`. The "Horse"/"Markings"/"Armor"/"Armor Overlay" passes are
// unconditional in v1 (relying on `drawCuboid` silently no-op'ing when a
// texture isn't loaded); they are guarded here with `ctx.hasTexture(...)` to
// make that explicit, matching the technique minecraftGolemCharacterV2 uses
// for its Flower pass.
const render = (ctx: RenderContext, props: MinecraftHorseProps): void => {
  ctx.defineRegion([256, 249, 124, 72], "muleModel");
  ctx.defineRegion([40, 452, 320, 336], "enchantArmor");

  const minecraftGenerator = new Minecraft(ctx);
  const glintTexture = ctx.getTexture("Enchanted Glint");
  const glintPluginOptions: GlintPluginOptions = {
    opacity: props.glintOpacity / 255,
    xOffset: props.glintXOffset,
    yOffset: props.glintYOffset,
  };
  const getGlintPlugin = (enabled: boolean): TexturePlugin | undefined =>
    glintTexture && enabled
      ? makeGlintPlugin(glintTexture, glintPluginOptions)
      : undefined;

  const armorTint: Blend = props.tintArmor
    ? { kind: "MultiplyHex", hex: props.armorColor }
    : { kind: "None" };

  const drawHorse = (
    texture: string,
    blend: Blend,
    enchanted: boolean
  ): void => {
    let ox: number;
    let oy: number;
    let dimensions: Dimensions;

    const plugin = getGlintPlugin(enchanted);

    // Head
    [ox, oy] = [20, 20];
    dimensions = [48, 40, 56];
    minecraftGenerator.drawCuboid(texture, horse.head, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Mouth
    [ox, oy] = [140, 142];
    dimensions = [32, 40, 40];
    minecraftGenerator.drawCuboid(texture, horse.mouth, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Neck
    [ox, oy] = [24, 232];
    dimensions = [32, 96, 56];
    minecraftGenerator.drawCuboid(texture, horse.neck, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Mane
    [ox, oy] = [321, 16];
    dimensions = [16, 128, 16];
    minecraftGenerator.drawCuboid(texture, horse.mane, [ox, oy], dimensions, {
      blend,
      center: "Back",
      plugin,
    });

    // Tail
    [ox, oy] = [224, 348];
    dimensions = [24, 112, 32];
    minecraftGenerator.drawCuboid(texture, horse.tail, [ox, oy], dimensions, {
      blend,
      center: "Back",
      plugin,
    });

    // Horse Ears

    const horseEars = (ox: number, oy: number): void => {
      dimensions = [16, 16, 8];
      minecraftGenerator.drawCuboid(
        texture,
        horse.horseEar,
        [ox, oy + 40],
        dimensions,
        { blend, plugin }
      );
    };

    // Donkey / Mule Ears

    const muleEars = (ox: number, oy: number): void => {
      dimensions = [16, 56, 8];
      minecraftGenerator.drawCuboid(
        texture,
        horse.muleEar,
        [ox, oy],
        dimensions,
        { blend, plugin }
      );
    };

    // Left Ear

    [ox, oy] = [332, 249];

    if (props.muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Right Ear

    [ox, oy] = [256, 249];

    if (props.muleModel) {
      muleEars(ox, oy);
    } else {
      horseEars(ox, oy);
    }

    // Body
    [ox, oy] = [-40, 452];
    dimensions = [80, 80, 176];
    minecraftGenerator.drawCuboid(texture, horse.body, [ox, oy], dimensions, {
      blend,
      center: "Top",
      rotate: 180,
      orientation: "East",
      plugin,
    });

    // Legs

    // Front Left Leg
    [ox, oy] = [413, 40];
    dimensions = [32, 88, 32];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      flip: "Horizontal",
      orientation: "West",
      plugin,
    });

    // Back Left Leg
    [ox, oy] = [413, 436];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      flip: "Horizontal",
      orientation: "West",
      plugin,
    });

    // Front Right Leg
    [ox, oy] = [413, 238];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      plugin,
    });

    // Back Right Leg
    [ox, oy] = [413, 634];
    minecraftGenerator.drawCuboid(texture, horse.leg, [ox, oy], dimensions, {
      blend,
      plugin,
    });
  };

  // Draw Horse

  if (ctx.hasTexture("Horse")) {
    drawHorse("Horse", { kind: "None" }, false);
  }
  if (ctx.hasTexture("Markings")) {
    drawHorse("Markings", { kind: "None" }, false);
  }
  if (ctx.hasTexture("Armor")) {
    drawHorse("Armor", armorTint, props.enchantArmor);
  }
  if (props.tintArmor && ctx.hasTexture("Armor Overlay")) {
    drawHorse("Armor Overlay", { kind: "None" }, props.enchantArmor);
  }

  // Foreground

  ctx.drawImage(
    props.muleModel ? "Foreground-Mule" : "Foreground-Horse",
    [0, 0]
  );

  // Folds

  if (props.showFolds) {
    ctx.drawImage(props.muleModel ? "Folds-Mule" : "Folds-Horse", [0, 0]);
  }

  // Labels

  if (props.showLabels) {
    ctx.drawImage("Labels", [0, 0]);
  }
};

const minecraftHorseGeneratorV2: GeneratorV2<MinecraftHorseProps> = {
  id,
  name,
  images,
  textures: staticTextures,
  render,
};

function Component(): JSX.Element {
  const [glintTexture, setGlintTexture] = React.useState<Texture | null>(
    null
  );
  const [glintOpacity, setGlintOpacity] = React.useState(255);
  const [glintXOffset, setGlintXOffset] = React.useState(0);
  const [glintYOffset, setGlintYOffset] = React.useState(0);

  const [horseTexture, setHorseTexture] = React.useState<Texture | null>(
    null
  );
  const [markingsTexture, setMarkingsTexture] =
    React.useState<Texture | null>(null);
  const [armorTexture, setArmorTexture] = React.useState<Texture | null>(
    null
  );
  const [armorOverlayTexture, setArmorOverlayTexture] =
    React.useState<Texture | null>(null);

  const [tintArmor, setTintArmor] = React.useState(false);
  const [armorColor, setArmorColor] = React.useState("#A06540");

  const [showFolds, setShowFolds] = React.useState(true);
  const [showLabels, setShowLabels] = React.useState(true);

  const [muleModel, setMuleModel] = React.useState(false);
  const [enchantArmor, setEnchantArmor] = React.useState(false);

  const rendererProps: MinecraftHorseProps = {
    muleModel,
    showFolds,
    showLabels,
    enchantArmor,
    tintArmor,
    armorColor,
    glintOpacity,
    glintXOffset,
    glintYOffset,
  };

  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (glintTexture) {
      map.set("Enchanted Glint", glintTexture);
    }
    if (horseTexture) {
      map.set("Horse", horseTexture);
    }
    if (markingsTexture) {
      map.set("Markings", markingsTexture);
    }
    if (armorTexture) {
      map.set("Armor", armorTexture);
    }
    if (armorOverlayTexture) {
      map.set("Armor Overlay", armorOverlayTexture);
    }
    return map;
  }, [
    glintTexture,
    horseTexture,
    markingsTexture,
    armorTexture,
    armorOverlayTexture,
  ]);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "muleModel":
        setMuleModel((value) => !value);
        break;
      case "enchantArmor":
        setEnchantArmor((value) => !value);
        break;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
          <div className="w-full bg-gray-100 p-8 space-y-4">
            {/* Glint control must render first in the sidebar (combobox 0):
                the copied v1 test locates it by index and asserts the base
                combobox count is 4 before Tint Armor is enabled.
                `initialTextureId="Enchanted Glint"` mirrors v1: a texture def
                with that exact id (the same bundled 1.20+ glint image) is
                always present in the underlying texture set, so glint is
                active by default (visible once something is enchanted) even
                though "Enchanted Glint" isn't one of the visible choices and
                the select shows blank — the same blank-select-but-fallback
                behavior as the "Horse" control below. */}
            <GeneratorUI.LoadedTextureControl
              id="Enchanted Glint"
              definitions={textures}
              choices={["1.20+", "Pre-1.20"]}
              standardWidth={128}
              standardHeight={128}
              initialTextureId="Enchanted Glint"
              onChange={setGlintTexture}
            />
            <GeneratorUI.RangeControl
              label="Glint Opacity"
              min={0}
              max={255}
              step={1}
              value={glintOpacity}
              onValueChange={setGlintOpacity}
            />
            <GeneratorUI.RangeControl
              label="Glint X Offset"
              min={0}
              max={128}
              step={1}
              value={glintXOffset}
              onValueChange={setGlintXOffset}
            />
            <GeneratorUI.RangeControl
              label="Glint Y Offset"
              min={0}
              max={128}
              step={1}
              value={glintYOffset}
              onValueChange={setGlintYOffset}
            />

            {/* The bundled white-horse texture ("Horse") renders on load even
                though it isn't among the visible choices, so the select shows
                blank until the user picks one — matching v1's
                `defineTextureInput("Horse", { choices: [...] })` behavior,
                where the default texture id ("Horse") isn't one of the named
                choices either. */}
            <GeneratorUI.LoadedTextureControl
              id="Horse"
              definitions={textures}
              choices={horseChoices}
              standardWidth={64}
              standardHeight={64}
              initialTextureId="Horse"
              onChange={setHorseTexture}
            />

            <GeneratorUI.LoadedTextureControl
              id="Markings"
              definitions={textures}
              choices={markingsChoices}
              standardWidth={64}
              standardHeight={64}
              onChange={setMarkingsTexture}
            />

            <GeneratorUI.LoadedTextureControl
              id="Armor"
              definitions={textures}
              choices={armorChoices}
              standardWidth={64}
              standardHeight={64}
              onChange={setArmorTexture}
            />

            <GeneratorUI.BooleanControl
              label="Tint Armor"
              checked={tintArmor}
              onCheckedChange={setTintArmor}
            />
            {tintArmor ? (
              <>
                <TintSelector
                  label="Armor Color"
                  value={armorColor}
                  choiceGroups={armorTintChoiceGroups}
                  includeNoTint={false}
                  onChange={(value) => {
                    if (value) {
                      setArmorColor(value);
                    }
                  }}
                />
                {/* `initialTextureId="Armor Overlay"` mirrors v1: a texture
                    def with that exact id (the bundled leather overlay
                    image) is always present, so this pass renders by
                    default whenever Tint Armor is on, even though "Armor
                    Overlay" isn't one of the visible choices — the same
                    blank-select-but-fallback behavior as "Horse". */}
                <GeneratorUI.LoadedTextureControl
                  id="Armor Overlay"
                  definitions={textures}
                  choices={["Leather Overlay"]}
                  standardWidth={64}
                  standardHeight={64}
                  initialTextureId="Armor Overlay"
                  onChange={setArmorOverlayTexture}
                />
              </>
            ) : null}

            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />
            <GeneratorUI.BooleanControl
              label="Show Labels"
              checked={showLabels}
              onCheckedChange={setShowLabels}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftHorseGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
