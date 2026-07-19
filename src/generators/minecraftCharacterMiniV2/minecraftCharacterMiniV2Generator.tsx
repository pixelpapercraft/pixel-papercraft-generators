"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type Position,
  type Rectangle,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/v2";
import {
  type Layer,
  steve,
  alex,
  type Dimensions,
} from "../_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/v2-thumbnail-256.jpeg";
import foregroundImage from "./images/Foreground.png";
import titleImage from "./images/Title.png";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

const id = "minecraft-character-mini-v2";

const name = "Minecraft Character Mini";

const history: HistoryDef = [
  "13 Sep 2015 Sandvich - First release using the generator builder.",
  "17 Sep 2020 NinjolasNJM - Added support for Alex skins and fixed bottom of legs.",
  "11 Feb 2022 LostMiner - Refactor. Add pixelate option.",
  "03 Jun 2022 NinjolasNJM - Overhauled the foreground, added a title and an opaque background, a folds toggle, and overlay region inputs",
  "02 Feb 2024 NinjolasNJM - added skin input",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  {
    id: "Foreground",
    url: foregroundImage.src,
  },
  {
    id: "Title",
    url: titleImage.src,
  },
];

const textures: TextureDef[] = [];

type MiniProps = {
  textureId: "Mini 1" | "Mini 2";
  modelType: "Wide" | "Slim";
  showFolds: boolean;
  bodyHeight: number;
  pixelate: boolean;
  showHeadOverlay: boolean;
  showBodyOverlay: boolean;
  showLeftArmOverlay: boolean;
  showRightArmOverlay: boolean;
  showLeftLegOverlay: boolean;
  showRightLegOverlay: boolean;
};

type MinecraftCharacterMiniProps = {
  mini1: MiniProps | null;
  mini2: MiniProps | null;
};

