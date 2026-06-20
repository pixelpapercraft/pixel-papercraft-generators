import { type CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";

export type LineProps = {
  color?: string;
  width?: number;
  lineDash?: number[];
  lineDashOffset?: number;
};

function shouldDrawDashPixel(
  pixelIndex: number,
  lineDash: number[],
  lineDashOffset: number
): boolean {
  if (lineDash.length === 0) {
    return true;
  }

  const patternLength = lineDash.reduce((total, value) => total + value, 0);
  if (patternLength <= 0) {
    return true;
  }

  let patternPosition = (pixelIndex + lineDashOffset) % patternLength;
  if (patternPosition < 0) {
    patternPosition += patternLength;
  }

  for (let i = 0; i < lineDash.length; i += 1) {
    const dashLength = lineDash[i] ?? 0;
    if (patternPosition < dashLength) {
      return i % 2 === 0;
    }
    patternPosition -= dashLength;
  }

  return true;
}

function drawPixel(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number
) {
  const pixelWidth = Math.max(1, Math.round(width));
  const offset = Math.floor(pixelWidth / 2);
  context.fillRect(x - offset, y - offset, pixelWidth, pixelWidth);
}

export function drawLine(
  page: CanvasWithContext,
  [x1, y1]: Position,
  [x2, y2]: Position,
  lineProps?: LineProps
) {
  const color = lineProps?.color ?? "#000000";
  const width = lineProps?.width ?? 1;
  const lineDash = lineProps?.lineDash ?? [];
  const lineDashOffset = lineProps?.lineDashOffset ?? 0;

  let x0 = Math.round(x1);
  let y0 = Math.round(y1);
  const xEnd = Math.round(x2);
  const yEnd = Math.round(y2);
  const dx = Math.abs(xEnd - x0);
  const dy = Math.abs(yEnd - y0);
  const sx = x0 < xEnd ? 1 : -1;
  const sy = y0 < yEnd ? 1 : -1;
  let error = dx - dy;
  let pixelIndex = 0;

  const context = page.context;
  context.save();
  context.fillStyle = color;

  if (shouldDrawDashPixel(pixelIndex, lineDash, lineDashOffset)) {
    drawPixel(context, x0, y0, width);
  }

  while (x0 !== xEnd || y0 !== yEnd) {
    const error2 = error * 2;
    if (error2 > -dy) {
      error -= dy;
      x0 += sx;
    }
    if (error2 < dx) {
      error += dx;
      y0 += sy;
    }

    pixelIndex += 1;
    if (shouldDrawDashPixel(pixelIndex, lineDash, lineDashOffset)) {
      drawPixel(context, x0, y0, width);
    }
  }

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
