import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import * as Face from "../face";

type Faces = {
  top: Region;
  bottom: Region;
  right: Region;
  front: Region;
  left: Region;
  back: Region;
};

const size = 128;
const size2 = 24;

function makeFaces(ox: number, oy: number): Faces {
  return {
    top: [ox + size, oy + size - size2, size, size2],
    bottom: [ox + size, oy + size * 2, size, size2],
    right: [
      ox + size / 2 - size2 / 2,
      oy + (size * 3) / 2 - size2 / 2,
      size,
      size2,
    ],
    front: [ox + size, oy + size, size, size],
    left: [
      ox + (size * 3) / 2 + size2 / 2,
      oy + (size * 3) / 2 - size2 / 2,
      size,
      size2,
    ],
    back: [ox + size * 2 + size2, oy + size, size, size],
  };
}

export function drawTrapdoor(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "TrapdoorFace" + blockId, regions.front);

  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 3],
    regions.top,
    {
      rotate: 180.0,
    }
  );
  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 3],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 3],
    regions.right,
    {
      rotate: 90.0,
    }
  );
  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 16],
    regions.front,
    {
      flip: "Horizontal",
    }
  );
  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 3],
    regions.left,
    {
      rotate: -90.0,
    }
  );
  Face.drawFace(
    generator,
    "TrapdoorFace" + blockId,
    [0, 0, 16, 16],
    regions.back
  );

  generator.drawImage("Tabs-Trapdoor", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Trapdoor", [ox - 32, oy - 1]);
  }
}
