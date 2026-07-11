import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { type Page, type PageOptions, makePage } from "./modelPage";
import { makeUUID } from "./uuid";
import {
  type Control,
  type AtlasInputControlProps,
  type MinecraftSkinInputControl,
  type MinecraftSkinInputControlProps,
  type TextureInputControlProps,
  type Region,
} from "./modelControls";
import { type Variable } from "./variables";
import { type Values } from "./modelValues";

export class Model {
  controls: Control[];
  pages: Page[];
  currentPage: Page | null;
  values: Values;

  constructor(values: Values) {
    this.controls = [];
    this.pages = [];
    this.currentPage = null;
    this.values = values;
  }

  addControl(control: Control) {
    this.controls.push(control);
  }

  addTextControl(text: string) {
    this.addControl({
      kind: "Text",
      id: makeUUID(),
      text,
    });
  }

  addCustomInputControl(
    id: string,
    render: (onChange: (value: string) => void) => React.ReactNode
  ) {
    this.addControl({
      kind: "CustomInput",
      id,
      render,
    });
  }

  addRegionControl(
    pageId: string,
    region: Region,
    onClick: () => void,
    id?: string,
    onRightClick?: () => void
  ) {
    this.addControl({
      kind: "Region",
      pageId,
      region,
      onClick,
      onRightClick,
      id,
    });
  }

  addTextureControl(id: string, props: TextureInputControlProps) {
    this.addControl({
      kind: "TextureInput",
      id,
      props,
    });
  }

  addAtlasControl(id: string, props: AtlasInputControlProps) {
    this.addControl({
      kind: "AtlasInput",
      id,
      props,
    });
  }

  addMinecraftSkinControl(id: string, props: MinecraftSkinInputControlProps) {
    this.addControl({
      kind: "MinecraftSkinInput",
      id,
      props,
    });
  }

  addBooleanInputControl(id: string, initialValue: boolean) {
    this.addControl({
      kind: "BooleanInput",
      id,
      initialValue,
    });
    const value = this.getBooleanVariable(id);
    if (value === null) {
      this.setBooleanVariable(id, initialValue);
    }
  }

  addSelectInputControl(id: string, options: string[]) {
    this.addControl({
      kind: "SelectInput",
      id,
      options,
    });
    const value = this.getStringVariable(id);
    const firstOption = options.at(0);
    if (value === null && firstOption) {
      this.setStringVariable(id, firstOption);
    }
  }

  addRangeControl(
    id: string,
    min: number,
    max: number,
    value: number,
    step: number,
    showValue?: boolean
  ) {
    this.addControl({
      kind: "Range",
      id,
      min,
      max,
      value,
      step,
      showValue,
    });
    const currentValue = this.getNumberVariable(id);
    if (currentValue === null) {
      this.setNumberVariable(id, value);
    }
  }

  addButtonControl(
    id: string,
    onClick: () => void,
    color?: "Gray" | "Blue" | "Red" | "Green"
  ) {
    this.addControl({
      kind: "Button",
      id,
      color,
      onClick,
    });
  }

  addInputRowStartControl() {
    this.addControl({
      kind: "InputRowStart",
      id: makeUUID(),
    });
  }

  addInputRowEndControl() {
    this.addControl({
      kind: "InputRowEnd",
      id: makeUUID(),
    });
  }

  addPage(page: Page) {
    this.pages.push(page);
  }

  findPage(id: string): Page | null {
    return this.pages.find((curr) => curr.id === id) || null;
  }

  getMinecraftSkinControl(id: string): MinecraftSkinInputControl | null {
    const control = this.controls.find(
      (candidate): candidate is MinecraftSkinInputControl =>
        candidate.kind === "MinecraftSkinInput" && candidate.id === id
    );
    return control ?? null;
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

  usePage(id: string, options: PageOptions = {}) {
    const size = options.size ?? "A4";
    const orientation = options.orientation ?? "portrait";
    const page = this.findPage(id);
    if (page) {
      if (page.size === size && page.orientation === orientation) {
        this.setCurrentPage(page);
        return;
      }

      const replacementPage = makePage(id, options);
      const pageIndex = this.pages.indexOf(page);
      this.pages.splice(pageIndex, 1, replacementPage);
      this.setCurrentPage(replacementPage);
      return;
    }

    const newPage = makePage(id, options);

    this.addPage(newPage);
    this.setCurrentPage(newPage);

    return newPage;
  }
}
