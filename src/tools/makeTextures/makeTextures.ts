import Fs from "fs";
import Path from "path";
import { makeTiledImages } from "./utils";

function checkSourceDirectory(sourceDirectory: string) {
  return Fs.existsSync(sourceDirectory) ? sourceDirectory : null;
}

function makeTextures(
  id: string,
  sourceDirectory: string,
  outputDirectory: string
) {
  const outputPrefix = "texture";
  makeTiledImages(id, sourceDirectory, outputDirectory, outputPrefix).catch(
    (error: unknown) => {
      console.error(error);
    }
  );
}

function showHelp() {
  console.log("Usage: npm run makeTextures <textureId> <sourceDir>");
}

const argv = process.argv;
const textureId = argv[2];
const sourceDirectory = argv[3];
const outputDirectory = Path.resolve(__dirname, "../../textures");

if (textureId && sourceDirectory) {
  const sourceDir = checkSourceDirectory(sourceDirectory);
  if (sourceDir) {
    makeTextures(textureId, sourceDir, outputDirectory);
  } else {
    console.error("Source directory not found");
  }
} else {
  showHelp();
}
