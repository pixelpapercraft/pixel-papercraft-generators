"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { steve } from "../_common/minecraftCharacter";
import { Minecraft } from "../_common/minecraft";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import backgroundImage from "./images/Background.png";
import foldsImage from "./images/Folds.png";
import actionFigureImage from "./images/Action-Figure.png";
import tabsImage from "./images/Tabs.png";
import zombieImage from "./textures/Zombie.png";
import endermanImage from "./textures/Enderman.png";
import skeletonImage from "./textures/Skeleton.png";
import witherSkeletonImage from "./textures/Wither_Skeleton.png";
import creeperImage from "./textures/Creeper.png";
import blazeImage from "./textures/Blaze.png";

const id = "minecraft-character-heads-v2";

const name = "Minecraft Character Heads";

const history: HistoryDef = [
  "Originally developed by ODF.",
  "06 Feb 2015 lostminer - Add user variables.",
  "13 Feb 2015 lostminer - Update to use new version of generator.",
  "17 Jul 2021 M16 - Updated generator photo.",
  "12 Jun 2022 NinjolasNJM - Updated to use Minecraft module, and added Action Figure option",
  "Jun 2026 NinjolasNJM - Set extra head slots to None by default.",
];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const images: ImageDef[] = [
  { id: "Background", url: backgroundImage.src },
  { id: "Tabs", url: tabsImage.src },
  { id: "Folds", url: foldsImage.src },
  { id: "Action Figure", url: actionFigureImage.src },
];

// Every skin is supplied at runtime by its own picker. Keeping the static
// texture list empty preserves the v1 behavior where selecting None removes a
// head completely.
const textures: TextureDef[] = [];

const makeFixedSkinOption = (name: string, url: string) => ({
  kind: "preset" as const,
  id: name,
  label: name,
  urls: { wide: url, slim: url },
});

// The mob heads are fixed 64x64 skins. Treating them as presets with identical
// Wide/Slim URLs lets the shared skin control load them without exposing V1's
// texture registry; the model selector is hidden for this generator anyway.
const skinOptions = [
  ...makeDefaultMinecraftSkinPresetOptions(),
  makeFixedSkinOption("Zombie", zombieImage.src),
  makeFixedSkinOption("Enderman", endermanImage.src),
  makeFixedSkinOption("Skeleton", skeletonImage.src),
  makeFixedSkinOption("Wither Skeleton", witherSkeletonImage.src),
  makeFixedSkinOption("Creeper", creeperImage.src),
  makeFixedSkinOption("Blaze", blazeImage.src),
];

const noTextures: Map<string, Texture> = new Map();

const headPositions: [number, number][] = [
  [99, 79],
  [387, 79],
  [99, 279],
  [387, 279],
  [99, 479],
  [387, 479],
  [99, 679],
  [387, 679],
];

const overlayRegionIds = headPositions.map(
  (_, index) => `skin-${index + 1}-overlay`
);

type MinecraftCharacterHeadsProps = {
  showFolds: boolean;
  actionFigure: boolean;
  showOverlays: boolean[];
};

// Direct port of the V1 script: same background, positions, tab/fold/action
// overlays, cuboid geometry, region bounds, and draw order.
const render = (
  ctx: RenderContext,
  props: MinecraftCharacterHeadsProps
): void => {
  const minecraft = new Minecraft(ctx);

  ctx.drawImage("Background", [0, 0]);

  headPositions.forEach(([ox, oy], index) => {
    const textureId = `Skin ${index + 1}`;
    const regionId = overlayRegionIds[index];
    if (!ctx.hasTexture(textureId) || !regionId) {
      return;
    }

    const x = ox - 64;
    const y = oy - 64;

    ctx.drawImage("Tabs", [x - 26, y - 1]);
    ctx.defineRegion([x, y, 256, 192], regionId);

    minecraft.drawCuboid(textureId, steve.base.head, [x, y], [64, 64, 64]);
    if (props.showOverlays[index]) {
      minecraft.drawCuboid(
        textureId,
        steve.overlay.head,
        [x, y],
        [64, 64, 64]
      );
    }

    if (props.showFolds) {
      ctx.drawImage("Folds", [x - 26, y - 1]);
    }

    if (props.actionFigure) {
      ctx.drawImage("Action Figure", [x + 64, y + 128]);
    }
  });
};

const minecraftCharacterHeadsGeneratorV2: GeneratorV2<MinecraftCharacterHeadsProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

const makeEmptySkinValue = (): MinecraftSkinInputValue => ({
  modelType: "Wide",
  selection: { kind: "none" },
});

function Component(): JSX.Element {
  const [skinValues, setSkinValues] = React.useState<
    MinecraftSkinInputValue[]
  >(() =>
    headPositions.map((_, index) =>
      index === 0
        ? getDefaultMinecraftSkinInputValue(skinOptions)
        : makeEmptySkinValue()
    )
  );
  const [skinTextures, setSkinTextures] = React.useState<(Texture | null)[]>(
    () => headPositions.map(() => null)
  );
  const [showOverlays, setShowOverlays] = React.useState<boolean[]>(() =>
    headPositions.map(() => true)
  );
  const [showFolds, setShowFolds] = React.useState(true);
  const [actionFigure, setActionFigure] = React.useState(false);

  const rendererProps: MinecraftCharacterHeadsProps = {
    showFolds,
    actionFigure,
    showOverlays,
  };

  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    skinTextures.forEach((texture, index) => {
      if (texture) {
        map.set(`Skin ${index + 1}`, texture);
      }
    });
    return map;
  }, [skinTextures]);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    const index = overlayRegionIds.indexOf(regionId);
    if (index === -1) {
      return;
    }
    setShowOverlays((values) =>
      values.map((value, valueIndex) =>
        valueIndex === index ? !value : value
      )
    );
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            {skinValues.map((skinValue, index) => (
              <MinecraftSkinControl
                key={`Skin ${index + 1}`}
                id={`Skin ${index + 1}`}
                options={skinOptions}
                standardWidth={64}
                standardHeight={64}
                showModelType={false}
                value={skinValue}
                textures={noTextures}
                onValueChange={(value) =>
                  setSkinValues((values) =>
                    values.map((currentValue, valueIndex) =>
                      valueIndex === index ? value : currentValue
                    )
                  )
                }
                onChange={(texture) =>
                  setSkinTextures((values) =>
                    values.map((currentTexture, valueIndex) =>
                      valueIndex === index ? texture : currentTexture
                    )
                  )
                }
              />
            ))}

            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />

            <GeneratorUI.BooleanControl
              label="Action Figure"
              checked={actionFigure}
              onCheckedChange={setActionFigure}
            />

            <GeneratorUI.History history={history} />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftCharacterHeadsGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
