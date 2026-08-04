import { describe, expect, it } from "vitest";
import { type Rectangle } from "../../_common/minecraft";
import {
  roundDestinationRectangle,
  roundRectangleToPixelBounds,
} from "./shared";

describe("roundRectangleToPixelBounds", () => {
  it("keeps the banner flag's touching faces on shared pixel boundaries", () => {
    // Raw coordinates captured directly from drawCuboid's output for the
    // flag's real position/dimensions, in face order right/front/left/back.
    const right: Rectangle = [113.75, 120, 5, 200];
    const front: Rectangle = [118.75, 120, 100, 200];
    const left: Rectangle = [218.75, 120, 5, 200];
    const back: Rectangle = [223.75, 120, 100, 200];

    expect([right, front, left, back].map(roundRectangleToPixelBounds)).toEqual<
      Rectangle[]
    >([
      [114, 120, 5, 200],
      [119, 120, 100, 200],
      [219, 120, 5, 200],
      [224, 120, 100, 200],
    ]);
  });

  it("keeps the banner pole's touching faces on shared pixel boundaries", () => {
    const right: Rectangle = [403.75, 110, 10, 210];
    const front: Rectangle = [413.75, 110, 10, 210];
    const left: Rectangle = [423.75, 110, 10, 210];
    const back: Rectangle = [433.75, 110, 10, 210];

    expect([right, front, left, back].map(roundRectangleToPixelBounds)).toEqual<
      Rectangle[]
    >([
      [404, 110, 10, 210],
      [414, 110, 10, 210],
      [424, 110, 10, 210],
      [434, 110, 10, 210],
    ]);
  });

  it("keeps the crossbar's front/bottom and top/back edges touching", () => {
    // center: "Bottom" and orientation: "North" (the crossbar's own options)
    // route front/bottom/top through the layout's center-adjustment math,
    // unlike the flag and pole above which only translate.
    const front: Rectangle = [171.25, 35, 100, 10];
    const bottom: Rectangle = [171.25, 45, 100, 10];
    const top: Rectangle = [171.25, 65, 100, 10];

    const roundedFront = roundRectangleToPixelBounds(front);
    const roundedBottom = roundRectangleToPixelBounds(bottom);
    const roundedTop = roundRectangleToPixelBounds(top);

    expect(roundedFront).toEqual<Rectangle>([171, 35, 100, 10]);
    expect(roundedBottom).toEqual<Rectangle>([171, 45, 100, 10]);
    expect(roundedTop).toEqual<Rectangle>([171, 65, 100, 10]);

    // front's bottom edge meets bottom's top edge.
    expect(roundedFront[1] + roundedFront[3]).toBe(roundedBottom[1]);
  });
});

describe("roundDestinationRectangle", () => {
  it("is a no-op wrapper around roundRectangleToPixelBounds for an unrotated face", () => {
    const front: Rectangle = [171.25, 35, 100, 10];

    expect(roundDestinationRectangle(front, 0)).toEqual(
      roundRectangleToPixelBounds(front)
    );
  });

  it("keeps a 90/270-rotated face's exactly-square raw size square after rounding", () => {
    // The crossbar's left/right end-cap faces are built exactly square
    // before rounding, and each is rotated 90 or 270 degrees at render
    // time. Rounding the declared rectangle from absolute edges (as
    // roundRectangleToPixelBounds does) rounds width and height
    // independently based on each edge's own fractional offset, and can
    // desync them even when the raw values are identical.
    const left: Rectangle = [281.25, 45, 10, 10];
    const right: Rectangle = [161.25, 55, 10, 10];

    expect(roundDestinationRectangle(left, 90)).toEqual<Rectangle>([
      281, 45, 10, 10,
    ]);
    expect(roundDestinationRectangle(right, 270)).toEqual<Rectangle>([
      161, 55, 10, 10,
    ]);
  });

  it("aligns a 180-rotated face's shifted edge with its unrotated neighbours", () => {
    // The renderer draws a rotate: 180 face shifted up-left by its own
    // declared width/height, so back's declared rectangle must match
    // front/bottom/top's width/height exactly for its shifted edge to
    // land in the same place theirs do.
    const back: Rectangle = [271.25, 65, 100, 10];

    expect(roundDestinationRectangle(back, 180)).toEqual<Rectangle>([
      271, 65, 100, 10,
    ]);

    // front's declared left edge (171) is where back's shifted rectangle
    // (declared x=271, width=100) actually lands: 271 - 100 = 171.
    const [backX, , backWidth] = roundDestinationRectangle(back, 180);
    expect(backX - backWidth).toBe(171);
  });
});
