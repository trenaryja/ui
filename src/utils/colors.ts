import type { DaisyThemeColor, TailwindBreakpointName, TailwindColor, TailwindColorName, TailwindIndex } from '@/types'
import { daisyThemes } from '@/types'
import chroma from 'chroma-js'
import * as R from 'remeda'
import defaultTheme from 'tailwindcss/defaultTheme'

export const daisyThemeColors = R.keys(daisyThemes.dark)
	.filter((key) => key.startsWith('--color-'))
	.map((key) => key.replace('--color-', '')) as DaisyThemeColor[]

export const breakpoints = R.pipe(
	defaultTheme.screens,
	R.entries(),
	R.reduce(
		(result, [key, value]) => {
			result[key] = parseInt(value) * 16
			return result
		},
		{} as Record<TailwindBreakpointName, number>,
	),
)

export const colors = R.omit(defaultTheme.colors(), ['inherit', 'current', 'transparent', 'black', 'white'])

export const palette = R.pipe(
	colors,
	R.entries(),
	R.map(([name, shades]) => ({
		name: name satisfies TailwindColorName,
		shades: R.pipe(
			shades,
			R.entries(),
			R.map(([index, oklch]) => ({
				oklch,
				index: index satisfies TailwindIndex,
				hex: chroma(oklch).hex(),
				fullName: `${name}-${index}` satisfies TailwindColor,
				isDark: chroma.contrast(oklch ?? '', 'white') > chroma.contrast(oklch ?? '', 'black'),
			})),
		),
	})),
)

export const flatPalette = palette.flatMap((color) => color.shades.map((shade) => ({ baseName: color.name, ...shade })))

export const getTailwindOklch = (color: 'random' | TailwindColor, index?: TailwindIndex): string | undefined => {
	if (color === 'random') {
		const randomColor = flatPalette[Math.floor(Math.random() * flatPalette.length)]!
		if (index === undefined) return randomColor.oklch
		return getTailwindOklch(`${randomColor.baseName}-${index}`)
	}

	const [name, i] = color.split('-') as [TailwindColorName, TailwindIndex]
	return colors[name][i]
}

export const addOpacityToOklch = (oklch: string | undefined, opacity: number) =>
	`${oklch?.split(')')[0]} / ${opacity / 100})`
