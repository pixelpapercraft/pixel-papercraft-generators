import {
  getMinecraftSkinInputValueKey,
  parseMinecraftSkinInputValue,
} from "./minecraftSkinInputValue";
import { type Model } from "./model";
import { type Control } from "./modelControls";
import { type Texture, makeTextureFromUrl } from "./texture";
import { type Variable } from "./variables";

export type SavedTexture =
  | {
      kind: "reference";
      textureId: string;
    }
  | {
      kind: "embedded";
      url: string;
      standardWidth: number;
      standardHeight: number;
    };

export type ProjectSave = {
  version: 1;
  generatorId: string;
  variables: Record<string, Variable>;
  textures?: Record<string, SavedTexture>;
};

export type ProjectImportResult =
  | {
      ok: true;
      message: string;
      save: ProjectSave;
    }
  | {
      ok: false;
      message: string;
    };

export function exportProjectSave(
  model: Model,
  generatorId: string
): ProjectSave {
  const textures = exportProjectTextures(model);

  return {
    version: 1,
    generatorId,
    variables: Object.fromEntries(
      Array.from(model.values.variables.entries()).map(([id, variable]) => [
        id,
        cloneVariable(variable),
      ])
    ),
    ...(Object.keys(textures).length > 0 ? { textures } : {}),
  };
}

export function encodeProjectSave(save: ProjectSave): string {
  return `${JSON.stringify(save, null, 2)}\n`;
}

export async function importProjectSave(
  model: Model,
  json: string
): Promise<ProjectImportResult> {
  const save = decodeProjectSave(json);
  if (!save) {
    return {
      ok: false,
      message: "Import failed: choose a valid generator JSON file.",
    };
  }

  clearInputTextures(model);
  model.cleatAllVariables();
  await importProjectTextures(model, save);
  Object.entries(save.variables).forEach(([id, variable]) => {
    model.setVariable(id, variable);
  });

  const variableCount = Object.keys(save.variables).length;
  const textureCount = Object.keys(save.textures ?? {}).length;
  return {
    ok: true,
    message:
      `Imported ${variableCount} saved value${
        variableCount === 1 ? "" : "s"
      }` +
      (textureCount > 0
        ? ` and ${textureCount} texture${textureCount === 1 ? "" : "s"}`
        : "") +
      ".",
    save,
  };
}

function exportProjectTextures(model: Model): Record<string, SavedTexture> {
  return Object.fromEntries(
    model.controls
      .map((control) => exportTextureControl(model, control))
      .filter(
        (entry): entry is [string, SavedTexture] => entry !== null
      )
  );
}

function exportTextureControl(
  model: Model,
  control: Control
): [string, SavedTexture] | null {
  switch (control.kind) {
    case "TextureInput":
    case "AtlasInput": {
      const texture = model.findTexture(control.id);
      if (!texture) {
        return null;
      }

      const choiceId = findMatchingChoiceId(model, texture, control.props.choices);
      return [
        control.id,
        choiceId
          ? { kind: "reference", textureId: choiceId }
          : makeEmbeddedTexture(texture),
      ];
    }
    case "MinecraftSkinInput": {
      const value = parseMinecraftSkinInputValue(
        model.getStringVariable(getMinecraftSkinInputValueKey(control.id))
      );
      const texture = model.findTexture(control.id);
      if (!value || !texture) {
        return null;
      }

      if (value.selection.kind === "custom") {
        return [control.id, makeEmbeddedTexture(texture)];
      }

      if (value.selection.kind === "texture") {
        return [
          control.id,
          { kind: "reference", textureId: value.selection.textureId },
        ];
      }

      return null;
    }
    default:
      return null;
  }
}

function findMatchingChoiceId(
  model: Model,
  texture: Texture,
  choices: string[]
): string | null {
  return (
    choices.find((choiceId) => model.findTexture(choiceId) === texture) ?? null
  );
}

