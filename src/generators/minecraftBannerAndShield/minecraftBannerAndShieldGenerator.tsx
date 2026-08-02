"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type DynamicTextures,
  type GeneratorDefV2,
  type Generator,
  type HistoryDef,
  type ImageDef,
  type InstructionsDef,
  type RegionClickHandler,
  type RenderContext,
  type Texture,
  type TextureDef,
  type TexturePlugin,
  type ThumbnailDef,
} from "@genroot/builder";
import { TintSelector } from "../_common/tintSelectorV2/tintSelector";
import { getFirstSwatchColor } from "../_common/tintSelectorV2/tintSelectorLogic";
import { dyeTintGroup } from "../_common/tintSelectorV2/tints";
import { PatternTexturePicker } from "../_common/patternTexturePicker/patternTexturePicker";
import { makePatternOptions } from "../_common/patternTexturePicker/patternTexturePickerLogic";
import {
  type GlintPluginOptions,
  entityGlintTextureDefs,
  makeGlintPlugin,
} from "../_common/plugins/glint";
import {
  bannerShieldTextureDefs,
  bannerShieldTextureVersions,
  findBannerShieldTextureVersion,
} from "./textures/textureVersions";
import {
  bannerFlagFrontRegion,
  drawBannerCrossbar,
  drawBannerFlag,
  drawBannerFlagGuides,
  drawBannerPattern,
  drawBannerPole,
} from "./shapes/banner";
import {
  applyPatternSelection,
  defaultPatternStack,
  type SelectedPattern,
} from "./patternStack";
import {
  drawShieldHandle,
  drawShieldHandleGuides,
  drawShieldHandleInnerLining,
  drawShieldHandleInnerLiningGuides,
  drawShieldHandleJoinMarker,
  drawShieldPattern,
  drawShieldPlate,
  drawShieldPlateGuides,
  shieldPlateFrontRegion,
} from "./shapes/shield";
import titleImage from "./images/title-a4.png";
import shieldHandleJoinImage from "./images/shield-handle-join.png";
import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpg";

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const instructions: InstructionsDef = `
Component-by-component rebuild in progress. The banner flag base, pole, and
crossbar are rendered with fold and tab guides, and clicking the flag
arms/stamps the selected pattern. The shield plate, handle, and inner
lining render their base geometry, fold/tab guides, and a join marker
showing where they glue together; clicking the plate arms/stamps the
selected pattern onto the plate only — the handle and lining are never
patterned, matching real Minecraft shields. The Shield can also be given an
enchanted glint overlay.
`;

const shieldHandleJoinImageId = "ShieldHandleJoin";
const shieldHandleJoinImageDimensions: [number, number] = [
  shieldHandleJoinImage.width,
  shieldHandleJoinImage.height,
];

const images: ImageDef[] = [
  { id: "Title", url: titleImage.src },
  { id: shieldHandleJoinImageId, url: shieldHandleJoinImage.src },
];

const textures: TextureDef[] = [...bannerShieldTextureDefs];

const thumbnail: ThumbnailDef = { url: thumbnailImage.src };

const history: HistoryDef = [
  "May 2026 NinjolasNJM - Initial TypeScript version.",
  "May 2026 NinjolasNJM - Added pattern tint selector.",
  "Aug 2026 lostminer - Layout refresh.",
];

const bannerFlagRegionId = "BannerFlag";
const shieldPlateRegionId = "ShieldPlate";

type BannerAndShieldProps = {
  bannerPatterns: SelectedPattern[];
  shieldPatterns: SelectedPattern[];
  versionId: string;
  templateType: TemplateType;
  bannerBaseId: string;
  showFolds: boolean;
  glintEnabled: boolean;
  glintOpacity: number;
  glintXOffset: number;
  glintYOffset: number;
};

type TemplateType = "Banner" | "Shield";

