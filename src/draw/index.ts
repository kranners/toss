import { withContext } from "../canvas";
import { add, getRotationOfLine, getVectorFromPolar } from "../math";
import type { Circle, Line } from "../types";

export function drawCircle({ x, y, radius, rotation }: Circle) {
  withContext((ctx) => {
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + radius * Math.cos(rotation),
      y + radius * Math.sin(rotation),
    );
  });
}

export function drawLine({ from, to }: Line) {
  withContext((ctx) => {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
  });
}

const ARROW_CAP_ANGLE = Math.PI * 0.05;

export function drawArrow({ from, to: head }: Line) {
  const angle = getRotationOfLine({ from, to: head });
  withContext((ctx) => {
    drawLine({ from, to: head });

    const leftCapRotation = angle + Math.PI * (1 - ARROW_CAP_ANGLE);
    const leftCapVector = getVectorFromPolar({
      rotation: leftCapRotation,
      radius: 15,
    });
    drawLine({ from: head, to: add(head, leftCapVector) });

    ctx.moveTo(head.x, head.y);
    const rightCapRotation = angle + Math.PI * (1 + ARROW_CAP_ANGLE);
    const rightCapVector = getVectorFromPolar({
      rotation: rightCapRotation,
      radius: 15,
    });
    drawLine({ from: head, to: add(head, rightCapVector) });
  });
}
