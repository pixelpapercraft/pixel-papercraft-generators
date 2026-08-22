import { type CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";

export type LineProps = {
  color?: string;
  width?: number;
  lineDash?: number[];
  lineDashOffset?: number;
};

// Whether `from` sorts after `to` by a fixed coordinate order (x, then y).
// Used by `drawLine` to measure dash position from the line's own
// geometrically lesser endpoint rather than raw array order, so the dash
// pattern looks identical regardless of which point the caller labelled
// `from` — see the comment where this is used, in `drawLine`.
function isReversedOrder(
  [fromX, fromY]: Position,
  [toX, toY]: Position
): boolean {
  const rFromX = Math.round(fromX);
  const rFromY = Math.round(fromY);
  const rToX = Math.round(toX);
  const rToY = Math.round(toY);

  return rFromX > rToX || (rFromX === rToX && rFromY > rToY);
}

// The ordered integer pixel coordinates a line from `from` to `to` visits.
// Each endpoint is snapped to its nearest pixel first, then walked with
// Bresenham's integer error-accumulator algorithm (the generalised,
// any-octant form: `sx`/`sy` carry the step direction on each axis, so the
// same loop covers all 8 octants without a special case per direction).
// Plotting only ever lands on whole pixels — unlike stroking a path, which
// antialiases any line that isn't perfectly horizontal or vertical — so
// every pixel this returns can be painted fully opaque with no blending.
//
// Both endpoints are always included: a caller specifies two literal
// pixels, and both must be drawn, with the line filling in between. This
// also means two independently-drawn lines that share a corner (e.g. two
// edges of a `drawTab` outline meeting at a vertex) both paint that shared
// pixel rather than each risking dropping it — harmless double-painting
// instead of a gap.
export function getLinePixels(from: Position, to: Position): Position[] {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
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

// The rect `fillRect` should paint for one plotted line pixel at the given
// stroke width: a single exact pixel at width 1 (the common case), otherwise
// a rect centred on the point as closely as an integer size allows — an even
// size can't centre perfectly, so it's biased one pixel toward the top-left.
//
// For a horizontal or vertical line, the thickness is applied only
// perpendicular to the line — the pixel's own extent along the line's
// direction stays exactly one pixel wide, matching a canvas "butt" line cap
// (no extension past the line's own endpoints). Stamping an isotropic square
// at every point instead (as a naive thickness implementation would) also
// extends the two endpoint pixels *along* the line by the same amount,
// silently lengthening it — a diagonal line falls back to that isotropic
// square, since there is no true perpendicular offset to compute without
// knowing the line's exact angle, and no width>1 diagonal caller exists
// today to derive one against.
export function getPixelRect(
  x: number,
  y: number,
  width: number,
  orientation: "horizontal" | "vertical" | "diagonal"
): { x: number; y: number; width: number; height: number } {
  const size = Math.max(1, Math.round(width));
  const offset = Math.floor(size / 2);

  if (orientation === "horizontal") {
    return { x, y: y - offset, width: 1, height: size };
  }
  if (orientation === "vertical") {
    return { x: x - offset, y, width: size, height: 1 };
  }
  return { x: x - offset, y: y - offset, width: size, height: size };
}

function getLineOrientation(
  [fromX, fromY]: Position,
  [toX, toY]: Position
): "horizontal" | "vertical" | "diagonal" {
  const rFromX = Math.round(fromX);
  const rFromY = Math.round(fromY);
  const rToX = Math.round(toX);
  const rToY = Math.round(toY);

  // A degenerate zero-length "line" (both endpoints round to the same
  // pixel) has no real direction to speak of -- treat it as a dot, which an
  // isotropic square represents better than an arbitrarily-chosen axis.
  if (rFromX === rToX && rFromY === rToY) {
    return "diagonal";
  }
  if (rFromY === rToY) {
    return "horizontal";
  }
  if (rFromX === rToX) {
    return "vertical";
  }
  return "diagonal";
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

  const orientation = getLineOrientation(from, to);
  const context = page.context;
  context.save();
  context.fillStyle = color;

  // Dash position is measured by distance from the line's own geometrically
  // lesser endpoint, not by raw array position: a reversed call walks the
  // identical points in the opposite order, so indexing straight from array
  // position would make a reversed call's dash pattern land one step off
  // from a forward call drawing the same physical line. Mirroring the index
  // here keeps the dash pattern itself symmetric, the same way the plotted
  // point set already is.
  const points = getLinePixels(from, to);
  const reversed = isReversedOrder(from, to);

  points.forEach(([x, y], index) => {
    const dashIndex = reversed ? points.length - 1 - index : index;
    if (!shouldDrawDashPixel(dashIndex, lineDash, lineDashOffset)) {
      return;
    }
    const rect = getPixelRect(x, y, width, orientation);
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
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
