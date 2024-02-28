import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { Variable } from "./variables";

export class Values {
  images: Map<string, ImageWithCanvas>;
  textures: Map<string, Texture>;
  variables: Map<string, Variable>;

  constructor() {
    this.images = new Map();
    this.textures = new Map();
    this.variables = new Map();
  }

  addImage(id: string, image: ImageWithCanvas) {
    this.images.set(id, image);
  }

  addTexture(id: string, texture: Texture) {
    this.textures.set(id, texture);
  }

  removeTexture(id: string) {
    this.textures.delete(id);
  }

  setVariable(id: string, variable: Variable) {
    this.variables.set(id, variable);
  }

  setStringVariable(id: string, value: string): void {
    this.variables.set(id, { kind: "String", value });
  }

  getStringVariable(id: string): string | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "String" ? variable.value : null;
  }

  setNumberVariable(id: string, value: number): void {
    this.variables.set(id, { kind: "Number", value });
  }

  getNumberVariable(id: string): number | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "Number" ? variable.value : null;
  }

  setBooleanVariable(id: string, value: boolean): void {
    this.variables.set(id, { kind: "Boolean", value });
  }

  getBooleanVariable(id: string): boolean | null {
    const variable = this.variables.get(id);
    return variable && variable.kind === "Boolean" ? variable.value : null;
  }
}
