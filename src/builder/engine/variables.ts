export type NumberVariable = {
  kind: "Number";
  value: number;
};

export type StringVariable = {
  kind: "String";
  value: string;
};

export type BooleanVariable = {
  kind: "Boolean";
  value: boolean;
};

export type Variable = NumberVariable | StringVariable | BooleanVariable;
