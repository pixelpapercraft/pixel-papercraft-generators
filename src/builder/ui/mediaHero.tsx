import {
  type ThumbnailDef,
  type VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { Thumbnail } from "./thumbnail";
import { Video } from "./video";

export type MediaHeroProps = {
  video: VideoDef | null;
  thumbnail: ThumbnailDef | null;
};

// Keep v1's established precedence: video is the hero when present, otherwise
// use the thumbnail. V2 authors place this component in their own layout.
export function MediaHero({
  video,
  thumbnail,
}: MediaHeroProps): JSX.Element | null {
  if (video) {
    return (
      <div className="mb-8">
        <Video video={video} />
      </div>
    );
  }

  if (thumbnail) {
    return (
      <div className="mb-8">
        <Thumbnail thumbnail={thumbnail} />
      </div>
    );
  }

  return null;
}
