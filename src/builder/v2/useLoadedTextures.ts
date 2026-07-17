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

export type TextureDefinitionLoader<Resource> = (
  textureDef: TextureDef
) => Promise<Resource>;

export function createCachedTextureDefinitionLoader<Resource>(
  loadResource: ResourceLoader<Resource>
): TextureDefinitionLoader<Resource> {
  const cache = new WeakMap<TextureDef, Promise<Resource>>();

  return (textureDef) => {
    const cached = cache.get(textureDef);
    if (cached) {
      return cached;
    }

    const promise = loadResource(
      textureDef.url,
      textureDef.standardWidth,
      textureDef.standardHeight
    ).catch((error: unknown) => {
      if (cache.get(textureDef) === promise) {
        cache.delete(textureDef);
      }
      throw error;
    });
    cache.set(textureDef, promise);
    return promise;
  };
}

const loadCachedTextureDefinition =
  createCachedTextureDefinitionLoader(makeTextureFromUrl);

export async function loadTextureDefinitions<Resource>(
  textureDefs: TextureDef[],
  loadTextureDefinition: TextureDefinitionLoader<Resource>
): Promise<Map<string, Resource>> {
  const textureTuples = await Promise.all(
    textureDefs.map(async (textureDef) => {
      const texture = await loadTextureDefinition(textureDef);
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

    loadTextureDefinitions(textureDefs, loadCachedTextureDefinition)
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
