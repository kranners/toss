export type Vector = {
  x: number;
  y: number;
};

export type PolarVector = {
  rotation: number;
  radius: number;
};

export type Line = {
  from: Vector;
  to: Vector;
};

export type Circle = Vector & PolarVector;

type State = "throwing" | "falling";
