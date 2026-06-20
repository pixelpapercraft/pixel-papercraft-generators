import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  defaultSplit,
  drawRectangleButton,
  getBaseFaceId,
  getEdgeControlThickness,
  getRegionUnion,
  getSourceForFace,
  getSplitFaceId,
  getSplitPartFaceIds,
  isDefaultTransform,
  makeBlockRegions,
  parseFaceId,
  sanitizeSplitDimension,
  setDioramaDocument,
  type DioramaDocument,
  type DioramaOptions,
  type SplitPart,
  type SplitConfig,
  type SplitSize,
} from "./shared";

type EdgeDirection = "North" | "South" | "East" | "West";

type SplitRegionDef = {
  region: Region;
  faceIds: string[];
};

export function getCurrentSplit(generator: Generator): SplitSize {
  const width = generator.defineAndGetRangeInput("Split Width", {
    min: 0.5,
    max: 15.5,
    value: defaultSplit.width,
    step: 0.5,
    showValue: true,
  });
  const height = generator.defineAndGetRangeInput("Split Height", {
    min: 0.5,
    max: 15.5,
    value: defaultSplit.height,
    step: 0.5,
    showValue: true,
  });

  return {
    width: sanitizeSplitDimension(width, defaultSplit.width),
    height: sanitizeSplitDimension(height, defaultSplit.height),
  };
}

export function drawSplitRegions(
  generator: Generator,
  options: DioramaOptions
) {
  if (options.editMode !== "Split") {
    return;
  }

  const regions = [
    ...makeFaceSplitRegions(options),
    ...makeColumnSplitRegions(options),
    ...makeRowSplitRegions(options),
    ...makeAllSplitRegions(options),
  ];

  regions.forEach(({ faceIds, region }) => {
    if (options.showEditRegions) {
      drawRectangleButton(generator, region);
    }

    generator.defineRegionInput(region, () => {
      toggleSplitFaces(generator, options, faceIds);
    });
  });
}

function makeFaceSplitRegions(options: DioramaOptions): SplitRegionDef[] {
  return makeBlockRegions(options).map(({ id, region }) => ({
    region,
    faceIds: [id],
  }));
}

function makeColumnSplitRegions(options: DioramaOptions): SplitRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: SplitRegionDef[] = [];

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
      faceIds: faceRegions.map(({ id }) => id),
    });
  }

  return regions;
}

function makeRowSplitRegions(options: DioramaOptions): SplitRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: SplitRegionDef[] = [];

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
      faceIds: faceRegions.map(({ id }) => id),
    });
  }

  return regions;
}

function makeAllSplitRegions(options: DioramaOptions): SplitRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const firstColumnRegion = getRegionUnion(
    blockRegions
      .filter(({ id }) => parseFaceId(id)?.column === options.worldColumnOffset)
      .map(({ region }) => region)
  );
  const firstRowRegion = getRegionUnion(
    blockRegions
      .filter(({ id }) => parseFaceId(id)?.row === options.worldRowOffset)
      .map(({ region }) => region)
  );

  if (!firstColumnRegion || !firstRowRegion) {
    return [];
  }

  const [rowX, rowY, rowWidth] = firstRowRegion;
  const [, columnY, , columnHeight] = firstColumnRegion;
  const regionWidth = getEdgeControlThickness(rowWidth);
  const regionHeight = getEdgeControlThickness(columnHeight);

  return [
    {
      region: [
        rowX >= regionWidth ? rowX - regionWidth : rowX,
        columnY >= regionHeight ? columnY - regionHeight : rowY,
        regionWidth,
        regionHeight,
      ],
      faceIds: blockRegions.map(({ id }) => id),
    },
  ];
}

function toggleSplitFaces(
  generator: Generator,
  options: DioramaOptions,
  faceIds: string[]
) {
  const baseFaceIds = Array.from(
    new Set(faceIds.map(getBaseFaceId).filter((id): id is string => !!id))
  );

  if (baseFaceIds.length === 0) {
    return;
  }

  const nextDocument = baseFaceIds.reduce(
    (document, baseFaceId) =>
      toggleSplitFace(generator, { ...options, document }, baseFaceId),
    options.document
  );

  setDioramaDocument(generator, nextDocument);
}

