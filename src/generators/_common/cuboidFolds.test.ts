import { describe, expect, it, vi } from "vitest";
import { makeFakeEngine } from "@genroot/builder/engine/engine.fake";
import { Model } from "@genroot/builder/engine/model";
import { Values } from "@genroot/builder/engine/modelValues";
import { RenderContextAdapter } from "@genroot/builder/renderContextAdapter";
import { type RenderContext } from "@genroot/builder";
import { type Rectangle } from "./cuboid";
import { resolveCuboidFaces, resolveFaceVisualRectangle } from "./minecraft";
import { drawCuboidFolds, drawRectangleFolds } from "./cuboidFolds";

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
    expect(drawFoldLine).toHaveBeenNthCalledWith(3, [40, 61], [10, 61]);
    expect(drawFoldLine).toHaveBeenNthCalledWith(4, [10, 60], [10, 20]);
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
    const position: [number, number] = [10, 20];
    const dimensions: [number, number, number] = [30, 40, 50];
    const { ctx, drawFoldLine } = makeRenderContext();

    drawCuboidFolds(ctx, position, dimensions, {
      orientation: "North",
      center: "Bottom",
    });

    const physicalDimensions: [number, number, number] = [30, 50, 40];
    const dest = resolveCuboidFaces(position, physicalDimensions, {
      orientation: "North",
      center: "Front",
    });
    const visualRectangleOf = (face: keyof typeof dest) =>
      resolveFaceVisualRectangle(dest[face]);
    const boundingBoxOf = (rectangles: Rectangle[]): Rectangle => {
      const lefts = rectangles.map(([x]) => x);
      const tops = rectangles.map(([, y]) => y);
      const rights = rectangles.map(([x, , w]) => x + w);
      const bottoms = rectangles.map(([, y, , h]) => y + h);
      const left = Math.min(...lefts);
      const top = Math.min(...tops);
      return [
        left,
        top,
        Math.max(...rights) - left,
        Math.max(...bottoms) - top,
      ];
    };
    const columnBox = boundingBoxOf(
      ["top", "front", "bottom", "back"].map((face) =>
        visualRectangleOf(face as keyof typeof dest)
      )
    );
    const rowBox = boundingBoxOf(
      ["right", "front", "left"].map((face) =>
        visualRectangleOf(face as keyof typeof dest)
      )
    );
    const borderLinesOf = ([x, y, w, h]: Rectangle) => [
      [
        [x, y - 1],
        [x + w, y - 1],
      ],
      [
        [x + w, y],
        [x + w, y + h],
      ],
      [
        [x + w, y + h + 1],
        [x, y + h + 1],
      ],
      [
        [x, y + h],
        [x, y],
      ],
    ];

    // The implementation draws the column border, then the row border, then
    // one extra internal seam line — same order asserted by the West/East/
    // North/South-layout tests above.
    const expectedCalls = [
      ...borderLinesOf(columnBox),
      ...borderLinesOf(rowBox),
    ];
    expect(drawFoldLine.mock.calls.slice(0, 8)).toEqual(expectedCalls);
  });
});
