import { makeImageFromUrl } from "./imageFactory";
import { type Texture, makeTextureFromUrl } from "./texture";
import { type ImageDef, type TextureDef, type GeneratorDef } from "./types";

// module Builder = Generator_Builder

// type imageTuple = (string, Dom2.Image.t)

type ImageTuple = [string, HTMLImageElement];

// type textureTuple = (string, Generator_Texture.t)

type TextureTuple = [string, Texture];

// let imageDefToImage = (imageDef: Builder.imageDef): Promise.t<imageTuple> => {
//   Generator_ImageFactory.makeFromUrl(imageDef.url)->Promise.thenResolve(image => (
//     imageDef.id,
//     image,
//   ))
// }

async function imageDefToImage(imageDef: ImageDef): Promise<ImageTuple> {
  const image = await makeImageFromUrl(imageDef.url);
  return [imageDef.id, image];
}

// let textureDefToTexture = (textureDef: Builder.textureDef): Promise.t<textureTuple> => {
//   Generator_Texture.makeFromUrl(
//     textureDef.url,
//     textureDef.standardWidth,
//     textureDef.standardHeight,
//   )->Promise.thenResolve(texture => (textureDef.id, texture))
// }

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

// let loadResources = (generatorDef: Builder.generatorDef) => {
//   let imagePromises = generatorDef.images->Js.Array2.map(imageDefToImage)->Promise.all
//   let texturePromises = generatorDef.textures->Js.Array2.map(textureDefToTexture)->Promise.all

//   imagePromises
//   ->Promise.then((images: array<imageTuple>) => {
//     texturePromises->Promise.thenResolve((textures: array<textureTuple>) => Ok(images, textures))
//   })
//   ->Promise.catch(exn => {
//     Js.log(exn)
//     Promise.resolve(Error("Failed to load resources"))
//   })
// }

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
