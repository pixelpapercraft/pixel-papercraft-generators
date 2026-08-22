import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CanvasWithContext } from "../canvasWithContext";
import type { Point, Rectangle } from "./types";
import { drawTab } from "./drawTab";
import { drawFoldLine, drawLine } from "./drawLine";

// `drawTab` only ever forwards the points it computes straight to
// `drawLine`/`drawFoldLine` — it applies no offset or rounding of its own
// (that is `drawLine`'s own concern, covered independently in
// `drawLine.test.ts`). Mocking `drawLine`/`drawFoldLine` here isolates
// `drawTab`'s geometry — which points it computes for each orientation/shape
// — from how those points end up rendered to pixels, the same layering
// `cuboidTabs.test.ts` already uses one level up (it mocks `drawTab` itself).
vi.mock("./drawLine", () => ({
  drawLine: vi.fn(),
  drawFoldLine: vi.fn(),
}));

const mockedDrawLine = vi.mocked(drawLine);
const mockedDrawFoldLine = vi.mocked(drawFoldLine);

beforeEach(() => {
  mockedDrawLine.mockClear();
  mockedDrawFoldLine.mockClear();
});

// `drawTab` never reads or writes anything on `page` itself — every point it
// computes goes straight to the mocked `drawLine`/`drawFoldLine` above — so
// an empty object cast at the boundary stands in for a real canvas.
const page = {} as unknown as CanvasWithContext;

// `toBeCloseTo`, not exact equality: `drawTab`'s own inset/tabHeight algebra
// goes through `Math.tan`, which leaves a trailing floating-point error
// (e.g. `4.000000000000001`) independent of anything this file mocks.
function expectPoint(actual: Point, expected: Point) {
  expect(actual[0]).toBeCloseTo(expected[0]);
  expect(actual[1]).toBeCloseTo(expected[1]);
}

function expectLine(index: number, from: Point, to: Point) {
  const call = mockedDrawLine.mock.calls[index];
  expect(call, `expected a drawLine call at index ${index}`).toBeDefined();
  if (!call) {
    return;
  }
  const [, actualFrom, actualTo] = call;
  expectPoint(actualFrom, from);
  expectPoint(actualTo, to);
}

function expectFoldLine(from: Point, to: Point) {
  expect(mockedDrawFoldLine).toHaveBeenCalledTimes(1);
  const call = mockedDrawFoldLine.mock.calls[0];
  expect(call).toBeDefined();
  if (!call) {
    return;
  }
  const [, actualFrom, actualTo] = call;
  expectPoint(actualFrom, from);
  expectPoint(actualTo, to);
}

// Rectangles sized so `tabAngle=45` never hits `getTabGeometry`'s flat-top
// capping (`inset` stays under `maxInset`): North/South use a wide rectangle
// (along-edge axis is `w`), East/West a tall one (along-edge axis is `h`).
// `w2 = w-1 = 19`, `h2 = h-1 = 3` (or the reverse for the tall rectangle).
// getTabGeometry(crossSize=19, maxHeight=3, 45deg): maxInset=(19-1)/2=9,
// idealTabHeight=9, tabHeight=min(3, 9)=3, inset=3 — derived from
// `getTabGeometry`'s own algebra, not copied from its source.
const wideRectangle: Rectangle = [0, 0, 20, 4];
const tallRectangle: Rectangle = [0, 0, 4, 20];