function toggleSplitFace(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
): DioramaDocument {
  const split = options.document.splits[baseFaceId];
  if (!split) {
    return splitFace(generator, options, baseFaceId);
  }

  if (isSameSplitSize(split, options.currentSplit)) {
    return unsplitFace(generator, options, baseFaceId);
  }

  return resizeSplitFace(
    options.document,
    baseFaceId,
    split,
    options.currentSplit
  );
}

function splitFace(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
): DioramaDocument {
  copyBaseTextureToMissingSplitTextures(generator, baseFaceId);
  copyBaseEdgesToMissingSplitEdges(generator, options, baseFaceId);

  const baseTransform = options.document.transforms[baseFaceId];
  const transforms = { ...options.document.transforms };
  if (baseTransform && !isDefaultTransform(baseTransform)) {
    getSplitPartFaceIds(baseFaceId).forEach((splitFaceId) => {
      transforms[splitFaceId] ??= baseTransform;
    });
  }
  delete transforms[baseFaceId];

  const sources = { ...options.document.sources };
  const parentSource = getSourceForFace(options.document, baseFaceId);
  delete sources[baseFaceId];

  return {
    ...options.document,
    sources,
    transforms,
    splits: {
      ...options.document.splits,
      [baseFaceId]: {
        ...options.currentSplit,
        source: parentSource,
      },
    },
  };
}

function unsplitFace(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
): DioramaDocument {
  const split = options.document.splits[baseFaceId];
  if (!split) {
    return options.document;
  }

  const topLeftFaceId = getSplitFaceId(baseFaceId, "A");
  const topLeftTexture = generator.getStringInputValue(topLeftFaceId);
  if (topLeftTexture !== null) {
    generator.setStringInputValue(baseFaceId, topLeftTexture);
  }
  copySplitEdgesToMissingBaseEdges(generator, options, baseFaceId);

  const sources = { ...options.document.sources };
  sources[baseFaceId] = sources[topLeftFaceId] ?? split.source;

  const transforms = { ...options.document.transforms };
  if (transforms[topLeftFaceId]) {
    transforms[baseFaceId] = transforms[topLeftFaceId];
  } else {
    delete transforms[baseFaceId];
  }

  const splits = { ...options.document.splits };
  delete splits[baseFaceId];

  return {
    ...options.document,
    sources,
    transforms,
    splits,
  };
}

function resizeSplitFace(
  document: DioramaDocument,
  baseFaceId: string,
  split: SplitConfig,
  nextSplit: SplitSize
): DioramaDocument {
  return {
    ...document,
    splits: {
      ...document.splits,
      [baseFaceId]: {
        ...split,
        ...nextSplit,
      },
    },
  };
}

function isSameSplitSize(split: SplitSize, nextSplit: SplitSize): boolean {
  return split.width === nextSplit.width && split.height === nextSplit.height;
}

function copyBaseTextureToMissingSplitTextures(
  generator: Generator,
  baseFaceId: string
) {
  const baseTexture = generator.getStringInputValue(baseFaceId);
  if (baseTexture === null) {
    return;
  }

  getSplitPartFaceIds(baseFaceId).forEach((splitFaceId) => {
    if (generator.getStringInputValue(splitFaceId) === null) {
      generator.setStringInputValue(splitFaceId, baseTexture);
    }
  });
}

function copyBaseEdgesToMissingSplitEdges(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
) {
  copyBaseTabsToSplitTabs(generator, baseFaceId);
  copyBaseFoldsToSplitFolds(generator, baseFaceId);
  copyTopLeftOutsideBaseEdgesToSplitEdges(generator, options, baseFaceId);
}

function copySplitEdgesToMissingBaseEdges(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
) {
  copySplitTabsToBaseTabs(generator, baseFaceId);
  copySplitFoldsToBaseFolds(generator, baseFaceId);
  copyTopLeftOutsideSplitEdgesToBaseEdges(generator, options, baseFaceId);
}

function copyBaseTabsToSplitTabs(generator: Generator, baseFaceId: string) {
  copyEdgeSelectToMissingTargets(generator, baseFaceId, "North", ["A", "B"]);
  copyEdgeSelectToMissingTargets(generator, baseFaceId, "South", ["C", "D"]);
  copyEdgeSelectToMissingTargets(generator, baseFaceId, "East", ["A", "C"]);
  copyEdgeSelectToMissingTargets(generator, baseFaceId, "West", ["B", "D"]);
}

