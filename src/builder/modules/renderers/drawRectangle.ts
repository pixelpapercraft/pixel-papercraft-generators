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
  drawLine(page, [x, y], [x + width, y], ptops);
  drawLine(page, [x + width, y], [x + width, y + height], ptops);
  drawLine(page, [x + width, y + height], [x, y + height], ptops);
  drawLine(page, [x, y + height], [x, y], ptops);
}
