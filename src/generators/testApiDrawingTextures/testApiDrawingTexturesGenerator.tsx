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
import quadrants from "./fixtures/quadrants.png";

const id = "test-api-drawing-textures";

const name = "Test API: Drawing Textures";

const instructions: InstructionsDef = `
Generator API coverage board for the image/texture drawing methods:
\`drawImage\`, \`drawTexture\` (source/dest, scale-up pixelation, rotate, flip,
unknown-id no-op) and \`drawTextureLegacy\`.

Everything is drawn from a single dedicated 4x4 fixture bitmap with four
distinct 2x2 quadrant colours (red top-left, green top-right, blue
bottom-left, yellow bottom-right), so rotate/flip and every blend mode are
verifiable by which exact colours land where. See the generator-api
test-coverage plan.

The final page is an exhaustive 7x3 rotate/flip combination matrix (every
Center/Corner rotation x every flip); see the rotate/flip combination matrix
spec.
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

// This coverage board has no controls — it exists to exercise the render API,
// so nothing feeds in from the UI. A module-level empty value keeps a stable
// identity across renders (`props` is a `<GeneratorRenderer>` memo dependency).
type DrawingTexturesProps = Record<string, never>;

const noProps: DrawingTexturesProps = {};

// Takes no `props` parameter at all: a narrower render function is assignable
// to the two-parameter `Generator<Props>["render"]`, and there is nothing to
// read from an empty props object.
const render = (ctx: RenderContext): void => {
  // --- Page 0: drawImage (32) ----------------------------------------------
  // Raw image drawn at natural size (4x4) at [50,50]: quadrant colours land at
  // their pixel offsets. A second draw with an unknown id must be a silent
  // no-op (the real image still rendering proves the render didn't throw).
  ctx.usePage("DrawImage");
  ctx.drawImage("Quadrants", [50, 50]);
  ctx.drawImage("does-not-exist", [100, 50]);

  // --- Page 1: drawTexture (33) core: source -> dest, pixelated -------------
  ctx.usePage("DrawTexture");
  ctx.drawTexture("Quadrants", src, dest);

  // --- Page 2: drawTexture unknown id is a silent no-op --------------------
  ctx.usePage("TextureUnknown");
  ctx.drawTexture("no-such-texture", src, dest);

  // --- Page 3: drawTexture rotate 180 (about dest centre) ------------------
  // Opposite quadrants swap: red<->yellow, green<->blue.
  ctx.usePage("TextureRotate180");
  ctx.drawTexture("Quadrants", src, dest, { rotate: 180 });

  // --- Page 4: drawTexture rotate 90 ---------------------------------------
  ctx.usePage("TextureRotate90");
  ctx.drawTexture("Quadrants", src, dest, { rotate: 90 });

  // --- Page 5: drawTexture flip Horizontal (mirror left<->right) ------------
  ctx.usePage("TextureFlipH");
  ctx.drawTexture("Quadrants", src, dest, { flip: "Horizontal" });

  // --- Page 6: drawTexture flip Vertical (mirror top<->bottom) --------------
  ctx.usePage("TextureFlipV");
  ctx.drawTexture("Quadrants", src, dest, { flip: "Vertical" });

  // --- Page 7: drawTextureLegacy (34) --------------------------------------
  // Object {x,y,w,h} args must produce the same pixels as the tuple form.
  ctx.usePage("DrawTextureLegacy");
  ctx.drawTextureLegacy(
    "Quadrants",
    { x: 0, y: 0, w: 4, h: 4 },
    { x: 50, y: 50, w: 64, h: 64 }
  );

  // --- Page 8: drawTexture MultiplyHex ------------------------------------
  // #808080 halves every non-zero channel (255 * 128 / 255 = 128).
  ctx.usePage("TextureMultiplyHex");
  ctx.drawTexture("Quadrants", src, dest, {
    blend: { kind: "MultiplyHex", hex: "#808080" },
  });

  // --- Page 9: drawTexture MultiplyColor ----------------------------------
  // An explicit Color has the same per-channel multiply semantics, including
  // alpha. This deliberately differs from the hex fixture above.
  ctx.usePage("TextureMultiplyColor");
  ctx.drawTexture("Quadrants", src, dest, {
    blend: { kind: "MultiplyColor", color: { r: 64, g: 128, b: 255, a: 255 } },
  });

  // --- Page 10: drawTexture ReplaceColor ----------------------------------
  // Palette matching is exact rgba equality. Replace red and blue only; green
  // and yellow prove non-palette colours are preserved.
  ctx.usePage("TextureReplaceColor");
  ctx.drawTexture("Quadrants", src, dest, {
    blend: {
      kind: "ReplaceColor",
      color1: [
        { r: 255, g: 0, b: 0, a: 255 },
        { r: 0, g: 0, b: 255, a: 255 },
      ],
      color2: [
        { r: 12, g: 34, b: 56, a: 255 },
        { r: 78, g: 90, b: 123, a: 255 },
      ],
    },
  });

  // --- Page 11: drawTexture ReplaceHex ------------------------------------
  // Hex palettes use the same exact matching/replacement rules as Colors.
  ctx.usePage("TextureReplaceHex");
  ctx.drawTexture("Quadrants", src, dest, {
    blend: {
      kind: "ReplaceHex",
      hex1: ["#00ff00", "#ffff00"],
      hex2: ["#abcdef", "#102030"],
    },
  });

  // --- Page 12: rotate/flip combination matrix -----------------------------
  // Exhaustive 7x3 grid of every drawTexture rotate x flip combination (see the
  // rotate/flip combination matrix spec). Rows = rotate state (None, Center
  // 90/180/270, Corner 90/180/270); cols = flip (None, Horizontal, Vertical).
  // Square cells of side S. Corner rotations pivot about the dest origin, so
  // their origin is shifted to the cell corner that brings the rotated square
  // back into its cell. The spec re-derives these same cell positions and the
  // expected quadrant colours (rotate-of-flip); keep the two in lock-step.
  ctx.usePage("TextureTransformMatrix");
  const S = 40;
  const GAP = 20;
  const ORIGIN_X = 40;
  const ORIGIN_Y = 40;
  const matrixRotations: {
    options: { rotate?: number; rotateLegacy?: number };
    cornerDegrees: number;
  }[] = [
    { options: {}, cornerDegrees: 0 }, // None
    { options: { rotate: 90 }, cornerDegrees: 0 }, // Center 90
    { options: { rotate: 180 }, cornerDegrees: 0 }, // Center 180
    { options: { rotate: 270 }, cornerDegrees: 0 }, // Center 270
    { options: { rotateLegacy: 90 }, cornerDegrees: 90 }, // Corner 90
    { options: { rotateLegacy: 180 }, cornerDegrees: 180 }, // Corner 180
    { options: { rotateLegacy: 270 }, cornerDegrees: 270 }, // Corner 270
  ];
  const matrixFlips: ("Horizontal" | "Vertical" | undefined)[] = [
    undefined,
    "Horizontal",
    "Vertical",
  ];
  matrixRotations.forEach((rotation, row) => {
    matrixFlips.forEach((flip, col) => {
      const cx = ORIGIN_X + col * (S + GAP);
      const cy = ORIGIN_Y + row * (S + GAP);
      let dx = cx;
      let dy = cy;
      if (rotation.cornerDegrees === 90) {
        dx = cx + S;
      } else if (rotation.cornerDegrees === 180) {
        dx = cx + S;
        dy = cy + S;
      } else if (rotation.cornerDegrees === 270) {
        dy = cy + S;
      }
      ctx.drawTexture("Quadrants", [0, 0, 4, 4], [dx, dy, S, S], {
        ...rotation.options,
        ...(flip ? { flip } : {}),
      });
    });
  });
};

const testApiDrawingTexturesGenerator: Generator<DrawingTexturesProps> = {
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
          generator={testApiDrawingTexturesGenerator}
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
