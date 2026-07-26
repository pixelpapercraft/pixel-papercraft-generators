import {
  type ImageWithCanvas,
  makeImageWithCanvasFromUrl,
} from "@genroot/builder/engine/imageWithCanvas";
import {
  type Texture,
  makeTextureFromUrl,
} from "@genroot/builder/engine/texture";
import {
  type ImageDef,
  type TextureDef,
} from "@genroot/builder/engine/generatorDef";
import { type Generator } from "./generator";

// A tiny local resource loader for `Generator` that turns its static image and
// texture definitions into the runtime resources consumed by the model.
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

export async function loadResourcesV2<Props>(
  generator: Generator<Props>
): Promise<[ImageTuple[], TextureTuple[]]> {
  const imagePromises = Promise.all(generator.images.map(imageDefToImage));
  const texturePromises = Promise.all(
    generator.textures.map(textureDefToTexture)
  );

  const [imageTuples, textureTuples] = await Promise.all([
    imagePromises,
    texturePromises,
  ]);

  return [imageTuples, textureTuples];
}
