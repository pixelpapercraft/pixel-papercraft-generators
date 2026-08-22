import { type RenderContext } from "@genroot/builder";
import { type Dimensions, type Position, type Rectangle } from "./cuboid";
import {
  adjustDimensionsForCenter,
  type Center,
  type Orientation,
} from "./minecraft";

export type CuboidFoldOptions = {
  orientation?: Orientation;
  // Matches the same `center` a `Minecraft.drawCuboid` call used for this
  // cuboid. `center` never changes a resolved face's *position* (only which
  // content/rotation lands in a fixed slot — see `adjustDimensionsForCenter`'s
  // comment), so the fold lines only need the same dimension swap applied,
  // not a full re-derivation of the net.
  center?: Center;
};

// Draws a fold-line frame 1px outside the given rectangle on every side, so
// the dashed guide sits adjacent to the printed content rather than
// overlapping its own edge pixels.
export function drawRectangleFolds(ctx: RenderContext, rectangle: Rectangle) {
  const [x, y, w, h] = rectangle;

  ctx.drawFoldLine([x, y - 1], [x + w, y - 1]);
  ctx.drawFoldLine([x + w, y], [x + w, y + h]);
  ctx.drawFoldLine([x + w, y + h], [x, y + h]);
  ctx.drawFoldLine([x - 1, y + h], [x - 1, y]);
}

export function drawCuboidFolds(
  ctx: RenderContext,
  position: Position,
  dimensions: Dimensions,
  options: CuboidFoldOptions = {}
) {
  const [x, y] = position;
  const [w, h, d] = adjustDimensionsForCenter(
    dimensions,
    options.center ?? "Front"
  );
  const orientation = options.orientation ?? "West";

  switch (orientation) {
    case "East": {
      drawRectangleFolds(ctx, [x + w + d, y, w, d * 2 + h]);
      drawRectangleFolds(ctx, [x, y + d, d * 2 + w * 2, h]);
      ctx.drawFoldLine([x + w, y + d], [x + w, y + d + h]);
      break;
    }
    case "North": {
      drawRectangleFolds(ctx, [x + d, y, w, d * 2 + h * 2]);
      drawRectangleFolds(ctx, [x, y + d, d * 2 + w, h]);
      ctx.drawFoldLine(
        [x + d, y + d * 2 + h - 1],
        [x + d + w, y + d * 2 + h - 1]
      );
      break;
    }
    case "South": {
      drawRectangleFolds(ctx, [x + d, y, w, d * 2 + h * 2]);
      drawRectangleFolds(ctx, [x, y + d + h, d * 2 + w, h]);
      ctx.drawFoldLine([x + d, y + h], [x + d + w, y + h]);
      break;
    }
    case "West": {
      drawRectangleFolds(ctx, [x + d, y, w, d * 2 + h]);
      drawRectangleFolds(ctx, [x, y + d, d * 2 + w * 2, h]);
      ctx.drawFoldLine(
        [x + d * 2 + w - 1, y + d],
        [x + d * 2 + w - 1, y + d + h]
      );
      break;
    }
    default:
      return orientation satisfies never;
  }
}
