import path from "path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";

type Pixel = [number, number, number, number];

async function readPixel(
  imagePath: string,
  x: number,
  y: number
): Promise<Pixel> {
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const index = (y * info.width + x) * 4;
  return [
    data[index + 0] ?? 0,
    data[index + 1] ?? 0,
    data[index + 2] ?? 0,
    data[index + 3] ?? 0,
  ];
}

describe("banner pattern texture data", () => {
  const bannerPatternsPath = path.resolve(
    "src/generators/minecraftBannerAndShield/textures/texture_minecraft_26_2_banner_patterns.png"
  );

  it("keeps translucent banner pattern pixels in straight alpha form", async () => {
    const gradientFrameX = 448;
    const gradientFrameY = 64;
    const frontFaceX = 1 + 10;

    await expect(
      readPixel(
        bannerPatternsPath,
        gradientFrameX + frontFaceX,
        gradientFrameY + 1
      )
    ).resolves.toEqual([233, 233, 233, 255]);
    await expect(
      readPixel(
        bannerPatternsPath,
        gradientFrameX + frontFaceX,
        gradientFrameY + 1 + 20
      )
    ).resolves.toEqual([242, 242, 242, 127]);
    await expect(
      readPixel(
        bannerPatternsPath,
        gradientFrameX + frontFaceX,
        gradientFrameY + 1 + 39
      )
    ).resolves.toEqual([0, 0, 0, 0]);
  });
});
