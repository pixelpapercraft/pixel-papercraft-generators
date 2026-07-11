import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import { type TextureFrame } from "@genroot/builder/modules/textureData";

export type BannerShieldTarget = "banner" | "shield";

export type BannerShieldPattern = {
  id: string;
  label: string;
  bannerFrame: TextureFrame | null;
  shieldFrame: TextureFrame | null;
};

export type BannerShieldBaseOption = TextureFrame & {
  textureDef?: TextureDef;
};

export type BannerShieldBases = {
  bannerBase: BannerShieldBaseOption | null;
  shieldBase: BannerShieldBaseOption | null;
  shieldBaseNoPattern: BannerShieldBaseOption | null;
  bannerOptions: BannerShieldBaseOption[];
  shieldOptions: BannerShieldBaseOption[];
};

export type BannerShieldTextureVersion = {
  id: string;
  label: string;
  bannerTextureDef: TextureDef;
  shieldTextureDef: TextureDef;
  patterns: BannerShieldPattern[];
  bases: BannerShieldBases;
};

export type SelectedBannerShieldPattern = {
  versionId: string;
  patternId: string;
  blend: string | null;
};

export function encodeSelectedBannerShieldPattern(
  pattern: SelectedBannerShieldPattern
): string {
  return JSON.stringify(pattern);
}

export function decodeSelectedBannerShieldPattern(
  json: string
): SelectedBannerShieldPattern {
  return JSON.parse(json);
}

export function encodeSelectedBannerShieldPatterns(
  patterns: SelectedBannerShieldPattern[]
): string {
  return JSON.stringify(patterns);
}

export function decodeSelectedBannerShieldPatterns(
  json: string
): SelectedBannerShieldPattern[] {
  return JSON.parse(json);
}
