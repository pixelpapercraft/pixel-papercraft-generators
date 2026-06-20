import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  blockPresets,
  drawRectangleButton,
  getDefaultDestinationForPreset,
  getEdgeControlThickness,
  getRegionUnion,
  makeBlockRegions,
  makeEmptyDioramaDocument,
  parseFaceId,
  sanitizePreset,
  setDioramaDocument,
  type DioramaDocument,
  type DestinationSize,
  type DioramaOptions,
} from "./shared";

type DestinationRegionDef = {
  region: Region;
  column: number | null;
  row: number | null;
};

export function getCurrentDestination(
  generator: Generator,
  defaultValue: DestinationSize
): DestinationSize {
  const width = generator.defineAndGetRangeInput("Destination Width", {
    min: 1,
    max: 32,
    value: defaultValue.width,
    step: 1,
    showValue: true,
  });
  const height = generator.defineAndGetRangeInput("Destination Height", {
    min: 1,
    max: 32,
    value: defaultValue.height,
    step: 1,
    showValue: true,
  });

  return { width, height };
}

export function drawDestinationRegions(
  generator: Generator,
  options: DioramaOptions
) {
  if (options.editMode !== "Destination") {
    return;
  }

  const regions = [
    ...makeFaceDestinationRegions(options),
    ...makeColumnDestinationRegions(options),
    ...makeRowDestinationRegions(options),
  ];

  regions.forEach(({ region, column, row }) => {
    if (options.showEditRegions) {
      drawRectangleButton(generator, region);
    }
    generator.defineRegionInput(region, () => {
      setDestination(generator, options, { column, row });
    });
  });
}

export function defineAndGetPresetInput(
  generator: Generator,
  document: DioramaDocument
): DioramaDocument {
  if (!generator.getSelectInputValue("Block Preset")) {
    generator.setSelectInputValue("Block Preset", document.preset);
  }

  const preset = sanitizePreset(
    generator.defineAndGetSelectInput("Block Preset", blockPresets)
  );
  if (preset === document.preset) {
    return document;
  }

  const nextDocument = makeEmptyDioramaDocument(preset);
  const destination = getDefaultDestinationForPreset(preset);
  generator.setNumberVariable("Destination Width", destination.width);
  generator.setNumberVariable("Destination Height", destination.height);
  setDioramaDocument(generator, nextDocument);

  return nextDocument;
}

function makeFaceDestinationRegions(
  options: DioramaOptions
): DestinationRegionDef[] {
  return makeBlockRegions(options).map(({ id, region }) => ({
    region,
    ...getFacePosition(id),
  }));
}

function makeColumnDestinationRegions(
  options: DioramaOptions
): DestinationRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: DestinationRegionDef[] = [];

  for (let column = 0; column < options.columns; column += 1) {
    const worldColumn = column + options.worldColumnOffset;
    const faceRegions = blockRegions.filter(
      ({ id }) => parseFaceId(id)?.column === worldColumn
    );
    const region = getRegionUnion(faceRegions.map(({ region }) => region));
    if (!region) {
      continue;
    }
    const [x, y, width, height] = region;
    const regionHeight = getEdgeControlThickness(height);
    regions.push({
      region: [
        x,
        y >= regionHeight ? y - regionHeight : y,
        width,
        regionHeight,
      ],
      column: worldColumn,
      row: null,
    });
  }

  return regions;
}

function makeRowDestinationRegions(
  options: DioramaOptions
): DestinationRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: DestinationRegionDef[] = [];

  for (let row = 0; row < options.rows; row += 1) {
    const worldRow = row + options.worldRowOffset;
    const faceRegions = blockRegions.filter(
      ({ id }) => parseFaceId(id)?.row === worldRow
    );
    const region = getRegionUnion(faceRegions.map(({ region }) => region));
    if (!region) {
      continue;
    }
    const [x, y, width, height] = region;
    const regionWidth = getEdgeControlThickness(width);
    regions.push({
      region: [x >= regionWidth ? x - regionWidth : x, y, regionWidth, height],
      column: null,
      row: worldRow,
    });
  }

  return regions;
}

function setDestination(
  generator: Generator,
  options: DioramaOptions,
  target: Pick<DestinationRegionDef, "column" | "row">
) {
  const destinationColumns = { ...options.document.destinationColumns };
  const destinationRows = { ...options.document.destinationRows };

  if (target.column !== null) {
    setDestinationValue(
      destinationColumns,
      target.column,
      options.currentDestination.width,
      getDefaultDestinationForPreset(options.document.preset).width
    );
  }
  if (target.row !== null) {
    setDestinationValue(
      destinationRows,
      target.row,
      options.currentDestination.height,
      getDefaultDestinationForPreset(options.document.preset).height
    );
  }

  setDioramaDocument(generator, {
    ...options.document,
    destinationColumns,
    destinationRows,
  });
}

function setDestinationValue(
  destinations: Record<string, number>,
  index: number,
  value: number,
  defaultValue: number
) {
  if (value === defaultValue) {
    delete destinations[index];
  } else {
    destinations[index] = value;
  }
}

function getFacePosition(
  id: string
): Pick<DestinationRegionDef, "column" | "row"> {
  const face = parseFaceId(id);
  if (!face) {
    return { column: null, row: null };
  }
  return {
    column: face.column,
    row: face.row,
  };
}
