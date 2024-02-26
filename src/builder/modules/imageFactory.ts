export function makeImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
  });
}
