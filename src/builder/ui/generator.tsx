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
import { Video } from "./video";
import { Thumbnail } from "./thumbnail";
import { Instructions } from "./instructions";
import { History } from "./history";

function VideoOrThumbnail({ generatorDef }: { generatorDef: GeneratorDef }) {
  if (generatorDef.video) {
    return <Video video={generatorDef.video} />;
  }

  if (generatorDef.thumbnail) {
    return <Thumbnail thumbnail={generatorDef.thumbnail} />;
  }

  return null;
}

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
      {generatorDef.video || generatorDef.thumbnail ? (
        <div className="mb-8">
          <VideoOrThumbnail generatorDef={generatorDef} />
        </div>
      ) : null}

      {generatorDef.instructions ? (
        <div className="mb-8">
          <Instructions markdown={generatorDef.instructions} />
        </div>
      ) : null}

      <Controls model={model} onChange={onControlsChange} />

      <Pages
        generatorDef={generatorDef}
        model={model}
        onChange={onPagesChange}
      />

      <History generatorDef={generatorDef} />
    </div>
  );
}
