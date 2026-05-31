import { makeCanvasWithContext } from "@genroot/builder/modules/canvasWithContext";
import {
  type Generator,
  type TexturePlugin,
} from "@genroot/builder/modules/generator";
import { type Texture } from "@genroot/builder/modules/texture";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import enchantedGlintEntity from "@genroot/generators/_common/textures/enchanted_glint_entity.png";
import enchantedGlintItem from "@genroot/generators/_common/textures/enchanted_glint_item.png";
import enchantedGlintOld from "@genroot/generators/_common/textures/enchanted_item_glint.png";

export type GlintPluginOptions = {
  opacity: number;
  xOffset: number;
  yOffset: number;
};

const GLINT_TEXTURE_STANDARD_SIZE = 128;

export const entityGlintTextureDefs: TextureDef[] = [
  {
    id: "Enchanted Glint",
    url: enchantedGlintEntity.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
  {
    id: "1.20+",
    url: enchantedGlintEntity.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
  {
    id: "Pre-1.20",
    url: enchantedGlintOld.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
];

export const itemGlintTextureDefs: TextureDef[] = [
  {
    id: "Enchanted Glint",
    url: enchantedGlintItem.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
  {
    id: "1.20+",
    url: enchantedGlintItem.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
  {
    id: "Pre-1.20",
    url: enchantedGlintOld.src,
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
  },
];

export type GlintControls = {
  getPlugin: (enabled: boolean) => TexturePlugin | undefined;
};

export function defineGlintControlInputs(generator: Generator): void {
  generator.defineTextureInput("Enchanted Glint", {
    standardWidth: GLINT_TEXTURE_STANDARD_SIZE,
    standardHeight: GLINT_TEXTURE_STANDARD_SIZE,
    choices: ["1.20+", "Pre-1.20"],
  });

  generator.defineAndGetRangeInput("Glint Opacity", {
    min: 0,
    max: 255,
    value: 255,
    step: 1,
  });
  generator.defineAndGetRangeInput("Glint X Offset", {
    min: 0,
    max: GLINT_TEXTURE_STANDARD_SIZE,
    value: 0,
    step: 1,
  });
  generator.defineAndGetRangeInput("Glint Y Offset", {
    min: 0,
    max: GLINT_TEXTURE_STANDARD_SIZE,
    value: 0,
    step: 1,
  });
}

export function getGlintControls(generator: Generator): GlintControls {
  const opacity = generator.getNumberVariable("Glint Opacity") ?? 255;
  const xOffset = generator.getNumberVariable("Glint X Offset") ?? 0;
  const yOffset = generator.getNumberVariable("Glint Y Offset") ?? 0;
  const glintTexture = generator.getTexture("Enchanted Glint");
  const glintPluginOptions: GlintPluginOptions = {
    opacity: opacity / 255,
    xOffset,
    yOffset,
  };

  return {
    getPlugin: (enabled) =>
      glintTexture && enabled
        ? makeGlintPlugin(glintTexture, glintPluginOptions)
        : undefined,
  };
}

export function defineGlintControls(generator: Generator): GlintControls {
  defineGlintControlInputs(generator);
  return getGlintControls(generator);
}

export const makeGlintPlugin: (
  texture: Texture,
  options: GlintPluginOptions
) => TexturePlugin = (glintTexture, glintOptions) => (coordinates, context) => {
  const { sx, sy, sw, sh, dw, dh } = coordinates;
  const { opacity, xOffset, yOffset } = glintOptions;
  const glintWidth = glintTexture.standardWidth;
  const glintHeight = glintTexture.standardHeight;

  // Create base-only canvas for masking
  const baseOnly = makeCanvasWithContext(dw, dh);
  baseOnly.context.drawImage(context.canvas, 0, 0);

  // Create glint layer
  const glintLayer = makeCanvasWithContext(dw, dh);

  // Step 1: Draw base to glint layer
  glintLayer.context.drawImage(context.canvas, 0, 0);

  // Step 2: Add the glint with transformations
  glintLayer.context.save();
  glintLayer.context.globalAlpha = opacity;
  glintLayer.context.globalCompositeOperation = "lighter";

  // Apply wrapped offsets to the glint texture
  const sourceX = (sx + xOffset) % glintWidth;
  const sourceY = (sy + yOffset) % glintHeight;

  // Wrap around if offsets push outside bounds
  const wrappedX = (sourceX + glintWidth) % glintWidth;
  const wrappedY = (sourceY + glintHeight) % glintHeight;
  const glintCanvas = glintTexture.imageWithCanvas.canvasWithContext.canvas;

  for (let y = 0; y < sh; ) {
    const tileY = (wrappedY + y) % glintHeight;
    const tileHeight = Math.min(glintHeight - tileY, sh - y);

    for (let x = 0; x < sw; ) {
      const tileX = (wrappedX + x) % glintWidth;
      const tileWidth = Math.min(glintWidth - tileX, sw - x);

      glintLayer.context.drawImage(
        glintCanvas,
        tileX,
        tileY,
        tileWidth,
        tileHeight,
        (x / sw) * dw,
        (y / sh) * dh,
        (tileWidth / sw) * dw,
        (tileHeight / sh) * dh
      );

      x += tileWidth;
    }

    y += tileHeight;
  }

  glintLayer.context.restore();

  // Step 3: Mask to original alpha
  glintLayer.context.globalCompositeOperation = "destination-in";
  glintLayer.context.drawImage(baseOnly.canvas, 0, 0);

  // Step 4: Return the final canvas
  return glintLayer.canvas;
};
