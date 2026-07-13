/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import { type GeneratorDef } from "@genroot/builder/modules/generatorDef";
import { Model } from "@genroot/builder/modules/model";
import { Values } from "@genroot/builder/modules/modelValues";
import { loadResources } from "@genroot/builder/modules/resourceLoader";
import { runScript } from "@genroot/builder/modules/scriptRunner";
import { Controls } from "./controls/controls";
import { Pages } from "./pages/pages";
import { MediaHero } from "./mediaHero";
import { Instructions } from "./instructions";
import { History } from "./history";

export function Generator({ generatorDef }: { generatorDef: GeneratorDef }) {
  const [model, setModel] = React.useState<Model | null>(null);

  React.useEffect(() => {
    async function initialize() {
      const [imageTuples, textureTuples] = await loadResources(generatorDef);

      const model = new Model(new Values());

      imageTuples.forEach(([id, image]) => {
        model.addImage(id, image);
      });

      textureTuples.forEach(([id, texture]) => {
        model.addTexture(id, texture);
      });

      const newModel = await runScript(generatorDef.script, model);

      setModel(newModel);
    }

    initialize();
  }, [generatorDef]);

  if (!model) {
    return <div>Loading...</div>;
  }

  const onControlsChange = (model: Model) => {
    runScript(generatorDef.script, model).then(setModel);
  };

  const onPagesChange = () => {
    runScript(generatorDef.script, model).then(setModel);
  };

  return (
    <div>
      <MediaHero
        video={generatorDef.video}
        thumbnail={generatorDef.thumbnail}
      />

      <div className="lg:flex gap-8">
        <div className="flex-1 min-w-0" data-testid="generator-sidebar">
          {generatorDef.instructions ? (
            <div className="mb-6">
              <Instructions markdown={generatorDef.instructions} />
            </div>
          ) : null}

          <Controls model={model} onChange={onControlsChange} />
        </div>

        <div className="flex-1 min-w-0">
          <Pages
            generatorDef={generatorDef}
            model={model}
            onChange={onPagesChange}
          />
        </div>
      </div>

      <History history={generatorDef.history} />
    </div>
  );
}
