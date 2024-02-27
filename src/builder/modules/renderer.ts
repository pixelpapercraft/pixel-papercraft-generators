import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";
import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";

export function fillBackgroundColor(page: CanvasWithContext, color: string) {
  const { width, height } = page.canvas;
  const temp = makeCanvasWithContext(width, height);
  temp.context.fillStyle = color;
  temp.context.fillRect(0, 0, width, height);
  temp.context.drawImage(page.canvas, 0, 0);
  page.context.drawImage(temp.canvas, 0, 0);
}

export function fillRect(
  page: CanvasWithContext,
  [x, y, w, h]: [number, number, number, number],
  color: string
) {
  const context = page.context;
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

function getOffset([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  const w = x2 - x1;
  const h = y2 - y1;

  // When a line is drawn and its start and end coords are integer values, the
  // resulting line is drawn in between to rows of pixels, resulting in a line
  // that is two pixels wide and half transparent. To fix this, the line's start
  // and end positions need to be offset 0.5 pixels in the direction normal to the
  // line. The following code gets the angle of the line, and gets the components
  // for a translation in the direction perpendicular to the angle using vector
  // resolution: https://physics.info/vector-components/summary.shtml This results
  // in a fully opaque line with the correct width if the line is vertical or
  // horizontal, but antialiasing may still affect lines at other angles.

  const angle = Math.atan2(h, w);
  const ox = Math.sin(angle) * 0.5;
  const oy = Math.cos(angle) * 0.5;
  return [ox, oy];
}

export function drawLine(
  page: CanvasWithContext,
  [x1, y1]: [number, number],
  [x2, y2]: [number, number],
  {
    color,
    width,
    pattern,
    offset,
  }: {
    color: string;
    width: number;
    pattern: number[];
    offset: number;
  }
) {
  const [ox, oy] = getOffset([x1, y1], [x2, y2]);
  const context = page.context;
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.setLineDash(pattern);
  context.lineDashOffset = offset;
  context.moveTo(x1 + ox, y1 + oy);
  context.lineTo(x2 + ox, y2 + oy);
  context.stroke();
}

export function drawImage(
  page: CanvasWithContext,
  imageWithCanvas: ImageWithCanvas,
  [x, y]: [number, number]
): void {
  page.context.drawImage(imageWithCanvas.image, x, y);
}

export function drawText(
  page: CanvasWithContext,
  text: string,
  position: [number, number],
  size: number
) {
  const [x, y] = position;
  const font = `${size}px sans-serif`;
  page.context.font = font;
  page.context.fillText(text, x, y);
}

function fit(sw: number, sh: number, dw: number, dh: number): [number, number] {
  const wScale = sw / dw;
  const hScale = sh / dh;
  const scale = Math.min(wScale, hScale);
  const [w, h] = scale < 1 ? [dw * scale, dh * scale] : [dw, dh];
  return [Math.ceil(w), Math.ceil(h)];
}

function preparePixelationCanvas(
  sourceCanvas: HTMLCanvasElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): HTMLCanvasElement {
  const [sw2, sh2] = fit(sw, sh, dw, dh);
  const { canvas, context } = makeCanvasWithContext(sw2, sh2);
  context.imageSmoothingEnabled = false;
  context.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw2, sh2);
  return canvas;
}

export type Flip =
  | { kind: "None" }
  | { kind: "Horizontal" }
  | { kind: "Vertical" };

export type Rotate =
  | { kind: "None" }
  | { kind: "Corner"; degrees: number }
  | { kind: "Center"; degrees: number };

export type Blend =
  | { kind: "None" }
  | { kind: "MultiplyHex"; hex: string }
  | { kind: "MultiplyRGB"; r: number; g: number; b: number };

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

function makeInitialValues(
  texture: Texture,
  coordinates: Coordinates,
  pixelate: boolean
) {
  if (pixelate) {
    const canvas = preparePixelationCanvas(
      texture.imageWithCanvas.canvasWithContext.canvas,
      coordinates.sx,
      coordinates.sy,
      coordinates.sw,
      coordinates.sh,
      coordinates.dw,
      coordinates.dh
    );
    const sx = 0;
    const sy = 0;
    const sw = canvas.width;
    const sh = canvas.height;
    const { dx, dy, dw, dh } = coordinates;
    return { canvas, sx, sy, sw, sh, dx, dy, dw, dh };
  }

  const canvas = texture.imageWithCanvas.canvasWithContext.canvas;
  const { sx, sy, sw, sh, dx, dy, dw, dh } = coordinates;
  return { canvas, sx, sy, sw, sh, dx, dy, dw, dh };
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

  const { canvas, sx, sy, sw, sh, dx, dy, dw, dh } = makeInitialValues(
    texture,
    coordinates,
    pixelateOption
  );

  if (sw > 0 && sh > 0 && dw > 0 && dh > 0) {
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!context) {
      throw new Error("Failed to get 2d context from canvas");
    }

    const imageData = context.getImageData(sx, sy, sw, sh);

    if (!imageData) {
      throw new Error("Failed to get image data");
    }
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
  [sx, sy, sw, sh]: [number, number, number, number],
  [dx, dy, dw, dh]: [number, number, number, number],
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
