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

const id = "test-api-drawing-primitives";

const name = "Test API: Drawing Primitives";

const history: HistoryDef = [];

const instructions: InstructionsDef = `
Generator API coverage board for the asset-free drawing primitives:
\`fillBackgroundColorWithWhite\`, \`fillRectangle\`, \`drawRectangle\`, \`drawLine\`,
\`drawFoldLine\`, \`drawTab\` and \`drawText\`.

One page per method, so a failing spec points at a single primitive. Everything is
drawn with solid colours / plain lines (no textures or images) so assertions are
deterministic pixel reads. See the generator-api test-coverage plan.
`;

const images: ImageDef[] = [];

const textures: TextureDef[] = [];

// Distinct solid colours so a pixel read can tell which mark landed where.
const red = "#ff0000";
const blue = "#0000ff";

const script: ScriptDef = (generator: Generator) => {
  // --- Page 0: fillBackgroundColorWithWhite (29) ---------------------------
  // Draw a mark first, THEN fill the background. The fill composites existing
  // content OVER a white base, so the mark must survive and every untouched
  // pixel must become white.
  generator.usePage("Background");
  generator.fillRectangle([10, 10, 40, 40], red); // mark, centre ~[30,30]
  generator.fillBackgroundColorWithWhite();

  // --- Page 1: fillRectangle (30) ------------------------------------------
  // A solid filled rectangle: interior is the colour, nothing painted outside.
  generator.usePage("FillRectangle");
  generator.fillRectangle([10, 10, 40, 40], blue); // fills cols 10..49, rows 10..49

  // --- Page 2: drawRectangle (31) ------------------------------------------
  // An OUTLINE (four lines), not a fill: borders drawn, interior left empty.
  // Default colour is black, no options. Border lands on rows y & y+h and
  // columns x & x+w (drawLine's 0.5px offset keeps H/V lines on-pixel).
  generator.usePage("DrawRectangle");
  generator.drawRectangle([10, 10, 40, 40]); // edges at rows 10/50, cols 10/50

  // --- Page 3: drawLine (35) -----------------------------------------------
  // Horizontal + vertical lines: default black, width 1, fully opaque and
  // exactly one pixel wide (nothing bleeds onto the neighbouring row/col).
  // A third line with width 3 must cover pixels off the 1px centre line.
  generator.usePage("DrawLine");
  generator.drawLine([10, 20], [60, 20]); // H line on row 20, cols 10..60
  generator.drawLine([80, 10], [80, 60]); // V line on col 80, rows 10..60
  generator.drawLine([10, 80], [60, 80], { width: 3 }); // thick H line, rows 79..81

  // --- Page 4: drawFoldLine (36) -------------------------------------------
  // A DASHED grey line: fixed #7b7b7b, lineDash [2,2]. Along the line there
  // must be both grey dashes AND transparent gaps — that's what makes it a
  // fold line rather than a solid drawLine.
  generator.usePage("FoldLine");
  generator.drawFoldLine([10, 30], [90, 30]); // dashed grey on row 30

  // --- Page 5: drawTab (37) — all four orientations on one page ------------
  // Each orientation draws three straight tab edges plus (by default) a grey
  // fold line across the base. With the default tabAngle 45 (tan = 1) and these
  // rectangles the tabs are non-overflow, so each has one fully-opaque H or V
  // edge segment we can pixel-read deterministically (diagonals antialias).
  // NB drawLine's 0.5px normal offset points a different way per edge depending
  // on the direction it is drawn, so the exact row/col below is offset for the
  // edges drawn right-to-left / bottom-to-top:
  //   North [50,50,40,10]  → top edge on row 50 (L->R); base fold on row 59 (R->L)
  //   South [50,100,40,10] → bottom edge on row 109 (R->L)
  //   East  [150,50,10,40] → right edge on col 159 (bottom->top)
  //   West  [200,50,10,40] → left edge on col 200 (top->bottom)
  generator.usePage("DrawTab");
  generator.drawTab([50, 50, 40, 10], "North");
  generator.drawTab([50, 100, 40, 10], "South");
  generator.drawTab([150, 50, 10, 40], "East");
  generator.drawTab([200, 50, 10, 40], "West");

  // --- Page 6: drawTab with showFoldLine = false ---------------------------
  // Same North tab, but the base fold line is suppressed. The straight tab
  // edges are still drawn (top edge row 50); only the grey fold at row 60 is
  // gone — a negative assertion distinguishing the flag.
  generator.usePage("DrawTabNoFold");
  generator.drawTab([50, 50, 40, 10], "North", false);

  // --- Page 7: drawText (38) -----------------------------------------------
  // fillText at the given baseline in `${size}px sans-serif`, current fillStyle
  // (black on a fresh page). The glyphs extend UPWARD from the baseline, so a
  // coverage assertion above the baseline finds ink and below it finds none.
  generator.usePage("DrawText");
  generator.drawText("TEST", [50, 120], 80); // baseline y = 120
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
