import { makeCanvas } from "./canvas";

export type CanvasWithContext = {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  contextWithAlpha: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export function makeCanvasWithContext(
  width: number,
  height: number
): CanvasWithContext {
  const canvas = makeCanvas(width, height);
  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (!context) {
    throw new Error("Failed to get 2d context");
  }
  const contextWithAlpha = canvas.getContext("2d", {
    alpha: true,
    willReadFrequently: true,
  });
  if (!contextWithAlpha) {
    throw new Error("Failed to get 2d context with alpha");
  }
  return { width, height, canvas, context, contextWithAlpha };
}

export type Color = {
  r: number;
  b: number;
  g: number;
  a: number;
};

export function getCanvasWithContextPixelColor(
  canvasWithContext: CanvasWithContext,
  x: number,
  y: number
): Color | null {
  const { width, height, contextWithAlpha } = canvasWithContext;
  const data = contextWithAlpha.getImageData(0, 0, width, height).data;
  const pixelIndex = y * width + x;
  const arrayIndex = pixelIndex * 4;
  const r = data[arrayIndex];
  const g = data[arrayIndex + 1];
  const b = data[arrayIndex + 2];
  const a = data[arrayIndex + 3];
  if (
    r !== undefined &&
    g !== undefined &&
    b !== undefined &&
    a !== undefined
  ) {
    const color: Color = { r, g, b, a };
    return color;
  }
  return null;
}
