import {
  type Generator,
  type Region,
  type TexturePlugin,
} from "@genroot/builder/modules/generator";
import * as Face from "../face";
import {
  shield,
  type Dimensions,
} from "@genroot/generators/_common/minecraftEntity";
import { type GlintControls } from "@genroot/generators/_common/plugins/glint";

type Faces = {
  shield: Region;
};

const shieldGlintCoordinateScale = 24;

function makeFaces(ox: number, oy: number): Faces {
  return {
    shield: [ox + 96, oy + 312, 288, 528],
  };
}

function makeGlintInputId(templateId: string): string {
  return `Template ${templateId} Shield Glint`;
}

function scaleGlintPlugin(
  plugin: TexturePlugin | undefined
): TexturePlugin | undefined {
  if (!plugin) {
    return undefined;
  }

  return (coordinates, context) =>
    plugin(
      {
        ...coordinates,
        sx: coordinates.dx / shieldGlintCoordinateScale,
        sy: coordinates.dy / shieldGlintCoordinateScale,
        sw: coordinates.dw / shieldGlintCoordinateScale,
        sh: coordinates.dh / shieldGlintCoordinateScale,
      },
      context
    );
}

export function drawShield(
  generator: Generator,
  templateId: string,
  ox: number,
  oy: number,
  showFolds: boolean,
  glint: GlintControls
) {
  const regions = makeFaces(ox, oy);
  const patternFaceId = Face.makePatternFaceId(templateId);
  const baseInputId = Face.makeTemplateBaseInputId(templateId, "shield");
  const glintInputId = makeGlintInputId(templateId);
  const glintEnabled = generator.getBooleanInputValueWithDefault(
    glintInputId,
    false
  );
  const glintPlugin = scaleGlintPlugin(glint.getPlugin(glintEnabled));

  Face.defineBaseInput(generator, templateId, "shield");

  Face.defineInputRegion(generator, patternFaceId, regions.shield);
  generator.defineRegionInput([ox + 408, oy + 312, 288, 528], () => {
    generator.setBooleanInputValue(glintInputId, !glintEnabled);
  });

  let dimensions: Dimensions = [288, 528, 24];

  Face.drawCuboid(
    generator,
    patternFaceId,
    "shield",
    shield.shield,
    [ox + 72, oy + 288],
    dimensions,
    { plugin: glintPlugin ?? null },
    baseInputId
  );

  dimensions = [48, 144, 144];

  Face.drawCuboid(
    generator,
    patternFaceId,
    "shield",
    shield.handle,
    [ox + 986, oy + 360],
    dimensions,
    { center: "Right", plugin: glintPlugin ?? null },
    baseInputId
  );

  // handle inside

  const [hx, hy] = [ox + 1010, oy + 720];

  Face.drawFace(
    generator,
    patternFaceId,
    [32, 7, 2, 4],
    [hx, hy, 48, 96],
    { rotate: 270, plugin: glintPlugin },
    baseInputId
  );
  Face.drawFace(
    generator,
    patternFaceId,
    [34, 1, 2, 4],
    [hx + 96, hy, 48, 96],
    { rotate: 90, plugin: glintPlugin },
    baseInputId
  );
  Face.drawFace(
    generator,
    patternFaceId,
    [40, 7, 2, 4],
    [hx + 96 * 2, hy, 48, 96],
    { rotate: 270, plugin: glintPlugin },
    baseInputId
  );
  Face.drawFace(
    generator,
    patternFaceId,
    [32, 1, 2, 4],
    [hx + 96 * 3, hy, 48, 96],
    { rotate: 270, plugin: glintPlugin },
    baseInputId
  );

  generator.drawImage("Tabs-Shield", [ox - 96, oy - 3]);

  if (showFolds) {
    generator.drawImage("Folds-Shield", [ox - 96, oy - 3]);
  }
}
