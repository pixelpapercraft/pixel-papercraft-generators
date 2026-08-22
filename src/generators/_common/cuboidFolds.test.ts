import { describe, expect, it, vi } from "vitest";
import { makeFakeEngine } from "@genroot/builder/engine/engine.fake";
import { Model } from "@genroot/builder/engine/model";
import { Values } from "@genroot/builder/engine/modelValues";
import { RenderContextAdapter } from "@genroot/builder/renderContextAdapter";
import { type RenderContext } from "@genroot/builder";
import { type Rectangle } from "./cuboid";
import {
  resolveCuboidFaces,
  resolveFaceVisualRectangle,
  type Dest,
  type Orientation,
} from "./minecraft";
import { drawCuboidFolds, drawRectangleFolds } from "./cuboidFolds";

type Position = [number, number];

// Ground-truth helpers shared by every "traces the real net" test below: they
// derive expected fold-line calls from `resolveCuboidFaces`'s actual face
// rectangles instead of hand-rederiving the net's pixel formulas a second
// time, which is exactly the class of mistake this file's own history
// warns about (the ported `cuboidFolds.ts` formula was only trusted after
// being checked against this same ground truth, not before).
function boundingBoxOf(rectangles: Rectangle[]): Rectangle {
  const lefts = rectangles.map(([x]) => x);
  const tops = rectangles.map(([, y]) => y);
  const rights = rectangles.map(([x, , w]) => x + w);
  const bottoms = rectangles.map(([, y, , h]) => y + h);
  const left = Math.min(...lefts);
  const top = Math.min(...tops);
  return [left, top, Math.max(...rights) - left, Math.max(...bottoms) - top];
}

function borderLinesOf([x, y, w, h]: Rectangle): [Position, Position][] {
  return [
    [
      [x, y - 1],
      [x + w, y - 1],
    ],
    [
      [x + w, y],
      [x + w, y + h],
    ],
    [
      [x + w, y + h],
      [x, y + h],
    ],
    [
      [x - 1, y + h],
      [x - 1, y],
    ],
  ];
}

// The one seam each orientation's two bounding-box rectangles don't already
// cover as one of their own 4 border edges (see the file-level comment on
// each orientation's test for which two faces it falls between). Found by
// locating the two rectangles' shared edge directly, rather than hardcoding
// the implementation's own `-1`/`+0` offset convention a second time — that
// convention differs between orientations (confirmed below), so re-deriving
// it here would risk encoding the same guess twice instead of checking it.
function sharedSeam(
  a: Rectangle,
  b: Rectangle
): { axis: "x" | "y"; coord: number; range: [number, number] } {
  const [ax, ay, aw, ah] = a;
  const [bx, by, bw, bh] = b;
  const close = (p: number, q: number) => Math.abs(p - q) < 1e-6;

  if (close(ax + aw, bx)) {
    return {
      axis: "x",
      coord: ax + aw,
      range: [Math.max(ay, by), Math.min(ay + ah, by + bh)],
    };
  }
  if (close(bx + bw, ax)) {
    return {
      axis: "x",
      coord: bx + bw,
      range: [Math.max(ay, by), Math.min(ay + ah, by + bh)],
    };
  }
  if (close(ay + ah, by)) {
    return {
      axis: "y",
      coord: ay + ah,
      range: [Math.max(ax, bx), Math.min(ax + aw, bx + bw)],
    };
  }
  if (close(by + bh, ay)) {
    return {
      axis: "y",
      coord: by + bh,
      range: [Math.max(ax, bx), Math.min(ax + aw, bx + bw)],
    };
  }
  throw new Error("faces are not adjacent along a shared edge");
}

// Confirms a drawn line sits within 1px of a real shared seam and spans it
// (not just touches a corner) — the 1px tolerance covers the `-1`/`+0`
// offset conventions `drawRectangleFolds`'s own edges use, without assuming
// which one applies to this particular seam.
function expectLineOnSeam(
  [p1, p2]: [Position, Position],
  seam: { axis: "x" | "y"; coord: number; range: [number, number] }
) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  if (seam.axis === "x") {
    expect(Math.abs(x1 - seam.coord)).toBeLessThanOrEqual(1);
    expect(Math.abs(x2 - seam.coord)).toBeLessThanOrEqual(1);
    expect([y1, y2].sort((a, b) => a - b)).toEqual(seam.range);
  } else {
    expect(Math.abs(y1 - seam.coord)).toBeLessThanOrEqual(1);
    expect(Math.abs(y2 - seam.coord)).toBeLessThanOrEqual(1);
    expect([x1, x2].sort((a, b) => a - b)).toEqual(seam.range);
  }
}

