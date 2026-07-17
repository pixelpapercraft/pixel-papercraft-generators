import {
  type DrawTextureOptions,
  type Region,
} from "@genroot/builder/v2";
export { type Region } from "@genroot/builder/v2";

export type BlockRenderContext = {
  defineSelectInput(id: string, options: string[]): void;
  defineBooleanInput(id: string, defaultValue: boolean): void;
  defineRegionInput(
    region: Region,
    onClick: () => void,
    regionId: string
  ): void;
  getSelectInputValue(id: string): string | null;
  getBooleanInputValue(id: string): boolean | null;
  getStringInputValue(id: string): string | null;
  setStringInputValue(id: string, value: string): void;
  drawImage(id: string, position: [number, number]): void;
  drawTexture(
    id: string,
    source: Region,
    destination: Region,
    options?: DrawTextureOptions
  ): void;
};
