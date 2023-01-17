export const mapRange = (x: number, xMin: number, xMax: number, yMin: number, yMax: number) =>
  ((x - xMin) * (yMax - yMin)) / (xMax - xMin) + yMin
