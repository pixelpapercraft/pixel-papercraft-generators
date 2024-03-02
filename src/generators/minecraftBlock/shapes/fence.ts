import { type Generator, type Region } from "@/builder/modules/generator";
import * as Face from "../face";

//     type faces = {
//       // fence post
//       top: region,
//       bottom: region,
//       right: region,
//       front: region,
//       left: region,
//       back: region,
//       // short fence rail 1
//       stop1: region,
//       sbottom1: region,
//       sright1: region,
//       sfront1: region,
//       sleft1: region,
//       sback1: region,
//       // short fence rail 2
//       stop2: region,
//       sbottom2: region,
//       sright2: region,
//       sfront2: region,
//       sleft2: region,
//       sback2: region,
//       // long fence rail 1
//       ltop1: region,
//       lbottom1: region,
//       lright1: region,
//       lfront1: region,
//       lleft1: region,
//       lback1: region,
//       l2top1: region,
//       l2bottom1: region,
//       l2front1: region,
//       l2back1: region,
//       // long fence rail 2
//       ltop2: region,
//       lbottom2: region,
//       lright2: region,
//       lfront2: region,
//       lleft2: region,
//       lback2: region,
//       l2top2: region,
//       l2bottom2: region,
//       l2front2: region,
//       l2back2: region,
//     }

type Faces = {
  // fence post

  top: Region;
  bottom: Region;
  right: Region;
  front: Region;
  left: Region;
  back: Region;

  // short fence rail 1

  stop1: Region;
  sbottom1: Region;
  sright1: Region;
  sfront1: Region;
  sleft1: Region;
  sback1: Region;

  // short fence rail 2

  stop2: Region;
  sbottom2: Region;
  sright2: Region;
  sfront2: Region;
  sleft2: Region;
  sback2: Region;

  // long fence rail 1

  ltop1: Region;
  lbottom1: Region;
  lright1: Region;
  lfront1: Region;
  lleft1: Region;
  lback1: Region;
  l2top1: Region;
  l2bottom1: Region;
  l2front1: Region;
  l2back1: Region;

  // long fence rail 2

  ltop2: Region;
  lbottom2: Region;
  lright2: Region;
  lfront2: Region;
  lleft2: Region;
  lback2: Region;
  l2top2: Region;
  l2bottom2: Region;
  l2front2: Region;
  l2back2: Region;
};

const size = 128;
const size2 = 16;
const size3 = 24;
const sizel = 96;
const x1 = -1;
const x2 = 320;
const y1 = 96;
const y2 = 208;

//     let make = (ox, oy): faces => {
//       // fence post
//       top: (ox + size + size / 4, oy + size * 3 / 4, size / 4, size / 4),
//       bottom: (ox + size + size / 4, oy + size * 2, size / 4, size / 4),
//       right: (ox + size + size / 2, oy + size, size / 4, size),
//       front: (ox + size + size / 4, oy + size, size / 4, size),
//       left: (ox + size, oy + size, size / 4, size),
//       back: (ox + size + size * 3 / 4, oy + size, size / 4, size),
//       // short fence rail 1
//       stop1: (ox + x1 + size2, oy + y1, sizel / 2, size2),
//       sbottom1: (ox + x1 + size2, oy + y1 + size2 + size3, sizel / 2, size2),
//       sright1: (ox + x1 + size2 + sizel / 2, oy + y1 + size2, size2, size3),
//       sfront1: (ox + x1 + size2, oy + y1 + size2, sizel / 2, size3),
//       sleft1: (ox + x1, oy + y1 + size2, size2, size3),
//       sback1: (ox + x1 + size2, oy + y1 + size2 * 2 + size3, sizel / 2, size3),
//       // short fence rail 2
//       stop2: (ox + x1 + size2, oy + y2, sizel / 2, size2),
//       sbottom2: (ox + x1 + size2, oy + y2 + size2 + size3, sizel / 2, size2),
//       sright2: (ox + x1 + size2 + sizel / 2, oy + y2 + size2, size2, size3),
//       sfront2: (ox + x1 + size2, oy + y2 + size2, sizel / 2, size3),
//       sleft2: (ox + x1, oy + y2 + size2, size2, size3),
//       sback2: (ox + x1 + size2, oy + y2 + size2 * 2 + size3, sizel / 2, size3),
//       // long fence rail 1
//       ltop1: (ox + x2 + size2, oy + y1, sizel / 2, size2),
//       lbottom1: (ox + x2 + size2, oy + y1 + size2 + size3, sizel / 2, size2),
//       lright1: (ox + x2 + size2 + sizel, oy + y1 + size2, size2, size3),
//       lfront1: (ox + x2 + size2, oy + y1 + size2, sizel / 2, size3),
//       lleft1: (ox + x2, oy + y1 + size2, size2, size3),
//       lback1: (ox + x2 + size2, oy + y1 + size2 * 2 + size3, sizel / 2, size3),
//       l2top1: (ox + x2 + size2 + sizel / 2, oy + y1, sizel / 2, size2),
//       l2bottom1: (ox + x2 + size2 + sizel / 2, oy + y1 + size2 + size3, sizel / 2, size2),
//       l2front1: (ox + x2 + size2 + sizel / 2, oy + y1 + size2, sizel / 2, size3),
//       l2back1: (ox + x2 + size2 + sizel / 2, oy + y1 + size2 * 2 + size3, sizel / 2, size3),
//       // long fence rail 2
//       ltop2: (ox + x2 + size2, oy + y2, sizel / 2, size2),
//       lbottom2: (ox + x2 + size2, oy + y2 + size2 + size3, sizel / 2, size2),
//       lright2: (ox + x2 + size2 + sizel, oy + y2 + size2, size2, size3),
//       lfront2: (ox + x2 + size2, oy + y2 + size2, sizel / 2, size3),
//       lleft2: (ox + x2, oy + y2 + size2, size2, size3),
//       lback2: (ox + x2 + size2, oy + y2 + size2 * 2 + size3, sizel / 2, size3),
//       l2top2: (ox + x2 + size2 + sizel / 2, oy + y2, sizel / 2, size2),
//       l2bottom2: (ox + x2 + size2 + sizel / 2, oy + y2 + size2 + size3, sizel / 2, size2),
//       l2front2: (ox + x2 + size2 + sizel / 2, oy + y2 + size2, sizel / 2, size3),
//       l2back2: (ox + x2 + size2 + sizel / 2, oy + y2 + size2 * 2 + size3, sizel / 2, size3),
//     }
//   }

