import { clearCanvas, getCanvas, listenToMouseVector, mouse } from "./canvas";
import { drawCircle } from "./draw";
import {
  ball,
  BALL_RADIUS,
  INITIAL_BALL,
  renderGameElements,
  resetBall,
} from "./elements";
import { getDistanceOfLine, getVectorFromPolar } from "./math";
import type { State } from "./types";
import { renderUi } from "./ui";

const FORCE_MULTIPLIER = 1_000_000;
const MILLIS_PER_SIXTIETH_SECOND = 1_000 / 60;

export let state: State = "throwing";

async function main() {
  const rapier = await import("@dimforge/rapier2d");
  const world = new rapier.World({ x: 0.0, y: 98.1 });

  resetBall({ rapier, world });

  getCanvas().addEventListener("mousedown", (event) => {
    if (!ball.rigidBody || state !== "throwing") {
      return;
    }

    const launchRotationRadians = Math.atan2(
      event.clientY - ball.rigidBody.translation().y,
      event.clientX - ball.rigidBody.translation().x,
    );

    const distanceToMouse = Math.min(
      getDistanceOfLine({ from: INITIAL_BALL, to: mouse }),
      300,
    );

    const launch = getVectorFromPolar({
      rotation: launchRotationRadians,
      radius: (FORCE_MULTIPLIER * distanceToMouse) / 100,
    });

    ball.rigidBody.applyImpulse(launch, true);
    ball.rigidBody.applyTorqueImpulse(launch.x * 2, true);

    state = "falling";
  });

  listenToMouseVector();

  setInterval(() => {
    clearCanvas();
    renderUi();
    renderGameElements();

    if (state !== "falling" || !ball.rigidBody) {
      return;
    }

    world.step();

    if (ball.rigidBody.translation().y > 650) {
      resetBall({ rapier, world });
      state = "throwing";
    }
  }, MILLIS_PER_SIXTIETH_SECOND);
}

main();
