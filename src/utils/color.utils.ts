import type { DaisyThemeColor, TailwindColor } from '@/types'
import { daisyThemes } from '@/types'
import chroma from 'chroma-js'
import * as R from 'remeda'
import defaultTheme from 'tailwindcss/defaultTheme'

export const addOpacityToOklch = (oklch: string | undefined, opacity: number) =>
	`${oklch?.split(')')[0]} / ${opacity / 100})`

export const isDark = (color: string) => {
	const c = chroma(color)
	if (!chroma.valid(c)) return false
	const contrastW = chroma.contrast(c, '#fff')
	const contrastB = chroma.contrast(c, '#000')
	return contrastW > contrastB
}

export const daisyThemeColors = R.keys(daisyThemes.dark)
	.filter((key) => key.startsWith('--color-'))
	.map((key) => key.replace('--color-', '')) as DaisyThemeColor[]

export const colors = R.omit(defaultTheme.colors(), ['inherit', 'current', 'transparent', 'black', 'white'])

export const palette = R.flatMap(R.entries(colors), ([baseName, shades]) =>
	R.map(R.entries(shades), ([index, oklch]) => ({
		baseName,
		index,
		oklch,
		fullName: `${baseName}-${index}` satisfies TailwindColor,
		isDark: isDark(oklch),
	})),
)

export const getClosestTailwindColor = (input: chroma.ChromaInput) => {
	let [closest] = palette
	let smallestDifference = Infinity
	for (const color of palette) {
		const distance = chroma.deltaE(input, color.oklch)
		if (distance < smallestDifference) {
			closest = color
			smallestDifference = distance
		}
	}
	return closest
}
