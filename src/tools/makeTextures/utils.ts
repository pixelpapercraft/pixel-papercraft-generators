import Path from "path";
import Fs from "fs";
import ChildProcess from "child_process";
import Jimp from "jimp";
import { type ImageInfo, readImageInfo } from "../common/imageInfo";

type ImageWithInfo = {
  name: string;
  path: string;
  info: ImageInfo;
};

type ImageWithCoordinates = {
  image: ImageWithInfo;
  coordinates: [number, number];
};

type TileFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TileInfo = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  frames: TileFrame[];
};

function makeSafeFileName(prefix: string, version: string): string {
  return prefix + "_" + version.replace(/[-\.]/g, "_");
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

function isDirectory(path: string): boolean {
  const stats = Fs.statSync(path);
  return stats.isDirectory();
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

function sortImagesByHeight(images: ImageWithInfo[]): ImageWithInfo[] {
  return images.sort((image1, image2) => {
    return image1.info.height - image2.info.height;
  });
}

function calculateImagesWithCoordinates(
  images: ImageWithInfo[],
  canvasWidth: number
): {
  imagesWithCoordinates: ImageWithCoordinates[];
  canvasWidth: number;
  canvasHeight: number;
} {
  const imagesSorted = sortImagesByHeight(images);
  let nextx = 0;
  let nexty = 0;
  let rowHeight = 0;
  let canvasHeight = 0;

  const coordinates: Record<string, [number, number, number, number]> = {};

  const imagesWithCoordinates: ImageWithCoordinates[] = [];
  imagesSorted.forEach((sourceImage) => {
    const { name, info } = sourceImage;
    const { width, height } = info;

    if (width > canvasWidth) {
      console.warn(
        `WARNING: ${name} has width ${width} greater than the canvas width ${canvasWidth} and was not added`
      );
    } else {
      let x, y;
      if (nextx + width > canvasWidth) {
        x = 0;
        y = nexty + rowHeight;

        nextx = x + width;
        nexty = y;

        canvasHeight += rowHeight;
        rowHeight = height;
      } else {
        x = nextx;
        y = nexty;

        nextx = x + width;

        if (height > rowHeight) {
          rowHeight = height;
        }
      }

      coordinates[name] = [x, y, width, height];
      imagesWithCoordinates.push({ image: sourceImage, coordinates: [x, y] });
    }
  });

  canvasHeight += rowHeight;

  return { imagesWithCoordinates, canvasWidth, canvasHeight };
}

function makeCanvas(width: number, height: number): Promise<Jimp> {
  return new Promise((resolve, reject) => {
    new Jimp(width, height, (error: Error, canvas: Jimp) => {
      if (error) {
        reject(error);
      } else {
        resolve(canvas);
      }
    });
  });
}

async function makeTiledImagesCanvas(
  images: ImageWithInfo[],
  canvasWidth: number
): Promise<[ImageWithCoordinates[], Jimp, number, number]> {
  const { imagesWithCoordinates, canvasHeight } =
    calculateImagesWithCoordinates(images, canvasWidth);

  return imagesWithCoordinates
    .reduce(
      (acc, imageWithCoordinates) => {
        const { image, coordinates } = imageWithCoordinates;
        const [x, y] = coordinates;
        return acc.then((canvas) => {
          return Jimp.read(image.path).then((image: Jimp) => {
            return canvas.blit(image, x, y);
          });
        });
      },
      makeCanvas(canvasWidth, canvasHeight)
    )
    .then((canvas) => {
      return [imagesWithCoordinates, canvas, canvasWidth, canvasHeight];
    });
}

async function writeTileImage(
  canvas: Jimp,
  tileImagePath: string
): Promise<void> {
  await canvas.writeAsync(tileImagePath);
}

function writeTileJson(
  imagesWithCoordinates: ImageWithCoordinates[],
  tileJsonPath: string
): void {
  const tileInfos = imagesWithCoordinates.map((imagesWithCoordinates) => {
    const { image, coordinates } = imagesWithCoordinates;
    const { name, info } = image;
    const { width, height } = info;
    const [x, y] = coordinates;
    return { name, x, y, width, height };
  });
  const json = JSON.stringify(tileInfos, null, 2);
  Fs.writeFileSync(tileJsonPath, json);
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

function writeTileTypeScript(
  id: string,
  tileImagePath: string,
  tileInfos: TileInfo[],
  canvasWidth: number,
  canvasHeight: number,
  tileTypeScriptPath: string
): void {
  const { base } = Path.parse(tileImagePath);
  const code = `
    // This is a generated file

    type TextureDef = {
      id: string;
      url: string;
      standardWidth: number;
      standardHeight: number;
    };

    import image from "./${base}";

    const textureDef: TextureDef = {
      id: "${id}",
      url: image.src,
      standardWidth: ${canvasWidth},
      standardHeight: ${canvasHeight},
    }

    export const tiles = ${JSON.stringify(tileInfos)}

    export const data = { textureDef, tiles };
  `;
  Fs.writeFileSync(tileTypeScriptPath, code);
  formatTypeScriptFile(tileTypeScriptPath);
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
  const tileImagePath = basePath + ".png";
  const tileJsonPath = basePath + ".json";
  const tileTypeScriptPath = basePath + ".ts";

  const images = readImagesInDirectory(sourceDirectory);

  await makeTiledImagesCanvas(images, canvasWidth).then((results) => {
    const [imagesWithCoordinates, canvas, canvasWidth, canvasHeight] = results;
    writeTileImage(canvas, tileImagePath).then(() => {
      writeTileJson(imagesWithCoordinates, tileJsonPath);
      const tileInfos = imagesWithCoordinates.map((imageWithCoordinates) => {
        const { image, coordinates } = imageWithCoordinates;
        const { name, info } = image;
        const { width, height } = info;
        const [x, y] = coordinates;

        const frameWidth = width;
        const frameHeight = width; // Assume square frames
        const frameCount = Math.floor(height / frameHeight);

        const frames = [];

        for (let i = 0; i < frameCount; i++) {
          frames.push({
            x,
            y: y + i * frameHeight,
            width: frameWidth,
            height: frameHeight,
          });
        }

        return { name, x, y, width, height, frames };
      });

      writeTileTypeScript(
        id,
        tileImagePath,
        tileInfos,
        canvasWidth,
        canvasHeight,
        tileTypeScriptPath
      );
    });
  });
}
