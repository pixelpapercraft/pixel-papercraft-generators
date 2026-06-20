import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  drawRectangleButton,
  getEdgeControlThickness,
  getRegionUnion,
  isDefaultTransform,
  makeBlockRegions,
  parseFaceId,
  setDioramaDocument,
  type DioramaOptions,
  type FaceRotation,
  type FaceTransform,
} from "./shared";

const rotationChoices = ["0", "90", "180", "270"];
const flipChoices = ["None", "Horizontal", "Vertical"];

type TransformRegionDef = {
  region: Region;
  faceIds: string[];
};

export function getCurrentTransform(generator: Generator): FaceTransform {
  const rotation = generator.defineAndGetSelectInput(
    "Face Rotation",
    rotationChoices
  );
  const flip = generator.defineAndGetSelectInput("Face Flip", flipChoices);

  return {
    rotate: sanitizeRotation(rotation),
    flip: flip === "Horizontal" || flip === "Vertical" ? flip : "None",
  };
}

export function drawTransformRegions(
  generator: Generator,
  options: DioramaOptions
) {
  if (options.editMode !== "Transform") {
    return;
  }

  const regions = [
    ...makeFaceTransformRegions(options),
    ...makeColumnTransformRegions(options),
    ...makeRowTransformRegions(options),
  ];

  regions.forEach(({ region, faceIds }) => {
    if (options.showEditRegions) {
      drawRectangleButton(generator, region);
    }
    generator.defineRegionInput(region, () => {
      setTransformForFaces(generator, options, faceIds);
    });
  });
}

function makeFaceTransformRegions(
  options: DioramaOptions
): TransformRegionDef[] {
  return makeBlockRegions(options).map(({ id, region }) => ({
    region,
    faceIds: [id],
  }));
}

function makeColumnTransformRegions(
  options: DioramaOptions
): TransformRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: TransformRegionDef[] = [];

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

function makeRowTransformRegions(
  options: DioramaOptions
): TransformRegionDef[] {
  const blockRegions = makeBlockRegions(options);
  const regions: TransformRegionDef[] = [];

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

function setTransformForFaces(
  generator: Generator,
  options: DioramaOptions,
  faceIds: string[]
) {
  const transforms = { ...options.document.transforms };

  faceIds.forEach((faceId) => {
    if (isDefaultTransform(options.currentTransform)) {
      delete transforms[faceId];
    } else {
      transforms[faceId] = options.currentTransform;
    }
  });

  setDioramaDocument(generator, {
    ...options.document,
    transforms,
  });
}

function sanitizeRotation(rotation: string | null): FaceRotation {
  switch (rotation) {
    case "90":
      return 90;
    case "180":
      return 180;
    case "270":
      return 270;
    case "0":
    default:
      return 0;
  }
}
