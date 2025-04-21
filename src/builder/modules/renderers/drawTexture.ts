import {
  type CanvasWithContext,
  Color,
  makeCanvasWithContext,
} from "../canvasWithContext";
import type { Texture } from "../texture";
import type { Dimensions, Region } from "./types";

export type Flip = "None" | "Horizontal" | "Vertical";

type RotateNone = { kind: "None" };

type RotateCorner = { kind: "Corner"; degrees: number };

type RotateCenter = { kind: "Center"; degrees: number };

export type Rotate = RotateNone | RotateCorner | RotateCenter;

type BlendNone = { kind: "None" };

type BlendMultiplyColor = {kind: "MultiplyColor"; color: Color};

type BlendMultiplyHex = { kind: "MultiplyHex"; hex: string };

type BlendMultiplyRGB = {
  kind: "MultiplyRGB";
  r: number;
  g: number;
  b: number;
};

type BlendReplaceColor = {
  kind: "ReplaceColor";
  color1: Color[];
  color2: Color[];
}

type BlendReplaceHex = { kind: "ReplaceHex"; hex1: string[], hex2: string[] };

type BlendReplaceRGB = {
  kind: "ReplaceRGB";
  rgb1: [r1: number, g1: number, b1: number][];
  rgb2: [r2: number, g2: number, b2: number][];
};

export type Blend = BlendNone | BlendMultiplyColor | BlendMultiplyHex | BlendMultiplyRGB | BlendReplaceColor | BlendReplaceHex | BlendReplaceRGB;

type Coordinates = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

function fit(sw: number, sh: number, dw: number, dh: number): Dimensions {
  const wScale = sw / dw;
  const hScale = sh / dh;
  const scale = Math.min(wScale, hScale);
  const [w, h] = scale < 1 ? [dw * scale, dh * scale] : [dw, dh];
  return [Math.ceil(w), Math.ceil(h)];
}

function preparePixelationCanvas(
  source: CanvasWithContext,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): CanvasWithContext {
  const [sw2, sh2] = fit(sw, sh, dw, dh);
  const canvasWithContext = makeCanvasWithContext(sw2, sh2);
  canvasWithContext.context.imageSmoothingEnabled = false;
  canvasWithContext.context.drawImage(
    source.canvas,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    sw2,
    sh2
  );
  return canvasWithContext;
}

function parseHex(value: string): number | null {
  const hex = value.startsWith("#") ? value.slice(1) : value;
  if (hex.length === 6) {
    const f = parseInt(hex, 16);
    if (isNaN(f)) {
      return null;
    }
    return Math.floor(f);
  }
  return null;
}

function shift(value: number, shift: number): number {
  return (value >> shift) & 255;
}

export function hexToRGB(hex: string): [number, number, number] | null {
  const value = parseHex(hex);
  if (value === null) {
    return null;
  }
  const r = shift(value, 16);
  const g = shift(value, 8);
  const b = shift(value, 0);
  return [r, g, b];
}

function multiplyColors(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): [number, number, number] {
  return [
    Math.floor((r1 * r2) / 255),
    Math.floor((g1 * g2) / 255),
    Math.floor((b1 * b2) / 255),
  ];
}

// replace works like this: if 1(texture) = 2(base palette), draw 3(color palette) else draw 1
function replaceColors(
  rgb1: [number, number, number],
  rgb2: [number, number, number],
  rgb3: [number, number, number]
): [number, number, number] {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  const [r3, g3, b3] = rgb3;

  return [
    r1 === r2 ? r3 : r1,
    g1 === g2 ? g3 : g1,
    b1 === b2 ? b3 : b1,
  ];
}

function replaceColorsFromPalette(
  rgb1: [number, number, number],
  palette: [number, number, number][],
  replacements: [number, number, number][]
): [number, number, number] | undefined {
  const index = palette.findIndex(color =>
    color[0] === rgb1[0] && color[1] === rgb1[1] && color[2] === rgb1[2]
  );

  return index !== -1 ? replacements[index] : rgb1;
}


function makeInitialValues(
  texture: Texture,
  coordinates: Coordinates,
  pixelate: boolean
) {
  if (pixelate) {
    const canvasWithContext = preparePixelationCanvas(
      texture.imageWithCanvas.canvasWithContext,
      coordinates.sx,
      coordinates.sy,
      coordinates.sw,
      coordinates.sh,
      coordinates.dw,
      coordinates.dh
    );
    const sx = 0;
    const sy = 0;
    const sw = canvasWithContext.canvas.width;
    const sh = canvasWithContext.canvas.height;
    const { dx, dy, dw, dh } = coordinates;
    return { canvasWithContext, sx, sy, sw, sh, dx, dy, dw, dh };
  }

  const canvasWithContext = texture.imageWithCanvas.canvasWithContext;
  const { sx, sy, sw, sh, dx, dy, dw, dh } = coordinates;
  return { canvasWithContext, sx, sy, sw, sh, dx, dy, dw, dh };
}

export function rotateNone(): RotateNone {
  return { kind: "None" };
}

export function rotateCorner(degrees: number): RotateCorner {
  return { kind: "Corner", degrees };
}

export function rotateCenter(degrees: number): RotateCenter {
  return { kind: "Center", degrees };
}

