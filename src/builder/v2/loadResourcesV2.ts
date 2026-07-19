import {
  type ImageWithCanvas,
  makeImageWithCanvasFromUrl,
} from "@genroot/builder/modules/imageWithCanvas";
import {
  type Texture,
  makeTextureFromUrl,
} from "@genroot/builder/modules/texture";
import {
  type ImageDef,
  type TextureDef,
} from "@genroot/builder/modules/generatorDef";
import { type GeneratorV2 } from "./generatorV2";

// A tiny local resource loader for `GeneratorV2`. This mirrors
// `builder/modules/resourceLoader.ts`'s `loadResources`, but reads from a
// `GeneratorV2`'s `images`/`textures` instead of a v1 `GeneratorDef` — kept
// separate rather than loosening v1's `loadResources` to a narrower param
// type, so v1 stays untouched.
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
  generatorV2: GeneratorV2<Props>
): Promise<[ImageTuple[], TextureTuple[]]> {
  const imagePromises = Promise.all(generatorV2.images.map(imageDefToImage));
  const texturePromises = Promise.all(
    generatorV2.textures.map(textureDefToTexture)
  );

  const [imageTuples, textureTuples] = await Promise.all([
    imagePromises,
    texturePromises,
  ]);

  return [imageTuples, textureTuples];
}