function makeFaces(ox: number, oy: number): Faces {
  return {
    // fence post
    top: [ox + size + size / 4, oy + (size * 3) / 4, size / 4, size / 4],
    bottom: [ox + size + size / 4, oy + size * 2, size / 4, size / 4],
    right: [ox + size + size / 2, oy + size, size / 4, size],
    front: [ox + size + size / 4, oy + size, size / 4, size],
    left: [ox + size, oy + size, size / 4, size],
    back: [ox + size + (size * 3) / 4, oy + size, size / 4, size],
    // short fence rail 1
    stop1: [ox + x1 + size2, oy + y1, sizel / 2, size2],
    sbottom1: [ox + x1 + size2, oy + y1 + size2 + size3, sizel / 2, size2],
    sright1: [ox + x1 + size2 + sizel / 2, oy + y1 + size2, size2, size3],
    sfront1: [ox + x1 + size2, oy + y1 + size2, sizel / 2, size3],
    sleft1: [ox + x1, oy + y1 + size2, size2, size3],
    sback1: [ox + x1 + size2, oy + y1 + size2 * 2 + size3, sizel / 2, size3],
    // short fence rail 2
    stop2: [ox + x1 + size2, oy + y2, sizel / 2, size2],
    sbottom2: [ox + x1 + size2, oy + y2 + size2 + size3, sizel / 2, size2],
    sright2: [ox + x1 + size2 + sizel / 2, oy + y2 + size2, size2, size3],
    sfront2: [ox + x1 + size2, oy + y2 + size2, sizel / 2, size3],
    sleft2: [ox + x1, oy + y2 + size2, size2, size3],
    sback2: [ox + x1 + size2, oy + y2 + size2 * 2 + size3, sizel / 2, size3],
    // long fence rail 1
    ltop1: [ox + x2 + size2, oy + y1, sizel / 2, size2],
    lbottom1: [ox + x2 + size2, oy + y1 + size2 + size3, sizel / 2, size2],
    lright1: [ox + x2 + size2 + sizel, oy + y1 + size2, size2, size3],
    lfront1: [ox + x2 + size2, oy + y1 + size2, sizel / 2, size3],
    lleft1: [ox + x2, oy + y1 + size2, size2, size3],
    lback1: [ox + x2 + size2, oy + y1 + size2 * 2 + size3, sizel / 2, size3],
    l2top1: [ox + x2 + size2 + sizel / 2, oy + y1, sizel / 2, size2],
    l2bottom1: [
      ox + x2 + size2 + sizel / 2,
      oy + y1 + size2 + size3,
      sizel / 2,
      size2,
    ],
    l2front1: [ox + x2 + size2 + sizel / 2, oy + y1 + size2, sizel / 2, size3],
    l2back1: [
      ox + x2 + size2 + sizel / 2,
      oy + y1 + size2 * 2 + size3,
      sizel / 2,
      size3,
    ],
    // long fence rail 2
    ltop2: [ox + x2 + size2, oy + y2, sizel / 2, size2],
    lbottom2: [ox + x2 + size2, oy + y2 + size2 + size3, sizel / 2, size2],
    lright2: [ox + x2 + size2 + sizel, oy + y2 + size2, size2, size3],
    lfront2: [ox + x2 + size2, oy + y2 + size2, sizel / 2, size3],
    lleft2: [ox + x2, oy + y2 + size2, size2, size3],
    lback2: [ox + x2 + size2, oy + y2 + size2 * 2 + size3, sizel / 2, size3],
    l2top2: [ox + x2 + size2 + sizel / 2, oy + y2, sizel / 2, size2],
    l2bottom2: [
      ox + x2 + size2 + sizel / 2,
      oy + y2 + size2 + size3,
      sizel / 2,
      size2,
    ],
    l2front2: [ox + x2 + size2 + sizel / 2, oy + y2 + size2, sizel / 2, size3],
    l2back2: [
      ox + x2 + size2 + sizel / 2,
      oy + y2 + size2 * 2 + size3,
      sizel / 2,
      size3,
    ],
  };
}