function copyBaseFoldsToSplitFolds(generator: Generator, baseFaceId: string) {
  copyEdgeBooleanToMissingTargets(generator, baseFaceId, "North", ["A", "B"]);
  copyEdgeBooleanToMissingTargets(generator, baseFaceId, "South", ["C", "D"]);
  copyEdgeBooleanToMissingTargets(generator, baseFaceId, "East", ["A", "C"]);
  copyEdgeBooleanToMissingTargets(generator, baseFaceId, "West", ["B", "D"]);
}

function copySplitTabsToBaseTabs(generator: Generator, baseFaceId: string) {
  copyEdgeSelectToMissingBase(generator, baseFaceId, "North", "A");
  copyEdgeSelectToMissingBase(generator, baseFaceId, "South", "C");
  copyEdgeSelectToMissingBase(generator, baseFaceId, "East", "A");
  copyEdgeSelectToMissingBase(generator, baseFaceId, "West", "B");
}

function copySplitFoldsToBaseFolds(generator: Generator, baseFaceId: string) {
  copyEdgeBooleanToMissingBase(generator, baseFaceId, "North", "A");
  copyEdgeBooleanToMissingBase(generator, baseFaceId, "South", "C");
  copyEdgeBooleanToMissingBase(generator, baseFaceId, "East", "A");
  copyEdgeBooleanToMissingBase(generator, baseFaceId, "West", "B");
}

function copyTopLeftOutsideBaseEdgesToSplitEdges(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
) {
  const face = parseFaceId(baseFaceId);
  if (!face) {
    return;
  }

  if (face.row === options.worldRowOffset) {
    copyOutsideEdgeSelectToMissingTargets(
      generator,
      "South",
      face.column,
      face.row - 1,
      ["A", "B"]
    );
    copyOutsideEdgeBooleanToMissingTargets(
      generator,
      "South",
      face.column,
      face.row - 1,
      ["A", "B"]
    );
  }

  if (face.column === options.worldColumnOffset) {
    copyOutsideEdgeSelectToMissingTargets(
      generator,
      "West",
      face.column - 1,
      face.row,
      ["A", "C"]
    );
    copyOutsideEdgeBooleanToMissingTargets(
      generator,
      "West",
      face.column - 1,
      face.row,
      ["A", "C"]
    );
  }
}

function copyTopLeftOutsideSplitEdgesToBaseEdges(
  generator: Generator,
  options: DioramaOptions,
  baseFaceId: string
) {
  const face = parseFaceId(baseFaceId);
  if (!face) {
    return;
  }

  if (face.row === options.worldRowOffset) {
    copyOutsideEdgeSelectToMissingBase(
      generator,
      "South",
      face.column,
      face.row - 1,
      "A"
    );
    copyOutsideEdgeBooleanToMissingBase(
      generator,
      "South",
      face.column,
      face.row - 1,
      "A"
    );
  }

  if (face.column === options.worldColumnOffset) {
    copyOutsideEdgeSelectToMissingBase(
      generator,
      "West",
      face.column - 1,
      face.row,
      "A"
    );
    copyOutsideEdgeBooleanToMissingBase(
      generator,
      "West",
      face.column - 1,
      face.row,
      "A"
    );
  }
}

function copyEdgeSelectToMissingTargets(
  generator: Generator,
  baseFaceId: string,
  direction: EdgeDirection,
  parts: SplitPart[]
) {
  const baseEdgeValue = generator.getSelectInputValue(
    getVariableEdgeId("Tabs", direction, baseFaceId)
  );
  if (baseEdgeValue === null) {
    return;
  }

  parts.forEach((part) => {
    const targetId = getVariableEdgeId(
      "Tabs",
      direction,
      getSplitFaceId(baseFaceId, part)
    );
    if (generator.getSelectInputValue(targetId) === null) {
      generator.setSelectInputValue(targetId, baseEdgeValue);
    }
  });
}

function copyEdgeBooleanToMissingTargets(
  generator: Generator,
  baseFaceId: string,
  direction: EdgeDirection,
  parts: SplitPart[]
) {
  const baseEdgeValue = generator.getBooleanInputValue(
    getVariableEdgeId("Folds", direction, baseFaceId)
  );
  if (baseEdgeValue === null) {
    return;
  }

  parts.forEach((part) => {
    const targetId = getVariableEdgeId(
      "Folds",
      direction,
      getSplitFaceId(baseFaceId, part)
    );
    if (generator.getBooleanInputValue(targetId) === null) {
      generator.setBooleanInputValue(targetId, baseEdgeValue);
    }
  });
}

