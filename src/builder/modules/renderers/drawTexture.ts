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
type BlendMultiplyColor = { kind: "MultiplyColor"; color: Color };
type BlendMultiplyHex = { kind: "MultiplyHex"; hex: string };

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
  | BlendMultiplyColor
  | BlendMultiplyHex
  | BlendReplaceColor
  | BlendReplaceHex;

export type Glint = {
  texture: string | Texture;
  opacity?: number;
  angle?: number;
  xOffset?: number;
  yOffset?: number;
}


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

function shift(value: number, shift: number): number {
  return (value >> shift) & 255;
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
    (c) => c.r === color.r && c.g === color.g && c.b === color.b && c.a === color.a
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
  glint?: Glint;
};

function drawNearestNeighbor(
  page: CanvasWithContext,
  texture: Texture,
  coordinates: Coordinates,
  options: DrawNearestNeighborOptions
): void {
  const rotateOption = options.rotate ?? { kind: "None" };
  const flipOption = options.flip ?? "None";
  const blendOption = options.blend ?? { kind: "None" };
  const pixelateOption = options.pixelate ?? false;
  const glintOption = options.glint ?? undefined;

  const { canvasWithContext, sx, sy, sw, sh, dx, dy, dw, dh } =
    makeInitialValues(texture, coordinates, pixelateOption);

  if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
    const imageData = canvasWithContext.context.getImageData(sx, sy, sw, sh);
    const pix = imageData.data;
    const temp = makeCanvasWithContext(dw, dh);

    const deltax = dw / sw;
    const deltay = dh / sh;

    const pixw = Math.ceil(deltax);
    const pixh = Math.ceil(deltay);

    const blendColor: Color | null =
      blendOption.kind === "MultiplyHex"
        ? hexToColor(blendOption.hex)
        : blendOption.kind === "MultiplyColor"
        ? blendOption.color
        : null;

    const replace: [Color[], Color[]] | null =
      blendOption.kind === "ReplaceHex"
        ? [
            blendOption.hex1.map((hex: string) => hexToColor(hex) ?? { r: 0, g: 0, b: 0, a: 255 }),
            blendOption.hex2.map((hex: string) => hexToColor(hex) ?? { r: 0, g: 0, b: 0, a: 255 }),
          ]
        : blendOption.kind === "ReplaceColor"
        ? [blendOption.color1, blendOption.color2]
        : null;

    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const tx = x * deltax;
        const ty = y * deltay;

        const i = (y * sw + x) * 4;
        const source: Color = {
          r: pix[i + 0] ?? 0,
          g: pix[i + 1] ?? 0,
          b: pix[i + 2] ?? 0,
          a: pix[i + 3] ?? 255,
        };

        let out = blendColor ? multiplyColors(source, blendColor) : source;

        const replaced = replace
          ? replaceColorsFromPalette(out, replace[0], replace[1])
          : undefined;

        if (replaced) out = replaced;

        temp.context.fillStyle = `rgba(${out.r}, ${out.g}, ${out.b}, ${out.a / 255})`;
        temp.context.fillRect(Math.floor(tx), Math.floor(ty), pixw, pixh);
      }
    }

    const ctx = page.context;
    ctx.save();
    ctx.translate(dx, dy);

    if (rotateOption.kind === "Corner") {
      ctx.rotate((rotateOption.degrees * Math.PI) / 180);
    } else if (rotateOption.kind === "Center") {
      ctx.translate(dw / 2, dh / 2);
      ctx.rotate((rotateOption.degrees * Math.PI) / 180);
      ctx.translate(-dw / 2, -dh / 2);
    }

    if (flipOption === "Horizontal") {
      ctx.translate(dw, 0);
      ctx.scale(-1, 1);
    } else if (flipOption === "Vertical") {
      ctx.translate(0, dh);
      ctx.scale(1, -1);
    }

    if (glintOption && typeof glintOption.texture !== "string") {
      drawImageWithGlint(ctx, temp, [sx, sy, sw, sh, dw, dh], glintOption)
    } else {
      ctx.drawImage(temp.canvas, 0, 0); // draw base texture
    }
    
    ctx.restore();
  }
}

export type DrawTextureOptions = {
  flip?: Flip;
  blend?: Blend;
  pixelate?: boolean;
  rotate?: number;
  rotateLegacy?: number;
  glint?: Glint;
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

  const drawOpts: DrawNearestNeighborOptions = {
    rotate,
    flip: options.flip,
    blend: options.blend,
    pixelate: options.pixelate,
    glint: options.glint,
  };

  if (sh > 0 && dh > 0 && sw > 0 && dw > 0) {
    const scaleX = texture.imageWithCanvas.width / texture.standardWidth;
    const scaleY = texture.imageWithCanvas.height / texture.standardHeight;

    drawNearestNeighbor(
      page,
      texture,
      {
        sx: Math.floor(sx * scaleX),
        sy: Math.floor(sy * scaleY),
        sw: Math.floor(sw * scaleX),
        sh: Math.floor(sh * scaleY),
        dx,
        dy,
        dw,
        dh,
      },
      drawOpts
    );
  }
}
function drawImageWithGlint(
  ctx: CanvasRenderingContext2D,
  temp: CanvasWithContext,
  [sx, sy, sw, sh, dw, dh]: [number, number, number, number, number, number],
  glint: Glint
): void {
  // Ensure glint.texture is a Texture
  if (typeof glint.texture === "string") return;

  const glintTex: Texture = glint.texture;
  const opacity = glint.opacity ?? 1;
  //const angle = (glint.angle ?? 0) * (Math.PI / 180); // convert to radians
  const xOffset = glint.xOffset ?? 0;
  const yOffset = glint.yOffset ?? 0;

  // Create base-only canvas for masking
  const baseOnly = makeCanvasWithContext(dw, dh);
  baseOnly.context.drawImage(temp.canvas, 0, 0);

  // Create glint layer
  const glintLayer = makeCanvasWithContext(dw, dh);

  // Step 1: Draw base to glint layer
  glintLayer.context.drawImage(temp.canvas, 0, 0);

  // Step 2: Add the glint with transformations
  glintLayer.context.save();
  glintLayer.context.globalAlpha = opacity;
  glintLayer.context.globalCompositeOperation = "lighter";

  // Move to center, rotate if needed
  //glintLayer.context.translate(dw / 2, dh / 2);
  //glintLayer.context.rotate(angle);
  //glintLayer.context.translate(-dw / 2, -dh / 2);

  // Apply wrapped offsets to the glint texture
  const sourceX = (sx + xOffset) % glintTex.standardWidth;
  const sourceY = (sy + yOffset) % glintTex.standardHeight;

  // Wrap around if offsets push outside bounds
  const wrappedX = (sourceX + glintTex.standardWidth) % glintTex.standardWidth;
  const wrappedY = (sourceY + glintTex.standardHeight) % glintTex.standardHeight;

  glintLayer.context.drawImage(
    glintTex.imageWithCanvas.canvasWithContext.canvas,
    wrappedX, wrappedY, sw, sh,
    0, 0, dw, dh
  );

  glintLayer.context.restore();

  // Step 3: Mask to original alpha
  glintLayer.context.globalCompositeOperation = "destination-in";
  glintLayer.context.drawImage(baseOnly.canvas, 0, 0);

  // Step 4: Draw to final canvas
  ctx.drawImage(glintLayer.canvas, 0, 0);
}