// Builds the real, orientation-only physical net (center always "Front" —
// see `adjustDimensionsForCenter`'s doc comment: `center` only relabels
// which rectangle plays which role, it never moves one) and checks
// `drawCuboidFolds`'s first 8 calls (the two bounding-box borders) plus its
// 9th (the one seam neither border covers) all land on real face edges.
function expectFoldsTraceRealNet(
  drawFoldLine: ReturnType<typeof vi.spyOn>,
  position: Position,
  physicalDimensions: [number, number, number],
  orientation: Orientation,
  columnFaces: (keyof Dest)[],
  rowFaces: (keyof Dest)[],
  extraSeamFaces: [keyof Dest, keyof Dest]
) {
  const dest = resolveCuboidFaces(position, physicalDimensions, {
    orientation,
    center: "Front",
  });
  const visualRectangleOf = (face: keyof Dest) =>
    resolveFaceVisualRectangle(dest[face]);

  const columnBox = boundingBoxOf(columnFaces.map(visualRectangleOf));
  const rowBox = boundingBoxOf(rowFaces.map(visualRectangleOf));
  const expectedCalls = [...borderLinesOf(columnBox), ...borderLinesOf(rowBox)];
  expect(drawFoldLine.mock.calls.slice(0, 8)).toEqual(expectedCalls);

  const [faceA, faceB] = extraSeamFaces;
  const seam = sharedSeam(visualRectangleOf(faceA), visualRectangleOf(faceB));
  expect(drawFoldLine.mock.calls[8]).toHaveLength(2);
  expectLineOnSeam(drawFoldLine.mock.calls[8] as [Position, Position], seam);
}

// A real RenderContext (RenderContextAdapter over a fake Engine) rather than a
// cast partial object: drawFoldLine ultimately touches a canvas, unavailable
// under Vitest's Node environment, so it's spied and stubbed per test.
function makeRenderContext(): {
  ctx: RenderContext;
  drawFoldLine: ReturnType<typeof vi.spyOn>;
} {
  const engine = makeFakeEngine();
  const drawFoldLine = vi
    .spyOn(engine, "drawFoldLine")
    .mockImplementation(() => {});
  const ctx = new RenderContextAdapter(
    engine,
    new Model(new Values()),
    undefined
  );
  return { ctx, drawFoldLine };
}

