import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureFrame } from "@genroot/builder/modules/textureData";

function px(n: number): string {
  return n + "px";
}

function makeBackgroundImage(url: string): string {
  return "url(" + url + ")";
}

function makeBackgroundPosition(x: number, y: number): string {
  return px(x) + " " + px(y);
}

function makeBackgroundSize(x: number, y: number): string {
  return px(x) + " " + px(y);
}

export function makeTileStyle(
  textureDef: TextureDef,
  frame: TextureFrame,
  tileSize: number
) {
  const [x, y, width, height] = frame.rectangle;
  const widthScale = tileSize / width;
  const heightScale = tileSize / height;

  return {
    backgroundImage: makeBackgroundImage(textureDef.url),
    backgroundPosition: makeBackgroundPosition(
      -x * widthScale,
      -y * heightScale
    ),
    backgroundRepeat: "no-repeat",
    backgroundSize: makeBackgroundSize(
      textureDef.standardWidth * widthScale,
      textureDef.standardHeight * heightScale
    ),
    imageRendering: "pixelated" as const,
  };
}
