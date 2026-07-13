import type {
  GeneratorDef,
  HistoryDef,
  ImageDef,
  InstructionsDef,
  ScriptDef,
  TextureDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import quadrants from "@genroot/generators/testApiDrawingTextures/fixtures/quadrants.png";

const id = "test-api-pixel-queries";

const name = "Test API: Pixel Queries";

const history: HistoryDef = [];

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

const script: ScriptDef = (generator: Generator) => {
  // --- Page 0: texture existence and retrieval (39–40) --------------------
  generator.usePage("Texture Lookup");
  generator.fillRectangle(
    [20, 20, 10, 10],
    generator.hasTexture("Quadrants") ? "#00aa00" : "#aa0000"
  );
  generator.fillRectangle(
    [40, 20, 10, 10],
    generator.hasTexture("missing") ? "#aa0000" : "#00aa00"
  );

  const texture = generator.getTexture("Quadrants");
  generator.fillRectangle(
    [60, 20, 10, 10],
    texture?.standardWidth === 4 && texture.standardHeight === 4
      ? "#0000aa"
      : "#aa0000"
  );
  generator.fillRectangle(
    [80, 20, 10, 10],
    generator.getTexture("missing") === null ? "#0000aa" : "#aa0000"
  );

  // --- Page 1: image pixels (41) ------------------------------------------
  generator.usePage("Image Pixels");
  const imagePixel = generator.getImagePixelColor("Quadrants", [0, 0]);
  generator.fillRectangle(
    [20, 20, 10, 10],
    imagePixel?.r === 255 && imagePixel.g === 0 && imagePixel.b === 0
      ? "#ff0000"
      : "#aa0000"
  );
  generator.fillRectangle(
    [40, 20, 10, 10],
    generator.getImagePixelColor("missing", [0, 0]) === null
      ? "#0000aa"
      : "#aa0000"
  );

  // --- Page 2: texture pixels (42) ----------------------------------------
  generator.usePage("Texture Pixels");
  const texturePixel = generator.getTexturePixelColor("Quadrants", [3, 0]);
  generator.fillRectangle(
    [20, 20, 10, 10],
    texturePixel?.r === 0 && texturePixel.g === 255 && texturePixel.b === 0
      ? "#00aa00"
      : "#aa0000"
  );
  generator.fillRectangle(
    [40, 20, 10, 10],
    generator.getTexturePixelColor("missing", [0, 0]) === null
      ? "#0000aa"
      : "#aa0000"
  );

  // --- Page 3: named/current page pixels (43–44) --------------------------
  generator.usePage("Page Pixels");
  generator.fillRectangle([20, 20, 10, 10], "#123456");

  const namedPagePixel = generator.getPagePixelColor("Page Pixels", [20, 20]);
  generator.fillRectangle(
    [40, 20, 10, 10],
    namedPagePixel?.r === 18 &&
      namedPagePixel.g === 52 &&
      namedPagePixel.b === 86
      ? "#00aa00"
      : "#aa0000"
  );
  generator.fillRectangle(
    [60, 20, 10, 10],
    generator.getPagePixelColor("missing", [20, 20]) === null
      ? "#0000aa"
      : "#aa0000"
  );

  const currentPagePixel = generator.getCurrentPagePixelColor([20, 20]);
  generator.fillRectangle(
    [80, 20, 10, 10],
    currentPagePixel?.r === 18 &&
      currentPagePixel.g === 52 &&
      currentPagePixel.b === 86
      ? "#00aa00"
      : "#aa0000"
  );
};

export const generator: GeneratorDef = {
  id,
  name,
  thumbnail: null,
  video: null,
  instructions,
  history,
  images,
  textures,
  script,
};
