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

export function clearCanvas() {
  getContext().reset();
}
