import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { type Page, makePage } from "./modelPage";
import { type RegionControl, type Region } from "./modelControls";
import { type Variable } from "./variables";
import { type Values } from "./modelValues";

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

  setVariable(id: string, variable: Variable) {
    this.values.setVariable(id, variable);
  }

  setStringVariable(id: string, value: string): void {
    this.values.setStringVariable(id, value);
  }

  getStringVariable(id: string): string | null {
    return this.values.getStringVariable(id);
  }

  cleatAllVariables(): void {
    this.values.clearAllVariables();
  }

  setNumberVariable(id: string, value: number): void {
    this.values.setNumberVariable(id, value);
  }

  getNumberVariable(id: string): number | null {
    return this.values.getNumberVariable(id);
  }

  setBooleanVariable(id: string, value: boolean): void {
    this.values.setBooleanVariable(id, value);
  }

  getBooleanVariable(id: string): boolean | null {
    return this.values.getBooleanVariable(id);
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
