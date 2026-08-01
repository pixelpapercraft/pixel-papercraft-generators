"use client";

import React from "react";
import {
  GeneratorRenderer,
  GeneratorUI,
  type GeneratorDefV2,
  type Generator,
  type ImageDef,
  type InstructionsDef,
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
import titleImage from "./images/title-a4.png";

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const instructions: InstructionsDef = `
Skeleton generator — component-by-component rebuild in progress. No banner or shield content yet.
`;

const images: ImageDef[] = [{ id: "Title", url: titleImage.src }];

const textures: TextureDef[] = [...bannerShieldTextureDefs];

type BannerAndShieldProps = {
  showPlaceholderBorder: boolean;
  tint: string | null;
};

type TemplateType = "Banner" | "Shield";

const render = (ctx: RenderContext, props: BannerAndShieldProps): void => {
  ctx.usePage("Page");
  ctx.fillBackgroundColorWithWhite();

  ctx.drawText("Banner and Shield", [40, 60], 24);
  ctx.drawText("Skeleton page - no content yet", [40, 90], 12);

  if (props.showPlaceholderBorder) {
    ctx.drawRectangle([20, 20, 555, 802]);
  }

  // Temporary: proves the tint selector V2 port is wired end to end. Removed
  // once the pattern picker component lands and consumes the tint itself.
  if (props.tint) {
    ctx.fillRectangle([420, 40, 130, 130], props.tint);
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
  const [showPlaceholderBorder, setShowPlaceholderBorder] =
    React.useState(true);
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

  const textureVersion =
    findBannerShieldTextureVersion(versionId) ??
    bannerShieldTextureVersions[0]!;
  const patternOptions = makePatternOptions(textureVersion);
  const bannerBaseOptions = textureVersion.bases.bannerOptions;
  const [bannerBaseId, setBannerBaseId] = React.useState(
    bannerBaseOptions[0]?.id ?? ""
  );

  const rendererProps: BannerAndShieldProps = { showPlaceholderBorder, tint };

  return (
    <div className="lg:flex gap-8">
      <div
        className="flex-1 min-w-0 mb-8 lg:mb-0"
        data-testid="generator-sidebar"
      >
        <div className="w-full bg-gray-100 p-8 space-y-4">
          <GeneratorUI.Instructions markdown={instructions} />

          <GeneratorUI.BooleanControl
            label="Show Placeholder Border"
            checked={showPlaceholderBorder}
            onCheckedChange={setShowPlaceholderBorder}
          />

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

          {/* Temporary: exercises the tint selector V2 port in isolation. */}
          <TintSelector
            value={tint}
            label="Tint (V2 port test)"
            swatchGroups={[dyeTintGroup]}
            onChange={setTint}
          />

          {/* Temporary: exercises the pattern texture picker in isolation. */}
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
