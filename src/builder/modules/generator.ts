import { type Generator } from "./types";
import { type Model } from "./model";
import * as Builder from "./builder";

export function makeGenerator(initialModel: Model): Generator {
  const state: { model: Model } = {
    model: initialModel,
  };

  const setModel: Generator["setModel"] = (model) => {
    state.model = model;
  };

  const getModel: Generator["getModel"] = () => {
    return state.model;
  };

  const drawImage: Generator["drawImage"] = (id, position): void => {
    state.model = Builder.drawImage(state.model, id, position);
  };

  const drawTexture: Generator["drawTexture"] = (id, source, target): void => {
    state.model = Builder.drawTexture(state.model, id, source, target, {
      flip: { kind: "None" },
      rotate: { kind: "None" },
      blend: { kind: "None" },
      pixelate: false,
    });
  };

  return {
    setModel,
    getModel,
    drawImage,
    drawTexture,
  };
}
