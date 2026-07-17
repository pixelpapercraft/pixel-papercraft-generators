"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type GeneratorV2,
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
import { steve, alex } from "../_common/minecraftCharacter";
import { makeDefaultMinecraftSkinPresetOptions } from "../_common/skins/options";

import thumbnailImage from "./thumbnail/thumbnail-256.jpeg";
import overlayAllayImage from "./images/OverlayAllay.png";

const id = "minecraft-allay-character-v2";

const name = "Minecraft Allay Character (v2)";

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

// Same video as the v1 minecraft-allay-character generator.
const video: VideoDef = {
  url: "https://www.youtube.com/embed/vG-mXWu0OlA?rel=0",
};

const images: ImageDef[] = [{ id: "Overlay", url: overlayAllayImage.src }];

// No static "Skin 1"/"Skin 2" textures: each is supplied at runtime by its own
// skin picker through `dynamicTextures`, same pattern as the single-skin
// character ports (example-v2 / minecraft-character-v2). See the migration
// plan's correctness note on why a static skin would make "None" wrong.
const textures: TextureDef[] = [];

const skinOptions = makeDefaultMinecraftSkinPresetOptions();

// `MinecraftSkinControl` only reads this for `texture`-kind options; the
// default preset options are all presets, so a shared empty map is safe.
const noTextures: Map<string, Texture> = new Map();

// This generator has two independent skin inputs. Each drives half the page
// (Skin 1 the top, Skin 2 the bottom) and carries its own model-type (Wide vs
// Slim), so the render takes two independent `isSlim` flags.
type MinecraftAllayCharacterProps = {
  isSlim1: boolean;
  isSlim2: boolean;
};

