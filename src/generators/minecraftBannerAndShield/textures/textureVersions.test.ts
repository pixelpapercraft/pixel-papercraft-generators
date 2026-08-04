import { describe, expect, it } from "vitest";
import {
  bannerShieldTextureVersions,
  bannerShieldVersionIds,
  findBannerShieldTextureVersion,
  findPatternVersionId,
} from "./textureVersions";

describe("bannerShieldTextureVersions", () => {
  it("builds both generated versions with real pattern data", () => {
    expect(bannerShieldVersionIds).toEqual([
      "minecraft-26-2-banner-shield",
      "vanilla-tweaks-26-2-banner-shield",
    ]);
    for (const version of bannerShieldTextureVersions) {
      expect(version.patterns.length).toBeGreaterThan(0);
      expect(
        version.patterns.every(
          (pattern) =>
            pattern.bannerFrame !== null || pattern.shieldFrame !== null
        )
      ).toBe(true);
    }
  });

  it("the two versions share the same banner-pattern set, differing only in shield art", () => {
    const [minecraft, vanillaTweaks] = bannerShieldTextureVersions;
    expect(minecraft!.patterns.map(({ id }) => id)).toEqual(
      vanillaTweaks!.patterns.map(({ id }) => id)
    );
  });
});

describe("findBannerShieldTextureVersion", () => {
  it("finds a known version and returns null for an unknown id", () => {
    expect(
      findBannerShieldTextureVersion("minecraft-26-2-banner-shield")?.label
    ).toBe("Minecraft 26.2");
    expect(findBannerShieldTextureVersion("unknown")).toBeNull();
  });
});

describe("findPatternVersionId", () => {
  it("keeps the preferred version when it has the pattern", () => {
    expect(
      findPatternVersionId("vanilla-tweaks-26-2-banner-shield", "creeper")
    ).toBe("vanilla-tweaks-26-2-banner-shield");
  });

  it("falls back to null when the preferred version lacks the pattern", () => {
    expect(
      findPatternVersionId("minecraft-26-2-banner-shield", "not-a-pattern")
    ).toBeNull();
  });

  it("finds the first version containing the pattern when no version is preferred", () => {
    expect(findPatternVersionId(null, "creeper")).toBe(
      "minecraft-26-2-banner-shield"
    );
  });
});
