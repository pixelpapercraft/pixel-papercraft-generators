import type { Point, Rectangle } from "./types";
import { drawLine, drawFoldLine } from "./drawLine";
import { CanvasWithContext } from "../canvasWithContext";

export type TabOrientation = "North" | "South" | "East" | "West";
export type TabShape = "Full" | "Left" | "Middle" | "Right";

export type DrawTabOptions = {
  showFoldLine?: boolean;
  tabAngle?: number;
  tabShape?: TabShape;
};

type ResolvedDrawTabOptions = {
  showFoldLine: boolean;
  tabAngle: number;
  tabShape: TabShape;
};

function translatePoint([x, y]: Point, dx: number, dy: number): Point {
  return [x + dx, y + dy];
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// `crossSize`/`maxHeight` are the *last valid pixel index* along each axis
// (a caller's own dimension minus 1), not the raw dimension — every point
// `drawTab` computes stays within the rectangle it was given, rather than
// landing one pixel past its far edge.
//
// Reserves 1 unit of flat top (`minFlatTopSpan`) before computing the widest
// possible inset, so a tab constrained by `crossSize` keeps a small flat-top
// trapezoid instead of collapsing to a single point once `Left`/`Right`'s two
// tapered points would otherwise coincide.
function getTabGeometry(
  crossSize: number,
  maxHeight: number,
  tabAngle: number
): { inset: number; tabHeight: number } {
  const tabAngleRad = toRadians(tabAngle);
  const minFlatTopSpan = crossSize >= 1 ? 1 : 0;
  const maxInset = Math.max(0, (crossSize - minFlatTopSpan) / 2);
  const idealTabHeight = Math.tan(tabAngleRad) * maxInset;
  const tabHeight = Math.min(Math.max(0, maxHeight), idealTabHeight);

  return {
    inset:
      tabHeight > 0 && Math.tan(tabAngleRad) !== 0
        ? tabHeight / Math.tan(tabAngleRad)
        : 0,
    tabHeight,
  };
}

function drawTabNorth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  options: ResolvedDrawTabOptions
) {
  //
  //    p2 ______ p3
  //      /|    |\
  //     / |    | \
  // p1 +--|----|--+ p4
  //

  const { showFoldLine, tabAngle, tabShape } = options;
  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(w2, h2, tabAngle);
  const outerY = h2 - tabHeight;

  let p1: Point = [0, h2];
  let p2: Point = [inset, outerY];
  let p3: Point = [w2 - inset, outerY];
  let p4: Point = [w2, h2];
  let fullOuterLeft: Point = [0, outerY];
  let fullOuterRight: Point = [w2, outerY];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);
  fullOuterLeft = translatePoint(fullOuterLeft, x, y);
  fullOuterRight = translatePoint(fullOuterRight, x, y);

  switch (tabShape) {
    case "Full":
      drawLine(page, p2, p1);
      drawLine(page, p2, p3);
      drawLine(page, p4, p3);
      break;
    case "Left":
      drawLine(page, p2, p1);
      drawLine(page, fullOuterRight, p2);
      break;
    case "Middle":
      drawLine(page, fullOuterRight, fullOuterLeft);
      break;
    case "Right":
      drawLine(page, p3, fullOuterLeft);
      drawLine(page, p4, p3);
      break;
    default:
      return tabShape satisfies never;
  }

  if (showFoldLine) {
    drawFoldLine(page, p4, p1);
  }
}

function drawTabEast(
  page: CanvasWithContext,
  rectangle: Rectangle,
  options: ResolvedDrawTabOptions
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

  const { showFoldLine, tabAngle, tabShape } = options;
  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(h2, w2, tabAngle);

  let p1: Point = [0, 0];
  let p2: Point = [tabHeight, inset];
  let p3: Point = [tabHeight, h2 - inset];
  let p4: Point = [0, h2];
  let fullOuterTop: Point = [tabHeight, 0];
  let fullOuterBottom: Point = [tabHeight, h2];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);
  fullOuterTop = translatePoint(fullOuterTop, x, y);
  fullOuterBottom = translatePoint(fullOuterBottom, x, y);

  switch (tabShape) {
    case "Full":
      drawLine(page, p1, p2);
      drawLine(page, p3, p2);
      drawLine(page, p3, p4);
      break;
    case "Left":
      drawLine(page, p1, p2);
      drawLine(page, fullOuterBottom, p2);
      break;
    case "Middle":
      drawLine(page, fullOuterBottom, fullOuterTop);
      break;
    case "Right":
      drawLine(page, p3, fullOuterTop);
      drawLine(page, p3, p4);
      break;
    default:
      return tabShape satisfies never;
  }

  if (showFoldLine) {
    drawFoldLine(page, p1, p4);
  }
}

