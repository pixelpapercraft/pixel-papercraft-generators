import { type Generator } from "./generator";

export type TextureDef = {
  id: string;
  url: string;
  standardWidth: number;
  standardHeight: number;
};

export type ImageDef = {
  id: string;
  url: string;
};

export type HistoryDef = string[];

export type ThumbnailDef = {
  url: string;
};

export type VideoDef = { url: string };

export type InstructionsDef = string;

export type ScriptDef = (generator: Generator) => void;

export type GeneratorDef = {
  id: string;
  name: string;
  history: HistoryDef;
  thumbnail: ThumbnailDef | null;
  video: VideoDef | null;
  instructions: InstructionsDef | null;
  images: ImageDef[];
  textures: TextureDef[];
  script: ScriptDef;
};
