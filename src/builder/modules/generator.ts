import { type Model } from "./model";
import * as Builder from "./builder";

export type Position = [number, number];

export type Generator = {
  setModel: (model: Model) => void;
  getModel: () => Model;
  drawImage: (id: string, position: Position) => void;
};

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

  return {
    setModel,
    getModel,
    drawImage,
  };
}
