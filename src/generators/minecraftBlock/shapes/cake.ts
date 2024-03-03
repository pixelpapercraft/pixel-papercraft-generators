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
const dif = 16;
const sizeb = 16;
const sizec = size - dif;

function makeFaces(ox: number, oy: number, bites: number): Faces {
  return {
    top: [ox + size, oy + size / 2 + dif, sizec - sizeb * bites, sizec],
    bottom: [ox + size, oy + size * 2, sizec - sizeb * bites, sizec],
    right: [ox + dif, oy + (size * 3) / 2, sizec, size / 2],
    front: [ox + size, oy + (size * 3) / 2, sizec - sizeb * bites, size / 2],
    left: [
      ox + sizec * 2 + dif - sizeb * bites,
      oy + (size * 3) / 2,
      sizec,
      size / 2,
    ],
    back: [
      ox + sizec * 3 + dif - sizeb * bites,
      oy + (size * 3) / 2,
      sizec - sizeb * bites,
      size / 2,
    ],
  };
}

export function drawCake(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  generator.defineSelectInput("Block " + blockId + " Bites Taken", [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ]);

  const bitesInput = generator.getSelectInputValue(
    "Block " + blockId + " Bites Taken"
  );

  const bites = bitesInput ? parseInt(bitesInput, 10) : 1;

  const regions = makeFaces(ox, oy, bites);

  Face.defineInputRegion(generator, "CakeFaceTop" + blockId, regions.top);
  Face.defineInputRegion(generator, "CakeFaceBottom" + blockId, regions.bottom);
  Face.defineInputRegion(generator, "CakeFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "CakeFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "CakeFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "CakeFaceBack" + blockId, regions.back);

  Face.drawFace(
    generator,
    "CakeFaceTop" + blockId,
    [1 + bites * 2, 1, 14 - 2 * bites, 14],
    regions.top
  );
  Face.drawFace(
    generator,
    "CakeFaceBottom" + blockId,
    [1 + bites * 2, 1, 14 - 2 * bites, 14],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "CakeFaceRight" + blockId,
    [1, 8, 14, 8],
    regions.right
  );
  Face.drawFace(
    generator,
    "CakeFaceFront" + blockId,
    [1 + bites * 2, 8, 14 - 2 * bites, 8],
    regions.front
  );
  Face.drawFace(
    generator,
    "CakeFaceLeft" + blockId,
    [1, 8, 14, 8],
    regions.left
  );
  Face.drawFace(
    generator,
    "CakeFaceBack" + blockId,
    [1, 8, 14 - 2 * bites, 8],
    regions.back
  );

  generator.drawImage("Tabs-Cake-Left", [ox - 32, oy - 1]);
  if (showFolds) {
    generator.drawImage("Folds-Cake-Left", [ox - 32, oy - 1]);
  }

  generator.drawImage("Tabs-Cake-Middle", [ox - 32 - bites * 16, oy - 1]);
  if (showFolds) {
    generator.drawImage("Folds-Cake-Middle", [ox - 32 - bites * 16, oy - 1]);
  }

  generator.drawImage("Tabs-Cake-Right", [ox - 16 - bites * 32, oy - 1]);
  if (showFolds) {
    generator.drawImage("Folds-Cake-Right", [ox - 32 - bites * 32, oy - 1]);
  }

  generator.drawImage("Tabs-Cake-Corner", [ox - 32 - bites * 16, oy - 1]);
}
