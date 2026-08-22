import { describe, expect, it } from "vitest";
import type { CanvasWithContext } from "../canvasWithContext";
import type { Position } from "./types";
import {
  drawFoldLine,
  drawLine,
  getLinePixels,
  getPixelRect,
  shouldDrawDashPixel,
} from "./drawLine";

// getLinePixels: pure Bresenham point-plotting, no canvas involved. Every
// expected sequence below is worked out by hand from the algorithm's own
// definition (round each endpoint to its nearest pixel, then step the
// integer error accumulator until the rounded end is reached), not copied
// from the implementation — so a transcription slip in the implementation
// shows up as a mismatch here. Both endpoints are always included: the two
// specified pixels are literal input, and both must be drawn.
describe("getLinePixels", () => {
  it("plots every integer x between two horizontal endpoints", () => {
    expect(getLinePixels([2, 5], [6, 5])).toEqual<Position[]>([
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 5],
      [6, 5],
    ]);
  });

  it("plots every integer y between two vertical endpoints", () => {
    expect(getLinePixels([10, 2], [10, 6])).toEqual<Position[]>([
      [10, 2],
      [10, 3],
      [10, 4],
      [10, 5],
      [10, 6],
    ]);
  });

  it("reverses cleanly: walking a horizontal line backwards mirrors the forward sequence", () => {
    const forward = getLinePixels([2, 5], [6, 5]);
    const backward = getLinePixels([6, 5], [2, 5]);
    expect(backward).toEqual<Position[]>([...forward].reverse());
  });

  it("plots a perfect diagonal one step at a time on both axes", () => {
    expect(getLinePixels([0, 0], [3, 3])).toEqual<Position[]>([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
    ]);
  });

  it("plots a shallow diagonal (dx > dy), advancing y less often than x", () => {
    // Hand-traced from the algorithm: dx=4, dy=2, error=dx-dy=2.
    expect(getLinePixels([0, 0], [4, 2])).toEqual<Position[]>([
      [0, 0],
      [1, 0],
      [2, 1],
      [3, 1],
      [4, 2],
    ]);
  });

  it("collapses to a single point when both endpoints round to the same pixel", () => {
    expect(getLinePixels([5, 5], [5, 5])).toEqual<Position[]>([[5, 5]]);
  });

  it("rounds fractional endpoints to their nearest pixel before plotting", () => {
    // x1=2.4 -> 2, y1=5.6 -> 6, x2=6.5 -> 7 (round-half-up), y2=5.4 -> 5.
    // dx=5, dy=1, error=4; hand-traced below.
    expect(getLinePixels([2.4, 5.6], [6.5, 5.4])).toEqual<Position[]>([
      [2, 6],
      [3, 6],
      [4, 6],
      [5, 5],
      [6, 5],
      [7, 5],
    ]);
  });

  // Structural invariants every Bresenham line must satisfy, independent of
  // any single hand-traced sequence — catches classes of bugs (dropped
  // endpoint, diagonal double-step, wrong step count) that a handful of
  // fixed examples could miss.
  describe("invariants", () => {
    const cases: Array<{ name: string; from: Position; to: Position }> = [
      { name: "shallow", from: [0, 0], to: [9, 2] },
      { name: "steep", from: [0, 0], to: [2, 9] },
      { name: "horizontal", from: [-3, 4], to: [8, 4] },
      { name: "vertical", from: [4, -3], to: [4, 8] },
      { name: "diagonal", from: [1, 1], to: [-6, -6] },
      { name: "negative coordinates", from: [-5, -2], to: [-1, -9] },
      { name: "single point", from: [3, 3], to: [3, 3] },
    ];

    it.each(cases)(
      "$name: starts at the rounded start and ends at the rounded end",
      ({ from, to }) => {
        const points = getLinePixels(from, to);
        const [fx, fy] = from;
        const [tx, ty] = to;
        expect(points[0]).toEqual<Position>([Math.round(fx), Math.round(fy)]);
        expect(points[points.length - 1]).toEqual<Position>([
          Math.round(tx),
          Math.round(ty),
        ]);
      }
    );

    it.each(cases)(
      "$name: has exactly max(|dx|, |dy|) + 1 points",
      ({ from, to }) => {
        const points = getLinePixels(from, to);
        const dx = Math.abs(Math.round(to[0]) - Math.round(from[0]));
        const dy = Math.abs(Math.round(to[1]) - Math.round(from[1]));
        expect(points).toHaveLength(Math.max(dx, dy) + 1);
      }
    );

    it.each(cases)(
      "$name: every step moves by at most one pixel on each axis, and never stands still",
      ({ from, to }) => {
        const points = getLinePixels(from, to);
        for (let i = 1; i < points.length; i += 1) {
          const [px, py] = points[i - 1] as Position;
          const [x, y] = points[i] as Position;
          const stepX = x - px;
          const stepY = y - py;
          expect(Math.abs(stepX)).toBeLessThanOrEqual(1);
          expect(Math.abs(stepY)).toBeLessThanOrEqual(1);
          expect(stepX !== 0 || stepY !== 0).toBe(true);
        }
      }
    );
  });
});

