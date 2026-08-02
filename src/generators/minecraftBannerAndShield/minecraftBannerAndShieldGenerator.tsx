"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
  type RegionClickHandler,
  type RenderContext,
  type TextureDef,
} from "@genroot/builder";
import { TintSelector } from "../_common/tintSelectorV2/tintSelector";
import { getFirstSwatchColor } from "../_common/tintSelectorV2/tintSelectorLogic";
import { dyeTintGroup } from "../_common/tintSelectorV2/tints";
import { PatternTexturePicker } from "../_common/patternTexturePicker/patternTexturePicker";
import { makePatternOptions } from "../_common/patternTexturePicker/patternTexturePickerLogic";
import {
  bannerShieldTextureDefs,
  bannerShieldTextureVersions,
  findBannerShieldTextureVersion,
} from "./textures/textureVersions";
import {
  bannerFlagFrontRegion,
  defaultBannerPatternId,
  defaultBannerPatternTint,
  drawBannerCrossbar,
  drawBannerFlag,
  drawBannerFlagGuides,
  drawBannerPattern,
  drawBannerPole,
} from "./shapes/banner";
import { drawShieldPlate } from "./shapes/shield";
import titleImage from "./images/title-a4.png";

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const instructions: InstructionsDef = `
Component-by-component rebuild in progress. The banner flag base, pole, and
crossbar are rendered with fold and tab guides, and clicking the flag
arms/stamps the selected pattern. The shield plate renders its base geometry
only so far, with no fold/tab guides, handle, or pattern stamping yet.
`;

const images: ImageDef[] = [{ id: "Title", url: titleImage.src }];

const textures: TextureDef[] = [...bannerShieldTextureDefs];

type SelectedBannerPattern = {
  patternId: string;
  blend: string | null;
};

const bannerFlagRegionId = "BannerFlag";

type BannerAndShieldProps = {
  bannerPatterns: SelectedBannerPattern[];
  versionId: string;
  templateType: TemplateType;
  bannerBaseId: string;
  showFolds: boolean;
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
    drawShieldPlate(ctx, props.versionId);
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
    React.useState<TemplateType>("Banner");
  const [showFolds, setShowFolds] = React.useState(true);
  const [bannerPatterns, setBannerPatterns] = React.useState<
    SelectedBannerPattern[]
  >([{ patternId: defaultBannerPatternId, blend: defaultBannerPatternTint }]);

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
    versionId,
    templateType,
    bannerBaseId,
    showFolds,
  };

  const onRegionClick: RegionClickHandler = ({ regionId }) => {
    if (regionId !== bannerFlagRegionId) {
      return;
    }

    setBannerPatterns((current) =>
      selectedPatternId === null
        ? // The stack's first entry is the always-present default base
          // layer (seeded above), not a user-placed pattern, so erase
          // leaves it in place rather than clearing the flag entirely.
          current.length > 1
          ? current.slice(0, -1)
          : current
        : current.concat([{ patternId: selectedPatternId, blend: tint }])
    );
  };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

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
          onRegionClick={onRegionClick}
        />
      </div>
    </div>
  );
}

export const generator: GeneratorDefV2 = {
  id,
  name,
  thumbnail: null,
  Component,
};
