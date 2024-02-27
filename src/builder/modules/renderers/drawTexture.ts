import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "../canvasWithContext";
import type { Texture } from "../texture";
import type { Dimensions, Region } from "./types";

type FlipNone = { kind: "None" };

type FlipHorizontal = { kind: "Horizontal" };

type FlipVertical = { kind: "Vertical" };

export type Flip = FlipNone | FlipHorizontal | FlipVertical;

type RotateNone = { kind: "None" };

type RotateCorner = { kind: "Corner"; degrees: number };

type RotateCenter = { kind: "Center"; degrees: number };

export type Rotate = RotateNone | RotateCorner | RotateCenter;

type BlendNone = { kind: "None" };

type BlendMultiplyHex = { kind: "MultiplyHex"; hex: string };

type BlendMultiplyRGB = {
  kind: "MultiplyRGB";
  r: number;
  g: number;
  b: number;
};

export type Blend = BlendNone | BlendMultiplyHex | BlendMultiplyRGB;

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

function hexToRGB(hex: string): [number, number, number] | null {
  const value = parseHex(hex);
  if (value === null) {
    return null;
  }
  const r = shift(value, 16);
  const g = shift(value, 8);
  const b = shift(value, 0);
  return [r, g, b];
}

function blendColors(
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

export function flipNone(): FlipNone {
  return { kind: "None" };
}

export function flipHorizontal(): FlipHorizontal {
  return { kind: "Horizontal" };
}

export function flipVertical(): FlipVertical {
  return { kind: "Vertical" };
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

export function addRotation(rotate: Rotate, degrees: number): Rotate {
  if (rotate.kind === "None") {
    return { kind: "None" };
  }
  return { kind: rotate.kind, degrees: rotate.degrees + degrees };
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

    const blend =
      blendOption.kind === "MultiplyHex"
        ? hexToRGB(blendOption.hex)
        : blendOption.kind === "MultiplyRGB"
        ? [blendOption.r, blendOption.g, blendOption.b]
        : null;

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

        const [red, green, blue] = blend
          ? blendColors(r, g, b, blend[0], blend[1], blend[2])
          : [r, g, b];

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

    if (flipOption.kind === "Horizontal") {
      pageContext.translate(dw, 0);
      pageContext.scale(-1, 1);
    } else if (flipOption.kind === "Vertical") {
      pageContext.translate(0, dh);
      pageContext.scale(1, -1);
    }

    pageContext.drawImage(temp.canvas, 0, 0);

    pageContext.restore();
  }
}

export type DrawTextureOptions = DrawNearestNeighborOptions;

export function drawTexture(
  page: CanvasWithContext,
  texture: Texture,
  [sx, sy, sw, sh]: Region,
  [dx, dy, dw, dh]: Region,
  options: DrawTextureOptions
): void {
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
      options
    );
  }
}