// shouldDrawDashPixel: pure per-step dash selection. An empty pattern always
// draws; a [2,2] pattern draws two steps on, skips two off, repeating, and
// lineDashOffset shifts where in that cycle a given step index falls.
describe("shouldDrawDashPixel", () => {
  it("always draws when there is no dash pattern", () => {
    for (let i = 0; i < 6; i += 1) {
      expect(shouldDrawDashPixel(i, [], 0)).toBe(true);
    }
  });

  it("draws two steps on, skips two off, for a [2, 2] pattern with no offset", () => {
    const results = Array.from({ length: 8 }, (_, i) =>
      shouldDrawDashPixel(i, [2, 2], 0)
    );
    expect(results).toEqual([
      true,
      true,
      false,
      false,
      true,
      true,
      false,
      false,
    ]);
  });

  it("shifts the on/off cycle by the dash offset", () => {
    const results = Array.from({ length: 8 }, (_, i) =>
      shouldDrawDashPixel(i, [2, 2], 1)
    );
    expect(results).toEqual([
      true,
      false,
      false,
      true,
      true,
      false,
      false,
      true,
    ]);
  });

  it("supports uneven on/off run lengths", () => {
    // [3, 1]: 3 on, 1 off, repeating every 4 steps.
    const results = Array.from({ length: 8 }, (_, i) =>
      shouldDrawDashPixel(i, [3, 1], 0)
    );
    expect(results).toEqual([true, true, true, false, true, true, true, false]);
  });
});

// getPixelRect: pure width-to-rect conversion. width=1 is a single exact
// pixel regardless of orientation. Wider strokes on a horizontal/vertical
// line extend only perpendicular to the line -- the length-wise extent
// stays exactly 1 -- so a plotted endpoint never grows the line past its
// own coordinate. A diagonal line has no defined perpendicular without its
// exact angle, so it falls back to an isotropic square, biased toward the
// top-left by one pixel for even widths (a square can't be perfectly
// centred on a single integer point).
describe("getPixelRect", () => {
  it("returns a single exact pixel for the default width of 1, for any orientation", () => {
    expect(getPixelRect(10, 20, 1, "horizontal")).toEqual({
      x: 10,
      y: 20,
      width: 1,
      height: 1,
    });
    expect(getPixelRect(10, 20, 1, "vertical")).toEqual({
      x: 10,
      y: 20,
      width: 1,
      height: 1,
    });
    expect(getPixelRect(10, 20, 1, "diagonal")).toEqual({
      x: 10,
      y: 20,
      width: 1,
      height: 1,
    });
  });

  it("extends a horizontal line's stroke only vertically, keeping x-width at 1", () => {
    expect(getPixelRect(10, 20, 3, "horizontal")).toEqual({
      x: 10,
      y: 19,
      width: 1,
      height: 3,
    });
  });

  it("extends a vertical line's stroke only horizontally, keeping y-height at 1", () => {
    expect(getPixelRect(10, 20, 3, "vertical")).toEqual({
      x: 9,
      y: 20,
      width: 3,
      height: 1,
    });
  });

  it("centres an odd-width isotropic square on a diagonal point", () => {
    expect(getPixelRect(10, 20, 3, "diagonal")).toEqual({
      x: 9,
      y: 19,
      width: 3,
      height: 3,
    });
  });

  it("biases an even-width diagonal square toward the top-left of the point", () => {
    expect(getPixelRect(10, 20, 2, "diagonal")).toEqual({
      x: 9,
      y: 19,
      width: 2,
      height: 2,
    });
  });

  it("clamps a width below 1 up to a single pixel", () => {
    expect(getPixelRect(10, 20, 0, "diagonal")).toEqual({
      x: 10,
      y: 20,
      width: 1,
      height: 1,
    });
    expect(getPixelRect(10, 20, 0.4, "diagonal")).toEqual({
      x: 10,
      y: 20,
      width: 1,
      height: 1,
    });
  });

  it("rounds a fractional width to the nearest whole pixel", () => {
    expect(getPixelRect(10, 20, 2.6, "diagonal")).toEqual({
      x: 9,
      y: 19,
      width: 3,
      height: 3,
    });
  });
});

// Thin integration layer: proves drawLine/drawFoldLine wire the pure pieces
// above into real fillRect calls correctly, without re-deriving Bresenham or
// dash-selection logic against the canvas — those are already covered above.
type FillCall = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

