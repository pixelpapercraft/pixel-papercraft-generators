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
showing where they glue together; a shield starts bare with no banner
attached, matching the real game — enable "Shield Pattern" to attach a
banner, which arms clicking the plate to stamp the selected pattern onto
the plate only (the handle and lining are never patterned, matching real
Minecraft shields). The Shield can also be given an enchanted glint
overlay.
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

const template1RegionId = "Template1";
const template2RegionId = "Template2";

// The page is split into a top half (Template 1, yOffset 0) and a bottom
// half (Template 2, yOffset halfPageHeight) — half of the A4 page's 842px
// height. Region ids and pattern stacks are keyed by slot, not content type,
// so a slot keeps its own identity/state independent of which type
// currently occupies it and independent of the other slot even when both
// hold the same type — matching pr-35-head's own `templateId`-keyed
// convention (`makePatternFaceId`/`makeTemplateBaseInputId`), just applied
// to a top/bottom split instead of its own ever-growing stacked page.
const halfPageHeight = 421;

type BannerAndShieldProps = {
  template1Type: TemplateType;
  template2Type: TemplateType;
  template1Patterns: SelectedPattern[];
  template2Patterns: SelectedPattern[];
  versionId: string;
  bannerBaseId1: string;
  bannerBaseId2: string;
  shieldHasBanner1: boolean;
  shieldHasBanner2: boolean;
  showFolds: boolean;
  glintEnabled: boolean;
  glintOpacity: number;
  glintXOffset: number;
  glintYOffset: number;
};

type TemplateType = "None" | "Banner" | "Shield";

// "No Pattern" first and default, matching real Minecraft: a shield starts
// bare, and attaching a banner is a deliberate act, not the default state.
const shieldPatternOptions = [
  { id: "None", label: "No Pattern" },
  { id: "Banner", label: "Banner" },
];

function renderTemplate(
  ctx: RenderContext,
  {
    type,
    yOffset,
    versionId,
    bannerBaseId,
    shieldHasBanner,
    patterns,
    showFolds,
    glintPlugin,
    regionId,
  }: {
    type: TemplateType;
    yOffset: number;
    versionId: string;
    bannerBaseId: string;
    shieldHasBanner: boolean;
    patterns: SelectedPattern[];
    showFolds: boolean;
    glintPlugin: TexturePlugin | undefined;
    regionId: string;
  }
): void {
  if (type === "Banner") {
    drawBannerFlag(ctx, versionId, bannerBaseId, yOffset);
    patterns.forEach(({ patternId, blend }) => {
      drawBannerPattern(ctx, versionId, patternId, blend, yOffset);
    });
    drawBannerFlagGuides(ctx, showFolds, yOffset);
    drawBannerPole(ctx, versionId, bannerBaseId, showFolds, yOffset);
    drawBannerCrossbar(ctx, versionId, bannerBaseId, showFolds, yOffset);
    ctx.defineRegion(bannerFlagFrontRegion(yOffset), regionId);
  } else if (type === "Shield") {
    // A shield is either genuinely bare (no banner attached at all — real
    // Minecraft has no in-between state) or has a banner, which always
    // carries at least its own base color. `shieldHasBanner` picks which of
    // the two base textures to draw and gates the pattern layers/clickable
    // region on top of it; the stamped pattern stack itself stays in state
    // either way, so toggling back doesn't lose it.
    const version = findBannerShieldTextureVersion(versionId);
    const shieldBaseId = shieldHasBanner
      ? version?.bases.shieldBase?.id
      : version?.bases.shieldBaseNoPattern?.id;
    if (!shieldBaseId) {
      return;
    }

    drawShieldPlate(ctx, versionId, shieldBaseId, yOffset, glintPlugin);
    if (shieldHasBanner) {
      patterns.forEach(({ patternId, blend }) => {
        drawShieldPattern(
          ctx,
          versionId,
          patternId,
          blend,
          yOffset,
          glintPlugin
        );
      });
    }
    drawShieldHandle(ctx, versionId, shieldBaseId, yOffset, glintPlugin);
    drawShieldHandleInnerLining(
      ctx,
      versionId,
      shieldBaseId,
      yOffset,
      glintPlugin
    );
    drawShieldPlateGuides(ctx, showFolds, yOffset);
    drawShieldHandleGuides(ctx, showFolds, yOffset);
    drawShieldHandleInnerLiningGuides(ctx, showFolds, yOffset);
    drawShieldHandleJoinMarker(
      ctx,
      shieldHandleJoinImageId,
      shieldHandleJoinImageDimensions,
      yOffset
    );
    if (shieldHasBanner) {
      ctx.defineRegion(shieldPlateFrontRegion(yOffset), regionId);
    }
  }
}

