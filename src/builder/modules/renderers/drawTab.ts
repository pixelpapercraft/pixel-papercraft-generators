import type { Point, Rectangle } from "./types";
import { drawFoldLine, drawLine } from "./drawLine";
import { CanvasWithContext } from "../canvasWithContext";

export type TabOrientation = "North" | "South" | "East" | "West";
export type TabType = "Regular" | "Left" | "Middle" | "Right";

function translatePoint([x, y]: Point, dx: number, dy: number): Point {
  return [x + dx, y + dy];
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function getTabGeometry(
  crossSize: number,
  maxHeight: number,
  tabAngle: number
): { inset: number; tabHeight: number } {
  const tabAngleRad = toRadians(tabAngle);
  // Keep width-limited tabs as tiny trapezoids instead of collapsing p2/p3.
  // Since line drawing includes both endpoints, a 1-coordinate span draws a
  // 2-pixel flat top.
  const minFlatTopSpan = crossSize >= 1 ? 1 : 0;
  const maxInset = Math.max(0, (crossSize - minFlatTopSpan) / 2);
  const idealTriangleHeight = Math.tan(tabAngleRad) * maxInset;
  const tabHeight = Math.min(maxHeight, idealTriangleHeight);

  return {
    inset:
      tabHeight > 0 && Math.tan(tabAngleRad) !== 0
        ? tabHeight / Math.tan(tabAngleRad)
        : 0,
    tabHeight,
  };
}

function drawTabOutline(page: CanvasWithContext, points: Point[]) {
  const [firstPoint] = points;
  if (!firstPoint) {
    return;
  }

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    if (from && to) {
      drawLine(page, from, to);
    }
  }
}

function drawTabNorth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number,
  tabType: TabType
) {
  //
  //    p2 ______ p3
  //      /|    |\
  //     / |    | \
  // p1 +--|----|--+ p4
  //

  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(w2, h2, tabAngle);

  const outerY = h2 - tabHeight;
  const baseLeft = translatePoint([0, h2], x, y);
  const baseRight = translatePoint([w2, h2], x, y);
  const outerLeft = translatePoint([inset, outerY], x, y);
  const outerRight = translatePoint([w2 - inset, outerY], x, y);
  const fullOuterLeft = translatePoint([0, outerY], x, y);
  const fullOuterRight = translatePoint([w2, outerY], x, y);

  switch (tabType) {
    case "Regular":
      drawTabOutline(page, [baseLeft, outerLeft, outerRight, baseRight]);
      break;
    case "Left":
      drawTabOutline(page, [baseLeft, outerLeft, fullOuterRight]);
      break;
    case "Middle":
      drawTabOutline(page, [fullOuterLeft, fullOuterRight]);
      break;
    case "Right":
      drawTabOutline(page, [fullOuterLeft, outerRight, baseRight]);
      break;
  }

  if (showFoldLine) {
    drawFoldLine(page, baseRight, baseLeft);
  }
}

function drawTabEast(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number,
  tabType: TabType
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
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(h2, w2, tabAngle);

  const baseTop = translatePoint([0, 0], x, y);
  const baseBottom = translatePoint([0, h2], x, y);
  const outerTop = translatePoint([tabHeight, inset], x, y);
  const outerBottom = translatePoint([tabHeight, h2 - inset], x, y);
  const fullOuterTop = translatePoint([tabHeight, 0], x, y);
  const fullOuterBottom = translatePoint([tabHeight, h2], x, y);

  switch (tabType) {
    case "Regular":
      drawTabOutline(page, [baseTop, outerTop, outerBottom, baseBottom]);
      break;
    case "Left":
      drawTabOutline(page, [baseTop, outerTop, fullOuterBottom]);
      break;
    case "Middle":
      drawTabOutline(page, [fullOuterTop, fullOuterBottom]);
      break;
    case "Right":
      drawTabOutline(page, [fullOuterTop, outerBottom, baseBottom]);
      break;
  }

  if (showFoldLine) {
    drawFoldLine(page, baseTop, baseBottom);
  }
}

function drawTabSouth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number,
  tabType: TabType
) {
  // p4 +----------+ p1
  //     \         /
  //      \      /
  //    p3 +----+ p2
  //

  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(w2, h2, tabAngle);

  const baseLeft = translatePoint([0, 0], x, y);
  const baseRight = translatePoint([w2, 0], x, y);
  const outerLeft = translatePoint([inset, tabHeight], x, y);
  const outerRight = translatePoint([w2 - inset, tabHeight], x, y);
  const fullOuterLeft = translatePoint([0, tabHeight], x, y);
  const fullOuterRight = translatePoint([w2, tabHeight], x, y);

  switch (tabType) {
    case "Regular":
      drawTabOutline(page, [baseLeft, outerLeft, outerRight, baseRight]);
      break;
    case "Left":
      drawTabOutline(page, [baseLeft, outerLeft, fullOuterRight]);
      break;
    case "Middle":
      drawTabOutline(page, [fullOuterLeft, fullOuterRight]);
      break;
    case "Right":
      drawTabOutline(page, [fullOuterLeft, outerRight, baseRight]);
      break;
  }

  if (showFoldLine) {
    drawFoldLine(page, baseLeft, baseRight);
  }
}

function drawTabWest(
  page: CanvasWithContext,
  rectangle: Rectangle,
  showFoldLine: boolean,
  tabAngle: number,
  tabType: TabType
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
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(h2, w2, tabAngle);

  const baseTop = translatePoint([w2, 0], x, y);
  const baseBottom = translatePoint([w2, h2], x, y);
  const outerTop = translatePoint([w2 - tabHeight, inset], x, y);
  const outerBottom = translatePoint([w2 - tabHeight, h2 - inset], x, y);
  const fullOuterTop = translatePoint([w2 - tabHeight, 0], x, y);
  const fullOuterBottom = translatePoint([w2 - tabHeight, h2], x, y);

  switch (tabType) {
    case "Regular":
      drawTabOutline(page, [baseTop, outerTop, outerBottom, baseBottom]);
      break;
    case "Left":
      drawTabOutline(page, [baseTop, outerTop, fullOuterBottom]);
      break;
    case "Middle":
      drawTabOutline(page, [fullOuterTop, fullOuterBottom]);
      break;
    case "Right":
      drawTabOutline(page, [fullOuterTop, outerBottom, baseBottom]);
      break;
  }

  if (showFoldLine) {
    drawFoldLine(page, baseBottom, baseTop);
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
  tabAngle: number = 45,
  tabType: TabType = "Regular"
) {
  switch (orientation) {
    case "North":
      drawTabNorth(page, rectangle, showFoldLine, tabAngle, tabType);
      break;
    case "East":
      drawTabEast(page, rectangle, showFoldLine, tabAngle, tabType);
      break;
    case "South":
      drawTabSouth(page, rectangle, showFoldLine, tabAngle, tabType);
      break;
    case "West":
      drawTabWest(page, rectangle, showFoldLine, tabAngle, tabType);
      break;
  }
}
