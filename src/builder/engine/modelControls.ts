/** [x, y, width, height] */
export type Region = [number, number, number, number];

export type RegionControl = {
  kind: "Region";
  pageId: string;
  region: Region;
  onClick: () => void;
  id?: string;
};

export type MinecraftSkinOptionPreset = {
  kind: "preset";
  id: string;
  label: string;
  urls: {
    wide: string;
    slim: string;
  };
};

export type MinecraftSkinOptionTexture = {
  kind: "texture";
  id: string;
  label: string;
  textureId: string;
};

export type MinecraftSkinOption =
  | MinecraftSkinOptionPreset
  | MinecraftSkinOptionTexture;

export type {
  MinecraftModelType,
  MinecraftSkinInputValue,
  MinecraftSkinSelection,
} from "./minecraftSkinInputValue";
