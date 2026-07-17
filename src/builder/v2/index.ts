// The entire public surface a V2 generator author may import.
//
// V2 generators must import from `@genroot/builder/v2` and nowhere else inside
// `src/builder` — no `@genroot/builder/ui/*`, no `@genroot/builder/modules/*`.
// Both of those directories are being retired once every generator is migrated,
// and an eslint boundary rule enforces this for `src/generators/*V2/`.
//
// Two runtime surfaces only:
//   - `GeneratorRenderer` — renders the generator's pages
//   - `GeneratorUI`       — every pre-built, generic UI control
//
// Everything else exported here is the type vocabulary those two need. Controls
// that are *not* generic — Minecraft skin pickers, tint selectors, glint — are
// deliberately absent: they are generator content, and live under
// `src/generators/_common/`.

export { GeneratorRenderer } from "./generatorRenderer";
export { GeneratorUI } from "./generatorUI";

export type {
  BooleanControlProps,
  SelectControlProps,
  SelectOption,
  RangeControlProps,
  ButtonControlProps,
  TextControlProps,
} from "./generatorUI";

// The V2 generator contract.
export type {
  GeneratorV2,
  GeneratorDefV2,
  RenderContext,
  RegionClickHandler,
} from "./generatorV2";

// Definition shapes an author declares (images, textures, thumbnail, …).
export type {
  ImageDef,
  TextureDef,
  ThumbnailDef,
  InstructionsDef,
  VideoDef,
  HistoryDef,
} from "@genroot/builder/modules/generatorDef";

export type { Texture } from "@genroot/builder/modules/texture";
export type { TexturePlugin } from "@genroot/builder/modules/generator";
export type { Color } from "@genroot/builder/modules/canvasWithContext";

// The geometry and drawing vocabulary `RenderContext`'s methods speak.
export type {
  Point,
  Position,
  Dimensions,
  Region,
  RegionLegacy,
  Rectangle,
} from "@genroot/builder/modules/renderers/types";
export type {
  DrawTextureOptions,
  Blend,
} from "@genroot/builder/modules/renderers/drawTexture";

// Page sizes.
export { A4 } from "@genroot/builder/modules/modelPage";

// Texture-picker state. Generic picker plumbing: the selection model plus its
// serialization, which Block and Item drive through their own pickers.
export {
  type SelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
  decodeSelectedTexture,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
export { type Flip, makeNextFlip } from "@genroot/builder/ui/texturePicker/flip";
export {
  type Rotation,
  rotationToDegrees,
} from "@genroot/builder/ui/texturePicker/rotation";
