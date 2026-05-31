export type Rotation = "Rot0" | "Rot90" | "Rot180" | "Rot270";

export function makeNextRotation(rotation: Rotation): Rotation {
  switch (rotation) {
    case "Rot0":
      return "Rot90";
    case "Rot90":
      return "Rot180";
    case "Rot180":
      return "Rot270";
    case "Rot270":
      return "Rot0";
  }
}

export function rotationToDegrees(rotation: Rotation): number {
  switch (rotation) {
    case "Rot0":
      return 0;
    case "Rot90":
      return 90;
    case "Rot180":
      return 180;
    case "Rot270":
      return 270;
  }
}
