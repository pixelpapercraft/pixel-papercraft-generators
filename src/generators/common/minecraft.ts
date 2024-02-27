import { type Generator } from "@/builder/modules/generator";
import {
  type Flip,
  type Rotate,
  flipNone,
  flipVertical,
  flipHorizontal,
  addRotation,
} from "@/builder/modules/renderer";
import {
  type Rectangle,
  type Position,
  translateRectangle,
  Dimensions,
} from "./cuboid";

export type Face = {
  rectangle: Rectangle;
  flip: Flip;
  rotate: Rotate;
};

export function makeFace(rect: Rectangle): Face {
  return {
    rectangle: rect,
    flip: flipNone(),
    rotate: flipNone(),
  };
}

function flipFaceNone(face: Face): Face {
  return face;
}

function flipFaceVertical(face: Face): Face {
  switch (face.flip.kind) {
    case "None":
      return { ...face, flip: flipVertical() };
    case "Vertical":
      return { ...face, flip: flipNone() };
    case "Horizontal":
      // When a face is flipped both vertically and horizontally,
      // this is the same as rotating 180 degrees.
      return {
        ...face,
        flip: flipNone(),
        rotate: addRotation(face.rotate, 180.0),
      };
  }
}

function flipFaceHorizontal(face: Face): Face {
  switch (face.flip.kind) {
    case "None":
      return { ...face, flip: flipHorizontal() };
    case "Vertical":
      // When a face is flipped both vertically and horizontally,
      // this is the same as rotating 180 degrees.
      return {
        ...face,
        flip: flipNone(),
        rotate: addRotation(face.rotate, 180),
      };
    case "Horizontal":
      return { ...face, flip: flipNone() };
  }
}

export function flipFace(
  face: Face,
  flip: "None" | "Vertical" | "Horizontal"
): Face {
  switch (flip) {
    case "None":
      return flipFaceNone(face);
    case "Vertical":
      return flipFaceVertical(face);
    case "Horizontal":
      return flipFaceHorizontal(face);
  }
}

export function rotateFace(face: Face, r: number): Face {
  const [x, y, w, h] = face.rectangle;
  return {
    rectangle:
      (r + 360) % 180 === 90
        ? [x + (w - h) / 2, y - (w - h) / 2, h, w]
        : [x, y, w, h],
    flip: face.flip,
    rotate: addRotation(face.rotate, r),
  };
}

export function translateFace(face: Face, position: [number, number]): Face {
  return {
    rectangle: translateRectangle(face.rectangle, position),
    flip: face.flip,
    rotate: face.rotate,
  };
}

type Dest = {
  front: Face;
  back: Face;
  top: Face;
  bottom: Face;
  right: Face;
  left: Face;
};

function translateDest(dest: Dest, position: Position): Dest {
  return {
    front: translateFace(dest.front, position),
    back: translateFace(dest.back, position),
    top: translateFace(dest.top, position),
    bottom: translateFace(dest.bottom, position),
    right: translateFace(dest.right, position),
    left: translateFace(dest.left, position),
  };
}

type Direction = "East" | "West" | "North" | "South";

type Center = "Right" | "Front" | "Left" | "Back" | "Top" | "Bottom";

function makeDest([w, h, d]: Dimensions, direction: Direction): Dest {
  switch (direction) {
    case "East":
      return {
        top: makeFace([d, 0, w, d]),
        right: makeFace([0, d, d, h]),
        front: makeFace([d, d, w, h]),
        left: makeFace([d + w, d, d, h]),
        back: makeFace([d + w + d, d, w, h]),
        bottom: makeFace([d, d + h, w, d]),
      };
    case "West":
      return {
        top: makeFace([w + d, 0, w, d]),
        back: makeFace([0, d, w, h]),
        right: makeFace([w, d, d, h]),
        front: makeFace([w + d, d, w, h]),
        left: makeFace([w + d + w, d, d, h]),
        bottom: makeFace([w + d, d + h, w, d]),
      };
    case "North":
      return {
        back: rotateFace(makeFace([d, 0, w, h]), 180),
        top: makeFace([d, h, w, d]),
        right: makeFace([0, h + d, d, h]),
        front: makeFace([d, h + d, w, h]),
        left: makeFace([d + w, h + d, d, h]),
        bottom: makeFace([d, h * 2 + d, w, d]),
      };
    case "South":
      return {
        top: makeFace([d, 0, w, d]),
        right: makeFace([0, d, d, h]),
        front: makeFace([d, d, w, h]),
        left: makeFace([d + w, d, d, h]),
        bottom: makeFace([d, d + h, w, d]),
        back: rotateFace(makeFace([d, d + h + d, w, h]), 180),
      };
  }
}

// function adjustDimensionsForCenter(dimensions: Dimensions, enter: Center): Dimensions {
//   let (w, h, d) = dimensions
//   let dimensions = switch center {
//   | #Right => (d, h, w)
//   | #Left => (d, h, w)
//   | #Top => (w, d, h)
//   | #Bottom => (w, d, h)
//   | _ => (w, h, d)
//   }
//  return dimensions;

