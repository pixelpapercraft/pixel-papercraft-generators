import { type CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";

export function drawText(
  page: CanvasWithContext,
  text: string,
  position: Position,
  size: number
) {
  const [x, y] = position;
  const font = `${size}px sans-serif`;
  page.context.font = font;
  page.context.fillText(text, x, y);
}