const render = (ctx: RenderContext, props: BannerAndShieldProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  if (props.templateType === "Banner") {
    drawBannerFlag(ctx, props.versionId, props.bannerBaseId);
    props.bannerPatterns.forEach(({ patternId, blend }) => {
      drawBannerPattern(ctx, props.versionId, patternId, blend);
    });
    drawBannerFlagGuides(ctx, props.showFolds);
    drawBannerPole(ctx, props.versionId, props.bannerBaseId, props.showFolds);
    drawBannerCrossbar(
      ctx,
      props.versionId,
      props.bannerBaseId,
      props.showFolds
    );
    ctx.defineRegion(bannerFlagFrontRegion(), bannerFlagRegionId);
  } else {
    // Glint is Shield-only — real Minecraft banners can't be enchanted.
    const glintTexture = ctx.getTexture("Enchanted Glint");
    const glintPluginOptions: GlintPluginOptions = {
      opacity: props.glintOpacity / 255,
      xOffset: props.glintXOffset,
      yOffset: props.glintYOffset,
    };
    const glintPlugin: TexturePlugin | undefined =
      glintTexture && props.glintEnabled
        ? makeGlintPlugin(glintTexture, glintPluginOptions)
        : undefined;

    drawShieldPlate(ctx, props.versionId, glintPlugin);
    props.shieldPatterns.forEach(({ patternId, blend }) => {
      drawShieldPattern(ctx, props.versionId, patternId, blend, glintPlugin);
    });
    drawShieldHandle(ctx, props.versionId, glintPlugin);
    drawShieldHandleInnerLining(ctx, props.versionId, glintPlugin);
    drawShieldPlateGuides(ctx, props.showFolds);
    drawShieldHandleGuides(ctx, props.showFolds);
    drawShieldHandleInnerLiningGuides(ctx, props.showFolds);
    drawShieldHandleJoinMarker(
      ctx,
      shieldHandleJoinImageId,
      shieldHandleJoinImageDimensions
    );
    ctx.defineRegion(shieldPlateFrontRegion(), shieldPlateRegionId);
  }

  // Temporary: proves the Title overlay is wired end to end. Removed once
  // real banner/shield content exists for it to overlay. Pre-scaled to its
  // exact on-page size and drawn as a plain image rather than a texture —
  // drawTexture's per-source-pixel scaling is far too slow for an asset this
  // large redrawn on every render.
  ctx.drawImage("Title", [0, 0]);
};

const bannerAndShieldGenerator: Generator<BannerAndShieldProps> = {
  id,
  name,
  images,
  textures,
  render,
};

