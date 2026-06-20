import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  drawRectangleButton,
  makeEdgeControlRegions,
  makeEdgeRegions,
  type DioramaOptions,
  type RegionDef,
} from "./shared";

export function drawFolds(generator: Generator, options: DioramaOptions) {
  const regions = makeEdgeRegions(options);
  const controlRegions = new Map(
    makeEdgeControlRegions(options).map(({ id, region }) => [id, region])
  );

  regions.forEach(({ id, region }) => {
    const controlRegion = controlRegions.get(id) ?? region;
    const foldId = `Folds${id}`;
    const isFoldEnabled = generator.getBooleanInputValue(foldId) ?? false;

    if (options.editMode === "Folds") {
      if (options.showEditRegions) {
        drawRectangleButton(generator, controlRegion);
      }
      generator.defineRegionInput(controlRegion, () => {
        generator.setBooleanInputValue(foldId, !isFoldEnabled);
      });
    }
  });

  regions.forEach(({ id, region, rotation }) => {
    const foldId = `Folds${id}`;
    const isFoldEnabled = generator.getBooleanInputValue(foldId) ?? false;

    if (isFoldEnabled) {
      drawFoldLine(generator, region, rotation, options.showEditRegions);
    }
  });
}

function drawFoldLine(
  generator: Generator,
  [x, y, width, height]: Region,
  rotation: RegionDef["rotation"],
  isEditMode: boolean
) {
  const drawLine = isEditMode
    ? (from: [number, number], to: [number, number]) =>
        generator.drawLine(from, to, {
          color: "#dc2626",
          width: 1,
          lineDash: [2, 2],
          lineDashOffset: 3,
        })
    : (from: [number, number], to: [number, number]) =>
        generator.drawFoldLine(from, to);

  switch (rotation) {
    case 0:
      drawLine([x, y + height - 1], [x + width, y + height - 1]);
      break;
    case 1:
      drawLine([x, y], [x, y + height]);
      break;
    case 2:
      drawLine([x, y], [x + width, y]);
      break;
    case 3:
      drawLine([x + width - 1, y], [x + width - 1, y + height]);
      break;
  }
}