type FakeContext = {
  fillStyle: string;
  fillRect: (x: number, y: number, width: number, height: number) => void;
  save: () => void;
  restore: () => void;
};

// A minimal fake covering only what `drawLine` calls on `page.context` — the
// real `CanvasRenderingContext2D` is a large browser interface with no way to
// structurally satisfy it in a Node test environment, so this is cast at the
// boundary, matching the same pattern `drawTexture.test.ts`/`drawTab.test.ts`
// already use for the same reason.
function makeFakeCanvasWithContext(): {
  page: CanvasWithContext;
  fills: FillCall[];
} {
  const fills: FillCall[] = [];
  const context: FakeContext = {
    fillStyle: "",
    fillRect: (x, y, width, height) => {
      fills.push({ x, y, width, height, color: context.fillStyle });
    },
    save: () => {},
    restore: () => {},
  };

  const page = {
    context,
    contextWithAlpha: context,
    canvas: {},
    width: 0,
    height: 0,
  } as unknown as CanvasWithContext;

  return { page, fills };
}

describe("drawLine", () => {
  it("fills one 1x1 rect per plotted pixel, in default black, for a plain line", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawLine(page, [2, 5], [4, 5]);

    expect(fills).toEqual<FillCall[]>([
      { x: 2, y: 5, width: 1, height: 1, color: "#000000" },
      { x: 3, y: 5, width: 1, height: 1, color: "#000000" },
      { x: 4, y: 5, width: 1, height: 1, color: "#000000" },
    ]);
  });

  it("uses the given color and width for every plotted pixel", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawLine(page, [10, 10], [10, 10], { color: "#ff00ff", width: 3 });

    expect(fills).toEqual<FillCall[]>([
      { x: 9, y: 9, width: 3, height: 3, color: "#ff00ff" },
    ]);
  });

  it("skips fillRect on steps a dash pattern turns off", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawLine(page, [0, 0], [7, 0], { lineDash: [2, 2] });

    expect(fills.map((fill) => fill.x)).toEqual([0, 1, 4, 5]);
  });

  it("saves and restores the context around drawing", () => {
    const { page, fills } = makeFakeCanvasWithContext();
    const calls: string[] = [];
    const context = page.context as unknown as FakeContext;
    const originalSave = context.save;
    const originalRestore = context.restore;
    context.save = () => {
      calls.push("save");
      originalSave();
    };
    context.restore = () => {
      calls.push("restore");
      originalRestore();
    };

    drawLine(page, [0, 0], [2, 0]);

    expect(calls).toEqual(["save", "restore"]);
    expect(fills).toHaveLength(3);
  });
});

describe("drawFoldLine", () => {
  it("draws a forward dashed grey [2, 2] line, offset by 3 steps, one pixel wide", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawFoldLine(page, [0, 0], [7, 0]);

    // shouldDrawDashPixel(i, [2,2], 3) for i=0..7: covered directly above;
    // re-derive the "on" indices here to keep this test independent of that
    // one rather than asserting a magic list.
    const onIndices = Array.from({ length: 8 }, (_, i) => i).filter((i) =>
      shouldDrawDashPixel(i, [2, 2], 3)
    );
    expect(fills.map((fill) => fill.x)).toEqual(onIndices);
    expect(fills.every((fill) => fill.color === "#7b7b7b")).toBe(true);
    expect(fills.every((fill) => fill.width === 1 && fill.height === 1)).toBe(
      true
    );
  });

  it("draws the identical dash pattern for a leftward fold line as for the equivalent rightward one", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawFoldLine(page, [7, 0], [0, 0]);

    // Dash position is measured from the line's own geometrically lesser
    // endpoint (x=0 here), not from array order, so a reversed call paints
    // the same physical pixels on as the "forward dashed grey [2,2] line"
    // case above -- just filled in the opposite order, since this call
    // walks from x=6 down to x=1.
    expect(fills.map((fill) => fill.x)).toEqual([6, 5, 2, 1]);
  });

  it("draws the identical dash pattern for an upward fold line as for the equivalent downward one", () => {
    const { page, fills } = makeFakeCanvasWithContext();

    drawFoldLine(page, [0, 7], [0, 0]);

    expect(fills.map((fill) => fill.y)).toEqual([6, 5, 2, 1]);
  });

  it("dash pattern is symmetric: reversing from/to paints the identical set of pixels", () => {
    const forward = makeFakeCanvasWithContext();
    drawFoldLine(forward.page, [0, 0], [7, 0]);

    const backward = makeFakeCanvasWithContext();
    drawFoldLine(backward.page, [7, 0], [0, 0]);

    const forwardSet = new Set(forward.fills.map((fill) => fill.x));
    const backwardSet = new Set(backward.fills.map((fill) => fill.x));
    expect(backwardSet).toEqual(forwardSet);
  });
});