const render = (ctx: RenderContext, props: BannerAndShieldProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  // Glint is Shield-only — real Minecraft banners can't be enchanted. Global
  // across both slots (this slice's scope), so built once and handed to
  // whichever slot(s) are Shield.
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

  renderTemplate(ctx, {
    type: props.template1Type,
    yOffset: 0,
    versionId: props.versionId,
    bannerBaseId: props.bannerBaseId1,
    shieldHasBanner: props.shieldHasBanner1,
    patterns: props.template1Patterns,
    showFolds: props.showFolds,
    glintPlugin,
    regionId: template1RegionId,
  });

  renderTemplate(ctx, {
    type: props.template2Type,
    yOffset: halfPageHeight,
    versionId: props.versionId,
    bannerBaseId: props.bannerBaseId2,
    shieldHasBanner: props.shieldHasBanner2,
    patterns: props.template2Patterns,
    showFolds: props.showFolds,
    glintPlugin,
    regionId: template2RegionId,
  });

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
  const [template1Type, setTemplate1Type] =
    React.useState<TemplateType>("Banner");
  const [template2Type, setTemplate2Type] =
    React.useState<TemplateType>("Shield");
  const [showFolds, setShowFolds] = React.useState(true);
  const [template1Patterns, setTemplate1Patterns] = React.useState<
    SelectedPattern[]
  >(defaultPatternStack());
  const [template2Patterns, setTemplate2Patterns] = React.useState<
    SelectedPattern[]
  >(defaultPatternStack());
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
  const [bannerBaseId1, setBannerBaseId1] = React.useState(
    bannerBaseOptions[0]?.id ?? ""
  );
  const [bannerBaseId2, setBannerBaseId2] = React.useState(
    bannerBaseOptions[0]?.id ?? ""
  );
  // Defaults to bare (no banner attached) — matching real Minecraft, where
  // a shield starts undecorated and a banner is a deliberate act, not the
  // default state.
  const [shieldHasBanner1, setShieldHasBanner1] = React.useState(false);
  const [shieldHasBanner2, setShieldHasBanner2] = React.useState(false);

  const rendererProps: BannerAndShieldProps = {
    template1Type,
    template2Type,
    template1Patterns,
    template2Patterns,
    versionId,
    bannerBaseId1,
    bannerBaseId2,
    shieldHasBanner1,
    shieldHasBanner2,
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
    if (regionId === template1RegionId) {
      setTemplate1Patterns((current) =>
        applyPatternSelection(current, selectedPatternId, tint)
      );
      return;
    }

    if (regionId === template2RegionId) {
      setTemplate2Patterns((current) =>
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
              label="Texture Version"
              options={bannerShieldTextureVersions.map(
                ({ id: versionOptionId, label }) => ({
                  id: versionOptionId,
                  label,
                })
              )}
              value={versionId}
              onValueChange={setVersionId}
            />

            <PatternTexturePicker
              patterns={patternOptions}
              selectedPatternId={selectedPatternId}
              blend={tint}
              onSelectPattern={setSelectedPatternId}
            />

            <TintSelector
              value={tint}
              label="Tint"
              swatchGroups={[dyeTintGroup]}
              onChange={setTint}
            />

            <div className="flex gap-4">
              <GeneratorUI.SelectControl
                label="Template 1 Type"
                options={[
                  { id: "None", label: "None" },
                  { id: "Banner", label: "Banner" },
                  { id: "Shield", label: "Shield" },
                ]}
                value={template1Type}
                onValueChange={(value) => {
                  if (
                    value === "None" ||
                    value === "Banner" ||
                    value === "Shield"
                  ) {
                    setTemplate1Type(value);
                  }
                }}
              />

              {template1Type === "Banner" && (
                <GeneratorUI.SelectControl
                  label="Template 1 Banner Base"
                  options={bannerBaseOptions.map(({ id: baseId, label }) => ({
                    id: baseId,
                    label,
                  }))}
                  value={bannerBaseId1}
                  onValueChange={setBannerBaseId1}
                />
              )}

              {template1Type === "Shield" && (
                <GeneratorUI.SelectControl
                  label="Template 1 Shield Pattern"
                  options={shieldPatternOptions}
                  value={shieldHasBanner1 ? "Banner" : "None"}
                  onValueChange={(value) =>
                    setShieldHasBanner1(value === "Banner")
                  }
                />
              )}
            </div>

            <div className="flex gap-4">
              <GeneratorUI.SelectControl
                label="Template 2 Type"
                options={[
                  { id: "None", label: "None" },
                  { id: "Banner", label: "Banner" },
                  { id: "Shield", label: "Shield" },
                ]}
                value={template2Type}
                onValueChange={(value) => {
                  if (
                    value === "None" ||
                    value === "Banner" ||
                    value === "Shield"
                  ) {
                    setTemplate2Type(value);
                  }
                }}
              />

              {template2Type === "Banner" && (
                <GeneratorUI.SelectControl
                  label="Template 2 Banner Base"
                  options={bannerBaseOptions.map(({ id: baseId, label }) => ({
                    id: baseId,
                    label,
                  }))}
                  value={bannerBaseId2}
                  onValueChange={setBannerBaseId2}
                />
              )}

              {template2Type === "Shield" && (
                <GeneratorUI.SelectControl
                  label="Template 2 Shield Pattern"
                  options={shieldPatternOptions}
                  value={shieldHasBanner2 ? "Banner" : "None"}
                  onValueChange={(value) =>
                    setShieldHasBanner2(value === "Banner")
                  }
                />
              )}
            </div>

            <GeneratorUI.BooleanControl
              label="Show Folds"
              checked={showFolds}
              onCheckedChange={setShowFolds}
            />

            {(template1Type === "Shield" || template2Type === "Shield") && (
              <>
                <GeneratorUI.BooleanControl
                  label="Glint"
                  checked={glintEnabled}
                  onCheckedChange={setGlintEnabled}
                />
                {glintEnabled && (
                  <>
                    <GeneratorUI.LoadedTextureControl
                      id="Enchanted Glint"
                      definitions={entityGlintTextureDefs}
                      choices={["1.20+", "Pre-1.20"]}
                      standardWidth={128}
                      standardHeight={128}
                      initialTextureId="Enchanted Glint"
                      onChange={setGlintTexture}
                    />
                    <div className="flex gap-4">
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
                    </div>
                  </>
                )}
              </>
            )}
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
