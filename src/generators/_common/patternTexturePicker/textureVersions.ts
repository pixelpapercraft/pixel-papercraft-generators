import {
  type TextureData,
  tilesToTextureFrames,
} from "@genroot/builder/engine/textureData";
import { pairBannerShieldPatterns } from "./pairPatterns";
import { type BannerShieldTextureVersion } from "./types";
import * as Texture_26_2_Banner from "./textures/texture_minecraft_26_2_banner_patterns";
import * as Texture_26_2_Shield from "./textures/texture_minecraft_26_2_shield_patterns";
import * as Texture_26_2_HD_Shield from "./textures/texture_vanilla_tweaks_26_2_shield_patterns";

type BannerShieldTextureDefinition = {
  id: string;
  label: string;
  bannerData: TextureData;
  shieldData: TextureData;
  frameSize: number;
};

const bannerShieldTextureDefinitions: BannerShieldTextureDefinition[] = [
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

export const bannerShieldTextureVersions: BannerShieldTextureVersion[] =
  bannerShieldTextureDefinitions.map(
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

export function findBannerShieldTextureVersion(
  versionId: string
): BannerShieldTextureVersion | null {
  return bannerShieldTextureVersions.find(({ id }) => id === versionId) ?? null;
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
    bannerShieldTextureVersions.find(({ patterns }) =>
      patterns.some(({ id }) => id === patternId)
    )?.id ?? null
  );
}

export const bannerShieldVersionIds = bannerShieldTextureVersions.map(
  ({ id }) => id
);
