/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import { type GeneratorDef } from "@/builder/modules/generatorDef";
import { Model } from "@/builder/modules/model";
import { Values } from "@/builder/modules/modelValues";
import { loadResources } from "@/builder/modules/resourceLoader";
import { runScript } from "@/builder/modules/scriptRunner";
import { Controls } from "./controls/controls";
import { Pages } from "./pages/pages";

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
    <div className="p-8">
      <Controls model={model} onChange={onControlsChange} />
      <Pages
        generatorDef={generatorDef}
        model={model}
        onChange={onPagesChange}
      />
    </div>
  );
}
