export type Position = {
  x: number;
  y: number;
};

export type Circle = Position & {
  rotation: number;
  radius: number;
};
