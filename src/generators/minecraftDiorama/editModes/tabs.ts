import type { Generator } from "@genroot/builder/modules/generator";
import {
  drawRectangleButton,
  makeEdgeControlRegions,
  makeEdgeRegions,
  type DioramaOptions,
  type RegionDef,
} from "./shared";

export function drawTabs(generator: Generator, options: DioramaOptions) {
  const regions = makeEdgeRegions(options);
  const controlRegions = new Map(
    makeEdgeControlRegions(options).map(({ id, region }) => [id, region])
  );

  regions.forEach(({ id, region, rotation }) => {
    const controlRegion = controlRegions.get(id) ?? region;
    const tabId = `Tabs${id}`;
    const tabValue = parseInt(generator.getSelectInputValue(tabId) ?? "0", 10);

    if (options.editMode === "Tabs") {
      if (options.showEditRegions) {
        drawRectangleButton(generator, controlRegion);
      }
      generator.defineRegionInput(controlRegion, () => {
        generator.setSelectInputValue(
          tabId,
          getNextTabValue(tabValue).toString()
        );
      });
    }

    if (tabValue > 0) {
      generator.drawTab(
        region,
        getTabOrientation(rotation),
        false,
        45,
        getTabType(tabValue)
      );
    }
  });
}

function getNextTabValue(value: number): number {
  return value === 4 ? 0 : value + 1;
}

function getTabType(value: number) {
  switch (value) {
    case 1:
      return "Regular";
    case 2:
      return "Left";
    case 3:
      return "Middle";
    case 4:
      return "Right";
    default:
      return "Regular";
  }
}

function getTabOrientation(rotation: RegionDef["rotation"]) {
  switch (rotation) {
    case 0:
      return "North";
    case 1:
      return "East";
    case 2:
      return "South";
    case 3:
      return "West";
  }
}
