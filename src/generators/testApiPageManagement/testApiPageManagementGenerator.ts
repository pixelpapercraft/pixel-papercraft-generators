"use client";

import type {
  GeneratorDef,
  ImageDef,
  HistoryDef,
  TextureDef,
  ScriptDef,
  InstructionsDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";

const id = "test-api-page-management";

const name = "Test API: Page Management";

const history: HistoryDef = [];

const instructions: InstructionsDef = `
Generator API coverage board for page management (\`usePage\` / \`getCurrentPage\`).

Its script exercises the whole page lifecycle in one pass so the spec can assert
each behaviour. Uses solid colour rectangles as draw markers (no textures) so the
assertions are simple pixel reads. See the generator-api test-coverage plan.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

// Draw markers. Distinct solid colours so a pixel read can tell which mark, and
// therefore which page, landed where.
const red = "#ff0000";
const green = "#00ff00";
const blue = "#0000ff";
const magenta = "#ff00ff";
const cyan = "#00ffff";

const script: ScriptDef = (generator: Generator) => {
  // (a) Draw BEFORE any usePage. Exercises getCurrentPage's lazy creation of a
  // default page named "Page". Two marks that must BOTH remain, proving the
  // second call returns the same page (draws accumulate, not a fresh canvas).
  generator.fillRectangle([10, 10, 40, 40], red); // mark A, centre ~[30,30]
  generator.fillRectangle([60, 10, 40, 40], green); // mark B, centre ~[80,30]

  // New ids create new pages, appended in call order.
  generator.usePage("Alpha");
  generator.fillRectangle([10, 10, 40, 40], blue); // Alpha mark 1, ~[30,30]

  generator.usePage("Beta");
  generator.fillRectangle([10, 10, 40, 40], magenta); // Beta, ~[30,30]

  // Re-select an existing page: switches back to Alpha WITHOUT creating a
  // duplicate, and accumulates a second mark beside the first (canvas kept).
  generator.usePage("Alpha");
  generator.fillRectangle([60, 10, 40, 40], cyan); // Alpha mark 2, ~[80,30]
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