describe("cuboidFolds", () => {
  it("draws rectangle folds around the rectangle edges", () => {
    const { ctx, drawFoldLine } = makeRenderContext();

    drawRectangleFolds(ctx, [10, 20, 30, 40]);

    expect(drawFoldLine).toHaveBeenCalledTimes(4);
    expect(drawFoldLine).toHaveBeenNthCalledWith(1, [10, 19], [40, 19]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(2, [40, 20], [40, 60]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(3, [40, 60], [10, 60]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(4, [9, 60], [9, 20]);
  });

  it("draws the west-facing cuboid fold layout by default", () => {
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, [10, 20], [30, 40, 50]);

    expect(drawFoldLine).toHaveBeenCalledTimes(9);
    expect(drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(5, [10, 69], [170, 69]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(9, [139, 70], [139, 110]);
  });

  it("draws the east-facing cuboid fold layout", () => {
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, [10, 20], [30, 40, 50], {
      orientation: "East",
    });

    expect(drawFoldLine).toHaveBeenCalledTimes(9);
    expect(drawFoldLine).toHaveBeenNthCalledWith(1, [90, 19], [120, 19]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(9, [40, 70], [40, 110]);
  });

  it("draws the north-facing cuboid fold layout", () => {
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, [10, 20], [30, 40, 50], {
      orientation: "North",
    });

    expect(drawFoldLine).toHaveBeenCalledTimes(9);
    expect(drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(5, [10, 69], [140, 69]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(9, [60, 159], [90, 159]);
  });

  it("draws the south-facing cuboid fold layout", () => {
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, [10, 20], [30, 40, 50], {
      orientation: "South",
    });

    expect(drawFoldLine).toHaveBeenCalledTimes(9);
    expect(drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(5, [10, 109], [140, 109]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(9, [60, 60], [90, 60]);
  });

  // The four tests below mirror `cuboidTabs.test.ts`'s geometry-anchored
  // coverage (real `resolveCuboidFaces` output, not hardcoded numbers) across
  // the same orientations it checks, closing the gap where folds previously
  // had only one such test (the Bottom+North crossbar case further below).
  // Each orientation's column/row face grouping and its one "extra" seam are
  // read directly off `minecraft.ts`'s `makeDest` for that orientation.

  it("traces the real West-oriented net (default orientation/center)", () => {
    const position: Position = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions);

    expectFoldsTraceRealNet(
      drawFoldLine,
      position,
      dimensions,
      "West",
      ["top", "front", "bottom"],
      ["right", "front", "left", "back"],
      ["left", "back"]
    );
  });

  it("traces the real East-oriented net", () => {
    const position: Position = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions, { orientation: "East" });

    expectFoldsTraceRealNet(
      drawFoldLine,
      position,
      dimensions,
      "East",
      ["top", "front", "bottom"],
      ["back", "right", "front", "left"],
      ["back", "right"]
    );
  });

  it("traces the real North-oriented net (Front center)", () => {
    const position: Position = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions, { orientation: "North" });

    expectFoldsTraceRealNet(
      drawFoldLine,
      position,
      dimensions,
      "North",
      ["top", "front", "bottom", "back"],
      ["right", "front", "left"],
      ["bottom", "back"]
    );
  });

  it("traces the real South-oriented net", () => {
    const position: Position = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions, { orientation: "South" });

    expectFoldsTraceRealNet(
      drawFoldLine,
      position,
      dimensions,
      "South",
      ["back", "top", "front", "bottom"],
      ["right", "front", "left"],
      ["back", "top"]
    );
  });

  it("applies the same w/h/d swap a Right- or Left-centered Minecraft.drawCuboid call uses", () => {
    // `center` never moves a resolved face's rectangle (only which content
    // lands in a fixed slot) — the only thing that changes where the net's
    // lines fall is the same dimension swap `adjustDimensionsForCenter`
    // applies. So a Right/Left-centered call with dimensions [w,h,d] must
    // draw identically to an uncentered call with the pre-swapped [d,h,w].
    const withCenter = makeRenderContext();
    drawCuboidFolds(withCenter.ctx, [10, 20], [30, 40, 50], {
      center: "Right",
    });

    const preSwapped = makeRenderContext();
    drawCuboidFolds(preSwapped.ctx, [10, 20], [50, 40, 30]);

    expect(withCenter.drawFoldLine.mock.calls).toEqual(
      preSwapped.drawFoldLine.mock.calls
    );
  });

  it("leaves the default West layout unchanged for Front/Back center (identity swap)", () => {
    const front = makeRenderContext();
    drawCuboidFolds(front.ctx, [10, 20], [30, 40, 50], { center: "Front" });

    const noCenter = makeRenderContext();
    drawCuboidFolds(noCenter.ctx, [10, 20], [30, 40, 50]);

    expect(front.drawFoldLine.mock.calls).toEqual(
      noCenter.drawFoldLine.mock.calls
    );
  });

  it("applies the same w/h/d swap a Top- or Bottom-centered Minecraft.drawCuboid call uses", () => {
    const withCenter = makeRenderContext();
    drawCuboidFolds(withCenter.ctx, [10, 20], [30, 40, 50], {
      center: "Bottom",
    });

    const preSwapped = makeRenderContext();
    drawCuboidFolds(preSwapped.ctx, [10, 20], [30, 50, 40]);

    expect(withCenter.drawFoldLine.mock.calls).toEqual(
      preSwapped.drawFoldLine.mock.calls
    );
  });

  // `center` only ever relabels which already-built physical rectangle plays
  // which semantic role (`front`, `back`, ...); it never moves a rectangle.
  // So the *physical* net a Bottom-centered, North-oriented cuboid folds
  // into — the banner crossbar's real configuration — is the plain
  // North-oriented net built from the center-adjusted dimensions, still
  // labelled by their pre-relabel (orientation-only) role. This anchors the
  // fold lines to that ground truth directly, rather than only checking the
  // implementation is self-consistent with its own dimension swap.
  it("traces the real Bottom-centered, North-oriented net (the banner crossbar's configuration)", () => {
    const position: Position = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions, {
      orientation: "North",
      center: "Bottom",
    });

    const physicalDimensions: [number, number, number] = [30, 50, 40];
    expectFoldsTraceRealNet(
      drawFoldLine,
      position,
      physicalDimensions,
      "North",
      ["top", "front", "bottom", "back"],
      ["right", "front", "left"],
      ["bottom", "back"]
    );
  });
});
