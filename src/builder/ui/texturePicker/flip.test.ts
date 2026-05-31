import { describe, expect, it } from "vitest";
import { flipToTransform, flipForRotation, makeNextFlip } from "./flip";

type Rotation = "Rot0" | "Rot90" | "Rot180" | "Rot270";
type Flip = "None" | "Horizontal" | "Vertical";

const rotations: Rotation[] = ["Rot0", "Rot90", "Rot180", "Rot270"];
const flips: Flip[] = ["None", "Horizontal", "Vertical"];

const rotationMatrices = {
  Rot0: [
    [1, 0],
    [0, 1],
  ],
  Rot90: [
    [0, -1],
    [1, 0],
  ],
  Rot180: [
    [-1, 0],
    [0, -1],
  ],
  Rot270: [
    [0, 1],
    [-1, 0],
  ],
} as const;

const flipMatrices = {
  None: [
    [1, 0],
    [0, 1],
  ],
  Horizontal: [
    [-1, 0],
    [0, 1],
  ],
  Vertical: [
    [1, 0],
    [0, -1],
  ],
} as const;

function multiply(
  a: readonly [readonly [number, number], readonly [number, number]],
  b: readonly [readonly [number, number], readonly [number, number]]
): [[number, number], [number, number]] {
  return [
    [
      a[0][0] * b[0][0] + a[0][1] * b[1][0],
      a[0][0] * b[0][1] + a[0][1] * b[1][1],
    ],
    [
      a[1][0] * b[0][0] + a[1][1] * b[1][0],
      a[1][0] * b[0][1] + a[1][1] * b[1][1],
    ],
  ];
}

function matricesEqual(
  a: [[number, number], [number, number]],
  b: [[number, number], [number, number]]
): boolean {
  return a.every((row, rowIndex) =>
    row.every((value, columnIndex) => value === b[rowIndex]![columnIndex]!)
  );
}

function matrixForState(flip: Flip, rotation: Rotation) {
  return multiply(rotationMatrices[rotation], flipMatrices[flip]);
}

function expectedNextMatrix(
  current: Flip,
  requestedFlip: Flip,
  rotation: Rotation
): [[number, number], [number, number]] {
  const currentMatrix = matrixForState(current, rotation);
  return multiply(flipMatrices[requestedFlip], currentMatrix);
}

describe("makeNextFlip", () => {
  it("matches the transform model for every rotation, current flip, and button press", () => {
    for (const rotation of rotations) {
      for (const current of flips) {
        for (const requestedFlip of ["Horizontal", "Vertical"] as const) {
          const [nextFlip, nextRotation] = makeNextFlip(
            current,
            requestedFlip,
            rotation
          );

          expect(
            matricesEqual(
              matrixForState(nextFlip, nextRotation),
              expectedNextMatrix(current, requestedFlip, rotation)
            )
          ).toBe(true);
        }
      }
    }
  });

  it("preserves the visual transform when the same flip button is pressed twice", () => {
    for (const rotation of rotations) {
      for (const current of flips) {
        for (const requestedFlip of ["Horizontal", "Vertical"] as const) {
          const once = makeNextFlip(current, requestedFlip, rotation);
          const twice = makeNextFlip(once[0], requestedFlip, once[1]);

          expect(
            matricesEqual(
              matrixForState(twice[0], twice[1]),
              matrixForState(current, rotation)
            )
          ).toBe(true);
        }
      }
    }
  });
});

describe("flipForRotation", () => {
  it("swaps flips for quarter-turn rotations", () => {
    for (const rotation of rotations) {
      const expected =
        rotation === "Rot90" || rotation === "Rot270"
          ? {
              None: "None",
              Horizontal: "Vertical",
              Vertical: "Horizontal",
            }
          : {
              None: "None",
              Horizontal: "Horizontal",
              Vertical: "Vertical",
            };

      for (const flip of flips) {
        expect(flipForRotation(flip, rotation)).toBe(expected[flip]);
      }
    }
  });
});

describe("flipToTransform", () => {
  it("maps flip states to CSS transforms", () => {
    expect(flipToTransform("None")).toBe("");
    expect(flipToTransform("Horizontal")).toBe("scaleX(-1)");
    expect(flipToTransform("Vertical")).toBe("scaleY(-1)");
  });
});
