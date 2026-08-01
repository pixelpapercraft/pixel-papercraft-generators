import { describe, expect, it } from "vitest";
import { type Rectangle } from "../../_common/minecraft";
import { roundRectangleToPixelBounds } from "./bannerFlag";

describe("roundRectangleToPixelBounds", () => {
  it("keeps the 1/3-scale banner flag faces on touching pixel boundaries", () => {
    const faces: Rectangle[] = [
      [121.33333333333333, 128, 5.333333333333333, 213.33333333333334],
      [126.66666666666666, 128, 106.66666666666667, 213.33333333333334],
      [233.33333333333334, 128, 5.333333333333333, 213.33333333333334],
      [238.66666666666666, 128, 106.66666666666667, 213.33333333333334],
    ];

    const roundedFaces = faces.map(roundRectangleToPixelBounds);

    expect(roundedFaces).toEqual<Rectangle[]>([
      [121, 128, 6, 213],
      [127, 128, 106, 213],
      [233, 128, 6, 213],
      [239, 128, 106, 213],
    ]);
  });
});
