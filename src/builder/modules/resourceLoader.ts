import {
  type ImageWithCanvas,
  makeImageWithCanvasFromUrl,
} from "./imageWithCanvas";
import { type Texture, makeTextureFromUrl } from "./texture";
import {
  type ImageDef,
  type TextureDef,
  type GeneratorDef,
} from "./generatorDef";

type ImageTuple = [string, ImageWithCanvas];

type TextureTuple = [string, Texture];

async function imageDefToImage(imageDef: ImageDef): Promise<ImageTuple> {
  const image = await makeImageWithCanvasFromUrl(imageDef.url);
  return [imageDef.id, image];
}

async function textureDefToTexture(
  textureDef: TextureDef
): Promise<TextureTuple> {
  const texture = await makeTextureFromUrl(
    textureDef.url,
    textureDef.standardWidth,
    textureDef.standardHeight
  );
  return [textureDef.id, texture];
}

export async function loadResources(
  generatorDef: GeneratorDef
): Promise<[ImageTuple[], TextureTuple[]]> {
  const imagePromises = Promise.all(generatorDef.images.map(imageDefToImage));
  const texturePromises = Promise.all(
    generatorDef.textures.map(textureDefToTexture)
  );

  const [imageTuples, textureTuples] = await Promise.all([
    imagePromises,
    texturePromises,
  ]);

  return [imageTuples, textureTuples];
}
