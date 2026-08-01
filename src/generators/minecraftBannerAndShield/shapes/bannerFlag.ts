import { type RenderContext, type TextureFrame } from "@genroot/builder";
import { makeCuboid, translateCuboid } from "../../_common/cuboid";
import { Minecraft, type Face, type Rectangle } from "../../_common/minecraft";
import { findBannerShieldTextureVersion } from "../textures/textureVersions";

const scale = 1 / 3;

const bannerFlag = translateCuboid(makeCuboid([20, 40, 1]), [0, 0]);

function scaleToPage(value: number): number {
  return value * scale;
}

// Faces in one cuboid share their mathematical boundaries. Quantising each
// rectangle from its absolute edges (rather than rounding its width alone)
// makes those shared boundaries remain identical on the integer-pixel page.
export function roundRectangleToPixelBounds([
  x,
  y,
  width,
  height,
]: Rectangle): Rectangle {
  const left = Math.round(x);
  const top = Math.round(y);
  const right = Math.round(x + width);
  const bottom = Math.round(y + height);

  return [left, top, right - left, bottom - top];
}

function makeFrameSourceRegion(
  frame: TextureFrame,
  source: Rectangle
): Rectangle {
  const [frameX, frameY, frameWidth, frameHeight] = frame.rectangle;
  const sourceScale =
    frameWidth === frameHeight && frameWidth % 64 === 0 ? frameWidth / 64 : 1;
  const [sourceX, sourceY, sourceWidth, sourceHeight] = source;

  return [
    frameX + sourceX * sourceScale,
    frameY + sourceY * sourceScale,
    sourceWidth * sourceScale,
    sourceHeight * sourceScale,
  ];
}

class BannerBaseMinecraft extends Minecraft {
  constructor(
    private ctx: RenderContext,
    private textureId: string,
    private frame: TextureFrame
  ) {
    super(ctx);
  }

  override drawFaceTexture(
    _textureId: string,
    source: Rectangle,
    destination: Face
  ): void {
    this.ctx.drawTexture(
      this.textureId,
      makeFrameSourceRegion(this.frame, source),
      roundRectangleToPixelBounds(destination.rectangle),
      {
        flip: destination.flip,
        rotateLegacy: destination.rotate,
        blend: destination.blend,
        plugin: destination.plugin ?? undefined,
      }
    );
  }
}

export function drawBannerFlag(
  ctx: RenderContext,
  versionId: string,
  baseId: string
): void {
  const version = findBannerShieldTextureVersion(versionId);
  const base = version?.bases.bannerOptions.find(({ id }) => id === baseId);
  if (!version || !base) {
    return;
  }

  const textureId = (base.textureDef ?? version.bannerTextureDef).id;
  const minecraft = new BannerBaseMinecraft(ctx, textureId, base);

  minecraft.drawCuboid(
    "",
    bannerFlag,
    [scaleToPage(364), scaleToPage(368)],
    [scaleToPage(320), scaleToPage(640), scaleToPage(16)]
  );
}
