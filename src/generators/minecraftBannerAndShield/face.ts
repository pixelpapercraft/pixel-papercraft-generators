import {
  type DrawTextureOptions,
  type Blend,
} from "@genroot/builder/modules/renderers/drawTexture";
import {
  type Generator,
  type Region,
} from "@genroot/builder/modules/generator";
import {
  Minecraft,
  type Cuboid,
  type Dimensions,
  type DrawCuboidOptions,
  type Face as MinecraftFace,
  type Position,
  type Rectangle,
} from "../_common/minecraft";
import { makeTextureFrameSourceRegion } from "../_common/plugins/texturePicker/sourceRegion";
import { currentBannerAndShieldTextureId } from "./constants";
import {
  decodeSelectedBannerShieldPattern,
  decodeSelectedBannerShieldPatterns,
  encodeSelectedBannerShieldPatterns,
  type BannerShieldTarget,
  type SelectedBannerShieldPattern,
} from "./bannerTexturePicker/types";
import {
  findBannerShieldTextureVersion,
  findPatternVersionId,
} from "./textures/textureVersions";

export const bannerBasePatternId = "banner_base";
export const shieldBasePatternId = "shield_base";
export const shieldBaseNoPatternId = "shield_base_nopattern";
export const defaultPatternId = "base";
export const defaultPatternTint = "#F9FFFE";
const bannerShieldTextureFrameSize = 64;

export type DefinePatternInputRegionOptions = {
  enableErase?: boolean;
};

export function makePatternFaceId(templateId: string): string {
  return "PatternFace" + templateId;
}

export function makeTemplateBaseInputId(
  templateId: string,
  target: BannerShieldTarget
): string {
  const targetLabel = target === "banner" ? "Banner" : "Shield";
  return `Template ${templateId} ${targetLabel} Base`;
}

export function defineBaseInput(
  generator: Generator,
  templateId: string,
  target: BannerShieldTarget
) {
  const versionId = generator.getSelectInputValue("Version");
  const textureVersion = versionId
    ? findBannerShieldTextureVersion(versionId)
    : null;
  const options =
    target === "banner"
      ? textureVersion?.bases.bannerOptions.map((frame) => frame.id) ?? []
      : textureVersion?.bases.shieldOptions.map((frame) => frame.id) ?? [];

  if (options.length > 0) {
    generator.defineSelectInput(
      makeTemplateBaseInputId(templateId, target),
      options
    );
  }
}

export function defineInputRegion(
  generator: Generator,
  faceId: string,
  region: Region,
  options: DefinePatternInputRegionOptions = {}
) {
  const enableErase = options.enableErase ?? true;
  generator.defineRegionInput(
    region,
    () => {
      const selectedPatternJson = generator.getStringInputValue(
        currentBannerAndShieldTextureId
      );

      const selectedPattern = selectedPatternJson
        ? decodeSelectedBannerShieldPattern(selectedPatternJson)
        : null;

      if (!selectedPattern) {
        return;
      }

      const currentFacePatterns = getFacePatterns(generator, faceId);

      const shouldErase =
        selectedPattern.patternId === "" && selectedPattern.blend === null;
      const newFacePatterns = shouldErase
        ? currentFacePatterns.slice(0, -1)
        : selectedPattern.patternId === ""
          ? applyBlendToTopPattern(currentFacePatterns, selectedPattern.blend)
          : currentFacePatterns.concat([selectedPattern]);
      generator.setStringInputValue(
        faceId,
        encodeSelectedBannerShieldPatterns(newFacePatterns)
      );
    },
    faceId,
    enableErase
      ? () => {
          eraseLastFacePattern(generator, faceId);
        }
      : undefined
  );
}

function eraseLastFacePattern(generator: Generator, faceId: string) {
  const currentFacePatterns = getFacePatterns(generator, faceId);

  generator.setStringInputValue(
    faceId,
    encodeSelectedBannerShieldPatterns(currentFacePatterns.slice(0, -1))
  );
}

function getFacePatterns(
  generator: Generator,
  faceId: string
): SelectedBannerShieldPattern[] {
  const facePatternsJson = generator.getStringInputValue(faceId);
  return facePatternsJson
    ? decodeSelectedBannerShieldPatterns(facePatternsJson)
    : getDefaultFacePatterns(generator);
}

function getDefaultFacePatterns(
  generator: Generator
): SelectedBannerShieldPattern[] {
  const versionId = generator.getSelectInputValue("Version");
  const defaultVersionId = versionId
    ? findPatternVersionId(versionId, defaultPatternId)
    : null;

  return defaultVersionId
    ? [
        {
          versionId: defaultVersionId,
          patternId: defaultPatternId,
          blend: defaultPatternTint,
        },
      ]
    : [];
}

function applyBlendToTopPattern(
  patterns: SelectedBannerShieldPattern[],
  blend: string | null
): SelectedBannerShieldPattern[] {
  if (!isValidTint(blend) || patterns.length === 0) {
    return patterns;
  }

  return patterns.map((pattern, index) =>
    index === patterns.length - 1 ? { ...pattern, blend } : pattern
  );
}

function isValidTint(blend: string | null): blend is string {
  return /^#[\da-f]{6}$/i.test(blend ?? "");
}

