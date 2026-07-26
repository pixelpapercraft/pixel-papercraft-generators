import { type Color } from "@genroot/builder/engine/canvasWithContext";
import { Model } from "@genroot/builder/engine/model";
import { Engine } from "@genroot/builder/engine/engine";
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
import { type RegionClickHandler, type RenderContext } from "./generator";

// Delegates every draw/page method to an internal `Engine`, and
// implements `defineRegion` by storing a region control (via
// `Model.addRegionControl`, reused unchanged) whose `onClick` calls
// `onRegionClick`. `<Pages>`/`RegionControls` invoke that stored closure
// unchanged; they don't need to know region clicks exist.
export class RenderContextAdapter implements RenderContext {
  private readonly gen: Engine;
  private readonly model: Model;
  private readonly onRegionClick: RegionClickHandler | undefined;

  constructor(
    gen: Engine,
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

  getPagePixelColor(id: string, position: [number, number]): Color | null {
    return this.gen.getPagePixelColor(id, position);
  }

  getCurrentPagePixelColor(position: [number, number]): Color | null {
    return this.gen.getCurrentPagePixelColor(position);
  }

  hasTexture(id: string): boolean {
    return this.gen.hasTexture(id);
  }

  getNumberVariable(id: string): number | null {
    return this.gen.getNumberVariable(id);
  }

  setNumberVariable(id: string, value: number): void {
    this.gen.setNumberVariable(id, value);
  }

  defineRegion(region: Region, regionId: string): void {
    const onRegionClick = this.onRegionClick;

    // Only register an interactive region when there's a handler to call —
    // otherwise `RegionControls` would render a hover-highlightable overlay
    // that does nothing on click.
    if (!onRegionClick) {
      return;
    }

    const currentPageId = this.gen.getCurrentPage().id;

    this.model.addRegionControl(
      currentPageId,
      region,
      () => onRegionClick({ regionId }),
      regionId
    );
  }
}
