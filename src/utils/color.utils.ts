import type { ColorFormat as ColordxColorFormat } from '@colordx/core'
import { colordx, extend, getFormat, oklchToRgbChannels } from '@colordx/core'
import a11y from '@colordx/core/plugins/a11y'
import lab from '@colordx/core/plugins/lab'
import { oklchToP3Channels } from '@colordx/core/plugins/p3'
import { oklchToRec2020Channels } from '@colordx/core/plugins/rec2020'
import * as R from 'remeda'
import defaultTheme from 'tailwindcss/defaultTheme'
import { makeTypeGuard } from './type.utils'

extend([a11y, lab])

export type ColorMixSpace = Extract<
	ColordxColorFormat,
	'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch' | 'rec2020' | 'xyz-d65' | 'xyz'
>

export const colorMix = (opts: { color1: string; color2: string; ratio: number; colorSpace?: ColorMixSpace }) =>
	`color-mix(in ${opts.colorSpace ?? 'oklab'}, ${opts.color1} ${R.clamp(opts.ratio, { min: 0, max: 100 })}%, ${opts.color2})`

/** Interpolate between an array of color stops at position t (0–1). */
export const interpolateColors = (t: number, stops: string[], colorSpace?: ColorMixSpace) => {
	if (stops.length === 1) return stops[0]
	const clamped = R.clamp(t, { min: 0, max: 1 })
	const segCount = stops.length - 1
	const seg = Math.min(Math.floor(clamped * segCount), segCount - 1)
	const localT = clamped * segCount - seg
	const ratio = Math.round((1 - localT) * 100)
	return colorMix({ color1: stops[seg], color2: stops[seg + 1], ratio, colorSpace: colorSpace ?? 'oklab' })
}

/** Integer luminance from RGB (BT.601 approximation: 0.21R + 0.72G + 0.07B) */
export const rgbToLuma = (r: number, g: number, b: number) => (54 * r + 184 * g + 18 * b) >> 8

const pct = (n: number | string) => (typeof n === 'number' ? `${parseFloat((n * 100).toFixed(1))}%` : n)
const fmt = (n: number | string) => (typeof n === 'number' ? parseFloat(n.toFixed(3)) : n)

/** Build an `oklch()` CSS string. Any component can be a CSS expression like `'var(--l)'`. */
export const buildOklch = (l: number | string, chroma: number | string, hue: number | string) =>
	`oklch(${pct(l)} ${fmt(chroma)} ${fmt(hue)})`

/** Build an `oklab()` CSS string. Any component can be a CSS expression like `'var(--l)'`. */
export const buildOklab = (l: number | string, a: number | string, b: number | string) =>
	`oklab(${pct(l)} ${fmt(a)} ${fmt(b)})`

const roundOklch = (s: string) => {
	const m = s.match(/oklch\(([\d+\-.e]+)\s+([\d+\-.e]+)\s+([\d+\-.e]+|none)\)/)
	return m ? buildOklch(+m[1], +m[2], m[3] === 'none' ? 0 : +m[3]) : s
}

const roundOklab = (s: string) => {
	const m = s.match(/oklab\(([\d+\-.e]+)\s+([\d+\-.e]+)\s+([\d+\-.e]+)\)/)
	return m ? buildOklab(+m[1], +m[2], +m[3]) : s
}

export const GAMUTS = ['srgb', 'p3', 'rec2020'] as const
export type Gamut = (typeof GAMUTS)[number]

const inSrgb = (l: number, c: number, h: number) => oklchToRgbChannels(l, c, h).every((ch) => ch >= 0 && ch <= 1)
const inP3 = (l: number, c: number, h: number) => oklchToP3Channels(l, c, h).every((ch) => ch >= 0 && ch <= 1)
const inRec2020 = (l: number, c: number, h: number) => oklchToRec2020Channels(l, c, h).every((ch) => ch >= 0 && ch <= 1)

