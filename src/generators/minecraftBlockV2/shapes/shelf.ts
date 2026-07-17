import { type BlockRenderContext, type Region } from "../blockRenderContext";
import * as Face from "../face";

type ShelfState = "Unpowered" | "Single" | "Left" | "Center" | "Right";

type ShelfFaces = {
  top: Region;
  top0: Region;
  top1: Region;
  bottom: Region;
  bottom0: Region;
  bottom1: Region;
  right: Region;
  right0: Region;
  right1: Region;
  front: Region;
  front0: Region;
  front1: Region;
  left: Region;
  left0: Region;
  left1: Region;
  back: Region;
};

const shelfStateOptions: ShelfState[] = [
  "Unpowered",
  "Single",
  "Left",
  "Center",
  "Right",
];

const shelfFrontSources: Record<ShelfState, Region> = {
  Unpowered: [0, 2, 8, 4],
  Single: [8, 12, 8, 4],
  Left: [0, 8, 8, 4],
  Center: [0, 12, 8, 4],
  Right: [8, 8, 8, 4],
};

const size = 128;

function makeFaces(ox: number, oy: number): ShelfFaces {
  return {
    top: [ox + size, oy + (size * 11) / 16, size, (size * 3) / 16],
    bottom: [ox + size, oy + (size * 38) / 16, size, (size * 3) / 16],
    right: [ox + (size * 11) / 16, oy + size, (size * 3) / 16, size],
    front: [ox + size, oy + (size * 22) / 16, size, size / 2],
    left: [ox + (size * 34) / 16, oy + size, (size * 3) / 16, size],
    back: [ox + (size * 37) / 16, oy + size, size, size],

    top0: [ox + size, oy + (size * 30) / 16, size, (size * 2) / 16],
    bottom0: [ox + size, oy + (size * 36) / 16, size, (size * 2) / 16],
    right0: [
      ox + (size * 14) / 16,
      oy + (size * 7) / 4,
      (size * 2) / 16,
      size / 4,
    ],
    front0: [ox + size, oy + size * 2, size, size / 4],
    left0: [ox + size * 2, oy + (size * 7) / 4, (size * 2) / 16, size / 4],

    top1: [ox + size, oy + (size * 14) / 16, size, (size * 2) / 16],
    bottom1: [ox + size, oy + (size * 20) / 16, size, (size * 2) / 16],
    right1: [ox + (size * 14) / 16, oy + size, (size * 2) / 16, size / 4],
    front1: [ox + size, oy + size, size, size / 4],
    left1: [ox + size * 2, oy + size, (size * 2) / 16, size / 4],
  };
}

function getFrontSource(state: string | null): Region {
  switch (state) {
    case "Single":
    case "Left":
    case "Center":
    case "Right":
    case "Unpowered":
      return shelfFrontSources[state];
    default:
      return shelfFrontSources.Unpowered;
  }
}

export function drawShelf(
  generator: BlockRenderContext,
  blockId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const stateInputId = `Block ${blockId} State`;
  generator.defineSelectInput(stateInputId, shelfStateOptions);

  const frontSource = getFrontSource(
    generator.getSelectInputValue(stateInputId)
  );
  const regions = makeFaces(ox, oy);
  const shelfFaceId = `ShelfFace${blockId}`;

  Face.defineInputRegion(generator, shelfFaceId, regions.front);

  Face.drawFace(generator, shelfFaceId, [8, 3.5, 8, 1.5], regions.top);
  Face.drawFace(generator, shelfFaceId, [8, 4.5, 8, 1.5], regions.bottom);
  Face.drawFace(generator, shelfFaceId, [8, 0, 1.5, 8], regions.right);
  Face.drawFace(generator, shelfFaceId, frontSource, regions.front);
  Face.drawFace(generator, shelfFaceId, [14.5, 0, 1.5, 8], regions.left);
  Face.drawFace(generator, shelfFaceId, [8, 0, 8, 8], regions.back);

  Face.drawFace(generator, shelfFaceId, [8, 3.5, 8, 1], regions.top0, {
    rotate: 180,
  });
  Face.drawFace(generator, shelfFaceId, [8, 3.5, 8, 1], regions.bottom0);
  Face.drawFace(generator, shelfFaceId, [1.5, 6, 1, 2], regions.right0);
  Face.drawFace(generator, shelfFaceId, [0, 6, 8, 2], regions.front0);
  Face.drawFace(generator, shelfFaceId, [5.5, 6, 1, 2], regions.left0);

  Face.drawFace(generator, shelfFaceId, [8, 5, 8, 1], regions.top1);
  Face.drawFace(generator, shelfFaceId, [8, 5, 8, 1], regions.bottom1, {
    rotate: 180,
  });
  Face.drawFace(generator, shelfFaceId, [1.5, 0, 1, 2], regions.right1);
  Face.drawFace(generator, shelfFaceId, [0, 0, 8, 2], regions.front1);
  Face.drawFace(generator, shelfFaceId, [5.5, 0, 1, 2], regions.left1);

  generator.drawImage("Tabs-Shelf", [ox - 32, oy - 1]);
  if (showFolds) {
    generator.drawImage("Folds-Shelf", [ox - 32, oy - 1]);
  }
}
