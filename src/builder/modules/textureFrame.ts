/** [x, y, width, height] */
type Rectangle = [number, number, number, number];

type Texture = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type TextureFrame = {
  id: string;
  name: string;
  rectangle: Rectangle;
  frameIndex: number;
  frameCount: number;
};

export function makeFrameLabel(frame: TextureFrame): string {
  const name = frame.name.replace(/_/g, " ");
  if (frame.frameCount > 1) {
    const sequence = String(frame.frameIndex + 1);
    return name + ` (Frame ${sequence})`;
  } else {
    return name;
  }
}

function textureToFrames(texture: Texture, frameSize: number): TextureFrame[] {
  const xMod = texture.width % frameSize;
  const yMod = texture.height % frameSize;
  if (xMod > 0 || yMod > 0) {
    return [];
  } else {
    const rows = texture.height / frameSize;
    const cols = texture.width / frameSize;
    const frames: TextureFrame[] = [];
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const frameIndex = col * rows + row;
        const id = texture.name + "-" + String(frameIndex);
        const frame: TextureFrame = {
          id,
          name: texture.name,
          rectangle: [
            texture.x + col * frameSize,
            texture.y + row * frameSize,
            frameSize,
            frameSize,
          ],
          frameIndex,
          frameCount: rows * cols,
        };
        frames.push(frame);
      }
    }
    return frames;
  }
}

function texturesToFrames(
  textures: Texture[],
  frameSize: number
): TextureFrame[] {
  return textures.reduce((acc: TextureFrame[], texture) => {
    const frames = textureToFrames(texture, frameSize);
    if (frames.length === 0) {
      return acc;
    } else {
      return acc.concat(frames);
    }
  }, []);
}

export function tilesToFrames(
  tiles: Texture[],
  frameSize: number
): TextureFrame[] {
  return texturesToFrames(tiles, frameSize);
}
