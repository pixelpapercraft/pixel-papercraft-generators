import { type RenderContext } from "@genroot/builder";
import { type TabOrientation } from "@genroot/builder/engine/renderers/drawTab";
import { type Dimensions, type Position, type Rectangle } from "./cuboid";
import {
  adjustDimensionsForCenter,
  resolveCuboidFaces,
  resolveFaceVisualRectangle,
  type Center,
  type Orientation,
} from "./minecraft";

const maxEdgeRegionThickness = (16 * 800) / 100 / 4;

export type CuboidTabFace =
  | "front"
  | "back"
  | "top"
  | "bottom"
  | "left"
  | "right";
export type CuboidTabEdge = "Top" | "Bottom" | "Left" | "Right";

export type CuboidTabPlacement = {
  face: CuboidTabFace;
  edge: CuboidTabEdge;
  // Overrides `CuboidTabOptions.tabThickness` for this placement only —
  // different tabs on the same cuboid can glue onto differently-sized
  // targets, so one call-wide thickness isn't always enough.
  tabThickness?: number;
};

export type CuboidTabOptions = {
  baseDimensions?: Dimensions;
  placements?: CuboidTabPlacement[];
  showFoldLine?: boolean;
  tabAngle?: number;
  // Matches the same `center`/`orientation` a `Minecraft.drawCuboid` call
  // used for this cuboid — both are passed straight through to
  // `resolveCuboidFaces`, the same face-resolution `drawCuboid` itself
  // uses, so any face always lands on the real rendered face regardless of
  // which combination is in play.
  center?: Center;
  orientation?: Orientation;
  // Explicit tab thickness in destination px, bypassing the auto-derived
  // `getEdgeTabThickness` sizing entirely. That formula caps a tab at half
  // the depth of the face it protrudes *from* — a reasonable bound for a
  // flap that folds to meet an adjacent face at that same depth, but wrong
  // whenever a tab instead reaches across open space to glue onto an
  // unrelated, differently-sized face (its size has nothing to do with the
  // depth of the face it's attached to).
  tabThickness?: number;
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

export function getEdgeTabThickness(
  baseSize: number,
  faceSize: number
): number {
  return Math.min(baseSize / 4, maxEdgeRegionThickness, faceSize / 2);
}

// `makeCuboidTabFaces` always sizes `right`/`left` off the cuboid's own
// depth on both axes, but sizes `back`'s width-axis off the cuboid's own
// width — so by default, `back`'s Left/Right tabs come out thicker than
// every other tab whenever width and depth differ (which is the common
// case: a cuboid's cross-section is usually not square). Passing this as
// `baseDimensions` makes every face's thickness reference the same single
// value (the cuboid's own depth), so `back`'s Left/Right tabs match
// `right`/`left`'s exactly instead of scaling with width.
export function uniformTabBaseDimensions(dimensions: Dimensions): Dimensions {
  const [, , depth] = dimensions;
  return [depth, depth, depth];
}

type CuboidTabFaceInfo = {
  baseHeight: number;
  baseWidth: number;
  rectangle: Rectangle;
};

// Real face positions come from `resolveCuboidFaces` — the exact function
// `Minecraft.drawCuboid` itself uses — rather than a hand-derived,
// orientation-branching formula. An earlier version of this file
// re-derived positions by hand from `makeDest` directly and drifted from
// what's actually rendered in two ways: it missed the position shift
// `rotateLocalFace` applies to any face carrying accumulated rotation
// (`back`, for `North`/`South` orientations), and it had no equivalent at
// all for `center: "Top"`/`"Bottom"`'s full face relabelling (`front`
// becomes the old `top`'s position, etc — not just a dimension swap).
// Reusing the framework's own resolution keeps this file correct for any
// orientation/center combination by construction, rather than needing to
// re-verify a parallel formula every time.
//
// That still isn't enough on its own: `dest[face].rectangle` is the anchor
// `drawTexture` rotates the face's texture around, not the on-page visual
// position, whenever the face carries a non-zero `rotate` (which several
// faces do under non-`Front`/`Back` centers — e.g. the banner crossbar's
// real `center: "Bottom"` rotates `right`/`left`/`back` all three).
// `resolveFaceVisualRectangle` undoes that anchor shift, so tabs are placed
// against where the face is actually drawn.
//
// `baseWidth`/`baseHeight` (only used for the tab-thickness proportion, not
// placement) follow one rule for all 6 faces: `baseHeight` is always the
// base depth, since a face's Top/Bottom tab thickness is fundamentally
// about how deep the cuboid is, independent of which face it's on.
// `baseWidth` is the base counterpart of *this face's own rectangle-width
// axis* — depth for `right`/`left` (their rectangle width is the cuboid's
// depth), width for every other face (their rectangle width is the
// cuboid's width).
const widthAxisFaces: ReadonlySet<CuboidTabFace> = new Set<CuboidTabFace>([
  "right",
  "left",
]);

function makeCuboidTabFaces(
  position: Position,
  dimensions: Dimensions,
  baseDimensions: Dimensions,
  options: { orientation: Orientation; center: Center }
): Record<CuboidTabFace, CuboidTabFaceInfo> {
  const dest = resolveCuboidFaces(position, dimensions, options);
  const [baseW, , baseD] = adjustDimensionsForCenter(
    baseDimensions,
    options.center
  );
  const faceInfo = (face: CuboidTabFace): CuboidTabFaceInfo => ({
    baseWidth: widthAxisFaces.has(face) ? baseD : baseW,
    baseHeight: baseD,
    rectangle: resolveFaceVisualRectangle(dest[face]),
  });
  const faces: Record<CuboidTabFace, CuboidTabFaceInfo> = {
    front: faceInfo("front"),
    back: faceInfo("back"),
    top: faceInfo("top"),
    bottom: faceInfo("bottom"),
    left: faceInfo("left"),
    right: faceInfo("right"),
  };
  return faces;
}

// Exported for content that draws a tab against an explicit rectangle
// outside the cuboid-face abstraction (e.g. a flat, non-cuboid piece drawn
// alongside a shape's net) — the same tab-region math drawCuboidTabs uses
// per placement, without needing a resolved cuboid face.
export function makeTabRegion(
  [x, y, width, height]: Rectangle,
  edge: CuboidTabEdge,
  baseWidth: number,
  baseHeight: number,
  horizontalFaceSize: number,
  tabThickness: number | undefined
): { region: Rectangle; orientation: TabOrientation } {
  const horizontalThickness =
    tabThickness ?? getEdgeTabThickness(baseHeight, horizontalFaceSize);
  const verticalThickness =
    tabThickness ?? getEdgeTabThickness(baseWidth, width);

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
    default:
      return edge satisfies never;
  }
}

export function drawCuboidTabs(
  ctx: RenderContext,
  position: Position,
  dimensions: Dimensions,
  options: CuboidTabOptions = {}
) {
  const center = options.center ?? "Front";
  const orientation = options.orientation ?? "West";
  const adjustedDimensions = adjustDimensionsForCenter(dimensions, center);
  const faces = makeCuboidTabFaces(
    position,
    dimensions,
    options.baseDimensions ?? dimensions,
    { orientation, center }
  );
  const placements = options.placements ?? defaultPlacements;

  placements.forEach(({ face, edge, tabThickness }) => {
    const { baseHeight, baseWidth, rectangle } = faces[face];
    const { region, orientation } = makeTabRegion(
      rectangle,
      edge,
      baseWidth,
      baseHeight,
      adjustedDimensions[2],
      tabThickness ?? options.tabThickness
    );
    ctx.drawTab(
      region,
      orientation,
      options.showFoldLine ?? false,
      options.tabAngle ?? 45
    );
  });
}
