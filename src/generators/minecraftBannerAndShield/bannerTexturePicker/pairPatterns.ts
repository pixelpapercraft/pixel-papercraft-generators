import { type TextureFrame } from "@genroot/builder/modules/textureData";
import {
  type BannerShieldBases,
  type BannerShieldPattern,
} from "./types";

const bannerBaseId = "banner_base";
const shieldBaseId = "shield_base";
const shieldBaseNoPatternId = "shield_base_nopattern";

export function pairBannerShieldPatterns({
  bannerFrames,
  shieldFrames,
}: {
  bannerFrames: TextureFrame[];
  shieldFrames: TextureFrame[];
}): {
  bases: BannerShieldBases;
  patterns: BannerShieldPattern[];
} {
  const bases: BannerShieldBases = {
    bannerBase: findFrame(bannerFrames, bannerBaseId),
    shieldBase: findFrame(shieldFrames, shieldBaseId),
    shieldBaseNoPattern: findFrame(shieldFrames, shieldBaseNoPatternId),
    bannerOptions: [],
    shieldOptions: [],
  };
  const bannerPatternFrames = bannerFrames.filter(
    (frame) => frame.id !== bannerBaseId
  );
  const shieldPatternFrames = shieldFrames.filter(
    (frame) => frame.id !== shieldBaseId && frame.id !== shieldBaseNoPatternId
  );
  const bannerFramesById = makeFrameMap(bannerPatternFrames);
  const shieldFramesById = makeFrameMap(shieldPatternFrames);
  const sharedPatternIds = new Set(
    Array.from(bannerFramesById.keys()).filter((id) =>
      shieldFramesById.has(id)
    )
  );
  bases.bannerOptions = bannerFrames.filter(
    (frame) => !sharedPatternIds.has(frame.id)
  );
  bases.shieldOptions = shieldFrames.filter(
    (frame) => !sharedPatternIds.has(frame.id)
  );
  const patternIds = Array.from(
    new Set([
      ...Array.from(bannerFramesById.keys()),
      ...Array.from(shieldFramesById.keys()),
    ])
  );

  return {
    bases,
    patterns: patternIds.map((id) => {
      const bannerFrame = bannerFramesById.get(id) ?? null;
      const shieldFrame = shieldFramesById.get(id) ?? null;
      return {
        id,
        label: bannerFrame?.label ?? shieldFrame?.label ?? id,
        bannerFrame,
        shieldFrame,
      };
    }),
  };
}

function findFrame(frames: TextureFrame[], id: string): TextureFrame | null {
  return frames.find((frame) => frame.id === id) ?? null;
}

function makeFrameMap(frames: TextureFrame[]): Map<string, TextureFrame> {
  return new Map(frames.map((frame) => [frame.id, frame]));
}