function drawTabSouth(
  page: CanvasWithContext,
  rectangle: Rectangle,
  options: ResolvedDrawTabOptions
) {
  // p4 +----------+ p1
  //     \         /
  //      \      /
  //    p3 +----+ p2
  //

  const { showFoldLine, tabAngle, tabShape } = options;
  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(w2, h2, tabAngle);

  let p1: Point = [w2, 0];
  let p2: Point = [w2 - inset, tabHeight];
  let p3: Point = [inset, tabHeight];
  let p4: Point = [0, 0];
  let fullOuterRight: Point = [w2, tabHeight];
  let fullOuterLeft: Point = [0, tabHeight];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);
  fullOuterRight = translatePoint(fullOuterRight, x, y);
  fullOuterLeft = translatePoint(fullOuterLeft, x, y);

  switch (tabShape) {
    case "Full":
      drawLine(page, p2, p1);
      drawLine(page, p2, p3);
      drawLine(page, p4, p3);
      break;
    case "Left":
      drawLine(page, p4, p3);
      drawLine(page, fullOuterRight, p3);
      break;
    case "Middle":
      drawLine(page, fullOuterRight, fullOuterLeft);
      break;
    case "Right":
      drawLine(page, p2, p1);
      drawLine(page, fullOuterLeft, p2);
      break;
    default:
      return tabShape satisfies never;
  }

  if (showFoldLine) {
    drawFoldLine(page, p4, p1);
  }
}

function drawTabWest(
  page: CanvasWithContext,
  rectangle: Rectangle,
  options: ResolvedDrawTabOptions
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

  const { showFoldLine, tabAngle, tabShape } = options;
  const [x, y, w, h] = rectangle;
  const w2 = w - 1;
  const h2 = h - 1;

  const { inset, tabHeight } = getTabGeometry(h2, w2, tabAngle);

  let p1: Point = [w2, h2];
  let p2: Point = [w2 - tabHeight, h2 - inset];
  let p3: Point = [w2 - tabHeight, inset];
  let p4: Point = [w2, 0];
  let fullOuterBottom: Point = [w2 - tabHeight, h2];
  let fullOuterTop: Point = [w2 - tabHeight, 0];

  p1 = translatePoint(p1, x, y);
  p2 = translatePoint(p2, x, y);
  p3 = translatePoint(p3, x, y);
  p4 = translatePoint(p4, x, y);
  fullOuterBottom = translatePoint(fullOuterBottom, x, y);
  fullOuterTop = translatePoint(fullOuterTop, x, y);

  switch (tabShape) {
    case "Full":
      drawLine(page, p1, p2);
      drawLine(page, p3, p2);
      drawLine(page, p3, p4);
      break;
    case "Left":
      drawLine(page, p4, p3);
      drawLine(page, fullOuterBottom, p3);
      break;
    case "Middle":
      drawLine(page, fullOuterBottom, fullOuterTop);
      break;
    case "Right":
      drawLine(page, p2, p1);
      drawLine(page, fullOuterTop, p2);
      break;
    default:
      return tabShape satisfies never;
  }

  if (showFoldLine) {
    drawFoldLine(page, p1, p4);
  }
}

// Full
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
// `tabShape` shapes the outer edge: `Full` tapers both corners in to the
// full trapezoid above; `Left`/`Right` taper only the corner named (p2/p1
// for North's Left, p3/p4 for North's Right, and each orientation's
// equivalent pair) and run flat, full-width to the other; `Middle` tapers
// neither corner and draws only the flat outer edge.
export function drawTab(
  page: CanvasWithContext,
  rectangle: Rectangle,
  orientation: TabOrientation,
  options: DrawTabOptions = {}
): void {
  const resolved: ResolvedDrawTabOptions = {
    showFoldLine: options.showFoldLine ?? true,
    tabAngle: options.tabAngle ?? 45,
    tabShape: options.tabShape ?? "Full",
  };

  switch (orientation) {
    case "North":
      drawTabNorth(page, rectangle, resolved);
      break;
    case "East":
      drawTabEast(page, rectangle, resolved);
      break;
    case "South":
      drawTabSouth(page, rectangle, resolved);
      break;
    case "West":
      drawTabWest(page, rectangle, resolved);
      break;
    default:
      return orientation satisfies never;
  }
}
