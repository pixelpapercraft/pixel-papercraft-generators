import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type TextureData,
  tilesToTextureFrames,
} from "@genroot/builder/modules/textureData";
import { pairBannerShieldPatterns } from "../bannerTexturePicker/pairPatterns";
import { type BannerShieldTextureVersion } from "../bannerTexturePicker/types";
import {
  customBannerTextureDef,
  defaultBannerBaseTextureDef,
  defaultShieldBaseNoPatternTextureDef,
  defaultShieldBaseTextureDef,
  customShieldTextureDef,
  makeCustomBannerShieldTextureVersion,
} from "./customBannerShieldTextureVersion";
import * as Texture_26_2_Banner from "./texture_minecraft_26_2_banner_patterns";
import * as Texture_26_2_Shield from "./texture_minecraft_26_2_shield_patterns";
import * as Texture_26_2_HD_Shield from "./texture_vanilla_tweaks_26_2_shield_patterns";

type BannerShieldTextureDefinition = {
  id: string;
  label: string;
  bannerData: TextureData;
  shieldData: TextureData;
  frameSize: number;
};

const generatedBannerShieldDefinitions: BannerShieldTextureDefinition[] = [
  {
    id: "minecraft-26-2-banner-shield",
    label: "Minecraft 26.2",
    bannerData: Texture_26_2_Banner.data,
    shieldData: Texture_26_2_Shield.data,
    frameSize: 64,
  },
  {
    id: "vanilla-tweaks-26-2-banner-shield",
    label: "Vanilla Tweaks 26.2 - HD Shields",
    bannerData: Texture_26_2_Banner.data,
    shieldData: Texture_26_2_HD_Shield.data,
    frameSize: 64,
  },
];

export const generatedBannerShieldTextureVersions: BannerShieldTextureVersion[] =
  generatedBannerShieldDefinitions.map(
    ({ id, label, bannerData, shieldData, frameSize }) => {
      const bannerFrames = tilesToTextureFrames(bannerData.tiles, frameSize);
      const shieldFrames = tilesToTextureFrames(shieldData.tiles, frameSize);
      const { bases, patterns } = pairBannerShieldPatterns({
        bannerFrames,
        shieldFrames,
      });

      return {
        id,
        label,
        bannerTextureDef: bannerData.textureDef,
        shieldTextureDef: shieldData.textureDef,
        bases,
        patterns,
      };
    }
  );

export function getBannerShieldTextureVersions(): BannerShieldTextureVersion[] {
  return [
    ...generatedBannerShieldTextureVersions,
    makeCustomBannerShieldTextureVersion(),
  ];
}

export function findBannerShieldTextureVersion(
  versionId: string
): BannerShieldTextureVersion | null {
  return (
    getBannerShieldTextureVersions().find(({ id }) => id === versionId) ?? null
  );
}

export function findPatternVersionId(
  preferredVersionId: string | null,
  patternId: string
): string | null {
  if (preferredVersionId) {
    const preferredVersion = findBannerShieldTextureVersion(preferredVersionId);
    const hasPreferredPattern = preferredVersion?.patterns.some(
      ({ id }) => id === patternId
    );
    return hasPreferredPattern ? preferredVersionId : null;
  }

  return (
    getBannerShieldTextureVersions().find(({ patterns }) =>
      patterns.some(({ id }) => id === patternId)
    )?.id ?? null
  );
}

export const bannerShieldVersionIds = [
  ...generatedBannerShieldTextureVersions.map(({ id }) => id),
  "custom",
];

export const bannerShieldTextureDefs: TextureDef[] = [
  ...generatedBannerShieldTextureVersions.flatMap(
    ({ bannerTextureDef, shieldTextureDef }) => [
      bannerTextureDef,
      shieldTextureDef,
    ]
  ),
  customBannerTextureDef,
  customShieldTextureDef,
  defaultBannerBaseTextureDef,
  defaultShieldBaseTextureDef,
  defaultShieldBaseNoPatternTextureDef,
];
