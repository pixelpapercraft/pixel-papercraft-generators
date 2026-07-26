import { type Color } from "@genroot/builder/engine/canvasWithContext";
import {
  type ImageDef,
  type TextureDef,
  type ThumbnailDef,
} from "@genroot/builder/engine/generatorDef";
import {
  type Position,
  type Rectangle,
  type Region,
  type RegionLegacy,
} from "@genroot/builder/engine/renderers/types";
import { type DrawTextureOptions } from "@genroot/builder/engine/renderers/drawTexture";
import { type DrawRectangeOptions } from "@genroot/builder/engine/renderers/drawRectangle";
import { type LineProps } from "@genroot/builder/engine/renderers/drawLine";
import { type TabOrientation } from "@genroot/builder/engine/renderers/drawTab";
import { type Texture } from "@genroot/builder/engine/texture";

// The render surface an author's `render` function draws through: drawing
// and page methods (matching `Engine`'s own signatures verbatim, none of
// the `define*Input`/`get*InputValue` control methods) plus `defineRegion`.
// This is no longer a bare subset of `Engine`'s own methods — `<Pages>` is
// no longer just handed a real `Engine` (see the wrapper built in
// `generatorRenderer.tsx`) because regions now surface through
// `onRegionClick` rather than a closure attached at define-time. Deliberately
// not `Pick<Generator, …>` — see the generator-v2 prototype plan.
export type RenderContext = {
  usePage(id: string): void;
  fillBackgroundColorWithWhite(): void;
  fillRectangle(rectangle: Rectangle, color: string): void;
  drawRectangle(rectangle: Rectangle, options?: DrawRectangeOptions): void;
  drawImage(id: string, position: [number, number]): void;
  getTexture(id: string): Texture | null;
  drawTexture(
    id: string,
    source: Region,
    dest: Region,
    options?: DrawTextureOptions
  ): void;
  /** @deprecated Use `drawTexture()` instead. */
  drawTextureLegacy(
    id: string,
    source: RegionLegacy,
    dest: RegionLegacy,
    options?: DrawTextureOptions
  ): void;
  drawLine(p1: Position, p2: Position, options?: LineProps): void;
  drawFoldLine(p1: Position, p2: Position): void;
  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number
  ): void;
  drawText(text: string, position: Position, size: number): void;
  getImagePixelColor(id: string, position: [number, number]): Color | null;
  getTexturePixelColor(id: string, position: [number, number]): Color | null;
  getPagePixelColor(id: string, position: [number, number]): Color | null;
  getCurrentPagePixelColor(position: [number, number]): Color | null;
  hasTexture(id: string): boolean;
  // Declarative geometry + a stable id, no closure — `render` stays a pure
  // `(ctx, props) => void`. The click surfaces later through
  // `<GeneratorRenderer>`'s `onRegionClick` carrying this `regionId`. See the
  // "Region events" section of the v2 plan.
  defineRegion(region: Region, regionId: string): void;
  // Matches `Engine`'s own number-variable storage. Needed so shared
  // rendering helpers like `Minecraft` (tab-size state) can drive through
  // either a v1 `Engine` or this v2 `RenderContext`.
  getNumberVariable(id: string): number | null;
  setNumberVariable(id: string, value: number): void;
};

export type Generator<Props> = {
  id: string;
  name: string;
  images: ImageDef[];
  textures: TextureDef[];
  render: (ctx: RenderContext, props: Props) => void;
};

export type RegionClickHandler = (arg: { regionId: string }) => void;

// A v2 generator's site/registry-facing surface: display metadata plus the
// author-written UI component, deliberately not `Generator<Props>` itself
// (`Props` is generic per-generator, so a homogeneous `GeneratorDefV2[]`
// registry can't carry it — the concrete `Props` type stays local to each
// generator file, which builds its own `Generator<Props>` internally and
// closes over it when constructing `Component`).
export type GeneratorDefV2 = {
  id: string;
  name: string;
  thumbnail: ThumbnailDef | null;
  Component: () => JSX.Element;
};
