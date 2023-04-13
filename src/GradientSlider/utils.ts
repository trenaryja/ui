export const sliderGradient = (colors: string[]) =>
  `linear-gradient(to right, ${colors.map((color) => color).join(', ')})`
