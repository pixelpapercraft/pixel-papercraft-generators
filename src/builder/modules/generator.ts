import { type TextureInputControlProps } from "./modelControls";
import { type Model } from "./model";
import {
  type Region,
  type RegionLegacy,
  type Rectangle,
} from "./renderers/types";
import { type DrawTextureOptions, drawTexture } from "./renderers/drawTexture";
import {
  type DrawRectangeOptions,
  drawRectangle,
} from "./renderers/drawRectangle";
import { type TabOrientation, drawTab } from "./renderers/drawTab";
import { type Page } from "./modelPage";

export type * from "./renderers/types";

export class Generator {
  model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  getCurrentPage(): Page {
    return this.model.getCurrentPage();
  }

  defineTextureInput(id: string, props: TextureInputControlProps): void {
    this.model.addTextureControl(id, props);
  }

  defineBooleanInput(id: string, initialValue: boolean): void {
    this.model.addBooleanInputControl(id, initialValue);
  }

  defineAndGetBooleanInput(id: string, initialValue: boolean): boolean {
    this.defineBooleanInput(id, initialValue);
    return this.model.getBooleanVariable(id) ?? initialValue;
  }

  defineSelectInput(id: string, options: string[]): void {
    this.model.addSelectInputControl(id, options);
  }

  defineAndGetSelectInput(id: string, options: string[]): string | null {
    this.defineSelectInput(id, options);
    return this.getSelectInputValue(id);
  }

  defineRegionInput(region: Region, onClick: () => void): void {
    const currentPage = this.getCurrentPage();
    this.model.addRegionControl(currentPage.id, region, onClick);
  }
  defineRangeInput(
    id: string,
    {
      min,
      max,
      value,
      step,
    }: {
      min: number;
      max: number;
      value: number;
      step: number;
    }
  ): void {
    this.model.addRangeControl(id, min, max, value, step);
  }

  defineAndGetRangeInput(
    id: string,
    options: {
      min: number;
      max: number;
      value: number;
      step: number;
    }
  ): number {
    this.defineRangeInput(id, options);
    return this.getRangeInputValue(id);
  }

  defineText(text: string): void {
    this.model.addTextControl(text);
  }

  hasTexture(id: string): boolean {
    return this.model.hasTexture(id);
  }

  getBooleanInputValue(id: string): boolean | null {
    return this.model.getBooleanVariable(id);
  }

  getBooleanInputValueWithDefault(id: string, defaultValue: boolean): boolean {
    return this.model.getBooleanVariable(id) ?? defaultValue;
  }

  setBooleanInputValue(id: string, value: boolean): void {
    this.model.setBooleanVariable(id, value);
  }

  getSelectInputValue(id: string): string | null {
    return this.model.getStringVariable(id);
  }

  setSelectInputValue(id: string, value: string): void {
    this.model.setStringVariable(id, value);
  }

  getRangeInputValue(id: string): number {
    return this.model.getNumberVariable(id) ?? 0;
  }

  setNumberVariable(id: string, value: number): void {
    this.model.setNumberVariable(id, value);
  }

  getNumberVariable(id: string): number | null {
    return this.model.getNumberVariable(id);
  }

  usePage(id: string): void {
    this.model.usePage(id);
  }

  drawRectangle(rectangle: Rectangle, options: DrawRectangeOptions = {}): void {
    const page = this.getCurrentPage();
    drawRectangle(page.canvasWithContext, rectangle, options);
  }

  drawImage(id: string, [x, y]: [number, number]): void {
    const page = this.getCurrentPage();
    const image = this.model.findImage(id);

    if (!image) {
      return;
    }

    page.canvasWithContext.context.drawImage(image.image, x, y);
  }

  drawTexture(
    id: string,
    source: Region,
    dest: Region,
    options: DrawTextureOptions = {}
  ): void {
    const currentPage = this.getCurrentPage();
    const texture = this.model.findTexture(id);

    if (!texture) {
      return;
    }

    drawTexture(currentPage.canvasWithContext, texture, source, dest, options);
  }

  /** @deprecated Use `drawTexture()` instead. */
  drawTextureLegacy(
    id: string,
    { x: sx, y: sy, w: sw, h: sh }: RegionLegacy,
    { x: dx, y: dy, w: dw, h: dh }: RegionLegacy,
    options?: DrawTextureOptions
  ): void {
    this.drawTexture(id, [sx, sy, sw, sh], [dx, dy, dw, dh], options);
  }

  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number
  ): void {
    const currentPage = this.getCurrentPage();
    drawTab(
      currentPage.canvasWithContext,
      rectangle,
      orientation,
      showFoldLine,
      tabAngle
    );
  }
}
