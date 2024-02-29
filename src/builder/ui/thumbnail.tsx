/* eslint-disable @next/next/no-img-element */

import { type ThumbnailDef } from "@/builder/modules/generatorDef";

export function Thumbnail({ thumbnail }: { thumbnail: ThumbnailDef }) {
  return <img className="border" src={thumbnail.url} alt="" />;
}
