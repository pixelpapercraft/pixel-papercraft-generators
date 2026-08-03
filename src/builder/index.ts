// The entire public surface a V2 generator author may import.
//
// V2 generators must import from `@genroot/builder` and nowhere else inside
// `src/builder` — no `@genroot/builder/ui/*`, no `@genroot/builder/engine/*`.
// Both directories are framework internals rather than author-facing import
// surfaces. `npm run check:imports` enforces this for `src/generators/**` and
// `tests/**`, with `src/generators/_common/**` carved out; this file is the one
// target inside `src/builder` those consumers may resolve to.
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
export type {
  LoadedTextureControlV2Props,
  LoadedTextureControlV2Value,
} from "./loadedTextureControlV2";

// The V2 generator contract.
export type {
  Generator,
  GeneratorDefV2,
  RenderContext,
  RegionClickHandler,
} from "./generator";

// Runtime textures an author feeds the renderer (record or Map, nullable
// values skipped). Lets authors drop the `new Map` + null-check + `useMemo`.
export type { DynamicTextures } from "./dynamicTextures";

// Definition shapes an author declares (images, textures, thumbnail, …).
export type {
  ImageDef,
  TextureDef,
  ThumbnailDef,
  InstructionsDef,
  VideoDef,
  HistoryDef,
} from "@genroot/builder/engine/generatorDef";

export type { Texture } from "@genroot/builder/engine/texture";
export type { TexturePlugin } from "@genroot/builder/engine/engine";
export type { Color } from "@genroot/builder/engine/canvasWithContext";

// The geometry and drawing vocabulary `RenderContext`'s methods speak.
export type {
  Point,
  Position,
  Dimensions,
  Region,
  RegionLegacy,
  Rectangle,
} from "@genroot/builder/engine/renderers/types";
export type {
  DrawTextureOptions,
  Blend,
} from "@genroot/builder/engine/renderers/drawTexture";

// Page sizes.
export { A4 } from "@genroot/builder/engine/modelPage";

// Texture-picker state. Generic picker plumbing: the selection model plus its
// serialization, which Block and Item drive through their own pickers.
export {
  type SelectedTexture,
  encodeSelectedTexture,
  encodeSelectedTextures,
  decodeSelectedTextures,
  decodeSelectedTexture,
} from "@genroot/builder/ui/texturePicker/selectedTexture";
export {
  type Flip,
  makeNextFlip,
} from "@genroot/builder/ui/texturePicker/flip";
export {
  type Rotation,
  rotationToDegrees,
} from "@genroot/builder/ui/texturePicker/rotation";