function adjustDimensionsForCenter(
  [w, h, d]: Dimensions,
  center: Center
): Dimensions {
  switch (center) {
    case "Right":
    case "Left":
      return [d, h, w];
    case "Top":
    case "Bottom":
      return [w, d, h];
    case "Back":
    case "Front":
      return [w, h, d];
  }
}

function setLayout(
  dimensions: Dimensions,
  direction: Direction,
  center: Center
): Dest {
  const dimensionsAdjusted = adjustDimensionsForCenter(dimensions, center);
  const dest = makeDest(dimensionsAdjusted, direction);
  switch (center) {
    case "Right":
      return {
        right: dest.front,
        front: dest.left,
        left: dest.back,
        back: dest.right,
        top: rotateFace(dest.top, -90),
        bottom: flipFace(dest.bottom, "Vertical"),
      };
    case "Front":
      return {
        right: dest.right,
        front: dest.front,
        left: dest.left,
        back: dest.back,
        top: dest.top,
        bottom: flipFace(dest.bottom, "Vertical"),
      };
    case "Left":
      return {
        right: dest.back,
        front: dest.right,
        left: dest.front,
        back: dest.left,
        top: rotateFace(dest.top, 90),
        bottom: flipFace(dest.bottom, "Vertical"),
      };
    case "Back":
      return {
        right: dest.left,
        front: dest.back,
        left: dest.right,
        back: dest.front,
        top: rotateFace(dest.top, 180),
        bottom: flipFace(dest.bottom, "Vertical"),
      };
    case "Top":
      return {
        right: rotateFace(dest.right, 90),
        front: dest.bottom,
        left: rotateFace(dest.left, -90),
        back: rotateFace(dest.top, 180),
        top: dest.front,
        bottom: flipFace(rotateFace(dest.back, 180), "Vertical"),
      };
    case "Bottom":
      return {
        right: rotateFace(dest.right, -90),
        front: dest.top,
        left: rotateFace(dest.left, 90),
        back: rotateFace(dest.bottom, 180),
        top: rotateFace(dest.back, 180),
        bottom: flipFace(dest.front, "Vertical"),
      };
  }
}

const defaultTabSize = 24;

export class Minecraft {
  constructor(private generator: Generator) {}

  drawFaceTexture(textureId: string, source: Rectangle, dest: Face) {
    this.generator.drawTexture(textureId, source, dest.rectangle, {
      flip: dest.flip,
      rotate: dest.rotate,
    });
  }

  drawCuboid(
    textureId: string,
    source: Rectangle,
    position: Position,
    dimensions: Dimensions,
    direction: Direction = "East",
    center: Center = "Front"
  ) {
    const dest = translateDest(
      setLayout(dimensions, direction, center),
      position
    );
    this.drawFaceTexture(textureId, source, dest.front);
    this.drawFaceTexture(textureId, source, dest.back);
    this.drawFaceTexture(textureId, source, dest.top);
    this.drawFaceTexture(textureId, source, dest.bottom);
    this.drawFaceTexture(textureId, source, dest.left);
    this.drawFaceTexture(textureId, source, dest.right);
  }

  setTabSize(tabSize: number) {
    this.generator.setNumberVariable("tabSize", tabSize);
  }

  getTabSize() {
    const tabSize = this.generator.getNumberVariable("tabSize");
    return tabSize === null ? defaultTabSize : tabSize;
  }

  // let drawFaceTab = (
  //   face: Builder.rectangle,
  //   side: Generator.Orientation.t,
  //   ~showFoldLine: bool=true,
  //   ~tabAngle: float=45.0,
  //   ~size: option<int>=?,
  //   (),
  // ) => {
  //   let size = switch size {
  //   | Some(size) => size
  //   | None => getTabSize()
  //   }
  //   let (x, y, w, h) = face
  //   let tabRect = switch side {
  //   | #North => (x, y - size, w, size)
  //   | #East => (x + w, y, size, h)
  //   | #South => (x, y + h, w, size)
  //   | #West => (x - size, y, size, h)
  //   }
  //   Generator.drawTab(tabRect, side, ~showFoldLine, ~tabAngle, ())
  // }

  // let drawFaceTabs = (
  //   face: Builder.rectangle,
  //   sides: array<Generator.Orientation.t>,
  //   ~showFoldLine: bool=true,
  //   ~tabAngle: float=45.0,
  //   ~size: option<int>=?,
  //   (),
  // ) => {
  //   let size = switch size {
  //   | Some(size) => size
  //   | None => getTabSize()
  //   }
  //   sides->Belt.Array.forEach(side => {
  //     drawFaceTab(face, side, ~showFoldLine, ~tabAngle, ~size, ())
  //   })
  // }
}
