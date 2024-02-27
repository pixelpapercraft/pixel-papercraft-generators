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

export type RectangleLegacy = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CuboidLegacy = {
  top: RectangleLegacy;
  bottom: RectangleLegacy;
  front: RectangleLegacy;
  right: RectangleLegacy;
  left: RectangleLegacy;
  back: RectangleLegacy;
};

export function makeCuboidLegacy(
  width: number,
  height: number,
  depth: number
): CuboidLegacy {
  return {
    top: { x: depth, y: 0, w: width, h: depth },
    bottom: { x: depth + width, y: 0, w: width, h: depth },
    front: { x: depth, y: depth, w: width, h: height },
    right: { x: 0, y: depth, w: depth, h: height },
    left: { x: depth + width, y: depth, w: depth, h: height },
    back: { x: depth * 2 + width, y: depth, w: width, h: height },
  };
}

export function translateLegacyRectangle(
  rectangle: RectangleLegacy,
  xTranslate: number,
  yTranslate: number
): RectangleLegacy {
  const { x, y, w, h } = rectangle;
  return { x: x + xTranslate, y: y + yTranslate, w, h };
}

export function translateLegacyCuboid(
  cuboid: CuboidLegacy,
  xTranslate: number,
  yTranslate: number
): CuboidLegacy {
  const { top, bottom, left, right, front, back } = cuboid;
  return {
    top: translateLegacyRectangle(top, xTranslate, yTranslate),
    bottom: translateLegacyRectangle(bottom, xTranslate, yTranslate),
    left: translateLegacyRectangle(left, xTranslate, yTranslate),
    right: translateLegacyRectangle(right, xTranslate, yTranslate),
    front: translateLegacyRectangle(front, xTranslate, yTranslate),
    back: translateLegacyRectangle(back, xTranslate, yTranslate),
  };
}
