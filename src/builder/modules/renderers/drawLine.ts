import { type CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";

function getOffset([x1, y1]: Position, [x2, y2]: Position) {
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

export type LineProps = {
  color: string;
  width: number;
  pattern: number[];
  offset: number;
};

export function drawLine(
  page: CanvasWithContext,
  [x1, y1]: Position,
  [x2, y2]: Position,
  { color, width, pattern, offset }: LineProps
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