function Component(): JSX.Element {
  const [tint, setTint] = React.useState<string | null>(
    getFirstSwatchColor(dyeTintGroup)
  );
  const [selectedPatternId, setSelectedPatternId] = React.useState<
    string | null
  >(null);
  const [versionId, setVersionId] = React.useState(
    bannerShieldTextureVersions[0]!.id
  );
  const [templateType, setTemplateType] =
    React.useState<TemplateType>("Shield");
  const [showFolds, setShowFolds] = React.useState(true);
  const [bannerPatterns, setBannerPatterns] = React.useState<SelectedPattern[]>(
    defaultPatternStack()
  );
  const [shieldPatterns, setShieldPatterns] = React.useState<SelectedPattern[]>(
    defaultPatternStack()
  );
  const [glintTexture, setGlintTexture] = React.useState<Texture | null>(null);
  const [glintEnabled, setGlintEnabled] = React.useState(false);
  const [glintOpacity, setGlintOpacity] = React.useState(255);
  const [glintXOffset, setGlintXOffset] = React.useState(0);
  const [glintYOffset, setGlintYOffset] = React.useState(0);

  const textureVersion =
    findBannerShieldTextureVersion(versionId) ??
    bannerShieldTextureVersions[0]!;
  const patternOptions = makePatternOptions(textureVersion);
  const bannerBaseOptions = textureVersion.bases.bannerOptions;
  const [bannerBaseId, setBannerBaseId] = React.useState(
    bannerBaseOptions[0]?.id ?? ""
  );

  const rendererProps: BannerAndShieldProps = {
    bannerPatterns,
    shieldPatterns,
    versionId,
    templateType,
    bannerBaseId,
    showFolds,
    glintEnabled,
    glintOpacity,
    glintXOffset,
    glintYOffset,
  };

  const dynamicTextures: DynamicTextures = {
    "Enchanted Glint": glintTexture,
  };

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (regionId === bannerFlagRegionId) {
      setBannerPatterns((current) =>
        applyPatternSelection(current, selectedPatternId, tint)
      );
      return;
    }

    if (regionId === shieldPlateRegionId) {
      setShieldPatterns((current) =>
        applyPatternSelection(current, selectedPatternId, tint)
      );
      return;
    }
  };

  return (
    <div>
      <GeneratorUI.MediaHero video={null} thumbnail={thumbnail} />

      <div className="lg:flex gap-8">
        <div
          className="flex-1 min-w-0 mb-8 lg:mb-0"
          data-testid="generator-sidebar"
        >
          <div className="mb-8">
            <GeneratorUI.Instructions markdown={instructions} />
          </div>

          <div className="w-full bg-gray-100 p-8 space-y-4">
            <GeneratorUI.SelectControl
              label="Version"
              options={bannerShieldTextureVersions.map(
                ({ id: versionOptionId, label }) => ({
                  id: versionOptionId,
                  label,
                })
              )}
              value={versionId}
              onValueChange={setVersionId}
            />

            <GeneratorUI.SelectControl
              label="Template 1 Type"
              options={[
                { id: "Banner", label: "Banner" },
                { id: "Shield", label: "Shield" },
              ]}
              value={templateType}
              onValueChange={(value) => {
                if (value === "Banner" || value === "Shield") {
                  setTemplateType(value);
                }
              }}
            />

            {templateType === "Banner" && (
              <GeneratorUI.SelectControl
                label="Template 1 Banner Base"
                options={bannerBaseOptions.map(({ id: baseId, label }) => ({
                  id: baseId,
                  label,
                }))}
                value={bannerBaseId}
                onValueChange={setBannerBaseId}
              />
            )}

            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />

            {templateType === "Shield" && (
              <>
                <GeneratorUI.BooleanControl
                  label="Glint"
                  checked={glintEnabled}
                  onCheckedChange={setGlintEnabled}
                />
                <GeneratorUI.LoadedTextureControl
                  id="Enchanted Glint"
                  definitions={entityGlintTextureDefs}
                  choices={["1.20+", "Pre-1.20"]}
                  standardWidth={128}
                  standardHeight={128}
                  initialTextureId="Enchanted Glint"
                  onChange={setGlintTexture}
                />
                <GeneratorUI.RangeControl
                  label="Glint Opacity"
                  min={0}
                  max={255}
                  step={1}
                  value={glintOpacity}
                  onValueChange={setGlintOpacity}
                />
                <GeneratorUI.RangeControl
                  label="Glint X Offset"
                  min={0}
                  max={128}
                  step={1}
                  value={glintXOffset}
                  onValueChange={setGlintXOffset}
                />
                <GeneratorUI.RangeControl
                  label="Glint Y Offset"
                  min={0}
                  max={128}
                  step={1}
                  value={glintYOffset}
                  onValueChange={setGlintYOffset}
                />
              </>
            )}

            <TintSelector
              value={tint}
              label="Tint"
              swatchGroups={[dyeTintGroup]}
              onChange={setTint}
            />

            <PatternTexturePicker
              patterns={patternOptions}
              selectedPatternId={selectedPatternId}
              blend={tint}
              onSelectPattern={setSelectedPatternId}
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <GeneratorRenderer
            generator={bannerAndShieldGenerator}
            props={rendererProps}
            dynamicTextures={dynamicTextures}
            onRegionClick={onRegionClick}
          />
        </div>
      </div>

      <GeneratorUI.History history={history} />
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail,
  Component,
};
