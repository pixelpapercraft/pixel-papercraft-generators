import { type Model } from "./model";
import {
  type Position,
  type Region,
  type RegionLegacy,
  type Rectangle,
} from "./renderers/types";
import { type DrawTextureOptions, drawTexture } from "./renderers/drawTexture";
import {
  type DrawRectangeOptions,
  drawRectangle,
} from "./renderers/drawRectangle";
import { type LineProps, drawLine } from "./renderers/drawLine";
import {
  type TabOrientation,
  type TabType,
  drawTab,
} from "./renderers/drawTab";
import { drawText } from "./renderers/drawText";
import { fillBackgroundColor } from "./renderers/fillBackgroundColor";
import { type Page } from "./modelPage";
import { fillRect } from "./renderers/fillRect";
import { Color, getCanvasWithContextPixelColor } from "./canvasWithContext";

export type * from "./renderers/types";
export type * from "./modelPage";
export type { TexturePlugin } from "./renderers/drawTexture";

export class Engine {
  private readonly model: Model;

  constructor(model: Model) {
    this.model = model;
  }

  getCurrentPage(): Page {
    return this.model.getCurrentPage();
  }

  hasTexture(id: string): boolean {
    return this.model.hasTexture(id);
  }

  /**
   * @deprecated Model-tracked variable state predates V2 generators. Authors
   * should hold this kind of state in React state instead — see
   * `Model.setNumberVariable`'s doc comment for why this hasn't been removed
   * yet.
   */
  setNumberVariable(id: string, value: number): void {
    this.model.setNumberVariable(id, value);
  }

  /** @deprecated See `setNumberVariable`. */
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

  getTexture(id: string) {
    return this.model.findTexture(id);
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

  drawTab(
    rectangle: Rectangle,
    orientation: TabOrientation,
    showFoldLine?: boolean,
    tabAngle?: number,
    tabType?: TabType
  ): void {
    const currentPage = this.getCurrentPage();
    drawTab(
      currentPage.canvasWithContext,
      rectangle,
      orientation,
      showFoldLine,
      tabAngle,
      tabType
    );
  }

  drawText(text: string, position: Position, size: number): void {
    const currentPage = this.getCurrentPage();
    drawText(currentPage.canvasWithContext, text, position, size);
  }

  getImagePixelColor(id: string, [x, y]: [number, number]): Color | null {
    const image = this.model.findImage(id);

    if (!image) {
      return null;
    }

    return getCanvasWithContextPixelColor(image.canvasWithContext, x, y);
  }

  getTexturePixelColor(id: string, [x, y]: [number, number]): Color | null {
    const texture = this.model.findTexture(id);

    if (!texture) {
      return null;
    }

    return getCanvasWithContextPixelColor(
      texture.imageWithCanvas.canvasWithContext,
      x,
      y
    );
  }

  getPagePixelColor(id: string, [x, y]: [number, number]): Color | null {
    const page = this.model.findPage(id);

    if (!page) {
      return null;
    }

    return getCanvasWithContextPixelColor(page.canvasWithContext, x, y);
  }

  getCurrentPagePixelColor([x, y]: [number, number]): Color | null {
    const page = this.getCurrentPage();

    if (!page) {
      return null;
    }

    return getCanvasWithContextPixelColor(page.canvasWithContext, x, y);
  }
}
