import { type TextureDef, type TextureFrame } from "@genroot/builder";
import { makeCustomTextureVersion } from "../../_common/textures/customTextureVersionV2";
import customPlaceholderImage from "../../_common/textures/texture_custom.png";
import {
  type BannerShieldBaseOption,
  type BannerShieldTextureVersion,
} from "../../_common/patternTexturePicker/types";
import { pairBannerShieldPatterns } from "./pairPatterns";

import bannerBaseImage from "./banner_base.png";
import shieldBaseImage from "./shield_base.png";
import shieldBaseNoPatternImage from "./shield_base_nopattern.png";

const bannerBasePatternId = "banner_base";
const shieldBasePatternId = "shield_base";
const shieldBaseNoPatternId = "shield_base_nopattern";

// Two independent pattern-atlas slots (not the shared `_common/textures/
// customTextureVersion` singleton every other generator's single custom slot
// uses) — Banner & Shield needs a banner dye-pattern sheet and a shield
// dye-pattern sheet uploaded at once, and the singleton can only ever hold
// one atlas at a time.
export const customBannerPatternsVersion = makeCustomTextureVersion({
  id: "custom-banner-patterns",
  label: "Custom Banner Patterns",
  placeholderUrl: customPlaceholderImage.src,
  standardWidth: 64,
  standardHeight: 64,
});

export const customShieldPatternsVersion = makeCustomTextureVersion({
  id: "custom-shield-patterns",
  label: "Custom Shield Patterns",
  placeholderUrl: customPlaceholderImage.src,
  standardWidth: 64,
  standardHeight: 64,
});

// A multi-file upload's frame id is its raw filename, extension included
// (`imageToTextureFrames` in the shared `AtlasControl` pipeline never strips
// it — only the display label does). Stripping it here is what lets a
// pattern named e.g. "flower.png" pair correctly with a same-named pattern
// on the other target, or match the default seeded pattern id ("base").
function stripUploadedFrameExtension(frame: TextureFrame): TextureFrame {
  return { ...frame, id: frame.id.replace(/\.(png|jpe?g)$/i, "") };
}

export function cleanUploadedFrames(frames: TextureFrame[]): TextureFrame[] {
  return frames.map(stripUploadedFrameExtension);
}

// The three base textures are each their own dedicated single-image upload
// slot, not identified by matching an uploaded file's name against a fixed
// string — the input a file is dropped into is what determines its role.
// Each starts out showing the same bundled default art the real texture
// versions use, so a custom version renders correctly before any upload;
// uploading swaps only the `url`, keeping the fixed role id in place.
function makeCustomBaseTextureDef(id: string, initialUrl: string): TextureDef {
  return { id, url: initialUrl, standardWidth: 64, standardHeight: 64 };
}

export const customBannerBaseTextureDef = makeCustomBaseTextureDef(
  "custom-banner-base",
  bannerBaseImage.src
);
export const customShieldBaseTextureDef = makeCustomBaseTextureDef(
  "custom-shield-base",
  shieldBaseImage.src
);
export const customShieldBaseNoPatternTextureDef = makeCustomBaseTextureDef(
  "custom-shield-base-nopattern",
  shieldBaseNoPatternImage.src
);

export function updateCustomBannerBaseTexture(url: string): void {
  customBannerBaseTextureDef.url = url;
}
export function updateCustomShieldBaseTexture(url: string): void {
  customShieldBaseTextureDef.url = url;
}
export function updateCustomShieldBaseNoPatternTexture(url: string): void {
  customShieldBaseNoPatternTextureDef.url = url;
}

export const customBannerShieldTextureDefs: TextureDef[] = [
  customBannerPatternsVersion.textureDef,
  customShieldPatternsVersion.textureDef,
  customBannerBaseTextureDef,
  customShieldBaseTextureDef,
  customShieldBaseNoPatternTextureDef,
];

function makeBaseOption(
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

// Recomputed fresh on every call, unlike the static `bannerShieldTextureVersions`
// array — the pattern atlases' `.frames` are replaced in place each time the
// user uploads a new one, so the pairing has to be redone against their
// current contents rather than cached from whatever they held at module
// load time. The three base textures don't need pairing at all: each is
// already a single, unambiguous `BannerShieldBaseOption` built directly from
// its own dedicated slot.
export function makeCustomBannerShieldTextureVersion(): BannerShieldTextureVersion {
  const { patterns } = pairBannerShieldPatterns({
    bannerFrames: customBannerPatternsVersion.frames,
    shieldFrames: customShieldPatternsVersion.frames,
  });

  const bannerBase = makeBaseOption(
    bannerBasePatternId,
    "Banner Base",
    customBannerBaseTextureDef
  );
  const shieldBase = makeBaseOption(
    shieldBasePatternId,
    "Shield Base",
    customShieldBaseTextureDef
  );
  const shieldBaseNoPattern = makeBaseOption(
    shieldBaseNoPatternId,
    "Shield Base (No Pattern)",
    customShieldBaseNoPatternTextureDef
  );

  return {
    id: "custom",
    label: "Custom",
    bannerTextureDef: customBannerPatternsVersion.textureDef,
    shieldTextureDef: customShieldPatternsVersion.textureDef,
    bases: {
      bannerBase,
      shieldBase,
      shieldBaseNoPattern,
      bannerOptions: [bannerBase],
      shieldOptions: [shieldBase, shieldBaseNoPattern],
    },
    patterns,
  };
}