function makeEmbeddedTexture(texture: Texture): SavedTexture {
  return {
    kind: "embedded",
    url: texture.imageWithCanvas.canvasWithContext.canvas.toDataURL("image/png"),
    standardWidth: texture.standardWidth,
    standardHeight: texture.standardHeight,
  };
}

async function importProjectTextures(
  model: Model,
  save: ProjectSave
): Promise<void> {
  await Promise.all(
    Object.entries(save.textures ?? {}).map(async ([id, savedTexture]) => {
      switch (savedTexture.kind) {
        case "reference": {
          const texture = model.findTexture(savedTexture.textureId);
          if (texture) {
            model.addTexture(id, texture);
          }
          break;
        }
        case "embedded": {
          const texture = await makeTextureFromUrl(
            savedTexture.url,
            savedTexture.standardWidth,
            savedTexture.standardHeight
          );
          model.addTexture(id, texture);
          break;
        }
      }
    })
  );
}

function clearInputTextures(model: Model): void {
  model.controls.forEach((control) => {
    switch (control.kind) {
      case "TextureInput":
      case "AtlasInput":
      case "MinecraftSkinInput":
        model.removeTexture(control.id);
        break;
    }
  });
}

function decodeProjectSave(json: string): ProjectSave | null {
  try {
    const parsed: unknown = JSON.parse(json);
    if (!isRecord(parsed) || parsed.version !== 1) {
      return null;
    }

    if (typeof parsed.generatorId !== "string" || !isRecord(parsed.variables)) {
      return null;
    }

    const variables = Object.fromEntries(
      Object.entries(parsed.variables)
        .map(([id, variable]) => [id, sanitizeVariable(variable)])
        .filter((entry): entry is [string, Variable] => entry[1] !== null)
    );
    const textures = sanitizeTextures(parsed.textures);

    return {
      version: 1,
      generatorId: parsed.generatorId,
      variables,
      ...(Object.keys(textures).length > 0 ? { textures } : {}),
    };
  } catch {
    return null;
  }
}

function sanitizeVariable(variable: unknown): Variable | null {
  if (!isRecord(variable)) {
    return null;
  }

  switch (variable.kind) {
    case "String":
      return typeof variable.value === "string"
        ? { kind: "String", value: variable.value }
        : null;
    case "Number":
      return typeof variable.value === "number" && Number.isFinite(variable.value)
        ? { kind: "Number", value: variable.value }
        : null;
    case "Boolean":
      return typeof variable.value === "boolean"
        ? { kind: "Boolean", value: variable.value }
        : null;
    default:
      return null;
  }
}

function sanitizeTextures(textures: unknown): Record<string, SavedTexture> {
  if (!isRecord(textures)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(textures)
      .map(([id, texture]) => [id, sanitizeTexture(texture)])
      .filter((entry): entry is [string, SavedTexture] => entry[1] !== null)
  );
}

function sanitizeTexture(texture: unknown): SavedTexture | null {
  if (!isRecord(texture) || typeof texture.kind !== "string") {
    return null;
  }

  if (texture.kind === "reference") {
    return typeof texture.textureId === "string"
      ? { kind: "reference", textureId: texture.textureId }
      : null;
  }

  if (texture.kind !== "embedded") {
    return null;
  }

  return typeof texture.url === "string" &&
    typeof texture.standardWidth === "number" &&
    Number.isFinite(texture.standardWidth) &&
    typeof texture.standardHeight === "number" &&
    Number.isFinite(texture.standardHeight)
    ? {
        kind: "embedded",
        url: texture.url,
        standardWidth: texture.standardWidth,
        standardHeight: texture.standardHeight,
      }
    : null;
}

function cloneVariable(variable: Variable): Variable {
  switch (variable.kind) {
    case "String":
      return { kind: "String", value: variable.value };
    case "Number":
      return { kind: "Number", value: variable.value };
    case "Boolean":
      return { kind: "Boolean", value: variable.value };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
