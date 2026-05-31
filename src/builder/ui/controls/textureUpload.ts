import {
  type Texture,
  makeTextureFromImage,
} from "../../modules/texture";

export const textureUploadAccept = "image/png,image/jpeg,.png,.jpg,.jpeg";

const acceptedFileTypes = ["image/png", "image/jpeg"];
const acceptedFileExtensions = [".png", ".jpg", ".jpeg"];

export function isSupportedTextureUploadFile(file: File) {
  const lowerFileName = file.name.toLowerCase();
  return (
    acceptedFileTypes.includes(file.type) ||
    acceptedFileExtensions.some((extension) =>
      lowerFileName.endsWith(extension)
    )
  );
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };
    (image as HTMLImageElement & { name?: string }).name = file.name;
    image.src = url;
  });
}

export async function loadTextureUploadImage(
  file: File
): Promise<HTMLImageElement> {
  return loadImageFromFile(file);
}

export async function loadTextureUploadFile(
  file: File,
  standardWidth: number,
  standardHeight: number
): Promise<Texture> {
  const image = await loadImageFromFile(file);
  return makeTextureFromImage(image, standardWidth, standardHeight);
}
