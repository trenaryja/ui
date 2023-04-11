import tinycolor from 'tinycolor2'

export const mapRange = (x: number, xMin: number, xMax: number, yMin: number, yMax: number) =>
  ((x - xMin) * (yMax - yMin)) / (xMax - xMin) + yMin

export const getColorFromHue = (value: number, min: number, max: number) =>
  tinycolor({ h: mapRange(value, min, max, 0, 360), s: 1, l: 0.5 })

export const average = (min: number | undefined, max: number | undefined) => ((min ?? 0) + (max ?? 100)) / 2

export const sliderGradient = (colors: string[]) =>
  `linear-gradient(to right, ${colors.map((color) => color).join(', ')})`

export const hueColors = ['#f00', '#ff0', '#0f0', '#0ff', '#00f', '#f0f', '#f00']

export const getHue = (value: number | tinycolor.ColorInput | undefined) => {
  if (value === undefined) return undefined
  if (typeof value === 'number') return value
  return tinycolor(value).toHsl().h
}
