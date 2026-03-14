import {
  clearCanvas,
  getCanvas,
  listenToMousePosition,
  mouse,
  withContext,
} from "./canvas";
import type { Circle, Line, Position } from "./types";

function drawCircle({ x, y, radius, rotation }: Circle) {
  withContext((ctx) => {
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + radius * Math.cos(rotation),
      y + radius * Math.sin(rotation),
    );
  });
}

function getLineFromAngleAndDistance({
  from,
  rotation,
  distance,
}: {
  from: Position;
  rotation: number;
  distance: number;
}) {
  return {
    from,
    to: {
      x: from.x + distance * Math.cos(rotation),
      y: from.y + distance * Math.sin(rotation),
    },
  };
}

const ARROW_CAP_ANGLE = Math.PI * 0.05;

function drawArrow({ from, to }: Line) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  withContext((ctx) => {
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);

    const leftCapAngle = angle + Math.PI * (1 - ARROW_CAP_ANGLE);
    ctx.lineTo(
      to.x + 15 * Math.cos(leftCapAngle),
      to.y + 15 * Math.sin(leftCapAngle),
    );

    ctx.moveTo(to.x, to.y);

    const rightCapAngle = angle + Math.PI * (1 + ARROW_CAP_ANGLE);
    ctx.lineTo(
      to.x + 15 * Math.cos(rightCapAngle),
      to.y + 15 * Math.sin(rightCapAngle),
    );
  });
}

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
    const launchAngleRadians = Math.atan2(
      event.clientY - rigidBody.translation().y,
      event.clientX - rigidBody.translation().x,
    );

    const launchForceX = FORCE_MULTIPLIER * Math.cos(launchAngleRadians);
    const launchForceY = FORCE_MULTIPLIER * Math.sin(launchAngleRadians);

    rigidBody.applyImpulse({ x: launchForceX, y: launchForceY }, true);
    rigidBody.applyTorqueImpulse(launchForceX * 2, true);
  });

  listenToMousePosition();

  setInterval(() => {
    world.step();

    clearCanvas();

    const arrowAngle = Math.atan2(
      mouse.y - ARROW_FROM.y,
      mouse.x - ARROW_FROM.x,
    );
    drawArrow(
      getLineFromAngleAndDistance({
        from: ARROW_FROM,
        rotation: arrowAngle,
        distance: 150,
      }),
    );

    drawCircle({
      ...rigidBody.translation(),
      radius: INITIAL_SHAPE.radius,
      rotation: rigidBody.rotation(),
    });
  }, MILLIS_PER_SIXTIETH_SECOND);
}

main();
