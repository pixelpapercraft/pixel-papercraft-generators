import { type TextureDef } from "./generatorDef";

export type Rectangle = [number, number, number, number];

// These types define the shared texture contract used by the builder framework
// and by generated tiled-texture assets under src/generators/_common/textures.
export type TextureData_TileFrame = {
  rectangle: Rectangle;
  crop: Rectangle;
};

export type TextureData_Tile = {
  name: string;
  frames: TextureData_TileFrame[];
};

export type TextureData = {
  textureDef: TextureDef;
  tiles: TextureData_Tile[];
};

export type TextureFrame = {
  id: string;
  label: string;
  rectangle: Rectangle;
  crop: Rectangle;
};

// An atlas is the packed output sheet that combines many texture frames into one canvas.
export type Atlas = {
  atlasWidth: number;
  atlasHeight: number;
  frames: TextureFrame[];
};

// Labels are used in the picker UI and should stay human-readable.
function makeTextureFrameLabel(
  name: string,
  frameIndex: number,
  frameCount: number
): string {
  const label = name.replace(/\.(png|jpe?g)$/i, "").replace(/_/g, " ");
  return frameCount > 1 ? `${label} (Frame ${frameIndex + 1})` : label;
}

// Convert a generated tile definition into the frames the builder UI consumes.
// Oversized or malformed tiles are dropped by returning an empty list.
function tileToTextureFrames(
  tile: TextureData_Tile,
  frameSize: number
): TextureFrame[] {
  const frameCount = tile.frames.length;
  const frames: TextureFrame[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    const tileFrame = tile.frames[frameIndex]!;
    const [x, y, width, height] = tileFrame.rectangle;

    if (width % frameSize !== 0 || height % frameSize !== 0) {
      return [];
    }

    const id =
      frameCount > 1 ? tile.name + "_" + String(frameIndex) : tile.name;
    frames.push({
      id,
      label: makeTextureFrameLabel(tile.name, frameIndex, frameCount),
      rectangle: [x, y, width, height],
      crop: tileFrame.crop,
    });
  }

  return frames;
}

// Sort tiles into a stable order before they are exposed to the picker or atlas.
export function tilesToTextureFrames(
  tiles: TextureData_Tile[],
  frameSize: number
): TextureFrame[] {
  return sortTextureDataTiles(tiles, frameSize).flatMap((tile) =>
    tileToTextureFrames(tile, frameSize)
  );
}

// Ordinary single-frame tiles come first, followed by oversized singles, then animations.
export function sortTextureDataTiles(
  tiles: TextureData_Tile[],
  frameSize: number
): TextureData_Tile[] {
  return tiles
    .map((tile, index) => ({ tile, index }))
    .sort((a, b) => {
      const categoryA = textureDataTileCategory(a.tile, frameSize);
      const categoryB = textureDataTileCategory(b.tile, frameSize);

      if (categoryA !== categoryB) {
        return categoryA - categoryB;
      }

      return a.index - b.index;
    })
    .map(({ tile }) => tile);
}

function textureDataTileCategory(
  tile: TextureData_Tile,
  frameSize: number
): number {
  if (tile.frames.length > 1) {
    return 2;
  }

  const frame = tile.frames[0];
  if (!frame) {
    return 0;
  }

  const [, , width, height] = frame.rectangle;
  return width > frameSize || height > frameSize ? 1 : 0;
}

// Split a vertically stacked image into frames when the image height encodes animation frames.
// Examples:
// - 32x32 -> 1 frame
// - 64x64 -> 1 frame
// - 64x65 -> 1 frame
// - 64x128 -> 2 frames
// - 64x96 -> 1 frame, with the trailing 32px ignored
// A single frame keeps the base file name as its label, so `sword.png` becomes `sword`.
// Frame numbers only appear when the image contains at least two full width-sized rows.
// The frame count is derived from the image width, so any trailing partial row is ignored.
// TODO: handle non-multiple animation sheets explicitly instead of truncating the trailing pixels.
export function imageToTextureFrames(
  name: string,
  imageWidth: number,
  imageHeight: number
): TextureFrame[] {
  const frameSize = imageWidth;
  const frameCount = frameSize > 0 ? Math.floor(imageHeight / frameSize) : 0;

  if (frameCount < 1) {
    return [
      {
        id: name,
        label: makeTextureFrameLabel(name, 0, 1),
        rectangle: [0, 0, imageWidth, imageHeight],
        crop: [0, 0, imageWidth, imageHeight],
      },
    ];
  }

  const frames: TextureFrame[] = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
    const frameId = frameCount > 1 ? `${name}_${frameIndex}` : name;
    frames.push({
      id: frameId,
      label: makeTextureFrameLabel(name, frameIndex, frameCount),
      rectangle: [0, frameIndex * frameSize, imageWidth, frameSize],
      crop: [0, 0, imageWidth, frameSize],
    });
  }

  return frames;
}
