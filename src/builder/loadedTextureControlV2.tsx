"use client";

import React from "react";
import { type TextureDef } from "@genroot/builder/engine/generatorDef";
import { type Texture } from "@genroot/builder/engine/texture";
import {
  TextureControlV2,
  type TextureControlV2Value,
} from "@genroot/builder/ui/controls/textureControlV2";
import { useLoadedTextures } from "./useLoadedTextures";

export type LoadedTextureControlV2Value = TextureControlV2Value;

export type LoadedTextureControlV2Props = {
  id: string;
  label?: string;
  definitions: TextureDef[];
  choices: string[];
  standardWidth: number;
  standardHeight: number;
  value: LoadedTextureControlV2Value;
  onValueChange: (value: LoadedTextureControlV2Value) => void;
  loadingMessage?: string;
  errorMessage?: string;
  onChange: (texture: Texture | null) => void;
};

export function LoadedTextureControlV2({
  id,
  label,
  definitions,
  choices,
  standardWidth,
  standardHeight,
  value,
  onValueChange,
  loadingMessage = "Loading texture choices…",
  errorMessage = "Texture choices could not be loaded.",
  onChange,
}: LoadedTextureControlV2Props): JSX.Element {
  const state = useLoadedTextures(definitions);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const valueKind = value.kind;
  const presetId = value.kind === "Preset" ? value.id : "";

  React.useEffect(() => {
    if (state.status !== "ready") {
      return;
    }

    switch (valueKind) {
      case "None":
        onChangeRef.current(null);
        return;
      case "Preset":
        onChangeRef.current(state.textures.get(presetId) ?? null);
        return;
      case "Custom":
        return;
      default:
        return valueKind satisfies never;
    }
  }, [presetId, state, valueKind]);

  const hasError = state.status === "error";
  const ready = state.status === "ready" && !hasError;
  const statusMessage = hasError
    ? errorMessage
    : ready
      ? undefined
      : loadingMessage;

  return (
    <TextureControlV2
      id={id}
      label={label}
      choices={choices}
      standardWidth={standardWidth}
      standardHeight={standardHeight}
      value={value}
      onValueChange={onValueChange}
      disabled={!ready}
      statusMessage={statusMessage}
      onChange={onChange}
    />
  );
}
