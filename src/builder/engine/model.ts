import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { type Page, makePage } from "./modelPage";
import { type Values } from "./modelValues";
import { type Region } from "./renderers/types";

export type RegionControl = {
  kind: "Region";
  pageId: string;
  region: Region;
  onClick: () => void;
  id?: string;
};

export class Model {
  regionControls: RegionControl[];
  pages: Page[];
  currentPage: Page | null;
  values: Values;

  constructor(values: Values) {
    this.regionControls = [];
    this.pages = [];
    this.currentPage = null;
    this.values = values;
  }

  addRegionControl(
    pageId: string,
    region: Region,
    onClick: () => void,
    id?: string
  ) {
    this.regionControls.push({
      kind: "Region",
      pageId,
      region,
      onClick,
      id,
    });
  }

  addPage(page: Page) {
    this.pages.push(page);
  }

  findPage(id: string): Page | null {
    return this.pages.find((curr) => curr.id === id) || null;
  }

  addImage(id: string, image: ImageWithCanvas) {
    this.values.addImage(id, image);
  }

  findImage(id: string): ImageWithCanvas | null {
    return this.values.images.get(id) || null;
  }

  addTexture(id: string, texture: Texture) {
    this.values.addTexture(id, texture);
  }

  findTexture(id: string): Texture | null {
    return this.values.textures.get(id) || null;
  }

  hasTexture(id: string): boolean {
    return this.findTexture(id) !== null;
  }

  removeTexture(id: string) {
    this.values.removeTexture(id);
  }

  /**
   * @deprecated Model-tracked variable state is a leftover from the pre-V2
   * control system. Generator authors should hold this kind of state in
   * React state instead. Not removed because `_common/minecraft.ts` (tab
   * size) and `_common/plugins/glint.ts` (glint opacity/offsets) still
   * depend on it.
   */
  setNumberVariable(id: string, value: number): void {
    this.values.setNumberVariable(id, value);
  }

  /** @deprecated See `setNumberVariable`. */
  getNumberVariable(id: string): number | null {
    return this.values.getNumberVariable(id);
  }

  setCurrentPage(page: Page) {
    this.currentPage = page;
  }

  getCurrentPage(): Page {
    if (this.currentPage) {
      return this.currentPage;
    }

    const newPage = makePage("Page");

    this.addPage(newPage);
    this.setCurrentPage(newPage);

    return newPage;
  }

  usePage(id: string) {
    const page = this.findPage(id);
    if (page) {
      this.setCurrentPage(page);
      return;
    }

    const newPage = makePage(id);

    this.addPage(newPage);
    this.setCurrentPage(newPage);

    return newPage;
  }
}
