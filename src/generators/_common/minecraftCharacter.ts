import { type Cuboid, makeCuboid, translateCuboid } from "./cuboid";

export type * from "./cuboid";

export type Layer = {
  head: Cuboid;
  rightArm: Cuboid;
  leftArm: Cuboid;
  body: Cuboid;
  rightLeg: Cuboid;
  leftLeg: Cuboid;
};

export type Character = {
  base: Layer;
  overlay: Layer;
};

const cuboid = makeCuboid;
const translate = translateCuboid;

export const steve: Character = {
  base: {
    head: translate(cuboid([8, 8, 8]), [0, 0]),
    rightArm: translate(cuboid([4, 12, 4]), [40, 16]),
    leftArm: translate(cuboid([4, 12, 4]), [32, 48]),
    body: translate(cuboid([8, 12, 4]), [16, 16]),
    rightLeg: translate(cuboid([4, 12, 4]), [0, 16]),
    leftLeg: translate(cuboid([4, 12, 4]), [16, 48]),
  },
  overlay: {
    head: translate(cuboid([8, 8, 8]), [32, 0]),
    rightArm: translate(cuboid([4, 12, 4]), [40, 32]),
    leftArm: translate(cuboid([4, 12, 4]), [48, 48]),
    body: translate(cuboid([8, 12, 4]), [16, 32]),
    rightLeg: translate(cuboid([4, 12, 4]), [0, 32]),
    leftLeg: translate(cuboid([4, 12, 4]), [0, 48]),
  },
};

export const alex: Character = {
  base: {
    head: steve.base.head,
    rightArm: translate(cuboid([3, 12, 4]), [40, 16]),
    leftArm: translate(cuboid([3, 12, 4]), [32, 48]),
    body: steve.base.body,
    rightLeg: steve.base.rightLeg,
    leftLeg: steve.base.leftLeg,
  },
  overlay: {
    head: steve.overlay.head,
    rightArm: translate(cuboid([3, 12, 4]), [40, 32]),
    leftArm: translate(cuboid([3, 12, 4]), [48, 48]),
    body: steve.overlay.body,
    rightLeg: steve.overlay.rightLeg,
    leftLeg: steve.overlay.leftLeg,
  },
};
