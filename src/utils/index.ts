// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Nothing {}

export type AnyOther<T> = T & Nothing

export const mapRange = (x: number, xMin: number, xMax: number, yMin: number, yMax: number) =>
  ((x - xMin) * (yMax - yMin)) / (xMax - xMin) + yMin