function copyOutsideEdgeSelectToMissingTargets(
  generator: Generator,
  direction: EdgeDirection,
  column: number,
  row: number,
  parts: SplitPart[]
) {
  const baseEdgeValue = generator.getSelectInputValue(
    getOutsideEdgeId("Tabs", direction, column, row)
  );
  if (baseEdgeValue === null) {
    return;
  }

  parts.forEach((part) => {
    const targetId = getOutsideEdgeId("Tabs", direction, column, row, part);
    if (generator.getSelectInputValue(targetId) === null) {
      generator.setSelectInputValue(targetId, baseEdgeValue);
    }
  });
}

function copyOutsideEdgeBooleanToMissingTargets(
  generator: Generator,
  direction: EdgeDirection,
  column: number,
  row: number,
  parts: SplitPart[]
) {
  const baseEdgeValue = generator.getBooleanInputValue(
    getOutsideEdgeId("Folds", direction, column, row)
  );
  if (baseEdgeValue === null) {
    return;
  }

  parts.forEach((part) => {
    const targetId = getOutsideEdgeId("Folds", direction, column, row, part);
    if (generator.getBooleanInputValue(targetId) === null) {
      generator.setBooleanInputValue(targetId, baseEdgeValue);
    }
  });
}

function copyEdgeSelectToMissingBase(
  generator: Generator,
  baseFaceId: string,
  direction: EdgeDirection,
  part: SplitPart
) {
  const baseEdgeId = getVariableEdgeId("Tabs", direction, baseFaceId);
  if (generator.getSelectInputValue(baseEdgeId) !== null) {
    return;
  }

  const splitEdgeValue = generator.getSelectInputValue(
    getVariableEdgeId("Tabs", direction, getSplitFaceId(baseFaceId, part))
  );
  if (splitEdgeValue !== null) {
    generator.setSelectInputValue(baseEdgeId, splitEdgeValue);
  }
}

function copyEdgeBooleanToMissingBase(
  generator: Generator,
  baseFaceId: string,
  direction: EdgeDirection,
  part: SplitPart
) {
  const baseEdgeId = getVariableEdgeId("Folds", direction, baseFaceId);
  if (generator.getBooleanInputValue(baseEdgeId) !== null) {
    return;
  }

  const splitEdgeValue = generator.getBooleanInputValue(
    getVariableEdgeId("Folds", direction, getSplitFaceId(baseFaceId, part))
  );
  if (splitEdgeValue !== null) {
    generator.setBooleanInputValue(baseEdgeId, splitEdgeValue);
  }
}

function copyOutsideEdgeSelectToMissingBase(
  generator: Generator,
  direction: EdgeDirection,
  column: number,
  row: number,
  part: SplitPart
) {
  const baseEdgeId = getOutsideEdgeId("Tabs", direction, column, row);
  if (generator.getSelectInputValue(baseEdgeId) !== null) {
    return;
  }

  const splitEdgeValue = generator.getSelectInputValue(
    getOutsideEdgeId("Tabs", direction, column, row, part)
  );
  if (splitEdgeValue !== null) {
    generator.setSelectInputValue(baseEdgeId, splitEdgeValue);
  }
}

function copyOutsideEdgeBooleanToMissingBase(
  generator: Generator,
  direction: EdgeDirection,
  column: number,
  row: number,
  part: SplitPart
) {
  const baseEdgeId = getOutsideEdgeId("Folds", direction, column, row);
  if (generator.getBooleanInputValue(baseEdgeId) !== null) {
    return;
  }

  const splitEdgeValue = generator.getBooleanInputValue(
    getOutsideEdgeId("Folds", direction, column, row, part)
  );
  if (splitEdgeValue !== null) {
    generator.setBooleanInputValue(baseEdgeId, splitEdgeValue);
  }
}

function getVariableEdgeId(
  prefix: "Tabs" | "Folds",
  direction: EdgeDirection,
  faceId: string
): string {
  const face = parseFaceId(faceId);
  if (!face) {
    return `${prefix}${direction}${faceId}`;
  }

  return `${prefix}${direction}${face.column} ${face.row}${
    face.splitPart ?? ""
  }`;
}

function getOutsideEdgeId(
  prefix: "Tabs" | "Folds",
  direction: EdgeDirection,
  column: number,
  row: number,
  part?: SplitPart
): string {
  return `${prefix}${direction}${column} ${row}${part ?? ""}`;
}
