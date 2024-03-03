import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import * as Face from "../face";

type Faces = {
  top: Region;
  top2: Region;
  bottom: Region;
  right: Region;
  front: Region;
  left: Region;
  back: Region;
  back2: Region;
};

const size = 128;

function makeFaces(ox: number, oy: number): Faces {
  return {
    top: [ox + size, oy + size / 2, size, size / 2],
    top2: [ox + size * 3, oy + size, size, size / 2],
    bottom: [ox + size, oy + size * 2, size, size],
    right: [ox, oy + size, size, size],
    front: [ox + size, oy + size, size, size],
    left: [ox + size * 2, oy + size, size, size],
    back: [ox + size * 3, oy + (size * 3) / 2, size, size / 2],
    back2: [ox + size, oy + 0, size, size / 2],
  };
}

export function drawStair(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "StairFaceTop" + blockId, regions.top);
  Face.defineInputRegion(
    generator,
    "StairFaceBottom" + blockId,
    regions.bottom
  );
  Face.defineInputRegion(generator, "StairFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "StairFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "StairFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "StairFaceBack" + blockId, regions.back);

  Face.drawFace(
    generator,
    "StairFaceTop" + blockId,
    [0, 8, 16, 8],
    regions.top
  );
  Face.drawFace(
    generator,
    "StairFaceBack" + blockId,
    [0, 0, 16, 8],
    regions.back2,
    { rotate: 180 }
  );
  Face.drawFace(
    generator,
    "StairFaceBottom" + blockId,
    [0, 0, 16, 16],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "StairFaceRight" + blockId,
    [0, 0, 16, 16],
    regions.right
  );
  Face.drawFace(
    generator,
    "StairFaceFront" + blockId,
    [0, 0, 16, 16],
    regions.front
  );
  Face.drawFace(
    generator,
    "StairFaceLeft" + blockId,
    [0, 0, 16, 16],
    regions.left
  );
  Face.drawFace(
    generator,
    "StairFaceBack" + blockId,
    [0, 8, 16, 8],
    regions.back
  );
  Face.drawFace(
    generator,
    "StairFaceTop" + blockId,
    [0, 0, 16, 8],
    regions.top2,
    {
      rotate: 180,
    }
  );

  generator.drawImage("Tabs-Stair", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Stair", [ox - 32, oy - 1]);
  }
}
