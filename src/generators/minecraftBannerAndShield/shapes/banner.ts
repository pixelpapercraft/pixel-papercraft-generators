import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import * as Face from "../face";
import {
  banner,
  type Dimensions,
} from "@genroot/generators/_common/minecraftEntity";

type Faces = {
  flag: Region;
};

function makeFaces(ox: number, oy: number): Faces {
  return {
    flag: [ox + 209, oy + 336, 320, 640], // [ox + size + depth, oy + depth, width, height],
  };
}

export function drawBanner(
  generator: Generator,
  templateId: string,
  ox: number,
  oy: number,
  showFolds: boolean
) {
  const regions = makeFaces(ox, oy);
  const patternFaceId = Face.makePatternFaceId(templateId);
  const baseInputId = Face.makeTemplateBaseInputId(templateId, "banner");

  Face.defineBaseInput(generator, templateId, "banner");

  Face.defineInputRegion(generator, patternFaceId, regions.flag);

  let dimensions: Dimensions = [320, 640, 16];

  Face.drawCuboid(
    generator,
    patternFaceId,
    "banner",
    banner.flag,
    [ox + 193, oy + 320],
    dimensions,
    {},
    baseInputId
  );

  dimensions = [32, 704, 32];

  Face.drawCuboid(
    generator,
    patternFaceId,
    "banner",
    banner.pole,
    [ox + 1121, oy + 272],
    dimensions,
    {},
    baseInputId
  );

  dimensions = [320, 32, 32];

  Face.drawCuboid(
    generator,
    patternFaceId,
    "banner",
    banner.bar,
    [ox + 345, oy + 64],
    dimensions,
    { center: "Bottom", orientation: "North" },
    baseInputId
  );

  generator.drawImage("Tabs-Banner", [ox - 96, oy - 3]);

  if (showFolds) {
    generator.drawImage("Folds-Banner", [ox - 96, oy - 3]);
  }
}
