import { type CanvasWithContext } from "../canvasWithContext";
import type { Rectangle } from "./types";

export function fillRect(
  page: CanvasWithContext,
  [x, y, w, h]: Rectangle,
  color: string
) {
  const context = page.context;
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}
