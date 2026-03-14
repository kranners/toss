import type { Position } from "../types";

export function getCanvas() {
  const canvas = document.querySelector("canvas");

  if (!canvas) {
    throw new Error("No canvas in the document!");
  }

  return canvas;
}

export function getContext() {
  const canvas = getCanvas();
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not get canvas context!");
  }

  return context;
}

export function withContext(draw: (context: CanvasRenderingContext2D) => void) {
  const context = getContext();
  context.beginPath();
  draw(context);
  context.closePath();
  context.stroke();
}

export function clearCanvas() {
  getContext().reset();
}

export const mouse: Position = {
  x: 0,
  y: 0,
};

export function listenToMousePosition() {
  const bounding = getCanvas().getBoundingClientRect();
  getCanvas().addEventListener("mousemove", (event) => {
    mouse.x = event.clientX - bounding.left;
    mouse.y = event.clientY - bounding.top;
  });
}