const render = (
  ctx: RenderContext,
  props: MinecraftCharacterMiniProps
): void => {
  const drawHead = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number
  ) => {
    ctx.drawTexture(textureId, layer.head.right, [ox, oy, 64, 64]);
    ctx.drawTexture(textureId, layer.head.front, [ox + 64, oy, 64, 64]);
    ctx.drawTexture(textureId, layer.head.left, [ox + 128, oy, 64, 64]);
    ctx.drawTexture(textureId, layer.head.back, [ox + 192, oy, 64, 64]);
    ctx.drawTexture(textureId, layer.head.top, [ox + 64, oy - 64, 64, 64]);
  };

  const drawHeadFlaps = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number
  ) => {
    ctx.drawTexture(textureId, layer.head.right, [ox, oy, 64, 64], {
      rotate: 90.0,
    });
    ctx.drawTexture(textureId, layer.head.left, [ox + 128, oy, 64, 64], {
      rotate: -90.0,
    });
  };

  const drawBody = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    ctx.drawTexture(textureId, layer.body.right, [ox, oy, 64, bodyHeight], {
      pixelate,
    });
    ctx.drawTexture(
      textureId,
      layer.body.front,
      [ox + 64, oy, 64, bodyHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.body.left,
      [ox + 128, oy, 64, bodyHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.body.back,
      [ox + 192, oy, 64, bodyHeight],
      { pixelate }
    );
  };

  const drawRightArm = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    pixelate: boolean
  ) => {
    ctx.drawTexture(textureId, layer.rightArm.left, [ox, oy, 32, 48], {
      rotate: 90.0,
      pixelate,
    });
    ctx.drawTexture(textureId, layer.rightArm.right, [ox, oy + 32, 32, 48], {
      rotate: 90.0,
      pixelate,
    });
  };

  const drawLeftArm = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    pixelate: boolean
  ) => {
    ctx.drawTexture(textureId, layer.leftArm.right, [ox, oy, 32, 48], {
      rotate: -90.0,
      pixelate,
    });
    ctx.drawTexture(textureId, layer.leftArm.left, [ox, oy + 32, 32, 48], {
      rotate: -90.0,
      pixelate,
    });
  };

  const drawRightLeg = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    const legHeight = 64 - bodyHeight;
    ctx.drawTexture(
      textureId,
      layer.rightLeg.front,
      [ox + 64, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.rightLeg.right,
      [ox, oy + bodyHeight, 64, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.rightLeg.back,
      [ox + 224, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.rightLeg.bottom,
      [ox + 64, oy + 64, 32, 64],
      { flip: "Vertical", pixelate }
    );
  };

  const drawLeftLeg = (
    textureId: string,
    layer: Layer,
    ox: number,
    oy: number,
    bodyHeight: number,
    pixelate: boolean
  ) => {
    const legHeight = 64 - bodyHeight;
    ctx.drawTexture(
      textureId,
      layer.leftLeg.front,
      [ox + 96, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.leftLeg.left,
      [ox + 128, oy + bodyHeight, 64, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.leftLeg.back,
      [ox + 192, oy + bodyHeight, 32, legHeight],
      { pixelate }
    );
    ctx.drawTexture(
      textureId,
      layer.leftLeg.bottom,
      [ox + 96, oy + 64, 32, 64],
      { flip: "Vertical", pixelate }
    );
  };

  function drawFoldLineRectangle(rectangle: Rectangle) {
    const [x, y, w, h] = rectangle;

    ctx.drawFoldLine([x, y - 1], [x + w, y - 1]);
    ctx.drawFoldLine([x + w, y], [x + w, y + h]);
    ctx.drawFoldLine([x + w, y + h + 1], [x, y + h + 1]);
    ctx.drawFoldLine([x, y + h], [x, y]);
  }

  function drawFoldLineCuboid(
    position: Position,
    dimensions: Dimensions,
    leftSide: boolean = false
  ): void {
    const [x, y] = position;
    const [w, h, l] = dimensions;

    if (!leftSide) {
      drawFoldLineRectangle([x + l, y, w, l * 2 + h]);
      drawFoldLineRectangle([x, y + l, l * 2 + w * 2, h]);
      ctx.drawFoldLine(
        [x + l * 2 + w - 1, y + l],
        [x + l * 2 + w - 1, y + l + h]
      );
    } else {
      drawFoldLineRectangle([x + l + w, y, w, l * 2 + h]);
      drawFoldLineRectangle([x, y + l, l * 2 + w * 2, h]);
      ctx.drawFoldLine([x + w, y + l], [x + w, y + l + h]);
    }
  }

  function drawFolds([x, y]: Position): void {
    ctx.fillRectangle([x + 49, y + 90, 64, 64], "#ffffff80");
    ctx.fillRectangle([x + 177, y + 90, 64, 64], "#ffffff80");

    drawFoldLineCuboid([x + 49, y + 26], [64, 128, 64]);
    ctx.drawFoldLine([x + 49, y + 25], [x + 241, y + 25]);

    drawFoldLineRectangle([x + 1, y + 10, 48, 64]);
    ctx.drawFoldLine([x + 1, y + 41], [x + 49, y + 41]);
    ctx.drawFoldLine([x + 48, y + 74], [x + 48, y + 90]);
    ctx.drawLine([x + 49, y + 26], [x + 49, y + 42], {
      color: "#ff0000",
    });

    drawFoldLineRectangle([x + 241, y + 10, 48, 64]);
    ctx.drawFoldLine([x + 241, y + 41], [x + 290, y + 41]);
    ctx.drawFoldLine([x + 241, y + 74], [x + 241, y + 90]);
    ctx.drawLine([x + 240, y + 26], [x + 240, y + 42], {
      color: "#ff0000",
    });

    ctx.drawLine([x + 49, y + 89], [x + 113, y + 89], {
      color: "#ff0000",
    });
    ctx.drawLine([x + 177, y + 89], [x + 241, y + 89], {
      color: "#ff0000",
    });
  }

  const drawMini = (mini: MiniProps | null, x: number, y: number): void => {
    if (mini) {
      const {
        textureId,
        modelType,
        showFolds,
        bodyHeight,
        pixelate,
        showHeadOverlay,
        showBodyOverlay,
        showLeftArmOverlay,
        showRightArmOverlay,
        showLeftLegOverlay,
        showRightLegOverlay,
      } = mini;
      const isSlimModel = modelType === "Slim";
      let ox: number;
      let oy: number;

      // Head

      ox = x + 49;
      oy = y + 90;

      drawHead(textureId, steve.base, ox, oy);

      if (showHeadOverlay) {
        drawHead(textureId, steve.overlay, ox, oy);
      }
      ctx.defineRegion([ox, oy - 64, 192, 128], `${textureId}:head`);

      // Head Flaps

      ox = x + 49;
      oy = y + 26;

      drawHeadFlaps(textureId, steve.base, ox, oy);

      if (showHeadOverlay) {
        drawHeadFlaps(textureId, steve.overlay, ox, oy);
      }

      // Body

      ox = x + 49;
      oy = y + 154;

      drawBody(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showBodyOverlay) {
        drawBody(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }
      ctx.defineRegion([ox, oy, 256, bodyHeight], `${textureId}:body`);

      // Arms

      const armTexture = isSlimModel ? alex : steve;

      // Right Arm

      ox = x + 9;
      oy = y + 2;

      drawRightArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showRightArmOverlay) {
        drawRightArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }
      ctx.defineRegion([ox - 8, oy + 8, 48, 64], `${textureId}:rightArm`);

      // Left Arm

      ox = x + 249;
      oy = y + 2;

      drawLeftArm(textureId, armTexture.base, ox, oy, pixelate);

      if (showLeftArmOverlay) {
        drawLeftArm(textureId, armTexture.overlay, ox, oy, pixelate);
      }
      ctx.defineRegion([ox - 8, oy + 8, 48, 64], `${textureId}:leftArm`);

      // Legs

      ox = x + 49;
      oy = y + 154;

      // Right Leg

      drawRightLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showRightLegOverlay) {
        drawRightLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }
      ctx.defineRegion(
        [ox, oy + bodyHeight, 96, 128 - bodyHeight],
        `${textureId}:rightLeg`
      );

      // Left Leg

      drawLeftLeg(textureId, steve.base, ox, oy, bodyHeight, pixelate);

      if (showLeftLegOverlay) {
        drawLeftLeg(textureId, steve.overlay, ox, oy, bodyHeight, pixelate);
      }
      ctx.defineRegion(
        [ox + 96, oy + bodyHeight, 160, 128 - bodyHeight],
        `${textureId}:leftLeg`
      );

      // Draw the fold and cut lines
      ctx.drawImage("Foreground", [x, y]);
      if (showFolds) {
        drawFolds([x, y]);
      }
    }
  };

  drawMini(props.mini1, 121, 108);
  drawMini(props.mini2, 121, 453);

  ctx.drawImage("Title", [0, 0]);
  ctx.fillBackgroundColorWithWhite();
};

const minecraftCharacterMiniGeneratorV2: GeneratorV2<MinecraftCharacterMiniProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();
const noSkinValue: MinecraftSkinInputValue = {
  modelType: "Wide",
  selection: { kind: "none" },
};
const textureStyleOptions = [
  { id: "Simple", label: "Simple" },
  { id: "Detailed", label: "Detailed" },
];

function Component(): JSX.Element {
  const [mini1Value, setMini1Value] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [mini2Value, setMini2Value] =
    React.useState<MinecraftSkinInputValue>(noSkinValue);
  const [mini1Texture, setMini1Texture] = React.useState<Texture | null>(null);
  const [mini2Texture, setMini2Texture] = React.useState<Texture | null>(null);
  const [mini1Folds, setMini1Folds] = React.useState(true);
  const [mini2Folds, setMini2Folds] = React.useState(true);
  const [mini1BodyHeight, setMini1BodyHeight] = React.useState(32);
  const [mini2BodyHeight, setMini2BodyHeight] = React.useState(32);
  const [mini1TextureStyle, setMini1TextureStyle] = React.useState("Simple");
  const [mini2TextureStyle, setMini2TextureStyle] = React.useState("Simple");
  const [mini1Head, setMini1Head] = React.useState(true);
  const [mini1Body, setMini1Body] = React.useState(true);
  const [mini1LeftArm, setMini1LeftArm] = React.useState(true);
  const [mini1RightArm, setMini1RightArm] = React.useState(true);
  const [mini1LeftLeg, setMini1LeftLeg] = React.useState(true);
  const [mini1RightLeg, setMini1RightLeg] = React.useState(true);
  const [mini2Head, setMini2Head] = React.useState(true);
  const [mini2Body, setMini2Body] = React.useState(true);
  const [mini2LeftArm, setMini2LeftArm] = React.useState(true);
  const [mini2RightArm, setMini2RightArm] = React.useState(true);
  const [mini2LeftLeg, setMini2LeftLeg] = React.useState(true);
  const [mini2RightLeg, setMini2RightLeg] = React.useState(true);

  const mini1: MiniProps | null = mini1Texture
    ? {
        textureId: "Mini 1",
        modelType: mini1Value.modelType,
        showFolds: mini1Folds,
        bodyHeight: mini1BodyHeight,
        pixelate: mini1TextureStyle === "Simple",
        showHeadOverlay: mini1Head,
        showBodyOverlay: mini1Body,
        showLeftArmOverlay: mini1LeftArm,
        showRightArmOverlay: mini1RightArm,
        showLeftLegOverlay: mini1LeftLeg,
        showRightLegOverlay: mini1RightLeg,
      }
    : null;
  const mini2: MiniProps | null = mini2Texture
    ? {
        textureId: "Mini 2",
        modelType: mini2Value.modelType,
        showFolds: mini2Folds,
        bodyHeight: mini2BodyHeight,
        pixelate: mini2TextureStyle === "Simple",
        showHeadOverlay: mini2Head,
        showBodyOverlay: mini2Body,
        showLeftArmOverlay: mini2LeftArm,
        showRightArmOverlay: mini2RightArm,
        showLeftLegOverlay: mini2LeftLeg,
        showRightLegOverlay: mini2RightLeg,
      }
    : null;
  const rendererProps: MinecraftCharacterMiniProps = { mini1, mini2 };

  const dynamicTextures = React.useMemo(() => {
    const loaded = new Map<string, Texture>();
    if (mini1Texture) loaded.set("Mini 1", mini1Texture);
    if (mini2Texture) loaded.set("Mini 2", mini2Texture);
    return loaded;
  }, [mini1Texture, mini2Texture]);

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    switch (regionId) {
      case "Mini 1:head":
        setMini1Head((value) => !value);
        break;
      case "Mini 1:body":
        setMini1Body((value) => !value);
        break;
      case "Mini 1:leftArm":
        setMini1LeftArm((value) => !value);
        break;
      case "Mini 1:rightArm":
        setMini1RightArm((value) => !value);
        break;
      case "Mini 1:leftLeg":
        setMini1LeftLeg((value) => !value);
        break;
      case "Mini 1:rightLeg":
        setMini1RightLeg((value) => !value);
        break;
      case "Mini 2:head":
        setMini2Head((value) => !value);
        break;
      case "Mini 2:body":
        setMini2Body((value) => !value);
        break;
      case "Mini 2:leftArm":
        setMini2LeftArm((value) => !value);
        break;
      case "Mini 2:rightArm":
        setMini2RightArm((value) => !value);
        break;
      case "Mini 2:leftLeg":
        setMini2LeftLeg((value) => !value);
        break;
      case "Mini 2:rightLeg":
        setMini2RightLeg((value) => !value);
        break;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />
      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <MinecraftSkinControl
              id="Mini 1"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={mini1Value}
              textures={noTextures}
              onValueChange={setMini1Value}
              onChange={setMini1Texture}
            />
            {mini1Texture ? (
              <>
                <GeneratorUI.BooleanControl
                  label="Show Mini 1 Folds"
                  checked={mini1Folds}
                  onCheckedChange={setMini1Folds}
                />
                <GeneratorUI.RangeControl
                  label="Mini 1 Body Height"
                  min={0}
                  max={64}
                  step={1}
                  value={mini1BodyHeight}
                  onValueChange={setMini1BodyHeight}
                />
                <GeneratorUI.SelectControl
                  label="Mini 1 Texture Style"
                  options={textureStyleOptions}
                  value={mini1TextureStyle}
                  onValueChange={setMini1TextureStyle}
                />
              </>
            ) : null}
            <MinecraftSkinControl
              id="Mini 2"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={mini2Value}
              textures={noTextures}
              onValueChange={setMini2Value}
              onChange={setMini2Texture}
            />
            {mini2Texture ? (
              <>
                <GeneratorUI.BooleanControl
                  label="Show Mini 2 Folds"
                  checked={mini2Folds}
                  onCheckedChange={setMini2Folds}
                />
                <GeneratorUI.RangeControl
                  label="Mini 2 Body Height"
                  min={0}
                  max={64}
                  step={1}
                  value={mini2BodyHeight}
                  onValueChange={setMini2BodyHeight}
                />
                <GeneratorUI.SelectControl
                  label="Mini 2 Texture Style"
                  options={textureStyleOptions}
                  value={mini2TextureStyle}
                  onValueChange={setMini2TextureStyle}
                />
              </>
            ) : null}
            <GeneratorUI.History history={history} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftCharacterMiniGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = { id, name, thumbnail, Component };
