"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
  type HistoryDef,
  type ImageDef,
  type RenderContext,
  type Texture,
  type TextureDef,
  type ThumbnailDef,
  type VideoDef,
} from "@genroot/builder/v2";
import {
  MinecraftSkinControl,
  getDefaultMinecraftSkinInputValue,
  type MinecraftSkinInputValue,
} from "../_common/skins/skinControl";
import { steve, alex } from "@genroot/generators/_common/minecraftCharacter";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import overlayBeeImage from "./images/OverlayBee.png";

import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

const id = "minecraft-bee-character-v2";

const name = "Minecraft Bee Character";

const video: VideoDef = {
  url: "https://www.youtube.com/embed/vG-mXWu0OlA?rel=0",
};

const history: HistoryDef = [
  "1 May 2022 PaperDoggy - Initial script developed.",
];

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [{ id: "OverlayBee", url: overlayBeeImage.src }];

const textures: TextureDef[] = [];

type MinecraftBeeCharacterProps = {
  isSlim1: boolean;
  isSlim2: boolean;
  headMultiplier1: number;
  headMultiplier2: number;
};

const render = (
  ctx: RenderContext,
  props: MinecraftBeeCharacterProps
): void => {
  const drawing = {
    drawHead: (ox: number, oy: number, k: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.head.front, [ox, oy, 56, 56]);
      ctx.drawTexture(texture, steve.base.head.right, [
        ox - k * 8 - 1,
        oy,
        k * 8,
        56,
      ]);
      ctx.drawTexture(texture, steve.base.head.left, [ox + 57, oy, k * 8, 56]);
      ctx.drawTexture(texture, steve.base.head.top, [
        ox,
        oy - k * 8 - 1,
        56,
        k * 8,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.head.bottom,
        [ox, oy + 57, 56, k * 8],
        { flip: "Vertical" }
      );
      ctx.drawTexture(texture, steve.overlay.head.front, [ox, oy, 56, 56]);
      ctx.drawTexture(texture, steve.overlay.head.right, [
        ox - k * 8 - 1,
        oy,
        k * 8,
        56,
      ]);
      ctx.drawTexture(texture, steve.overlay.head.left, [
        ox + 57,
        oy,
        k * 8,
        56,
      ]);
      ctx.drawTexture(texture, steve.overlay.head.top, [
        ox,
        oy - k * 8 - 1,
        56,
        k * 8,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.head.bottom,
        [ox, oy + 57, 56, k * 8],
        { flip: "Vertical" }
      );
    },

    drawBody: (ox: number, oy: number, k: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.body.front, [
        ox,
        oy + 57 + k * 8,
        56,
        (10 - k) * 8,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.body.right,
        [ox - 1 - k * 8, oy, 56, (10 - k) * 8],
        { rotateLegacy: 90.0 }
      );
      ctx.drawTexture(
        texture,
        steve.base.body.left,
        [ox + 57 + k * 8, oy + 56, 56, 8 * (10 - k)],
        { rotateLegacy: -90.0 }
      );
      ctx.drawTexture(texture, steve.base.body.bottom, [
        ox + 57 + 81,
        oy,
        56,
        56,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.body.back,
        [ox, oy - 81, 56, (10 - k) * 8],
        { rotate: 180.0 }
      );
      ctx.drawTexture(texture, steve.overlay.body.front, [
        ox,
        oy + 57 + k * 8,
        56,
        (10 - k) * 8,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.body.right,
        [ox - 1 - k * 8, oy, 56, (10 - k) * 8],
        { rotateLegacy: 90.0 }
      );
      ctx.drawTexture(
        texture,
        steve.overlay.body.left,
        [ox + 57 + k * 8, oy + 56, 56, 8 * (10 - k)],
        { rotateLegacy: -90.0 }
      );
      ctx.drawTexture(texture, steve.base.body.bottom, [
        ox + 57 + 81,
        oy,
        56,
        56,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.body.back,
        [ox, oy - 81, 56, (10 - k) * 8],
        { rotate: 180.0 }
      );
    },

    drawRightArm: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.rightArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.base.rightArm.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.overlay.rightArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(
        texture,
        steve.overlay.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftArm: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.leftArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.base.leftArm.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.overlay.leftArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(
        texture,
        steve.overlay.leftArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawRightArmAlex: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, alex.base.rightArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, alex.base.rightArm.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, alex.overlay.rightArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(
        texture,
        alex.overlay.rightArm.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftArmAlex: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, alex.base.leftArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, alex.base.leftArm.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, alex.overlay.leftArm.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, alex.overlay.leftArm.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
    },

    drawRightLeg: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.rightLeg.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.base.rightLeg.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.overlay.rightLeg.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(
        texture,
        steve.overlay.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawLeftLeg: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.rightLeg.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.base.rightLeg.back, [ox + 9, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(texture, steve.overlay.rightLeg.front, [ox, oy, 8, 16], {
        pixelate: true,
      });
      ctx.drawTexture(
        texture,
        steve.overlay.rightLeg.back,
        [ox + 9, oy, 8, 16],
        { pixelate: true }
      );
    },

    drawPlan: (ox: number, oy: number, k: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.head.front, [ox, oy - 32, 32, 32]);
      ctx.drawTexture(texture, steve.base.body.front, [ox, oy, 32, 48]);
      ctx.drawTexture(texture, steve.base.rightLeg.front, [
        ox,
        oy + 48,
        16,
        48,
      ]);
      ctx.drawTexture(texture, steve.base.leftLeg.front, [
        ox + 16,
        oy + 48,
        16,
        48,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.head.front,
        [ox - 36, oy + 131, 28, 28],
        { pixelate: true }
      );
      ctx.drawTexture(texture, steve.base.head.left, [
        ox + 44,
        oy + 131,
        k * 4,
        28,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.body.left,
        [ox + 44 + k * 4, oy + 131 + 28, 28, (10 - k) * 4],
        { rotateLegacy: -90.0 }
      );
      ctx.drawTexture(
        texture,
        steve.base.body.back,
        [ox + 5, oy + 174, 28, (10 - k) * 4],
        { rotate: -180.0 }
      );
      ctx.drawTexture(texture, steve.base.head.top, [
        ox + 5,
        oy + 174 + (10 - k) * 4,
        28,
        k * 4,
      ]);
      ctx.drawTexture(
        texture,
        steve.base.rightLeg.front,
        [ox - 33, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        steve.base.leftLeg.front,
        [ox - 14, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(texture, steve.overlay.head.front, [ox, oy - 32, 32, 32]);
      ctx.drawTexture(texture, steve.overlay.body.front, [ox, oy, 32, 48]);
      ctx.drawTexture(texture, steve.overlay.rightLeg.front, [
        ox,
        oy + 48,
        16,
        48,
      ]);
      ctx.drawTexture(texture, steve.overlay.leftLeg.front, [
        ox + 16,
        oy + 48,
        16,
        48,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.head.front,
        [ox - 36, oy + 131, 28, 28],
        { pixelate: true }
      );
      ctx.drawTexture(texture, steve.overlay.head.left, [
        ox + 44,
        oy + 131,
        k * 4,
        28,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.body.left,
        [ox + 44 + k * 4, oy + 131 + 28, 28, (10 - k) * 4],
        { rotateLegacy: -90.0 }
      );
      ctx.drawTexture(
        texture,
        steve.overlay.body.back,
        [ox + 5, oy + 174, 28, (10 - k) * 4],
        { rotate: -180.0 }
      );
      ctx.drawTexture(texture, steve.overlay.head.top, [
        ox + 5,
        oy + 174 + (10 - k) * 4,
        28,
        k * 4,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.rightLeg.front,
        [ox - 33, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        steve.overlay.leftLeg.front,
        [ox - 14, oy + 160, 3, 8],
        { pixelate: true }
      );
    },

    drawPlanArms: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, steve.base.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      ctx.drawTexture(texture, steve.base.leftArm.front, [ox + 32, oy, 16, 48]);
      ctx.drawTexture(
        texture,
        steve.base.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        steve.base.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(texture, steve.overlay.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      ctx.drawTexture(texture, steve.overlay.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      ctx.drawTexture(
        texture,
        steve.overlay.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        steve.overlay.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
    },

    drawPlanArmsAlex: (ox: number, oy: number, texture: string) => {
      ctx.drawTexture(texture, alex.base.rightArm.front, [ox - 16, oy, 16, 48]);
      ctx.drawTexture(texture, alex.base.leftArm.front, [ox + 32, oy, 16, 48]);
      ctx.drawTexture(
        texture,
        alex.base.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        alex.base.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(texture, alex.overlay.rightArm.front, [
        ox - 16,
        oy,
        16,
        48,
      ]);
      ctx.drawTexture(texture, alex.overlay.leftArm.front, [
        ox + 32,
        oy,
        16,
        48,
      ]);
      ctx.drawTexture(
        texture,
        alex.overlay.rightArm.front,
        [ox - 27, oy + 160, 3, 8],
        { pixelate: true }
      );
      ctx.drawTexture(
        texture,
        alex.overlay.leftArm.front,
        [ox - 20, oy + 160, 3, 8],
        { pixelate: true }
      );
    },
  };
  ctx.drawImage("OverlayBee", [0, 0]);

  const ox1 = 108;
  const oy1 = 103;

  drawing.drawHead(ox1, oy1, props.headMultiplier1, "Skin 1");
  drawing.drawBody(ox1, oy1, props.headMultiplier1, "Skin 1");

  if (props.isSlim1) {
    drawing.drawRightArmAlex(ox1 + 221, oy1 - 53, "Skin 1");
    drawing.drawLeftArmAlex(ox1 + 245, oy1 - 53, "Skin 1");
  } else {
    drawing.drawRightArm(ox1 + 221, oy1 - 53, "Skin 1");
    drawing.drawLeftArm(ox1 + 245, oy1 - 53, "Skin 1");
  }

  drawing.drawRightLeg(ox1 + 221, oy1 - 20, "Skin 1");
  drawing.drawLeftLeg(ox1 + 245, oy1 - 20, "Skin 1");
  drawing.drawRightLeg(ox1 + 221, oy1 + 12, "Skin 1");
  drawing.drawLeftLeg(ox1 + 245, oy1 + 12, "Skin 1");
  drawing.drawPlan(ox1 + 321, oy1 - 48, props.headMultiplier1, "Skin 1");

  if (props.isSlim1) {
    drawing.drawPlanArmsAlex(ox1 + 321, oy1 - 48, "Skin 1");
  } else {
    drawing.drawPlanArms(ox1 + 321, oy1 - 48, "Skin 1");
  }

  const ox2 = 108;
  const oy2 = 416;

  drawing.drawHead(ox2, oy2, props.headMultiplier2, "Skin 2");
  drawing.drawBody(ox2, oy2, props.headMultiplier2, "Skin 2");

  if (props.isSlim2) {
    drawing.drawRightArmAlex(ox2 + 221, oy2 - 53, "Skin 2");
    drawing.drawLeftArmAlex(ox2 + 245, oy2 - 53, "Skin 2");
  } else {
    drawing.drawRightArm(ox2 + 221, oy2 - 53, "Skin 2");
    drawing.drawLeftArm(ox2 + 245, oy2 - 53, "Skin 2");
  }

  drawing.drawRightLeg(ox2 + 221, oy2 - 20, "Skin 2");
  drawing.drawLeftLeg(ox2 + 245, oy2 - 20, "Skin 2");
  drawing.drawRightLeg(ox2 + 221, oy2 + 12, "Skin 2");
  drawing.drawLeftLeg(ox2 + 245, oy2 + 12, "Skin 2");
  drawing.drawPlan(ox2 + 321, oy2 - 48, props.headMultiplier2, "Skin 2");

  if (props.isSlim2) {
    drawing.drawPlanArmsAlex(ox2 + 321, oy2 - 48, "Skin 2");
  } else {
    drawing.drawPlanArms(ox2 + 321, oy2 - 48, "Skin 2");
  }

  ctx.drawImage("OverlayBee", [0, 0]);
};

const minecraftBeeCharacterGeneratorV2: GeneratorV2<MinecraftBeeCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

const skinOptions = makeDefaultMinecraftSkinPresetOptions();
const noTextures: Map<string, Texture> = new Map();

function Component(): JSX.Element {
  const [skin1Value, setSkin1Value] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skin1Texture, setSkin1Texture] = React.useState<Texture | null>(null);
  const [skin2Value, setSkin2Value] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skin2Texture, setSkin2Texture] = React.useState<Texture | null>(null);
  const [headMultiplier1, setHeadMultiplier1] = React.useState(0);
  const [headMultiplier2, setHeadMultiplier2] = React.useState(0);

  const rendererProps: MinecraftBeeCharacterProps = {
    isSlim1: skin1Value.modelType === "Slim",
    isSlim2: skin2Value.modelType === "Slim",
    headMultiplier1,
    headMultiplier2,
  };

  const dynamicTextures = React.useMemo(() => {
    const map = new Map<string, Texture>();
    if (skin1Texture) {
      map.set("Skin 1", skin1Texture);
    }
    if (skin2Texture) {
      map.set("Skin 2", skin2Texture);
    }
    return map;
  }, [skin1Texture, skin2Texture]);

  return (
    <div>
      <GeneratorUI.MediaHero video={video} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="w-full bg-gray-100 p-8 space-y-4">
            <MinecraftSkinControl
              id="Skin 1"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={skin1Value}
              textures={noTextures}
              onValueChange={setSkin1Value}
              onChange={setSkin1Texture}
            />
            <GeneratorUI.RangeControl
              label="Head Size 1"
              min={0}
              max={10}
              step={1}
              value={headMultiplier1}
              onValueChange={setHeadMultiplier1}
            />

            <MinecraftSkinControl
              id="Skin 2"
              options={skinOptions}
              standardWidth={64}
              standardHeight={64}
              showModelType={true}
              value={skin2Value}
              textures={noTextures}
              onValueChange={setSkin2Value}
              onChange={setSkin2Texture}
            />
            <GeneratorUI.RangeControl
              label="Head Size 2"
              min={0}
              max={10}
              step={1}
              value={headMultiplier2}
              onValueChange={setHeadMultiplier2}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftBeeCharacterGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
