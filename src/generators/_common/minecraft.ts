import { type Generator } from "@genroot/builder/modules/generator";
import {
  type Flip,
  type Blend,
} from "@genroot/builder/modules/renderers/drawTexture";
import { type TabOrientation } from "@genroot/builder/modules/renderers/drawTab";
import {
  type Cuboid,
  type Rectangle,
  type Position,
  type Dimensions,
  translateRectangle,
} from "./cuboid";

export type { Cuboid, Rectangle, Position, Dimensions } from "./cuboid";

export type RotationDegrees = 0 | 90 | 180 | 270;

function addRotationDegrees(
  r1: RotationDegrees,
  r2: RotationDegrees
): RotationDegrees {
  // Normally we should never use `as` but this is a special case where
  // we know that the result will always be a valid `RotationDegrees`.
  return ((r1 + r2) % 360) as RotationDegrees;
}

function subtractRotationDegrees(
  r1: RotationDegrees,
  r2: RotationDegrees
): RotationDegrees {
  // Normally we should never use `as` but this is a special case where
  // we know that the result will always be a valid `RotationDegrees`.
  return ((r1 - r2 + 360) % 360) as RotationDegrees;
}

export type Face = {
  rectangle: Rectangle;
  flip: Flip;
  rotate: RotationDegrees;
  blend: Blend;
};

export function makeFace(rect: Rectangle): Face {
  return {
    rectangle: rect,
    flip: "None",
    rotate: 0,
    blend: { kind: "None" },
  };
}
// Rotates the face using a point as an axis to rotate around. This is necessary because the faces of the cuboid need to rotate around the center of the cuboid and not their own centers.
function rotateOnAxis(face: Face, axis: Position, r: RotationDegrees): Face {
  const rad = (r * Math.PI) / 180; // degrees to radians
  const [cos, sin] = [Math.cos(rad), Math.sin(rad)]; // components of the unit vector
  const [x, y, w, h] = face.rectangle;
  const [x0, y0] = axis;
  const [x1, y1] = [x - x0, y - y0]; // move rectangle so the corner is on the axis
  const [x2, y2] = [x1 * cos - y1 * sin, x1 * sin + y1 * cos]; // offset in relation to the angle
  const [x3, y3] = [x2 + x0, y2 + y0]; // move rectangle away from the axis

  return {
    rectangle: [x3, y3, w, h],
    flip: face.flip,
    rotate: addRotationDegrees(face.rotate, r),
    blend: face.blend,
  };
}

//add rotate values
export function rotateFace(face: Face, r: RotationDegrees): Face {
  const r0 =
    face.flip == "None"
      ? addRotationDegrees(face.rotate, r)
      : subtractRotationDegrees(face.rotate, r);
  return {
    rectangle: face.rectangle,
    flip: face.flip,
    rotate: r0,
    blend: face.blend,
  };
}

// rotate in relation to its own center. Uses rotateOnAxis with the axis as the face's center.
export function rotateLocalFace(face: Face): Face {
  const { rectangle, flip, rotate, blend } = face;
  let [x, y, w, h] = rectangle;

  const newFace =
    rotate >= 360
      ? rotateOnAxis(
          { rectangle, flip, rotate: 0, blend },
          [x - w / 2, y - h / 2],
          rotate
        )
      : rotateOnAxis(
          { rectangle, flip, rotate: 0, blend },
          [x + w / 2, y + h / 2],
          rotate
        );

  [x, y, w, h] = newFace.rectangle;

  // If the face is rotated 90 or 270 degrees, then the height and width values will need to be swapped, and the corner moved to its correct position.

  switch (newFace.rotate) {
    case 90:
      newFace.rectangle = [x + (w - h) / 2, y + (w - h) / 2, h, w];
      break;

    case 270:
      newFace.rectangle = [x - (w - h) / 2, y - (w - h) / 2, h, w];
      break;
  }

  return {
    rectangle: newFace.rectangle,
    flip: newFace.flip,
    rotate: newFace.rotate,
    blend: newFace.blend,
  };
}

export function flipFace(
  face: Face,
  flip: "None" | "Vertical" | "Horizontal"
): Face {
  let newFlip: Flip = "None";
  let newRotate: RotationDegrees = 0;
  // set to be flip
  // if face flip is the same, set to none
  // if face flip is opposite, set to none and 180
  if (face.flip != flip) {
    if (face.flip == "None") {
      newFlip = flip;
    } else if (flip == "None") {
      newFlip = face.flip;
    } else {
      newRotate = 180;
    }
  }
  return rotateFace(
    {
      rectangle: face.rectangle,
      flip: newFlip,
      rotate: face.rotate,
      blend: face.blend,
    },
    newRotate
  );
}

export function blendFace(face: Face, blend: Blend): Face {
  return {
    rectangle: face.rectangle,
    flip: face.flip,
    rotate: face.rotate,
    blend,
  };
}

