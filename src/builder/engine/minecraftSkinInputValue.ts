import type { MinecraftSkinOption } from "./modelControls";

export type MinecraftModelType = "Wide" | "Slim";

export type MinecraftSkinSelection =
  | { kind: "none" }
  | { kind: "preset"; presetName: string }
  | { kind: "texture"; textureId: string }
  | { kind: "custom" };

export type MinecraftSkinInputValue = {
  modelType: MinecraftModelType;
  selection: MinecraftSkinSelection;
};

export const MINECRAFT_SKIN_INPUT_VALUE_KEY_PREFIX = "__minecraftSkinInput:";

export function getMinecraftSkinInputValueKey(id: string): string {
  return `${MINECRAFT_SKIN_INPUT_VALUE_KEY_PREFIX}${id}`;
}

function isValidMinecraftSkinSelection(
  value: unknown
): value is MinecraftSkinSelection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const kind = candidate.kind;

  if (kind === "none" || kind === "custom") {
    return true;
  }

  if (kind === "preset" && typeof candidate.presetName === "string") {
    return true;
  }

  if (kind === "texture" && typeof candidate.textureId === "string") {
    return true;
  }

  return false;
}

export function parseMinecraftSkinInputValue(
  value: string | null
): MinecraftSkinInputValue | null {
  if (!value) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const candidate = parsed as Record<string, unknown>;
    const modelType =
      candidate.modelType === "Slim"
        ? "Slim"
        : candidate.modelType === "Wide"
          ? "Wide"
          : null;

    if (!modelType) {
      return null;
    }

    if (!isValidMinecraftSkinSelection(candidate.selection)) {
      return null;
    }

    return {
      modelType,
      selection: candidate.selection,
    };
  } catch {
    return null;
  }
}

export function serializeMinecraftSkinInputValue(
  value: MinecraftSkinInputValue
): string {
  return JSON.stringify(value);
}

export function getDefaultMinecraftSkinSelection(
  options: MinecraftSkinOption[]
): MinecraftSkinSelection {
  const defaultPreset = options.find(
    (option) => option.kind === "preset" && option.id === "Default"
  );
  if (defaultPreset && defaultPreset.kind === "preset") {
    return { kind: "preset", presetName: defaultPreset.id };
  }

  const firstPreset = options.find((option) => option.kind === "preset");
  if (firstPreset && firstPreset.kind === "preset") {
    return { kind: "preset", presetName: firstPreset.id };
  }

  const firstTexture = options.find((option) => option.kind === "texture");
  if (firstTexture && firstTexture.kind === "texture") {
    return { kind: "texture", textureId: firstTexture.textureId };
  }

  return { kind: "none" };
}

export function getDefaultMinecraftSkinInputValue(
  options: MinecraftSkinOption[]
): MinecraftSkinInputValue {
  return {
    modelType: "Wide",
    selection: getDefaultMinecraftSkinSelection(options),
  };
}
