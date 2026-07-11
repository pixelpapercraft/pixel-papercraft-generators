"use client";

import type {
  GeneratorDef,
  HistoryDef,
  ImageDef,
  ScriptDef,
  TextureDef,
  ThumbnailDef,
} from "@genroot/builder/modules/generatorDef";
import { type Generator } from "@genroot/builder/modules/generator";
import {
  decodeSelectedBannerShieldPattern,
  encodeSelectedBannerShieldPattern,
  type SelectedBannerShieldPattern,
} from "./bannerTexturePicker/types";
import { clonePattern1To2, clonePattern2To1 } from "./clonePatterns";
import { PatternTexturePicker } from "./bannerTexturePicker/patternTexturePicker";
import { dyeTintGroup } from "../_common/tintSelector/tints";
import {
  defineGlintControlInputs,
  entityGlintTextureDefs,
  getGlintControls,
} from "../_common/plugins/glint";
import { clearVariablesMatching } from "../_common/clearVariablesMatching";
import { parseAtlas } from "../_common/textures/customTextureVersion";
import { currentBannerAndShieldTextureId } from "./constants";
import { drawBanner } from "./shapes/banner";
import { drawShield } from "./shapes/shield";
import {
  updateCustomBannerTextureAtlas,
  updateCustomShieldTextureAtlas,
} from "./textures/customBannerShieldTextureVersion";
import {
  bannerShieldTextureDefs,
  bannerShieldVersionIds,
  findPatternVersionId,
} from "./textures/textureVersions";

import titleImage from "./images/Title.png";
import foldsBannerImage from "./images/Folds-Banner.png";
import foldsShieldImage from "./images/Folds-Shield.png";
import tabsBannerImage from "./images/Tabs-Banner.png";
import tabsShieldImage from "./images/Tabs-Shield.png";
import thumbnailImage from "./thumbnail/v3-thumbnail-256.jpg";

const id = "minecraft-banner-and-shield";

const name = "Minecraft Banner and Shield";

const history: HistoryDef = [
  "May 2026 NinjolasNJM - Initial TypeScript version.",
  "May 2026 NinjolasNJM - Added pattern tint selector.",
];

const instructions = `
## How to use the Minecraft Banner and Shield Generator?

### Selecting and Adding Banner Patterns
* Click in the texture picker to select a banner pattern. 
* Using the Tint Selector, a dye color can be applied to the pattern.
* Click on the banner or shield to add the selected pattern.
* Click the erase button in the texture picker to clear the selected pattern. Clicking a banner or shield without a specified pattern will remove the last pattern placed on it.
* Vanilla Tweaks' HD Shields textures can be selected from the "Versions" dropdown menu. Custom textures can also be added from files.

* Up to two templates can be placed on a page, using the drop down "Number of Templates" menu.
* For each template, either a banner or a shield can be selected from the "Template # Type" dropdown menu.
* If a template is switched from a banner to a shield or vice versa, the patterns will be kept.
* The shield can have an enchantment glint effect applied to it, by clicking on the back of the shield on the page.
`;

const thumbnail: ThumbnailDef = {
  url: thumbnailImage.src,
};

const images: ImageDef[] = [
  { id: "Title", url: titleImage.src },
  { id: "Folds-Banner", url: foldsBannerImage.src },
  { id: "Folds-Shield", url: foldsShieldImage.src },
  { id: "Tabs-Banner", url: tabsBannerImage.src },
  { id: "Tabs-Shield", url: tabsShieldImage.src },
];

const textures: TextureDef[] = [
  ...bannerShieldTextureDefs,
  ...entityGlintTextureDefs,
];

function portSelectedPatternToVersion(
  pattern: SelectedBannerShieldPattern | null,
  versionId: string | null
): SelectedBannerShieldPattern | null {
  if (!pattern || !versionId || pattern.patternId === "") {
    return pattern;
  }

  const matchingVersionId = findPatternVersionId(versionId, pattern.patternId);
  if (matchingVersionId === pattern.versionId) {
    return pattern;
  }

  return matchingVersionId
    ? { ...pattern, versionId: matchingVersionId }
    : null;
}

function clearBannerShieldPatterns(generator: Generator): void {
  clearVariablesMatching(generator, /^PatternFace/);
}

