import type { Vector } from "../types";

export function getCanvas() {
  const canvas = document.querySelector("canvas");

  if (!canvas) {
    throw new Error("No canvas in the document!");
  }

  return canvas;
}

export function getContext() {
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context!");
  }

  ctx.font = "8px sans-serif";
  return ctx;
}

export function withContext(draw: (context: CanvasRenderingContext2D) => void) {
  const ctx = getContext();
  ctx.beginPath();
  draw(ctx);
  ctx.closePath();
  ctx.stroke();
}

export function clearCanvas() {
  getContext().reset();
}

export const mouse: Vector = {
  x: 300,
  y: 300,
};

export function listenToMouseVector() {
  const bounding = getCanvas().getBoundingClientRect();
  getCanvas().addEventListener("mousemove", (event) => {
    mouse.x = event.clientX - bounding.left;
    mouse.y = event.clientY - bounding.top;
  });
}
