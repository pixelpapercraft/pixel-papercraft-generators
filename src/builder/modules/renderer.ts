import {
  type CanvasWithContext,
  makeCanvasWithContext,
} from "./canvasWithContext";
import { ImageWithCanvas } from "./imageWithCanvas";

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
