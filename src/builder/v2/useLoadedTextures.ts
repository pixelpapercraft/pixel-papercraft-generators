"use client";

import React from "react";
import { type TextureDef } from "@genroot/builder/modules/generatorDef";
import {
  type Texture,
  makeTextureFromUrl,
} from "@genroot/builder/modules/texture";

export type LoadedTexturesState =
  | { status: "loading" }
  | { status: "ready"; textures: Map<string, Texture> }
  | { status: "error"; error: Error };

export type ResourceLoader<Resource> = (
  url: string,
  standardWidth: number,
  standardHeight: number
) => Promise<Resource>;

export async function loadTextureDefinitions<Resource>(
  textureDefs: TextureDef[],
  loadTexture: ResourceLoader<Resource>
): Promise<Map<string, Resource>> {
  const textureTuples = await Promise.all(
    textureDefs.map(async (textureDef) => {
      const texture = await loadTexture(
        textureDef.url,
        textureDef.standardWidth,
        textureDef.standardHeight
      );
      return [textureDef.id, texture] satisfies [string, Resource];
    })
  );
  return new Map(textureTuples);
}

export function useLoadedTextures(
  textureDefs: TextureDef[]
): LoadedTexturesState {
  const [state, setState] = React.useState<LoadedTexturesState>({
    status: "loading",
  });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    loadTextureDefinitions(textureDefs, makeTextureFromUrl)
      .then((textures) => {
        if (!cancelled) {
          setState({ status: "ready", textures });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [textureDefs]);

  return state;
}
