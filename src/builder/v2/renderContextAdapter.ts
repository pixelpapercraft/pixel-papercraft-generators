import { type Color } from "@genroot/builder/modules/canvasWithContext";
import { Model } from "@genroot/builder/modules/model";
import { Generator } from "@genroot/builder/modules/generator";
import {
  type Position,
  type Rectangle,
  type Region,
  type RegionLegacy,
} from "@genroot/builder/modules/renderers/types";
import { type DrawTextureOptions } from "@genroot/builder/modules/renderers/drawTexture";
import { type DrawRectangeOptions } from "@genroot/builder/modules/renderers/drawRectangle";
import { type LineProps } from "@genroot/builder/modules/renderers/drawLine";
import { type TabOrientation } from "@genroot/builder/modules/renderers/drawTab";
import { type Texture } from "@genroot/builder/modules/texture";
import { type RegionClickHandler, type RenderContext } from "./generatorV2";

// Delegates every draw/page method to an internal `Generator`, and
// implements `defineRegion` by storing a region control (via
// `Model.addRegionControl`, reused unchanged) whose `onClick` calls
// `onRegionClick`. `<Pages>`/`RegionControls` invoke that stored closure
// unchanged; they don't need to know region clicks exist.
export class RenderContextAdapter implements RenderContext {
  private readonly gen: Generator;
  private readonly model: Model;
  private readonly onRegionClick: RegionClickHandler | undefined;

  constructor(
    gen: Generator,
    model: Model,
    onRegionClick: RegionClickHandler | undefined
  ) {
    this.gen = gen;
    this.model = model;
    this.onRegionClick = onRegionClick;
  }

  usePage(id: string): void {
    this.gen.usePage(id);
  }

  fillBackgroundColorWithWhite(): void {
    this.gen.fillBackgroundColorWithWhite();
  }

  fillRectangle(rectangle: Rectangle, color: string): void {
    this.gen.fillRectangle(rectangle, color);
  }

  drawRectangle(rectangle: Rectangle, options?: DrawRectangeOptions): void {
    this.gen.drawRectangle(rectangle, options);
  }

  drawImage(id: string, position: [number, number]): void {
    this.gen.drawImage(id, position);
  }

  getTexture(id: string): Texture | null {
    return this.gen.getTexture(id);
  }

  drawTexture(
    id: string,
    source: Region,
    dest: Region,
    options?: DrawTextureOptions
  ): void {
    this.gen.drawTexture(id, source, dest, options);
  }

  /** @deprecated Use `drawTexture()` instead. */
  drawTextureLegacy(
    id: string,
    source: RegionLegacy,
    dest: RegionLegacy,
    options?: DrawTextureOptions
  ): void {
    this.gen.drawTextureLegacy(id, source, dest, options);
  }

  drawLine(p1: Position, p2: Position, options?: LineProps): void {
    this.gen.drawLine(p1, p2, options);
  }

  drawFoldLine(p1: Position, p2: Position): void {
    this.gen.drawFoldLine(p1, p2);
  }

  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number
  ): void {
    this.gen.drawTab(rectangle, orientation, showFoldLine, tabAngle);
  }

  drawText(text: string, position: Position, size: number): void {
    this.gen.drawText(text, position, size);
  }

  getImagePixelColor(id: string, position: [number, number]): Color | null {
    return this.gen.getImagePixelColor(id, position);
  }

  getTexturePixelColor(id: string, position: [number, number]): Color | null {
    return this.gen.getTexturePixelColor(id, position);
  }

  getCurrentPagePixelColor(position: [number, number]): Color | null {
    return this.gen.getCurrentPagePixelColor(position);
  }

  hasTexture(id: string): boolean {
    return this.gen.hasTexture(id);
  }

  defineRegion(region: Region, regionId: string): void {
    const currentPageId = this.gen.getCurrentPage().id;

    this.model.addRegionControl(
      currentPageId,
      region,
      () => this.onRegionClick?.({ regionId }),
      regionId
    );
  }
}
