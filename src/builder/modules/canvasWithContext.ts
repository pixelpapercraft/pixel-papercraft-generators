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