export function drawFence(
  generator: Generator,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);

  Face.defineInputRegion(generator, "FenceFaceTop" + blockId, regions.top);
  Face.defineInputRegion(
    generator,
    "FenceFaceBottom" + blockId,
    regions.bottom
  );
  Face.defineInputRegion(generator, "FenceFaceRight" + blockId, regions.right);
  Face.defineInputRegion(generator, "FenceFaceFront" + blockId, regions.front);
  Face.defineInputRegion(generator, "FenceFaceLeft" + blockId, regions.left);
  Face.defineInputRegion(generator, "FenceFaceBack" + blockId, regions.back);

  Face.drawFace(generator, "FenceFaceTop" + blockId, [6, 6, 4, 4], regions.top);
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [6, 6, 4, 4],
    regions.bottom
  );
  Face.drawFace(
    generator,
    "FenceFaceRight" + blockId,
    [6, 0, 4, 16],
    regions.right
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [6, 0, 4, 16],
    regions.front
  );
  Face.drawFace(
    generator,
    "FenceFaceLeft" + blockId,
    [6, 0, 4, 16],
    regions.left
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [6, 0, 4, 16],
    regions.back
  );

  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [10, 7, 6, 2],
    regions.stop1
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [10, 7, 6, 2],
    regions.sbottom1
  );
  Face.drawFace(
    generator,
    "FenceFaceRight" + blockId,
    [7, 1, 2, 3],
    regions.sright1
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [10, 1, 6, 3],
    regions.sfront1
  );
  Face.drawFace(
    generator,
    "FenceFaceLeft" + blockId,
    [7, 1, 2, 3],
    regions.sleft1
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [0, 1, 6, 3],
    regions.sback1,
    { rotate: 180.0 }
  );

  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [10, 7, 6, 2],
    regions.stop2
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [10, 7, 6, 2],
    regions.sbottom2
  );
  Face.drawFace(
    generator,
    "FenceFaceRight" + blockId,
    [7, 7, 2, 3],
    regions.sright2
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [10, 7, 6, 3],
    regions.sfront2
  );
  Face.drawFace(
    generator,
    "FenceFaceLeft" + blockId,
    [7, 7, 2, 3],
    regions.sleft2
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [0, 7, 6, 3],
    regions.sback2,
    { rotate: 180.0 }
  );

  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [10, 7, 6, 2],
    regions.ltop1
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [10, 7, 6, 2],
    regions.lbottom1
  );
  Face.drawFace(
    generator,
    "FenceFaceRight" + blockId,
    [7, 1, 2, 3],
    regions.lright1
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [10, 1, 6, 3],
    regions.lfront1
  );
  Face.drawFace(
    generator,
    "FenceFaceLeft" + blockId,
    [7, 1, 2, 3],
    regions.lleft1
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [0, 1, 6, 3],
    regions.lback1,
    { rotate: 180.0 }
  );
  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [0, 7, 6, 2],
    regions.l2top1
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [0, 7, 6, 2],
    regions.l2bottom1
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [0, 1, 6, 3],
    regions.l2front1
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [7, 1, 6, 3],
    regions.l2back1,
    { rotate: 180.0 }
  );

  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [10, 7, 6, 2],
    regions.ltop2
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [10, 7, 6, 2],
    regions.lbottom2
  );
  Face.drawFace(
    generator,
    "FenceFaceRight" + blockId,
    [7, 7, 2, 3],
    regions.lright2
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [10, 7, 6, 3],
    regions.lfront2
  );
  Face.drawFace(
    generator,
    "FenceFaceLeft" + blockId,
    [7, 7, 2, 3],
    regions.lleft2
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [0, 7, 6, 3],
    regions.lback2,
    { rotate: 180.0 }
  );
  Face.drawFace(
    generator,
    "FenceFaceTop" + blockId,
    [0, 7, 6, 2],
    regions.l2top2
  );
  Face.drawFace(
    generator,
    "FenceFaceBottom" + blockId,
    [0, 7, 6, 2],
    regions.l2bottom2
  );
  Face.drawFace(
    generator,
    "FenceFaceFront" + blockId,
    [0, 7, 6, 3],
    regions.l2front2
  );
  Face.drawFace(
    generator,
    "FenceFaceBack" + blockId,
    [7, 7, 6, 3],
    regions.l2back2,
    { rotate: 180.0 }
  );

  generator.drawImage("Tabs-Fence", [ox - 32, oy - 1]);

  if (showFolds) {
    generator.drawImage("Folds-Fence", [ox - 32, oy - 1]);
  }
}
