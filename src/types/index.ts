export type Position = {
  x: number;
  y: number;
};

export type Line = {
  from: Position;
  to: Position;
};

export type Circle = Position & {
  rotation: number;
  radius: number;
};
