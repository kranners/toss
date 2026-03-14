import { clearCanvas, getCanvas, getContext } from "./canvas";
import type { Circle } from "./types";

function drawCircle({ x, y, radius, rotation }: Circle) {
  const context = getContext();

  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.moveTo(x, y);
  context.lineTo(
    x + radius * Math.cos(rotation),
    y + radius * Math.sin(rotation),
  );
  context.closePath();
  context.stroke();
}

const FORCE_MULTIPLIER = 1_000_000;
const MILLIS_PER_SIXTIETH_SECOND = 1_000 / 60;

const INITIAL_SHAPE = {
  x: 50,
  y: 50,
  radius: 50,
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

  getCanvas().onpointerdown = (event: PointerEvent) => {
    const launchAngleRadians = Math.atan2(
      event.clientY - rigidBody.translation().y,
      event.clientX - rigidBody.translation().x,
    );

    const launchForceX = FORCE_MULTIPLIER * Math.cos(launchAngleRadians);
    const launchForceY = FORCE_MULTIPLIER * Math.sin(launchAngleRadians);

    rigidBody.applyImpulse({ x: launchForceX, y: launchForceY }, true);
    rigidBody.applyTorqueImpulse(launchForceX * 2, true);
  };

  setInterval(() => {
    world.step();

    clearCanvas();

    drawCircle({
      ...rigidBody.translation(),
      radius: INITIAL_SHAPE.radius,
      rotation: rigidBody.rotation(),
    });
  }, MILLIS_PER_SIXTIETH_SECOND);
}

main();
