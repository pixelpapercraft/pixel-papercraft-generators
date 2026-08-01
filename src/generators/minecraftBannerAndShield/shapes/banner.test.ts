import { describe, expect, it } from "vitest";
import { type Rectangle } from "../../_common/minecraft";
import { roundRectangleToPixelBounds } from "./banner";

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

  it("keeps the 1/3-scale banner pole faces on touching pixel boundaries", () => {
    const faces: Rectangle[] = [
      [
        430.66666666666663, 117.33333333333333, 10.666666666666666,
        234.66666666666666,
      ],
      [
        441.3333333333333, 117.33333333333333, 10.666666666666666,
        234.66666666666666,
      ],
      [
        451.99999999999994, 117.33333333333333, 10.666666666666666,
        234.66666666666666,
      ],
      [
        462.66666666666663, 117.33333333333333, 10.666666666666666,
        234.66666666666666,
      ],
    ];

    const roundedFaces = faces.map(roundRectangleToPixelBounds);

    expect(roundedFaces).toEqual<Rectangle[]>([
      [431, 117, 10, 235],
      [441, 117, 11, 235],
      [452, 117, 11, 235],
      [463, 117, 10, 235],
    ]);
  });
});
