import { type Rotation } from "./rotation";

export type Flip = "None" | "Horizontal" | "Vertical";

function rotationToQuarterTurns(rotation: Rotation): number {
  switch (rotation) {
    case "Rot0":
      return 0;
    case "Rot90":
      return 1;
    case "Rot180":
      return 2;
    case "Rot270":
      return 3;
  }
}

function quarterTurnsToRotation(quarterTurns: number): Rotation {
  const normalized = ((quarterTurns % 4) + 4) % 4;
  switch (normalized) {
    case 0:
      return "Rot0";
    case 1:
      return "Rot90";
    case 2:
      return "Rot180";
    case 3:
      return "Rot270";
  }
  return "Rot0";
}

function rotateBy(rotation: Rotation, quarterTurns: number, flip: Flip) {
  const current = rotationToQuarterTurns(rotation);
  const next =
    flip === "None" ? current + quarterTurns : current - quarterTurns;
  return quarterTurnsToRotation(next);
}

function getRotationOrientedFlip(flip: Flip, rotation: Rotation): Flip {
  if (rotation === "Rot90" || rotation === "Rot270") {
    switch (flip) {
      case "Horizontal":
        return "Vertical";
      case "Vertical":
        return "Horizontal";
      case "None":
        return "None";
    }
  }
  return flip;
}

export function makeNextFlip(
  current: Flip,
  flip: Flip,
  rotation: Rotation
): [Flip, Rotation] {
  let nextFlip: Flip = "None";
  let extraQuarterTurns = 0;
  const orientedFlip = getRotationOrientedFlip(flip, rotation);

  if (orientedFlip !== current) {
    if (orientedFlip === "None") {
      nextFlip = current;
    } else if (current === "None") {
      nextFlip = orientedFlip;
    } else {
      extraQuarterTurns = 2;
    }
  }

  return [nextFlip, rotateBy(rotation, extraQuarterTurns, nextFlip)];
}

export function flipToTransform(flip: Flip): string {
  switch (flip) {
    case "Horizontal":
      return "scaleX(-1)";
    case "Vertical":
      return "scaleY(-1)";
    case "None":
      return "";
  }
}

export function flipToString(flip: Flip): string {
  switch (flip) {
    case "Horizontal":
      return "Horizontal";
    case "Vertical":
      return "Vertical";
    case "None":
      return "None";
  }
}
