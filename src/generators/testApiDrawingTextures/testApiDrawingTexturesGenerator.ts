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
import quadrants from "./fixtures/quadrants.png";

const id = "test-api-drawing-textures";

const name = "Test API: Drawing Textures";

const history: HistoryDef = [];

const instructions: InstructionsDef = `
Generator API coverage board for the image/texture drawing methods:
\`drawImage\`, \`drawTexture\` (source/dest, scale-up pixelation, rotate, flip,
unknown-id no-op) and \`drawTextureLegacy\`.

Everything is drawn from a single dedicated 4x4 fixture bitmap with four
distinct 2x2 quadrant colours (red top-left, green top-right, blue
bottom-left, yellow bottom-right), so rotate/flip are verifiable by which
quadrant colour lands where. Blends are covered on their own slice. See the
generator-api test-coverage plan.
`;

// The same 4x4 fixture is used both as a raw image (drawImage) and as a
// texture (drawTexture / drawTextureLegacy). standardWidth/Height = 4 matches
// the actual bitmap size, so source coordinates map 1:1 to fixture pixels.
const images: ImageDef[] = [{ id: "Quadrants", url: quadrants.src }];

const textures: TextureDef[] = [
  {
    id: "Quadrants",
    url: quadrants.src,
    standardWidth: 4,
    standardHeight: 4,
  },
];

// Full 4x4 source region and a 64x64 destination. Each source pixel becomes a
// 16x16 block; each 2x2 quadrant fills a 32x32 dest region. With dest origin
// [50,50] the quadrant centres are at [66,66] (TL) [98,66] (TR) [66,98] (BL)
// [98,98] (BR).
const src: [number, number, number, number] = [0, 0, 4, 4];
const dest: [number, number, number, number] = [50, 50, 64, 64];

const script: ScriptDef = (generator: Generator) => {
  // --- Page 0: drawImage (32) ----------------------------------------------
  // Raw image drawn at natural size (4x4) at [50,50]: quadrant colours land at
  // their pixel offsets. A second draw with an unknown id must be a silent
  // no-op (the real image still rendering proves the script didn't throw).
  generator.usePage("DrawImage");
  generator.drawImage("Quadrants", [50, 50]);
  generator.drawImage("does-not-exist", [100, 50]);

  // --- Page 1: drawTexture (33) core: source -> dest, pixelated -------------
  generator.usePage("DrawTexture");
  generator.drawTexture("Quadrants", src, dest);

  // --- Page 2: drawTexture unknown id is a silent no-op --------------------
  generator.usePage("TextureUnknown");
  generator.drawTexture("no-such-texture", src, dest);

  // --- Page 3: drawTexture rotate 180 (about dest centre) ------------------
  // Opposite quadrants swap: red<->yellow, green<->blue.
  generator.usePage("TextureRotate180");
  generator.drawTexture("Quadrants", src, dest, { rotate: 180 });

  // --- Page 4: drawTexture rotate 90 ---------------------------------------
  generator.usePage("TextureRotate90");
  generator.drawTexture("Quadrants", src, dest, { rotate: 90 });

  // --- Page 5: drawTexture flip Horizontal (mirror left<->right) ------------
  generator.usePage("TextureFlipH");
  generator.drawTexture("Quadrants", src, dest, { flip: "Horizontal" });

  // --- Page 6: drawTexture flip Vertical (mirror top<->bottom) --------------
  generator.usePage("TextureFlipV");
  generator.drawTexture("Quadrants", src, dest, { flip: "Vertical" });

  // --- Page 7: drawTextureLegacy (34) --------------------------------------
  // Object {x,y,w,h} args must produce the same pixels as the tuple form.
  generator.usePage("DrawTextureLegacy");
  generator.drawTextureLegacy(
    "Quadrants",
    { x: 0, y: 0, w: 4, h: 4 },
    { x: 50, y: 50, w: 64, h: 64 }
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