export function translateFace(face: Face, position: [number, number]): Face {
  return {
    rectangle: translateRectangle(face.rectangle, position),
    flip: face.flip,
    rotate: face.rotate,
    blend: face.blend,
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

export type Orientation = "East" | "West" | "North" | "South";

export type Center = "Right" | "Front" | "Left" | "Back" | "Top" | "Bottom";

function makeDest([w, h, d]: Dimensions, orientation: Orientation): Dest {
  switch (orientation) {
    case "West":
      return {
        top: makeFace([d, 0, w, d]),
        right: makeFace([0, d, d, h]),
        front: makeFace([d, d, w, h]),
        left: makeFace([d + w, d, d, h]),
        back: makeFace([d + w + d, d, w, h]),
        bottom: makeFace([d, d + h, w, d]),
      };
    case "East":
      return {
        top: makeFace([w + d, 0, w, d]),
        back: makeFace([0, d, w, h]),
        right: makeFace([w, d, d, h]),
        front: makeFace([w + d, d, w, h]),
        left: makeFace([w + d + w, d, d, h]),
        bottom: makeFace([w + d, d + h, w, d]),
      };
    case "South":
      return {
        back: rotateFace(makeFace([d, 0, w, h]), 180),
        top: makeFace([d, h, w, d]),
        right: makeFace([0, h + d, d, h]),
        front: makeFace([d, h + d, w, h]),
        left: makeFace([d + w, h + d, d, h]),
        bottom: makeFace([d, h * 2 + d, w, d]),
      };
    case "North":
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

function adjustOrientationForFlip(
  orientation: Orientation,
  flip: Flip
): Orientation {
  switch (flip) {
    case "Horizontal": {
      switch (orientation) {
        case "West":
          return "East";
        case "East":
          return "West";
        case "North":
        case "South":
          return orientation;
      }
      break;
    }
    case "Vertical": {
      switch (orientation) {
        case "South":
          return "North";
        case "North":
          return "South";
        case "East":
        case "West":
          return orientation;
      }
      break;
    }
    case "None": {
      return orientation;
    }
  }
}

function adjustDestFlip(dest: Dest, flip: Flip): Dest {
  switch (flip) {
    case "Horizontal":
      return {
        right: flipFace(dest.left, "Horizontal"),
        front: flipFace(dest.front, "Horizontal"),
        left: flipFace(dest.right, "Horizontal"),
        back: flipFace(dest.back, "Horizontal"),
        top: flipFace(dest.top, "Horizontal"),
        bottom: flipFace(dest.bottom, "Horizontal"),
      };
    case "Vertical":
      return {
        right: flipFace(dest.right, "Vertical"),
        front: flipFace(dest.front, "Vertical"),
        left: flipFace(dest.left, "Vertical"),
        back: flipFace(dest.back, "Vertical"),
        top: flipFace(dest.bottom, "Vertical"),
        bottom: flipFace(dest.top, "Vertical"),
      };
    case "None":
      return dest;
  }
}

function adjustDestCenter(dest: Dest, center: Center): Dest {
  switch (center) {
    case "Right":
      return {
        right: dest.front,
        front: dest.left,
        left: dest.back,
        back: dest.right,
        top: rotateFace(dest.top, 270),
        bottom: flipFace(rotateFace(dest.bottom, 90), "Vertical"),
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
        bottom: flipFace(rotateFace(dest.bottom, 270), "Vertical"),
      };
    case "Back":
      return {
        right: dest.left,
        front: dest.back,
        left: dest.right,
        back: dest.front,
        top: rotateFace(dest.top, 180),
        bottom: flipFace(dest.bottom, "Horizontal"),
      };
    case "Top":
      return {
        right: rotateFace(dest.right, 90),
        front: dest.bottom,
        left: rotateFace(dest.left, 270),
        back: rotateFace(dest.top, 180),
        top: dest.front,
        bottom: flipFace(dest.back, "Horizontal"),
      };
    case "Bottom":
      return {
        right: rotateFace(dest.right, 270),
        front: dest.top,
        left: rotateFace(dest.left, 90),
        back: rotateFace(dest.bottom, 180),
        top: rotateFace(dest.back, 180),
        bottom: flipFace(dest.front, "Vertical"),
      };
  }
}

function destRotateFaces(dest: Dest): Dest {
  return {
    right: rotateLocalFace(dest.right),
    front: rotateLocalFace(dest.front),
    left: rotateLocalFace(dest.left),
    back: rotateLocalFace(dest.back),
    top: rotateLocalFace(dest.top),
    bottom: rotateLocalFace(dest.bottom),
  };
}

function getAxis([w, h, d]: Dimensions, orientation: Orientation): Position {
  switch (orientation) {
    case "East":
      return [d + w * 1.5, d + h / 2];
    case "South":
      return [d + w / 2, d + h * 1.5];
    default:
      return [d + w / 2, d + h / 2];
  }
}

function rotateCuboid(
  dest: Dest,
  axis: Position,
  rotate: RotationDegrees
): Dest {
  return {
    right: rotateOnAxis(dest.right, axis, rotate),
    front: rotateOnAxis(dest.front, axis, rotate),
    left: rotateOnAxis(dest.left, axis, rotate),
    back: rotateOnAxis(dest.back, axis, rotate),
    top: rotateOnAxis(dest.top, axis, rotate),
    bottom: rotateOnAxis(dest.bottom, axis, rotate),
  };
}

function adjustDestBlend(dest: Dest, blend: Blend): Dest {
  return {
    right: blendFace(dest.right, blend),
    front: blendFace(dest.front, blend),
    left: blendFace(dest.left, blend),
    back: blendFace(dest.back, blend),
    top: blendFace(dest.top, blend),
    bottom: blendFace(dest.bottom, blend),
  };
}

function setLayout(
  dimensions: Dimensions,
  orientation: Orientation,
  center: Center,
  flip: Flip,
  rotate: RotationDegrees,
  blend: Blend
): Dest {
  // Depending of the center face of the cuboid, the width, height and depth as found in dimensions will have to change.
  const dimensionsAdjusted = adjustDimensionsForCenter(dimensions, center);
  // Depending on the flip direction of the cuboid, the orientation will need to change.
  const orientationAdjusted = adjustOrientationForFlip(orientation, flip);

  // Create destination with default layout
  let dest = makeDest(dimensionsAdjusted, orientationAdjusted);
  /*
    Flip:
    Add flip each face in the given direction
    Change layout (by default, make horizontal make a west facing cuboid face east):
    If horizontal, switch the right and left face, and if the orientation is east or west, make it face the other direction
    If vertical, switch the top and bottom faces, and if the orientation is north or south, make it face the other direction
 */
  dest = adjustDestFlip(dest, flip);

  // Place faces in proper places depending on the center face.
  dest = adjustDestCenter(dest, center);
  //actually rotate the faces
  dest = destRotateFaces(dest);
  // Rotate the destination by the given rotation, with the center of the center face as the axis
  const axis = getAxis(dimensionsAdjusted, orientationAdjusted);
  dest = rotateCuboid(dest, axis, rotate);

  // Blend each face
  dest = adjustDestBlend(dest, blend);

  // Return the destination
  return dest;
}

const defaultTabSize = 24;

export type DrawCuboidOptions = {
  orientation: Orientation;
  center: Center;
  flip: Flip;
  rotate: RotationDegrees;
  blend: Blend;
};

export class Minecraft {
  constructor(private generator: Generator) {}

  drawFaceTexture(textureId: string, source: Rectangle, dest: Face) {
    this.generator.drawTexture(textureId, source, dest.rectangle, {
      flip: dest.flip,
      rotateLegacy: dest.rotate,
      blend: dest.blend,
    });
  }

  drawCuboid(
    textureId: string,
    source: Cuboid,
    position: Position,
    dimensions: Dimensions,
    options: Partial<DrawCuboidOptions> = {}
  ) {
    const {
      orientation = "West",
      center = "Front",
      flip = "None",
      rotate = 0,
      blend = { kind: "None" },
    } = options;

    const dest = translateDest(
      setLayout(dimensions, orientation, center, flip, rotate, blend),
      position
    );
    this.drawFaceTexture(textureId, source.front, dest.front);
    this.drawFaceTexture(textureId, source.back, dest.back);
    this.drawFaceTexture(textureId, source.top, dest.top);
    this.drawFaceTexture(textureId, source.bottom, dest.bottom);
    this.drawFaceTexture(textureId, source.left, dest.left);
    this.drawFaceTexture(textureId, source.right, dest.right);
  }

  setTabSize(tabSize: number) {
    this.generator.setNumberVariable("tabSize", tabSize);
  }

  getTabSize() {
    const tabSize = this.generator.getNumberVariable("tabSize");
    return tabSize === null ? defaultTabSize : tabSize;
  }

  drawFaceTab(
    face: Rectangle,
    side: TabOrientation,
    showFoldLine: boolean = true,
    tabAngle?: number
  ) {
    const size = this.getTabSize();
    const [x, y, w, h] = face;
    const tabRect: Rectangle =
      side === "North"
        ? [x, y - size, w, size]
        : side === "East"
          ? [x + w, y, size, h]
          : side === "South"
            ? [x, y + h, w, size]
            : [x - size, y, size, h];
    this.generator.drawTab(tabRect, side, showFoldLine, tabAngle);
  }

  drawFaceTabs(
    face: Rectangle,
    sides: TabOrientation[],
    showFoldLine: boolean = true,
    tabAngle?: number
  ) {
    sides.forEach((side) => {
      this.drawFaceTab(face, side, showFoldLine, tabAngle);
    });
  }
}
