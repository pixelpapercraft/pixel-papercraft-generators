import { type ImageWithCanvas } from "./imageWithCanvas";
import { type Texture } from "./texture";
import { type NumberVariable } from "./variables";

export class Values {
  images: Map<string, ImageWithCanvas>;
  textures: Map<string, Texture>;
  variables: Map<string, NumberVariable>;

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

  /** @deprecated See `Model.setNumberVariable`. */
  setNumberVariable(id: string, value: number): void {
    this.variables.set(id, { kind: "Number", value });
  }

  /** @deprecated See `Model.setNumberVariable`. */
  getNumberVariable(id: string): number | null {
    const variable = this.variables.get(id);
    return variable ? variable.value : null;
  }
}