function drawPattern(
  generator: Generator,
  pattern: SelectedBannerShieldPattern,
  target: BannerShieldTarget,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions,
  logicalFrameSize = bannerShieldTextureFrameSize
) {
  const currentVersionId = generator.getSelectInputValue("Version");
  const versionId = currentVersionId
    ? findPatternVersionId(currentVersionId, pattern.patternId)
    : pattern.versionId;
  if (!versionId) {
    return;
  }

  const textureVersion = findBannerShieldTextureVersion(versionId);
  const texturePattern = textureVersion?.patterns.find(
    ({ id }) => id === pattern.patternId
  );
  if (!textureVersion || !texturePattern) {
    return;
  }

  const textureDef =
    target === "banner"
      ? textureVersion.bannerTextureDef
      : textureVersion.shieldTextureDef;
  const frame =
    target === "banner"
      ? texturePattern.bannerFrame
      : texturePattern.shieldFrame;
  if (!frame) {
    return;
  }

  const sourceRegion = makeTextureFrameSourceRegion(
    frame,
    source,
    logicalFrameSize
  );
  const blend: Blend | undefined = pattern.blend
    ? { kind: "MultiplyHex", hex: pattern.blend }
    : options?.blend;

  generator.drawTexture(textureDef.id, sourceRegion, destination, {
    ...options,
    blend,
  });
}

function drawBasePattern(
  generator: Generator,
  target: BannerShieldTarget,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions,
  logicalFrameSize = bannerShieldTextureFrameSize,
  baseInputId?: string
) {
  const versionId = generator.getSelectInputValue("Version");
  if (!versionId) {
    return;
  }

  const textureVersion = findBannerShieldTextureVersion(versionId);
  if (!textureVersion) {
    return;
  }

  const textureDef =
    target === "banner"
      ? textureVersion.bannerTextureDef
      : textureVersion.shieldTextureDef;
  const baseId = getSelectedBaseId(generator, target, baseInputId);
  const baseOption = (
    target === "banner"
      ? textureVersion.bases.bannerOptions
      : textureVersion.bases.shieldOptions
  ).find(({ id }) => id === baseId);
  if (!baseOption) {
    return;
  }
  const baseTextureDef = baseOption.textureDef ?? textureDef;

  const sourceRegion = makeTextureFrameSourceRegion(
    baseOption,
    source,
    logicalFrameSize
  );

  generator.drawTexture(
    baseTextureDef.id,
    sourceRegion,
    destination,
    options ?? {}
  );
}

function getSelectedBaseId(
  generator: Generator,
  target: BannerShieldTarget,
  baseInputId?: string
): string {
  const templateBaseInputValue = baseInputId
    ? generator.getSelectInputValue(baseInputId)
    : null;

  if (templateBaseInputValue) {
    return templateBaseInputValue;
  }

  return target === "banner" ? bannerBasePatternId : shieldBasePatternId;
}

function drawPatternFace(
  generator: Generator,
  faceId: string,
  target: BannerShieldTarget,
  source: Region,
  destination: Region,
  options?: DrawTextureOptions,
  logicalFrameSize?: number,
  baseInputId?: string
) {
  drawBasePattern(
    generator,
    target,
    source,
    destination,
    options,
    logicalFrameSize,
    baseInputId
  );

  const facePatterns = getFacePatterns(generator, faceId);
  facePatterns.forEach((selectedPattern) => {
    drawPattern(
      generator,
      selectedPattern,
      target,
      source,
      destination,
      options,
      logicalFrameSize
    );
  });
}

export function drawFace(
  generator: Generator,
  faceId: string,
  source: Region,
  destination: Region,
  optionsOrBaseInputId?: DrawTextureOptions | string,
  targetOrBaseInputId?: BannerShieldTarget | string,
  explicitBaseInputId?: string
) {
  const options =
    typeof optionsOrBaseInputId === "string" ? undefined : optionsOrBaseInputId;
  const explicitTarget =
    targetOrBaseInputId === "banner" || targetOrBaseInputId === "shield"
      ? targetOrBaseInputId
      : null;
  const baseInputId =
    typeof optionsOrBaseInputId === "string"
      ? optionsOrBaseInputId
      : explicitTarget
        ? explicitBaseInputId
        : targetOrBaseInputId ?? explicitBaseInputId;
  const target =
    explicitTarget ?? getBaseInputTarget(baseInputId) ?? getFaceTarget(faceId);

  drawPatternFace(
    generator,
    faceId,
    target,
    source,
    destination,
    options,
    bannerShieldTextureFrameSize,
    baseInputId
  );
}

class PatternMinecraft extends Minecraft {
  constructor(
    private patternGenerator: Generator,
    private target: BannerShieldTarget,
    private baseInputId?: string
  ) {
    super(patternGenerator);
  }

  override drawFaceTexture(
    faceId: string,
    source: Rectangle,
    dest: MinecraftFace
  ) {
    drawPatternFace(
      this.patternGenerator,
      faceId,
      this.target,
      source,
      dest.rectangle,
      {
        flip: dest.flip,
        rotateLegacy: dest.rotate,
        blend: dest.blend,
        plugin: dest.plugin ?? undefined,
      },
      bannerShieldTextureFrameSize,
      this.baseInputId
    );
  }
}

export function drawCuboid(
  generator: Generator,
  faceId: string,
  target: BannerShieldTarget,
  source: Cuboid,
  position: Position,
  dimensions: Dimensions,
  options: Partial<DrawCuboidOptions> = {},
  baseInputId?: string
) {
  new PatternMinecraft(generator, target, baseInputId).drawCuboid(
    faceId,
    source,
    position,
    dimensions,
    options
  );
}

function getFaceTarget(faceId: string): BannerShieldTarget {
  return faceId.startsWith("Shield") ? "shield" : "banner";
}

function getBaseInputTarget(
  baseInputId: string | undefined
): BannerShieldTarget | null {
  if (!baseInputId) {
    return null;
  }

  if (baseInputId.includes("Shield Base")) {
    return "shield";
  }

  if (baseInputId.includes("Banner Base")) {
    return "banner";
  }

  return null;
}
