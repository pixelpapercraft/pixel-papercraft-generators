import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type Atlas,
  type TextureFrame,
} from "@genroot/builder/modules/textureData";

import bannerBaseImage from "./banner_base.png";
import shieldBaseImage from "./shield_base.png";
import shieldBaseNoPatternImage from "./shield_base_nopattern.png";
import image from "@genroot/generators/_common/textures/texture_custom.png";
import { pairBannerShieldPatterns } from "../bannerTexturePicker/pairPatterns";
import {
  type BannerShieldBaseOption,
  type BannerShieldBases,
  type BannerShieldTextureVersion,
} from "../bannerTexturePicker/types";

const bannerBasePatternId = "banner_base";
const shieldBasePatternId = "shield_base";
const shieldBaseNoPatternId = "shield_base_nopattern";

export const customBannerTextureDef: TextureDef = {
  id: "custom-banner-patterns",
  url: image.src,
  standardWidth: 16,
  standardHeight: 16,
};

export const customShieldTextureDef: TextureDef = {
  id: "custom-shield-patterns",
  url: image.src,
  standardWidth: 16,
  standardHeight: 16,
};

export const defaultBannerBaseTextureDef: TextureDef = {
  id: "default-banner-base",
  url: bannerBaseImage.src,
  standardWidth: 64,
  standardHeight: 64,
};

export const defaultShieldBaseTextureDef: TextureDef = {
  id: "default-shield-base",
  url: shieldBaseImage.src,
  standardWidth: 64,
  standardHeight: 64,
};

export const defaultShieldBaseNoPatternTextureDef: TextureDef = {
  id: "default-shield-base-nopattern",
  url: shieldBaseNoPatternImage.src,
  standardWidth: 64,
  standardHeight: 64,
};

export const customBannerFrames: TextureFrame[] = [];
export const customShieldFrames: TextureFrame[] = [];

export function makeCustomBannerShieldTextureVersion(): BannerShieldTextureVersion {
  const { bases, patterns } = pairBannerShieldPatterns({
    bannerFrames: customBannerFrames,
    shieldFrames: customShieldFrames,
  });
  const basesWithDefaults = addDefaultBaseOptions(bases);

  return {
    id: "custom",
    label: "Custom",
    bannerTextureDef: customBannerTextureDef,
    shieldTextureDef: customShieldTextureDef,
    bases: basesWithDefaults,
    patterns,
  };
}

export function updateCustomBannerTextureAtlas(
  url: string,
  atlas: Atlas
): void {
  customBannerTextureDef.url = url;
  customBannerTextureDef.standardWidth = atlas.atlasWidth;
  customBannerTextureDef.standardHeight = atlas.atlasHeight;
  customBannerFrames.splice(0, customBannerFrames.length, ...atlas.frames);
}

export function updateCustomShieldTextureAtlas(
  url: string,
  atlas: Atlas
): void {
  customShieldTextureDef.url = url;
  customShieldTextureDef.standardWidth = atlas.atlasWidth;
  customShieldTextureDef.standardHeight = atlas.atlasHeight;
  customShieldFrames.splice(0, customShieldFrames.length, ...atlas.frames);
}

function addDefaultBaseOptions(bases: BannerShieldBases): BannerShieldBases {
  const bannerBase = bases.bannerBase ?? makeDefaultBaseOption(
    bannerBasePatternId,
    "banner base",
    defaultBannerBaseTextureDef
  );
  const shieldBase = bases.shieldBase ?? makeDefaultBaseOption(
    shieldBasePatternId,
    "shield base",
    defaultShieldBaseTextureDef
  );
  const shieldBaseNoPattern =
    bases.shieldBaseNoPattern ??
    makeDefaultBaseOption(
      shieldBaseNoPatternId,
      "shield base nopattern",
      defaultShieldBaseNoPatternTextureDef
    );

  return {
    ...bases,
    bannerBase,
    shieldBase,
    shieldBaseNoPattern,
    bannerOptions: addMissingBaseOptions(bases.bannerOptions, [bannerBase]),
    shieldOptions: addMissingBaseOptions(bases.shieldOptions, [
      shieldBase,
      shieldBaseNoPattern,
    ]),
  };
}

function makeDefaultBaseOption(
  id: string,
  label: string,
  textureDef: TextureDef
): BannerShieldBaseOption {
  return {
    id,
    label,
    textureDef,
    rectangle: [0, 0, 64, 64],
    crop: [0, 0, 64, 64],
  };
}

function addMissingBaseOptions(
  options: BannerShieldBaseOption[],
  baseOptions: BannerShieldBaseOption[]
): BannerShieldBaseOption[] {
  const missingBaseOptions = baseOptions.filter(
    (option) => !options.some(({ id }) => id === option.id)
  );
  return [...missingBaseOptions, ...options];
}
