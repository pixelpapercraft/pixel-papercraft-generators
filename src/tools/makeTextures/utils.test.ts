import Fs from "fs";
import Os from "os";
import Path from "path";
import { Jimp, rgbaToInt } from "jimp";
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

    const sourceImagePath: `${string}.png` = Path.join(
      sourceDirectory,
      "sprite.png"
    ) as `${string}.png`;
    const sourceImage = await new Jimp({
      width: 4,
      height: 4,
      color: rgbaToInt(0, 0, 0, 0),
    });
    sourceImage.setPixelColor(rgbaToInt(255, 0, 0, 255), 1, 2);
    await sourceImage.write(sourceImagePath);

    await makeTiledImages("test-item", sourceDirectory, outputDirectory, "texture");

    const basePath = Path.join(outputDirectory, "texture_test_item");
    const atlasPath = `${basePath}.png`;
    const typePath = `${basePath}.ts`;

    expect(Fs.existsSync(atlasPath)).toBe(true);
    expect(Fs.existsSync(typePath)).toBe(true);
    expect(Fs.existsSync(`${basePath}.json`)).toBe(false);

    const atlas = await Jimp.read(atlasPath);
    expect(atlas.bitmap.width).toBe(512);
    expect(atlas.bitmap.height).toBe(4);

    const typeFile = Fs.readFileSync(typePath, "utf8");
    expect(typeFile).toContain('id: "test-item"');
    expect(typeFile).toContain("standardWidth: 512");
    expect(typeFile).toContain("standardHeight: 4");
    expect(typeFile).toContain('crop: [1, 2, 1, 1]');
    expect(typeFile).toContain('satisfies TextureData["tiles"]');
    expect(typeFile).toContain("satisfies TextureData;");
  });
});
