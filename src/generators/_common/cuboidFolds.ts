import { type Generator } from "@genroot/builder/modules/generator";
import { type Dimensions, type Position, type Rectangle } from "./cuboid";
import { type Orientation } from "./minecraft";

export type CuboidFoldOptions = {
  orientation?: Orientation;
};

export function drawRectangleFolds(generator: Generator, rectangle: Rectangle) {
  const [x, y, w, h] = rectangle;

  generator.drawFoldLine([x, y - 1], [x + w, y - 1]);
  generator.drawFoldLine([x + w, y], [x + w, y + h]);
  generator.drawFoldLine([x + w - 1, y + h], [x, y + h]);
  generator.drawFoldLine([x - 1, y + h - 1], [x - 1, y]);
}

export function drawCuboidFolds(
  generator: Generator,
  position: Position,
  dimensions: Dimensions,
  options: CuboidFoldOptions = {}
) {
  const [x, y] = position;
  const [w, h, d] = dimensions;
  const orientation = options.orientation ?? "West";

  switch (orientation) {
    case "East": {
      drawRectangleFolds(generator, [x + w + d, y, w, d * 2 + h]);
      drawRectangleFolds(generator, [x, y + d, d * 2 + w * 2, h]);
      generator.drawFoldLine([x + w, y + d], [x + w, y + d + h]);
      break;
    }
    case "North": {
      drawRectangleFolds(generator, [x + d, y, w, d * 2 + h * 2]);
      drawRectangleFolds(generator, [x, y + d, d * 2 + w, h]);
      generator.drawFoldLine(
        [x + d, y + d * 2 + h - 1],
        [x + d + w, y + d * 2 + h - 1]
      );
      break;
    }
    case "South": {
      drawRectangleFolds(generator, [x + d, y, w, d * 2 + h * 2]);
      drawRectangleFolds(generator, [x, y + d + h, d * 2 + w, h]);
      generator.drawFoldLine([x + d, y + h], [x + d + w, y + h]);
      break;
    }
    case "West": {
      drawRectangleFolds(generator, [x + d, y, w, d * 2 + h]);
      drawRectangleFolds(generator, [x, y + d, d * 2 + w * 2, h]);
      generator.drawFoldLine(
        [x + d * 2 + w - 1, y + d],
        [x + d * 2 + w - 1, y + d + h]
      );
      break;
    }
  }
}
