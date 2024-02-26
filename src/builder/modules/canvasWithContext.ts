import { makeCanvas } from "./canvasFactory";

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
  const context = canvas.getContext("2d")!;
  const contextWithAlpha = canvas.getContext("2d", { alpha: true })!;
  return { width, height, canvas, context, contextWithAlpha };
}
