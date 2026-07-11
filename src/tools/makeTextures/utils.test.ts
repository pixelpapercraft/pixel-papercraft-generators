import Fs from "fs";
import Os from "os";
import Path from "path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";

import { makeTiledImages } from "./utils";

describe("makeTiledImages", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    while (tempRoots.length > 0) {
      const tempRoot = tempRoots.pop();
      if (tempRoot) {
        Fs.rmSync(tempRoot, { recursive: true, force: true });
      }
    }
  });

  it("writes the packed atlas and crop-aware type data without a json sidecar", async () => {
    const tempRoot = Fs.mkdtempSync(Path.join(Os.tmpdir(), "make-textures-"));
    tempRoots.push(tempRoot);

    const sourceDirectory = Path.join(tempRoot, "source");
    const outputDirectory = Path.join(tempRoot, "output");
    Fs.mkdirSync(sourceDirectory, { recursive: true });
    Fs.mkdirSync(outputDirectory, { recursive: true });

    const sourceImagePath = Path.join(sourceDirectory, "sprite.png");
    const sourcePixels = Buffer.alloc(4 * 4 * 4);
    const pixelIndex = (2 * 4 + 1) * 4;
    sourcePixels[pixelIndex] = 255;
    sourcePixels[pixelIndex + 1] = 0;
    sourcePixels[pixelIndex + 2] = 0;
    sourcePixels[pixelIndex + 3] = 255;
    await sharp(sourcePixels, {
      raw: { width: 4, height: 4, channels: 4 },
    })
      .png()
      .toFile(sourceImagePath);

    await makeTiledImages("test-item", sourceDirectory, outputDirectory, "texture");

    const basePath = Path.join(outputDirectory, "texture_test_item");
    const atlasPath = `${basePath}.png`;
    const typePath = `${basePath}.ts`;

    expect(Fs.existsSync(atlasPath)).toBe(true);
    expect(Fs.existsSync(typePath)).toBe(true);
    expect(Fs.existsSync(`${basePath}.json`)).toBe(false);

    const atlasMetadata = await sharp(atlasPath).metadata();
    expect(atlasMetadata.width).toBe(512);
    expect(atlasMetadata.height).toBe(4);

    const typeFile = Fs.readFileSync(typePath, "utf8");
    expect(typeFile).toContain('id: "test-item"');
    expect(typeFile).toContain("standardWidth: 512");
    expect(typeFile).toContain("standardHeight: 4");
    expect(typeFile).toContain('crop: [1, 2, 1, 1]');
    expect(typeFile).toContain('satisfies TextureData["tiles"]');
    expect(typeFile).toContain("satisfies TextureData;");
  });
});