type DrawNearestNeighborOptions = {
  rotate?: Rotate;
  flip?: Flip;
  blend?: Blend;
  pixelate?: boolean;
};

function drawNearestNeighbor(
  page: CanvasWithContext,
  texture: Texture,
  coordinates: Coordinates,
  options: DrawNearestNeighborOptions
): void {
  const rotateOption = options.rotate ?? { kind: "None" };
  const flipOption = options.flip ?? { kind: "None" };
  const blendOption = options.blend ?? { kind: "None" };
  const pixelateOption = options.pixelate ?? false;

  const { canvasWithContext, sx, sy, sw, sh, dx, dy, dw, dh } =
    makeInitialValues(texture, coordinates, pixelateOption);

  if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
    const imageData = canvasWithContext.context.getImageData(sx, sy, sw, sh);

    const pix = imageData.data;

    const temp = makeCanvasWithContext(dw, dh);

    const deltax = dw / sw;
    const deltay = dh / sh;

    const pixwInitial = Math.floor(deltax);
    const pixhInitial = Math.floor(deltay);

    const pixw = pixwInitial < deltax ? pixwInitial + 1 : pixwInitial;
    const pixh = pixhInitial < deltay ? pixhInitial + 1 : pixhInitial;

    const blend: [number, number, number] | null =
      blendOption.kind === "MultiplyHex"
        ? hexToRGB(blendOption.hex)
        : blendOption.kind === "MultiplyRGB"
          ? [blendOption.r, blendOption.g, blendOption.b]
          : null;

    const replace: [[number, number, number][], [number, number, number][]] | null =
    blendOption.kind === "ReplaceHex"
      ? [blendOption.hex1.map((hex) => hexToRGB(hex) ?? [0, 0, 0]), blendOption.hex2.map((hex) => hexToRGB(hex) ?? [0, 0, 0])]
      : blendOption.kind === "ReplaceRGB"
        ? [blendOption.rgb1, blendOption.rgb2]
        : null;
        // Replace is in Color, then there is also RGB and Hex. how to get it all to work together?

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const tx = x * deltax;
        const ty = y * deltay;

        // Source pixel
        const i = (y * sw + x) * 4;

        const r = pix[i + 0] ?? 0;
        const g = pix[i + 1] ?? 0;
        const b = pix[i + 2] ?? 0;
        const a = (pix[i + 3] ?? 0) / 255;

        let [red, green, blue] = blend
          ? multiplyColors(r, g, b, blend[0], blend[1], blend[2])
          : [r, g, b];

          const replaced = replace
          ? replaceColorsFromPalette([red, green, blue], replace[0], replace[1])
          : undefined;
        
        if (replaced) {
          [red, green, blue] = replaced;
        }

        temp.context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${a})`;
        temp.context.fillRect(Math.floor(tx), Math.floor(ty), pixw, pixh);
      }
    }

    const pageContext = page.context;

    // Save the current state of the page
    pageContext.save();

    // Move to the destination coordinate
    pageContext.translate(dx, dy);

    if (rotateOption.kind === "Corner") {
      const radians = (rotateOption.degrees * Math.PI) / 180;
      pageContext.rotate(radians);
    } else if (rotateOption.kind === "Center") {
      const radians = (rotateOption.degrees * Math.PI) / 180;
      pageContext.translate(dw / 2, dh / 2);
      pageContext.rotate(radians);
      pageContext.translate(-dw / 2, -dh / 2);
    }

    if (flipOption === "Horizontal") {
      pageContext.translate(dw, 0);
      pageContext.scale(-1, 1);
    } else if (flipOption === "Vertical") {
      pageContext.translate(0, dh);
      pageContext.scale(1, -1);
    }

    pageContext.drawImage(temp.canvas, 0, 0);

    pageContext.restore();
  }
}

export type DrawTextureOptions = {
  flip?: Flip;
  blend?: Blend;
  pixelate?: boolean;
  rotate?: number;

  /** @deprecated Use `rotate` instead. */
  rotateLegacy?: number;
};

export function drawTexture(
  page: CanvasWithContext,
  texture: Texture,
  [sx, sy, sw, sh]: Region,
  [dx, dy, dw, dh]: Region,
  options: DrawTextureOptions
): void {
  const rotate: Rotate = options.rotateLegacy
    ? rotateCorner(options.rotateLegacy)
    : options.rotate
      ? rotateCenter(options.rotate)
      : rotateNone();

  const drawNearestNeightbourOptions: DrawNearestNeighborOptions = {
    rotate,
    flip: options.flip,
    blend: options.blend,
    pixelate: options.pixelate,
  };

  if (sh > 0 && dh > 0 && sw > 0 && dw > 0) {
    const sourceScaleX = texture.imageWithCanvas.width / texture.standardWidth;
    const sourceScaleY =
      texture.imageWithCanvas.height / texture.standardHeight;

    const sxScaled = Math.floor(sx * sourceScaleX);
    const syScaled = Math.floor(sy * sourceScaleY);
    const swScaled = Math.floor(sw * sourceScaleX);
    const shScaled = Math.floor(sh * sourceScaleY);

    drawNearestNeighbor(
      page,
      texture,
      {
        sx: sxScaled,
        sy: syScaled,
        sw: swScaled,
        sh: shScaled,
        dx,
        dy,
        dw,
        dh,
      },
      drawNearestNeightbourOptions
    );
  }
}
