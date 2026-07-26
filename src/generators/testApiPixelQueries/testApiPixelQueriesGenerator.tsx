"use client";

import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RenderContext,
  type TextureDef,
} from "@genroot/builder";
import quadrants from "@genroot/generators/testApiDrawingTextures/fixtures/quadrants.png";

const id = "test-api-pixel-queries";

const name = "Test API: Pixel Queries";

const instructions: InstructionsDef = `
Generator API coverage board for texture existence, texture lookup, and image,
texture, and page pixel-query methods. Each query result produces a small,
deterministic marker, so exact browser pixel reads assert the public API
contract without relying on screenshots.
`;

const images: ImageDef[] = [{ id: "Quadrants", url: quadrants.src }];

const textures: TextureDef[] = [
  {
    id: "Quadrants",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
];

// This coverage board has no controls — it exists to exercise the render API,
// so nothing feeds in from the UI. A module-level empty value keeps a stable
// identity across renders (`props` is a `<GeneratorRenderer>` memo dependency).
type PixelQueriesProps = Record<string, never>;

const noProps: PixelQueriesProps = {};

// Takes no `props` parameter at all: a narrower render function is assignable
// to the two-parameter `Generator<Props>["render"]`, and there is nothing to
// read from an empty props object.
const render = (ctx: RenderContext): void => {
  // --- Page 0: texture existence and retrieval (39–40) --------------------
  ctx.usePage("Texture Lookup");
  ctx.fillRectangle(
    [20, 20, 10, 10],
    ctx.hasTexture("Quadrants") ? "#00aa00" : "#aa0000"
  );
  ctx.fillRectangle(
    [40, 20, 10, 10],
    ctx.hasTexture("missing") ? "#aa0000" : "#00aa00"
  );

  const texture = ctx.getTexture("Quadrants");
  ctx.fillRectangle(
    [60, 20, 10, 10],
    texture?.standardWidth === 4 && texture.standardHeight === 4
      ? "#0000aa"
      : "#aa0000"
  );
  ctx.fillRectangle(
    [80, 20, 10, 10],
    ctx.getTexture("missing") === null ? "#0000aa" : "#aa0000"
  );

  // --- Page 1: image pixels (41) ------------------------------------------
  ctx.usePage("Image Pixels");
  const imagePixel = ctx.getImagePixelColor("Quadrants", [0, 0]);
  ctx.fillRectangle(
    [20, 20, 10, 10],
    imagePixel?.r === 255 && imagePixel.g === 0 && imagePixel.b === 0
      ? "#ff0000"
      : "#aa0000"
  );
  ctx.fillRectangle(
    [40, 20, 10, 10],
    ctx.getImagePixelColor("missing", [0, 0]) === null ? "#0000aa" : "#aa0000"
  );

  // --- Page 2: texture pixels (42) ----------------------------------------
  ctx.usePage("Texture Pixels");
  const texturePixel = ctx.getTexturePixelColor("Quadrants", [3, 0]);
  ctx.fillRectangle(
    [20, 20, 10, 10],
    texturePixel?.r === 0 && texturePixel.g === 255 && texturePixel.b === 0
      ? "#00aa00"
      : "#aa0000"
  );
  ctx.fillRectangle(
    [40, 20, 10, 10],
    ctx.getTexturePixelColor("missing", [0, 0]) === null ? "#0000aa" : "#aa0000"
  );

  // --- Page 3: named/current page pixels (43–44) --------------------------
  ctx.usePage("Page Pixels");
  ctx.fillRectangle([20, 20, 10, 10], "#123456");

  const namedPagePixel = ctx.getPagePixelColor("Page Pixels", [20, 20]);
  ctx.fillRectangle(
    [40, 20, 10, 10],
    namedPagePixel?.r === 18 &&
      namedPagePixel.g === 52 &&
      namedPagePixel.b === 86
      ? "#00aa00"
      : "#aa0000"
  );
  ctx.fillRectangle(
    [60, 20, 10, 10],
    ctx.getPagePixelColor("missing", [20, 20]) === null ? "#0000aa" : "#aa0000"
  );

  const currentPagePixel = ctx.getCurrentPagePixelColor([20, 20]);
  ctx.fillRectangle(
    [80, 20, 10, 10],
    currentPagePixel?.r === 18 &&
      currentPagePixel.g === 52 &&
      currentPagePixel.b === 86
      ? "#00aa00"
      : "#aa0000"
  );
};

const testApiPixelQueriesGenerator: Generator<PixelQueriesProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiPixelQueriesGenerator}
          props={noProps}
        />
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail: null,
  Component,
};
