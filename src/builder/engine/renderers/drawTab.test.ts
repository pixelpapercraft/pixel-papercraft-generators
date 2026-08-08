import { describe, expect, it } from "vitest";
import type { CanvasWithContext } from "../canvasWithContext";
import type { Point, Rectangle } from "./types";
import { drawTab } from "./drawTab";

// `drawLine` (renderers/drawLine.ts) offsets both endpoints of every line by
// 0.5px perpendicular to its direction, to keep axis-aligned lines crisp —
// reversing a call's point order flips which side gets the offset. This is a
// local copy of that same formula so expectations can be pinned to the exact
// pixels `drawTab` produces, not just its nominal (pre-offset) coordinates.
function crispnessOffset([x1, y1]: Point, [x2, y2]: Point): Point {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  return [Math.sin(angle) * 0.5, Math.cos(angle) * 0.5];
}

type StrokeCall = {
  from: Point;
  to: Point;
  color: string;
  dash: number[];
};

type FakeContext = {
  strokeStyle: string;
  lineWidth: number;
  lineDashOffset: number;
  beginPath: () => void;
  setLineDash: (segments: number[]) => void;
  moveTo: (x: number, y: number) => void;
  lineTo: (x: number, y: number) => void;
  stroke: () => void;
};

// A minimal fake covering only what `drawLine`/`drawFoldLine` call on
// `page.context` — the real `CanvasRenderingContext2D` is a large browser
// interface with no way to structurally satisfy it in a Node test
// environment, so this is cast at the boundary, matching the same pattern
// `drawTexture.test.ts` already uses for the same reason.
function makeFakeCanvasWithContext(): {
  page: CanvasWithContext;
  strokes: StrokeCall[];
} {
  const strokes: StrokeCall[] = [];
  let pendingFrom: Point | undefined;
  let pendingTo: Point | undefined;
  let pendingDash: number[] = [];

  const context: FakeContext = {
    strokeStyle: "",
    lineWidth: 0,
    lineDashOffset: 0,
    beginPath: () => {
      pendingFrom = undefined;
      pendingTo = undefined;
    },
    setLineDash: (segments) => {
      pendingDash = segments;
    },
    moveTo: (x, y) => {
      pendingFrom = [x, y];
    },
    lineTo: (x, y) => {
      pendingTo = [x, y];
    },
    stroke: () => {
      if (pendingFrom && pendingTo) {
        strokes.push({
          from: pendingFrom,
          to: pendingTo,
          color: context.strokeStyle,
          dash: pendingDash,
        });
      }
    },
  };

  const page = {
    context,
    contextWithAlpha: context,
    canvas: {},
    width: 0,
    height: 0,
  } as unknown as CanvasWithContext;

  return { page, strokes };
}

function expectLine(
  strokes: StrokeCall[],
  index: number,
  from: Point,
  to: Point
) {
  const stroke = strokes[index];
  expect(stroke, `expected a stroke at index ${index}`).toBeDefined();
  if (!stroke) {
    return;
  }
  const [ox, oy] = crispnessOffset(from, to);
  expect(stroke.from[0]).toBeCloseTo(from[0] + ox);
  expect(stroke.from[1]).toBeCloseTo(from[1] + oy);
  expect(stroke.to[0]).toBeCloseTo(to[0] + ox);
  expect(stroke.to[1]).toBeCloseTo(to[1] + oy);
}

// Rectangles sized so `tabAngle=45` never hits the width-limited overflow
// branch (`inset` stays under `maxInset`): North/South use a wide rectangle
// (along-edge axis is `w`), East/West a tall one (along-edge axis is `h`).
// Both land on `inset = tabHeight = 4` by construction, derived from
// `drawTab`'s own inset/tabHeight algebra, not copied from its source.
const wideRectangle: Rectangle = [0, 0, 20, 4];
const tallRectangle: Rectangle = [0, 0, 4, 20];

