import { type CanvasWithContext } from "../canvasWithContext";
import { type ImageWithCanvas } from "../imageWithCanvas";

import type { Position } from "./types";

export function drawImage(
  page: CanvasWithContext,
  imageWithCanvas: ImageWithCanvas,
  [x, y]: Position
): void {
  page.context.drawImage(imageWithCanvas.image, x, y);
}
