import { type Generator, type Region } from "@/builder/modules/generator";
import * as Face from "../face";

//     type faces = {
//       top: region,
//       bottom: region,
//       right: region,
//       front: region,
//       left: region,
//       back: region,
//     }

type Faces = {
  top: Region;
  bottom: Region;
  right: Region;
  front: Region;
  left: Region;
  back: Region;
};

//     let size = 128

const size = 128;

//     let make = (ox, oy, levels, offset): faces => {
//       top: (ox + size, oy + size - levels * 16 + offset * 8, size, size),
//       bottom: (ox + size, oy + size * 2, size, size),
//       right: (ox, oy + size * 2 - levels * 16 + offset * 8, size, levels * 16 - offset * 8),
//       front: (ox + size, oy + size * 2 - levels * 16 + offset * 8, size, levels * 16 - offset * 8),
//       left: (
//         ox + size * 2,
//         oy + size * 2 - levels * 16 + offset * 8,
//         size,
//         levels * 16 - offset * 8,
//       ),
//       back: (
//         ox + size * 3,
//         oy + size * 2 - levels * 16 + offset * 8,
//         size,
//         levels * 16 - offset * 8,
//       ),
//     }
//

function makeFaces(
  ox: number,
  oy: number,
  levels: number,
  offset: number
): Faces {
  return {
    top: [ox + size, oy + size - levels * 16 + offset * 8, size, size],
    bottom: [ox + size, oy + size * 2, size, size],
    right: [
      ox,
      oy + size * 2 - levels * 16 + offset * 8,
      size,
      levels * 16 - offset * 8,
    ],
    front: [
      ox + size,
      oy + size * 2 - levels * 16 + offset * 8,
      size,
      levels * 16 - offset * 8,
    ],
    left: [
      ox + size * 2,
      oy + size * 2 - levels * 16 + offset * 8,
      size,
      levels * 16 - offset * 8,
    ],
    back: [
      ox + size * 3,
      oy + size * 2 - levels * 16 + offset * 8,
      size,
      levels * 16 - offset * 8,
    ],
  };
}

//   let draw = (blockId: string, ox: int, oy: int, showFolds: bool) => {
//     Generator.defineSelectInput(
//       "Block " ++ blockId ++ " Level",
//       ["1", "2", "3", "4", "5", "6", "7", "8"],
//     )
//     Generator.defineBooleanInput("Block " ++ blockId ++ " Offset for Intermediate Levels", false)

//     let levels =
//       Generator.getSelectInputValue("Block " ++ blockId ++ " Level")
//       ->Belt.Int.fromString
//       ->Belt.Option.getWithDefault(1)

//     let offset = Generator.getBooleanInputValue(
//       "Block " ++ blockId ++ " Offset for Intermediate Levels",
//     )
//       ? 1
//       : 0

//     let regions = Regions.make(ox, oy, levels, offset)

//     Face.defineInputRegion("SnowFaceTop" ++ blockId, regions.top)
//     Face.defineInputRegion("SnowFaceBottom" ++ blockId, regions.bottom)
//     Face.defineInputRegion("SnowFaceRight" ++ blockId, regions.right)
//     Face.defineInputRegion("SnowFaceFront" ++ blockId, regions.front)
//     Face.defineInputRegion("SnowFaceLeft" ++ blockId, regions.left)
//     Face.defineInputRegion("SnowFaceBack" ++ blockId, regions.back)

//     Face.draw("SnowFaceTop" ++ blockId, (0, 0, 16, 16), regions.top, ())
//     Face.draw("SnowFaceBottom" ++ blockId, (0, 0, 16, 16), regions.bottom, ())
//     Face.draw(
//       "SnowFaceRight" ++ blockId,
//       (0, 16 - levels * 2 + offset, 16, levels * 2 - offset),
//       regions.right,
//       (),
//     )
//     Face.draw(
//       "SnowFaceFront" ++ blockId,
//       (0, 16 - levels * 2 + offset, 16, levels * 2 - offset),
//       regions.front,
//       (),
//     )
//     Face.draw(
//       "SnowFaceLeft" ++ blockId,
//       (0, 16 - levels * 2 + offset, 16, levels * 2 - offset),
//       regions.left,
//       (),
//     )
//     Face.draw(
//       "SnowFaceBack" ++ blockId,
//       (0, 16 - levels * 2 + offset, 16, levels * 2 - offset),
//       regions.back,
//       (),
//     )

//     Generator.drawImage("Tabs-Snow-Bottom", (ox - 32, oy - 1))

//     if showFolds {
//       Generator.drawImage("Folds-Snow-Bottom", (ox - 32, oy - 1))
//     }

//     Generator.drawImage("Tabs-Snow-Top", (ox - 32, oy - 1 + 128 - levels * 16 + offset * 8))
//     Generator.drawImage("Tabs-Snow-Middle", (ox - 32, oy - 1))
//     if showFolds {
//       Generator.drawImage("Folds-Snow-Top", (ox - 32, oy - 1 + 128 - levels * 16 + offset * 8))
//     }
//   }

export function drawSnow(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  generator.defineSelectInput("Block " + blockId + " Level", [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ]);
  generator.defineBooleanInput(
    "Block " + blockId + " Offset for Intermediate Levels",
    false
  );

  const inputLevels = generator.getSelectInputValue(
    "Block " + blockId + " Level"
  );
  const levels = inputLevels ? parseInt(inputLevels) : 1;

  const offset = generator.getBooleanInputValue(
    "Block " + blockId + " Offset for Intermediate Levels"
  )
    ? 1
    : 0;

  const regions = makeFaces(ox, oy, levels, offset);

  Face.defineInputRegion(generator, "SnowFaceTop" + blockId, regions.top);
  Face.defineInputRegion(generator, "SnowFaceBottom" + blockId, regions.bottom);
  Face.defineInputRegion(generator, "SnowFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "SnowFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "SnowFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "SnowFaceBack" + blockId, regions.back);

  Face.drawFace(
    generator,
    "SnowFaceTop" + blockId,
    [0, 0, 16, 16],
    regions.top
  );
  Face.drawFace(
    generator,
    "SnowFaceBottom" + blockId,
    [0, 0, 16, 16],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "SnowFaceRight" + blockId,
    [0, 16 - levels * 2 + offset, 16, levels * 2 - offset],
    regions.right
  );
  Face.drawFace(
    generator,
    "SnowFaceFront" + blockId,
    [0, 16 - levels * 2 + offset, 16, levels * 2 - offset],
    regions.front
  );
  Face.drawFace(
    generator,
    "SnowFaceLeft" + blockId,
    [0, 16 - levels * 2 + offset, 16, levels * 2 - offset],
    regions.left
  );
  Face.drawFace(
    generator,
    "SnowFaceBack" + blockId,
    [0, 16 - levels * 2 + offset, 16, levels * 2 - offset],
    regions.back
  );

  generator.drawImage("Tabs-Snow-Bottom", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Snow-Bottom", [ox - 32, oy - 1]);
  }

  generator.drawImage("Tabs-Snow-Top", [
    ox - 32,
    oy - 1 + 128 - levels * 16 + offset * 8,
  ]);
  generator.drawImage("Tabs-Snow-Middle", [ox - 32, oy - 1]);
  if (showFolds) {
    generator.drawImage("Folds-Snow-Top", [
      ox - 32,
      oy - 1 + 128 - levels * 16 + offset * 8,
    ]);
  }
}
