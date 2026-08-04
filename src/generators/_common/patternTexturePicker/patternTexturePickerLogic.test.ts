import { describe, expect, it } from "vitest";
import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { type TextureFrame } from "@genroot/builder/engine/textureData";
import { type BannerShieldTextureVersion } from "./types";
import {
  filterPatternOptions,
  findSelectedPatternOption,
  makeFrontFacePreviewSize,
  makePatternOptions,
  makePatternPreviewStyle,
  makeTileFrameStyle,
  makeTintMaskStyle,
} from "./patternTexturePickerLogic";

const bannerTextureDef: TextureDef = {
  id: "banner-patterns",
  url: "/banner-patterns.png",
  standardWidth: 512,
  standardHeight: 384,
};
const shieldTextureDef: TextureDef = {
  id: "shield-patterns",
  url: "/shield-patterns.png",
  standardWidth: 512,
  standardHeight: 384,
};

function frame(id: string, x: number): TextureFrame {
  return {
    id,
    label: id.replace(/_/g, " "),
    rectangle: [x, 0, 64, 64],
    crop: [0, 0, 64, 64],
  };
}

const version: BannerShieldTextureVersion = {
  id: "test-version",
  label: "Test Version",
  bannerTextureDef,
  shieldTextureDef,
  bases: {
    bannerBase: null,
    shieldBase: null,
    shieldBaseNoPattern: null,
    bannerOptions: [],
    shieldOptions: [],
  },
  patterns: [
    {
      id: "creeper",
      label: "Creeper",
      bannerFrame: frame("creeper", 0),
      shieldFrame: frame("creeper", 64),
    },
    {
      id: "banner_only",
      label: "Banner Only",
      bannerFrame: frame("banner_only", 128),
      shieldFrame: null,
    },
    {
      id: "shield_only",
      label: "Shield Only",
      bannerFrame: null,
      shieldFrame: frame("shield_only", 192),
    },
    { id: "neither", label: "Neither", bannerFrame: null, shieldFrame: null },
  ],
};

describe("makePatternOptions", () => {
  it("prefers the banner frame, falls back to the shield frame, and drops patterns with neither", () => {
    const options = makePatternOptions(version);
    expect(options.map(({ pattern }) => pattern.id)).toEqual([
      "creeper",
      "banner_only",
      "shield_only",
    ]);
    expect(options[0]!.textureDef).toBe(bannerTextureDef);
    expect(options[0]!.frame).toBe(version.patterns[0]!.bannerFrame);
    expect(options[2]!.textureDef).toBe(shieldTextureDef);
    expect(options[2]!.frame).toBe(version.patterns[2]!.shieldFrame);
  });
});

describe("filterPatternOptions", () => {
  const options = makePatternOptions(version);

  it("returns everything for an empty search", () => {
    expect(filterPatternOptions(options, "")).toHaveLength(3);
  });

  it("matches case-insensitively against the label", () => {
    expect(
      filterPatternOptions(options, "CREEP").map(({ pattern }) => pattern.id)
    ).toEqual(["creeper"]);
  });

  it("matches nothing for an unrelated search", () => {
    expect(filterPatternOptions(options, "zzz")).toEqual([]);
  });
});

describe("findSelectedPatternOption", () => {
  const options = makePatternOptions(version);

  it("finds the option matching the selected id", () => {
    expect(findSelectedPatternOption(options, "banner_only")?.pattern.id).toBe(
      "banner_only"
    );
  });

  it("returns null for null (nothing armed)", () => {
    expect(findSelectedPatternOption(options, null)).toBeNull();
  });

  it("returns null for an id not present in the options", () => {
    expect(findSelectedPatternOption(options, "unknown")).toBeNull();
  });
});

describe("makeFrontFacePreviewSize", () => {
  it("keeps the front-face crop's 20:40 aspect ratio at any height", () => {
    expect(makeFrontFacePreviewSize(128)).toEqual({ width: 64, height: 128 });
    expect(makeFrontFacePreviewSize(64)).toEqual({ width: 32, height: 64 });
  });
});

describe("makeTileFrameStyle", () => {
  it("uses a darker border when selected", () => {
    expect(makeTileFrameStyle(true, 64).border).toContain("rgb(156 163 175)");
    expect(makeTileFrameStyle(false, 64).border).toContain("rgb(229 231 235)");
  });

  it("sizes the frame to the crop's aspect ratio plus the border", () => {
    expect(makeTileFrameStyle(false, 64)).toEqual({
      border: "4px solid rgb(229 231 235)",
      width: "40px",
      height: "72px",
    });
  });
});

describe("makePatternPreviewStyle", () => {
  it("positions the background at the frame's scaled front-face crop", () => {
    const style = makePatternPreviewStyle(
      bannerTextureDef,
      frame("creeper", 128),
      64
    );
    // frame at x=128 (2 frames in), crop [1,1,20,40] scaled ×1 (64px frame,
    // frameSize 64) => source region starts at (129, 1); preview height 64
    // means scale = 64/40 = 1.6.
    expect(style.backgroundPosition).toBe("-206.4px -1.6px");
    expect(style.backgroundImage).toBe(`url(${bannerTextureDef.url})`);
  });
});

describe("makeTintMaskStyle", () => {
  it("returns undefined when there's no tint", () => {
    expect(
      makeTintMaskStyle(bannerTextureDef, frame("creeper", 0), 64, null)
    ).toBeUndefined();
  });

  it("builds a multiply-blend mask matching the same crop as the preview", () => {
    const mask = makeTintMaskStyle(
      bannerTextureDef,
      frame("creeper", 0),
      64,
      "#B02E26"
    );
    expect(mask).toMatchObject({
      backgroundColor: "#B02E26",
      mixBlendMode: "multiply",
      maskImage: `url(${bannerTextureDef.url})`,
    });
  });
});
