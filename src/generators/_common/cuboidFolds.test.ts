import { describe, expect, it, vi } from "vitest";
import { type Generator } from "@genroot/builder/modules/generator";
import { makeFakeGenerator } from "@genroot/builder/modules/generator.fake";
import { drawCuboidFolds, drawRectangleFolds } from "./cuboidFolds";

function makeGenerator(): Generator {
  const generator = makeFakeGenerator();
  vi.spyOn(generator, "drawFoldLine").mockImplementation(() => {});
  return generator;
}

describe("cuboidFolds", () => {
  it("draws rectangle folds around the rectangle edges", () => {
    const generator = makeGenerator();

    drawRectangleFolds(generator, [10, 20, 30, 40]);

    expect(generator.drawFoldLine).toHaveBeenCalledTimes(4);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(1, [10, 19], [40, 19]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(2, [40, 20], [40, 60]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(3, [39, 60], [10, 60]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(4, [9, 59], [9, 20]);
  });

  it("draws the west-facing cuboid fold layout by default", () => {
    const generator = makeGenerator();

    drawCuboidFolds(generator, [10, 20], [30, 40, 50]);

    expect(generator.drawFoldLine).toHaveBeenCalledTimes(9);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      5,
      [10, 69],
      [170, 69]
    );
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      9,
      [139, 70],
      [139, 110]
    );
  });

  it("draws the east-facing cuboid fold layout", () => {
    const generator = makeGenerator();

    drawCuboidFolds(generator, [10, 20], [30, 40, 50], {
      orientation: "East",
    });

    expect(generator.drawFoldLine).toHaveBeenCalledTimes(9);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(1, [90, 19], [120, 19]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(9, [40, 70], [40, 110]);
  });

  it("draws the north-facing cuboid fold layout", () => {
    const generator = makeGenerator();

    drawCuboidFolds(generator, [10, 20], [30, 40, 50], {
      orientation: "North",
    });

    expect(generator.drawFoldLine).toHaveBeenCalledTimes(9);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      5,
      [10, 69],
      [140, 69]
    );
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      9,
      [60, 159],
      [90, 159]
    );
  });

  it("draws the south-facing cuboid fold layout", () => {
    const generator = makeGenerator();

    drawCuboidFolds(generator, [10, 20], [30, 40, 50], {
      orientation: "South",
    });

    expect(generator.drawFoldLine).toHaveBeenCalledTimes(9);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(1, [60, 19], [90, 19]);
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      5,
      [10, 109],
      [140, 109]
    );
    expect(generator.drawFoldLine).toHaveBeenNthCalledWith(
      9,
      [60, 60],
      [90, 60]
    );
  });
});
