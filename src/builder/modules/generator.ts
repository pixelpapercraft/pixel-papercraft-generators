import { type TextureInputControlProps } from "./modelControls";
import { type Model } from "./model";
import {
  type Position,
  type Region,
  type RegionLegacy,
  type Rectangle,
  Dimensions,
} from "./renderers/types";
import { type DrawTextureOptions, drawTexture } from "./renderers/drawTexture";
import {
  type DrawRectangeOptions,
  drawRectangle,
} from "./renderers/drawRectangle";
import { type LineProps, drawLine } from "./renderers/drawLine";
import { type TabOrientation, drawTab } from "./renderers/drawTab";
import { fillBackgroundColor } from "./renderers/fillBackgroundColor";
import { type Page } from "./modelPage";
import { fillRect } from "./renderers/fillRect";

export type * from "./renderers/types";
export type * from "./modelPage";

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

  defineCustomStringInput(
    id: string,
    render: (onChange: (value: string) => void) => React.ReactNode
  ): void {
    this.model.addCustomInputControl(id, render);
  }

  defineButtonInput(id: string, onClick: () => void): void {
    this.model.addButtonControl(id, onClick);
  }

  hasTexture(id: string): boolean {
    return this.model.hasTexture(id);
  }

  clearAllVariables(): void {
    this.model.cleatAllVariables();
  }

  setBooleanInputValue(id: string, value: boolean): void {
    this.model.setBooleanVariable(id, value);
  }

  getBooleanInputValue(id: string): boolean | null {
    return this.model.getBooleanVariable(id);
  }

  getBooleanInputValueWithDefault(id: string, defaultValue: boolean): boolean {
    return this.model.getBooleanVariable(id) ?? defaultValue;
  }

  setStringInputValue(id: string, value: string): void {
    this.model.setStringVariable(id, value);
  }

  getStringInputValue(id: string): string | null {
    return this.model.getStringVariable(id);
  }

  getStringInputValueWithDefault(id: string, defaultValue: string): string {
    return this.model.getStringVariable(id) ?? defaultValue;
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

  fillBackgroundColorWithWhite() {
    const page = this.getCurrentPage();
    fillBackgroundColor(page.canvasWithContext, "#ffffff");
  }

  fillRectangle(rectangle: Rectangle, color: string): void {
    const page = this.getCurrentPage();
    fillRect(page.canvasWithContext, rectangle, color);
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

  drawLine(p1: Position, p2: Position, options?: LineProps): void {
    const currentPage = this.getCurrentPage();
    drawLine(currentPage.canvasWithContext, p1, p2, options);
  }

  drawFoldLine(p1: Position, p2: Position): void {
    const currentPage = this.getCurrentPage();
    drawLine(currentPage.canvasWithContext, p1, p2, {
      color: "#7b7b7b",
      width: 1,
      lineDash: [2, 2],
      lineDashOffset: 3,
    });
  }

  drawFoldLineRect(dest: Region): void {
    const [x, y, w, h] = dest;

    this.drawFoldLine([x, y - 1], [x + w, y - 1]);
    this.drawFoldLine([x + w, y], [x + w, y + h]);
    this.drawFoldLine([x + w, y + h + 1], [x, y + h + 1]);
    this.drawFoldLine([x, y + h], [x, y]);
  }

  drawFoldLineCuboid(
    position: Position,
    dimensions: [number, number, number],
    leftSide?: boolean //Ideally supports all four orientations
  ): void {
    const [x, y] = position;
    const [w, h, d] = dimensions;

    if (!leftSide) {
      this.drawFoldLineRect([x + d, y, w, d * 2 + h]);
      this.drawFoldLineRect([x, y + d, d * 2 + w * 2, h]);
      this.drawFoldLine(
        [x + d * 2 + w - 1, y + d],
        [x + d * 2 + w - 1, y + d + h]
      );
    } else {
      this.drawFoldLineRect([x + d + w, y, w, d * 2 + h]);
      this.drawFoldLineRect([x, y + d, d * 2 + w * 2, h]);
      this.drawFoldLine([x + w, y + d], [x + w, y + d + h]);
    }
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
