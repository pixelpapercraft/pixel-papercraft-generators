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

const id = "test-api-page-management";

const name = "Test API: Page Management";

const instructions: InstructionsDef = `
Generator API coverage board for page management (\`usePage\` / \`getCurrentPage\`).

Its render function exercises the whole page lifecycle in one pass so the spec can
assert each behaviour. Uses solid colour rectangles as draw markers (no textures)
so the assertions are simple pixel reads. See the generator-api test-coverage plan.
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

// The coverage boards have no controls — they exist to exercise the render API,
// so nothing feeds in from the UI. A module-level empty value keeps a stable
// identity across renders (`props` is a `<GeneratorRenderer>` memo dependency).
type PageManagementProps = Record<string, never>;

const noProps: PageManagementProps = {};

// Takes no `props` parameter at all: a narrower render function is assignable
// to the two-parameter `Generator<Props>["render"]`, and there is nothing to
// read from an empty props object.
const render = (ctx: RenderContext): void => {
  // (a) Draw BEFORE any usePage. Exercises getCurrentPage's lazy creation of a
  // default page named "Page". Two marks that must BOTH remain, proving the
  // second call returns the same page (draws accumulate, not a fresh canvas).
  ctx.fillRectangle([10, 10, 40, 40], red); // mark A, centre ~[30,30]
  ctx.fillRectangle([60, 10, 40, 40], green); // mark B, centre ~[80,30]

  // New ids create new pages, appended in call order.
  ctx.usePage("Alpha");
  ctx.fillRectangle([10, 10, 40, 40], blue); // Alpha mark 1, ~[30,30]

  ctx.usePage("Beta");
  ctx.fillRectangle([10, 10, 40, 40], magenta); // Beta, ~[30,30]

  // Re-select an existing page: switches back to Alpha WITHOUT creating a
  // duplicate, and accumulates a second mark beside the first (canvas kept).
  ctx.usePage("Alpha");
  ctx.fillRectangle([60, 10, 40, 40], cyan); // Alpha mark 2, ~[80,30]
};

const testApiPageManagementGenerator: Generator<PageManagementProps> = {
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
        <div className="mb-8">
          <GeneratorUI.Instructions markdown={instructions} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <GeneratorRenderer
          generator={testApiPageManagementGenerator}
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
