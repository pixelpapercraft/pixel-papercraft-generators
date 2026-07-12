import { describe, expect, it, vi } from "vitest";
import { type Generator } from "@genroot/builder/modules/generator";
import { makeFakeGenerator } from "@genroot/builder/modules/generator.fake";
import { drawCuboidTabs, getDioramaEdgeTabThickness } from "./cuboidTabs";

function makeGenerator(): Generator {
  const generator = makeFakeGenerator();
  vi.spyOn(generator, "drawTab").mockImplementation(() => {});
  return generator;
}

describe("cuboidTabs", () => {
  it("uses the diorama edge tab thickness rule", () => {
    expect(getDioramaEdgeTabThickness(168, 168)).toBe(32);
    expect(getDioramaEdgeTabThickness(128, 16)).toBe(8);
  });

  it("draws default tabs on the right, left, and back faces", () => {
    const generator = makeGenerator();

    drawCuboidTabs(generator, [10, 20], [30, 40, 50]);

    expect(generator.drawTab).toHaveBeenCalledTimes(7);
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      1,
      [10, 57.5, 50, 12.5],
      "North",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      2,
      [10, 110, 50, 12.5],
      "South",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      3,
      [-2.5, 70, 12.5, 40],
      "West",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      6,
      [140, 57.5, 30, 12.5],
      "North",
      false,
      45
    );
  });

  it("keeps small cuboid tabs proportional to their face", () => {
    const generator = makeGenerator();

    drawCuboidTabs(generator, [10, 20], [4, 8, 4]);

    expect(generator.drawTab).toHaveBeenNthCalledWith(
      1,
      [10, 23, 4, 1],
      "North",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      3,
      [9, 24, 1, 8],
      "West",
      false,
      45
    );
  });

  it("matches diorama tab thickness when a larger base size is provided", () => {
    const generator = makeGenerator();

    drawCuboidTabs(generator, [10, 20], [30, 40, 50], {
      baseDimensions: [128, 128, 128],
    });

    expect(generator.drawTab).toHaveBeenNthCalledWith(
      1,
      [10, 45, 50, 25],
      "North",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      3,
      [-15, 70, 25, 40],
      "West",
      false,
      45
    );
    expect(generator.drawTab).toHaveBeenNthCalledWith(
      6,
      [140, 45, 30, 25],
      "North",
      false,
      45
    );
  });

  it("supports custom placements and tab options", () => {
    const generator = makeGenerator();

    drawCuboidTabs(generator, [10, 20], [30, 40, 50], {
      placements: [{ face: "back", edge: "Right" }],
      showFoldLine: true,
      tabAngle: 60,
    });

    expect(generator.drawTab).toHaveBeenCalledTimes(1);
    expect(generator.drawTab).toHaveBeenCalledWith(
      [170, 70, 7.5, 40],
      "East",
      true,
      60
    );
  });
});
