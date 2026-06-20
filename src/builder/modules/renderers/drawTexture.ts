import {
  type CanvasWithContext,
  type Color,
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

type BlendMultiplyHex = { kind: "MultiplyHex"; hex: string };

type BlendMultiplyColor = { kind: "MultiplyColor"; color: Color };

type BlendReplaceColor = {
  kind: "ReplaceColor";
  color1: Color[];
  color2: Color[];
};

type BlendReplaceHex = {
  kind: "ReplaceHex";
  hex1: string[];
  hex2: string[];
};

export type Blend =
  | BlendNone
  | BlendMultiplyHex
  | BlendMultiplyColor
  | BlendReplaceColor
  | BlendReplaceHex;

export type Coordinates = {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
};

export type TexturePlugin = (
  coordinates: Coordinates,
  canvasWithContext: CanvasWithContext
) => HTMLCanvasElement;

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

export function hexToColor(hex: string): Color | null {
  const clean = hex.startsWith("#") ? hex.slice(1) : hex;
  if (!(clean.length === 6 || clean.length === 8)) return null;
  const value = parseInt(clean, 16);
  if (isNaN(value)) return null;

  const r = shift(value, clean.length === 6 ? 16 : 24);
  const g = shift(value, clean.length === 6 ? 8 : 16);
  const b = shift(value, clean.length === 6 ? 0 : 8);
  const a = clean.length === 8 ? shift(value, 0) : 255;

  return { r, g, b, a };
}

function multiplyColors(base: Color, blend: Color): Color {
  return {
    r: Math.floor((base.r * blend.r) / 255),
    g: Math.floor((base.g * blend.g) / 255),
    b: Math.floor((base.b * blend.b) / 255),
    a: Math.floor((base.a * blend.a) / 255),
  };
}

function replaceColorsFromPalette(
  color: Color,
  palette: Color[],
  replacements: Color[]
): Color | undefined {
  const index = palette.findIndex(
    (c) =>
      c.r === color.r && c.g === color.g && c.b === color.b && c.a === color.a
  );
  return index !== -1 ? replacements[index] : undefined;
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
  plugin?: TexturePlugin;
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
  const pluginOption = options.plugin;

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

    const blendColor: Color | null =
      blendOption.kind === "MultiplyHex"
        ? hexToColor(blendOption.hex)
        : blendOption.kind === "MultiplyColor"
          ? blendOption.color
          : null;

    const replaceColors: [Color[], Color[]] | null =
      blendOption.kind === "ReplaceHex"
        ? [
            blendOption.hex1.map(
              (hex: string) => hexToColor(hex) ?? { r: 0, g: 0, b: 0, a: 255 }
            ),
            blendOption.hex2.map(
              (hex: string) => hexToColor(hex) ?? { r: 0, g: 0, b: 0, a: 255 }
            ),
          ]
        : blendOption.kind === "ReplaceColor"
          ? [blendOption.color1, blendOption.color2]
          : null;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const tx = x * deltax;
        const ty = y * deltay;

        // Source pixel
        const i = (y * sw + x) * 4;

        const source: Color = {
          r: pix[i + 0] ?? 0,
          g: pix[i + 1] ?? 0,
          b: pix[i + 2] ?? 0,
          a: pix[i + 3] ?? 255,
        };

        let out = blendColor ? multiplyColors(source, blendColor) : source;

        const replaced = replaceColors
          ? replaceColorsFromPalette(out, replaceColors[0], replaceColors[1])
          : undefined;

        if (replaced) {
          out = replaced;
        }

        temp.context.fillStyle = `rgba(${out.r}, ${out.g}, ${out.b}, ${out.a / 255})`;
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

    if (pluginOption) {
      const pluginCanvas = pluginOption(coordinates, temp);
      pageContext.drawImage(pluginCanvas, 0, 0);
    } else {
      pageContext.drawImage(temp.canvas, 0, 0);
    }

    pageContext.restore();
  }
}

export type DrawTextureOptions = {
  flip?: Flip;
  blend?: Blend;
  pixelate?: boolean;
  rotate?: number;
  plugin?: TexturePlugin;

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
    plugin: options.plugin,
  };

  if (sh > 0 && dh > 0 && sw > 0 && dw > 0) {
    const sourceScaleX = texture.imageWithCanvas.width / texture.standardWidth;
    const sourceScaleY =
      texture.imageWithCanvas.height / texture.standardHeight;

    const sxScaled = Math.floor(sx * sourceScaleX);
    const syScaled = Math.floor(sy * sourceScaleY);
    const swScaled = Math.max(
      1,
      Math.ceil((sx + sw) * sourceScaleX) - sxScaled
    );
    const shScaled = Math.max(
      1,
      Math.ceil((sy + sh) * sourceScaleY) - syScaled
    );

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
