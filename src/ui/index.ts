import { mouse } from "../canvas";
import { drawArrow } from "../draw";
import {
  getRotationOfLine,
  getDistanceOfLine,
  getVectorFromPolar,
  add,
} from "../math";

const ARROW_FROM = {
  x: 50,
  y: 300,
};

export function renderUi() {
  const arrowRotation = getRotationOfLine({ from: ARROW_FROM, to: mouse });
  const arrowRadius = Math.min(
    getDistanceOfLine({ from: ARROW_FROM, to: mouse }),
    300,
  );
  const arrowVector = getVectorFromPolar({
    rotation: arrowRotation,
    radius: arrowRadius,
  });
  drawArrow({
    from: ARROW_FROM,
    to: add(ARROW_FROM, arrowVector),
  });
}
