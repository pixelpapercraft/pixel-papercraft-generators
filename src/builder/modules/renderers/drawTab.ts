import type { Point, Rectangle } from "./types";
import { drawLine, drawFoldLine } from "./drawLine";
import { CanvasWithContext } from "../canvasWithContext";

export type TabOrientation = "North" | "South" | "East" | "West";

function translatePoint([x, y]: Point, dx: number, dy: number): Point {
  return [x + dx, y + dy];
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function drawTabNorth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number
) {
  //
  //    p2 ______ p3
  //      /|    |\
  //     / |    | \
  // p1 +--|----|--+ p4
  //

  const [x, y, w, h] = rectangle;

  const tabAngleRad = toRadians(tabAngle);

  const maxInset = w / 2;

  let inset = h / Math.tan(tabAngleRad);
  let tabHeight = 0;

  [inset, tabHeight] =
    inset > maxInset
      ? [maxInset, Math.tan(tabAngleRad) * maxInset]
      : [inset, h];

  let p1: Point = [0, h];
  let p2: Point = [0 + inset, h - tabHeight];
  let p3: Point = [w - inset, h - tabHeight];
  let p4: Point = [w, h];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);

  drawLine(page, p2, p1);
  drawLine(page, p2, p3);
  drawLine(page, p4, p3);

  if (showFoldLine) {
    drawFoldLine(page, p4, p1);
  }
}

function drawTabEast(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number
) {
  //
  //  p1
  //   +
  //   | ⟍
  //   |   ⟍  p2
  //   |     |
  //   |     |
  //   |    ⟋ p3
  //   |  ⟋
  //   +
  //  p4
  //

  const [x, y, w, h] = rectangle;

  const tabAngleRad = toRadians(tabAngle);

  const maxInset = h / 2;
  let inset = w / Math.tan(tabAngleRad);
  let tabHeight = 0;

  [inset, tabHeight] =
    inset > maxInset
      ? [maxInset, Math.tan(tabAngleRad) * maxInset]
      : [inset, w];

  let p1: Point = [0, 0];
  let p2: Point = [tabHeight, 0 + inset];
  let p3: Point = [tabHeight, h - inset];
  let p4: Point = [0, h];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);

  drawLine(page, p1, p2);
  drawLine(page, p3, p2);
  drawLine(page, p3, p4);

  if (showFoldLine) {
    drawFoldLine(page, p1, p4);
  }
}

function drawTabSouth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number
) {
  // p4 +----------+ p1
  //     \         /
  //      \      /
  //    p3 +----+ p2
  //

  const [x, y, w, h] = rectangle;

  const tabAngleRad = toRadians(tabAngle);

  const maxInset = w / 2;
  let inset = h / Math.tan(tabAngleRad);
  let tabHeight = 0;

  [inset, tabHeight] =
    inset > maxInset
      ? [maxInset, Math.tan(tabAngleRad) * maxInset]
      : [inset, h];

  let p1: Point = [w, 0];
  let p2: Point = [w - inset, tabHeight];
  let p3: Point = [inset, tabHeight];
  let p4: Point = [0, 0];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);

  drawLine(page, p2, p1);
  drawLine(page, p2, p3);
  drawLine(page, p4, p3);

  if (showFoldLine) {
    drawFoldLine(page, p4, p1);
  }
}

function drawTabWest(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number
) {
  //
  // p4
  //   +
  // / |
  // | |
  // | |
  // \ |
  //   +
  //  p1
  //

  const [x, y, w, h] = rectangle;

  const tabAngleRad = toRadians(tabAngle);

  const maxInset = h / 2;
  let inset = w / Math.tan(tabAngleRad);
  let tabHeight = 0;

  [inset, tabHeight] =
    inset > maxInset
      ? [maxInset, Math.tan(tabAngleRad) * maxInset]
      : [inset, w];

  let p1: Point = [w, h];
  let p2: Point = [w - tabHeight, h - inset];
  let p3: Point = [w - tabHeight, inset];
  let p4: Point = [w, 0];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);

  drawLine(page, p1, p2);
  drawLine(page, p3, p2);
  drawLine(page, p3, p4);

  if (showFoldLine) {
    drawFoldLine(page, p1, p4);
  }
}

// Normal
//
//        p3   p4
//    +---+-----+---+        ---
//    |  /       \  |         |
//    | /         \ |         | Actual tab height
//    |/           \|         |
//    +-------------+        ---
//    p1           p4
//
//
// Overflow
//
//     +---------+      ---
//     |         |       |
//     |         |       | Rectangle tab height
//     |         |       |
//     | p2 X p3 |       |    ---
//     |   / \   |       |     |
//     |  /   \  |       |     | Actual tab height
//     | /     \ |       |     |
//     |/       \|       |     |
//     +----+----+      ---   ---
//     p1        p4
//
export function drawTab(
  page: CanvasWithContext,
  rectangle: Rectangle,
  orientation: TabOrientation,
  showFoldLine: boolean = true,
  tabAngle: number = 45
) {
  switch (orientation) {
    case "North":
      drawTabNorth(page, rectangle, showFoldLine, tabAngle);
      break;
    case "East":
      drawTabEast(page, rectangle, showFoldLine, tabAngle);
      break;
    case "South":
      drawTabSouth(page, rectangle, showFoldLine, tabAngle);
      break;
    case "West":
      drawTabWest(page, rectangle, showFoldLine, tabAngle);
      break;
  }
}
