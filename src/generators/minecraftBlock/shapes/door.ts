import { type Generator, type Region } from "@/builder/modules/generator";
import * as Face from "../face";

type Faces = {
  top: Region;
  bottom: Region;
  right1: Region;
  front1: Region;
  left1: Region;
  back1: Region;
  right2: Region;
  front2: Region;
  left2: Region;
  back2: Region;
};

const size = 128;
const size2 = 24;

function makeFaces(ox: number, oy: number): Faces {
  return {
    top: [ox + (size * 3) / 2 - size2 / 2, oy - size2 / 2, size2, size],
    bottom: [
      ox + (size * 3) / 2 - size2 / 2,
      oy + size * 2 + size2 / 2,
      size2,
      size,
    ],
    right1: [ox + size - size2, oy + size / 2, size2, size],
    front1: [ox + size, oy + size / 2, size, size],
    left1: [ox + size * 2, oy + size / 2, size2, size],
    back1: [ox + size * 2 + size2, oy + size / 2, size, size],
    right2: [ox + size - size2, oy + (size * 3) / 2, size2, size],
    front2: [ox + size, oy + (size * 3) / 2, size, size],
    left2: [ox + size * 2, oy + (size * 3) / 2, size2, size],
    back2: [ox + size * 2 + size2, oy + (size * 3) / 2, size, size],
  };
}

export function drawDoor(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "DoorFace1" + blockId, regions.front1);
  Face.defineInputRegion(generator, "DoorFace2" + blockId, regions.front2);

  Face.drawFace(generator, "DoorFace2" + blockId, [13, 0, 3, 16], regions.top, {
    rotate: -90,
  });
  Face.drawFace(
    generator,
    "DoorFace2" + blockId,
    [13, 0, 3, 16],
    regions.bottom,
    {
      rotate: 90,
    }
  );
  Face.drawFace(
    generator,
    "DoorFace1" + blockId,
    [0, 0, 3, 16],
    regions.right1,
    {
      flip: "Horizontal",
    }
  );
  Face.drawFace(
    generator,
    "DoorFace1" + blockId,
    [0, 0, 16, 16],
    regions.front1
  );
  Face.drawFace(generator, "DoorFace1" + blockId, [0, 0, 3, 16], regions.left1);
  Face.drawFace(
    generator,
    "DoorFace1" + blockId,
    [0, 0, 16, 16],
    regions.back1,
    {
      flip: "Horizontal",
    }
  );
  Face.drawFace(
    generator,
    "DoorFace2" + blockId,
    [0, 0, 3, 16],
    regions.right2,
    {
      flip: "Horizontal",
    }
  );
  Face.drawFace(
    generator,
    "DoorFace2" + blockId,
    [0, 0, 16, 16],
    regions.front2
  );
  Face.drawFace(generator, "DoorFace2" + blockId, [0, 0, 3, 16], regions.left2);
  Face.drawFace(
    generator,
    "DoorFace2" + blockId,
    [0, 0, 16, 16],
    regions.back2,
    {
      flip: "Horizontal",
    }
  );

  generator.drawImage("Tabs-Door", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Door", [ox - 32, oy - 1]);
  }
}
