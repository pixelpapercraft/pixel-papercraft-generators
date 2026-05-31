import Path from "path";
import Fs from "fs";
import ChildProcess from "child_process";
import { Jimp, intToRGBA, type JimpInstance } from "jimp";
import { type ImageInfo, readImageInfo } from "../common/imageInfo";
import {
  type Rectangle,
  type TextureData_Tile,
  imageToTextureFrames,
  sortTextureDataTiles,
} from "../../builder/modules/textureData";
import { packImages } from "../../builder/modules/texturePacking";

type ImageWithInfo = {
  name: string;
  path: string;
  info: ImageInfo;
};

type ImageWithCoordinates = {
  image: ImageWithInfo;
  coordinates: [number, number];
};

type JimpReadImage = Awaited<ReturnType<typeof Jimp.read>>;

type TileFrameWithCrop = {
  rectangle: Rectangle;
  crop: Rectangle;
};

function makeSafeFileName(prefix: string, version: string): string {
  return prefix + "_" + version.replace(/[-.]/g, "_");
}

function hasImageExtension(path: string): boolean {
  return path.endsWith(".png");
}

function toImageWithInfo(path: string): ImageWithInfo {
  const { name } = Path.parse(path);
  const file = Fs.readFileSync(path);
  const info = readImageInfo(file);
  if (!info) {
    throw new Error(`Failed to read image info from ${path}`);
  }
  return { name, path, info };
}

function isFile(path: string): boolean {
  const stats = Fs.statSync(path);
  return stats.isFile();
}

function isImageFile(path: string): boolean {
  return hasImageExtension(path) && isFile(path);
}

function readImagesInDirectory(directoryPath: string): ImageWithInfo[] {
  return Fs.readdirSync(directoryPath)
    .map((fileName: string) => Path.join(directoryPath, fileName))
    .filter(isImageFile)
    .map(toImageWithInfo);
}

function calculateImagesWithCoordinates(
  images: ImageWithInfo[],
  canvasWidth: number
): {
  imagesWithCoordinates: ImageWithCoordinates[];
  canvasHeight: number;
} {
  const packableImages = images.map((image, index) => ({
    id: image.name,
    label: image.name,
    rectangle: [0, 0, image.info.width, image.info.height] satisfies Rectangle,
    crop: [0, 0, image.info.width, image.info.height] satisfies Rectangle,
    sourceIndex: index,
  }));

  const packed = packImages(packableImages, canvasWidth);
  const sourceImageById = new Map(
    packableImages.map((image) => [image.id, image.sourceIndex] as const)
  );

  const imagesWithCoordinates = packed.frames
    .map((frame) => ({
      sourceIndex: sourceImageById.get(frame.id) ?? 0,
      coordinates: [frame.rectangle[0], frame.rectangle[1]] as [number, number],
    }))
    .sort((a, b) => a.sourceIndex - b.sourceIndex)
    .map((packedFrame) => ({
      image: images[packedFrame.sourceIndex]!,
      coordinates: packedFrame.coordinates,
    }));

  return {
    imagesWithCoordinates,
    canvasHeight: packed.atlasHeight,
  };
}

async function makeCanvas(
  width: number,
  height: number
): Promise<JimpInstance> {
  return new Jimp({ width, height });
}

async function makeTiledImagesCanvas(
  images: ImageWithInfo[],
  canvasWidth: number
): Promise<[ImageWithCoordinates[], JimpInstance, number, number]> {
  const { imagesWithCoordinates, canvasHeight } =
    calculateImagesWithCoordinates(images, canvasWidth);
  const canvas = await makeCanvas(canvasWidth, canvasHeight);

  for (const imageWithCoordinates of imagesWithCoordinates) {
    const { image, coordinates } = imageWithCoordinates;
    const [x, y] = coordinates;
    const sourceImage = await Jimp.read(image.path);
    canvas.blit({ src: sourceImage, x, y });
  }

  return [imagesWithCoordinates, canvas, canvasWidth, canvasHeight];
}

async function writeTileImage(
  canvas: JimpInstance,
  tileImagePath: `${string}.png`
): Promise<void> {
  await canvas.write(tileImagePath);
}

function printStdOutput(stdout: string | null, stderr: string | null): void {
  if (stdout && stdout.length > 0) {
    console.log(stdout);
  }
  if (stderr && stderr.length > 0) {
    console.log(stderr);
  }
}

function formatTypeScriptFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ChildProcess.exec("npx prettier --write " + path, (exn, stdout, stderr) => {
      if (exn) {
        reject(exn);
      } else {
        printStdOutput(stdout, stderr);
        resolve();
      }
    });
  });
}

async function writeTileTypeScript(
  id: string,
  tileImagePath: string,
  tiles: TextureData_Tile[],
  canvasWidth: number,
  canvasHeight: number,
  tileTypeScriptPath: string
): Promise<void> {
  const { base } = Path.parse(tileImagePath);
  const code = `
    // This is a generated file

    import { type TextureDef } from "@genroot/builder/modules/generatorDef";
    import { type TextureData } from "@genroot/builder/modules/textureData";

    import image from "./${base}";

    const textureDef: TextureDef = {
      id: "${id}",
      url: image.src,
      standardWidth: ${canvasWidth},
      standardHeight: ${canvasHeight},
    }

    export const tiles = ${JSON.stringify(tiles)} satisfies TextureData["tiles"];

    export const data = { textureDef, tiles } satisfies TextureData;
  `;
  Fs.writeFileSync(tileTypeScriptPath, code);
  await formatTypeScriptFile(tileTypeScriptPath);
}

function getFrameCrop(
  image: JimpReadImage,
  [frameX, frameY, frameWidth, frameHeight]: Rectangle
): Rectangle {
  let minX = frameWidth;
  let minY = frameHeight;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < frameHeight; y += 1) {
    for (let x = 0; x < frameWidth; x += 1) {
      const { a } = intToRGBA(image.getPixelColor(frameX + x, frameY + y));
      if (a === 0) {
        continue;
      }

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  return maxX === -1
    ? [0, 0, frameWidth, frameHeight]
    : [minX, minY, maxX - minX + 1, maxY - minY + 1];
}

async function makeTileInfos(
  imagesWithCoordinates: ImageWithCoordinates[]
): Promise<TextureData_Tile[]> {
  const tiles: Array<{ name: string; frames: TileFrameWithCrop[] }> =
    await Promise.all(
      imagesWithCoordinates.map(async ({ image, coordinates }) => {
        const sourceImage = await Jimp.read(image.path);
        const { name, info } = image;
        const { width, height } = info;
        const [imageX, imageY] = coordinates;
        const frames = imageToTextureFrames(name, width, height).map(
          (frame) => {
            const [frameX, frameY, frameWidth, frameHeight] = frame.rectangle;
            return {
              rectangle: [
                imageX + frameX,
                imageY + frameY,
                frameWidth,
                frameHeight,
              ],
              crop: getFrameCrop(sourceImage, frame.rectangle),
            } satisfies TileFrameWithCrop;
          }
        );
        return { name, frames };
      })
    );

  return sortTextureDataTiles(tiles, inferUsualFrameSize(tiles));
}

function inferUsualFrameSize(
  tiles: Array<{ frames: TileFrameWithCrop[] }>
): number {
  const frameSizes = tiles.flatMap((tile) => {
    if (tile.frames.length !== 1) {
      return [];
    }

    const frame = tile.frames[0];
    if (!frame) {
      return [];
    }

    const [, , width, height] = frame.rectangle;
    return width === height ? [width] : [];
  });

  return frameSizes.length > 0 ? Math.min(...frameSizes) : 0;
}

export async function makeTiledImages(
  id: string,
  sourceDirectory: string,
  outputDirectory: string,
  outputPrefix: string
): Promise<void> {
  const canvasWidth = 512;

  const fileName = makeSafeFileName(outputPrefix, id);
  const basePath = outputDirectory + "/" + fileName;
  const tileImagePath: `${string}.png` = `${basePath}.png`;
  const tileTypeScriptPath = basePath + ".ts";

  const images = readImagesInDirectory(sourceDirectory);
  const [imagesWithCoordinates, canvas, atlasWidth, atlasHeight] =
    await makeTiledImagesCanvas(images, canvasWidth);

  await writeTileImage(canvas, tileImagePath);
  const tiles = await makeTileInfos(imagesWithCoordinates);

  await writeTileTypeScript(
    id,
    tileImagePath,
    tiles,
    atlasWidth,
    atlasHeight,
    tileTypeScriptPath
  );
}
