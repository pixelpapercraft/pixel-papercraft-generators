import { describe, expect, it } from "vitest";
import { type TextureFrame } from "@genroot/builder/modules/textureData";
import { pairBannerShieldPatterns } from "./pairPatterns";

function frame(id: string): TextureFrame {
  return {
    id,
    label: id.replace(/_/g, " "),
    rectangle: [0, 0, 16, 16],
    crop: [0, 0, 16, 16],
  };
}

describe("pairBannerShieldPatterns", () => {
  it("separates base frames and pairs matching pattern frames", () => {
    const result = pairBannerShieldPatterns({
      bannerFrames: [
        frame("banner_base"),
        frame("stripe_bottom"),
        frame("banner_only"),
      ],
      shieldFrames: [
        frame("shield_base"),
        frame("shield_base_nopattern"),
        frame("stripe_bottom"),
        frame("shield_only"),
      ],
    });

    expect(result.bases.bannerBase?.id).toBe("banner_base");
    expect(result.bases.shieldBase?.id).toBe("shield_base");
    expect(result.bases.shieldBaseNoPattern?.id).toBe(
      "shield_base_nopattern"
    );
    expect(result.bases.bannerOptions.map(({ id }) => id)).toEqual([
      "banner_base",
      "banner_only",
    ]);
    expect(result.bases.shieldOptions.map(({ id }) => id)).toEqual([
      "shield_base",
      "shield_base_nopattern",
      "shield_only",
    ]);
    expect(result.patterns).toEqual([
      {
        id: "stripe_bottom",
        label: "stripe bottom",
        bannerFrame: frame("stripe_bottom"),
        shieldFrame: frame("stripe_bottom"),
      },
      {
        id: "banner_only",
        label: "banner only",
        bannerFrame: frame("banner_only"),
        shieldFrame: null,
      },
      {
        id: "shield_only",
        label: "shield only",
        bannerFrame: null,
        shieldFrame: frame("shield_only"),
      },
    ]);
  });
});
