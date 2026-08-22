import { type CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";

export type LineProps = {
  color?: string;
  width?: number;
  lineDash?: number[];
  lineDashOffset?: number;
};

// The ordered integer pixel coordinates a line from `from` to `to` visits.
// Each endpoint is snapped to its nearest pixel first, then walked with
// Bresenham's integer error-accumulator algorithm (the generalised,
// any-octant form: `sx`/`sy` carry the step direction on each axis, so the
// same loop covers all 8 octants without a special case per direction).
// Plotting only ever lands on whole pixels — unlike stroking a path, which
// antialiases any line that isn't perfectly horizontal or vertical — so
// every pixel this returns can be painted fully opaque with no blending.
export function getLinePixels(
  [fromX, fromY]: Position,
  [toX, toY]: Position
): Position[] {
  let x = Math.round(fromX);
  let y = Math.round(fromY);
  const endX = Math.round(toX);
  const endY = Math.round(toY);

  const dx = Math.abs(endX - x);
  const dy = Math.abs(endY - y);
  const stepX = x < endX ? 1 : -1;
  const stepY = y < endY ? 1 : -1;
  let error = dx - dy;

  const points: Position[] = [[x, y]];

  while (x !== endX || y !== endY) {
    const error2 = error * 2;
    if (error2 > -dy) {
      error -= dy;
      x += stepX;
    }
    if (error2 < dx) {
      error += dx;
      y += stepY;
    }
    points.push([x, y]);
  }

  return points;
}

// Whether the pixel at `pixelIndex` steps along a plotted line falls in an
// "on" run of a canvas-style dash pattern (`[onLength, offLength, ...]`,
// repeating), offset by `lineDashOffset` steps. An empty pattern means a
// solid line, so every index is "on".
export function shouldDrawDashPixel(
  pixelIndex: number,
  lineDash: number[],
  lineDashOffset: number
): boolean {
  const patternLength = lineDash.reduce((total, length) => total + length, 0);
  if (patternLength <= 0) {
    return true;
  }

  let position = (pixelIndex + lineDashOffset) % patternLength;
  if (position < 0) {
    position += patternLength;
  }

  for (let i = 0; i < lineDash.length; i += 1) {
    const runLength = lineDash[i] ?? 0;
    if (position < runLength) {
      return i % 2 === 0;
    }
    position -= runLength;
  }

  return true;
}

// The square `fillRect` should paint for one plotted line pixel at the given
// stroke width: a single exact pixel at width 1 (the common case), otherwise
// a `size x size` square centred on the point as closely as an integer size
// allows — an even size can't centre perfectly, so it's biased one pixel
// toward the top-left.
export function getPixelSquare(
  x: number,
  y: number,
  width: number
): { x: number; y: number; size: number } {
  const size = Math.max(1, Math.round(width));
  const offset = Math.floor(size / 2);
  return { x: x - offset, y: y - offset, size };
}

function getDashOffset(
  [fromX, fromY]: Position,
  [toX, toY]: Position,
  lineDashOffset: number
): number {
  // Canvas strokes place a reversed horizontal or vertical dash's first
  // raster pixel one step earlier in the pattern than a forward stroke. Keep
  // that established phase when plotting the same line as discrete pixels.
  const isReversedAxisAlignedLine =
    (fromX === toX && toY < fromY) || (fromY === toY && toX < fromX);

  return isReversedAxisAlignedLine ? lineDashOffset - 1 : lineDashOffset;
}

export function drawLine(
  page: CanvasWithContext,
  from: Position,
  to: Position,
  lineProps?: LineProps
) {
  const color = lineProps?.color ?? "#000000";
  const width = lineProps?.width ?? 1;
  const lineDash = lineProps?.lineDash ?? [];
  const lineDashOffset = lineProps?.lineDashOffset ?? 0;
  const dashOffset = getDashOffset(from, to, lineDashOffset);

  const context = page.context;
  context.save();
  context.fillStyle = color;

  getLinePixels(from, to).forEach(([x, y], index) => {
    if (!shouldDrawDashPixel(index, lineDash, dashOffset)) {
      return;
    }
    const square = getPixelSquare(x, y, width);
    context.fillRect(square.x, square.y, square.size, square.size);
  });

  context.restore();
}

export function drawFoldLine(
  page: CanvasWithContext,
  from: Position,
  to: Position
) {
  return drawLine(page, from, to, {
    color: "#7b7b7b",
    width: 1,
    lineDash: [2, 2],
    lineDashOffset: 3,
  });
}
