import type { RigidBody, World } from "@dimforge/rapier2d";
import { drawCircle } from "../draw";

export const BALL_RADIUS = 50;

type Rapier = Awaited<typeof import("@dimforge/rapier2d")>;

type Ball = {
  rigidBody?: RigidBody;
};

export const ball: Ball = {
  rigidBody: undefined,
};

export const INITIAL_BALL = {
  x: 50,
  y: 300,
};

export function resetBall({ rapier, world }: { rapier: Rapier; world: World }) {
  if (ball.rigidBody) {
    world.removeRigidBody(ball.rigidBody);
  }

  const rigidBodyDesc = rapier.RigidBodyDesc.dynamic().setTranslation(
    INITIAL_BALL.x,
    INITIAL_BALL.y,
  );

  const rigidBody = world.createRigidBody(rigidBodyDesc);

  const colliderDesc = rapier.ColliderDesc.ball(BALL_RADIUS);

  ball.rigidBody = rigidBody;
  world.createCollider(colliderDesc, rigidBody);
}

export function renderGameElements() {
  if (!ball.rigidBody) {
    return;
  }

  drawCircle({
    ...ball.rigidBody.translation(),
    radius: BALL_RADIUS,
    rotation: ball.rigidBody.rotation(),
  });
}
