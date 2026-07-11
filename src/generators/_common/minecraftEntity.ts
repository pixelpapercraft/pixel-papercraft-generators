import { type Cuboid, makeCuboid, translateCuboid } from "./cuboid";
export type * from "./cuboid";

/* How the exported types look for a character:
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
*/

const cuboid = makeCuboid;
const translate = translateCuboid;

export type Spider = {
  head: Cuboid;
  thorax: Cuboid;
  abdomen: Cuboid;
  leg: Cuboid;
};

export const spider: Spider = {
  head: translate(cuboid([8, 8, 8]), [32, 4]),
  thorax: translate(cuboid([6, 6, 6]), [0, 0]),
  abdomen: translate(cuboid([10, 8, 12]), [0, 12]),
  leg: translate(cuboid([16, 2, 2]), [18, 0]),
};

export type Minecart = {
  bottom: Cuboid;
  sides: Cuboid;
};

export const minecart: Minecart = {
  bottom: translate(cuboid([20, 16, 2]), [0, 10]),
  sides: translate(cuboid([16, 8, 2]), [0, 0]),
};

export type Horse = {
  head: Cuboid;
  mouth: Cuboid;
  neck: Cuboid;
  mane: Cuboid;
  tail: Cuboid;
  horseEar: Cuboid;
  muleEar: Cuboid;
  body: Cuboid;
  leg: Cuboid;
  chest: Cuboid;
};

export const horse: Horse = {
  head: translate(cuboid([6, 5, 7]), [0, 13]),
  mouth: translate(cuboid([4, 5, 5]), [0, 25]),
  neck: translate(cuboid([4, 12, 7]), [0, 35]),
  mane: translate(cuboid([2, 16, 2]), [56, 36]),
  tail: translate(cuboid([3, 14, 4]), [42, 36]),
  horseEar: translate(cuboid([2, 2, 1]), [19, 16]),
  muleEar: translate(cuboid([2, 7, 1]), [0, 12]),
  body: translate(cuboid([10, 10, 22]), [0, 32]),
  leg: translate(cuboid([4, 11, 4]), [48, 21]),
  chest: translate(cuboid([8, 8, 3]), [26, 21]),
};

export type Banner = {
  flag: Cuboid;
  pole: Cuboid;
  bar: Cuboid;
};

export const banner: Banner = {
  flag: translate(cuboid([20, 40, 1]), [0, 0]),
  pole: translate(cuboid([2, 42, 2]), [44, 0]),
  bar: translate(cuboid([20, 2, 2]), [0, 42]),
};

export type Shield = {
  shield: Cuboid;
  handle: Cuboid;
};

export const shield: Shield = {
  shield: translate(cuboid([12, 22, 1]), [0, 0]),
  handle: translate(cuboid([2, 6, 6]), [26, 0]),
};
