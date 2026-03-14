import { clearCanvas, getCanvas, listenToMouseVector, mouse } from "./canvas";
import { drawArrow, drawCircle } from "./draw";
import { add, getRotationOfLine, getVectorFromPolar } from "./math";

const FORCE_MULTIPLIER = 1_000_000;
const MILLIS_PER_SIXTIETH_SECOND = 1_000 / 60;

const INITIAL_SHAPE = {
  x: 50,
  y: 50,
  radius: 50,
};

const ARROW_FROM = {
  x: 50,
  y: 300,
};

async function main() {
  const RAPIER = await import("@dimforge/rapier2d");
  const world = new RAPIER.World({ x: 0.0, y: 98.1 });

  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
    INITIAL_SHAPE.x,
    INITIAL_SHAPE.y,
  );

  const rigidBody = world.createRigidBody(rigidBodyDesc);

  const colliderDesc = RAPIER.ColliderDesc.cuboid(
    INITIAL_SHAPE.radius / 2,
    INITIAL_SHAPE.radius / 2,
  );

  world.createCollider(colliderDesc, rigidBody);

  getCanvas().addEventListener("mousedown", (event) => {
    const launchRotationRadians = Math.atan2(
      event.clientY - rigidBody.translation().y,
      event.clientX - rigidBody.translation().x,
    );

    const launchForceX = FORCE_MULTIPLIER * Math.cos(launchRotationRadians);
    const launchForceY = FORCE_MULTIPLIER * Math.sin(launchRotationRadians);

    rigidBody.applyImpulse({ x: launchForceX, y: launchForceY }, true);
    rigidBody.applyTorqueImpulse(launchForceX * 2, true);
  });

  listenToMouseVector();

  setInterval(() => {
    world.step();

    clearCanvas();

    const arrowRotation = getRotationOfLine({ from: ARROW_FROM, to: mouse });
    const arrowVector = getVectorFromPolar({
      rotation: arrowRotation,
      radius: 150,
    });
    drawArrow({
      from: ARROW_FROM,
      to: add(ARROW_FROM, arrowVector),
    });

    drawCircle({
      ...rigidBody.translation(),
      radius: INITIAL_SHAPE.radius,
      rotation: rigidBody.rotation(),
    });
  }, MILLIS_PER_SIXTIETH_SECOND);
}

main();
