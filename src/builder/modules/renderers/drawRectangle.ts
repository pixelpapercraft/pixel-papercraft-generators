import { type CanvasWithContext } from "../canvasWithContext";
import { type LineProps, drawLine } from "./drawLine";
import { type Rectangle } from "./types";

export type DrawRectangeOptions = LineProps;

export function drawRectangle(
  page: CanvasWithContext,
  rectangle: Rectangle,
  ptops: LineProps
) {
  const [x, y, width, height] = rectangle;
  const x2 = x + width - 1;
  const y2 = y + height - 1;

  drawLine(page, [x, y], [x2, y], ptops);
  drawLine(page, [x2, y], [x2, y2], ptops);
  drawLine(page, [x2, y2], [x, y2], ptops);
  drawLine(page, [x, y2], [x, y], ptops);
}
