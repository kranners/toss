import type { Line, PolarVector, Vector } from "../types";

export function getVectorFromPolar({ rotation, radius }: PolarVector) {
  return {
    x: radius * Math.cos(rotation),
    y: radius * Math.sin(rotation),
  };
}

export function getRotationOfLine({ from, to }: Line) {
  return Math.atan2(to.y - from.y, to.x - from.x);
}

export function add(v1: Vector, v2: Vector) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}
