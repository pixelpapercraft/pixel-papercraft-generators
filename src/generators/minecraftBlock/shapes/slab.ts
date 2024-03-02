// module TexturePicker = MinecraftBlock_TexturePicker
// module Textures = MinecraftBlock_Textures
// module Face = MinecraftBlock_Face

import { type Generator, type Region } from "@/builder/modules/generator";
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

// module Slab = {
//   module Regions = {
//     type faces = {
//       top: region,
//       bottom: region,
//       right: region,
//       front: region,
//       left: region,
//       back: region,
//     }

//     let size = 128

//     let make = (ox, oy) => {
//       top: (ox + size, oy + size / 2, size, size),
//       bottom: (ox + size, oy + size * 2, size, size),
//       right: (ox, oy + size * 3 / 2, size, size / 2),
//       front: (ox + size, oy + size * 3 / 2, size, size / 2),
//       left: (ox + size * 2, oy + size * 3 / 2, size, size / 2),
//       back: (ox + size * 3, oy + size * 3 / 2, size, size / 2),
//     }
//   }

//   let draw = (blockId: string, ox: int, oy: int, showFolds: bool) => {
//     let regions = Regions.make(ox, oy)

//     Face.defineInputRegion("SlabFaceTop" ++ blockId, regions.top)
//     Face.defineInputRegion("SlabFaceBottom" ++ blockId, regions.bottom)
//     Face.defineInputRegion("SlabFaceRight" ++ blockId, regions.right)
//     Face.defineInputRegion("SlabFaceFront" ++ blockId, regions.front)
//     Face.defineInputRegion("SlabFaceLeft" ++ blockId, regions.left)
//     Face.defineInputRegion("SlabFaceBack" ++ blockId, regions.back)

//     Face.draw("SlabFaceTop" ++ blockId, (0, 0, 16, 16), regions.top, ())
//     Face.draw("SlabFaceBottom" ++ blockId, (0, 0, 16, 16), regions.bottom, ())
//     Face.draw("SlabFaceRight" ++ blockId, (0, 8, 16, 8), regions.right, ())
//     Face.draw("SlabFaceFront" ++ blockId, (0, 8, 16, 8), regions.front, ())
//     Face.draw("SlabFaceLeft" ++ blockId, (0, 8, 16, 8), regions.left, ())
//     Face.draw("SlabFaceBack" ++ blockId, (0, 8, 16, 8), regions.back, ())

//     Generator.drawImage("Tabs-Slab", (ox - 32, oy - 1))

//     if showFolds {
//       Generator.drawImage("Folds-Slab", (ox - 32, oy - 1))
//     }
//   }
// }

export function drawSlab(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "SlabFaceTop" + blockId, regions.top);
  Face.defineInputRegion(generator, "SlabFaceBottom" + blockId, regions.bottom);
  Face.defineInputRegion(generator, "SlabFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "SlabFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "SlabFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "SlabFaceBack" + blockId, regions.back);

  Face.drawFace(
    generator,
    "SlabFaceTop" + blockId,
    [0, 0, 16, 16],
    regions.top,
    {}
  );
  Face.drawFace(
    generator,
    "SlabFaceBottom" + blockId,
    [0, 0, 16, 16],
    regions.bottom,
    {}
  );
  Face.drawFace(
    generator,
    "SlabFaceRight" + blockId,
    [0, 8, 16, 8],
    regions.right,
    {}
  );
  Face.drawFace(
    generator,
    "SlabFaceFront" + blockId,
    [0, 8, 16, 8],
    regions.front,
    {}
  );
  Face.drawFace(
    generator,
    "SlabFaceLeft" + blockId,
    [0, 8, 16, 8],
    regions.left,
    {}
  );
  Face.drawFace(
    generator,
    "SlabFaceBack" + blockId,
    [0, 8, 16, 8],
    regions.back,
    {}
  );

  generator.drawImage("Tabs-Slab", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Slab", [ox - 32, oy - 1]);
  }
}
