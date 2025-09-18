import { ChromaColor } from '@/types'
import chroma from 'chroma-js'

export const sliderGradient = (colors: chroma.Color[]) =>
	`linear-gradient(to right, ${colors.map((color) => color.hex()).join(', ')})`

export const getThumbColor = (
	thumbColor: ChromaColor | undefined,
	scale: chroma.Scale<chroma.Color> | undefined,
	scaleValue: number | undefined,
	defaultColor?: chroma.Color,
) => {
	if (thumbColor !== undefined) return chroma(thumbColor)
	if (scaleValue === undefined) return defaultColor || chroma('white')
	if (scale === undefined) return chroma('white')
	return scale(scaleValue)
}