describe("drawTab geometry", () => {
  describe("North", () => {
    const rectangle = wideRectangle;
    // w2=19, h2=3, inset=3, tabHeight=3, outerY=h2-tabHeight=0.
    // p1=baseLeft [0,3], p2=outerLeft [3,0], p3=outerRight [16,0],
    // p4=baseRight [19,3], fullOuterLeft [0,0], fullOuterRight [19,0].

    it("Full tapers both corners to a flat top", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(3);
      expectLine(0, [3, 0], [0, 3]);
      expectLine(1, [3, 0], [16, 0]);
      expectLine(2, [19, 3], [16, 0]);
    });

    it("Left tapers only the left corner, flush to the right edge", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [3, 0], [0, 3]);
      expectLine(1, [19, 0], [3, 0]);
    });

    it("Middle draws a flat top with no taper", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expectLine(0, [19, 0], [0, 0]);
    });

    it("Right tapers only the right corner, flush to the left edge", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [16, 0], [0, 0]);
      expectLine(1, [19, 3], [16, 0]);
    });
  });

  describe("East", () => {
    const rectangle = tallRectangle;
    // w2=3, h2=19, inset=3, tabHeight=3.
    // p1=baseTop [0,0], p2=outerTop [3,3], p3=outerBottom [3,16],
    // p4=baseBottom [0,19], fullOuterTop [3,0], fullOuterBottom [3,19].

    it("Full tapers both corners to a flat outer edge", () => {
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(3);
      expectLine(0, [0, 0], [3, 3]);
      expectLine(1, [3, 16], [3, 3]);
      expectLine(2, [3, 16], [0, 19]);
    });

    it("Left tapers only the top corner, flush to the bottom edge", () => {
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [0, 0], [3, 3]);
      expectLine(1, [3, 19], [3, 3]);
    });

    it("Middle draws a flat outer edge with no taper", () => {
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expectLine(0, [3, 19], [3, 0]);
    });

    it("Right tapers only the bottom corner, flush to the top edge", () => {
      drawTab(page, rectangle, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [3, 16], [3, 0]);
      expectLine(1, [3, 16], [0, 19]);
    });
  });

  describe("South", () => {
    const rectangle = wideRectangle;
    // w2=19, h2=3, inset=3, tabHeight=3.
    // p1=baseRight [19,0], p2=outerRight [16,3], p3=outerLeft [3,3],
    // p4=baseLeft [0,0], fullOuterRight [19,3], fullOuterLeft [0,3].

    it("Full tapers both corners to a flat bottom", () => {
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(3);
      expectLine(0, [16, 3], [19, 0]);
      expectLine(1, [16, 3], [3, 3]);
      expectLine(2, [0, 0], [3, 3]);
    });

    it("Left tapers only the left corner, flush to the right edge", () => {
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [0, 0], [3, 3]);
      expectLine(1, [19, 3], [3, 3]);
    });

    it("Middle draws a flat bottom with no taper", () => {
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expectLine(0, [19, 3], [0, 3]);
    });

    it("Right tapers only the right corner, flush to the left edge", () => {
      drawTab(page, rectangle, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [16, 3], [19, 0]);
      expectLine(1, [0, 3], [16, 3]);
    });
  });

  describe("West", () => {
    const rectangle = tallRectangle;
    // w2=3, h2=19, inset=3, tabHeight=3.
    // p1=baseBottom [3,19], p2=outerBottom [0,16], p3=outerTop [0,3],
    // p4=baseTop [3,0], fullOuterBottom [0,19], fullOuterTop [0,0].

    it("Full tapers both corners to a flat outer edge", () => {
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(3);
      expectLine(0, [3, 19], [0, 16]);
      expectLine(1, [0, 3], [0, 16]);
      expectLine(2, [0, 3], [3, 0]);
    });

    it("Left tapers only the top corner, flush to the bottom edge", () => {
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [3, 0], [0, 3]);
      expectLine(1, [0, 19], [0, 3]);
    });

    it("Middle draws a flat outer edge with no taper", () => {
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expectLine(0, [0, 19], [0, 0]);
    });

    it("Right tapers only the bottom corner, flush to the top edge", () => {
      drawTab(page, rectangle, "West", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [0, 16], [3, 19]);
      expectLine(1, [0, 0], [0, 16]);
    });
  });

  describe("fold line", () => {
    it("is suppressed when showFoldLine is false", () => {
      drawTab(page, wideRectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expect(mockedDrawFoldLine).not.toHaveBeenCalled();
    });

    it("draws one extra fold line across the tab's base when enabled", () => {
      drawTab(page, wideRectangle, "North", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      // fold: p4 [w2, h2] -> p1 [0, h2] = [19, 3] -> [0, 3].
      expectFoldLine([19, 3], [0, 3]);
    });
  });

  describe("default parameters", () => {
    it("omitting options renders identically to explicit defaults", () => {
      drawTab(page, wideRectangle, "North");
      const withDefault = {
        drawLine: [...mockedDrawLine.mock.calls],
        drawFoldLine: [...mockedDrawFoldLine.mock.calls],
      };

      mockedDrawLine.mockClear();
      mockedDrawFoldLine.mockClear();

      drawTab(page, wideRectangle, "North", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Full",
      });
      const withExplicit = {
        drawLine: [...mockedDrawLine.mock.calls],
        drawFoldLine: [...mockedDrawFoldLine.mock.calls],
      };

      expect(withDefault).toEqual<typeof withDefault>(withExplicit);
    });
  });

  describe("width-limited overflow", () => {
    // A rectangle much shorter than it is tall forces North's `inset` past
    // half its (crispness-adjusted) width, exercising `getTabGeometry`'s
    // capped branch alongside `tabShape`. `getTabGeometry` reserves 1 unit
    // of flat top before computing the widest possible inset, so `p2`/`p3`
    // land one unit apart instead of coinciding at a single degenerate
    // point — a real 2-pixel-wide flat top once `drawLine` plots both
    // endpoints, rather than a collapsed corner.
    //
    // Every point below also uses `w2 = w - 1`/`h2 = h - 1` in place of the
    // raw `w`/`h` (matching `getTabGeometry`'s own crispness-adjusted
    // inputs), so the tab's own far edge lands on the rectangle's last
    // valid pixel rather than one pixel past it.
    const rectangle: Rectangle = [0, 0, 4, 20];
    // w2=3, h2=19. getTabGeometry(crossSize=3, maxHeight=19, 45deg):
    // minFlatTopSpan=1, maxInset=(3-1)/2=1, tabHeight=min(19, tan(45)*1)=1,
    // inset=1. outerY = h2 - tabHeight = 18.
    // p1=baseLeft [0,19], p2=outer [1,18], p3=outer [2,18] (one unit right
    // of p2, not coincident), p4=baseRight [3,19], fullOuterLeft [0,18],
    // fullOuterRight [3,18].

    it("Full", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Full",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(3);
      expectLine(0, [1, 18], [0, 19]);
      expectLine(1, [1, 18], [2, 18]);
      expectLine(2, [3, 19], [2, 18]);
    });

    it("Left", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Left",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [1, 18], [0, 19]);
      expectLine(1, [3, 18], [1, 18]);
    });

    it("Middle", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(1);
      expectLine(0, [3, 18], [0, 18]);
    });

    it("Right", () => {
      drawTab(page, rectangle, "North", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Right",
      });
      expect(mockedDrawLine).toHaveBeenCalledTimes(2);
      expectLine(0, [2, 18], [0, 18]);
      expectLine(1, [3, 19], [2, 18]);
    });
  });

  describe("crispness: the flat outer/base edge lands within the rectangle, not one pixel past it", () => {
    // A rectangle with `h` well under half of `w` (a wide margin from
    // `getTabGeometry`'s flat-top capping, covered above, so `tabHeight`
    // caps cleanly on `maxHeight` alone): w2=39, h2=9. getTabGeometry(39, 9,
    // 45deg): maxInset=(39-1)/2=19, idealTabHeight=19, tabHeight=min(9,
    // 19)=9, inset=9.
    const wideRect: Rectangle = [0, 0, 40, 10];

    it("North: base sits on the rectangle's last row (h2), not h", () => {
      drawTab(page, wideRect, "North", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Middle",
      });
      // fullOuterRight -> fullOuterLeft, at y = h2 - tabHeight = 9 - 9 = 0.
      expectLine(0, [39, 0], [0, 0]);
      // fold: p4 [w2, h2] -> p1 [0, h2].
      expectFoldLine([39, 9], [0, 9]);
    });

    it("South: outer edge sits on the rectangle's last row (h2), not h", () => {
      drawTab(page, wideRect, "South", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      // fullOuterRight -> fullOuterLeft, at y = tabHeight = 9 (= h2).
      expectLine(0, [39, 9], [0, 9]);
    });

    // Tall rectangle, the East/West mirror of `wideRect`: w2=9, h2=39.
    // getTabGeometry(39, 9, 45deg) same as above: tabHeight=9, inset=9.
    const tallRect: Rectangle = [0, 0, 10, 40];

    it("East: outer edge sits on the rectangle's last column (w2), not w", () => {
      drawTab(page, tallRect, "East", {
        showFoldLine: false,
        tabAngle: 45,
        tabShape: "Middle",
      });
      // fullOuterBottom -> fullOuterTop, at x = tabHeight = 9.
      expectLine(0, [9, 39], [9, 0]);
    });

    it("West: base sits on the rectangle's last column (w2), not w", () => {
      drawTab(page, tallRect, "West", {
        showFoldLine: true,
        tabAngle: 45,
        tabShape: "Middle",
      });
      // fullOuterBottom -> fullOuterTop, at x = w2 - tabHeight = 9 - 9 = 0.
      expectLine(0, [0, 39], [0, 0]);
      // fold: p1 [w2, h2] -> p4 [w2, 0].
      expectFoldLine([9, 39], [9, 0]);
    });
  });
});
