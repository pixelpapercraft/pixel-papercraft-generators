"use client";

import React from "react";
import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { type Texture } from "@genroot/builder/engine/texture";
import { TextureControl } from "@genroot/builder/ui/controls/textureControl";
import { useLoadedTextures } from "./useLoadedTextures";

const noTextures = new Map<string, Texture>();

export function LoadedTextureControl({
  id,
  label,
  definitions,
  choices,
  standardWidth,
  standardHeight,
  initialTextureId,
  loadingMessage = "Loading texture choices…",
  errorMessage = "Texture choices could not be loaded.",
  onChange,
}: {
  id: string;
  label?: string;
  definitions: TextureDef[];
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  initialTextureId?: string;
  loadingMessage?: string;
  errorMessage?: string;
  onChange: (texture: Texture | null) => void;
}): JSX.Element {
  const state = useLoadedTextures(definitions);
  const onChangeRef = React.useRef(onChange);
  const hasCommittedValueRef = React.useRef(false);
  const [defaultApplied, setDefaultApplied] = React.useState(
    initialTextureId === undefined
  );
  onChangeRef.current = onChange;

  const commitChange = React.useCallback((texture: Texture | null) => {
    hasCommittedValueRef.current = true;
    setDefaultApplied(true);
    onChangeRef.current(texture);
  }, []);

  const defaultTexture =
    state.status === "ready" && initialTextureId !== undefined
      ? state.textures.get(initialTextureId)
      : undefined;
  const defaultIsMissing =
    state.status === "ready" &&
    initialTextureId !== undefined &&
    defaultTexture === undefined;

  React.useEffect(() => {
    if (
      state.status !== "ready" ||
      defaultApplied ||
      hasCommittedValueRef.current ||
      initialTextureId === undefined ||
      !defaultTexture
    ) {
      return;
    }

    commitChange(defaultTexture);
  }, [
    commitChange,
    defaultApplied,
    defaultTexture,
    initialTextureId,
    state.status,
  ]);

  const hasError = state.status === "error" || defaultIsMissing;
  const textures = state.status === "ready" ? state.textures : noTextures;
  const ready = state.status === "ready" && !hasError && defaultApplied;
  const statusMessage = hasError
    ? errorMessage
    : ready
      ? undefined
      : loadingMessage;

  return (
    <TextureControl
      id={id}
      label={label}
      choices={choices}
      standardWidth={standardWidth}
      standardHeight={standardHeight}
      textures={textures}
      disabled={!ready}
      statusMessage={statusMessage}
      onChange={commitChange}
    />
  );
}
