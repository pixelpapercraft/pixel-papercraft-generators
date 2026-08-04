import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { type TextureFrame } from "@genroot/builder/engine/textureData";
import {
  type BannerShieldPattern,
  type BannerShieldTextureVersion,
} from "./types";

export type PatternOption = {
  pattern: BannerShieldPattern;
  textureDef: TextureDef;
  frame: TextureFrame;
};

// A pattern with neither frame can't happen from real pairPatterns output
// (every id comes from at least one side), but the type allows it, so this
// stays defensive rather than asserting.
export function makePatternOptions(
  version: BannerShieldTextureVersion
): PatternOption[] {
  return version.patterns.flatMap((pattern) => {
    if (pattern.bannerFrame) {
      return [
        {
          pattern,
          textureDef: version.bannerTextureDef,
          frame: pattern.bannerFrame,
        },
      ];
    }
    if (pattern.shieldFrame) {
      return [
        {
          pattern,
          textureDef: version.shieldTextureDef,
          frame: pattern.shieldFrame,
        },
      ];
    }
    return [];
  });
}

export function filterPatternOptions(
  options: PatternOption[],
  search: string
): PatternOption[] {
  const searchLower = search.trim().toLowerCase();
  return searchLower
    ? options.filter(({ pattern }) =>
        pattern.label.toLowerCase().includes(searchLower)
      )
    : options;
}

export function findSelectedPatternOption(
  options: PatternOption[],
  selectedPatternId: string | null
): PatternOption | null {
  if (selectedPatternId === null) {
    return null;
  }
  return (
    options.find(({ pattern }) => pattern.id === selectedPatternId) ?? null
  );
}

// The banner/shield front face within a 64px pattern tile — the only region
// worth previewing, since the rest of the tile is folded away or hidden
// under the handle/crossbar in the finished model. Scales with the frame's
// actual size, so it still lines up if a texture atlas ever ships at a
// different logical frame size.
const frontFaceCrop = [1, 1, 20, 40] as const;
const frontFaceCropFrameSize = 64;

function scaleFrontFaceCrop(
  frame: TextureFrame
): [number, number, number, number] {
  const [cropX, cropY, cropWidth, cropHeight] = frontFaceCrop;
  const [, , frameWidth, frameHeight] = frame.rectangle;
  const scale =
    frameWidth === frameHeight &&
    frameWidth > 0 &&
    frameWidth % frontFaceCropFrameSize === 0
      ? frameWidth / frontFaceCropFrameSize
      : 1;
  return [cropX * scale, cropY * scale, cropWidth * scale, cropHeight * scale];
}

function makeFrontFaceSourceRegion(
  frame: TextureFrame
): [number, number, number, number] {
  const [frameX, frameY] = frame.rectangle;
  const [cropX, cropY, cropWidth, cropHeight] = scaleFrontFaceCrop(frame);
  return [frameX + cropX, frameY + cropY, cropWidth, cropHeight];
}

// The front-face crop's fixed aspect ratio, applied at a given preview
// height — used both to size an individual tile and the larger selected
// preview panel, so both stay proportioned the same way.
export function makeFrontFacePreviewSize(height: number): {
  width: number;
  height: number;
} {
  const [, , cropWidth, cropHeight] = frontFaceCrop;
  return { width: (cropWidth / cropHeight) * height, height };
}

function px(n: number): string {
  return `${n}px`;
}

type PreviewGeometry = {
  backgroundPositionX: number;
  backgroundPositionY: number;
  scaleX: number;
  scaleY: number;
};

function computePreviewGeometry(
  frame: TextureFrame,
  tileHeight: number
): PreviewGeometry {
  const [sourceX, sourceY, sourceWidth, sourceHeight] =
    makeFrontFaceSourceRegion(frame);
  const { width, height } = makeFrontFacePreviewSize(tileHeight);
  const scaleX = width / sourceWidth;
  const scaleY = height / sourceHeight;
  return {
    backgroundPositionX: -sourceX * scaleX,
    backgroundPositionY: -sourceY * scaleY,
    scaleX,
    scaleY,
  };
}

export function makeTileFrameStyle(isSelected: boolean, height: number) {
  const { width } = makeFrontFacePreviewSize(height);
  const borderSize = 4;
  const borderColor = isSelected ? "rgb(156 163 175)" : "rgb(229 231 235)";
  return {
    border: `${px(borderSize)} solid ${borderColor}`,
    width: px(width + borderSize * 2),
    height: px(height + borderSize * 2),
  };
}

export function makePatternPreviewStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  tileHeight: number
) {
  const geometry = computePreviewGeometry(frame, tileHeight);
  return {
    backgroundImage: `url(${textureDef.url})`,
    backgroundPosition: `${px(geometry.backgroundPositionX)} ${px(geometry.backgroundPositionY)}`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${px(textureDef.standardWidth * geometry.scaleX)} ${px(textureDef.standardHeight * geometry.scaleY)}`,
    backgroundColor: "white",
    imageRendering: "pixelated" as const,
  };
}

// A tint applies as a multiply-blended mask over the same cropped region
// the preview background already shows, so the dye color only affects the
// pattern's own pixels, not the transparent parts of the tile. Returns
// undefined for no tint rather than a no-op mask, so callers can omit the
// overlay element entirely.
export function makeTintMaskStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  tileHeight: number,
  blend: string | null
) {
  if (!blend) {
    return undefined;
  }
  const geometry = computePreviewGeometry(frame, tileHeight);
  const maskImage = `url(${textureDef.url})`;
  const maskPosition = `${px(geometry.backgroundPositionX)} ${px(geometry.backgroundPositionY)}`;
  const maskSize = `${px(textureDef.standardWidth * geometry.scaleX)} ${px(textureDef.standardHeight * geometry.scaleY)}`;
  return {
    position: "absolute" as const,
    inset: 0,
    pointerEvents: "none" as const,
    backgroundColor: blend,
    mixBlendMode: "multiply" as const,
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskPosition: maskPosition,
    maskPosition,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: maskSize,
    maskSize,
  };
}
