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

function makeFaces(ox: number, oy: number): Faces {
  return {
    top: [ox + size, oy + 0, size, size],
    bottom: [ox + size, oy + size * 2, size, size],
    right: [ox, oy + size, size, size],
    front: [ox + size, oy + size, size, size],
    left: [ox + size * 2, oy + size, size, size],
    back: [ox + size * 3, oy + size, size, size],
  };
}

export function drawBlock(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "BlockFaceTop" + blockId, regions.top);
  Face.defineInputRegion(
    generator,
    "BlockFaceBottom" + blockId,
    regions.bottom
  );
  Face.defineInputRegion(generator, "BlockFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "BlockFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "BlockFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "BlockFaceBack" + blockId, regions.back);

  Face.drawFace(
    generator,
    "BlockFaceTop" + blockId,
    [0, 0, 16, 16],
    regions.top
  );
  Face.drawFace(
    generator,
    "BlockFaceBottom" + blockId,
    [0, 0, 16, 16],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "BlockFaceRight" + blockId,
    [0, 0, 16, 16],
    regions.right
  );
  Face.drawFace(
    generator,
    "BlockFaceFront" + blockId,
    [0, 0, 16, 16],
    regions.front
  );
  Face.drawFace(
    generator,
    "BlockFaceLeft" + blockId,
    [0, 0, 16, 16],
    regions.left
  );
  Face.drawFace(
    generator,
    "BlockFaceBack" + blockId,
    [0, 0, 16, 16],
    regions.back
  );

  generator.drawImage("Tabs-Block", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Block", [ox - 32, oy - 1]);
  }
}
