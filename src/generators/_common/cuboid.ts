// W = Width
// H = Height
// D = Depth
//
// (0,0)
//   .         +----W----+
//             |         |
//             D   Top   D
//             |         |
//   +----D----+----W----+----D----+----W----+
//   |         |         |         |         |
//   H  Right  H  Front  H  Left   H  Back   H
//   |         |         |         |         |
//   +----D----+----W----+----D----+----W----+
//             |         |
//             D Bottom  D
//             |         |
//             +----W----+
//

type X = number;
type Y = number;
type Width = number;
type Height = number;
type Depth = number;

/** [x, y, width, height] */
export type Rectangle = [X, Y, Width, Height];

/** [width, height, depth] */
export type Dimensions = [Width, Height, Depth];

/** [x, y] */
export type Position = [X, Y];

export type Cuboid = {
  front: Rectangle;
  back: Rectangle;
  top: Rectangle;
  bottom: Rectangle;
  right: Rectangle;
  left: Rectangle;
};

export function makeCuboid([w, h, d]: Dimensions): Cuboid {
  return {
    top: [d, 0, w, d],
    bottom: [d + w, 0, w, d],
    front: [d, d, w, h],
    right: [0, d, d, h],
    left: [d + w, d, d, h],
    back: [d * 2 + w, d, w, h],
  };
}

export function translateRectangle(
  [x, y, w, h]: Rectangle,
  [ox, oy]: Position
): Rectangle {
  return [x + ox, y + oy, w, h];
}

export function translateCuboid(source: Cuboid, position: Position): Cuboid {
  return {
    front: translateRectangle(source.front, position),
    back: translateRectangle(source.back, position),
    top: translateRectangle(source.top, position),
    bottom: translateRectangle(source.bottom, position),
    right: translateRectangle(source.right, position),
    left: translateRectangle(source.left, position),
  };
}