describe("drawTab geometry", () => {
  describe("North", () => {
    const rectangle = wideRectangle;
    // p1=baseLeft [0,4], p2=outerLeft [4,0], p3=outerRight [16,0],
    // p4=baseRight [20,4], fullOuterLeft [0,0], fullOuterRight [20,0].

    it("Full tapers both corners to a flat top", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(strokes).toHaveLength(3);
      expectLine(strokes, 0, [4, 0], [0, 4]);
      expectLine(strokes, 1, [4, 0], [16, 0]);
      expectLine(strokes, 2, [20, 4], [16, 0]);
    });

    it("Left tapers only the left corner, flush to the right edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [4, 0], [0, 4]);
      expectLine(strokes, 1, [20, 0], [4, 0]);
    });

    it("Middle draws a flat top with no taper", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
      expectLine(strokes, 0, [20, 0], [0, 0]);
    });

    it("Right tapers only the right corner, flush to the left edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [16, 0], [0, 0]);
      expectLine(strokes, 1, [20, 4], [16, 0]);
    });
  });

  describe("East", () => {
    const rectangle = tallRectangle;
    // p1=baseTop [0,0], p2=outerTop [4,4], p3=outerBottom [4,16],
    // p4=baseBottom [0,20], fullOuterTop [4,0], fullOuterBottom [4,20].

    it("Full tapers both corners to a flat outer edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(strokes).toHaveLength(3);
      expectLine(strokes, 0, [0, 0], [4, 4]);
      expectLine(strokes, 1, [4, 16], [4, 4]);
      expectLine(strokes, 2, [4, 16], [0, 20]);
    });

    it("Left tapers only the top corner, flush to the bottom edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [0, 0], [4, 4]);
      expectLine(strokes, 1, [4, 20], [4, 4]);
    });

    it("Middle draws a flat outer edge with no taper", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
      expectLine(strokes, 0, [4, 20], [4, 0]);
    });

    it("Right tapers only the bottom corner, flush to the top edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [4, 16], [4, 0]);
      expectLine(strokes, 1, [4, 16], [0, 20]);
    });
  });

  describe("South", () => {
    const rectangle = wideRectangle;
    // p1=baseRight [20,0], p2=outerRight [16,4], p3=outerLeft [4,4],
    // p4=baseLeft [0,0], fullOuterRight [20,4], fullOuterLeft [0,4].

    it("Full tapers both corners to a flat bottom", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(strokes).toHaveLength(3);
      expectLine(strokes, 0, [16, 4], [20, 0]);
      expectLine(strokes, 1, [16, 4], [4, 4]);
      expectLine(strokes, 2, [0, 0], [4, 4]);
    });

    it("Left tapers only the left corner, flush to the right edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [0, 0], [4, 4]);
      expectLine(strokes, 1, [20, 4], [4, 4]);
    });

    it("Middle draws a flat bottom with no taper", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
      expectLine(strokes, 0, [20, 4], [0, 4]);
    });

    it("Right tapers only the right corner, flush to the left edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [16, 4], [20, 0]);
      expectLine(strokes, 1, [0, 4], [16, 4]);
    });
  });

  describe("West", () => {
    const rectangle = tallRectangle;
    // p1=baseBottom [4,20], p2=outerBottom [0,16], p3=outerTop [0,4],
    // p4=baseTop [4,0], fullOuterBottom [0,20], fullOuterTop [0,0].

    it("Full tapers both corners to a flat outer edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(strokes).toHaveLength(3);
      expectLine(strokes, 0, [4, 20], [0, 16]);
      expectLine(strokes, 1, [0, 4], [0, 16]);
      expectLine(strokes, 2, [0, 4], [4, 0]);
    });

    it("Left tapers only the top corner, flush to the bottom edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [4, 0], [0, 4]);
      expectLine(strokes, 1, [0, 20], [0, 4]);
    });

    it("Middle draws a flat outer edge with no taper", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
      expectLine(strokes, 0, [0, 20], [0, 0]);
    });

    it("Right tapers only the bottom corner, flush to the top edge", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [0, 16], [4, 20]);
      expectLine(strokes, 1, [0, 0], [0, 16]);
    });
  });

  describe("fold line", () => {
    it("is suppressed when showFoldLine is false", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, wideRectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
    });

    it("draws one extra dashed grey line across the tab's base when enabled", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, wideRectangle, "North", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(2);
      const foldLine = strokes[1];
      expect(foldLine).toBeDefined();
      if (!foldLine) {
        return;
      }
      expect(foldLine.color).toBe("#7b7b7b");
      expect(foldLine.dash).toEqual([2, 2]);
      expectLine(strokes, 1, [20, 4], [0, 4]);
    });
  });

  describe("default parameters", () => {
    it("omitting options renders identically to explicit defaults", () => {
      const withDefault = makeFakeCanvasWithContext();
      drawTab(withDefault.page, wideRectangle, "North");

      const withExplicit = makeFakeCanvasWithContext();
      drawTab(withExplicit.page, wideRectangle, "North", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Full",
      });

      expect(withDefault.strokes).toEqual<typeof withDefault.strokes>(
        withExplicit.strokes
      );
    });
  });

  describe("width-limited overflow", () => {
    // A rectangle much shorter than it is tall forces North's `inset` past
    // `maxInset` (`w/2`), exercising the capped branch alongside `tabShape`.
    // Capping always sets `inset = maxInset = w/2`, so `w - inset` lands on
    // the same value — `p2`/`p3` coincide exactly (a pre-existing gap in
    // V2's uncapped-crispness formula, not something this PR's `tabShape`
    // support changes or fixes; see the plan's deferred `getTabGeometry`
    // `w2`/`h2` question).
    const rectangle: Rectangle = [0, 0, 4, 20];
    // p1=baseLeft [0,20], p2=p3=outer (degenerate) [2,18], p4=baseRight
    // [4,20], fullOuterLeft [0,18], fullOuterRight [4,18].

    it("Full", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(strokes).toHaveLength(3);
      expectLine(strokes, 0, [2, 18], [0, 20]);
      expectLine(strokes, 1, [2, 18], [2, 18]);
      expectLine(strokes, 2, [4, 20], [2, 18]);
    });

    it("Left", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [2, 18], [0, 20]);
      expectLine(strokes, 1, [4, 18], [2, 18]);
    });

    it("Middle", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(strokes).toHaveLength(1);
      expectLine(strokes, 0, [4, 18], [0, 18]);
    });

    it("Right", () => {
      const { page, strokes } = makeFakeCanvasWithContext();
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(strokes).toHaveLength(2);
      expectLine(strokes, 0, [2, 18], [0, 18]);
      expectLine(strokes, 1, [4, 20], [2, 18]);
    });
  });
});
