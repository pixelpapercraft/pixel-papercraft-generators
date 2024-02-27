import { type Model } from "./model2";
import { type Generator } from "./generator2";

export type Position = [number, number];

export type Region = [number, number, number, number];

export type Flip =
  | { kind: "None" }
  | { kind: "Horizontal" }
  | { kind: "Vertical" };

export type Rotate =
  | { kind: "None" }
  | { kind: "Corner"; degrees: number }
  | { kind: "Center"; degrees: number };

export type Blend =
  | { kind: "None" }
  | { kind: "MultiplyHex"; hex: string }
  | { kind: "MultiplyRGB"; r: number; g: number; b: number };

// export type Generator = {
//   setModel: (model: Model) => void;

//   getModel: () => Model;

//   defineBooleanInput: (id: string, initial: boolean) => void;

//   getBooleanInputValue: (id: string) => boolean;

//   defineTextureInput(
//     id: string,
//     options: {
//       standardWidth: number;
//       standardHeight: number;
//       choices: string[];
//     }
//   ): void;

//   drawImage: (id: string, position: Position) => void;

//   drawTexture: (
//     id: string,
//     source: Region,
//     target: Region,
//     options?: {
//       flip?: Flip;
//       rotate?: Rotate;
//       blend?: Blend;
//       pixelate?: boolean;
//     }
//   ) => void;
// };

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

export type InstructionsDef = React.ReactNode;

export type ScriptDef = (generator: Generator) => void;

export type GeneratorDef = {
  id: string;
  name: string;
  history: HistoryDef;
  thumbnail?: ThumbnailDef;
  video?: VideoDef;
  instructions?: InstructionsDef;
  images: ImageDef[];
  textures: TextureDef[];
  script: ScriptDef;
};
