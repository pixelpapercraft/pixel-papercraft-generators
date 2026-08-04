import { defaultSkinNames, getSkinUrl } from "./index";

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

export function makeDefaultMinecraftSkinPresetOptions(): MinecraftSkinOptionPreset[] {
  return defaultSkinNames.map(
    (name): MinecraftSkinOptionPreset => ({
      kind: "preset",
      id: name,
      label: name,
      urls: {
        wide: getSkinUrl(name, "Wide"),
        slim: getSkinUrl(name, "Slim"),
      },
    })
  );
}

// Build a single preset option from explicit Wide/Slim skin URLs. Passing the
// same URL for both pins the option to one fixed texture regardless of the
// model-type toggle — used to expose a fixed skin (e.g. "Default (Slim)") as a
// dropdown choice without a paired Wide/Slim asset.
export function makeMinecraftSkinPresetOption(
  id: string,
  wideUrl: string,
  slimUrl: string
): MinecraftSkinOptionPreset {
  return {
    kind: "preset",
    id,
    label: id,
    urls: { wide: wideUrl, slim: slimUrl },
  };
}

export function makeMinecraftSkinTextureOption(
  textureId: string
): MinecraftSkinOptionTexture {
  return {
    kind: "texture",
    id: textureId,
    label: textureId,
    textureId,
  };
}
