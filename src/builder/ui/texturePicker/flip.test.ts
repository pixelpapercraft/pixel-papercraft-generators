import { describe, expect, it } from "vitest";
import { flipToTransform, makeNextFlip } from "./flip";

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
    row.every(
      (value, columnIndex) => value === b[rowIndex]![columnIndex]!
    )
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
  it("returns the expected tuple for every rotation, current flip, and button press", () => {
    const cases: Array<{
      rotation: Rotation;
      current: Flip;
      requestedFlip: Exclude<Flip, "None">;
      expected: [Flip, Rotation];
    }> = [
      { rotation: "Rot0", current: "None", requestedFlip: "Horizontal", expected: ["Horizontal", "Rot0"] },
      { rotation: "Rot0", current: "None", requestedFlip: "Vertical", expected: ["Vertical", "Rot0"] },
      { rotation: "Rot0", current: "Horizontal", requestedFlip: "Horizontal", expected: ["None", "Rot0"] },
      { rotation: "Rot0", current: "Horizontal", requestedFlip: "Vertical", expected: ["None", "Rot180"] },
      { rotation: "Rot0", current: "Vertical", requestedFlip: "Horizontal", expected: ["None", "Rot180"] },
      { rotation: "Rot0", current: "Vertical", requestedFlip: "Vertical", expected: ["None", "Rot0"] },
      { rotation: "Rot90", current: "None", requestedFlip: "Horizontal", expected: ["Vertical", "Rot90"] },
      { rotation: "Rot90", current: "None", requestedFlip: "Vertical", expected: ["Horizontal", "Rot90"] },
      { rotation: "Rot90", current: "Horizontal", requestedFlip: "Horizontal", expected: ["None", "Rot270"] },
      { rotation: "Rot90", current: "Horizontal", requestedFlip: "Vertical", expected: ["None", "Rot90"] },
      { rotation: "Rot90", current: "Vertical", requestedFlip: "Horizontal", expected: ["None", "Rot90"] },
      { rotation: "Rot90", current: "Vertical", requestedFlip: "Vertical", expected: ["None", "Rot270"] },
      { rotation: "Rot180", current: "None", requestedFlip: "Horizontal", expected: ["Horizontal", "Rot180"] },
      { rotation: "Rot180", current: "None", requestedFlip: "Vertical", expected: ["Vertical", "Rot180"] },
      { rotation: "Rot180", current: "Horizontal", requestedFlip: "Horizontal", expected: ["None", "Rot180"] },
      { rotation: "Rot180", current: "Horizontal", requestedFlip: "Vertical", expected: ["None", "Rot0"] },
      { rotation: "Rot180", current: "Vertical", requestedFlip: "Horizontal", expected: ["None", "Rot0"] },
      { rotation: "Rot180", current: "Vertical", requestedFlip: "Vertical", expected: ["None", "Rot180"] },
      { rotation: "Rot270", current: "None", requestedFlip: "Horizontal", expected: ["Vertical", "Rot270"] },
      { rotation: "Rot270", current: "None", requestedFlip: "Vertical", expected: ["Horizontal", "Rot270"] },
      { rotation: "Rot270", current: "Horizontal", requestedFlip: "Horizontal", expected: ["None", "Rot90"] },
      { rotation: "Rot270", current: "Horizontal", requestedFlip: "Vertical", expected: ["None", "Rot270"] },
      { rotation: "Rot270", current: "Vertical", requestedFlip: "Horizontal", expected: ["None", "Rot270"] },
      { rotation: "Rot270", current: "Vertical", requestedFlip: "Vertical", expected: ["None", "Rot90"] },
    ];

    for (const { rotation, current, requestedFlip, expected } of cases) {
      expect(makeNextFlip(current, requestedFlip, rotation)).toEqual(expected);
    }
  });

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

  it("maps flip states to CSS transforms", () => {
    expect(flipToTransform("None")).toBe("");
    expect(flipToTransform("Horizontal")).toBe("scaleX(-1)");
    expect(flipToTransform("Vertical")).toBe("scaleY(-1)");
  });
});