const script: ScriptDef = (generator: Generator) => {
  generator.usePage("Page", { size: "A4_Large" });

  generator.defineSelectInput("Version", bannerShieldVersionIds);

  const versionId = generator.getSelectInputValue("Version");

  if (versionId === "custom") {
    generator.defineAtlasInput("custom-banner-patterns", {
      label: "Custom Banner Patterns",
      standardWidth: 64,
      standardHeight: 64,
      choices: [],
    });
    generator.defineAtlasInput("custom-shield-patterns", {
      label: "Custom Shield Patterns",
      standardWidth: 64,
      standardHeight: 64,
      choices: [],
    });

    const customBannerAtlas = parseAtlas(
      generator.getStringInputValue("custom-banner-patterns Frames")
    );
    const customBannerTexture = generator.getTexture("custom-banner-patterns");
    if (customBannerTexture && customBannerAtlas) {
      updateCustomBannerTextureAtlas(
        customBannerTexture.imageWithCanvas.image.src,
        customBannerAtlas
      );
    }

    const customShieldAtlas = parseAtlas(
      generator.getStringInputValue("custom-shield-patterns Frames")
    );
    const customShieldTexture = generator.getTexture("custom-shield-patterns");
    if (customShieldTexture && customShieldAtlas) {
      updateCustomShieldTextureAtlas(
        customShieldTexture.imageWithCanvas.image.src,
        customShieldAtlas
      );
    }
  }

  const currentPatternJson = generator.getStringInputValue(
    currentBannerAndShieldTextureId
  );
  const currentPattern = currentPatternJson
    ? decodeSelectedBannerShieldPattern(currentPatternJson)
    : null;
  const portedCurrentPattern = portSelectedPatternToVersion(
    currentPattern,
    versionId
  );
  if (currentPattern !== portedCurrentPattern) {
    generator.setStringInputValue(
      currentBannerAndShieldTextureId,
      portedCurrentPattern
        ? encodeSelectedBannerShieldPattern(portedCurrentPattern)
        : ""
    );
  }

  const resolvedCurrentPatternJson = generator.getStringInputValue(
    currentBannerAndShieldTextureId
  );
  const resolvedCurrentPattern = resolvedCurrentPatternJson
    ? decodeSelectedBannerShieldPattern(resolvedCurrentPatternJson)
    : null;

  generator.defineCustomStringInput(
    currentBannerAndShieldTextureId,
    (onChange) => {
      if (!versionId) {
        return null;
      }
      return (
        <PatternTexturePicker
          versionId={versionId}
          selectedPattern={resolvedCurrentPattern}
          tintChoiceGroups={[dyeTintGroup]}
          defaultTint="#F9FFFE"
          includeNoTint={false}
          onChange={(selectedPattern) => {
            onChange(encodeSelectedBannerShieldPattern(selectedPattern));
          }}
        />
      );
    }
  );

  generator.defineSelectInput("Number of Templates", ["1", "2"]);
  const numberOfTemplatesInput = generator.getSelectInputValue(
    "Number of Templates"
  );
  const numberOfTemplates = numberOfTemplatesInput
    ? parseInt(numberOfTemplatesInput, 10)
    : 1;

  generator.defineBooleanInput("Show Folds", true);
  const showFolds = generator.getBooleanInputValueWithDefault(
    "Show Folds",
    true
  );
  const glint = getGlintControls(generator);
  let hasShieldTemplate = false;

  for (let i = 1; i <= numberOfTemplates; i += 1) {
    const templateId = i.toString();
    const typeName = `Template ${templateId} Type`;

    generator.defineInputRowStart();
    generator.defineSelectInput(typeName, ["Banner", "Shield"]);
    const templateType = generator.getSelectInputValue(typeName);

    const ox = 171;
    const oy = 48 + 1200 * (i - 1);

    switch (templateType) {
      case "Shield":
        hasShieldTemplate = true;
        drawShield(generator, templateId, ox, oy, showFolds, glint);
        break;
      case "Banner":
      default:
        drawBanner(generator, templateId, ox, oy, showFolds);
        break;
    }
    generator.defineInputRowEnd();
  }

  if (hasShieldTemplate) {
    defineGlintControlInputs(generator);
  }

  generator.fillBackgroundColorWithWhite();
  generator.drawImage("Title", [0, 0]);

  generator.defineInputRowStart();
  generator.defineButtonInput(
    "Clone Pattern 1 to 2",
    () => {
      clonePattern1To2(generator, numberOfTemplates);
    },
    "Blue"
  );

  generator.defineButtonInput(
    "Clone Pattern 2 to 1",
    () => {
      clonePattern2To1(generator, numberOfTemplates);
    },
    "Blue"
  );
  generator.defineInputRowEnd();

  generator.defineInputRowStart();
  generator.defineButtonInput(
    "Clear Patterns",
    () => {
      clearBannerShieldPatterns(generator);
    },
    "Red"
  );

  generator.defineButtonInput(
    "Clear",
    () => {
      const currentTextureChoice = generator.getStringInputValue(
        currentBannerAndShieldTextureId
      );

      generator.clearAllVariables();

      if (currentTextureChoice) {
        generator.setStringInputValue(
          currentBannerAndShieldTextureId,
          currentTextureChoice
        );
      }
    },
    "Red"
  );
  generator.defineInputRowEnd();
};

export const generator: GeneratorDef = {
  id,
  name,
  history,
  thumbnail,
  video: null,
  instructions,
  images,
  textures,
  script,
};
