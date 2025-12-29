import chroma from 'chroma-js'
import * as R from 'remeda'
import defaultTheme from 'tailwindcss/defaultTheme'
import { isDark } from './theme.utils'
import { makeTypeGuard } from './type.utils'

export type TailwindColorName = keyof typeof tailwindColors
export type TailwindShadeDictionary = (typeof tailwindColors)[TailwindColorName]
export type TailwindIndex = keyof TailwindShadeDictionary
export type TailwindColor = `${TailwindColorName}-${TailwindIndex}`
export type TailwindColorMeta = (typeof tailwindPalette)[number]

export const tailwindColors = R.omit(defaultTheme.colors(), ['inherit', 'current', 'transparent', 'black', 'white'])

export const tailwindPalette = R.flatMap(R.entries(tailwindColors), ([baseName, shades]) =>
	R.map(R.entries(shades), ([index, oklch]) => ({
		baseName,
		index,
		oklch,
		fullName: `${baseName}-${index}` satisfies TailwindColor,
		isDark: isDark(oklch),
	})),
)
export const isTailwindColor = makeTypeGuard(tailwindPalette.map((x) => x.fullName))

export const tailwindPaletteMap = new Map(tailwindPalette.map((x) => [x.fullName, x]))

export const getClosestTailwindColor = (input: chroma.ChromaInput) => {
	let [closest] = tailwindPalette
	let smallestDifference = Infinity
	for (const color of tailwindPalette) {
		const distance = chroma.deltaE(input, color.oklch)
		if (distance < smallestDifference) {
			closest = color
			smallestDifference = distance
		}
	}
	return closest
}