/** Binary-search for the maximum in-gamut chroma at a given lightness and hue. ~20 iterations → precision of ~0.0001. */
export const getMaxChroma = (l: number, h: number, gamut: Gamut = 'p3'): number => {
	if (l <= 0) return 0
	const inGamut = gamut === 'p3' ? inP3 : gamut === 'rec2020' ? inRec2020 : inSrgb
	if (!inGamut(l, 0, h)) return 0
	let lo = 0
	let hi = 0.65 // rec2020 primaries can exceed 0.5; 0.65 covers all three gamuts

	while (hi - lo > 0.0001) {
		const mid = (lo + hi) / 2
		if (inGamut(l, mid, h)) lo = mid
		else hi = mid
	}

	return lo
}

/** Ternary-search for the (L, C) cusp of the given hue — the lightness at which chroma is maximized within the gamut. ~23 iterations → precision of ~0.0001. */
export const getOklchCusp = (hDeg: number, gamut: Gamut = 'p3'): [lCusp: number, cCusp: number] => {
	let lo = 0
	let hi = 1

	while (hi - lo > 0.0001) {
		const m1 = lo + (hi - lo) / 3
		const m2 = hi - (hi - lo) / 3
		if (getMaxChroma(m1, hDeg, gamut) < getMaxChroma(m2, hDeg, gamut)) lo = m1
		else hi = m2
	}

	const lCusp = (lo + hi) / 2
	return [lCusp, getMaxChroma(lCusp, hDeg, gamut)]
}

export const isDark = (color: string) => {
	if (!getFormat(color)) return false
	const c = colordx(color)
	return c.contrast('#fff') > c.contrast('#000')
}

export const tailwindColors = R.omit(defaultTheme.colors(), ['inherit', 'current', 'transparent', 'black', 'white'])

export type TailwindColorName = keyof typeof tailwindColors
export type TailwindShadeDictionary = (typeof tailwindColors)[TailwindColorName]
export type TailwindShade = keyof TailwindShadeDictionary
export type TailwindColor = `${TailwindColorName}-${TailwindShade}`
export type TailwindColorMeta = (typeof tailwindPalette)[number]

const tailwindNeutralColorNames = new Set<TailwindColorName>([
	'gray',
	'mauve',
	'mist',
	'neutral',
	'olive',
	'slate',
	'stone',
	'taupe',
	'zinc',
])

export const tailwindPalette = R.pipe(
	R.entries(tailwindColors),
	R.flatMap(([baseName, shades]) =>
		R.map(R.entries(shades), ([shade, oklch]) => ({
			baseName,
			shade,
			oklch,
			fullName: `${baseName}-${shade}` satisfies TailwindColor,
			isDark: isDark(oklch),
			isNeutral: tailwindNeutralColorNames.has(baseName),
		})),
	),
	R.sortBy((x) => x.isNeutral),
)

export const isTailwindColor = makeTypeGuard(tailwindPalette.map((x) => x.fullName))
export const tailwindPaletteMap = R.mapToObj(tailwindPalette, (x) => [x.fullName, x])

export const getClosestTailwindColor = (input: string) => {
	let [closest] = tailwindPalette
	let smallestDifference = Infinity

	for (const color of tailwindPalette) {
		const distance = colordx(input).delta(color.oklch)

		if (distance < smallestDifference) {
			closest = color
			smallestDifference = distance
		}
	}

	return closest
}

export const COLOR_FORMATS = ['oklch', 'oklab', 'hex', 'rgb', 'tailwind'] as const
export type ColorFormat = (typeof COLOR_FORMATS)[number]

const COLOR_CONVERTERS: Record<ColorFormat, (c: ReturnType<typeof colordx>) => string> = {
	hex: (c) => c.toHex(),
	oklab: (c) => roundOklab(c.toOklabString()),
	oklch: (c) => roundOklch(c.toOklchString()),
	rgb: (c) => c.toRgbString(),
	tailwind: (c) => getClosestTailwindColor(c.toOklchString()).fullName,
}

export const toColorFormat = (color: string, format: ColorFormat) => COLOR_CONVERTERS[format](colordx(color))
