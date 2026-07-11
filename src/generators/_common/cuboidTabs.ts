import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import { type TabOrientation } from "@genroot/builder/modules/renderers/drawTab";
import { type Dimensions, type Position, type Rectangle } from "./cuboid";

const maxEdgeRegionThickness = (16 * 800) / 100 / 4;

export type CuboidTabFace = "right" | "left" | "back";
export type CuboidTabEdge = "Top" | "Bottom" | "Left" | "Right";

export type CuboidTabPlacement = {
  face: CuboidTabFace;
  edge: CuboidTabEdge;
};

export type CuboidTabOptions = {
  baseDimensions?: Dimensions;
  placements?: CuboidTabPlacement[];
  showFoldLine?: boolean;
  tabAngle?: number;
};

const defaultPlacements: CuboidTabPlacement[] = [
  { face: "right", edge: "Top" },
  { face: "right", edge: "Bottom" },
  { face: "right", edge: "Left" },
  { face: "left", edge: "Top" },
  { face: "left", edge: "Bottom" },
  { face: "back", edge: "Top" },
  { face: "back", edge: "Bottom" },
];

export function getDioramaEdgeTabThickness(
  baseSize: number,
  faceSize: number
): number {
  return Math.min(baseSize / 4, maxEdgeRegionThickness, faceSize / 2);
}

function makeWestCuboidFaces(
  [x, y]: Position,
  [w, h, d]: Dimensions,
  [baseW, , baseD]: Dimensions
): Record<
  CuboidTabFace,
  {
    baseHeight: number;
    baseWidth: number;
    rectangle: Rectangle;
  }
> {
  return {
    right: {
      baseWidth: baseD,
      baseHeight: baseD,
      rectangle: [x, y + d, d, h],
    },
    left: {
      baseWidth: baseD,
      baseHeight: baseD,
      rectangle: [x + d + w, y + d, d, h],
    },
    back: {
      baseWidth: baseW,
      baseHeight: baseD,
      rectangle: [x + d * 2 + w, y + d, w, h],
    },
  };
}

function makeTabRegion(
  [x, y, width, height]: Rectangle,
  edge: CuboidTabEdge,
  baseWidth: number,
  baseHeight: number,
  horizontalFaceSize: number
): { region: Region; orientation: TabOrientation } {
  const horizontalThickness = getDioramaEdgeTabThickness(
    baseHeight,
    horizontalFaceSize
  );
  const verticalThickness = getDioramaEdgeTabThickness(baseWidth, width);

  switch (edge) {
    case "Top":
      return {
        region: [x, y - horizontalThickness, width, horizontalThickness],
        orientation: "North",
      };
    case "Bottom":
      return {
        region: [x, y + height, width, horizontalThickness],
        orientation: "South",
      };
    case "Left":
      return {
        region: [x - verticalThickness, y, verticalThickness, height],
        orientation: "West",
      };
    case "Right":
      return {
        region: [x + width, y, verticalThickness, height],
        orientation: "East",
      };
  }
}

export function drawCuboidTabs(
  generator: Generator,
  position: Position,
  dimensions: Dimensions,
  options: CuboidTabOptions = {}
) {
  const faces = makeWestCuboidFaces(
    position,
    dimensions,
    options.baseDimensions ?? dimensions
  );
  const placements = options.placements ?? defaultPlacements;

  placements.forEach(({ face, edge }) => {
    const { baseHeight, baseWidth, rectangle } = faces[face];
    const { region, orientation } = makeTabRegion(
      rectangle,
      edge,
      baseWidth,
      baseHeight,
      dimensions[2]
    );
    generator.drawTab(
      region,
      orientation,
      options.showFoldLine ?? false,
      options.tabAngle ?? 45
    );
  });
}
