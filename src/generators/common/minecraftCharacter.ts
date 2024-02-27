import {
  type Cuboid,
  type Dimensions,
  type Position,
  makeCuboid,
  translateCuboid,
} from "./cuboid";

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

function cuboid(dimensions: Dimensions, position: Position): Cuboid {
  return translateCuboid(makeCuboid(dimensions), position);
}

export const steve: Character = {
  base: {
    head: cuboid([8, 8, 8], [0, 0]),
    rightArm: cuboid([4, 12, 4], [40, 16]),
    leftArm: cuboid([4, 12, 4], [32, 48]),
    body: cuboid([8, 12, 4], [16, 16]),
    rightLeg: cuboid([4, 12, 4], [0, 16]),
    leftLeg: cuboid([4, 12, 4], [16, 48]),
  },
  overlay: {
    head: cuboid([8, 8, 8], [32, 0]),
    rightArm: cuboid([4, 12, 4], [40, 32]),
    leftArm: cuboid([4, 12, 4], [48, 48]),
    body: cuboid([8, 12, 4], [16, 32]),
    rightLeg: cuboid([4, 12, 4], [0, 32]),
    leftLeg: cuboid([4, 12, 4], [0, 48]),
  },
};

export const alex: Character = {
  base: {
    head: steve.base.head,
    rightArm: cuboid([3, 12, 4], [40, 16]),
    leftArm: cuboid([3, 12, 4], [32, 48]),
    body: steve.base.body,
    rightLeg: steve.base.rightLeg,
    leftLeg: steve.base.leftLeg,
  },
  overlay: {
    head: steve.overlay.head,
    rightArm: cuboid([3, 12, 4], [40, 32]),
    leftArm: cuboid([3, 12, 4], [48, 48]),
    body: steve.overlay.body,
    rightLeg: steve.overlay.rightLeg,
    leftLeg: steve.overlay.leftLeg,
  },
};
