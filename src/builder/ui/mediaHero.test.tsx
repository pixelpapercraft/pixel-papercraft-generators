import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  type ThumbnailDef,
  type VideoDef,
} from "@genroot/builder/modules/generatorDef";
import { MediaHero } from "./mediaHero";

describe("MediaHero", () => {
  it("renders nothing without video or thumbnail content", () => {
    const markup = renderToStaticMarkup(
      createElement(MediaHero, { video: null, thumbnail: null })
    );

    expect(markup).toBe("");
  });

  it("uses the thumbnail when video content is absent", () => {
    const thumbnail: ThumbnailDef = { url: "/hero-thumbnail.png" };
    const markup = renderToStaticMarkup(
      createElement(MediaHero, { video: null, thumbnail })
    );

    expect(markup).toContain('src="/hero-thumbnail.png"');
  });

  it("uses video in preference to a thumbnail", () => {
    const thumbnail: ThumbnailDef = { url: "/hero-thumbnail.png" };
    const video: VideoDef = { url: "https://video.example/embed/demo" };
    const markup = renderToStaticMarkup(
      createElement(MediaHero, { video, thumbnail })
    );

    expect(markup).toContain('src="https://video.example/embed/demo"');
    expect(markup).not.toContain('src="/hero-thumbnail.png"');
  });
});