// Ported from `minecraftAllayCharacterGenerator.ts`'s `script` render body:
// same per-face `drawTexture` calls, same offsets, same flips, same draw
// order. The only differences are `generator.drawTexture` -> `ctx.drawTexture`
// and the two model-type booleans coming from `props` instead of
// `generator.getMinecraftSkinInputModelType`.
const render = (
  ctx: RenderContext,
  props: MinecraftAllayCharacterProps
): void => {
  const drawHead = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, steve.base.head.front, [ox, oy, 50, 50]);
    ctx.drawTexture(texture, steve.base.head.right, [ox - 51, oy, 50, 50]);
    ctx.drawTexture(texture, steve.base.head.left, [ox + 51, oy, 50, 50]);
    ctx.drawTexture(texture, steve.base.head.back, [
      ox + 51 * 2,
      oy,
      50,
      50,
    ]);
    ctx.drawTexture(texture, steve.base.head.top, [ox, oy - 51, 50, 50]);
    ctx.drawTexture(
      texture,
      steve.base.head.bottom,
      [ox, oy + 51, 50, 50],
      { flip: "Vertical" }
    );
    ctx.drawTexture(texture, steve.overlay.head.front, [ox, oy, 50, 50]);
    ctx.drawTexture(texture, steve.overlay.head.right, [
      ox - 51,
      oy,
      50,
      50,
    ]);
    ctx.drawTexture(texture, steve.overlay.head.left, [
      ox + 51,
      oy,
      50,
      50,
    ]);
    ctx.drawTexture(texture, steve.overlay.head.back, [
      ox + 51 * 2,
      oy,
      50,
      50,
    ]);
    ctx.drawTexture(texture, steve.overlay.head.top, [
      ox,
      oy - 51,
      50,
      50,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.head.bottom,
      [ox, oy + 51, 50, 50],
      { flip: "Vertical" }
    );
  };

  const drawBody = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, steve.base.body.front, [ox, oy, 30, 30]);
    ctx.drawTexture(texture, steve.base.body.right, [
      ox - 21,
      oy,
      20,
      30,
    ]);
    ctx.drawTexture(texture, steve.base.body.left, [ox + 31, oy, 20, 30]);
    ctx.drawTexture(texture, steve.base.body.back, [
      ox + 31 + 21,
      oy,
      30,
      30,
    ]);
    ctx.drawTexture(texture, steve.base.body.top, [ox, oy - 21, 30, 20]);
    ctx.drawTexture(
      texture,
      steve.base.body.front,
      [ox - 21 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.right,
      [ox - 21 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.left,
      [ox - 21 - 21 - 31 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.back,
      [ox - 21 - 21 - 31 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.top,
      [ox - 21 - 21 - 31, oy - 21, 30, 20],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.overlay.body.front, [ox, oy, 30, 30]);
    ctx.drawTexture(texture, steve.overlay.body.right, [
      ox - 21,
      oy,
      20,
      30,
    ]);
    ctx.drawTexture(texture, steve.overlay.body.left, [
      ox + 31,
      oy,
      20,
      30,
    ]);
    ctx.drawTexture(texture, steve.overlay.body.back, [
      ox + 31 + 21,
      oy,
      30,
      30,
    ]);
    ctx.drawTexture(texture, steve.overlay.body.top, [
      ox,
      oy - 21,
      30,
      20,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.body.front,
      [ox - 21 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.right,
      [ox - 21 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.left,
      [ox - 21 - 21 - 31 - 21, oy, 20, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.back,
      [ox - 21 - 21 - 31 - 21 - 31, oy, 30, 30],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.top,
      [ox - 21 - 21 - 31, oy - 21, 30, 20],
      { flip: "Horizontal" }
    );
  };

  const drawRightArm = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, steve.base.rightArm.front, [ox, oy, 10, 40]);
    ctx.drawTexture(texture, steve.base.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      steve.base.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.overlay.rightArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLeftArm = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, steve.base.leftArm.front, [ox, oy, 10, 40]);
    ctx.drawTexture(texture, steve.base.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.base.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      steve.base.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.overlay.leftArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawRightArmAlex = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, alex.base.rightArm.front, [ox, oy, 10, 40]);
    ctx.drawTexture(texture, alex.base.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      alex.base.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, alex.overlay.rightArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.rightArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.rightArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.rightArm.back, [
      ox - 11 - 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.rightArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      alex.overlay.rightArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLeftArmAlex = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, alex.base.leftArm.front, [ox, oy, 10, 40]);
    ctx.drawTexture(texture, alex.base.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.base.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      alex.base.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, alex.overlay.leftArm.front, [
      ox,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.leftArm.right, [
      ox - 21,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.leftArm.left, [
      ox + 11,
      oy,
      20,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.leftArm.back, [
      ox + 11 + 21,
      oy,
      10,
      40,
    ]);
    ctx.drawTexture(texture, alex.overlay.leftArm.top, [
      ox,
      oy - 21,
      10,
      20,
    ]);
    ctx.drawTexture(
      texture,
      alex.overlay.leftArm.bottom,
      [ox, oy + 41, 10, 20],
      { flip: "Horizontal" }
    );
  };

  const drawLegs = (ox: number, oy: number, texture: string) => {
    ctx.drawTexture(texture, steve.base.body.front, [ox, oy, 30, 25]);
    ctx.drawTexture(texture, steve.base.body.right, [
      ox - 21,
      oy,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.body.left, [ox + 31, oy, 20, 25]);
    ctx.drawTexture(texture, steve.base.body.back, [
      ox + 31 + 21,
      oy,
      30,
      25,
    ]);
    ctx.drawTexture(
      texture,
      steve.base.body.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.left,
      [ox + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.body.back,
      [ox + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.base.rightLeg.front, [
      ox,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.rightLeg.right, [
      ox - 21,
      oy + 25,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.rightLeg.back, [
      ox + 31 + 21 + 15,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.leftLeg.front, [
      ox + 15,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.leftLeg.left, [
      ox + 31,
      oy + 25,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.base.leftLeg.back, [
      ox + 31 + 21,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(
      texture,
      steve.base.rightLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.rightLeg.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.rightLeg.back,
      [ox + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.leftLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.leftLeg.left,
      [ox + 31 + 21 + 31 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.base.leftLeg.back,
      [ox + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.overlay.body.front, [ox, oy, 30, 25]);
    ctx.drawTexture(texture, steve.overlay.body.right, [
      ox - 21,
      oy,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.body.left, [
      ox + 31,
      oy,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.body.back, [
      ox + 31 + 21,
      oy,
      30,
      25,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.body.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.left,
      [ox + 31 + 31 + 21 + 31, oy, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.body.back,
      [ox + 31 + 21 + 31, oy, 30, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(texture, steve.overlay.rightLeg.front, [
      ox,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightLeg.right, [
      ox - 21,
      oy + 25,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.rightLeg.back, [
      ox + 31 + 21 + 15,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftLeg.front, [
      ox + 15,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftLeg.left, [
      ox + 31,
      oy + 25,
      20,
      25,
    ]);
    ctx.drawTexture(texture, steve.overlay.leftLeg.back, [
      ox + 31 + 21,
      oy + 25,
      15,
      25,
    ]);
    ctx.drawTexture(
      texture,
      steve.overlay.rightLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.rightLeg.right,
      [ox + 31 + 21 + 31 + 31 + 21 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.rightLeg.back,
      [ox + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.leftLeg.front,
      [ox + 31 + 21 + 31 + 21 + 31, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.leftLeg.left,
      [ox + 31 + 21 + 31 + 31, oy + 25, 20, 25],
      { flip: "Horizontal" }
    );
    ctx.drawTexture(
      texture,
      steve.overlay.leftLeg.back,
      [ox + 31 + 21 + 31 + 15, oy + 25, 15, 25],
      { flip: "Horizontal" }
    );
  };

  // Skin 1

  drawHead(62, 63, "Skin 1");
  drawBody(422, 84, "Skin 1");

  if (props.isSlim1) {
    drawRightArmAlex(186, 198, "Skin 1");
    drawLeftArmAlex(48, 198, "Skin 1");
  } else {
    drawRightArm(186, 198, "Skin 1");
    drawLeftArm(48, 198, "Skin 1");
  }

  drawLegs(279, 197, "Skin 1");

  // Skin 2

  drawHead(62, 424, "Skin 2");
  drawBody(422, 445, "Skin 2");

  if (props.isSlim2) {
    drawRightArmAlex(186, 198 + 361, "Skin 2");
    drawLeftArmAlex(48, 198 + 361, "Skin 2");
  } else {
    drawRightArm(186, 198 + 361, "Skin 2");
    drawLeftArm(48, 198 + 361, "Skin 2");
  }

  drawLegs(278, 559, "Skin 2");

  ctx.drawImage("Overlay", [0, 0]);
};

const minecraftAllayCharacterGeneratorV2: GeneratorV2<MinecraftAllayCharacterProps> =
  {
    id,
    name,
    images,
    textures,
    render,
  };

// Behaviourally identical to the v1 `minecraft-allay-character` generator: two
// independent `MinecraftSkinControl` skin pickers (each: 10 presets + None +
// upload, with model type), driving the same two-skin body render. No boolean
// toggles and no clickable regions (the v1 draws every base+overlay face
// unconditionally). The author owns the state here and feeds each picker's
// loaded `Texture` back via `dynamicTextures` under its "Skin 1"/"Skin 2" id.
function Component(): JSX.Element {
  const [skin1Value, setSkin1Value] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skin1Texture, setSkin1Texture] = React.useState<Texture | null>(null);
  const [skin2Value, setSkin2Value] = React.useState<MinecraftSkinInputValue>(
    () => getDefaultMinecraftSkinInputValue(skinOptions)
  );
  const [skin2Texture, setSkin2Texture] = React.useState<Texture | null>(null);

  const rendererProps: MinecraftAllayCharacterProps = {
    isSlim1: skin1Value.modelType === "Slim",
    isSlim2: skin2Value.modelType === "Slim",
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
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
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
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={minecraftAllayCharacterGeneratorV2}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
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
