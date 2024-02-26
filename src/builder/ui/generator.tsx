/* eslint-disable @next/next/no-img-element */

"use client";

import React from "react";
import { type GeneratorDef } from "@/builder/modules/types";
import {
  type Model,
  makeModel,
  addImage,
  addTexture,
} from "@/builder/modules/model";
import { loadResources } from "@/builder/modules/resourceLoader";
import { run } from "@/builder/modules/scriptRunner";
import { Inputs } from "./inputs";

export function Generator({ generatorDef }: { generatorDef: GeneratorDef }) {
  const [model, setModel] = React.useState<Model | null>(null);

  React.useEffect(() => {
    async function initialize() {
      const [imageTuples, textureTuples] = await loadResources(generatorDef);

      let model = makeModel();

      imageTuples.forEach((imageTuple) => {
        const [id, image] = imageTuple;
        model = addImage(model, id, image);
      });

      textureTuples.forEach((textureTuple) => {
        const [id, texture] = textureTuple;
        model = addTexture(model, id, texture);
      });

      const newModel = await run(generatorDef, model);

      setModel(newModel);
    }

    initialize();
  }, [generatorDef]);

  if (!model) {
    return <div>Loading...</div>;
  }

  const dataUrl =
    model && model.currentPage
      ? model.currentPage.canvasWithContext.canvas.toDataURL("png")
      : null;

  // console.log(JSON.stringify(model, null, 2));

  return (
    <div className="p-8">
      <h1>Generator</h1>
      <Inputs model={model} onChange={setModel} />
      {dataUrl && <img src={dataUrl} alt="Generated image" />}
    </div>
  );
}
