type PreviewTextureDef = {
  url: string;
  standardWidth: number;
  standardHeight: number;
};

type PreviewFrame = {
  rectangle: [number, number, number, number];
};

type PreviewRotation = "Rot0" | "Rot90" | "Rot180" | "Rot270";

type PreviewFlip = "None" | "Horizontal" | "Vertical";

function px(n: number): string {
  return n + "px";
}

function deg(n: number): string {
  return n + "deg";
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

function rotationToDegrees(rotation: PreviewRotation): number {
  switch (rotation) {
    case "Rot0":
      return 0;
    case "Rot90":
      return 90;
    case "Rot180":
      return 180;
    case "Rot270":
      return 270;
  }
}

function flipToTransform(flip: PreviewFlip): string {
  switch (flip) {
    case "None":
      return "";
    case "Horizontal":
      return "scaleX(-1)";
    case "Vertical":
      return "scaleY(-1)";
  }
}

function makeTileStyle(
  textureDef: PreviewTextureDef,
  frame: PreviewFrame,
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
    width: px(tileSize),
    height: px(tileSize),
  };
}

export function makePreviewStyle(
  textureDef: PreviewTextureDef,
  frame: PreviewFrame,
  rotation: PreviewRotation,
  flip: PreviewFlip,
  tint?: string | null
) {
  const tileStyle = makeTileStyle(textureDef, frame, 128);
  const tintStyle = tint
    ? {
        backgroundColor: tint,
        backgroundBlendMode: "multiply" as const,
      }
    : undefined;
  const transform =
    `rotate(${deg(rotationToDegrees(rotation))}) ${flipToTransform(flip)}`.trim();

  return {
    ...tileStyle,
    ...tintStyle,
    transform,
  };
}
